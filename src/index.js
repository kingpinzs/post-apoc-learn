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
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
        if (registration.waiting) {
          alert('Update available. Reload to apply.');
        }
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                alert('New version available. Reload to update.');
              }
            });
          }
        });
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

