export const initTelegram = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    return tg;
  }
  return null;
};

export const sendData = (data) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    return true;
  }
  return false;
};

export const showAlert = (message) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showAlert(message);
    return true;
  }
  alert(message); // Fallback for browser testing
  return false;
};

export const showConfirm = (message, callback) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback);
    return true;
  }
  if (confirm(message)) { // Fallback for browser testing
    callback(true);
  }
  return false;
};