/**
 * Game.js
 * Top-level game controller.
 * Owns the Three.js renderer, manages scene transitions,
 * and runs the main requestAnimationFrame loop.
 *
 * States: MENU → PLAYING → GAME_OVER → MENU (loop)
 */

import * as THREE       from 'three';
import { MenuScene }    from './scenes/MenuScene.js';
import { GameScene }    from './scenes/GameScene.js';
import { GameOverScene} from './scenes/GameOverScene.js';
import { SaveSystem }   from './systems/SaveSystem.js';
import { AudioSystem }  from './systems/AudioSystem.js';
import { Bus, EVENTS }  from './utils/EventBus.js';

const STATES = { MENU:'MENU', PLAYING:'PLAYING', GAME_OVER:'GAME_OVER' };

export class Game {
  constructor(container) {
    this._container = container;
    this._state     = null;
    this._raf       = null;

    // Core systems (persistent across scenes)
    this._save  = new SaveSystem();
    this._audio = new AudioSystem(this._save.settings);

    // Three.js renderer (shared across scenes)
    this._canvas   = this._createCanvas();
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    this._renderer.outputColorSpace   = THREE.SRGBColorSpace;
    this._renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1.1;

    this._resize();
    window.addEventListener('resize', () => this._resize());

    // Active scene refs
    this._menuScene    = null;
    this._gameScene    = null;
    this._gameOverScene = null;
  }

  _createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    this._container.appendChild(canvas);
    return canvas;
  }

  _resize() {
    const w = this._container.clientWidth;
    const h = this._container.clientHeight;
    this._renderer.setSize(w, h, false);
    this._canvas.style.width  = w + 'px';
    this._canvas.style.height = h + 'px';

    if (this._menuScene)  this._menuScene.handleResize(w, h);
    if (this._gameScene)  this._gameScene.handleResize(w, h);
  }

  /* ═══════════════════════════════
     STATE MACHINE
  ═══════════════════════════════ */
  start() {
    this._toMenu();
    this._loop(0);
  }

  _toMenu() {
    this._cleanupScenes();
    this._state = STATES.MENU;

    this._menuScene = new MenuScene({
      renderer:  this._renderer,
      canvas:    this._canvas,
      container: this._container,
      save:      this._save,
      audio:     this._audio,
      onPlay:    () => this._toPlaying(),
    });
  }

  _toPlaying() {
    this._cleanupScenes();
    this._state = STATES.PLAYING;

    this._gameScene = new GameScene({
      renderer:  this._renderer,
      canvas:    this._canvas,
      container: this._container,
      audio:     this._audio,
      save:      this._save,
    });

    // Game over — show result then allow retry/menu
    this._gameOverScene = new GameOverScene({
      container: this._container,
      save:      this._save,
      onRetry:   () => this._toPlaying(),
      onMenu:    () => this._toMenu(),
    });

    this._gameScene.start(performance.now());
  }

  _cleanupScenes() {
    if (this._menuScene)    { this._menuScene.dispose();    this._menuScene    = null; }
    if (this._gameScene)    { this._gameScene.dispose();    this._gameScene    = null; }
    if (this._gameOverScene){ this._gameOverScene.dispose();this._gameOverScene= null; }
    Bus.clear();
  }

  /* ═══════════════════════════════
     MAIN LOOP
  ═══════════════════════════════ */
  _loop(timestamp) {
    this._raf = requestAnimationFrame(t => this._loop(t));

    switch (this._state) {
      case STATES.MENU:
        if (this._menuScene) {
          this._menuScene.update(timestamp);
          this._menuScene.render();
        }
        break;

      case STATES.PLAYING:
        if (this._gameScene) {
          this._gameScene.update(timestamp);
          this._gameScene.render();
        }
        break;
    }
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._cleanupScenes();
    this._audio.destroy();
    this._renderer.dispose();
    this._canvas.remove();
    window.removeEventListener('resize', this._resize);
  }
}
