import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    fraudCases: 0,
  });
  const [transactions, setTransactions] = useState([]);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://localhost:5000/api/admin/stats");
        const res2 = await fetch("http://localhost:5000/api/admin/recent");

        const data1 = await res1.json();
        const data2 = await res2.json();

        setStats(data1);
        setTransactions(data2);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem("user"); // clear stored login info
    alert("You have been logged out.");
    navigate("/home");
  };

  // Example chart data
  const chartData = [
    { name: "Week 1", fraud: 10, legit: 100 },
    { name: "Week 2", fraud: 7, legit: 120 },
    { name: "Week 3", fraud: 15, legit: 95 },
    { name: "Week 4", fraud: 9, legit: 110 },
  ];

  return (
    <div className="admin-dashboard">
      {/* ===== Sidebar ===== */}
      <aside className="admin-sidebar">
        <h2 className="logo">FraudGuard Admin</h2>
        <ul className="menu">
          <li className="active">Dashboard</li>
          <li onClick={() => navigate("/userdashboard")}>User View</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li onClick={() => navigate("/settings")}>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of users and transactions in the system.</p>
        </header>

        {/* ===== Statistics Cards ===== */}
        <section className="stats-section">
          <div className="stat-card users">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card transactions">
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions}</p>
          </div>
          <div className="stat-card fraud">
            <h3>Fraud Cases</h3>
            <p>{stats.fraudCases}</p>
          </div>
        </section>

        {/* ===== Chart Section ===== */}
        <section className="chart-section">
          <h2>Fraud vs Legit Transactions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fraud" fill="#e63946" name="Fraudulent" />
              <Bar dataKey="legit" fill="#2a9d8f" name="Legitimate" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* ===== Recent Transactions Table ===== */}
        <section className="table-section">
          <h2>Recent Transactions</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn._id}</td>
                    <td>{txn.userId}</td>
                    <td>₹{txn.amount}</td>
                    <td className={txn.isFraud ? "fraud" : "legit"}>
                      {txn.isFraud ? "Fraud" : "Legit"}
                    </td>
                    <td>{new Date(txn.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
