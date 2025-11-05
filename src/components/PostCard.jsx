import React, { useState } from "react";
import "./PostCard.css";
import { GlobalContext } from "../context/GlobalState";
import UserFollowButton from "./UserFollowButton";
import axios from "axios";
import { useNotifications } from "../context/NotificationContext";
import CommentsReplies from "./CommentsReplies";

function PostCard({ post }) {
    const { state, dispatch } = React.useContext(GlobalContext);
    const { addNotification } = useNotifications();
    const user = state.users.find(u => u.id === post.userId);
    const currentPost = state.posts.find(p => p.id === post.id);

    const currentUser = state.users[0]; // Assuming the first user is the logged-in user


    // Step 2: Handle Like button click
    const handleLike = async () => {
        const updateLikes = post.likes + 1;
        await fetch(`http://localhost:5000/posts/${post.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ likes: updateLikes })
        });
        dispatch({ type: 'LIKE_POST', payload: { postId: post.id } });

        // Add notification for the post owner
        if (post.userId !== currentUser.id) {
            const newNotification = {
                userId: post.userId,
                message: `${currentUser.name} liked your post`,
                timestamp: new Date().toISOString(),
                read: false
            };
            addNotification(newNotification);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5000/posts/${postId}`);
            dispatch({ type: 'DELETE_POST', payload: { postId } });
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const handleEdit = async (postId) => {
        // Implement edit functionality here
        const newContent = prompt("Edit your post:", post.content);
        if (newContent !== null && newContent.trim() !== "") {
            try {
                const response = await axios.patch(`http://localhost:5000/posts/${postId}`, { content: newContent });
                dispatch({ type: 'EDIT_POST', payload: { postId, post: response.data } });
            } catch (error) {
                console.error("Failed to edit post:", error);
            }
        }
    }

    // Add comment
    const handleAddComment = async (e, comment) => {
        e.preventDefault();
        if (comment.trim() !== "") {
            const newComment = {
                id: Date.now(),
                userId: currentUser.id,
                text: comment,
                timestamp: new Date().toISOString(),
                replies: []
            };
            await fetch(`http://localhost:5000/posts/${post.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comments: [...(currentPost.comments || []), newComment] })
            }
            );
            dispatch({ type: 'ADD_COMMENT', payload: { postId: post.id, comment: newComment } });
        }

        // Notify post owner about new comment
        if (post.userId !== currentUser.id) {
            const newNotification = {
                userId: post.userId,
                message: `${currentUser.name} commented on your post`,
                timestamp: new Date().toISOString(),
                read: false
            };
            addNotification(newNotification);
        }
    };

    return (

        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800">
                {user ? user.name : 'Unknown User'}
                <span className="user-follow-button">
                    <UserFollowButton userId={user?.id} />
                </span>
            </h4>
            <p className="text-gray-700 my-2">{post.content}</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-red-500">❤️ {currentPost?.likes || 0} Likes</p>
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={handleLike}>
                    Like
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const comment = e.target.comment.value;
                    handleAddComment(e, comment);
                    e.target.comment.value = "";
                }
                } className="flex gap-2">
                    <input
                        type="text"
                        name="comment"
                        placeholder="Add a comment..."
                        className="border rounded px-2 py-1 flex-1"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Comment
                    </button>
                    {currentUser.id == post.userId && (
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => handleDelete(post.id)}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                onClick={() => handleEdit(post.id)}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </form>
                <div className="mt-2">
                    <span className="text-sm text-gray-500 font-bold">
                        {currentPost.comments.length}
                    </span> Comments
                    {currentPost.comments && currentPost.comments.length > 0 ? (
                        currentPost.comments.map((comment, index) => (
                            <div key={index} className="border-b py-1 pl-2">
                                <p className="text-gray-700 text-sm">{comment.text}</p>
                                <span className="text-sm text-gray-500 font-bold">
                                    {comment.timestamp}
                                </span>

                                <CommentsReplies
                                    postId={post.id}
                                    comments={currentPost.comments}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No comments yet.</p>
                    )}
                </div>
            </div>
        </div>


    );
}

export default PostCard;