import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Notification from './pages/Notification';
import Profile from './components/Profile';
import Nav from './components/Nav';
import EditProfile from './components/EditProfile';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/editProfile" element={<EditProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
