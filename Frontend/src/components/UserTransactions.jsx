import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Userdashboard.css";

const UserTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user and token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;

  // Fetch user transactions
  const fetchTransactions = async () => {
    if (!token) return alert("User not logged in");

    try {
      const res = await fetch(`http://localhost:5000/api/transactions/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching transactions. Check console for details.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // Add new transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !type) return;
    if (!token) return alert("User not logged in");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          type,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add transaction");

      // Add the new transaction to the top of the list
      setTransactions((prev) => [data.transaction || data, ...prev]);
      setAmount("");
      setType("credit");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setLoading(false);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">FraudGuard</h2>
        <ul className="menu">
          <li onClick={() => navigate("/userdashboard")}>Dashboard</li>
          <li className="active">Transactions</li>
          <li onClick={() => navigate("/reports")}>Reports</li>
          <li onClick={() => navigate("/settings")}>Settings</li>
          <li onClick={handleLogout} className="logout-btn">Logout</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>My Transactions</h1>
          <p>Here are all your recent transactions.</p>
        </header>

        {/* Add Transaction Form */}
        <section className="add-transaction">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleAddTransaction}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              required
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </form>
        </section>

        {/* Transactions Table */}
        <section className="table-section">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn._id}</td>
                    <td>₹{txn.amount}</td>
                    <td className={txn.type === "credit" ? "type-credit" : "type-debit"}>
                      {txn.type}
                    </td>
                    <td
                      className={`status ${
                        txn.status === "pending"
                          ? "status-pending"
                          : txn.status === "completed"
                          ? "status-completed"
                          : "status-failed"
                      }`}
                    >
                      {txn.status}
                    </td>
                    <td>{new Date(txn.date || txn.timestamp).toLocaleString()}</td>
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

export default UserTransactions;
