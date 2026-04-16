import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { getAttendanceStats } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAttendanceStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-welcome">Welcome back!</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Classes</h3>
          <p className="stat-value">{stats?.totalClasses ?? 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-value">{stats?.totalStudents ?? 0}</p>
        </div>
        <div className="stat-card">
          <h3>Present Today</h3>
          <p className="stat-value">{stats?.presentToday ?? 0}</p>
        </div>
        <div className="stat-card">
          <h3>Absent Today</h3>
          <p className="stat-value">{stats?.absentToday ?? 0}</p>
        </div>
      </div>

      <div className="quick-stats-card">
        <div className="quick-stats-header">
          <h2>Quick Stats</h2>
          <p>Today's attendance overview</p>
        </div>
        <div className="quick-stats-list">
          <div className="quick-stat">
            <p className="quick-stat-value">{stats?.presentToday ?? 0}</p>
            <p className="quick-stat-label">Present</p>
          </div>
          <div className="quick-stat">
            <p className="quick-stat-value">{stats?.absentToday ?? 0}</p>
            <p className="quick-stat-label">Absent</p>
          </div>
          <div className="quick-stat">
            <p className="quick-stat-value">{stats?.leaveToday ?? 0}</p>
            <p className="quick-stat-label">Leave</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
