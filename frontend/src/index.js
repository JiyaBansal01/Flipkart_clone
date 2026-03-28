/**
 * index.js - React App Entry Point
 * ==================================
 * This is the very first file React reads.
 * It mounts our App component into the HTML page (public/index.html).
 *
 * ReactDOM.createRoot attaches React to the <div id="root"> in index.html.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the <div id="root"> element in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render our entire app inside it
root.render(
  <React.StrictMode>
    {/*
      StrictMode helps catch potential problems during development.
      It doesn't affect the production build.
    */}
    <App />
  </React.StrictMode>
);
