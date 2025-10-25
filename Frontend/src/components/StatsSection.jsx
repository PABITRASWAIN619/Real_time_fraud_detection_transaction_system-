import React, { useEffect, useState } from "react";
import "./Home.css"; 

const StatsSection = () => {
  const [stats, setStats] = useState({
    transactions: 24563,
    alerts: 356,
    verified: 24207,
  });

  const [trends, setTrends] = useState({
    transactions: "+8.4%",
    alerts: "-3.2%",
    verified: "98.5%",
  });

  const [display, setDisplay] = useState({
    transactions: 0,
    alerts: 0,
    verified: 0,
  });

  // Smooth number animation when stats update
  useEffect(() => {
    const duration = 1000;
    const interval = 20;
    const steps = duration / interval;
    const increments = {
      transactions: stats.transactions / steps,
      alerts: stats.alerts / steps,
      verified: stats.verified / steps,
    };

    let currentStep = 0;
    const anim = setInterval(() => {
      currentStep++;
      setDisplay({
        transactions: Math.min(stats.transactions, Math.floor(increments.transactions * currentStep)),
        alerts: Math.min(stats.alerts, Math.floor(increments.alerts * currentStep)),
        verified: Math.min(stats.verified, Math.floor(increments.verified * currentStep)),
      });
      if (currentStep >= steps) clearInterval(anim);
    }, interval);

    return () => clearInterval(anim);
  }, [stats]);

  // 🔄 Auto-refresh stats every 1 minute for realistic movement
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setStats((prev) => {
        const newTransactions = Math.max(10000, prev.transactions + Math.floor(Math.random() * 100 - 50)); // small fluctuation
        const newAlerts = Math.max(100, prev.alerts + Math.floor(Math.random() * 6 - 3)); // gentle up/down
        const newVerified = Math.max(10000, prev.verified + Math.floor(Math.random() * 80 - 40));

        return {
          transactions: newTransactions,
          alerts: newAlerts,
          verified: newVerified,
        };
      });

      // Update trend percentages realistically
      setTrends({
        transactions: `${(Math.random() * 10).toFixed(1)}%`,
        alerts: `${(Math.random() * 5).toFixed(1)}%`,
        verified: `${(97 + Math.random() * 3).toFixed(1)}%`,
      });
    }, 60000); // ⏱ Every 60 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  const currentDate = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="stats-section">
      <div className="stats-header">
        <h2>📊 System Performance Overview</h2>
        <p className="stats-subtext">
          A real-time summary of fraud detection metrics and system health insights.
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-card glass-card">
          <span className="material-icons stat-icon">account_balance_wallet</span>
          <div className="stat-info">
            <h3>Total Transactions</h3>
            <p className="stat-number">{display.transactions.toLocaleString()}</p>
            <span className="trend positive">
              <i className="material-icons">trending_up</i> {trends.transactions} this week
            </span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <span className="material-icons stat-icon">warning</span>
          <div className="stat-info">
            <h3>Suspicious Alerts</h3>
            <p className="stat-number">{display.alerts.toLocaleString()}</p>
            <span className="trend negative">
              <i className="material-icons">trending_down</i> {trends.alerts} from last week
            </span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <span className="material-icons stat-icon">verified_user</span>
          <div className="stat-info">
            <h3>Verified Safe</h3>
            <p className="stat-number">{display.verified.toLocaleString()}</p>
            <span className="trend positive">
              <i className="material-icons">check_circle</i> {trends.verified} accuracy
            </span>
          </div>
        </div>
      </div>

      <div className="stats-footer">
        <p>
          Last updated: <strong>{currentDate}</strong> · Auto-refresh every 1 min
        </p>
      </div>
    </section>
  );
};

export default StatsSection;
