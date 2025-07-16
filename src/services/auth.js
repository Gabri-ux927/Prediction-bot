import { sendData } from './telegram';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

export const checkAuth = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const isAdmin = async () => {
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
  if (!userId) return false;
  
  try {
    const response = await fetch(`${API_BASE}/admin/check`, {
      headers: { 'X-User-ID': userId }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const verifyPassword = async (password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const requestPassword = async () => {
  const user = window.Telegram.WebApp.initDataUnsafe.user;
  if (!user) return false;
  
  try {
    const response = await fetch(`${API_BASE}/auth/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        username: user.username
      })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};