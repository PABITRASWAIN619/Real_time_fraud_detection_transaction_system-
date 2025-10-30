import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [loginId, setLoginId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Load logged-in user's loginId from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setLoginId(storedUser.loginId);
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage("❌ New passwords do not match!");
    }

    try {
      const token = localStorage.getItem("token"); // use token from login

      const res = await axios.put(
        "http://localhost:5000/api/users/change-password",
        { loginId, oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ " + res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || "Error changing password")
      );
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <label>Email/User ID</label>
        <input type="text" value={loginId} disabled />

        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangePassword;
