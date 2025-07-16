import React, { useState } from 'react';
import { requestPassword, verifyPassword } from '../services/auth';
import { showAlert } from '../services/telegram';

export default function PasswordScreen({ onAuthSuccess }) {
  const [password, setPassword] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await verifyPassword(password);
    if (isValid) {
      onAuthSuccess();
    } else {
      showAlert('Invalid password. Please try again.');
    }
  };

  const handleRequest = async () => {
    setIsRequesting(true);
    const success = await requestPassword();
    if (success) {
      showAlert('Password request sent to admin. You will receive it shortly.');
    }
    setIsRequesting(false);
  };

  return (
    <div className="password-container">
      <div className="password-box">
        <h2>SignalPredict Pro</h2>
        <p>Enter today's password to access predictions</p>
        
        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button type="submit">SUBMIT</button>
        </form>
        
        <div className="request-section">
          <p>Don't have today's password?</p>
          <button 
            onClick={handleRequest}
            disabled={isRequesting}
          >
            {isRequesting ? 'Sending...' : 'REQUEST FROM ADMIN'}
          </button>
        </div>
      </div>
    </div>
  );
}