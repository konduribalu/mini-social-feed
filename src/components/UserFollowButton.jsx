import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import axios from "axios";
import { useNotifications } from "../context/NotificationContext";

function UserFollowButton({ userId }) {
    const { state, dispatch } = useContext(GlobalContext);

    const { addNotification } = useNotifications();
    const currentUser = state.users[0]; // Assuming the first user is the logged-in user
    const currentUserId = currentUser?.id;

    // Hide the button for the current user
    if (userId === currentUserId) return null;

    const isFollowing = currentUser.following?.includes(userId);

    const handleFollowToggle = async () => {
        try {
            // Update current user's following list
            const updatedFollowing = isFollowing
                ? currentUser.following.filter(id => id !== userId)
                : [...(currentUser.following || []), userId];

            await axios.patch(`http://localhost:5000/users/${currentUser.id}`, {
                following: updatedFollowing
            });

            // Update target user's followers list
            const targetUser = state.users.find(u => u.id === userId);
            const updatedFollowers = isFollowing
                ? targetUser.followers.filter(id => id !== currentUserId)
                : [...(targetUser.followers || []), currentUserId];

            await axios.patch(`http://localhost:5000/users/${userId}`, {
                followers: updatedFollowers
            });

            // Dispatch the updated users to the global state
            dispatch({ type: "TOGGLE_FOLLOW", payload: { followerId: currentUserId, targetId: userId } });

            // Notify the target user about the follow/unfollow action
            if(currentUserId !== userId){
                const action = isFollowing ? 'unfollowed' : 'followed';
                const newNotification = {
                    userId: userId,
                    message: `${currentUser.name} has ${action} you`,
                    timestamp: new Date().toISOString(),
                    read: false
                }
                addNotification(newNotification);
            }
        } catch (error) {
            console.error("Error checking follow status:", error);
        }
    };

    return (
        <button
            onClick={handleFollowToggle}
            className={`px-4 py-2 rounded ${isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
}

export default UserFollowButton;