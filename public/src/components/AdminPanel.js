import React, { useState, useEffect } from 'react';
import { 
  getCurrentPassword,
  generateNewPassword,
  getPasswordRequests,
  approveRequest
} from '../services/admin';
import { showAlert } from '../services/telegram';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pwd, reqs] = await Promise.all([
        getCurrentPassword(),
        getPasswordRequests()
      ]);
      setPassword(pwd);
      setRequests(reqs);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGeneratePassword = async () => {
    const newPassword = await generateNewPassword();
    setPassword(newPassword);
    showAlert('New password generated!');
  };

  const handleApprove = async (requestId) => {
    const success = await approveRequest(requestId);
    if (success) {
      setRequests(requests.filter(req => req._id !== requestId));
      showAlert('Password sent to user');
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-section">
        <h3>Today's Password</h3>
        <div className="password-display">
          {loading ? 'Loading...' : password}
        </div>
        <p className="password-reset-info">
          Resets automatically at 11:30 AM IST
        </p>
        <button onClick={handleGeneratePassword}>
          GENERATE NEW PASSWORD
        </button>
      </div>
      
      <div className="admin-section">
        <h3>Password Requests</h3>
        <div className="requests-list">
          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            requests.map(request => (
              <div key={request._id} className="request-item">
                <span>@{request.username || 'unknown'} ({request.userId})</span>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(request._id)}
                >
                  APPROVE
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}