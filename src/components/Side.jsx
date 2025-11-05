import React, { use } from "react";
import { GlobalContext } from "../context/GlobalState";
import UserFollowButton from "./UserFollowButton";

const Side = () => {
    const { state, dispatch } = React.useContext(GlobalContext);

    const currentUser = state.users[0]; // Assuming the first user is the current user
    const currentUserId = currentUser.id;

    const recommendedUsers = state.users.filter(user => currentUser.following 
        && !currentUser.following.includes(user.id) && user.id !== currentUserId);


    return (
        <div className="bg-white rounded-2xl shadow p-4 h-fit">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                👥 People You May Know
            </h2>
            <div className="space-y-3">
                {recommendedUsers.filter(user => user.id !== currentUserId)
                    .map(user => {
                        const isFollowing = user.followers.includes(currentUserId);
                        return (
                            <div key={user.id} className="flex items-center justify-between border-b pb-2">
                                <span className="font-medium text-gray-700">
                                    {user.name}
                                </span>
                                <UserFollowButton userId={user.id} />
                            </div>
                        )
                    })}
            </div>
        </div>
    );
};

export default Side;    