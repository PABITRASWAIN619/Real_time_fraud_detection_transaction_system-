import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserDashboard.css";
import {
  FaHome,
  FaChartBar,
  FaExchangeAlt,
  FaCog,
  FaTachometerAlt,
  FaUserCircle,
  FaExclamationTriangle,
  FaTable,
  FaSignOutAlt,
  FaQuestionCircle,
  FaUsers,
  FaPlug,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const merchants = ["Apple Store", "Pharmacy", "Walmart", "Amazon", "Netflix", "Paytm", "Flipkart"];
const randomTransaction = () => ({
  merchant: merchants[Math.floor(Math.random() * merchants.length)],
  amount: (Math.random() * 1000).toFixed(2),
  risk: (Math.random() * 1).toFixed(2),
  status: Math.random() > 0.8 ? "Blocked ❌" : Math.random() > 0.6 ? "Flagged ⚠️" : "Safe ✅",
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [liveFeed, setLiveFeed] = useState([randomTransaction(), randomTransaction(), randomTransaction()]);
  const [activeTab, setActiveTab] = useState("all");
  const [showProfile, setShowProfile] = useState(false);

  // ===== Auto-update live feed =====
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFeed((prev) => [randomTransaction(), ...prev.slice(0, 9)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ===== Logout handler =====
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // ===== Sidebar menu click =====
  const handleMenuClick = (menu, path) => {
    navigate(path);
  };

  // ===== Sidebar active menu based on URL =====
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes("/transactions")) return "transactions";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/users")) return "users";
    if (path.includes("/help")) return "help";
    if (path.includes("/apis")) return "apis";
    if (path.includes("/change-password")) return "change-password";
    return "dashboard";
  };

  const stats = [
    { title: "Total Transactions", value: "1,482", color: "#6366f1" },
    { title: "Fraud Detections", value: "26", color: "#ef4444" },
    { title: "Fraud Rate", value: "1.75%", color: "#facc15" },
    { title: "Amount Processed", value: "$1.2M", color: "#22c55e" },
    { title: "Amount Blocked", value: "$82K", color: "#f97316" },
    { title: "Detection Accuracy", value: "98.9%", color: "#0ea5e9" },
  ];

  const sampleTransactions = [
    { id: "TXN001", timestamp: "2025-10-29 12:10", merchant: "Amazon", amount: "$120.50", location: "Odisha", method: "UPI", risk: "0.12", status: "Safe" },
    { id: "TXN002", timestamp: "2025-10-29 12:25", merchant: "Walmart", amount: "$340.90", location: "Delhi", method: "Credit Card", risk: "0.75", status: "Flagged" },
    { id: "TXN003", timestamp: "2025-10-29 12:40", merchant: "Pharmacy", amount: "$220.00", location: "Mumbai", method: "Debit Card", risk: "0.90", status: "Blocked" },
  ];

  const filteredTransactions =
    activeTab === "flagged"
      ? sampleTransactions.filter((t) => t.status === "Flagged")
      : activeTab === "blocked"
      ? sampleTransactions.filter((t) => t.status === "Blocked")
      : sampleTransactions;

  const fraudTrend = [
    { day: "Mon", frauds: 2 },
    { day: "Tue", frauds: 4 },
    { day: "Wed", frauds: 3 },
    { day: "Thu", frauds: 5 },
    { day: "Fri", frauds: 7 },
    { day: "Sat", frauds: 6 },
    { day: "Sun", frauds: 3 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 65 },
    { name: "Medium Risk", value: 25 },
    { name: "High Risk", value: 10 },
  ];
  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="user-profile top-profile" onClick={() => setShowProfile(!showProfile)}>
          <FaUserCircle className="user-icon" />
          <div>
            <p className="user-name">Pabitra Swain</p>
            <span className="user-role">Premium Member</span>
          </div>
        </div>

        {showProfile && (
          <div className="profile-popup">
            <FaUserCircle className="popup-avatar" />
            <h4>Pabitra Swain</h4>
            <p>pabitraswain@example.com</p>
            <button onClick={() => alert("Profile page coming soon!")}>View Profile</button>
            <button onClick={() => alert("Settings page coming soon!")}>Settings</button>
            <button className="logout-popup" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}

        <h2 className="logo">SmartFraud</h2>

        {/* ===== Menu ===== */}
        <ul className="menu">
          <li className={getActiveMenu() === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard", "/userdashboard")}>
            <FaTachometerAlt /> Dashboard
          </li>
          <li className={getActiveMenu() === "transactions" ? "active" : ""} onClick={() => handleMenuClick("transactions", "/transactions")}>
            <FaExchangeAlt /> Transactions
          </li>
          <li className={getActiveMenu() === "reports" ? "active" : ""} onClick={() => handleMenuClick("reports", "/reports")}>
            <FaChartBar /> Reports
          </li>
          <li className={getActiveMenu() === "help" ? "active" : ""} onClick={() => handleMenuClick("help", "/help")}>
            <FaQuestionCircle /> Help & Support
          </li>
          <li className={getActiveMenu() === "users" ? "active" : ""} onClick={() => handleMenuClick("users", "/users")}>
            <FaUsers /> Users
          </li>
          <li className={getActiveMenu() === "apis" ? "active" : ""} onClick={() => handleMenuClick("apis", "/apis")}>
            <FaPlug /> APIs
          </li>
          <li className={getActiveMenu() === "settings" ? "active" : ""} onClick={() => handleMenuClick("settings", "/settings")}>
            <FaCog /> Settings
          </li>
          <li className={getActiveMenu() === "change-password" ? "active" : ""} onClick={() => handleMenuClick("change-password", "/change-password")}>
            <FaCog /> Change Password
          </li>
        </ul>

        <div className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content">
        <div className="header">
          <h2>Real-Time Fraud Detection Dashboard</h2>
          <button className="add-btn">Add Transaction +</button>
        </div>

        {/* ===== Overview Cards ===== */}
        <div className="overview-section">
          {stats.map((stat, i) => (
            <div key={i} className="overview-card" style={{ borderTop: `5px solid ${stat.color}` }}>
              <h4 style={{ color: stat.color }}>{stat.title}</h4>
              <p>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ===== Graphs ===== */}
        <div className="graph-section">
          <div className="graph-box">
            <h3>📈 Fraud Detection Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={fraudTrend}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="frauds" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-box">
            <h3>🧠 Risk Level Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Transactions ===== */}
        <div className="transactions-frame">
          <div className="tab-buttons">
            <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
              <FaTable /> All
            </button>
            <button className={activeTab === "flagged" ? "active" : ""} onClick={() => setActiveTab("flagged")}>
              <FaExclamationTriangle /> Flagged
            </button>
            <button className={activeTab === "blocked" ? "active" : ""} onClick={() => setActiveTab("blocked")}>
              ❌ Blocked
            </button>
          </div>

          <div className="transactions-section">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Time</th>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Method</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, i) => (
                  <tr key={i}>
                    <td>{t.id}</td>
                    <td>{t.timestamp}</td>
                    <td>{t.merchant}</td>
                    <td>{t.amount}</td>
                    <td>{t.location}</td>
                    <td>{t.method}</td>
                    <td>{t.risk}</td>
                    <td className={t.status === "Blocked" ? "negative" : t.status === "Flagged" ? "warning" : "positive"}>
                      {t.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Live Feed ===== */}
        <div className="live-feed">
          <h3>📡 Live Fraud Alert Feed</h3>
          <ul>
            {liveFeed.map((item, index) => (
              <li key={index}>
                <span className="merchant">{item.merchant}</span> — ${item.amount} — Risk:{" "}
                <strong>{item.risk}</strong> — <span className="status">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
