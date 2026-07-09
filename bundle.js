
// Sky Runner — Deepu Siva Private Limited
// Built: 2026-07-09T10:45:02.290Z
// Three.js is loaded externally via CDN

// Shim: make 'import * as THREE from "three"' work with the global THREE
// Since three is external, esbuild leaves 'import' statements; we polyfill here.
const __threeModule = { ...window.THREE };

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// three-global:three
var require_three = __commonJS({
  "three-global:three"(exports, module) {
    module.exports = window.THREE;
  }
});

// src/Game.js
var THREE10 = __toESM(require_three());

// src/scenes/MenuScene.js
var THREE2 = __toESM(require_three());

// src/utils/EventBus.js
var EventBus = class {
  constructor() {
    this._listeners = {};
  }
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
    return this;
  }
  off(event, callback) {
    if (!this._listeners[event])
      return this;
    this._listeners[event] = this._listeners[event].filter((cb) => cb !== callback);
    return this;
  }
  emit(event, data = {}) {
    if (!this._listeners[event])
      return;
    this._listeners[event].forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error(`EventBus error on "${event}":`, e);
      }
    });
  }
  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
  clear(event) {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }
  }
};
var Bus = new EventBus();
var EVENTS = {
  // Game state
  GAME_START: "GAME_START",
  GAME_OVER: "GAME_OVER",
  GAME_PAUSE: "GAME_PAUSE",
  GAME_RESUME: "GAME_RESUME",
  SCENE_CHANGE: "SCENE_CHANGE",
  // Player
  PLAYER_JUMP: "PLAYER_JUMP",
  PLAYER_LAND: "PLAYER_LAND",
  PLAYER_HIT: "PLAYER_HIT",
  PLAYER_ROLL: "PLAYER_ROLL",
  PLAYER_LANE_CHANGE: "PLAYER_LANE_CHANGE",
  PLAYER_DIED: "PLAYER_DIED",
  // Collectables
  COIN_COLLECTED: "COIN_COLLECTED",
  POWERUP_COLLECTED: "POWERUP_COLLECTED",
  POWERUP_EXPIRED: "POWERUP_EXPIRED",
  // Score
  SCORE_UPDATE: "SCORE_UPDATE",
  MULTIPLIER_CHANGE: "MULTIPLIER_CHANGE",
  NEAR_MISS: "NEAR_MISS",
  // Skin
  SKIN_CHANGED: "SKIN_CHANGED",
  SKIN_UNLOCKED: "SKIN_UNLOCKED",
  // Input
  INPUT_LEFT: "INPUT_LEFT",
  INPUT_RIGHT: "INPUT_RIGHT",
  INPUT_JUMP: "INPUT_JUMP",
  INPUT_ROLL: "INPUT_ROLL",
  INPUT_TAP: "INPUT_TAP"
};

// src/utils/TextureGenerator.js
var THREE = __toESM(require_three());
var TextureGenerator = class {
  /** Cache so we don't regenerate the same texture twice */
  static _cache = {};
  static _getOrCreate(key, generator) {
    if (this._cache[key])
      return this._cache[key];
    const tex = generator();
    tex.needsUpdate = true;
    this._cache[key] = tex;
    return tex;
  }
  static _canvas(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return { canvas, ctx: canvas.getContext("2d") };
  }
  /** ── TRACK SURFACE ── purple/dark road with lane markings */
  static track() {
    return this._getOrCreate("track", () => {
      const { canvas, ctx } = this._canvas(256, 256);
      const g = ctx.createLinearGradient(0, 0, 256, 256);
      g.addColorStop(0, "#5a2aaa");
      g.addColorStop(0.3, "#7a3acc");
      g.addColorStop(0.5, "#8a4adc");
      g.addColorStop(0.7, "#7a3acc");
      g.addColorStop(1, "#5a2aaa");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * 256, y = Math.random() * 256;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 4;
      for (let y = 0; y < 256; y += 40) {
        ctx.beginPath();
        ctx.moveTo(128, y);
        ctx.lineTo(128, y + 20);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 8);
      return tex;
    });
  }
  /** ── BUILDING FACADE ── dark glass skyscraper */
  static building(colorHex = "#2D1B5E") {
    const key = "building_" + colorHex;
    return this._getOrCreate(key, () => {
      const { canvas, ctx } = this._canvas(128, 256);
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, 128, 256);
      const grad = ctx.createLinearGradient(0, 0, 128, 0);
      grad.addColorStop(0, "rgba(255,255,255,0.08)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.18)");
      grad.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 256);
      const winColors = ["rgba(255,240,160,1.0)", "rgba(160,220,255,0.95)", "rgba(255,180,255,0.85)"];
      for (let row = 10; row < 256; row += 22) {
        for (let col = 8; col < 128; col += 18) {
          const lit = Math.random() > 0.35;
          ctx.fillStyle = lit ? winColors[Math.floor(Math.random() * 2)] : winColors[2];
          ctx.fillRect(col, row, 10, 13);
          if (lit) {
            ctx.shadowColor = "#FFE082";
            ctx.shadowBlur = 6;
            ctx.fillRect(col, row, 10, 13);
            ctx.shadowBlur = 0;
          }
        }
      }
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── CHARACTER SKIN: ROSA (default) ── pink/purple */
  static skinRosa() {
    return this._getOrCreate("skin_rosa", () => {
      const { canvas, ctx } = this._canvas(64, 128);
      const bg = ctx.createLinearGradient(0, 0, 64, 128);
      bg.addColorStop(0, "#FF6FA5");
      bg.addColorStop(1, "#C04CFF");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 64, 128);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(20, 0, 24, 128);
      ctx.fillStyle = "#FFD23F";
      [[10, 20], [50, 40], [30, 80], [15, 100], [48, 110]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── CHARACTER SKIN: NINJA ── dark with red details */
  static skinNinja() {
    return this._getOrCreate("skin_ninja", () => {
      const { canvas, ctx } = this._canvas(64, 128);
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, 64, 128);
      ctx.fillStyle = "#EF5350";
      ctx.fillRect(0, 50, 64, 12);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(32, 56, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,0,0,0.3)";
      ctx.lineWidth = 1;
      for (let y = 0; y < 128; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(64, y);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── CHARACTER SKIN: SPACE KID ── blue/teal astronaut */
  static skinSpace() {
    return this._getOrCreate("skin_space", () => {
      const { canvas, ctx } = this._canvas(64, 128);
      const bg = ctx.createLinearGradient(0, 0, 64, 128);
      bg.addColorStop(0, "#1565C0");
      bg.addColorStop(1, "#00BCD4");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 64, 128);
      ctx.fillStyle = "rgba(100,220,255,0.4)";
      ctx.beginPath();
      ctx.roundRect(12, 10, 40, 30, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(18, 55, 28, 35);
      ["#F44336", "#4CAF50", "#2196F3"].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(24 + i * 8, 65, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── CHARACTER SKIN: DINO ── green scaly */
  static skinDino() {
    return this._getOrCreate("skin_dino", () => {
      const { canvas, ctx } = this._canvas(64, 128);
      ctx.fillStyle = "#388E3C";
      ctx.fillRect(0, 0, 64, 128);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 4; col++) {
          const ox = row % 2 * 8;
          ctx.beginPath();
          ctx.ellipse(col * 16 + 8 + ox, row * 16 + 8, 7, 7, 0, 0, Math.PI);
          ctx.fill();
        }
      }
      ctx.fillStyle = "#A5D6A7";
      ctx.beginPath();
      ctx.ellipse(32, 80, 14, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1B5E20";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(48, 20 + i * 16);
        ctx.lineTo(60, 26 + i * 16);
        ctx.lineTo(48, 32 + i * 16);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── COIN ── gold metallic */
  static coin() {
    return this._getOrCreate("coin", () => {
      const { canvas, ctx } = this._canvas(64, 64);
      const g = ctx.createRadialGradient(22, 22, 2, 32, 32, 28);
      g.addColorStop(0, "#FFF9C4");
      g.addColorStop(0.4, "#FFD23F");
      g.addColorStop(0.8, "#FFA000");
      g.addColorStop(1, "#E65100");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#E65100";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 32, 34);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(20, 20, 8, 5, -0.5, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── OBSTACLE: BOX CRATE ── wooden crate */
  static crateBox() {
    return this._getOrCreate("crate", () => {
      const { canvas, ctx } = this._canvas(128, 128);
      ctx.fillStyle = "#D32F2F";
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = "#B71C1C";
      ctx.lineWidth = 3;
      [32, 64, 96].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 128);
        ctx.stroke();
      });
      [32, 64, 96].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(128, y);
        ctx.stroke();
      });
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(128, 128);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.lineTo(0, 128);
      ctx.stroke();
      ctx.fillStyle = "#FF8F00";
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(i * 28, 0, 14, 128);
      }
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── POWERUP TEXTURES ── */
  static powerUp(type) {
    const key = "powerup_" + type;
    return this._getOrCreate(key, () => {
      const { canvas, ctx } = this._canvas(64, 64);
      const configs = {
        magnet: { bg: "#7B1FA2", icon: "\u{1F9F2}", label: "M" },
        shield: { bg: "#1565C0", icon: "\u{1F6E1}\uFE0F", label: "S" },
        boost: { bg: "#E65100", icon: "\u26A1", label: "B" },
        x2: { bg: "#1B5E20", icon: "\xD72", label: "2" }
      };
      const cfg = configs[type] || configs.boost;
      const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
      g.addColorStop(0, cfg.bg + "cc");
      g.addColorStop(1, cfg.bg);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cfg.label, 32, 34);
      return new THREE.CanvasTexture(canvas);
    });
  }
  /** ── SKY GRADIENT ── for the background */
  static skyGradient(theme = "city") {
    const key = "sky_" + theme;
    return this._getOrCreate(key, () => {
      const { canvas, ctx } = this._canvas(2, 512);
      const themes = {
        city: ["#1a0a3e", "#3a1a7e", "#6a2faf"],
        // rich purple-violet, much brighter
        jungle: ["#0a3a1a", "#1a6a2a", "#2aaa4a"],
        // vivid jungle green
        space: ["#00082a", "#0a1060", "#1a2aaa"]
        // deep space blue
      };
      const cols = themes[theme] || themes.city;
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, cols[0]);
      g.addColorStop(0.5, cols[1]);
      g.addColorStop(1, cols[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 2, 512);
      return new THREE.CanvasTexture(canvas);
    });
  }
  static clearCache() {
    this._cache = {};
  }
};

// src/constants.js
var TRACK = {
  LANE_POSITIONS: [-2.2, 0, 2.2],
  // X positions of 3 lanes
  LANE_WIDTH: 2,
  SEGMENT_LENGTH: 20,
  // Length of each track tile
  NUM_SEGMENTS: 12,
  // How many tiles in view at once
  SCROLL_START_Z: 8,
  // Z position of farthest tile
  GROUND_Y: 0,
  // Y position of track surface
  SIDE_WALL_X: 4
};
var PLAYER = {
  START_LANE: 1,
  START_Z: 7,
  HEIGHT: 2,
  ROLL_HEIGHT: 0.8,
  JUMP_VELOCITY: 0.22,
  // Higher jump = clears obstacles easier
  JUMP_DOUBLE_VELOCITY: 0.17,
  GRAVITY: -0.01,
  // Gentler gravity = more air time
  LANE_SWITCH_SPEED: 0.2,
  INVINCIBLE_DURATION: 110,
  // Longer invincibility after hit
  COLLISION_RADIUS_X: 0.26,
  // Much narrower — forgiving side collision
  COLLISION_RADIUS_Y: 0.7,
  // Shorter — jumping clears boxes easily
  COLLISION_RADIUS_Z: 0.32
  // Shallower depth window
};
var SPEED = {
  INITIAL: 0.09,
  // Very slow start like Subway Surfers
  MAX: 0.52,
  // Max speed (reached after ~4 min)
  INCREMENT: 22e-6,
  // Very gradual — slow ramp up
  BOOST_MULTIPLIER: 1.6
};
var OBSTACLES = {
  POOL_SIZE: 20,
  SPAWN_Z: -85,
  // Spawn further = more reaction time
  DESPAWN_Z: 16,
  INITIAL_INTERVAL: 5.5,
  // Much larger gap at start (was 3.5)
  MIN_INTERVAL: 1.8,
  DIFFICULTY_SCALE: 1e-4
  // Slower ramp up (was 0.00025)
};
var COINS = {
  POOL_SIZE: 40,
  SPAWN_Z: -60,
  DESPAWN_Z: 14,
  VALUE: 10,
  // Score per coin
  MAGNET_RADIUS: 3.5,
  // Auto-collect radius during magnet powerup
  ROW_COUNT: [3, 4, 5, 6]
  // Random coin row lengths
};
var POWERUPS = {
  SPAWN_CHANCE: 0.3,
  // 30% chance a coin row has a powerup instead
  TYPES: ["magnet", "shield", "boost", "x2"],
  DURATIONS: {
    // In seconds
    magnet: 8,
    shield: 10,
    boost: 5,
    x2: 12
  }
};
var SCORING = {
  BASE_PER_FRAME: 1,
  COIN_BONUS: 10,
  NEAR_MISS_BONUS: 50,
  MULTIPLIER_MAX: 4,
  MULTIPLIER_COIN_THRESHOLD: 10
  // Coins to increase multiplier
};
var CAMERA = {
  POSITION: { x: 0, y: 5.5, z: 12 },
  // Higher and further back = more view
  LOOK_AT: { x: 0, y: 0.5, z: -18 },
  // Look much further ahead (was -5)
  FOV: 72,
  // Wider FOV = more visible (was 65)
  NEAR: 0.1,
  FAR: 400,
  // Much further draw distance (was 200)
  LEAN_AMOUNT: 0.14,
  LEAN_SPEED: 0.05
};
var PARTICLES = {
  MAX_PARTICLES: 500,
  COIN_BURST_COUNT: 12,
  CRASH_BURST_COUNT: 24,
  TRAIL_COUNT: 6,
  BOOST_TRAIL_COUNT: 10
};
var SKINS = {
  ALL: [
    { id: "rosa", name: "Rosa", cost: 0, unlocked: true },
    { id: "ninja", name: "Ninja", cost: 1e3, unlocked: false },
    { id: "space", name: "Space Kid", cost: 2500, unlocked: false },
    { id: "dino", name: "Dino", cost: 5e3, unlocked: false },
    { id: "robot", name: "Robot", cost: 1e4, unlocked: false }
  ]
};
var ENVIRONMENTS = {
  ALL: [
    { id: "city", name: "City Night", unlocked: true },
    { id: "jungle", name: "Jungle", unlocked: false },
    { id: "space", name: "Space", unlocked: false }
  ],
  BUILDING_COLORS: {
    city: [2956126, 1713022, 4854924, 3622735, 1776431],
    jungle: [1793568, 3369246, 19776, 3046706, 3706428],
    space: [870305, 24676, 1713022, 3218322, 87963]
  }
};
var AUDIO = {
  BGM_VOLUME: 0.4,
  SFX_VOLUME: 0.7,
  JUMP_FREQ: 520,
  COIN_FREQ: 880,
  HIT_FREQ: 180,
  POWERUP_FREQ: 660,
  LAND_FREQ: 200
};
var SAVE_KEYS = {
  HIGH_SCORE: "sr_high_score",
  TOTAL_COINS: "sr_coins",
  SKINS: "sr_skins",
  ACTIVE_SKIN: "sr_active_skin",
  ACTIVE_ENV: "sr_active_env",
  SETTINGS: "sr_settings",
  DAILY_REWARD: "sr_daily"
};

// src/scenes/MenuScene.js
var MenuScene = class {
  constructor({ renderer, canvas, container, save, audio, onPlay }) {
    this._renderer = renderer;
    this._canvas = canvas;
    this._container = container;
    this._save = save;
    this._audio = audio;
    this._onPlay = onPlay;
    this._frame = 0;
    this._scene = new THREE2.Scene();
    this._scene.fog = new THREE2.FogExp2(2756704, 0.01);
    this._camera = new THREE2.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this._camera.position.set(0, 2.5, 6);
    this._camera.lookAt(0, 1.2, 0);
    this._buildLights();
    this._buildPreviewTrack();
    this._buildPreviewCharacter();
    this._buildUI();
    const reward = save.claimDailyReward();
    if (reward > 0)
      setTimeout(() => this._showDailyReward(reward), 600);
  }
  /* ─── 3D PREVIEW ─── */
  _buildLights() {
    this._scene.add(new THREE2.AmbientLight(15654399, 1.4));
    const sun = new THREE2.DirectionalLight(16774604, 2.2);
    sun.position.set(4, 10, 6);
    this._scene.add(sun);
    const fill = new THREE2.PointLight(16724889, 2, 28);
    fill.position.set(-3, 4, 5);
    this._scene.add(fill);
    this._fillLight = fill;
  }
  _buildPreviewTrack() {
    const geo = new THREE2.BoxGeometry(6.5, 0.18, 22);
    const mat = new THREE2.MeshLambertMaterial({ map: TextureGenerator.track() });
    const mesh = new THREE2.Mesh(geo, mat);
    mesh.position.set(0, -0.09, -4);
    mesh.receiveShadow = true;
    this._scene.add(mesh);
    [[-3.6, 16740261], [3.6, 12602623]].forEach(([x, col]) => {
      const wg = new THREE2.BoxGeometry(0.2, 1.2, 22);
      const wm = new THREE2.MeshLambertMaterial({ color: col });
      const w = new THREE2.Mesh(wg, wm);
      w.position.set(x, 0.6, -4);
      this._scene.add(w);
    });
    const sv = [];
    for (let i = 0; i < 250; i++) {
      sv.push((Math.random() - 0.5) * 80, 5 + Math.random() * 30, -Math.random() * 80 - 5);
    }
    const sg = new THREE2.BufferGeometry();
    sg.setAttribute("position", new THREE2.Float32BufferAttribute(sv, 3));
    this._scene.add(new THREE2.Points(sg, new THREE2.PointsMaterial({ color: 16777215, size: 0.15 })));
  }
  _buildPreviewCharacter() {
    this._charGroup = new THREE2.Group();
    this._scene.add(this._charGroup);
    const bodyGeo = new THREE2.CylinderGeometry(0.38, 0.42, 0.85, 12);
    this._bodyMat = new THREE2.MeshLambertMaterial({ map: TextureGenerator.skinRosa() });
    const body = new THREE2.Mesh(bodyGeo, this._bodyMat);
    body.position.y = 1.1;
    body.castShadow = true;
    this._charGroup.add(body);
    const head = new THREE2.Mesh(
      new THREE2.SphereGeometry(0.36, 14, 10),
      new THREE2.MeshLambertMaterial({ color: 16757702 })
    );
    head.position.y = 1.85;
    head.castShadow = true;
    this._charGroup.add(head);
    this._previewHead = head;
    [-0.13, 0.13].forEach((ex) => {
      const ew = new THREE2.Mesh(new THREE2.SphereGeometry(0.09, 8, 6), new THREE2.MeshBasicMaterial({ color: 16777215 }));
      ew.position.set(ex, 1.9, -0.31);
      this._charGroup.add(ew);
      const ep = new THREE2.Mesh(new THREE2.SphereGeometry(0.045, 7, 5), new THREE2.MeshBasicMaterial({ color: 2236962 }));
      ep.position.set(ex * 1.05, 1.88, -0.375);
      this._charGroup.add(ep);
    });
    this._legL = new THREE2.Mesh(new THREE2.CylinderGeometry(0.14, 0.12, 0.58, 8), new THREE2.MeshLambertMaterial({ color: 10233776 }));
    this._legL.position.set(-0.2, 0.5, 0);
    this._charGroup.add(this._legL);
    this._legR = new THREE2.Mesh(new THREE2.CylinderGeometry(0.14, 0.12, 0.58, 8), new THREE2.MeshLambertMaterial({ color: 10233776 }));
    this._legR.position.set(0.2, 0.5, 0);
    this._charGroup.add(this._legR);
    [[-0.2, 16740261], [0.2, 12602623]].forEach(([x, col]) => {
      const s = new THREE2.Mesh(new THREE2.BoxGeometry(0.28, 0.16, 0.42), new THREE2.MeshLambertMaterial({ color: col }));
      s.position.set(x, 0.12, 0.06);
      this._charGroup.add(s);
    });
    const pack = new THREE2.Mesh(new THREE2.BoxGeometry(0.55, 0.62, 0.28), new THREE2.MeshLambertMaterial({ color: 16765503 }));
    pack.position.set(0, 1.2, 0.36);
    this._charGroup.add(pack);
    this._charGroup.position.set(0, 0, 1.5);
  }
  /* ─── HTML UI ─── */
  _buildUI() {
    const ui = document.createElement("div");
    ui.id = "sr-menu";
    ui.style.cssText = `position:absolute;inset:0;font-family:'Baloo 2','Nunito',sans-serif;`;
    const best = this._save.highScore;
    const coins = this._save.totalCoins;
    const activeSkin = this._save.activeSkin;
    ui.innerHTML = `
      <!-- TOP COINS -->
      <div style="position:absolute;top:16px;right:16px;
        display:flex;align-items:center;gap:6px;
        background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);
        border:2px solid rgba(251,191,36,0.4);border-radius:99px;padding:7px 16px 7px 12px;
      ">
        <span style="font-size:16px;">\u{1FA99}</span>
        <span id="menu-coins" style="font-size:16px;font-weight:800;color:#FBBF24;">${coins.toLocaleString()}</span>
      </div>

      <!-- BRAND -->
      <div style="position:absolute;top:22px;left:50%;transform:translateX(-50%);text-align:center;pointer-events:none;">
        <div style="font-size:28px;font-weight:900;color:#fff;text-shadow:0 0 20px rgba(255,111,165,0.6);letter-spacing:-0.5px;">
          \u{1F3C3} SKY RUNNER
        </div>
        ${best > 0 ? `<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.6);">Best: ${best.toLocaleString()}</div>` : ""}
      </div>

      <!-- BOTTOM PANEL -->
      <div style="position:absolute;bottom:0;left:0;right:0;
        background:linear-gradient(180deg,transparent,rgba(10,0,25,0.92) 30%);
        padding:0 16px 24px;
      ">
        <!-- PLAY BUTTON -->
        <button id="btn-play" style="
          width:100%;height:60px;border:none;
          background:linear-gradient(135deg,#FF6FA5,#C04CFF);color:#fff;
          font-size:20px;font-weight:800;border-radius:99px;cursor:pointer;
          box-shadow:0 8px 0 rgba(0,0,0,0.3),0 10px 24px rgba(255,111,165,0.4);
          font-family:'Baloo 2',sans-serif; margin-bottom:12px;
          transition:transform .12s;
        ">\u25B6 PLAY</button>

        <!-- TABS -->
        <div style="display:flex;gap:8px;margin-bottom:14px;">
          ${["\u{1F3AD} Skins", "\u{1F30D} World", "\u2699\uFE0F Settings"].map(
      (t, i) => `<button onclick="window._srMenu.showTab(${i})" id="tab-${i}" style="
              flex:1;height:38px;border-radius:99px;border:2px solid rgba(255,255,255,${i === 0 ? "0.5" : "0.15"});
              background:${i === 0 ? "rgba(255,255,255,0.18)" : "transparent"};
              color:rgba(255,255,255,${i === 0 ? "1" : "0.55"});font-size:12px;font-weight:700;cursor:pointer;
              font-family:'Baloo 2',sans-serif;
            ">${t}</button>`
    ).join("")}
        </div>

        <!-- TAB CONTENT -->
        <div id="tab-content" style="max-height:160px;overflow-y:auto;">
          ${this._buildSkinsTab()}
        </div>
      </div>
    `;
    this._container.appendChild(ui);
    this._el = ui;
    window._srMenu = this;
    document.getElementById("btn-play").addEventListener("click", () => {
      this._audio.init();
      this._audio.sfxSkinSelect();
      this._onPlay();
    });
    document.getElementById("btn-play").addEventListener("pointerdown", function() {
      this.style.transform = "translateY(4px)";
      this.style.boxShadow = "0 4px 0 rgba(0,0,0,0.3)";
    });
    document.getElementById("btn-play").addEventListener("pointerup", function() {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  }
  _buildSkinsTab() {
    return `<div style="display:flex;gap:10px;overflow-x:auto;padding:4px 2px 8px;">
      ${SKINS.ALL.map((s) => {
      const unlocked = this._save.isSkinUnlocked(s.id);
      const active = this._save.activeSkin === s.id;
      const canAfford = this._save.totalCoins >= s.cost;
      return `<div onclick="window._srMenu.selectSkin('${s.id}')" style="
          flex-shrink:0;width:82px;text-align:center;cursor:pointer;
          background:${active ? "rgba(255,111,165,0.25)" : "rgba(255,255,255,0.07)"};
          border:2px solid ${active ? "#FF6FA5" : "rgba(255,255,255,0.12)"};
          border-radius:16px;padding:10px 8px;
          transition:transform .12s;
        ">
          <div style="font-size:26px;margin-bottom:4px;">${this._skinEmoji(s.id)}</div>
          <div style="font-size:11px;font-weight:700;color:${active ? "#FF6FA5" : "rgba(255,255,255,0.8)"};">${s.name}</div>
          <div style="font-size:10px;margin-top:3px;color:${unlocked ? "#4ADE80" : "#FBBF24"};">
            ${unlocked ? active ? "\u2713 Active" : "Equip" : "\u{1FA99} " + s.cost.toLocaleString()}
          </div>
        </div>`;
    }).join("")}
    </div>`;
  }
  _buildWorldTab() {
    return `<div style="display:flex;gap:10px;overflow-x:auto;padding:4px 2px 8px;">
      ${ENVIRONMENTS.ALL.map((e) => {
      const active = this._save.activeEnv === e.id;
      const colors = { city: "#C04CFF", jungle: "#22C55E", space: "#6366F1" };
      return `<div onclick="window._srMenu.selectEnv('${e.id}')" style="
          flex-shrink:0;width:100px;text-align:center;cursor:pointer;
          background:${active ? `${colors[e.id]}33` : "rgba(255,255,255,0.07)"};
          border:2px solid ${active ? colors[e.id] : "rgba(255,255,255,0.12)"};
          border-radius:16px;padding:12px 8px;
        ">
          <div style="font-size:24px;margin-bottom:4px;">${e.id === "city" ? "\u{1F306}" : e.id === "jungle" ? "\u{1F334}" : "\u{1F680}"}</div>
          <div style="font-size:12px;font-weight:700;color:${active ? colors[e.id] : "rgba(255,255,255,0.8)"};">${e.name}</div>
          <div style="font-size:10px;color:${e.unlocked ? "#4ADE80" : "rgba(255,255,255,0.4)"};margin-top:3px;">
            ${e.unlocked ? "Available" : "Locked"}
          </div>
        </div>`;
    }).join("")}
    </div>`;
  }
  _buildSettingsTab() {
    const s = this._save.settings;
    return `<div style="display:flex;flex-direction:column;gap:10px;padding:4px 2px;">
      ${[["\u{1F50A} Sound", "sound"], ["\u{1F4F3} Haptics", "haptics"]].map(([label, key]) => `
        <div style="display:flex;align-items:center;justify-content:space-between;
          background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);
          border-radius:14px;padding:12px 16px;">
          <span style="font-size:14px;font-weight:700;color:#fff;">${label}</span>
          <div onclick="window._srMenu.toggleSetting('${key}')" id="toggle-${key}" style="
            width:48px;height:28px;border-radius:99px;cursor:pointer;position:relative;
            background:${s[key] ? "linear-gradient(135deg,#FF6FA5,#C04CFF)" : "rgba(255,255,255,0.15)"};
            transition:background .2s;
          ">
            <div style="
              position:absolute;top:4px;${s[key] ? "right:4px" : "left:4px"};
              width:20px;height:20px;border-radius:50%;background:#fff;
              transition:all .2s;box-shadow:0 2px 4px rgba(0,0,0,0.3);
            "></div>
          </div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:rgba(255,255,255,0.35);text-align:center;padding:4px 0;">
        Sky Runner v1.0 \xB7 Deepu Siva Private Limited
      </div>
    </div>`;
  }
  _skinEmoji(id) {
    return { rosa: "\u{1F467}", ninja: "\u{1F977}", space: "\u{1F468}\u200D\u{1F680}", dino: "\u{1F995}", robot: "\u{1F916}" }[id] || "\u{1F600}";
  }
  /* ─── TAB SWITCHING ─── */
  showTab(idx) {
    const content = document.getElementById("tab-content");
    if (!content)
      return;
    content.innerHTML = [
      this._buildSkinsTab(),
      this._buildWorldTab(),
      this._buildSettingsTab()
    ][idx];
    for (let i = 0; i < 3; i++) {
      const t = document.getElementById("tab-" + i);
      if (!t)
        continue;
      t.style.background = i === idx ? "rgba(255,255,255,0.18)" : "transparent";
      t.style.borderColor = i === idx ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)";
      t.style.color = i === idx ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.55)";
    }
  }
  /* ─── ACTIONS ─── */
  selectSkin(id) {
    const skin = SKINS.ALL.find((s) => s.id === id);
    if (!skin)
      return;
    if (!this._save.isSkinUnlocked(id)) {
      if (!this._save.buySkin(id)) {
        this._showToast("Not enough coins! \u{1FA99}");
        return;
      }
    }
    this._save.setActiveSkin(id);
    this._audio.sfxSkinSelect();
    this._updatePreviewSkin(id);
    this.showTab(0);
    const mc = document.getElementById("menu-coins");
    if (mc)
      mc.textContent = this._save.totalCoins.toLocaleString();
  }
  selectEnv(id) {
    const env = ENVIRONMENTS.ALL.find((e) => e.id === id);
    if (!env || !env.unlocked) {
      this._showToast("Complete more runs to unlock!");
      return;
    }
    this._save.setActiveEnv(id);
    this.showTab(1);
  }
  toggleSetting(key) {
    const current = this._save.settings[key];
    this._save.updateSettings({ [key]: !current });
    if (key === "sound") {
      if (!current)
        this._audio.enable();
      else
        this._audio.disable();
    }
    this.showTab(2);
  }
  _updatePreviewSkin(skinId) {
    const texMap = {
      rosa: TextureGenerator.skinRosa(),
      ninja: TextureGenerator.skinNinja(),
      space: TextureGenerator.skinSpace(),
      dino: TextureGenerator.skinDino()
    };
    this._bodyMat.map = texMap[skinId] || texMap.rosa;
    this._bodyMat.needsUpdate = true;
  }
  _showToast(msg) {
    const t = document.createElement("div");
    t.style.cssText = `
      position:absolute;bottom:280px;left:50%;transform:translateX(-50%);
      background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);
      color:#fff;font-size:13px;font-weight:700;
      padding:10px 22px;border-radius:99px;white-space:nowrap;
      border:1px solid rgba(255,255,255,0.15);z-index:200;
      animation:srPopFloat 2s ease forwards;
    `;
    t.textContent = msg;
    this._container.appendChild(t);
    setTimeout(() => t.remove(), 2e3);
  }
  _showDailyReward(coins) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:absolute;inset:0;background:rgba(10,0,25,0.85);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:14px;z-index:100;backdrop-filter:blur(4px);font-family:'Baloo 2',sans-serif;
    `;
    overlay.innerHTML = `
      <div style="font-size:56px;animation:srBounce .5s ease;">\u{1F381}</div>
      <div style="font-size:22px;font-weight:800;color:#fff;">Daily Reward!</div>
      <div style="display:flex;align-items:center;gap:8px;font-size:28px;font-weight:800;color:#FBBF24;">
        \u{1FA99} +${coins}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.6);">Come back tomorrow for more!</div>
      <button onclick="this.closest('[style]').remove();" style="
        background:linear-gradient(135deg,#FF6FA5,#C04CFF);color:#fff;border:none;
        padding:13px 36px;border-radius:99px;font-size:16px;font-weight:800;
        cursor:pointer;font-family:'Baloo 2',sans-serif;box-shadow:0 6px 0 rgba(0,0,0,0.25);
        margin-top:4px;
      ">Claim! \u{1F389}</button>
    `;
    this._container.appendChild(overlay);
  }
  /* ─── UPDATE / RENDER ─── */
  update(timestamp) {
    this._frame++;
    const swing = Math.sin(this._frame * 0.06) * 0.4;
    if (this._legL)
      this._legL.rotation.x = swing;
    if (this._legR)
      this._legR.rotation.x = -swing;
    if (this._charGroup) {
      this._charGroup.rotation.y = Math.sin(this._frame * 0.012) * 0.3;
      this._charGroup.position.y = Math.sin(this._frame * 0.04) * 0.04;
    }
    this._fillLight.intensity = 0.6 + Math.sin(this._frame * 0.03) * 0.2;
  }
  render() {
    this._renderer.render(this._scene, this._camera);
  }
  handleResize(w, h) {
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
  }
  dispose() {
    window._srMenu = null;
    if (this._el)
      this._el.remove();
  }
};

// src/scenes/GameScene.js
var THREE9 = __toESM(require_three());

// src/entities/Player.js
var THREE3 = __toESM(require_three());

// src/utils/MathUtils.js
var MathUtils = {
  /** Linear interpolation */
  lerp(a, b, t) {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  },
  /** Smooth step easing (ease in/out) */
  smoothstep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  },
  /** Clamp value between min and max */
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  },
  /** Random float between min and max */
  randFloat(min, max) {
    return min + Math.random() * (max - min);
  },
  /** Random integer between min and max (inclusive) */
  randInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  },
  /** Pick a random element from an array */
  randItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  /** Elastic ease-out (bouncy) */
  easeOutElastic(t) {
    const c4 = 2 * Math.PI / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  /** Ease out cubic */
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },
  /** Ease in quad */
  easeInQuad(t) {
    return t * t;
  },
  /** Convert degrees to radians */
  degToRad(deg) {
    return deg * (Math.PI / 180);
  },
  /** Distance between two 3D points */
  dist3d(a, b) {
    return Math.sqrt(
      (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
    );
  },
  /** Map a value from one range to another */
  mapRange(v, inMin, inMax, outMin, outMax) {
    return outMin + (v - inMin) / (inMax - inMin) * (outMax - outMin);
  },
  /** Oscillate between -1 and 1 */
  oscillate(t, freq = 1) {
    return Math.sin(t * freq * Math.PI * 2);
  }
};

// src/entities/Player.js
var Player = class {
  constructor(scene) {
    this._scene = scene;
    this._group = new THREE3.Group();
    this._scene.add(this._group);
    this._lane = PLAYER.START_LANE;
    this._targetX = TRACK.LANE_POSITIONS[this._lane];
    this._vy = 0;
    this._onGround = true;
    this._jumpCount = 0;
    this._isRolling = false;
    this._rollTimer = 0;
    this._invincible = 0;
    this._isDead = false;
    this._frame = 0;
    this._leanAngle = 0;
    this._activeSkin = "rosa";
    this._buildModel();
    this._listenForEvents();
    this._group.position.set(
      TRACK.LANE_POSITIONS[this._lane],
      0,
      PLAYER.START_Z
    );
  }
  /* ═══════════════════════════════
     MODEL BUILDING
  ═══════════════════════════════ */
  _buildModel() {
    this._bodyGroup = new THREE3.Group();
    this._group.add(this._bodyGroup);
    const shadowGeo = new THREE3.CircleGeometry(0.42, 12);
    const shadowMat = new THREE3.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.25, depthWrite: false });
    this._shadow = new THREE3.Mesh(shadowGeo, shadowMat);
    this._shadow.rotation.x = -Math.PI / 2;
    this._shadow.position.y = 0.01;
    this._group.add(this._shadow);
    const bodyGeo = new THREE3.CylinderGeometry(0.38, 0.42, 0.85, 12);
    this._bodyMat = new THREE3.MeshLambertMaterial({ map: TextureGenerator.skinRosa(), emissive: 2228241, emissiveIntensity: 0.3 });
    this._body = new THREE3.Mesh(bodyGeo, this._bodyMat);
    this._body.position.y = 1.1;
    this._body.castShadow = true;
    this._bodyGroup.add(this._body);
    const headGeo = new THREE3.SphereGeometry(0.36, 14, 10);
    const headMat = new THREE3.MeshLambertMaterial({ color: 16757702 });
    this._head = new THREE3.Mesh(headGeo, headMat);
    this._head.position.y = 1.85;
    this._head.castShadow = true;
    this._bodyGroup.add(this._head);
    const hairGeo = new THREE3.SphereGeometry(0.38, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const hairMat = new THREE3.MeshLambertMaterial({ color: 11342935 });
    this._hair = new THREE3.Mesh(hairGeo, hairMat);
    this._hair.position.y = 1.88;
    this._bodyGroup.add(this._hair);
    this._eyes = new THREE3.Group();
    [-0.13, 0.13].forEach((ex, i) => {
      const eyeWhiteGeo = new THREE3.SphereGeometry(0.09, 8, 6);
      const eyeWhite = new THREE3.Mesh(eyeWhiteGeo, new THREE3.MeshBasicMaterial({ color: 16777215 }));
      eyeWhite.position.set(ex, 1.9, -0.31);
      const pupilGeo = new THREE3.SphereGeometry(0.045, 7, 5);
      const pupil = new THREE3.Mesh(pupilGeo, new THREE3.MeshBasicMaterial({ color: 2236962 }));
      pupil.position.set(ex * 1.05, 1.88, -0.375);
      const shineGeo = new THREE3.SphereGeometry(0.018, 5, 4);
      const shine = new THREE3.Mesh(shineGeo, new THREE3.MeshBasicMaterial({ color: 16777215 }));
      shine.position.set(ex * 0.9 - 0.03, 1.92, -0.39);
      this._eyes.add(eyeWhite, pupil, shine);
    });
    this._bodyGroup.add(this._eyes);
    const smileGeo = new THREE3.TorusGeometry(0.09, 0.018, 5, 10, Math.PI);
    const smileMat = new THREE3.MeshBasicMaterial({ color: 8916559 });
    this._smile = new THREE3.Mesh(smileGeo, smileMat);
    this._smile.rotation.x = Math.PI * 0.1;
    this._smile.position.set(0, 1.73, -0.35);
    this._bodyGroup.add(this._smile);
    const packGeo = new THREE3.BoxGeometry(0.55, 0.62, 0.28);
    const packMat = new THREE3.MeshLambertMaterial({ color: 16765503 });
    this._pack = new THREE3.Mesh(packGeo, packMat);
    this._pack.position.set(0, 1.2, 0.36);
    this._pack.castShadow = true;
    this._bodyGroup.add(this._pack);
    this._legL = this._makeLeg(-0.2, 16740261);
    this._legR = this._makeLeg(0.2, 12602623);
    this._bodyGroup.add(this._legL.group, this._legR.group);
    this._shoeL = this._makeShoe(-0.2, 16740261);
    this._shoeR = this._makeShoe(0.2, 12602623);
    this._bodyGroup.add(this._shoeL, this._shoeR);
    this._armL = this._makeArm(-0.5);
    this._armR = this._makeArm(0.5);
    this._bodyGroup.add(this._armL.group, this._armR.group);
  }
  _makeLeg(x, color) {
    const group = new THREE3.Group();
    group.position.set(x, 0.5, 0);
    const geo = new THREE3.CylinderGeometry(0.14, 0.12, 0.58, 8);
    const mat = new THREE3.MeshLambertMaterial({ color: 10233776 });
    const mesh = new THREE3.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);
    return { group, mesh };
  }
  _makeShoe(x, color) {
    const geo = new THREE3.BoxGeometry(0.28, 0.16, 0.42);
    const mat = new THREE3.MeshLambertMaterial({ color });
    const mesh = new THREE3.Mesh(geo, mat);
    mesh.position.set(x, 0.12, 0.06);
    mesh.castShadow = true;
    return mesh;
  }
  _makeArm(x) {
    const group = new THREE3.Group();
    group.position.set(x * 0.9, 1.1, 0);
    const geo = new THREE3.CylinderGeometry(0.1, 0.09, 0.55, 7);
    const mat = new THREE3.MeshLambertMaterial({ map: this._bodyMat.map });
    const mesh = new THREE3.Mesh(geo, mat);
    mesh.rotation.z = x > 0 ? -0.4 : 0.4;
    mesh.castShadow = true;
    group.add(mesh);
    return { group, mesh };
  }
  /* ═══════════════════════════════
     SKIN SYSTEM
  ═══════════════════════════════ */
  applySkin(skinId) {
    this._activeSkin = skinId;
    const texMap = {
      rosa: TextureGenerator.skinRosa(),
      ninja: TextureGenerator.skinNinja(),
      space: TextureGenerator.skinSpace(),
      dino: TextureGenerator.skinDino()
    };
    const tex = texMap[skinId] || texMap.rosa;
    this._bodyMat.map = tex;
    this._bodyMat.needsUpdate = true;
    const skinColors = {
      rosa: { hair: 11342935, head: 16757702, leg: 10233776 },
      ninja: { hair: 1118481, head: 16757702, leg: 1710618 },
      space: { hair: 870305, head: 11789820, leg: 1402304 },
      dino: { hair: 1793568, head: 10868391, leg: 3706428 },
      robot: { hair: 4342338, head: 12434877, leg: 6381921 }
    };
    const sc = skinColors[skinId] || skinColors.rosa;
    this._hair.material.color.setHex(sc.hair);
    this._head.material.color.setHex(sc.head);
    this._legL.mesh.material.color.setHex(sc.leg);
    this._legR.mesh.material.color.setHex(sc.leg);
  }
  /* ═══════════════════════════════
     INPUT / PHYSICS
  ═══════════════════════════════ */
  _listenForEvents() {
    Bus.on(EVENTS.INPUT_LEFT, () => this._switchLane(-1));
    Bus.on(EVENTS.INPUT_RIGHT, () => this._switchLane(1));
    Bus.on(EVENTS.INPUT_JUMP, () => this._jump());
    Bus.on(EVENTS.INPUT_ROLL, () => this._roll());
  }
  _switchLane(dir) {
    if (this._isDead)
      return;
    const newLane = MathUtils.clamp(this._lane + dir, 0, 2);
    if (newLane === this._lane)
      return;
    this._lane = newLane;
    this._targetX = TRACK.LANE_POSITIONS[newLane];
    Bus.emit(EVENTS.PLAYER_LANE_CHANGE, { lane: newLane });
    if (navigator.vibrate)
      navigator.vibrate(15);
  }
  _jump() {
    if (this._isDead)
      return;
    if (this._isRolling) {
      this._endRoll();
      return;
    }
    if (this._onGround || this._jumpCount < 2) {
      this._vy = this._jumpCount === 0 ? PLAYER.JUMP_VELOCITY : PLAYER.JUMP_DOUBLE_VELOCITY;
      this._onGround = false;
      this._jumpCount++;
      Bus.emit(EVENTS.PLAYER_JUMP, { position: this._group.position });
      if (navigator.vibrate)
        navigator.vibrate(10);
    }
  }
  _roll() {
    if (this._isDead || !this._onGround)
      return;
    this._isRolling = true;
    this._rollTimer = 50;
    this._bodyGroup.scale.y = 0.45;
    this._bodyGroup.position.y = -0.85;
    Bus.emit(EVENTS.PLAYER_ROLL, { position: this._group.position });
  }
  _endRoll() {
    this._isRolling = false;
    this._bodyGroup.scale.y = 1;
    this._bodyGroup.position.y = 0;
  }
  /* ═══════════════════════════════
     UPDATE (called every frame)
  ═══════════════════════════════ */
  update(dt) {
    this._frame++;
    this._group.position.x = MathUtils.lerp(
      this._group.position.x,
      this._targetX,
      PLAYER.LANE_SWITCH_SPEED
    );
    if (!this._onGround) {
      this._vy += PLAYER.GRAVITY;
      this._group.position.y += this._vy;
      if (this._group.position.y <= TRACK.GROUND_Y) {
        this._group.position.y = TRACK.GROUND_Y;
        this._vy = 0;
        this._onGround = true;
        this._jumpCount = 0;
        Bus.emit(EVENTS.PLAYER_LAND, { position: this._group.position });
      }
    }
    if (this._isRolling) {
      this._rollTimer--;
      if (this._rollTimer <= 0)
        this._endRoll();
    }
    if (this._invincible > 0) {
      this._invincible--;
      this._bodyGroup.visible = Math.floor(this._invincible / 5) % 2 === 0;
    } else {
      this._bodyGroup.visible = true;
    }
    const airHeight = this._group.position.y;
    this._shadow.scale.setScalar(Math.max(0.3, 1 - airHeight * 0.12));
    if (this._onGround && !this._isRolling) {
      const swing = Math.sin(this._frame * 0.28) * 0.45;
      this._legL.group.rotation.x = swing;
      this._legR.group.rotation.x = -swing;
      this._armL.group.rotation.x = -swing * 0.6;
      this._armR.group.rotation.x = swing * 0.6;
      this._bodyGroup.position.y = Math.abs(Math.sin(this._frame * 0.28)) * 0.04;
    } else if (!this._onGround) {
      this._bodyGroup.rotation.x = -0.18;
      this._legL.group.rotation.x = -0.3;
      this._legR.group.rotation.x = 0.3;
    } else {
      this._bodyGroup.rotation.x = 0;
    }
    const leanTarget = (this._targetX - this._group.position.x) * -0.5;
    this._leanAngle = MathUtils.lerp(this._leanAngle, leanTarget, 0.12);
    this._bodyGroup.rotation.z = this._leanAngle;
    this._head.rotation.y = MathUtils.lerp(this._head.rotation.y, -this._leanAngle * 0.5, 0.15);
  }
  /* ═══════════════════════════════
     COLLISION
  ═══════════════════════════════ */
  /** Returns true if this player position overlaps the given bounding box */
  checkCollision(obstacleBox) {
    if (this._invincible > 0)
      return false;
    const px = this._group.position.x;
    const py = this._group.position.y;
    const pz = PLAYER.START_Z;
    const playerYBottom = py + 0.15;
    const playerYTop = py + (this._isRolling ? 0.85 : 1.65);
    const obsYBottom = 0;
    const obsYTop = obstacleBox.y + (obstacleBox.height || 0.9);
    const xOverlap = Math.abs(px - obstacleBox.x) < PLAYER.COLLISION_RADIUS_X + obstacleBox.rx;
    const zOverlap = Math.abs(pz - obstacleBox.z) < PLAYER.COLLISION_RADIUS_Z + obstacleBox.rz;
    const yOverlap = playerYBottom < obsYTop && playerYTop > obsYBottom + 0.15;
    return xOverlap && zOverlap && yOverlap;
  }
  hit() {
    this._invincible = PLAYER.INVINCIBLE_DURATION;
    Bus.emit(EVENTS.PLAYER_HIT, { position: this._group.position.clone() });
    if (navigator.vibrate)
      navigator.vibrate([60, 30, 60]);
  }
  die() {
    this._isDead = true;
    const spinInterval = setInterval(() => {
      this._bodyGroup.rotation.y += 0.2;
      this._group.position.y -= 0.04;
    }, 16);
    setTimeout(() => clearInterval(spinInterval), 800);
    Bus.emit(EVENTS.PLAYER_DIED, { position: this._group.position.clone() });
  }
  reset() {
    this._lane = PLAYER.START_LANE;
    this._targetX = TRACK.LANE_POSITIONS[this._lane];
    this._vy = 0;
    this._onGround = true;
    this._jumpCount = 0;
    this._isRolling = false;
    this._invincible = 0;
    this._isDead = false;
    this._frame = 0;
    this._leanAngle = 0;
    this._group.position.set(TRACK.LANE_POSITIONS[this._lane], 0, PLAYER.START_Z);
    this._bodyGroup.position.y = 0;
    this._bodyGroup.rotation.set(0, 0, 0);
    this._bodyGroup.scale.set(1, 1, 1);
    this._bodyGroup.visible = true;
    this._endRoll();
  }
  get position() {
    return this._group.position;
  }
  get lane() {
    return this._lane;
  }
  get isDead() {
    return this._isDead;
  }
  dispose() {
    this._scene.remove(this._group);
    Bus.clear(EVENTS.INPUT_LEFT);
    Bus.clear(EVENTS.INPUT_RIGHT);
    Bus.clear(EVENTS.INPUT_JUMP);
    Bus.clear(EVENTS.INPUT_ROLL);
  }
};

// src/entities/Track.js
var THREE4 = __toESM(require_three());
var Track = class {
  constructor(scene) {
    this._scene = scene;
    this._segments = [];
    this._offset = 0;
    this._buildSegments();
    this._buildWalls();
    this._buildLaneDividers();
    this._buildEdgeDecorations();
  }
  _buildSegments() {
    const segW = TRACK.LANE_WIDTH * 3 + 0.8;
    const segLen = TRACK.SEGMENT_LENGTH;
    const trackTex = TextureGenerator.track();
    for (let i = 0; i < TRACK.NUM_SEGMENTS; i++) {
      const geo = new THREE4.BoxGeometry(segW, 0.18, segLen);
      const mat = new THREE4.MeshLambertMaterial({ map: trackTex, color: 14531583 });
      const mesh = new THREE4.Mesh(geo, mat);
      mesh.receiveShadow = true;
      mesh.position.set(0, -0.09, TRACK.SCROLL_START_Z - i * segLen);
      this._scene.add(mesh);
      this._segments.push(mesh);
    }
  }
  _buildWalls() {
    const colors = [16724872, 12255487];
    const totalLen = TRACK.NUM_SEGMENTS * TRACK.SEGMENT_LENGTH;
    [-TRACK.SIDE_WALL_X, TRACK.SIDE_WALL_X].forEach((x, i) => {
      const wallGeo = new THREE4.BoxGeometry(0.22, 1.4, totalLen);
      const wallMat = new THREE4.MeshLambertMaterial({ color: colors[i] });
      const wall = new THREE4.Mesh(wallGeo, wallMat);
      wall.position.set(x, 0.7, TRACK.SCROLL_START_Z - totalLen / 2 + 8);
      wall.castShadow = true;
      this._scene.add(wall);
      this._walls = this._walls || [];
      this._walls.push(wall);
      const stripeGeo = new THREE4.BoxGeometry(0.28, 0.12, totalLen);
      const stripeMat = new THREE4.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.8 });
      const stripe = new THREE4.Mesh(stripeGeo, stripeMat);
      stripe.position.set(x, 1.46, TRACK.SCROLL_START_Z - totalLen / 2 + 8);
      this._scene.add(stripe);
      for (let z = 0; z > -totalLen; z -= 8) {
        const postGeo = new THREE4.BoxGeometry(0.3, 1.6, 0.3);
        const postMat = new THREE4.MeshLambertMaterial({ color: 2956126 });
        const post = new THREE4.Mesh(postGeo, postMat);
        post.position.set(x, 0.8, TRACK.SCROLL_START_Z + z);
        post.castShadow = true;
        this._scene.add(post);
      }
    });
  }
  _buildLaneDividers() {
    const dashLen = 0.5;
    const dashGap = 1.2;
    const dashH = 0.01;
    const totalLen = TRACK.NUM_SEGMENTS * TRACK.SEGMENT_LENGTH;
    const dashMat = new THREE4.MeshBasicMaterial({ color: 16777215, transparent: true, opacity: 0.75 });
    [-1.1, 1.1].forEach((x) => {
      for (let z = 0; z > -totalLen; z -= dashLen + dashGap) {
        const geo = new THREE4.BoxGeometry(0.06, dashH, dashLen);
        const dash = new THREE4.Mesh(geo, dashMat);
        dash.position.set(x, 0.01, TRACK.SCROLL_START_Z + z);
        this._scene.add(dash);
      }
    });
  }
  _buildEdgeDecorations() {
    const lightColors = [16724872, 14483711, 61183, 16772608, 65416, 16737792];
    const totalLen = TRACK.NUM_SEGMENTS * TRACK.SEGMENT_LENGTH;
    for (let z = 0; z > -totalLen; z -= 5) {
      [-TRACK.SIDE_WALL_X + 0.2, TRACK.SIDE_WALL_X - 0.2].forEach((x, si) => {
        const col = lightColors[Math.floor(Math.abs(z) / 5 + si) % lightColors.length];
        const geo = new THREE4.SphereGeometry(0.14, 6, 5);
        const mat = new THREE4.MeshBasicMaterial({ color: col });
        const orb = new THREE4.Mesh(geo, mat);
        orb.position.set(x, 0.1, TRACK.SCROLL_START_Z + z);
        this._scene.add(orb);
      });
    }
  }
  /** Called every frame — moves segments, recycles them when they pass camera */
  update(speed) {
    this._offset += speed * 2.2;
    const segLen = TRACK.SEGMENT_LENGTH;
    const totalLen = segLen * TRACK.NUM_SEGMENTS;
    this._segments.forEach((seg) => {
      seg.position.z += speed * 2.2;
      if (seg.position.z > TRACK.SCROLL_START_Z + segLen) {
        seg.position.z -= totalLen;
      }
    });
  }
  dispose() {
    this._segments.forEach((s) => {
      this._scene.remove(s);
      s.geometry.dispose();
      s.material.dispose();
    });
  }
};

// src/entities/Obstacle.js
var THREE5 = __toESM(require_three());

// src/utils/ObjectPool.js
var ObjectPool = class {
  constructor(factory, initialSize = 10) {
    this._factory = factory;
    this._pool = [];
    this._active = [];
    for (let i = 0; i < initialSize; i++) {
      const obj = factory();
      obj._pooled = true;
      obj._active = false;
      this._pool.push(obj);
    }
  }
  /** Get an object from the pool (or create a new one if empty) */
  get() {
    let obj;
    if (this._pool.length > 0) {
      obj = this._pool.pop();
    } else {
      obj = this._factory();
      obj._pooled = true;
    }
    obj._active = true;
    this._active.push(obj);
    return obj;
  }
  /** Return an object to the pool */
  release(obj) {
    obj._active = false;
    const idx = this._active.indexOf(obj);
    if (idx !== -1)
      this._active.splice(idx, 1);
    this._pool.push(obj);
  }
  /** Release all active objects */
  releaseAll() {
    while (this._active.length > 0) {
      this.release(this._active[0]);
    }
  }
  /** Iterate over all active objects */
  forEach(callback) {
    for (let i = this._active.length - 1; i >= 0; i--) {
      callback(this._active[i], i);
    }
  }
  get activeCount() {
    return this._active.length;
  }
  get pooledCount() {
    return this._pool.length;
  }
};

// src/entities/Obstacle.js
var BoxCrate = class {
  constructor(scene) {
    const geo = new THREE5.BoxGeometry(0.9, 0.9, 0.9);
    const mat = new THREE5.MeshLambertMaterial({ map: TextureGenerator.crateBox(), emissive: 4456448, emissiveIntensity: 0.4 });
    this.mesh = new THREE5.Mesh(geo, mat);
    this.mesh.castShadow = true;
    this.mesh.visible = false;
    const topGeo = new THREE5.BoxGeometry(0.9, 0.06, 0.9);
    const topMat = new THREE5.MeshBasicMaterial({ color: 16777215, transparent: true, opacity: 0.15 });
    this._top = new THREE5.Mesh(topGeo, topMat);
    this._top.position.y = 0.48;
    this.mesh.add(this._top);
    scene.add(this.mesh);
    this.type = "box";
    this.rx = 0.42;
    this.rz = 0.42;
    this.height = 0.9;
    this.y = 0.45;
  }
  activate(laneX, z) {
    this.mesh.position.set(laneX, 0.45, z);
    this.mesh.rotation.set(0, MathUtils.randFloat(0, Math.PI), 0);
    this.mesh.visible = true;
  }
  deactivate() {
    this.mesh.visible = false;
  }
  update(speed) {
    this.mesh.position.z += speed * 2.2;
    this.mesh.rotation.y += 0.01;
  }
  get z() {
    return this.mesh.position.z;
  }
  get x() {
    return this.mesh.position.x;
  }
  get boundingBox() {
    return { x: this.x, y: this.y, z: this.z, rx: this.rx, rz: this.rz, height: this.height };
  }
};
var Barrier = class {
  constructor(scene) {
    this._group = new THREE5.Group();
    const bodyGeo = new THREE5.BoxGeometry(1.8, 1, 0.32);
    const bodyMat = new THREE5.MeshLambertMaterial({ color: 16750848, emissive: 4465152, emissiveIntensity: 0.5 });
    this._body = new THREE5.Mesh(bodyGeo, bodyMat);
    this._body.position.y = 0.5;
    this._body.castShadow = true;
    this._group.add(this._body);
    const stripeCount = 5;
    for (let i = 0; i < stripeCount; i++) {
      const sGeo = new THREE5.BoxGeometry(0.22, 1.02, 0.34);
      const sMat = new THREE5.MeshLambertMaterial({ color: 1118481, transparent: true, opacity: 0.45 });
      const s = new THREE5.Mesh(sGeo, sMat);
      s.position.set(-0.72 + i * 0.36, 0.5, 0);
      this._group.add(s);
    }
    [-0.92, 0.92].forEach((x) => {
      const pGeo = new THREE5.CylinderGeometry(0.1, 0.1, 1.1, 7);
      const pMat = new THREE5.MeshLambertMaterial({ color: 16748288 });
      const post = new THREE5.Mesh(pGeo, pMat);
      post.position.set(x, 0.55, 0);
      post.castShadow = true;
      this._group.add(post);
    });
    const rGeo = new THREE5.BoxGeometry(1.85, 0.1, 0.36);
    const rMat = new THREE5.MeshBasicMaterial({ color: 16777215, transparent: true, opacity: 0.5 });
    const reflector = new THREE5.Mesh(rGeo, rMat);
    reflector.position.y = 1;
    this._group.add(reflector);
    this._group.visible = false;
    scene.add(this._group);
    this.type = "barrier";
    this.rx = 0.88;
    this.rz = 0.2;
    this.height = 1;
    this.y = 0.5;
  }
  activate(laneX, z) {
    this._group.position.set(laneX, 0, z);
    this._group.visible = true;
  }
  deactivate() {
    this._group.visible = false;
  }
  update(speed) {
    this._group.position.z += speed * 2.2;
    this._body.rotation.y = Math.sin(Date.now() * 2e-3) * 0.04;
  }
  get z() {
    return this._group.position.z;
  }
  get x() {
    return this._group.position.x;
  }
  get boundingBox() {
    return { x: this.x, y: this.y, z: this.z, rx: this.rx, rz: this.rz, height: this.height };
  }
};
var LowBeam = class {
  constructor(scene) {
    this._group = new THREE5.Group();
    const beamGeo = new THREE5.BoxGeometry(1.85, 0.22, 0.4);
    const beamMat = new THREE5.MeshLambertMaterial({ color: 11141375, emissive: 3342421, emissiveIntensity: 0.6 });
    this._beam = new THREE5.Mesh(beamGeo, beamMat);
    this._beam.position.y = 1.02;
    this._beam.castShadow = true;
    this._group.add(this._beam);
    const glowMat = new THREE5.MeshBasicMaterial({ color: 14696699, transparent: true, opacity: 0.35 });
    const glowGeo = new THREE5.BoxGeometry(1.85, 0.24, 0.42);
    this._glow = new THREE5.Mesh(glowGeo, glowMat);
    this._glow.position.y = 1.02;
    this._group.add(this._glow);
    [-0.7, 0.7].forEach((x) => {
      const pGeo = new THREE5.CylinderGeometry(0.08, 0.08, 1.1, 7);
      const pMat = new THREE5.MeshLambertMaterial({ color: 4854924 });
      const p = new THREE5.Mesh(pGeo, pMat);
      p.position.set(x, 0.55, 0);
      this._group.add(p);
    });
    this._group.visible = false;
    scene.add(this._group);
    this.type = "lowbeam";
    this.rx = 0.88;
    this.rz = 0.2;
    this.height = 1.2;
    this.y = 0.85;
  }
  activate(laneX, z) {
    this._group.position.set(laneX, 0, z);
    this._group.visible = true;
  }
  deactivate() {
    this._group.visible = false;
  }
  update(speed) {
    this._group.position.z += speed * 2.2;
    this._glow.material.opacity = 0.25 + Math.sin(Date.now() * 5e-3) * 0.15;
  }
  get z() {
    return this._group.position.z;
  }
  get x() {
    return this._group.position.x;
  }
  get boundingBox() {
    return { x: this.x, y: this.y, z: this.z, rx: this.rx, rz: this.rz, height: this.height };
  }
};
var ObstacleManager = class {
  constructor(scene) {
    this._scene = scene;
    this._active = [];
    this._spawnTimer = 0;
    this._spawnInterval = OBSTACLES.INITIAL_INTERVAL;
    this._difficulty = 0;
    this._pools = {
      box: new ObjectPool(() => new BoxCrate(scene), 8),
      barrier: new ObjectPool(() => new Barrier(scene), 6),
      lowbeam: new ObjectPool(() => new LowBeam(scene), 4)
    };
  }
  /** Call every frame. speed = current world scroll speed. */
  update(speed, deltaTime) {
    this._difficulty += deltaTime * OBSTACLES.DIFFICULTY_SCALE;
    this._spawnInterval = Math.max(
      OBSTACLES.MIN_INTERVAL,
      OBSTACLES.INITIAL_INTERVAL - this._difficulty * 5
    );
    this._spawnTimer -= deltaTime;
    if (this._spawnTimer <= 0) {
      this._spawn(speed);
      this._spawnTimer = this._spawnInterval;
    }
    for (let i = this._active.length - 1; i >= 0; i--) {
      const obs = this._active[i];
      obs.update(speed);
      if (obs.z > OBSTACLES.DESPAWN_Z) {
        obs.deactivate();
        this._pools[obs.type].release(obs);
        this._active.splice(i, 1);
      }
    }
  }
  _spawn(speed) {
    const laneIndex = MathUtils.randInt(0, 2);
    const laneX = TRACK.LANE_POSITIONS[laneIndex];
    const typeKeys = Object.keys(this._pools);
    let weights = [0.5, 0.35, 0.15];
    if (this._difficulty > 2)
      weights = [0.4, 0.35, 0.25];
    if (this._difficulty > 5)
      weights = [0.33, 0.34, 0.33];
    const r = Math.random();
    let type = typeKeys[0];
    let cumul = 0;
    for (let i = 0; i < typeKeys.length; i++) {
      cumul += weights[i];
      if (r < cumul) {
        type = typeKeys[i];
        break;
      }
    }
    const obs = this._pools[type].get();
    obs.activate(laneX, OBSTACLES.SPAWN_Z);
    this._active.push(obs);
    if (this._difficulty > 3 && Math.random() < 0.3) {
      const lane2 = laneIndex === 0 ? 2 : 0;
      const obs2 = this._pools["box"].get();
      obs2.activate(TRACK.LANE_POSITIONS[lane2], OBSTACLES.SPAWN_Z - MathUtils.randFloat(2, 5));
      this._active.push(obs2);
    }
  }
  get activeObstacles() {
    return this._active;
  }
  reset() {
    this._active.forEach((obs) => {
      obs.deactivate();
      this._pools[obs.type].release(obs);
    });
    this._active = [];
    this._spawnTimer = 1.5;
    this._difficulty = 0;
    this._spawnInterval = OBSTACLES.INITIAL_INTERVAL;
  }
  dispose() {
    this.reset();
  }
};

// src/entities/Coin.js
var THREE6 = __toESM(require_three());
var CoinMesh = class {
  constructor(scene) {
    this._group = new THREE6.Group();
    const geo = new THREE6.CylinderGeometry(0.24, 0.24, 0.09, 16);
    const mat = new THREE6.MeshLambertMaterial({
      map: TextureGenerator.coin(),
      emissive: 16755200,
      emissiveIntensity: 0.2
    });
    this._disc = new THREE6.Mesh(geo, mat);
    this._disc.rotation.x = Math.PI / 2;
    this._disc.castShadow = true;
    this._group.add(this._disc);
    const ringGeo = new THREE6.TorusGeometry(0.28, 0.045, 6, 18);
    const ringMat = new THREE6.MeshBasicMaterial({ color: 16752640, transparent: true, opacity: 0.55 });
    this._ring = new THREE6.Mesh(ringGeo, ringMat);
    this._ring.rotation.x = Math.PI / 2;
    this._group.add(this._ring);
    const spkGeo = new THREE6.OctahedronGeometry(0.07);
    const spkMat = new THREE6.MeshBasicMaterial({ color: 16777215, transparent: true, opacity: 0.8 });
    this._sparkle = new THREE6.Mesh(spkGeo, spkMat);
    this._sparkle.position.y = 0.32;
    this._group.add(this._sparkle);
    this._group.visible = false;
    scene.add(this._group);
    this.type = "coin";
    this.collected = false;
    this._age = 0;
  }
  activate(x, y, z) {
    this._group.position.set(x, y, z);
    this._group.visible = true;
    this.collected = false;
    this._age = Math.random() * Math.PI * 2;
  }
  deactivate() {
    this._group.visible = false;
  }
  update(speed) {
    this._group.position.z += speed * 2.2;
    this._age += 0.06;
    this._group.rotation.y += 0.055;
    this._group.position.y = this._group.position.y + Math.sin(this._age) * 2e-3;
    this._ring.material.opacity = 0.35 + Math.sin(this._age * 1.5) * 0.25;
    this._ring.scale.setScalar(1 + Math.sin(this._age * 1.5) * 0.08);
    this._sparkle.material.opacity = 0.4 + Math.sin(this._age * 3) * 0.4;
    this._sparkle.rotation.y += 0.12;
    this._sparkle.position.y = 0.32 + Math.sin(this._age * 2) * 0.04;
  }
  get z() {
    return this._group.position.z;
  }
  get x() {
    return this._group.position.x;
  }
  get y() {
    return this._group.position.y;
  }
  get worldPosition() {
    return this._group.position;
  }
};
var PowerUpMesh = class {
  constructor(scene) {
    this._group = new THREE6.Group();
    const orbGeo = new THREE6.SphereGeometry(0.36, 14, 10);
    const orbMat = new THREE6.MeshLambertMaterial({
      color: 13538264,
      transparent: true,
      opacity: 0.6
    });
    this._orb = new THREE6.Mesh(orbGeo, orbMat);
    this._group.add(this._orb);
    const coreGeo = new THREE6.SphereGeometry(0.26, 10, 8);
    this._coreMat = new THREE6.MeshLambertMaterial({ map: TextureGenerator.powerUp("boost") });
    this._core = new THREE6.Mesh(coreGeo, this._coreMat);
    this._group.add(this._core);
    const torusGeo = new THREE6.TorusGeometry(0.42, 0.04, 6, 20);
    const torusMat = new THREE6.MeshBasicMaterial({ color: 16740261, transparent: true, opacity: 0.7 });
    this._torus = new THREE6.Mesh(torusGeo, torusMat);
    this._torus.rotation.x = Math.PI / 3;
    this._group.add(this._torus);
    const torus2 = new THREE6.Mesh(
      new THREE6.TorusGeometry(0.42, 0.04, 6, 20),
      new THREE6.MeshBasicMaterial({ color: 12602623, transparent: true, opacity: 0.7 })
    );
    torus2.rotation.x = Math.PI / 3;
    torus2.rotation.y = Math.PI / 2;
    this._group.add(torus2);
    this._torus2 = torus2;
    this._group.visible = false;
    scene.add(this._group);
    this.type = "powerup";
    this.powerType = "magnet";
    this.collected = false;
    this._age = 0;
  }
  activate(x, y, z, powerType) {
    this.powerType = powerType;
    this.collected = false;
    this._group.position.set(x, y, z);
    this._group.visible = true;
    this._coreMat.map = TextureGenerator.powerUp(powerType);
    this._coreMat.needsUpdate = true;
    const colors = {
      magnet: [13538264, 8069026, 13538264],
      shield: [9489145, 1402304, 6600182],
      boost: [16764032, 15094016, 16758605],
      x2: [10868391, 1793568, 8505220]
    };
    const [orbCol, torusCol] = colors[powerType] || colors.boost;
    this._orb.material.color.setHex(orbCol);
    this._torus.material.color.setHex(torusCol);
    this._torus2.material.color.setHex(orbCol);
  }
  deactivate() {
    this._group.visible = false;
  }
  update(speed) {
    this._group.position.z += speed * 2.2;
    this._age += 0.05;
    this._group.rotation.y += 0.04;
    this._torus.rotation.z += 0.03;
    this._torus2.rotation.z -= 0.025;
    this._group.position.y = 0.9 + Math.sin(this._age * 1.5) * 0.18;
    const sc = 1 + Math.sin(this._age * 2) * 0.08;
    this._orb.scale.setScalar(sc);
  }
  get z() {
    return this._group.position.z;
  }
  get x() {
    return this._group.position.x;
  }
  get y() {
    return this._group.position.y;
  }
  get worldPosition() {
    return this._group.position;
  }
};
var CoinManager = class {
  constructor(scene) {
    this._scene = scene;
    this._activeCoins = [];
    this._activePwups = [];
    this._spawnTimer = 0;
    this._spawnInterval = 1.5;
    this._coinPool = new ObjectPool(() => new CoinMesh(scene), COINS.POOL_SIZE);
    this._pwupPool = new ObjectPool(() => new PowerUpMesh(scene), 6);
  }
  update(speed, deltaTime, playerPosition, magnetActive) {
    this._spawnTimer -= deltaTime;
    if (this._spawnTimer <= 0) {
      this._spawnRow(speed);
      this._spawnTimer = this._spawnInterval;
    }
    for (let i = this._activeCoins.length - 1; i >= 0; i--) {
      const c = this._activeCoins[i];
      c.update(speed);
      if (magnetActive) {
        const dx = playerPosition.x - c.x;
        const dz = playerPosition.z - c.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < COINS.MAGNET_RADIUS) {
          c._group.position.x += dx * 0.12;
          c._group.position.z += dz * 0.12;
        }
      }
      if (c.z > COINS.DESPAWN_Z) {
        c.deactivate();
        this._coinPool.release(c);
        this._activeCoins.splice(i, 1);
      }
    }
    for (let i = this._activePwups.length - 1; i >= 0; i--) {
      const p = this._activePwups[i];
      p.update(speed);
      if (p.z > COINS.DESPAWN_Z) {
        p.deactivate();
        this._pwupPool.release(p);
        this._activePwups.splice(i, 1);
      }
    }
  }
  _spawnRow(speed) {
    const lane = MathUtils.randInt(0, 2);
    const laneX = TRACK.LANE_POSITIONS[lane];
    const patterns = ["line", "arc", "zigzag", "cluster"];
    const pattern = MathUtils.randItem(patterns);
    if (Math.random() < POWERUPS.SPAWN_CHANCE) {
      const pwup = this._pwupPool.get();
      const type = MathUtils.randItem(POWERUPS.TYPES);
      pwup.activate(laneX, 1, COINS.SPAWN_Z, type);
      this._activePwups.push(pwup);
      return;
    }
    const count = MathUtils.randItem(COINS.ROW_COUNT);
    if (pattern === "line") {
      for (let i = 0; i < count; i++) {
        const c = this._coinPool.get();
        c.activate(laneX, 0.7, COINS.SPAWN_Z - i * 1.5);
        this._activeCoins.push(c);
      }
    } else if (pattern === "arc") {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const lx = TRACK.LANE_POSITIONS[i % 3];
        const ly = 0.7 + Math.sin(i / 4 * Math.PI) * 0.8;
        const c = this._coinPool.get();
        c.activate(lx, ly, COINS.SPAWN_Z - i * 1.3);
        this._activeCoins.push(c);
      }
    } else if (pattern === "zigzag") {
      for (let i = 0; i < count; i++) {
        const lx = TRACK.LANE_POSITIONS[i % 3];
        const c = this._coinPool.get();
        c.activate(lx, 0.7, COINS.SPAWN_Z - i * 1.2);
        this._activeCoins.push(c);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const lx = laneX + MathUtils.randFloat(-0.3, 0.3);
        const ly = 0.5 + MathUtils.randFloat(0, 0.9);
        const c = this._coinPool.get();
        c.activate(lx, ly, COINS.SPAWN_Z - i * 0.6);
        this._activeCoins.push(c);
      }
    }
  }
  /** Check coin/powerup collection. Returns { coins, powerType } */
  checkCollection(playerPosition, playerLane) {
    let coinsCollected = 0;
    let powerType = null;
    for (let i = this._activeCoins.length - 1; i >= 0; i--) {
      const c = this._activeCoins[i];
      const dx = Math.abs(playerPosition.x - c.x);
      const dy = Math.abs(playerPosition.y + 0.9 - c.y);
      const dz = Math.abs(playerPosition.z - c.z);
      if (dx < 0.65 && dy < 0.8 && dz < 1) {
        coinsCollected++;
        Bus.emit(EVENTS.COIN_COLLECTED, {
          position: { x: c.x, y: c.y, z: c.z },
          value: COINS.VALUE
        });
        c.deactivate();
        this._coinPool.release(c);
        this._activeCoins.splice(i, 1);
      }
    }
    for (let i = this._activePwups.length - 1; i >= 0; i--) {
      const p = this._activePwups[i];
      const dx = Math.abs(playerPosition.x - p.x);
      const dz = Math.abs(playerPosition.z - p.z);
      if (dx < 0.8 && dz < 1.1) {
        powerType = p.powerType;
        Bus.emit(EVENTS.POWERUP_COLLECTED, {
          position: { x: p.x, y: p.y, z: p.z },
          type: p.powerType
        });
        p.deactivate();
        this._pwupPool.release(p);
        this._activePwups.splice(i, 1);
        break;
      }
    }
    return { coinsCollected, powerType };
  }
  reset() {
    this._activeCoins.forEach((c) => {
      c.deactivate();
      this._coinPool.release(c);
    });
    this._activePwups.forEach((p) => {
      p.deactivate();
      this._pwupPool.release(p);
    });
    this._activeCoins = [];
    this._activePwups = [];
    this._spawnTimer = 1.5;
  }
};

// src/entities/Environment.js
var THREE7 = __toESM(require_three());
var Environment = class {
  constructor(scene, theme = "city") {
    this._scene = scene;
    this._theme = theme;
    this._groups = { far: [], mid: [], near: [] };
    this._clouds = [];
    this._stars = null;
    this._frame = 0;
    this._buildSky();
    this._buildStars();
    this._buildBuildings();
    this._buildClouds();
    this._buildGroundFog();
  }
  _buildSky() {
    const skyGeo = new THREE7.SphereGeometry(300, 16, 12);
    const skyMat = new THREE7.MeshBasicMaterial({
      map: TextureGenerator.skyGradient(this._theme),
      side: THREE7.BackSide
    });
    this._skyDome = new THREE7.Mesh(skyGeo, skyMat);
    this._scene.add(this._skyDome);
    const horizonGeo = new THREE7.PlaneGeometry(240, 30);
    const themeGlowColors = { city: 16740261, jungle: 2278750, space: 6514417 };
    const horizonMat = new THREE7.MeshBasicMaterial({
      color: themeGlowColors[this._theme] || 16740261,
      transparent: true,
      opacity: 0.18,
      side: THREE7.DoubleSide
    });
    const horizon = new THREE7.Mesh(horizonGeo, horizonMat);
    horizon.rotation.x = Math.PI / 2;
    horizon.position.set(0, 0.5, -80);
    this._scene.add(horizon);
  }
  _buildStars() {
    if (this._theme === "jungle")
      return;
    const count = this._theme === "space" ? 800 : 350;
    const verts = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 100 + Math.random() * 10;
      verts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    const geo = new THREE7.BufferGeometry();
    geo.setAttribute("position", new THREE7.Float32BufferAttribute(verts, 3));
    const mat = new THREE7.PointsMaterial({
      color: 16777215,
      size: this._theme === "space" ? 0.22 : 0.14,
      transparent: true,
      opacity: 0.9
    });
    this._stars = new THREE7.Points(geo, mat);
    this._scene.add(this._stars);
  }
  _buildBuildings() {
    const colors = ENVIRONMENTS.BUILDING_COLORS[this._theme] || ENVIRONMENTS.BUILDING_COLORS.city;
    const buildingTex = TextureGenerator.building("#2D1B5E");
    for (let i = 0; i < 14; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const xBase = side * (6.5 + Math.random() * 5);
      const h = 6 + Math.random() * 14;
      const w = 2 + Math.random() * 2.5;
      const z = -5 - i * 10 + Math.random() * 4;
      const geo = new THREE7.BoxGeometry(w, h, w * 0.7);
      const mat = new THREE7.MeshLambertMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        map: buildingTex
      });
      const mesh = new THREE7.Mesh(geo, mat);
      mesh.position.set(xBase, h / 2, z);
      mesh.castShadow = true;
      this._scene.add(mesh);
      this._groups.far.push({ mesh, baseZ: z, scrollSpeed: 0.35 });
      const lightGeo = new THREE7.SphereGeometry(0.12, 5, 4);
      const lightMat = new THREE7.MeshBasicMaterial({ color: 15684432, transparent: true });
      const light = new THREE7.Mesh(lightGeo, lightMat);
      light.position.set(xBase, h + 0.15, z);
      this._scene.add(light);
      this._groups.far.push({ mesh: light, baseZ: z, scrollSpeed: 0.35, isLight: true });
    }
    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const xBase = side * (5 + Math.random() * 1.5);
      const h = 3 + Math.random() * 6;
      const w = 1.2 + Math.random() * 1.5;
      const z = -10 - i * 12 + Math.random() * 5;
      const geo = new THREE7.BoxGeometry(w, h, w * 0.8);
      const mat = new THREE7.MeshLambertMaterial({
        color: colors[Math.floor(Math.random() * colors.length)]
      });
      const mesh = new THREE7.Mesh(geo, mat);
      mesh.position.set(xBase, h / 2, z);
      this._scene.add(mesh);
      this._groups.mid.push({ mesh, baseZ: z, scrollSpeed: 0.7 });
    }
  }
  _buildClouds() {
    if (this._theme === "space")
      return;
    const cloudColor = this._theme === "jungle" ? 13166281 : 16777215;
    const cloudCount = this._theme === "jungle" ? 6 : 8;
    for (let i = 0; i < cloudCount; i++) {
      const group = new THREE7.Group();
      const puffs = 3 + Math.floor(Math.random() * 3);
      for (let p = 0; p < puffs; p++) {
        const r = 0.8 + Math.random() * 1.2;
        const geo = new THREE7.SphereGeometry(r, 7, 5);
        const mat = new THREE7.MeshLambertMaterial({
          color: cloudColor,
          transparent: true,
          opacity: 0.78
        });
        const puff = new THREE7.Mesh(geo, mat);
        puff.position.set(
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 1.2
        );
        group.add(puff);
      }
      const side = Math.random() > 0.5 ? 1 : -1;
      group.position.set(
        side * (8 + Math.random() * 20),
        8 + Math.random() * 16,
        -10 - i * 18 + Math.random() * 10
      );
      group.scale.setScalar(0.8 + Math.random() * 0.6);
      const speed = 0.1 + Math.random() * 0.15;
      this._clouds.push({ group, speed });
      this._scene.add(group);
    }
  }
  _buildGroundFog() {
    const fogGeo = new THREE7.PlaneGeometry(12, 200);
    const fogMat = new THREE7.MeshBasicMaterial({
      color: 7020968,
      transparent: true,
      opacity: 0.12,
      side: THREE7.DoubleSide,
      depthWrite: false
    });
    const fog = new THREE7.Mesh(fogGeo, fogMat);
    fog.rotation.x = -Math.PI / 2;
    fog.position.set(0, 0.05, -50);
    this._scene.add(fog);
  }
  /** Call every frame from game loop */
  update(speed) {
    this._frame++;
    const totalLen = 280;
    [...this._groups.far, ...this._groups.mid].forEach((b) => {
      b.mesh.position.z += b.scrollSpeed * speed * 2.2;
      if (b.mesh.position.z > 12) {
        b.mesh.position.z -= totalLen;
      }
      if (b.isLight) {
        b.mesh.material.opacity = Math.sin(this._frame * 0.04) > 0 ? 1 : 0;
      }
    });
    this._clouds.forEach((c) => {
      c.group.position.z += c.speed * speed * 3;
      if (c.group.position.z > 15)
        c.group.position.z -= 200;
    });
    if (this._stars) {
      this._stars.rotation.y += 1e-4;
      if (this._theme === "space")
        this._stars.rotation.x += 5e-5;
    }
  }
  dispose() {
    [...this._groups.far, ...this._groups.mid, ...this._groups.near].forEach((b) => {
      this._scene.remove(b.mesh);
      b.mesh.geometry.dispose();
    });
    this._clouds.forEach((c) => this._scene.remove(c.group));
    if (this._stars)
      this._scene.remove(this._stars);
    this._scene.remove(this._skyDome);
  }
};

// src/systems/ParticleSystem.js
var THREE8 = __toESM(require_three());
var _dummy = new THREE8.Object3D();
var _color = new THREE8.Color();
var ParticleSystem = class {
  constructor(scene) {
    this._scene = scene;
    this._particles = [];
    this._maxParticles = PARTICLES.MAX_PARTICLES;
    this._buildInstancedMesh();
    this._listenForEvents();
  }
  _buildInstancedMesh() {
    const geo = new THREE8.SphereGeometry(0.12, 5, 4);
    const mat = new THREE8.MeshBasicMaterial({ vertexColors: true });
    this._mesh = new THREE8.InstancedMesh(geo, mat, this._maxParticles);
    this._mesh.instanceMatrix.setUsage(THREE8.DynamicDrawUsage);
    this._mesh.count = 0;
    this._scene.add(this._mesh);
  }
  _listenForEvents() {
    Bus.on(EVENTS.COIN_COLLECTED, ({ position }) => this.emitCoinBurst(position));
    Bus.on(EVENTS.PLAYER_HIT, ({ position }) => this.emitCrash(position));
    Bus.on(EVENTS.PLAYER_LAND, ({ position }) => this.emitLandPuff(position));
    Bus.on(EVENTS.NEAR_MISS, ({ position }) => this.emitNearMiss(position));
    Bus.on(EVENTS.POWERUP_COLLECTED, ({ position, type }) => this.emitPowerupPop(position, type));
  }
  /** Spawn a group of particles */
  emit({ position, count, colorStart, colorEnd, speed, sizeStart, sizeEnd, lifetime, spread, gravity = -8e-3 }) {
    for (let i = 0; i < count; i++) {
      if (this._particles.length >= this._maxParticles)
        break;
      const angle = Math.random() * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * Math.PI;
      const spd = speed * (0.5 + Math.random() * 0.5);
      this._particles.push({
        x: position.x + (Math.random() - 0.5) * spread,
        y: position.y + (Math.random() - 0.5) * spread,
        z: position.z + (Math.random() - 0.5) * spread,
        vx: Math.cos(angle) * Math.cos(tilt) * spd,
        vy: Math.sin(tilt) * spd + 0.05,
        vz: Math.sin(angle) * Math.cos(tilt) * spd,
        colorStart: new THREE8.Color(colorStart),
        colorEnd: new THREE8.Color(colorEnd),
        size: sizeStart,
        sizeStart,
        sizeEnd,
        life: 1,
        decay: 1 / (lifetime * 60),
        gravity
      });
    }
  }
  /* ── Preset effects ── */
  emitCoinBurst(position) {
    this.emit({
      position,
      count: PARTICLES.COIN_BURST_COUNT,
      colorStart: "#FFD23F",
      colorEnd: "#FFA000",
      speed: 0.12,
      sizeStart: 0.14,
      sizeEnd: 0.02,
      lifetime: 0.6,
      spread: 0.2,
      gravity: -5e-3
    });
    this.emit({
      position,
      count: 6,
      colorStart: "#FFFFFF",
      colorEnd: "#FFD23F",
      speed: 0.06,
      sizeStart: 0.22,
      sizeEnd: 0.01,
      lifetime: 0.25,
      spread: 0.1
    });
  }
  emitCrash(position) {
    this.emit({
      position,
      count: PARTICLES.CRASH_BURST_COUNT,
      colorStart: "#FF5722",
      colorEnd: "#D32F2F",
      speed: 0.18,
      sizeStart: 0.2,
      sizeEnd: 0.01,
      lifetime: 0.9,
      spread: 0.3,
      gravity: -6e-3
    });
    this.emit({
      position,
      count: 10,
      colorStart: "#FF8F00",
      colorEnd: "#212121",
      speed: 0.08,
      sizeStart: 0.12,
      sizeEnd: 0.01,
      lifetime: 0.7,
      spread: 0.1
    });
  }
  emitLandPuff(position) {
    this.emit({
      position: { ...position, y: position.y + 0.1 },
      count: 8,
      colorStart: "#B39DDB",
      colorEnd: "rgba(150,130,200,0)",
      speed: 0.06,
      sizeStart: 0.1,
      sizeEnd: 0.01,
      lifetime: 0.4,
      spread: 0.3,
      gravity: 1e-3
    });
  }
  emitNearMiss(position) {
    this.emit({
      position,
      count: 8,
      colorStart: "#FFFFFF",
      colorEnd: "#9C27B0",
      speed: 0.12,
      sizeStart: 0.18,
      sizeEnd: 0.01,
      lifetime: 0.4,
      spread: 0.1
    });
  }
  emitPowerupPop(position, type) {
    const colors = {
      magnet: ["#CE93D8", "#7B1FA2"],
      shield: ["#90CAF9", "#1565C0"],
      boost: ["#FFCC02", "#E65100"],
      x2: ["#A5D6A7", "#1B5E20"]
    };
    const [c1, c2] = colors[type] || colors.boost;
    this.emit({
      position,
      count: 20,
      colorStart: c1,
      colorEnd: c2,
      speed: 0.15,
      sizeStart: 0.18,
      sizeEnd: 0.01,
      lifetime: 0.8,
      spread: 0.2
    });
  }
  /** Trail effect — call from game loop during boost */
  emitBoostTrail(position) {
    this.emit({
      position: { x: position.x + (Math.random() - 0.5) * 0.3, y: position.y + 0.5, z: position.z + 0.3 },
      count: PARTICLES.BOOST_TRAIL_COUNT,
      colorStart: "#22D3EE",
      colorEnd: "#3B82F6",
      speed: 0.04,
      sizeStart: 0.12,
      sizeEnd: 0.01,
      lifetime: 0.4,
      spread: 0.1,
      gravity: 1e-3
    });
  }
  /** Must be called every frame from the game loop */
  update() {
    let count = 0;
    for (let i = this._particles.length - 1; i >= 0; i--) {
      const p = this._particles[i];
      p.life -= p.decay;
      if (p.life <= 0) {
        this._particles.splice(i, 1);
        continue;
      }
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      _dummy.position.set(p.x, p.y, p.z);
      const s = p.sizeEnd + (p.sizeStart - p.sizeEnd) * p.life;
      _dummy.scale.setScalar(s / 0.12);
      _dummy.updateMatrix();
      this._mesh.setMatrixAt(count, _dummy.matrix);
      _color.lerpColors(
        p.colorEnd instanceof THREE8.Color ? p.colorEnd : new THREE8.Color(p.colorEnd),
        p.colorStart instanceof THREE8.Color ? p.colorStart : new THREE8.Color(p.colorStart),
        p.life
      );
      this._mesh.setColorAt(count, _color);
      count++;
    }
    this._mesh.count = count;
    this._mesh.instanceMatrix.needsUpdate = true;
    if (this._mesh.instanceColor)
      this._mesh.instanceColor.needsUpdate = true;
  }
  /** Clear all active particles */
  clear() {
    this._particles = [];
    this._mesh.count = 0;
  }
  dispose() {
    this._scene.remove(this._mesh);
    this._mesh.geometry.dispose();
    this._mesh.material.dispose();
  }
};

// src/systems/UISystem.js
var UISystem = class {
  constructor(container) {
    this._container = container;
    this._el = {};
    this._popQueue = [];
    this._pwupTimers = {};
    this._buildHUD();
    this._listenForEvents();
  }
  _buildHUD() {
    const hud = document.createElement("div");
    hud.id = "sr-hud";
    hud.style.cssText = `
      position:absolute; inset:0; pointer-events:none;
      font-family:'Baloo 2','Nunito',sans-serif;
    `;
    this._container.appendChild(hud);
    hud.innerHTML = `
      <!-- TOP BAR -->
      <div id="sr-top" style="
        display:flex; justify-content:space-between; align-items:center;
        padding:14px 16px 0; pointer-events:all;
      ">
        <button id="sr-pause" style="
          background:rgba(0,0,0,0.45); backdrop-filter:blur(6px);
          border:2px solid rgba(255,255,255,0.3); color:#fff;
          font-size:18px; width:42px; height:42px; border-radius:99px;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
        ">\u23F8</button>

        <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
          <div id="sr-score" style="
            font-size:28px; font-weight:800; color:#fff;
            text-shadow:0 2px 12px rgba(0,0,0,0.6); line-height:1;
          ">0</div>
          <div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.6); letter-spacing:.06em; text-transform:uppercase;">Score</div>
        </div>

        <div style="
          display:flex; align-items:center; gap:6px;
          background:rgba(0,0,0,0.45); backdrop-filter:blur(6px);
          border:2px solid rgba(251,191,36,0.4); border-radius:99px;
          padding:6px 14px 6px 10px;
        ">
          <span style="font-size:15px;">\u{1FA99}</span>
          <span id="sr-coins" style="font-size:15px; font-weight:800; color:#FBBF24;">0</span>
        </div>
      </div>

      <!-- LIVES -->
      <div id="sr-lives" style="
        position:absolute; top:70px; left:50%; transform:translateX(-50%);
        font-size:22px; letter-spacing:3px; text-shadow:0 2px 8px rgba(0,0,0,0.5);
      ">\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F</div>

      <!-- MULTIPLIER -->
      <div id="sr-multiplier" style="
        position:absolute; top:110px; left:50%; transform:translateX(-50%);
        font-size:14px; font-weight:800; color:#FFD23F; opacity:0; transition:opacity .3s;
        text-shadow:0 0 12px #FFD23F;
      ">\xD71</div>

      <!-- POWERUP BAR CONTAINER -->
      <div id="sr-pwup-container" style="
        position:absolute; bottom:100px; left:50%; transform:translateX(-50%);
        display:flex; flex-direction:column; gap:6px; align-items:center; min-width:200px;
      "></div>

      <!-- NEAR MISS -->
      <div id="sr-nearmiss" style="
        position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
        font-size:20px; font-weight:800; color:#FFD23F;
        text-shadow:0 0 20px #FFD23F; opacity:0; pointer-events:none;
        transition:opacity .2s; letter-spacing:.05em;
      ">NEAR MISS! +50</div>

      <!-- DISTANCE -->
      <div id="sr-distance" style="
        position:absolute; top:70px; right:16px;
        font-size:13px; font-weight:700; color:rgba(255,255,255,0.55);
        text-shadow:0 2px 6px rgba(0,0,0,0.4);
      ">0m</div>

      <!-- SCORE POPS (floating) -->
      <div id="sr-pops" style="position:absolute; inset:0; pointer-events:none;"></div>
    `;
    ["sr-score", "sr-coins", "sr-lives", "sr-multiplier", "sr-nearmiss", "sr-distance", "sr-pwup-container", "sr-pops", "sr-pause"].forEach((id) => {
      this._el[id] = document.getElementById(id);
    });
    this._el["sr-pause"].addEventListener("click", () => Bus.emit(EVENTS.GAME_PAUSE));
  }
  _listenForEvents() {
    Bus.on(EVENTS.SCORE_UPDATE, ({ score, distance, coins }) => {
      if (this._el["sr-score"])
        this._el["sr-score"].textContent = score.toLocaleString();
      if (this._el["sr-distance"])
        this._el["sr-distance"].textContent = Math.floor(distance) + "m";
      if (this._el["sr-coins"])
        this._el["sr-coins"].textContent = coins.toLocaleString();
    });
    Bus.on(EVENTS.PLAYER_HIT, () => {
      const flash = document.createElement("div");
      flash.style.cssText = "position:absolute;inset:0;background:rgba(239,68,68,0.35);pointer-events:none;border-radius:inherit;";
      this._container.appendChild(flash);
      setTimeout(() => flash.remove(), 280);
    });
    Bus.on(EVENTS.COIN_COLLECTED, ({ position }) => {
      this._spawnPop("+10", "#FFD23F", position);
    });
    Bus.on(EVENTS.NEAR_MISS, () => {
      const el = this._el["sr-nearmiss"];
      el.style.opacity = "1";
      setTimeout(() => el.style.opacity = "0", 900);
    });
    Bus.on(EVENTS.MULTIPLIER_CHANGE, ({ multiplier }) => {
      const el = this._el["sr-multiplier"];
      if (multiplier > 1) {
        el.textContent = "\xD7" + multiplier;
        el.style.opacity = "1";
      } else {
        el.style.opacity = "0";
      }
    });
    Bus.on(EVENTS.POWERUP_COLLECTED, ({ type }) => {
      this._startPowerupBar(type);
      this._spawnPop(type.toUpperCase() + "!", this._pwupColor(type));
    });
    Bus.on(EVENTS.POWERUP_EXPIRED, ({ type }) => {
      this._removePowerupBar(type);
    });
  }
  _pwupColor(type) {
    return { magnet: "#CE93D8", shield: "#90CAF9", boost: "#FFCC80", x2: "#A5D6A7" }[type] || "#fff";
  }
  _startPowerupBar(type) {
    this._removePowerupBar(type);
    const duration = POWERUPS.DURATIONS[type] * 1e3;
    const icons = { magnet: "\u{1F9F2}", shield: "\u{1F6E1}\uFE0F", boost: "\u26A1", x2: "\xD72" };
    const color = this._pwupColor(type);
    const wrap = document.createElement("div");
    wrap.id = "pwup_" + type;
    wrap.style.cssText = `
      display:flex; align-items:center; gap:8px;
      background:rgba(0,0,0,0.5); backdrop-filter:blur(8px);
      border:2px solid ${color}55; border-radius:99px; padding:5px 14px 5px 10px;
      min-width:180px;
    `;
    wrap.innerHTML = `
      <span style="font-size:16px;">${icons[type] || "\u2B50"}</span>
      <div style="flex:1; height:6px; background:rgba(255,255,255,0.15); border-radius:99px; overflow:hidden;">
        <div id="pwup_bar_${type}" style="height:100%; width:100%; background:${color}; border-radius:99px; transition:width .1s linear;"></div>
      </div>
    `;
    this._el["sr-pwup-container"].appendChild(wrap);
    const start = Date.now();
    const tick = () => {
      const bar = document.getElementById("pwup_bar_" + type);
      if (!bar)
        return;
      const pct = Math.max(0, 1 - (Date.now() - start) / duration);
      bar.style.width = pct * 100 + "%";
      if (pct > 0)
        this._pwupTimers[type] = requestAnimationFrame(tick);
    };
    this._pwupTimers[type] = requestAnimationFrame(tick);
  }
  _removePowerupBar(type) {
    if (this._pwupTimers[type]) {
      cancelAnimationFrame(this._pwupTimers[type]);
      delete this._pwupTimers[type];
    }
    const el = document.getElementById("pwup_" + type);
    if (el)
      el.remove();
  }
  _spawnPop(text, color, position) {
    const pop = document.createElement("div");
    const rect = this._container.getBoundingClientRect();
    const x = position ? MathUtils2.clamp(position.x * 30 + rect.width / 2, 40, rect.width - 40) : rect.width / 2;
    const y = position ? MathUtils2.clamp(rect.height * 0.45, 100, rect.height - 80) : rect.height * 0.4;
    pop.style.cssText = `
      position:absolute; left:${x}px; top:${y}px; transform:translate(-50%,-50%);
      font-size:21px; font-weight:800; color:${color}; pointer-events:none;
      text-shadow:0 2px 8px rgba(0,0,0,0.5); white-space:nowrap;
      animation:srPopFloat .75s ease forwards;
    `;
    pop.textContent = text;
    this._el["sr-pops"].appendChild(pop);
    setTimeout(() => pop.remove(), 780);
  }
  updateLives(lives, max = 3) {
    if (this._el["sr-lives"]) {
      this._el["sr-lives"].textContent = "\u2764\uFE0F".repeat(Math.max(0, lives)) + "\u{1F5A4}".repeat(Math.max(0, max - lives));
    }
  }
  show() {
    if (this._el["sr-hud"])
      this._el["sr-hud"].style.display = "block";
    const hud = document.getElementById("sr-hud");
    if (hud)
      hud.style.display = "block";
  }
  hide() {
    const hud = document.getElementById("sr-hud");
    if (hud)
      hud.style.display = "none";
  }
  destroy() {
    Object.values(this._pwupTimers).forEach((t) => cancelAnimationFrame(t));
    const hud = document.getElementById("sr-hud");
    if (hud)
      hud.remove();
  }
};
var MathUtils2 = { clamp: (v, a, b) => Math.max(a, Math.min(b, v)) };

// src/systems/InputSystem.js
var InputSystem = class {
  constructor(canvas) {
    this._canvas = canvas;
    this._touchStart = null;
    this._queue = [];
    this._enabled = false;
    this._swipeThreshold = 30;
    this._tapThreshold = 10;
    this._bindEvents();
  }
  enable() {
    this._enabled = true;
  }
  disable() {
    this._enabled = false;
    this._queue = [];
  }
  _bindEvents() {
    this._canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const t = e.touches[0];
      this._touchStart = { x: t.clientX, y: t.clientY, time: Date.now() };
    }, { passive: false });
    this._canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (!this._touchStart)
        return;
      const t = e.changedTouches[0];
      const dx = t.clientX - this._touchStart.x;
      const dy = t.clientY - this._touchStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - this._touchStart.time;
      if (dist < this._tapThreshold && duration < 200) {
        this._dispatch(EVENTS.INPUT_TAP);
        this._dispatch(EVENTS.INPUT_JUMP);
      } else if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > this._swipeThreshold) {
          this._dispatch(dx > 0 ? EVENTS.INPUT_RIGHT : EVENTS.INPUT_LEFT);
        }
      } else {
        if (Math.abs(dy) > this._swipeThreshold) {
          this._dispatch(dy < 0 ? EVENTS.INPUT_JUMP : EVENTS.INPUT_ROLL);
        }
      }
      this._touchStart = null;
    }, { passive: false });
    this._canvas.addEventListener("touchcancel", () => {
      this._touchStart = null;
    });
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          e.preventDefault();
          this._dispatch(EVENTS.INPUT_LEFT);
          break;
        case "ArrowRight":
          e.preventDefault();
          this._dispatch(EVENTS.INPUT_RIGHT);
          break;
        case "ArrowUp":
        case "Space":
          e.preventDefault();
          this._dispatch(EVENTS.INPUT_JUMP);
          break;
        case "ArrowDown":
          e.preventDefault();
          this._dispatch(EVENTS.INPUT_ROLL);
          break;
        case "KeyA":
          this._dispatch(EVENTS.INPUT_LEFT);
          break;
        case "KeyD":
          this._dispatch(EVENTS.INPUT_RIGHT);
          break;
        case "KeyW":
          this._dispatch(EVENTS.INPUT_JUMP);
          break;
        case "KeyS":
          this._dispatch(EVENTS.INPUT_ROLL);
          break;
      }
    });
    this._gamepadFrame = 0;
    this._gamepadPrev = { left: false, right: false, a: false };
    window.addEventListener("gamepadconnected", () => console.log("Gamepad connected"));
  }
  _dispatch(event) {
    if (!this._enabled)
      return;
    Bus.emit(event);
  }
  /** Poll gamepad — call every frame from game loop */
  pollGamepad() {
    if (!navigator.getGamepads)
      return;
    const gp = navigator.getGamepads()[0];
    if (!gp)
      return;
    const left = gp.axes[0] < -0.5 || gp.buttons[14]?.pressed;
    const right = gp.axes[0] > 0.5 || gp.buttons[15]?.pressed;
    const jump = gp.buttons[0]?.pressed;
    if (left && !this._gamepadPrev.left)
      this._dispatch(EVENTS.INPUT_LEFT);
    if (right && !this._gamepadPrev.right)
      this._dispatch(EVENTS.INPUT_RIGHT);
    if (jump && !this._gamepadPrev.a)
      this._dispatch(EVENTS.INPUT_JUMP);
    this._gamepadPrev = { left, right, a: jump };
  }
  destroy() {
  }
};

// src/scenes/GameScene.js
var GameScene = class {
  constructor({ renderer, canvas, container, audio, save }) {
    this._renderer = renderer;
    this._canvas = canvas;
    this._container = container;
    this._audio = audio;
    this._save = save;
    this._scene = new THREE9.Scene();
    this._scene.fog = new THREE9.FogExp2(3807854, 0.012);
    this._camera = new THREE9.PerspectiveCamera(
      CAMERA.FOV,
      canvas.clientWidth / canvas.clientHeight,
      CAMERA.NEAR,
      CAMERA.FAR
    );
    this._camera.position.set(CAMERA.POSITION.x, CAMERA.POSITION.y, CAMERA.POSITION.z);
    this._camera.lookAt(CAMERA.LOOK_AT.x, CAMERA.LOOK_AT.y, CAMERA.LOOK_AT.z);
    this._buildLights();
    this._running = false;
    this._paused = false;
    this._frame = 0;
    this._speed = SPEED.INITIAL;
    this._score = 0;
    this._distance = 0;
    this._coins = 0;
    this._lives = 3;
    this._multiplier = 1;
    this._multiplierCoins = 0;
    this._lastTime = 0;
    this._powerups = {
      magnet: 0,
      shield: 0,
      boost: 0,
      x2: 0
    };
    const theme = save.activeEnv || "city";
    this._environment = new Environment(this._scene, theme);
    this._track = new Track(this._scene);
    this._particles = new ParticleSystem(this._scene);
    this._obstacles = new ObstacleManager(this._scene);
    this._coins_mgr = new CoinManager(this._scene);
    this._player = new Player(this._scene);
    this._ui = new UISystem(container);
    this._input = new InputSystem(canvas);
    this._player.applySkin(save.activeSkin || "rosa");
    this._listenForEvents();
    Bus.emit(EVENTS.GAME_START);
    this._audio.init();
  }
  _buildLights() {
    const ambient = new THREE9.AmbientLight(16772863, 1.1);
    this._scene.add(ambient);
    const sun = new THREE9.DirectionalLight(16774604, 2.2);
    sun.position.set(8, 22, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -20;
    sun.shadow.camera.right = sun.shadow.camera.top = 20;
    this._scene.add(sun);
    const sun2 = new THREE9.DirectionalLight(13426175, 1.2);
    sun2.position.set(-6, 12, 14);
    this._scene.add(sun2);
    const fill = new THREE9.PointLight(16740261, 1.8, 35);
    fill.position.set(-5, 6, 10);
    this._scene.add(fill);
    const rim = new THREE9.PointLight(12602623, 1.4, 30);
    rim.position.set(5, 5, 8);
    this._scene.add(rim);
    const bounce = new THREE9.PointLight(10053375, 0.8, 20);
    bounce.position.set(0, 0.5, 7);
    this._scene.add(bounce);
    this._fillLight = fill;
    this._rimLight = rim;
  }
  _listenForEvents() {
    Bus.on(EVENTS.COIN_COLLECTED, ({ value }) => {
      const earned = (value || 10) * (this._powerups.x2 > 0 ? 2 : 1) * this._multiplier;
      this._score += earned;
      this._coins++;
      this._multiplierCoins++;
      if (this._multiplierCoins >= SCORING.MULTIPLIER_COIN_THRESHOLD && this._multiplier < SCORING.MULTIPLIER_MAX) {
        this._multiplier++;
        this._multiplierCoins = 0;
        Bus.emit(EVENTS.MULTIPLIER_CHANGE, { multiplier: this._multiplier });
      }
    });
    Bus.on(EVENTS.POWERUP_COLLECTED, ({ type }) => {
      this._activatePowerup(type);
    });
    Bus.on(EVENTS.PLAYER_HIT, () => {
      if (this._powerups.shield > 0) {
        this._powerups.shield = 0;
        Bus.emit(EVENTS.POWERUP_EXPIRED, { type: "shield" });
        return;
      }
      this._lives--;
      this._ui.updateLives(this._lives);
      if (this._lives <= 0) {
        this._player.die();
        setTimeout(() => this._gameOver(), 900);
      }
    });
    Bus.on(EVENTS.GAME_PAUSE, () => this.togglePause());
  }
  _activatePowerup(type) {
    const dur = POWERUPS.DURATIONS[type] * 60;
    this._powerups[type] = dur;
    if (type === "boost") {
      this._speed = Math.min(SPEED.MAX, this._speed * SPEED.BOOST_MULTIPLIER);
    }
  }
  _tickPowerups() {
    let changed = false;
    for (const type of Object.keys(this._powerups)) {
      if (this._powerups[type] > 0) {
        this._powerups[type]--;
        if (this._powerups[type] === 0) {
          Bus.emit(EVENTS.POWERUP_EXPIRED, { type });
          if (type === "boost") {
            this._speed = Math.max(SPEED.INITIAL, this._speed / SPEED.BOOST_MULTIPLIER);
          }
          changed = true;
        }
      }
    }
  }
  /* ═══════════════════════════════
     MAIN UPDATE
  ═══════════════════════════════ */
  update(timestamp) {
    if (!this._running || this._paused)
      return;
    const dt = Math.min((timestamp - this._lastTime) / 1e3, 0.05);
    this._lastTime = timestamp;
    this._frame++;
    if (this._powerups.boost <= 0) {
      this._speed = Math.min(SPEED.MAX, SPEED.INITIAL + this._frame * SPEED.INCREMENT);
    }
    this._distance += this._speed * 2.2 * 0.3;
    this._score += Math.round(this._speed * SCORING.BASE_PER_FRAME * this._multiplier);
    this._tickPowerups();
    this._player.update(dt);
    this._track.update(this._speed);
    this._environment.update(this._speed);
    this._obstacles.update(this._speed, dt);
    this._particles.update();
    const magnetOn = this._powerups.magnet > 0;
    const collected = this._coins_mgr.update(
      this._speed,
      dt,
      this._player.position,
      magnetOn
    );
    if (this._player.position && !this._player.isDead) {
      for (const obs of this._obstacles.activeObstacles) {
        if (this._player.checkCollision(obs.boundingBox)) {
          this._player.hit();
          break;
        }
      }
      for (const obs of this._obstacles.activeObstacles) {
        const dx = Math.abs(this._player.position.x - obs.x);
        const dz = Math.abs(PLAYER.START_Z - obs.z);
        if (dx > 0.8 && dx < 1.5 && dz < 0.8) {
          this._score += SCORING.NEAR_MISS_BONUS;
          Bus.emit(EVENTS.NEAR_MISS, { position: this._player.position });
        }
      }
    }
    const targetCamX = this._player.position.x * CAMERA.LEAN_AMOUNT;
    this._camera.position.x = MathUtils.lerp(this._camera.position.x, targetCamX, CAMERA.LEAN_SPEED);
    if (this._powerups.boost > 0) {
      this._fillLight.intensity = 0.7 + Math.sin(this._frame * 0.15) * 0.3;
    } else {
      this._fillLight.intensity = 0.7;
    }
    Bus.emit(EVENTS.SCORE_UPDATE, {
      score: this._score,
      distance: this._distance,
      coins: this._coins
    });
    if (this._powerups.boost > 0) {
      this._particles.emitBoostTrail(this._player.position);
    }
  }
  render() {
    this._renderer.render(this._scene, this._camera);
  }
  /* ═══════════════════════════════
     STATE
  ═══════════════════════════════ */
  start(timestamp) {
    this._running = true;
    this._lastTime = timestamp;
    this._input.enable();
    this._audio.startBGM();
  }
  togglePause() {
    this._paused = !this._paused;
    if (this._paused) {
      this._audio.stopBGM();
      this._showPauseOverlay();
    } else {
      this._audio.startBGM();
      this._hidePauseOverlay();
    }
  }
  _showPauseOverlay() {
    if (document.getElementById("sr-pause-overlay"))
      return;
    const overlay = document.createElement("div");
    overlay.id = "sr-pause-overlay";
    overlay.style.cssText = `
      position:absolute; inset:0; background:rgba(15,5,30,0.8);
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:16px; font-family:'Baloo 2',sans-serif; backdrop-filter:blur(4px); z-index:80;
    `;
    overlay.innerHTML = `
      <div style="font-size:36px;">\u23F8\uFE0F</div>
      <div style="color:#fff; font-size:26px; font-weight:800;">Paused</div>
      <button onclick="document.getElementById('sr-pause-overlay').remove(); window._srScene.togglePause();" style="
        background:linear-gradient(135deg,#FF6FA5,#C04CFF); color:#fff; border:none;
        padding:14px 36px; border-radius:99px; font-size:16px; font-weight:800;
        cursor:pointer; font-family:'Baloo 2',sans-serif; box-shadow:0 6px 0 rgba(0,0,0,0.25);
      ">\u25B6 Resume</button>
      <button onclick="window.location.href='index.html';" style="
        background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.8); border:2px solid rgba(255,255,255,0.2);
        padding:10px 28px; border-radius:99px; font-size:14px; font-weight:700;
        cursor:pointer; font-family:'Baloo 2',sans-serif;
      ">\u2190 Main Menu</button>
    `;
    this._container.appendChild(overlay);
    window._srScene = this;
  }
  _hidePauseOverlay() {
    const el = document.getElementById("sr-pause-overlay");
    if (el)
      el.remove();
  }
  _gameOver() {
    this._running = false;
    this._input.disable();
    this._audio.stopBGM();
    this._audio.sfxGameOver();
    Bus.emit(EVENTS.GAME_OVER, {
      score: this._score,
      distance: Math.floor(this._distance),
      coinsCollected: this._coins
    });
  }
  handleResize(w, h) {
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
  }
  get scene() {
    return this._scene;
  }
  get camera() {
    return this._camera;
  }
  dispose() {
    this._running = false;
    this._input.disable();
    this._player.dispose();
    this._track.dispose();
    this._environment.dispose();
    this._particles.dispose();
    this._obstacles.reset();
    this._coins_mgr.reset();
    this._ui.destroy();
    Bus.clear();
  }
};

// src/scenes/GameOverScene.js
var GameOverScene = class {
  constructor({ container, save, onRetry, onMenu }) {
    this._container = container;
    this._save = save;
    this._onRetry = onRetry;
    this._onMenu = onMenu;
    this._el = null;
    Bus.once(EVENTS.GAME_OVER, (data) => this._show(data));
  }
  _show({ score, distance, coinsCollected }) {
    const isNewBest = score > this._save.highScore - coinsCollected * 10;
    const totalCoins = this._save.totalCoins;
    const el = document.createElement("div");
    el.id = "sr-gameover";
    el.style.cssText = `
      position:absolute; inset:0; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:0;
      background:rgba(10,0,25,0.88); backdrop-filter:blur(6px);
      font-family:'Baloo 2','Nunito',sans-serif; z-index:90;
      animation:srFadeIn .35s ease;
      padding: 24px 20px;
    `;
    el.innerHTML = `
      <!-- ICON -->
      <div style="font-size:64px; margin-bottom:8px; animation:srBounce .6s ease;">
        ${score > 5e3 ? "\u{1F3C6}" : score > 2e3 ? "\u{1F948}" : "\u{1F480}"}
      </div>

      <!-- TITLE -->
      <div style="
        font-size:28px; font-weight:900; color:#fff; margin-bottom:4px;
        text-shadow:0 0 20px rgba(255,111,165,0.6);
      ">${score > 5e3 ? "LEGENDARY!" : score > 2e3 ? "GREAT RUN!" : "GAME OVER"}</div>

      <!-- NEW BEST BADGE -->
      ${isNewBest ? `
        <div style="
          background:linear-gradient(135deg,rgba(251,191,36,0.3),rgba(245,158,11,0.15));
          border:2px solid rgba(251,191,36,0.5); border-radius:99px;
          padding:5px 18px; font-size:13px; font-weight:800; color:#FBBF24;
          margin-bottom:10px; animation:srBounce .5s ease .2s both;
        ">\u{1F3C6} New Best Score!</div>
      ` : '<div style="height:14px;"></div>'}

      <!-- SCORE CARD -->
      <div style="
        background:rgba(255,255,255,0.07); border:2px solid rgba(255,255,255,0.14);
        border-radius:24px; padding:24px 32px; width:100%; max-width:320px;
        margin-bottom:20px; text-align:center;
      ">
        <div style="font-size:52px; font-weight:900; color:#fff; line-height:1;
          background:linear-gradient(135deg,#FF6FA5,#C04CFF,#22D3EE);
          -webkit-background-clip:text; background-clip:text; color:transparent;">
          ${score.toLocaleString()}
        </div>
        <div style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.5);
          text-transform:uppercase; letter-spacing:.06em; margin-top:2px;">Score</div>

        <!-- STATS ROW -->
        <div style="display:flex; justify-content:center; gap:28px; margin-top:18px; padding-top:16px;
          border-top:1px solid rgba(255,255,255,0.1);">
          <div style="text-align:center;">
            <div style="font-size:20px; font-weight:800; color:#fff;">${Math.floor(distance)}m</div>
            <div style="font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.05em;">Distance</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:20px; font-weight:800; color:#FBBF24;">\u{1FA99} ${coinsCollected.toLocaleString()}</div>
            <div style="font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.05em;">Coins</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:20px; font-weight:800; color:#fff;">${totalCoins.toLocaleString()}</div>
            <div style="font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.05em;">Total</div>
          </div>
        </div>
      </div>

      <!-- BUTTONS -->
      <button id="btn-retry" style="
        width:100%; max-width:320px; height:58px; border:none;
        background:linear-gradient(135deg,#FF6FA5,#C04CFF); color:#fff;
        font-size:19px; font-weight:800; border-radius:99px; cursor:pointer;
        box-shadow:0 8px 0 rgba(0,0,0,0.3), 0 10px 24px rgba(255,111,165,0.4);
        font-family:'Baloo 2',sans-serif; margin-bottom:12px;
        transition:transform .12s;
      ">\u25B6 Play Again</button>

      <button id="btn-menu" style="
        width:100%; max-width:320px; height:46px;
        background:rgba(255,255,255,0.1); border:2px solid rgba(255,255,255,0.2);
        color:rgba(255,255,255,0.8); font-size:15px; font-weight:700; border-radius:99px;
        cursor:pointer; font-family:'Baloo 2',sans-serif;
      ">\u2190 Main Menu</button>

      <!-- BEST SCORE REMINDER -->
      <div style="margin-top:14px; font-size:12px; font-weight:600; color:rgba(255,255,255,0.35);">
        Best: ${this._save.highScore.toLocaleString()} \xB7 Coins: ${totalCoins.toLocaleString()}
      </div>
    `;
    this._container.appendChild(el);
    this._el = el;
    const retryBtn = document.getElementById("btn-retry");
    retryBtn.addEventListener("pointerdown", () => {
      retryBtn.style.transform = "translateY(4px)";
      retryBtn.style.boxShadow = "0 4px 0 rgba(0,0,0,0.3)";
    });
    retryBtn.addEventListener("pointerup", () => {
      retryBtn.style.transform = "";
      retryBtn.style.boxShadow = "";
    });
    retryBtn.addEventListener("click", () => {
      this.dispose();
      this._onRetry();
    });
    document.getElementById("btn-menu").addEventListener("click", () => {
      this.dispose();
      this._onMenu();
    });
  }
  dispose() {
    if (this._el) {
      this._el.remove();
      this._el = null;
    }
  }
};

// src/systems/SaveSystem.js
var SaveSystem = class {
  constructor() {
    this._data = this._load();
    this._listenForEvents();
  }
  _load() {
    try {
      return {
        highScore: parseInt(localStorage.getItem(SAVE_KEYS.HIGH_SCORE) || "0"),
        totalCoins: parseInt(localStorage.getItem(SAVE_KEYS.TOTAL_COINS) || "0"),
        activeSkin: localStorage.getItem(SAVE_KEYS.ACTIVE_SKIN) || "rosa",
        activeEnv: localStorage.getItem(SAVE_KEYS.ACTIVE_ENV) || "city",
        unlockedSkins: JSON.parse(localStorage.getItem(SAVE_KEYS.SKINS) || '["rosa"]'),
        settings: JSON.parse(localStorage.getItem(SAVE_KEYS.SETTINGS) || '{"sound":true,"haptics":true,"quality":"high"}')
      };
    } catch (e) {
      console.warn("SaveSystem: could not load save data", e);
      return { highScore: 0, totalCoins: 0, activeSkin: "rosa", activeEnv: "city", unlockedSkins: ["rosa"], settings: { sound: true, haptics: true, quality: "high" } };
    }
  }
  _save() {
    try {
      localStorage.setItem(SAVE_KEYS.HIGH_SCORE, this._data.highScore.toString());
      localStorage.setItem(SAVE_KEYS.TOTAL_COINS, this._data.totalCoins.toString());
      localStorage.setItem(SAVE_KEYS.ACTIVE_SKIN, this._data.activeSkin);
      localStorage.setItem(SAVE_KEYS.ACTIVE_ENV, this._data.activeEnv);
      localStorage.setItem(SAVE_KEYS.SKINS, JSON.stringify(this._data.unlockedSkins));
      localStorage.setItem(SAVE_KEYS.SETTINGS, JSON.stringify(this._data.settings));
    } catch (e) {
      console.warn("SaveSystem: could not write save data", e);
    }
  }
  _listenForEvents() {
    Bus.on(EVENTS.GAME_OVER, ({ score, coinsCollected }) => {
      let newBest = false;
      if (score > this._data.highScore) {
        this._data.highScore = score;
        newBest = true;
      }
      this._data.totalCoins += coinsCollected;
      this._save();
      Bus.emit("SAVE_UPDATED", { newBest, highScore: this._data.highScore });
    });
    Bus.on(EVENTS.SKIN_UNLOCKED, ({ skinId }) => {
      if (!this._data.unlockedSkins.includes(skinId)) {
        this._data.unlockedSkins.push(skinId);
        this._save();
      }
    });
    Bus.on(EVENTS.SKIN_CHANGED, ({ skinId }) => {
      this._data.activeSkin = skinId;
      this._save();
    });
  }
  /* ── PUBLIC API ── */
  get highScore() {
    return this._data.highScore;
  }
  get totalCoins() {
    return this._data.totalCoins;
  }
  get activeSkin() {
    return this._data.activeSkin;
  }
  get activeEnv() {
    return this._data.activeEnv;
  }
  get unlockedSkins() {
    return this._data.unlockedSkins;
  }
  get settings() {
    return this._data.settings;
  }
  isSkinUnlocked(id) {
    return this._data.unlockedSkins.includes(id);
  }
  getSkinCost(id) {
    const skin = SKINS.ALL.find((s) => s.id === id);
    return skin ? skin.cost : 0;
  }
  /** Buy a skin if player has enough coins. Returns true on success. */
  buySkin(skinId) {
    const cost = this.getSkinCost(skinId);
    if (this._data.totalCoins < cost)
      return false;
    if (this._data.unlockedSkins.includes(skinId))
      return true;
    this._data.totalCoins -= cost;
    this._data.unlockedSkins.push(skinId);
    Bus.emit(EVENTS.SKIN_UNLOCKED, { skinId });
    this._save();
    return true;
  }
  setActiveSkin(skinId) {
    this._data.activeSkin = skinId;
    Bus.emit(EVENTS.SKIN_CHANGED, { skinId });
    this._save();
  }
  setActiveEnv(envId) {
    this._data.activeEnv = envId;
    this._save();
  }
  updateSettings(patch) {
    Object.assign(this._data.settings, patch);
    this._save();
  }
  /** Daily reward — returns coins if eligible, 0 if already claimed today */
  claimDailyReward() {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    const last = localStorage.getItem(SAVE_KEYS.DAILY_REWARD);
    if (last === today)
      return 0;
    const reward = 50;
    this._data.totalCoins += reward;
    localStorage.setItem(SAVE_KEYS.DAILY_REWARD, today);
    this._save();
    return reward;
  }
  isDailyRewardAvailable() {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    return localStorage.getItem(SAVE_KEYS.DAILY_REWARD) !== today;
  }
};

// src/systems/AudioSystem.js
var AudioSystem = class {
  constructor(settings) {
    this._enabled = settings?.sound !== false;
    this._ctx = null;
    this._bgmNode = null;
    this._bgmGain = null;
    this._masterGain = null;
    this._initialized = false;
    this._listenForEvents();
  }
  /** Must be called from a user gesture (touch/click) to unlock AudioContext */
  init() {
    if (this._initialized)
      return;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = this._enabled ? 1 : 0;
      this._masterGain.connect(this._ctx.destination);
      this._initialized = true;
    } catch (e) {
      console.warn("AudioSystem: Web Audio not supported", e);
    }
  }
  enable() {
    this._enabled = true;
    if (this._masterGain)
      this._masterGain.gain.value = 1;
  }
  disable() {
    this._enabled = false;
    if (this._masterGain)
      this._masterGain.gain.value = 0;
  }
  _listenForEvents() {
    Bus.on(EVENTS.PLAYER_JUMP, () => this.sfxJump());
    Bus.on(EVENTS.PLAYER_LAND, () => this.sfxLand());
    Bus.on(EVENTS.PLAYER_HIT, () => this.sfxHit());
    Bus.on(EVENTS.COIN_COLLECTED, () => this.sfxCoin());
    Bus.on(EVENTS.POWERUP_COLLECTED, ({ type }) => this.sfxPowerup());
    Bus.on(EVENTS.NEAR_MISS, () => this.sfxNearMiss());
    Bus.on(EVENTS.GAME_OVER, () => {
      this.stopBGM();
      this.sfxGameOver();
    });
    Bus.on(EVENTS.GAME_START, () => this.startBGM());
  }
  /** Synthesize a tone */
  _tone(freq, type, duration, vol = AUDIO.SFX_VOLUME, startDelay = 0) {
    if (!this._ctx || !this._initialized)
      return;
    try {
      const osc = this._ctx.createOscillator();
      const gain = this._ctx.createGain();
      osc.connect(gain);
      gain.connect(this._masterGain);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this._ctx.currentTime + startDelay);
      gain.gain.setValueAtTime(vol, this._ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(1e-3, this._ctx.currentTime + startDelay + duration);
      osc.start(this._ctx.currentTime + startDelay);
      osc.stop(this._ctx.currentTime + startDelay + duration);
    } catch (e) {
    }
  }
  _toneFreqRamp(f1, f2, type, duration, vol = AUDIO.SFX_VOLUME) {
    if (!this._ctx || !this._initialized)
      return;
    try {
      const osc = this._ctx.createOscillator();
      const gain = this._ctx.createGain();
      osc.connect(gain);
      gain.connect(this._masterGain);
      osc.type = type;
      osc.frequency.setValueAtTime(f1, this._ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(f2, this._ctx.currentTime + duration);
      gain.gain.setValueAtTime(vol, this._ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this._ctx.currentTime + duration);
      osc.start();
      osc.stop(this._ctx.currentTime + duration);
    } catch (e) {
    }
  }
  /* ── SFX ── */
  sfxJump() {
    this._toneFreqRamp(320, 640, "sine", 0.18, 0.25);
  }
  sfxLand() {
    this._tone(120, "sine", 0.08, 0.18);
    this._tone(80, "sine", 0.06, 0.12, 0.04);
  }
  sfxHit() {
    this._toneFreqRamp(400, 80, "sawtooth", 0.4, 0.4);
    this._tone(60, "square", 0.3, 0.25, 0.1);
  }
  sfxCoin() {
    this._tone(880, "sine", 0.08, 0.2);
    this._tone(1320, "sine", 0.12, 0.18, 0.06);
  }
  sfxPowerup() {
    [440, 550, 660, 880].forEach((f, i) => this._tone(f, "sine", 0.15, 0.2, i * 0.06));
  }
  sfxNearMiss() {
    this._toneFreqRamp(200, 400, "sine", 0.1, 0.15);
  }
  sfxGameOver() {
    this._toneFreqRamp(440, 220, "sawtooth", 0.6, 0.3);
    this._tone(110, "sine", 0.8, 0.2, 0.3);
  }
  sfxSkinSelect() {
    this._tone(660, "sine", 0.1, 0.2);
    this._tone(880, "sine", 0.1, 0.2, 0.08);
  }
  /* ── BGM ── Synthesized chiptune loop */
  startBGM() {
    if (!this._ctx || !this._initialized)
      return;
    this.stopBGM();
    this._bgmGain = this._ctx.createGain();
    this._bgmGain.gain.value = AUDIO.BGM_VOLUME;
    this._bgmGain.connect(this._masterGain);
    const notes = [261, 329, 392, 523, 392, 329, 261, 196];
    let noteIdx = 0;
    const interval = 0.18;
    const playNote = () => {
      if (!this._ctx || !this._bgmGain)
        return;
      const osc = this._ctx.createOscillator();
      const gain = this._ctx.createGain();
      osc.connect(gain);
      gain.connect(this._bgmGain);
      osc.type = "square";
      osc.frequency.value = notes[noteIdx % notes.length];
      gain.gain.setValueAtTime(0.3, this._ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this._ctx.currentTime + interval * 0.8);
      osc.start();
      osc.stop(this._ctx.currentTime + interval);
      noteIdx++;
    };
    this._bgmInterval = setInterval(playNote, interval * 1e3);
    playNote();
  }
  stopBGM() {
    if (this._bgmInterval) {
      clearInterval(this._bgmInterval);
      this._bgmInterval = null;
    }
    if (this._bgmGain) {
      try {
        this._bgmGain.disconnect();
      } catch (e) {
      }
      this._bgmGain = null;
    }
  }
  destroy() {
    this.stopBGM();
    if (this._ctx) {
      try {
        this._ctx.close();
      } catch (e) {
      }
    }
  }
};

// src/Game.js
var STATES = { MENU: "MENU", PLAYING: "PLAYING", GAME_OVER: "GAME_OVER" };
var Game = class {
  constructor(container) {
    this._container = container;
    this._state = null;
    this._raf = null;
    this._save = new SaveSystem();
    this._audio = new AudioSystem(this._save.settings);
    this._canvas = this._createCanvas();
    this._renderer = new THREE10.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE10.PCFSoftShadowMap;
    this._renderer.outputColorSpace = THREE10.SRGBColorSpace;
    this._renderer.toneMapping = THREE10.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1.6;
    this._resize();
    window.addEventListener("resize", () => this._resize());
    this._menuScene = null;
    this._gameScene = null;
    this._gameOverScene = null;
  }
  _createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    this._container.appendChild(canvas);
    return canvas;
  }
  _resize() {
    const w = this._container.clientWidth;
    const h = this._container.clientHeight;
    this._renderer.setSize(w, h, false);
    this._canvas.style.width = w + "px";
    this._canvas.style.height = h + "px";
    if (this._menuScene)
      this._menuScene.handleResize(w, h);
    if (this._gameScene)
      this._gameScene.handleResize(w, h);
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
      renderer: this._renderer,
      canvas: this._canvas,
      container: this._container,
      save: this._save,
      audio: this._audio,
      onPlay: () => this._toPlaying()
    });
  }
  _toPlaying() {
    this._cleanupScenes();
    this._state = STATES.PLAYING;
    this._gameScene = new GameScene({
      renderer: this._renderer,
      canvas: this._canvas,
      container: this._container,
      audio: this._audio,
      save: this._save
    });
    this._gameOverScene = new GameOverScene({
      container: this._container,
      save: this._save,
      onRetry: () => this._toPlaying(),
      onMenu: () => this._toMenu()
    });
    this._gameScene.start(performance.now());
  }
  _cleanupScenes() {
    if (this._menuScene) {
      this._menuScene.dispose();
      this._menuScene = null;
    }
    if (this._gameScene) {
      this._gameScene.dispose();
      this._gameScene = null;
    }
    if (this._gameOverScene) {
      this._gameOverScene.dispose();
      this._gameOverScene = null;
    }
    Bus.clear();
  }
  /* ═══════════════════════════════
     MAIN LOOP
  ═══════════════════════════════ */
  _loop(timestamp) {
    this._raf = requestAnimationFrame((t) => this._loop(t));
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
    if (this._raf)
      cancelAnimationFrame(this._raf);
    this._cleanupScenes();
    this._audio.destroy();
    this._renderer.dispose();
    this._canvas.remove();
    window.removeEventListener("resize", this._resize);
  }
};

// src/main.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("game-container");
  if (!container) {
    console.error("Sky Runner: #game-container not found");
    return;
  }
  const game = new Game(container);
  game.start();
  if (false) {
    window._game = game;
  }
});
