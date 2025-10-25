import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ closePopup }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
  alert(`✅ Welcome ${data.user.firstName}!`);
  closePopup();

  if (data.user.role === "admin") {
    navigate("/Home");
  } else {
    navigate("/userdashboard");
  }
}

    } catch (error) {
      console.error("Login error:", error);
      alert("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={closePopup}>✖</button>
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Login As</label>
            <select required value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email or User ID</label>
            <input
              type="text"
              placeholder="Enter your email or user ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="material-icons toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">Login</button>

          <p className="signup-text">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                closePopup();
                navigate("/signup");
              }}
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
