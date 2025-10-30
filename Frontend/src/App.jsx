import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Userdashboard from "./components/Userdashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserTransactions from "./components/UserTransactions"; // ✅ import the new component
import ChangePassword from "./components/ChangePassword";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Users from "./components/Users";


function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Home Page */}
        <Route path="/home" element={<Home />} />

        {/* User Dashboard */}
        <Route path="/userdashboard" element={<Userdashboard />} />

        {/* Admin Dashboard */}
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Transactions Page */}
        <Route path="/transactions" element={<UserTransactions />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />

        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<Users />} />

      </Routes>
    </Router>
  );
}

export default App;
