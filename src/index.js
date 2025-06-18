import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AchievementsProvider } from './hooks/useAchievements';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AchievementsProvider>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="matrix-bg" />
        <App />
      </div>
    </AchievementsProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      `${process.env.PUBLIC_URL}/service-worker.js`
    )
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

