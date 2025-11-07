import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import axios from "axios";
import { saveDraft, loadDraft, isDraftAvailable, clearDraft } from "../utils/draftStorage.js";

function CreatePost() {
    const { state, dispatch } = useContext(GlobalContext);
    // Local state for post content
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [characterCount, setCharacterCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showCharacterWarning, setShowCharacterWarning] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);

    const showWarning = characterCount >= 300 && characterCount < 450;
    const showDangerWarning = characterCount >= 450;

    // When content changed, show the count. 
    useEffect(() => {
        setCharacterCount(content.length);
        setIsDirty(true);
    }, [content]);

    // Auto-save draft every 2 seconds if dirty
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isDirty && content.trim() !== "") {
                const newPost = {
                    userId: state.users[0]?.id || 1, // Get the first user's ID
                    content: content.trim(),
                    likes: 0,
                    comments: [],
                    timestamp: new Date().toISOString()
                };
                saveDraft(newPost);
                setLastSaved(new Date());
                setIsDirty(false);
            }
            // Clean timeout
            return () => clearTimeout(timer);
        }, 2000);

        return () => clearTimeout(timer);
    }, [content, isDirty]);

    useEffect(() => {
        // Load draft on component mount
        if (isDraftAvailable()) {
            setShowDraftPrompt(true);
        }
    }, []);

    const handleDiscardDraft = () => {
        clearDraft();
        setShowDraftPrompt(false);
        setContent("");
        setLastSaved(null);
        setIsDirty(false);
    }

    const handleLoadDraft = () => {
        const draft = loadDraft();
        if (draft) {
            setContent(draft.content || "");
            setShowDraftPrompt(false);
            setIsDirty(false);
        }
    }

    // Add Validations
    const validateForm = () => {
        // Validate content length
        if (content.length < 5 || content.length > 500) {
            return { isValid: false, error: "Content must be between 5 and 500 characters." };
        }
        setShowCharacterWarning(false);
        return { isValid: true };
    }

    // Remove error and success messages
    const removeErrors = () => {
        setError(null);
        setSuccessMessage(null);
    }

    const resetForm = () => {
        setContent("");
        setTitle("");
        setCharacterCount(0);
        setShowCharacterWarning(false);
        setError(null);
        clearDraft();
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        // Clear previous messages
        removeErrors();

        //Validate form
        const { isValid, error } = validateForm();
        if (!isValid) {
            setError(error);
            return;
        }
        // Spin the loader
        setIsLoading(true);

        const newPost = {
            userId: state.users[0]?.id || 1, // Get the first user's ID
            content: content.trim(),
            likes: 0,
            comments: [],
            timestamp: new Date().toISOString()
        };
        // Update backend
        try {
            const res = await axios.post(`http://localhost:5000/posts`, newPost);
            dispatch({ type: 'ADD_POST', payload: { post: res.data } });
            setSuccessMessage("Post created successfully!");
            resetForm();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Failed to create post:", error);
            setError("Failed to create post. Please try again later.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="p-4 bg-white rounded-2xl shadow mb-6 dark:bg-gray-900">
            {showDraftPrompt && (<div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 rounded mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-800 font-semibold">📝 Draft found!</p>
                        <p className="text-blue-600 text-sm">Would you like to continue editing your previous draft?</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={handleLoadDraft}
                        >
                            Load Draft
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                            onClick={handleDiscardDraft}
                        >
                            Start Fresh
                        </button>
                    </div>
                </div>
            </div>)}

            <form onSubmit={handleCreate}>
                <div className="mt-1 mb-4">
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => { setIsDirty(true); setContent(e.target.value); }}
                        rows="3"
                        maxLength="500"
                    />
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <small className={`text-xs font-medium ${showDangerWarning ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                                : showWarning ? "text-yellow-600 bg-yellow-50 px-2 py-1 rounded"
                                    : "text-gray-500"}`}>
                                {characterCount >= 450 ? "You're approaching the character limit." : ""}
                                {characterCount} / 500 characters
                            </small>
                            {showDangerWarning && (
                                <p className="text-xs text-red-600 mt-1">⚠️ Character limit approaching!</p>
                            )}
                            {showWarning && (
                                <p className="text-xs text-yellow-600 mt-1">⚡ Getting close to limit</p>
                            )}
                        </div>
                        {lastSaved && (
                            <small className="text-xs text-gray-400">
                                Last saved at {lastSaved.toLocaleTimeString()}
                            </small>
                        )}
                    </div>
                    {error && (<div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 mb-3 rounded flex items-start gap-2">
                        <span className="text-lg">❌</span>
                        <div>
                            <p className="font-semibold text-sm">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>)}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 mb-3 rounded flex items-start gap-2">
                            <span className="text-lg">✅</span>
                            <div>
                                <p className="font-semibold text-sm">Success</p>
                                <p className="text-sm">{successMessage}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 flex-wrap">
                        <button type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 rounded font-medium transition ${isLoading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-60"
                                : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                                }`}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="inline-block animate-spin">⟳</span>
                                    Publishing...
                                </span>
                            ) : (
                                "📤 Publish Post"
                            )}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition"
                            onClick={resetForm}
                        >
                            🔄 Reset
                        </button>
                    </div>
                    {(isDraftAvailable() || lastSaved) && (
                        <button type="button"
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded font-medium hover:bg-yellow-200 transition mt-2"
                            onClick={handleDiscardDraft}
                        >
                            🗑️ Discard Draft
                        </button>
                    )}
                </div>
            </form>

        </div>
    );
    
}

export default CreatePost;