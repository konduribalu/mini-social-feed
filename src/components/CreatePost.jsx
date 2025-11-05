import React from "react";
import { GlobalContext } from "../context/GlobalState";
import axios from "axios";

function CreatePost() {
    const { state, dispatch } = React.useContext(GlobalContext);
    const [content, setContent] = React.useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        const newPost = {
            userId: state.users[0]?.id || 1, // Get the first user's ID
            content: content.trim(),
            likes: 0,
            comments: [],
            timestamp: new Date().toISOString()
        };
        // Update backend
        try{
            const res = await axios.post(`http://localhost:5000/posts`, newPost);
            dispatch({ type: 'ADD_POST', payload: { post: res.data } });
            setContent("");
        } catch (error) {
            console.error("Failed to create post:", error);
        }        
    }

    return (
        <div className="p-4 bg-white rounded-2xl shadow mb-6">
            <textarea
                className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
            />
            <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCreate}>
                Post
            </button>
        </div>

    );

}

export default CreatePost;