import React from "react";
import UserFollowButton from "./UserFollowButton";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

function UserCard({ user }) {
    
    const {state} = React.useContext(GlobalContext);
    const currentUser = state.users[0]; // Assuming the first user is the logged-in user
    if(user.id === currentUser.id) return null;
    
    const followersCount = state.users.find(u => u.id === user.id)?.followers.length || 0;
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-semibold">
                    <Link to={`/profile/${user.id}`} className="text-blue-600 hover:underline">
                        {user.name}
                    </Link>
                </h3>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-sm text-blue-500 font-medium">{followersCount} Followers</p>
            </div>
            <UserFollowButton userId={user.id} />
        </div>
    );
}

export default UserCard;