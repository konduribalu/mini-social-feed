import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalProvider } from './context/GlobalState';
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render
  (
  <React.StrictMode>
    <GlobalProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </GlobalProvider>
  </React.StrictMode>
);


