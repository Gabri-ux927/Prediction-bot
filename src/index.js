import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './services/telegram'; // Initialize Telegram WebApp

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);