import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

function Nav() {
    const { notifications } = useNotifications();

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <h1 className="font-bold text-lg">Mini Social Feed</h1>
            <div className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/users" className="hover:underline">Users</Link>
                <Link to="/notifications" className="relative">
                    🔔{notifications.some(n => !n.read) 
                    && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3"></span>
                    }
                </Link>
            </div>
        </nav>
    );
}

export default Nav;