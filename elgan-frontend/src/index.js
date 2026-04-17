import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind must be here
import './App.css';   // Custom overrides last

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);