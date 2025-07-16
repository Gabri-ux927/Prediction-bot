import React, { useState, useEffect } from 'react';
import PasswordScreen from './components/PasswordScreen';
import AdminPanel from './components/AdminPanel';
import SignalContainer from './components/SignalContainer';
import { checkAuth, isAdmin } from './services/auth';
import { initTelegram } from './services/telegram';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initTelegram();
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      const adminStatus = await isAdmin();
      setAuthenticated(authStatus);
      setIsAdminUser(adminStatus);
      setLoading(false);
    };
    verifyAuth();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      {isAdminUser ? (
        <AdminPanel />
      ) : authenticated ? (
        <SignalContainer />
      ) : (
        <PasswordScreen onAuthSuccess={() => setAuthenticated(true)} />
      )}
    </div>
  );
}