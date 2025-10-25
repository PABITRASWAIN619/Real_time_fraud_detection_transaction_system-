import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import Login from "../components/Login";
import img1 from "../assets/signup1.png";
import img2 from "../assets/signup2.png";
import img3 from "../assets/signup3.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const images = [img1, img2, img3];

  // Auto-change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  // handle form input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.userId.trim()) newErrors.userId = "User ID required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ connect frontend to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration successful!");
        setShowLogin(true); // redirect to login page after signup
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="signup-container">
      {/* ===== Left Image Section ===== */}
      <div
        className="signup-left"
        onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
      >
        <div className="image-slider">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="signup visual"
              className={`slide ${index === currentImage ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* ===== Right Form Section ===== */}
      <div className="signup-right">
        <div className="signup-box">
          <h2>Create Your Account</h2>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="userId"
                placeholder="User ID"
                value={formData.userId}
                onChange={handleChange}
              />
              {errors.userId && <span className="error">{errors.userId}</span>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="material-icons toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(true);
                }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* ===== Login Popup ===== */}
      {showLogin && <Login closePopup={() => setShowLogin(false)} />}
    </div>
  );
};

export default SignUp;
