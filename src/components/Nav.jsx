import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { GlobalContext } from "../context/GlobalState";
import { useTheme } from "../context/ThemeContext";

function Nav() {
    const { notifications } = useNotifications();
    const [searchText, setSearchText] = React.useState("");
    const [filterType, setFilterType] = React.useState("all");
    const { state, dispatch } = React.useContext(GlobalContext);
    const { theme, toggleTheme } = useTheme();

    const handleSearchText = (text) => {
        setSearchText(text);
        dispatch({ type: 'SET_SEARCH_TEXT', payload: { searchText: text } });
    }

    const handleFilterType = (type) => {
        setFilterType(type);
        dispatch({ type: 'SET_FILTER_TYPE', payload: { filterType: type } });
    }   
    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <h1 className="font-bold text-lg">Mini Social Feed</h1>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={toggleTheme}>
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}</button>
            <div className="md:col-span-2">
                <input type="text"
                    value={searchText}
                    onChange={(e) => handleSearchText(e.target.value)}
                    placeholder="Search..."
                    className="rounded px-1 py-1 text-black"
                />
                <select
                    className="border rounded px-2 py-1 mx-2 text-black"
                    value={filterType}
                    onChange={(e) => handleFilterType(e.target.value)}
                >
                    <option value="all">All Posts</option>
                    <option value="my">My Posts</option>
                    <option value="following">Following</option>
                </select>
            </div>
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