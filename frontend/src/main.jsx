import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// If you had a global CSS file (like index.css), you would import it here.
// Since we're using Bootstrap CDN, no local global CSS import is needed unless you add custom styles.
// import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
