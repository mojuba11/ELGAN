import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';   // Tailwind base styles (colors/layout)
import './App.css';     // ELGAN custom styles (fonts/animations)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// We removed StrictMode to prevent double-firing of API calls
root.render(
    <App />
);