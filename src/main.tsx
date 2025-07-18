import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app/globals.css';
import { PlaylistProvider } from './context/PlaylistContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlaylistProvider>
      <App />
    </PlaylistProvider>
  </React.StrictMode>
); 