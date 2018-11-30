import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PlayerProvider } from './contexts/PlayerContext'
import { EnemyProvider } from './contexts/EnemiesContext';

ReactDOM.render(
  <EnemyProvider>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </EnemyProvider>,
  document.getElementById('root')
);
