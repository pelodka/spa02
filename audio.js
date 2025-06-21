// audio.js — SPA background music and SFX

// 1. Background music (looped, starts on first interaction)
let bgm = new Audio('audio/background.mp3');
bgm.loop = true;
bgm.volume = 0.6;

let bgmStarted = false;

// Helper to start BGM only once
function startBgm() {
  if (!bgmStarted) {
    bgm.play().catch(()=>{});
    bgmStarted = true;
  }
}

// --- 2. SFX PATHS ---
const sfxPaths = {
  jump:      'audio/jump.mp3',
  interact:  'audio/interact.mp3',
  chestOpen: 'audio/chest_open.mp3',
  victory:   'audio/victory.mp3',
  dragon:    'audio/dragon.mp3',
  explosion: 'audio/explosion.mp3',
  evillaugh: 'audio/evillaugh.mp3',
  collect:   'audio/collect.mp3',
  // Add any additional SFX here as needed
};

// --- 3. SFX cache and play helper ---
const sfxCache = {};

function playSfx(name) {
  startBgm(); // ensure BGM starts on first interaction
  const path = sfxPaths[name];
  if (!path) return;
  let snd = sfxCache[name];
  if (!snd) {
    snd = new Audio(path);
    sfxCache[name] = snd;
  }
  snd.currentTime = 0;
  snd.play().catch(()=>{});
}

// --- 4. Scene-specific hooks for your SPA (optional, use in your scene code) ---

window.audio = {
  playJump:    () => playSfx('jump'),
  playInteract:() => playSfx('interact'),
  playChestOpen:() => {
    playSfx('chestOpen');
    // Return audio object for "ended" listeners if needed
    let snd = sfxCache['chestOpen'];
    if (!snd) { snd = new Audio(sfxPaths['chestOpen']); sfxCache['chestOpen'] = snd; }
    return snd;
  },
  playVictory: () => playSfx('victory'),
  playDragon:  () => playSfx('dragon'),
  playExplosion: () => playSfx('explosion'),
  playEvillaugh: () => playSfx('evillaugh'),
  playCollect: () => playSfx('collect'),
  // If you add more SFX, expose them here too!
  stopBgm:     () => { bgm.pause(); bgm.currentTime = 0; bgmStarted = false; },
  switchBgm:   (track) => {
    if (bgm) { bgm.pause(); }
    if (track === 'minigame') {
      bgm = new Audio('audio/minigame.mp3'); // If you have a minigame track!
    } else {
      bgm = new Audio('audio/background.mp3');
    }
    bgm.loop = true;
    bgm.volume = 0.6;
    startBgm();
  },
  restoreBgm:  () => {
    bgm.pause();
    bgm = new Audio('audio/background.mp3');
    bgm.loop = true;
    bgm.volume = 0.6;
    startBgm();
  }
};

// Start BGM on first input
window.addEventListener('pointerdown', startBgm, { once: true });
window.addEventListener('keydown', startBgm, { once: true });
