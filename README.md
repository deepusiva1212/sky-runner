# 🏃 Sky Runner

> A professional 3D endless runner game — Three.js WebGL engine, 5 character skins, 4 power-ups, 3 world themes, particle effects, synthesized audio, object pooling, and Play Store-ready Capacitor wrapper.
>
> **By Deepu Siva Private Limited**

---

## 🎮 Features

| Category | Details |
|---|---|
| Engine | Three.js r128 (WebGL) |
| Gameplay | 3-lane runner, jump, double jump, roll |
| Obstacles | BoxCrate · Barrier · LowBeam |
| Power-ups | 🧲 Magnet · 🛡️ Shield · ⚡ Boost · ×2 Multi |
| Characters | Rosa · Ninja · Space Kid · Dino · Robot |
| Worlds | City Night · Jungle · Space Station |
| Particles | Coin burst · Crash · Boost trail · PowerUp pop |
| Audio | Synthesized BGM + SFX (no audio files needed) |
| Persistence | High score · Coins · Skins · Daily reward |
| Controls | Touch swipe · Keyboard · Gamepad |
| Android | Capacitor wrapper → Play Store AAB |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the bundle
npm run build

# 3. Open in browser
npm start
# → http://localhost:3000
```

Open `http://localhost:3000` in your browser. Play immediately.

---

## 📱 Build for Android (Play Store)

```bash
# 1. Build web bundle
npm run build

# 2. Add Android platform (first time only)
npm run android:init

# 3. Sync web files into Android
npm run android:sync

# 4. Open in Android Studio
npm run android:open
# Then: Build → Generate Signed Bundle → AAB → Upload to Play Store
```

### Generate Keystore (once, keep this file safe!)
```bash
keytool -genkey -v -keystore android/skyrunner.keystore \
  -alias skyrunner -keyalg RSA -keysize 2048 -validity 10000
```

---

## 📁 Project Structure

```
SkyRunner/
├── public/
│   ├── index.html      ← Game entry point
│   └── bundle.js       ← Built output (npm run build)
├── src/
│   ├── Game.js         ← Top-level controller + renderer
│   ├── constants.js    ← All tunable game values
│   ├── scenes/         ← MenuScene · GameScene · GameOverScene
│   ├── entities/       ← Player · Track · Obstacle · Coin · Environment
│   ├── systems/        ← Audio · Input · Particles · Save · UI
│   └── utils/          ← EventBus · MathUtils · ObjectPool · TextureGenerator
├── docs/
│   ├── ARCHITECTURE.md ← Full technical architecture
│   ├── GAME_DESIGN.md  ← Game design document
│   └── CHANGELOG.md    ← Version history
└── capacitor.config.json
```

---

## 🎨 Adding a New Skin

1. Add skin definition to `src/constants.js` in `SKINS.ALL`
2. Add texture method to `src/utils/TextureGenerator.js`
3. Add `skinId` → texture mapping in `Player.js` `applySkin()`
4. Done — appears automatically in the skin shop

## 🌍 Adding a New Environment

1. Add to `ENVIRONMENTS.ALL` in `src/constants.js`
2. Add building colors to `ENVIRONMENTS.BUILDING_COLORS`
3. Add sky gradient in `TextureGenerator.skyGradient()`
4. Done — appears in the world picker

---

## 📞 Contact

**Deepu Siva Private Limited**
Website: [deepusiva.com](https://deepusiva.com) · Phone: +91 8098889088
