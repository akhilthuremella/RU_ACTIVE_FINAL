import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile'; // Import Profile page
import { UserProvider } from './UserContext';
import io from 'socket.io-client';
import './index.css';

// Initialize the socket connection
const socket = io('http://localhost:5001'); // Adjust the URL and port as needed

function App() {
  useEffect(() => {
    // Listen for connection event
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Optional: Listen for disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
