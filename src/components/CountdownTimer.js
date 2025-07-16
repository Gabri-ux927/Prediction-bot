import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/time';

export default function CountdownTimer({ interval }) {
  const [timeLeft, setTimeLeft] = useState(0);

  // Convert interval string to seconds (e.g., "30s" → 30)
  const intervalSeconds = parseInt(interval) * 
    (interval.includes('m') ? 60 : 1);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const totalSeconds = now.getMinutes() * 60 + seconds;
      const remainder = totalSeconds % intervalSeconds;
      return intervalSeconds - remainder;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalSeconds]);

  return <div className="timer">{formatTime(timeLeft)}</div>;
}