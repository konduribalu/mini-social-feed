import React from "react";
import { GlobalContext } from "../context/GlobalState";
import PostCard from "./PostCard";

function Feed() {
    const { state } = React.useContext(GlobalContext);
    if (state.loading) return <p>Loading posts...</p>;

    const currentUser = state.users[0]; // Assuming the first user is the current user
    const followingIds = currentUser?.following || [];

    const feedPosts = state.posts.filter(post =>
        post.userId === currentUser.id || followingIds.includes(post.userId)
    );

    const recommendedPosts = state.posts.filter(post =>
        !feedPosts.includes(post)
    ).slice(0, 5); // Get top 5 recommended posts

    if (!feedPosts || feedPosts.length === 0) {
        return <p className="text-center text-gray-600 mt-10">No posts available.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 space-y-6">
            {feedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            {recommendedPosts.length > 0 && (
                <div className="recommended mt-6">
                    <h3 className="font-bold mb-2">Recommended Posts</h3>
                    {recommendedPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Feed;