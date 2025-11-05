import React from "react";
import { GlobalContext } from "../context/GlobalState";
import axios from "axios";

function CommentsReplies({ postId, comments }) {
    const { state, dispatch } = React.useContext(GlobalContext);
    const [replyText, setReplyText] = React.useState("");
    const [activeComment, setActiveComment] = React.useState(null);

    const handleReply = async (commentId) => {
        if (replyText.trim() === "") return;
        const newReply = {
            id: Date.now(),
            userId: state.users[0].id,
            text: replyText,
            timestamp: new Date().toISOString(),
            replies: []
        };
        const fullPost = state.posts.find(p => p.id === postId);
        const updatedComments = addReplyToComments(fullPost.comments, commentId, newReply);
        try {
            const response = await axios.patch(`http://localhost:5000/posts/${postId}`, { comments: updatedComments });
            // Update local state or refetch comments here
            dispatch({ type: "EDIT_POST", payload: { postId, post: 
                response.data
             } })
            setReplyText("");
            setActiveComment(null);
        } catch (error) {
            console.error("Failed to post reply:", error);
        }

    };

    const addReplyToComments = (commentsList, commentId, reply) => {
        return commentsList.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), reply]
                };
            } else if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyToComments(comment.replies, commentId, reply)
                };
            }
            return comment;
        });
    };

    return (
        <div className="ml-4 mt-2">
            {comments.map((comment) => (
                <div key={comment.id}
                    className="border-l-2 border-gray-300 pl-2 mt-2 text-sm">
                    <p className="text-gray-700">
                        <strong>User {comment.userId}</strong>: {comment.text}
                    </p>
                    <button className="text-blue-500 text-xs mt-1"
                        onClick={() => setActiveComment(activeComment === comment.id ? null : comment.id)}>Reply</button>
                    {activeComment === comment?.id && (
                        <div className="mt-2">
                            <input type="text" className="border rounded px-2 py-1 text-xs"
                                placeholder="Write a reply"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
                                onClick={() => {
                                    handleReply(comment.id);
                                }}>
                                Send
                            </button>
                        </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                        <CommentsReplies postId={postId} comments={comment.replies} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default CommentsReplies;