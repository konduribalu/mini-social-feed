import React from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { GlobalContext } from "../context/GlobalState";
import UserFollowButton from "./UserFollowButton";
import "../components/PostCard.css";

function Profile() {
    const { userId } = useParams();

    const { state } = React.useContext(GlobalContext);
    const { users, posts } = state;

    const profileUser = users.find(u => u.id === userId);
    const currentUser = state.users[0]; // Assuming the first user is the logged-in user

    if (!profileUser) {
        return <div>User not found</div>;
    }
    const userPosts = posts.filter(post => post.userId === profileUser.id);

    return (
        <div className="p-4">
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h2 className="text-2xl font-bold">{profileUser.name}'s Profile
                    <span className="profile-follow-button small">
                        <UserFollowButton userId={profileUser.id} />
                    </span>
                </h2>
                <p className="text-gray-600">@{profileUser.username}</p>
                <p className="mt-2 text-gray-800">{profileUser.bio}</p>
                <p className="text-sm text-blue-500 font-medium">{profileUser.followers.length} Followers</p>
                <p className="text-sm text-blue-500 font-medium">{profileUser.following.length} Following</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Posts</h3>
                {userPosts.length > 0 ? userPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                )) : <p className="text-gray-600">No posts available.</p>}
            </div>
        </div>
    );
}

export default Profile;