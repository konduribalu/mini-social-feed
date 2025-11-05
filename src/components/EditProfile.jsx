import React from "react";
import { GlobalContext } from "../context/GlobalState";
import axios from "axios";
import{useNavigate} from "react-router-dom";

function EditProfile() {
    const { state, dispatch } = React.useContext(GlobalContext);
    const navigate = useNavigate();
    const currentUser = state.users[0]; // Assuming the first user is the logged-in user
    const [formValues, setFormValues] = React.useState({
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio
    });

    const handleProfileUpdate = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.patch(`http://localhost:5000/users/${currentUser.id}`, formValues);
        dispatch({ type: 'UPDATE_USER', payload: { id: currentUser.id, user: formValues } });
        navigate(`/profile/${currentUser.id}`);
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" value={formValues.name} onChange={handleProfileUpdate} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input type="text" name="username" value={formValues.username} onChange={handleProfileUpdate} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea name="bio" value={formValues.bio} onChange={handleProfileUpdate} className="w-full border rounded px-2 py-1" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
            </form>
        </div>
    );
};


export default EditProfile;
