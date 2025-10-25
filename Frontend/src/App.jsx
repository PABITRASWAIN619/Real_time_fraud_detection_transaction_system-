import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home"; 
import SignUp from "./components/SignUp";
import Userdashboard from "./components/Userdashboard"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Admin Home Page */}
        <Route path="/home" element={<Home />} />

        {/* User Dashboard */}
        <Route path="/userdashboard" element={<Userdashboard />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
