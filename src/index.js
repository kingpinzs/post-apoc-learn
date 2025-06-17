import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './components/Game';
import PracticeMode from './components/PracticeMode';

const root = ReactDOM.createRoot(document.getElementById('root'));
const params = new URLSearchParams(window.location.search);
const isPractice = params.has('practice');

root.render(
  <React.StrictMode>
    {isPractice ? <PracticeMode /> : <Game />}
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

