const API_BASE = process.env.REACT_APP_API_URL || '/api';

export const fetchSignals = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE}/signals`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const generateSignal = (interval) => {
  return {
    bigSmall: Math.random() > 0.5 ? 'BIG' : 'SMALL',
    greenRed: Math.random() > 0.5 ? 'GREEN' : 'RED',
    numbers: [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ],
    interval
  };
};

export const startSignalUpdates = (callback, intervals = [30, 60, 180, 300]) => {
  const timers = intervals.map(interval => {
    return setInterval(() => {
      callback(generateSignal(interval));
    }, interval * 1000);
  });

  // Initial signals
  intervals.forEach(interval => {
    callback(generateSignal(interval));
  });

  return () => timers.forEach(timer => clearInterval(timer));
};