/**
 * main.js
 * Entry point — waits for DOM, creates game container, starts Game.
 */

import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  if (!container) {
    console.error('Sky Runner: #game-container not found');
    return;
  }

  const game = new Game(container);
  game.start();

  // Expose for debugging
  if (process?.env?.NODE_ENV !== 'production') {
    window._game = game;
  }
});
