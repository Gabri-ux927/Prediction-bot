export const formatNumber = (num) => {
  return num < 10 ? `0${num}` : num.toString();
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};