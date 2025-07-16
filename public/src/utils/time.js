export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getISTTime = () => {
  const now = new Date();
  // IST is UTC+5:30
  now.setHours(now.getHours() + 5);
  now.setMinutes(now.getMinutes() + 30);
  return now;
};

export const isPasswordResetTime = () => {
  const now = getISTTime();
  return now.getHours() === 11 && now.getMinutes() >= 30;
};