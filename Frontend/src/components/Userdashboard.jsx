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
import "./Userdashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudCases: 0,
    legitimate: 0,
  });
  const [transactions, setTransactions] = useState([]);

  // ✅ Fetch dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://localhost:5000/api/dashboard/stats");
        const res2 = await fetch("http://localhost:5000/api/dashboard/recent");

        const data1 = await res1.json();
        const data2 = await res2.json();

        setStats(data1);
        setTransactions(data2);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, []);
const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    // ✅ Clear user session (optional)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ✅ Navigate to Home or Login page
    navigate("/home"); // or "/signup" if you prefer
  }
};

  // Chart data (example)
  const chartData = [
    { name: "Week 1", fraud: 5, legit: 40 },
    { name: "Week 2", fraud: 8, legit: 35 },
    { name: "Week 3", fraud: 6, legit: 50 },
    { name: "Week 4", fraud: 10, legit: 45 },
  ];

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <h2 className="logo">FraudGuard</h2>
        <ul className="menu">
          <li className="active">Dashboard</li>
          <li onClick={() => navigate("/transactions")}>Transactions</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li onClick={() => navigate("/settings")}>Settings</li>
          <li
  onClick={() => handleLogout()}
  className="logout-btn"
>
  Logout
</li>

        </ul>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Fraud Detection Dashboard</h1>
          <p>Welcome back! Here’s your transaction summary.</p>
        </header>

        {/* ===== Stats Cards ===== */}
        <section className="stats-grid">
          <div className="card total">
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions || 0}</p>
          </div>
          <div className="card fraud">
            <h3>Fraudulent Cases</h3>
            <p>{stats.fraudCases || 0}</p>
          </div>
          <div className="card legit">
            <h3>Legitimate</h3>
            <p>{stats.legitimate || 0}</p>
          </div>
        </section>

        {/* ===== Chart Section ===== */}
        <section className="chart-section">
          <h2>Weekly Fraud Analysis</h2>
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

        {/* ===== Recent Transactions ===== */}
        <section className="table-section">
          <h2>Recent Transactions</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
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
                    <td
                      className={
                        txn.isFraud ? "status fraud" : "status legit"
                      }
                    >
                      {txn.isFraud ? "Fraud" : "Legit"}
                    </td>
                    <td>{new Date(txn.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No transactions found
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

export default Dashboard;
