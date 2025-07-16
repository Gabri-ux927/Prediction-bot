// Telegram WebApp initialization
const tg = window.Telegram.WebApp;

// Expand the app to full view
tg.expand();

// Initialize main button
const mainButton = tg.MainButton;
mainButton.setText("REQUEST PASSWORD");
mainButton.hide();

// Initialize back button
const backButton = tg.BackButton;
backButton.hide();

// Export Telegram WebApp utilities
export const TelegramWebApp = {
    initData: tg.initData || {},
    initDataUnsafe: tg.initDataUnsafe || {},
    user: tg.initDataUnsafe?.user,
    userId: tg.initDataUnsafe?.user?.id,
    username: tg.initDataUnsafe?.user?.username,
    themeParams: tg.themeParams,
    colorScheme: tg.colorScheme,
    isExpanded: tg.isExpanded,
    version: tg.version,
    platform: tg.platform,
    
    showMainButton: (text, callback) => {
        mainButton.setText(text);
        mainButton.onClick(callback);
        mainButton.show();
    },
    
    hideMainButton: () => {
        mainButton.hide();
        mainButton.offClick();
    },
    
    showBackButton: (callback) => {
        backButton.onClick(callback);
        backButton.show();
    },
    
    hideBackButton: () => {
        backButton.hide();
        backButton.offClick();
    },
    
    showAlert: (message, callback) => {
        tg.showAlert(message, callback);
    },
    
    showConfirm: (message, callback) => {
        tg.showConfirm(message, callback);
    },
    
    closeApp: () => {
        tg.close();
    },
    
    sendData: (data) => {
        tg.sendData(JSON.stringify(data));
    }
};