/**
 * Entry point for the React Tic Tac Toe application.
 * 
 * This file bootstraps the React app by mounting the root App component
 * into the DOM. All React application rendering starts from here.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
