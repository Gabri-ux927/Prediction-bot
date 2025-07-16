export const generateDailyPassword = () => {
  const today = new Date();
  const seed = `${today.getDate()}${today.getMonth()}${today.getFullYear()}`;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hash = 0;
  
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.abs(hash + i) % chars.length);
  }
  
  return result;
};

export const validatePassword = (password) => {
  return password.length === 7 && /^[A-Z2-9]+$/.test(password);
};