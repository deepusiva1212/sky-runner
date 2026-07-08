/**
 * constants.js
 * Single source of truth for all tunable game values.
 * Change values here — no need to hunt through code.
 */

export const GAME = {
  TARGET_FPS: 60,
  CANVAS_WIDTH: 480,
  CANVAS_HEIGHT: 720,
};

export const TRACK = {
  LANE_POSITIONS: [-2.2, 0, 2.2],   // X positions of 3 lanes
  LANE_WIDTH: 2.0,
  SEGMENT_LENGTH: 20,                // Length of each track tile
  NUM_SEGMENTS: 12,                  // How many tiles in view at once
  SCROLL_START_Z: 8,                 // Z position of farthest tile
  GROUND_Y: 0,                       // Y position of track surface
  SIDE_WALL_X: 4.0,
};

export const PLAYER = {
  START_LANE: 1,                     // Center lane
  START_Z: 7,                        // Z position (fixed, world moves toward player)
  HEIGHT: 2.0,                       // Standing height
  ROLL_HEIGHT: 0.8,                  // Crouched height
  JUMP_VELOCITY: 0.19,               // Initial jump Y velocity
  JUMP_DOUBLE_VELOCITY: 0.15,        // Double jump Y velocity
  GRAVITY: -0.012,                   // Gravity applied per frame
  LANE_SWITCH_SPEED: 0.18,           // Lerp factor for lane switching
  INVINCIBLE_DURATION: 90,           // Frames of invincibility after hit
  COLLISION_RADIUS_X: 0.45,
  COLLISION_RADIUS_Y: 1.0,
  COLLISION_RADIUS_Z: 0.6,
};

export const SPEED = {
  INITIAL: 0.28,                     // Starting world scroll speed
  MAX: 0.65,                         // Maximum speed
  INCREMENT: 0.000085,               // Speed increase per frame
  BOOST_MULTIPLIER: 1.8,             // Speed multiplier during Boost powerup
};

export const OBSTACLES = {
  POOL_SIZE: 20,
  SPAWN_Z: -65,                      // Spawn far in front
  DESPAWN_Z: 14,                     // Remove when behind camera
  INITIAL_INTERVAL: 3.5,            // Seconds between spawns at start
  MIN_INTERVAL: 1.8,                 // Minimum spawn interval (hardest)
  DIFFICULTY_SCALE: 0.00025,         // How fast interval shrinks
};

export const COINS = {
  POOL_SIZE: 40,
  SPAWN_Z: -60,
  DESPAWN_Z: 14,
  VALUE: 10,                         // Score per coin
  MAGNET_RADIUS: 3.5,               // Auto-collect radius during magnet powerup
  ROW_COUNT: [3, 4, 5, 6],          // Random coin row lengths
};

export const POWERUPS = {
  SPAWN_CHANCE: 0.3,                 // 30% chance a coin row has a powerup instead
  TYPES: ['magnet', 'shield', 'boost', 'x2'],
  DURATIONS: {                       // In seconds
    magnet: 8,
    shield: 10,
    boost: 5,
    x2: 12,
  },
};

export const SCORING = {
  BASE_PER_FRAME: 1,
  COIN_BONUS: 10,
  NEAR_MISS_BONUS: 50,
  MULTIPLIER_MAX: 4,
  MULTIPLIER_COIN_THRESHOLD: 10,    // Coins to increase multiplier
};

export const CAMERA = {
  POSITION: { x: 0, y: 4.5, z: 10 },
  LOOK_AT: { x: 0, y: 1.5, z: -5 },
  FOV: 65,
  NEAR: 0.1,
  FAR: 200,
  LEAN_AMOUNT: 0.18,                // How much camera pans on lane switch
  LEAN_SPEED: 0.06,
};

export const PARTICLES = {
  MAX_PARTICLES: 500,
  COIN_BURST_COUNT: 12,
  CRASH_BURST_COUNT: 24,
  TRAIL_COUNT: 6,
  BOOST_TRAIL_COUNT: 10,
};

export const SKINS = {
  ALL: [
    { id: 'rosa',   name: 'Rosa',       cost: 0,      unlocked: true  },
    { id: 'ninja',  name: 'Ninja',      cost: 1000,   unlocked: false },
    { id: 'space',  name: 'Space Kid',  cost: 2500,   unlocked: false },
    { id: 'dino',   name: 'Dino',       cost: 5000,   unlocked: false },
    { id: 'robot',  name: 'Robot',      cost: 10000,  unlocked: false },
  ],
};

export const ENVIRONMENTS = {
  ALL: [
    { id: 'city',   name: 'City Night', unlocked: true  },
    { id: 'jungle', name: 'Jungle',     unlocked: false },
    { id: 'space',  name: 'Space',      unlocked: false },
  ],
  BUILDING_COLORS: {
    city:   [0x2D1B5E, 0x1A237E, 0x4A148C, 0x37474F, 0x1B1B2F],
    jungle: [0x1B5E20, 0x33691E, 0x004D40, 0x2E7D32, 0x388E3C],
    space:  [0x0D47A1, 0x006064, 0x1A237E, 0x311B92, 0x01579B],
  },
};

export const AUDIO = {
  BGM_VOLUME: 0.4,
  SFX_VOLUME: 0.7,
  JUMP_FREQ: 520,
  COIN_FREQ: 880,
  HIT_FREQ: 180,
  POWERUP_FREQ: 660,
  LAND_FREQ: 200,
};

export const SAVE_KEYS = {
  HIGH_SCORE: 'sr_high_score',
  TOTAL_COINS: 'sr_coins',
  SKINS: 'sr_skins',
  ACTIVE_SKIN: 'sr_active_skin',
  ACTIVE_ENV: 'sr_active_env',
  SETTINGS: 'sr_settings',
  DAILY_REWARD: 'sr_daily',
};
