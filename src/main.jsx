import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalProvider } from './context/GlobalState';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render
  (
  <React.StrictMode>
    <ThemeProvider>
    <GlobalProvider>
      <NotificationProvider>        
        <App />
      </NotificationProvider>
    </GlobalProvider>
    </ThemeProvider>
  </React.StrictMode>
);


