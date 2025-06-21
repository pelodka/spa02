// main.js — SPA version

// --- SPA Router & State ---
const Scenes = {};        // Holds scene loaders by name
let gameState = {};       // Global state object (inventory, progress, etc.)
let currentScene = null;  // Track current scene for cleanup

// Utility to load a scene by name
function loadScene(name, data) {
  // Clean up old scene
  if (currentScene && typeof currentScene.destroy === 'function') {
    currentScene.destroy();
  }
  document.getElementById('app').innerHTML = ''; // Clear container

  // Load new scene
  if (!Scenes[name]) {
    document.getElementById('app').innerHTML = `<div style="color:white">Scene "${name}" not found</div>`;
    return;
  }
  currentScene = Scenes[name](data);
}

// Helper for loading images and audio only when needed
function preloadAssets(assets, cb) {
  let loaded = 0, total = assets.length;
  if (total === 0) return cb();
  assets.forEach(asset => {
    let el;
    if (asset.endsWith('.mp3') || asset.endsWith('.wav')) {
      el = new Audio();
      el.src = asset;
    } else {
      el = new Image();
      el.src = asset;
    }
    el.onload = el.onerror = () => {
      loaded++;
      if (loaded === total) cb();
    };
  });
}

// SPA entry point
window.addEventListener('DOMContentLoaded', () => {
  gameState = {
    presents: [],
    wizardHints: [],
    finishedMinigames: {},
    // Add other game-wide state here
  };
  loadScene('start');
});

// -- END SPA BOOTSTRAP --
Scenes.start = function() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="wrapper">
      <div id="game-container">
        <div id="start-screen" class="centered">
          <button id="go-btn">ПОГНАЛИ</button>
        </div>
        <div id="loading-screen" class="centered" style="display:none">
          <p>СОБИРАЕМ ПОДАРКИ...</p>
        </div>
        <div id="gift-section" class="centered" style="display:none">
          <div id="gift-cards">
            <img id="gift1" class="gift-card" src="gift_card_1.png" alt="Gift 1">
            <img id="gift2" class="gift-card" src="gift_card_2.png" alt="Gift 2">
          </div>
          <button id="get-presents"></button>
        </div>
        <div id="dragon-bundle" class="dragon-bundle">
          <div id="dragon" class="dragon"></div>
        </div>
      </div>
      <div id="transition-overlay"></div>
    </div>
  `;

  // Responsive scaling
  function updateScale() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw/1920, vh/1200);
    const w = document.getElementById('wrapper');
    w.style.transform = `scale(${scale})`;
    w.style.left = `${(vw - 1920*scale)/2}px`;
    w.style.top  = `${(vh - 1200*scale)/2}px`;
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // DOM refs
  const goBtn = document.getElementById('go-btn');
  const startS = document.getElementById('start-screen');
  const loadS  = document.getElementById('loading-screen');
  const giftS  = document.getElementById('gift-section');
  const gift1  = document.getElementById('gift1');
  const gift2  = document.getElementById('gift2');
  const getBtn = document.getElementById('get-presents');
  const gameC  = document.getElementById('game-container');
  const dragonB= document.getElementById('dragon-bundle');
  const dragon = document.getElementById('dragon');
  const overlay = document.getElementById('transition-overlay');

  // SPA transition (replaces location.href)
  function startTransition() {
    gameC.classList.add('pixelate');
    overlay.style.opacity = '1';
    gameC.addEventListener('animationend', () => {
      loadScene('scene2');
    }, { once: true });
  }

  // GO -> loading -> gifts
  goBtn.addEventListener('click', () => {
    startS.style.display = 'none';
    loadS.style.display  = 'block';
    setTimeout(() => {
      loadS.style.display = 'none';
      giftS.style.display = 'block';
    }, 2000);
  });

  // Gift selection
  let selected = new Set();
  function toggleGift(img) {
    if (selected.has(img.id)) {
      selected.delete(img.id);
      img.classList.remove('selected');
    } else {
      selected.add(img.id);
      img.classList.add('selected');
    }
    getBtn.classList.toggle('enabled', selected.size===2);
  }
  gift1.addEventListener('click', ()=>toggleGift(gift1));
  gift2.addEventListener('click', ()=>toggleGift(gift2));

  // Dragon sequence (SPA version)
  getBtn.addEventListener('click', ()=>{
    if (!getBtn.classList.contains('enabled')) return;
    gameC.classList.add('shake');
    if (typeof playSfx === 'function') playSfx('explosion');
    setTimeout(()=>{
      dragonB.style.display='block';
      dragonB.style.left='30%'; dragonB.style.top='20%';
      setTimeout(()=>{
        dragonB.style.left='50%'; dragonB.style.top='30%';
        dragonB.style.transform='translate(-50%,-50%) scale(3)';
        setTimeout(()=>{
          const bubble=document.createElement('div');
          bubble.className='speech'; 
          bubble.textContent='ХА-ХА!';
          if (typeof playSfx === 'function') playSfx('evillaugh');
          dragon.appendChild(bubble);
          [gift1,gift2].forEach((g,i)=>{
            g.style.position='absolute';
            g.style.top='70px';
            g.style.left = i? '120px':'-60px';
            dragonB.appendChild(g);
          });
          setTimeout(()=>{
            dragonB.style.left='120%'; dragonB.style.top='10%';
            setTimeout(startTransition,1000);
          },1500);
        },1000);
      },1000);
    },500);
  });

  // Touch support
  [goBtn,gift1,gift2,getBtn].forEach(btn=>{
    btn.addEventListener('touchstart',e=>{e.preventDefault();btn.click();},{passive:false});
  });

  // Clean up all listeners on scene exit
  return {
    destroy() {
      window.removeEventListener('resize', updateScale);
      // Further cleanup if you add global listeners here
    }
  };
};
Scenes.scene2 = function() {
  // Set up HTML (copying your #wrapper structure)
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="wrapper">
      <div id="game-container">
        <div id="player"></div>
        <!-- Touch controls overlay -->
        <div id="touch-controls">
          <button id="btn-left" class="touch-btn">◀</button>
          <button id="btn-jump" class="touch-btn">▲</button>
          <button id="btn-right" class="touch-btn">▶</button>
        </div>
      </div>
    </div>
  `;

  // --- Styles ---
  // (These should already be in your index.html <style> for the SPA, or add as needed)

  // --- Responsive scaling (ported) ---
  function updateScale() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw/1920, vh/1200);
    const wrap = document.getElementById('wrapper');
    wrap.style.transform = `scale(${scale})`;
    wrap.style.left = `${(vw - 1920*scale)/2}px`;
    wrap.style.top  = `${(vh - 1200*scale)/2}px`;
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // --- Logic copied from your scene2.html ---
  const player       = document.getElementById('player');
  const wrapper      = document.getElementById('wrapper');
  const leftLimit    = 0;
  const rightLimit   = 1920 - 320;
  let posX           = 800;
  let posY           = 0;
  let isJumping      = false;
  let jumpSpeed      = 0;
  const gravity      = 0.8;
  let keys           = {};
  let canMove        = false;
  let transitioning  = false;

  // Initial speech bubble
  const bubble = document.createElement('div');
  bubble.className = 'speech';
  bubble.textContent = 'НУ И ГДЕ МОИ ПОДАРКИ?! КУДА ТЕПЕРЬ ИДТИ - НАЛЕВО ИЛИ НАПРАВО?';
  player.appendChild(bubble);

  // Input handlers
  function keydownHandler(e) {
    keys[e.key.toLowerCase()] = true;
    if (!canMove && !transitioning) {
      canMove = true;
      bubble.remove();
    }
  }
  function keyupHandler(e) {
    keys[e.key.toLowerCase()] = false;
  }
  function mousedownHandler() {
    if (!canMove && !transitioning) {
      canMove = true;
      bubble.remove();
    }
  }
  window.addEventListener('keydown', keydownHandler);
  window.addEventListener('keyup', keyupHandler);
  window.addEventListener('mousedown', mousedownHandler);

  [['left','arrowleft'], ['jump',' '], ['right','arrowright']].forEach(([id, key]) => {
    const btn = document.getElementById('btn-' + id);
    btn.addEventListener('touchstart', e => {
      e.preventDefault(); keys[key] = true;
      if (!canMove && !transitioning) {
        canMove = true;
        bubble.remove();
      }
    }, {passive:false});
    btn.addEventListener('touchend', e => {
      e.preventDefault(); keys[key] = false;
    }, {passive:false});
  });

  // Update player position
  function updatePos() {
    player.style.left   = posX + 'px';
    player.style.bottom = (100 + posY) + 'px';
  }

  // --- SPA Transition: instead of location.href, use loadScene ---
  function startTransition(side) {
    if (transitioning) return;
    transitioning = true;
    canMove = false;
    wrapper.classList.add('transition');
    setTimeout(() => {
      // In SPA, pass "exit" as scene data to next scene
      loadScene('wizard01', { exit: side });
    }, 600);
  }

  // Main game loop
  function gameLoop() {
    if (canMove && !transitioning) {
      // Move left
      if (keys['arrowleft'] || keys['a']) {
        posX = Math.max(leftLimit, posX - 4);
        player.classList.add('flipped');
        if (posX === leftLimit) startTransition('left');
      }
      // Move right
      if (keys['arrowright'] || keys['d']) {
        posX = Math.min(rightLimit, posX + 4);
        player.classList.remove('flipped');
        if (posX === rightLimit) startTransition('right');
      }
      // Jump
      if ((keys[' '] || keys['spacebar']) && !isJumping) {
        isJumping = true;
        jumpSpeed = 15;
        // play jump SFX (SPA safe)
        if (typeof playSfx === 'function') playSfx('jump');
      }
    }

    // Gravity
    if (isJumping) {
      posY += jumpSpeed;
      jumpSpeed -= gravity;
      if (posY <= 0) {
        posY = 0;
        isJumping = false;
      }
    }

    updatePos();
    requestAnimationFrame(gameLoop);
  }

  updatePos();
  gameLoop();

  return {
    destroy() {
      // Remove event listeners to prevent leaks
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('keyup', keyupHandler);
      window.removeEventListener('mousedown', mousedownHandler);
    }
  };
};
Scenes.wizard01 = function(data) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="wrapper">
      <div id="game-container">
        <div id="player"></div>
        <div id="wizard">
          <img id="wizard-img" src="wizard1.png" alt="Wizard" />
          <div id="prompt">Press E</div>
        </div>
        <div id="ground"></div>
        <div id="dialog-overlay">
          <div id="dialog-box">
            <p id="dialog-text"></p>
            <div id="choices"></div>
          </div>
        </div>
        <div id="minigame-ui"></div>
        <div id="minigame-score"></div>
      </div>
    </div>
  `;

  // --- Responsive scaling ---
  function updateScale() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw/1920, vh/1200);
    const wrap = document.getElementById('wrapper');
    wrap.style.transform = `scale(${scale})`;
    wrap.style.left = `${(vw - 1920*scale)/2}px`;
    wrap.style.top  = `${(vh - 1200*scale)/2}px`;
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // DOM refs
  const player     = document.getElementById('player');
  const gameArea   = document.getElementById('game-container');
  const prompt     = document.getElementById('prompt');
  const overlay    = document.getElementById('dialog-overlay');
  const dialogText = document.getElementById('dialog-text');
  const choicesDiv = document.getElementById('choices');
  const minigameUI = document.getElementById('minigame-ui');
  const minigameScore = document.getElementById('minigame-score');

  // Movement bounds
  const playerWidth = 320;
  const leftLimit   = 0;
  const rightLimit  = 1920 - playerWidth;

  // SPA: read exit direction from previous scene
  const exitSide = (data && data.exit) || 'right';
  let spawnSide  = (exitSide === 'left') ? 'right' : 'left';
  let posX       = (spawnSide === 'left') ? leftLimit : rightLimit;
  let posY       = 0;

  // State
  let keys = {}, isJumping = false, jumpSpeed = 0, gravity = 0.8;
  let inDialog = false, interactionFinished = false, waitingBlock = false;
  let puzzleSolved = false;
  let blockColor = 'red';
  let minigameActive = false;

  // Dialog data
  const greeting   = 'Привет, Саша! Представляешь, в голове вертится песня! Но не могу ноты ПОДОБРАТЬ, поможешь?';
  const correctTip = 'Ну точно! Спасибо! Кстати, я должен дать тебе подсказку - это <span style="color:red;font-weight:bold;">BLUTEGE</span>.';

  // ---- MINIGAME LOGIC ----
  function startMiniGame() {
    minigameActive = true;
    prompt.style.display = 'none';

    minigameUI.style.display = 'block';
    minigameUI.innerHTML = 'ПОДБЕРИ 7 нот 🎵';
    minigameScore.style.display = 'block';
    minigameScore.textContent = `0 / 7`;

    // BGM switch (if using a SPA BGM switcher)
    if (window.audio && window.audio.switchBgm) window.audio.switchBgm('minigame');

    player.style.background = "url('player_collects.png') center center no-repeat";
    player.style.backgroundSize = 'contain';

    let notesCollected = 0, totalNotes = 7, gameActive = true;
    const activeNotes = [];

    function spawnNote() {
      if (!gameActive) return;
      const note = document.createElement('div');
      note.className = 'note';
      note.innerText = '🎵';
      let nx = Math.floor(Math.random() * (gameArea.clientWidth - 60));
      note.style.left = nx + 'px';
      note.style.top = '0px';
      gameArea.appendChild(note);
      activeNotes.push(note);

      // animation state
      let noteY = 0, speed = 4 + Math.random() * 3, caught = false;
      function fall() {
        if (!gameActive) { note.remove(); return; }
        noteY += speed;
        note.style.top = noteY + 'px';
        // Collision test
        const playerRect = player.getBoundingClientRect();
        const noteRect   = note.getBoundingClientRect();
        const pa = playerRect.left, pb = playerRect.right, na = noteRect.left, nb = noteRect.right;
        const overlapX = (na < pb && nb > pa);
        const noteBottom = noteRect.bottom, playerTop = playerRect.top + 60;
        const overlapY = (noteBottom > playerTop && noteRect.top < playerRect.bottom);

        if (!caught && overlapX && overlapY) {
          caught = true;
          if (window.audio && window.audio.playCollect) window.audio.playCollect();
          note.style.filter = 'brightness(2) drop-shadow(0 0 10px #ff0)';
          setTimeout(() => note.remove(), 100);
          notesCollected++;
          minigameScore.textContent = `${notesCollected} / ${totalNotes}`;
          minigameUI.innerHTML = `Поймано: ${notesCollected} / ${totalNotes} нот 🎵`;
          if (notesCollected >= totalNotes) {
            gameActive = false;
            setTimeout(minigameComplete, 350);
            minigameUI.innerHTML = `Готово!`;
            minigameScore.textContent = `${notesCollected} / ${totalNotes}`;
          }
          return;
        }
        // Missed
        if (noteY > gameArea.clientHeight - 30 && !caught) {
          note.remove();
          if (gameActive) setTimeout(spawnNote, 350);
          return;
        }
        if (!caught && gameActive) requestAnimationFrame(fall);
      }
      requestAnimationFrame(fall);
    }

    // Start notes
    let notesStarted = 0;
    function spawnNotesInterval() {
      if (!gameActive) return;
      spawnNote();
      notesStarted++;
      if (notesStarted < totalNotes) setTimeout(spawnNotesInterval, 700 + Math.random()*800);
    }
    spawnNotesInterval();

    // Player controls (left/right)
    function minigameLoop() {
      if (!gameActive) return;
      if (keys['arrowleft']||keys['a']) { posX = Math.max(leftLimit, posX-6); player.classList.add('flipped'); }
      if (keys['arrowright']||keys['d']){ posX = Math.min(rightLimit,posX+6); player.classList.remove('flipped'); }
      updatePos();
      requestAnimationFrame(minigameLoop);
    }
    minigameLoop();

    // End minigame and proceed
    function minigameComplete() {
      minigameActive = false;
      activeNotes.forEach(n=>n.remove());
      minigameUI.style.display = 'none';
      minigameScore.style.display = 'none';
      player.style.background = "url('player_idle.png') center center no-repeat";
      player.style.backgroundSize = 'contain';
      if (window.audio && window.audio.restoreBgm) window.audio.restoreBgm();
      showBLUTEGETip();
    }
  }
  // ---- END MINIGAME ----

  // Show BLUTEGE tip
  function showBLUTEGETip() {
    inDialog = true;
    overlay.style.display = 'block';
    dialogText.innerHTML = correctTip;
    choicesDiv.innerHTML = '';
    const onInput = () => {
      cleanup(); overlay.style.display = 'none'; inDialog = false; interactionFinished = true; setupCollectible();
    };
    const cleanup = () => {
      window.removeEventListener('keydown', onInput);
      window.removeEventListener('mousedown', onInput);
    };
    window.addEventListener('keydown', onInput);
    window.addEventListener('mousedown', onInput);
  }

  // Initial dialog (greeting, then minigame)
  function startDialog() {
    inDialog = true;
    overlay.style.display = 'block';
    dialogText.textContent = greeting;
    choicesDiv.innerHTML = '';
    setTimeout(() => {
      const proceed = () => { cleanupListeners(); overlay.style.display='none'; inDialog=false; startMiniGame(); };
      const cleanupListeners = () => {
        window.removeEventListener('keydown', proceed);
        window.removeEventListener('mousedown', proceed);
      };
      window.addEventListener('keydown', proceed);
      window.addEventListener('mousedown', proceed);
    }, 0);
  }

  // Set up collectible block
  function setupCollectible() {
    waitingBlock = true;
    player.style.background = "url('player_hands.png') center center no-repeat";
    player.style.backgroundSize = 'contain';
    const block = document.createElement('div');
    block.className = 'collect-block';
    block.style.background = blockColor;
    block.style.left = (posX + (playerWidth - 60)/2) + 'px';
    block.style.bottom = (80 + posY + playerWidth + 10) + 'px';
    gameArea.appendChild(block);
    block.addEventListener('click', () => {
      block.style.transition = 'all 0.5s ease-out';
      block.style.left = '0px'; block.style.bottom = (gameArea.clientHeight - 40) + 'px';
      block.addEventListener('transitionend', () => {
        block.remove(); waitingBlock = false; interactionFinished = true; puzzleSolved = true; player.style.background = "url('player_idle.png') center center no-repeat"; player.style.backgroundSize = 'contain';
      }, { once: true });
    });
  }

  // Update position, proximity, loop
  function updatePos() { player.style.left = posX + 'px'; player.style.bottom = (80 + posY) + 'px'; }
  function checkProximity() {
    const wizardX = (1920 - playerWidth)/2;
    if (minigameActive) {
      prompt.style.display = 'none';
    } else {
      prompt.style.display = (!inDialog && !waitingBlock && Math.abs(posX - wizardX) < playerWidth*0.6) ? 'block' : 'none';
    }
  }
  function gameLoop() {
    if (!inDialog && !waitingBlock) {
      if (keys['arrowleft']||keys['a']) { posX = Math.max(leftLimit, posX-4); player.classList.add('flipped'); }
      if (keys['arrowright']||keys['d']){ posX = Math.min(rightLimit,posX+4); player.classList.remove('flipped'); }
      if ((keys[' ']||keys['arrowup']||keys['w']) && !isJumping) { isJumping=true; jumpSpeed=15; if (typeof playSfx === 'function') playSfx('jump'); }
    }
    if (isJumping) { posY+=jumpSpeed; jumpSpeed-=gravity; if(posY<=0){posY=0;isJumping=false;} }
    updatePos(); checkProximity(); requestAnimationFrame(gameLoop);
  }
  updatePos(); gameLoop();

  // Input (SPA-safe)
  function keydownHandler(e) {
    const key = e.key.toLowerCase(); keys[key]=true;
    // Interact
    if (key==='e' && prompt.style.display==='block') {
      if (minigameActive) return; // Prevent interaction during minigame!
      if (typeof playSfx === 'function') playSfx('interact');
      if (!interactionFinished) startDialog();
      else if (!waitingBlock) {
        overlay.style.display='block'; dialogText.textContent='ЙЕЕЕ РОЦК! Можешь идти дальше!'; choicesDiv.innerHTML='';
        setTimeout(()=>overlay.style.display='none',2000);
      }
    }
    // Leave (SPA scene transition)
    if (puzzleSolved) {
      if ((key==='arrowleft'||key==='a')&&posX<=leftLimit) loadScene('wizard02', { exit: 'left' });
      if ((key==='arrowright'||key==='d')&&posX>=rightLimit) loadScene('wizard02', { exit: 'right' });
    }
  }
  function keyupHandler(e) { keys[e.key.toLowerCase()] = false; }

  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);

  // Cleanup
  return {
    destroy() {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    }
  };
};
Scenes.wizard02 = function(data) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="wrapper">
      <div id="game-container">
        <div id="player"></div>
        <div id="wizard">
          <img id="wizard-img" src="wizard2.png" alt="Wizard" />
          <div id="prompt">Press E</div>
        </div>
        <div id="ground"></div>
        <div id="puzzle-overlay">
          <div id="puzzle-box">
            <div id="dialog-name"></div>
            <div id="dialog-text"></div>
            <div id="blocks" class="blocks-container"></div>
            <div class="drop-areas">
              <div id="rejectContainer" class="drop-area-container">
                <div id="rejectArea" class="drop-area">ОТКЛОНИТЬ</div>
              </div>
              <div id="approveContainer" class="drop-area-container">
                <div id="approveArea" class="drop-area">УТВЕРДИТЬ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- Responsive scaling ---
  function updateScale() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1200);
    const wrap = document.getElementById('wrapper');
    wrap.style.transform = `scale(${scale})`;
    wrap.style.left = `${(vw - 1920 * scale) / 2}px`;
    wrap.style.top  = `${(vh - 1200 * scale) / 2}px`;
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // DOM refs
  const player           = document.getElementById('player');
  const gameArea         = document.getElementById('game-container');
  const prompt           = document.getElementById('prompt');
  const overlayPuzzle    = document.getElementById('puzzle-overlay');
  const dialogName       = document.getElementById('dialog-name');
  const dialogTextPuzzle = document.getElementById('dialog-text');
  const blocksDiv        = document.getElementById('blocks');
  const rejectContainer  = document.getElementById('rejectContainer');
  const approveContainer = document.getElementById('approveContainer');
  const rejectArea       = document.getElementById('rejectArea');
  const approveArea      = document.getElementById('approveArea');

  // SPA: read exit direction from previous scene
  const exitSide  = (data && data.exit) || 'right';
  const spawnSide = (exitSide === 'left') ? 'right' : 'left';
  const leftLimit  = 0;
  const rightLimit = 1920 - 320;
  let posX     = (spawnSide === 'left') ? leftLimit : rightLimit;
  let posY     = 0;

  // Puzzle data
  const rejectItems = [
    'Дресс-код для всех работников в любое время года - только черный костюм',
    'Объявление выговора работникам, не употреблявшим коньяк Арарат на последнем корпоративе',
    'Ձայնագրություն Երևանի աշխատակիցներին շտապաբար վերադարձնելու մասին Петебург։',
    'Приказ об окончании COVID в связи со срочным переездом',
    'Приказ об ОБЯЗАТЕЛЬНОМ использовании eMM в работе всех департаментов'
  ];
  const approveItems = [
    'Приказ о принятии политики использования софта в компании',
    'Приказ об установлении режима конфиденциальности в компании',
    'Приказ о предоставлении сотрудникам дополнительного выходного дня в течение года',
    'Приказ о порядке проведения  корпоративных мероприятий',
    'Приказ о порядке утилизации мусора на территории компании'
  ];
  const items = [...rejectItems, ...approveItems].sort(() => Math.random() - 0.5);
  const rejectSet = new Set(rejectItems);
  const totalCount = items.length;
  let placedCount = 0;
  let interactionFinished = false;
  let waitingBlock = false;
  let puzzleSolved = false;

  // 1) Greeting → Puzzle
  function startDialog() {
    interactionFinished = true;
    overlayPuzzle.style.display = 'block';
    dialogName.textContent = '';
    dialogTextPuzzle.textContent = 'Ох, как хорошо что ты здесь, Саша! Все приказы в моей папке перепутались, помоги разобраться!';
    const proceed = e => {
      if (e.type === 'keydown' && e.key.toLowerCase() === 'e') return;
      window.removeEventListener('keydown', proceed);
      window.removeEventListener('mousedown', proceed);
      showPuzzle();
    };
    window.addEventListener('keydown', proceed);
    window.addEventListener('mousedown', proceed);
  }

  function showPuzzle() {
    dialogName.textContent = 'НА ПОДПИСЬ';
    dialogTextPuzzle.textContent = '';
    blocksDiv.innerHTML = '';
    items.forEach((text, i) => {
      const d = document.createElement('div');
      d.className = 'block';
      d.textContent = text;
      d.draggable = true;
      d.id = 'block' + i;
      d.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', d.id));
      blocksDiv.appendChild(d);
    });
    blocksDiv.style.display        = 'grid';
    rejectContainer.style.display  = 'block';
    approveContainer.style.display = 'block';
  }

  // 2) Drag & Drop with screenshake on wrong
  [rejectArea, approveArea].forEach(area => {
    area.addEventListener('dragover', e => e.preventDefault());
    area.addEventListener('drop', e => {
      e.preventDefault();
      const id    = e.dataTransfer.getData('text/plain');
      const block = document.getElementById(id);
      const correct = (area === rejectArea) ? rejectSet.has(block.textContent) : !rejectSet.has(block.textContent);
      if (correct) {
        block.remove(); placedCount++;
        if (placedCount === totalCount) finishPuzzle();
      } else {
        dialogTextPuzzle.textContent = 'Что на это скажет Марк?';
        gameArea.classList.add('shake');
        gameArea.addEventListener('animationend', () => gameArea.classList.remove('shake'), { once: true });
        setTimeout(() => dialogTextPuzzle.textContent = '', 3000);
      }
    });
  });

  // 3) Puzzle Complete
  function finishPuzzle() {
    dialogName.textContent = '';
    blocksDiv.style.display        = 'none';
    rejectContainer.style.display  = 'none';
    approveContainer.style.display = 'none';
    dialogTextPuzzle.innerHTML = 'Фух! Большое спасибо! Вот еще одна подсказка - <span style="color: gold; font-weight: bold;">GOLDEN</span>.';
    const proceed = e => {
      if (e.type === 'keydown' && e.key.toLowerCase() === 'e') return;
      window.removeEventListener('keydown', proceed);
      window.removeEventListener('mousedown', proceed);
      overlayPuzzle.style.display = 'none';
      setupCollectible(); puzzleSolved = true;
    };
    window.addEventListener('keydown', proceed);
    window.addEventListener('mousedown', proceed);
  }

  // Collectible spawn
  function setupCollectible() {
    waitingBlock = true;
    player.style.background = "url('player_hands.png') center center no-repeat";
    player.style.backgroundSize = 'contain';
    const block = document.createElement('div'); block.className = 'collect-block';
    block.style.background = 'gold';
    const xPos = (posX + (320 - 60)/2) + 'px';
    block.style.left = xPos; block.style.bottom = (80 + 320 + 10) + 'px'; gameArea.appendChild(block);
    block.addEventListener('click', () => {
      block.style.transition = 'all 0.5s ease-out';
      block.style.left = '0px'; block.style.bottom = (gameArea.clientHeight - 40) + 'px';
      block.addEventListener('transitionend', () => {
        block.remove(); waitingBlock = false;
        player.style.background = "url('player_idle.png') center center no-repeat";
        player.style.backgroundSize = 'contain';
      }, { once: true });
    });
  }

  // Movement & game loop
  let keys = {}, isJumping = false, jumpSpeed = 0, gravity = 0.8;
  function checkProximity() {
    const wizardX = (1920-320)/2;
    prompt.style.display = (!waitingBlock && Math.abs(posX-wizardX)<192) ? 'block' : 'none';
  }
  function gameLoop() {
    if(!waitingBlock){
      if(keys['arrowleft']||keys['a']){posX=Math.max(0,posX-4);player.classList.add('flipped');}
      if(keys['arrowright']||keys['d']){posX=Math.min(1920-320,posX+4);player.classList.remove('flipped');}
      if((keys[' ']||keys['arrowup']||keys['w'])&&!isJumping){isJumping=true;jumpSpeed=15;if(typeof playSfx==='function')playSfx('jump');}
    }
    if(isJumping){posY+=jumpSpeed;jumpSpeed-=gravity;if(posY<=0){posY=0;isJumping=false;}}
    player.style.left = posX + 'px'; player.style.bottom = (80 + posY) + 'px';
    checkProximity(); requestAnimationFrame(gameLoop);
  }
  player.style.left = posX + 'px'; player.style.bottom = (80 + posY) + 'px';
  gameLoop();

  // Input & SPA transition
  function keydownHandler(e) {
    keys[e.key.toLowerCase()] = true;
    if(e.key.toLowerCase()==='e'){
      if(typeof playSfx==='function')playSfx('interact');
      if(!interactionFinished)startDialog();else if(!waitingBlock){overlayPuzzle.style.display='block';dialogTextPuzzle.textContent='Иди же дальше!';setTimeout(()=>overlayPuzzle.style.display='none',2000);}
    }
    if(puzzleSolved){
      if((e.key.toLowerCase()==='arrowleft'||e.key.toLowerCase()==='a')&&posX<=leftLimit)loadScene('wizard03',{exit:'left'});
      if((e.key.toLowerCase()==='arrowright'||e.key.toLowerCase()==='d')&&posX>=rightLimit)loadScene('wizard03',{exit:'right'});
    }
  }
  function keyupHandler(e) { keys[e.key.toLowerCase()] = false; }
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);

  return {
    destroy() {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    }
  };
};
Scenes.wizard03 = function(data) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="wrapper">
      <div id="game-container">
        <div id="player"></div>
        <div id="wizard">
          <img id="wizard-img" src="wizard3.png" alt="Wizard" />
          <div id="prompt">Press E</div>
          <div id="wizard-message"></div>
        </div>
        <div id="ground"></div>
        <div id="puzzle-overlay">
          <div id="greet-box" class="box">
            <div>О, Саша, слава богу ты здесь! Надо срочно ответить на письмо из Финанзамт!</div>
          </div>
          <div id="puzzle-box" class="box">
            <h1>Чему вас научила немецко-армянская налоговая одиссея?</h1>
            <div id="error-text" style="display:none; margin:16px 0; font-size:30px; color:red;">Эх, все же придется звонить KPMG!</div>
            <button class="puzzle-answer" data-correct="false">Провайдеры бывают глобальными, а ответственность нет</button>
            <button class="puzzle-answer" data-correct="false">В Finanzamt отвечают медленно, но зато верно</button>
            <button class="puzzle-answer" data-correct="false">Когда тебе отвечают “мы это уточним” — лучше начинай уточнять сам</button>
            <button class="puzzle-answer" data-correct="false">На лучшую налоговую консультацию к SVP R&D можно записаться через телеграм</button>
            <button class="puzzle-answer" data-correct="true">Все вышеперечисленное</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Scaling
  function updateScale() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1200);
    const wrap = document.getElementById('wrapper');
    wrap.style.transform = `scale(${scale})`;
    wrap.style.left = `${(vw - 1920 * scale) / 2}px`;
    wrap.style.top = `${(vh - 1200 * scale) / 2}px`;
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // DOM refs
  const player = document.getElementById('player');
  const gameArea = document.getElementById('game-container');
  const prompt = document.getElementById('prompt');
  const overlay = document.getElementById('puzzle-overlay');
  const greetBox = document.getElementById('greet-box');
  const puzzleBox = document.getElementById('puzzle-box');
  const wizardMsg = document.getElementById('wizard-message');

  // SPA: read exit direction from previous scene
  const exitSide = (data && data.exit) || 'right';
  const leftLimit = 0;
  const rightLimit = 1920 - 320;
  let posX = (exitSide === 'left') ? rightLimit : leftLimit;
  let posY = 0;

  let interactionFinished = false;
  let waitingBlock = false;
  let puzzleSolved = false;
  let blockSpawned = false; // prevents duplicate block spawn

  // Greeting & puzzle
  function startPlaceholder() {
    interactionFinished = true;
    overlay.style.display = 'block';
    greetBox.style.display = 'block';
    function ack() {
      greetBox.style.display = 'none';
      puzzleBox.style.display = 'block';
    }
    overlay.addEventListener('click', ack, { once: true });
    document.addEventListener('keydown', ack, { once: true });
  }

  // Collectible
  function setupCollectible() {
    blockSpawned = true;
    waitingBlock = true;
    player.style.background = "url('player_hands.png') center center no-repeat";
    player.style.backgroundSize = 'contain';
    const block = document.createElement('div');
    block.className = 'collect-block';
    block.style.background = 'black';
    const xPos = (posX + (320 - 60) / 2) + 'px';
    block.style.left = xPos;
    block.style.bottom = (80 + 320 + 10) + 'px';
    gameArea.appendChild(block);
    block.addEventListener('click', () => {
      block.style.transition = 'all 0.5s ease-out';
      block.style.left = '0px';
      block.style.bottom = (gameArea.clientHeight - 40) + 'px';
      block.addEventListener('transitionend', () => {
        block.remove();
        waitingBlock = false;
        player.style.background = "url('player_idle.png') center center no-repeat";
        player.style.backgroundSize = 'contain';
      }, { once: true });
    });
  }

  // Final dialog after collect (not automatic)
  function showFinalDialog() {
    wizardMsg.innerHTML = 'Отлично! Осталось совсем чуть-чуть! Не отступай!';
    wizardMsg.style.display = 'block';
    wizardMsg.addEventListener('click', () => { wizardMsg.style.display = 'none'; }, { once: true });
    document.addEventListener('keydown', () => { wizardMsg.style.display = 'none'; }, { once: true });
  }

  // Puzzle answer logic
  puzzleBox.querySelectorAll('.puzzle-answer').forEach(btn => btn.addEventListener('click', () => {
    const correct = btn.dataset.correct === 'true';
    if (!correct) {
      puzzleBox.style.animation = 'shake 0.5s';
      document.getElementById('error-text').style.display = 'block';
      function clearErr() {
        puzzleBox.style.animation = '';
        document.getElementById('error-text').style.display = 'none';
        document.removeEventListener('mousemove', clearErr);
      }
      document.addEventListener('mousemove', clearErr, { once: true });
    } else {
      overlay.style.display = 'none';
      puzzleSolved = true;
      puzzleBox.style.display = 'none';
      // Show Schwarz hint and then collectible
      wizardMsg.innerHTML = 'Ну конечно! Спасибо тебе! Последняя подсказка - <strong>SCHWARZ</strong>';
      wizardMsg.style.display = 'block';
      function ackWizard() {
        wizardMsg.style.display = 'none';
        if (!blockSpawned) setupCollectible();
      }
      wizardMsg.addEventListener('click', ackWizard, { once: true });
      document.addEventListener('keydown', ackWizard, { once: true });
    }
  }));

  // Movement
  let keys = {}, isJumping = false, jumpSpeed = 0, gravity = 0.8;
  function checkProximity() {
    const wizardX = (1920 - 320) / 2;
    const near = Math.abs(posX - wizardX) < 192;
    const show = !waitingBlock && near && (!interactionFinished || puzzleSolved);
    prompt.style.display = show ? 'block' : 'none';
  }
  function gameLoop() {
    if (!waitingBlock) {
      if (keys['arrowleft'] || keys['a']) {
        posX = Math.max(0, posX - 4); player.classList.add('flipped');
      }
      if (keys['arrowright'] || keys['d']) {
        posX = Math.min(1920 - 320, posX + 4); player.classList.remove('flipped');
      }
      if ((keys[' '] || keys['arrowup'] || keys['w']) && !isJumping) {
        isJumping = true;
        jumpSpeed = 15;
        if (typeof playSfx === 'function') playSfx('jump');
      }
    }
    if (isJumping) {
      posY += jumpSpeed; jumpSpeed -= gravity;
      if (posY <= 0) { posY = 0; isJumping = false; }
    }
    player.style.left = posX + 'px';
    player.style.bottom = (80 + posY) + 'px';
    checkProximity();
    requestAnimationFrame(gameLoop);
  }
  player.style.left = posX + 'px';
  player.style.bottom = (80 + posY) + 'px';
  gameLoop();

  // Input handling & SPA transitions
  function keydownHandler(e) {
    const key = e.key.toLowerCase();
    keys[key] = true;
    if (key === 'e') {
      if (typeof playSfx === 'function') playSfx('interact');
      const wizardX = (1920 - 320) / 2;
      const near = Math.abs(posX - wizardX) < 192;
      if (!interactionFinished && near) {
        startPlaceholder();
      } else if (puzzleSolved && near) {
        showFinalDialog();
      }
    }
    if (puzzleSolved) {
      if ((key === 'arrowleft' || key === 'a') && posX <= leftLimit) loadScene('chest', { exit: 'left' });
      if ((key === 'arrowright' || key === 'd') && posX >= rightLimit) loadScene('chest', { exit: 'right' });
    }
  }
  function keyupHandler(e) { keys[e.key.toLowerCase()] = false; }
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);

  return {
    destroy() {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    }
  };
};
Scenes.chest = function(data) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="wrapper">
      <div id="game-container">
        <div id="player"></div>
        <div id="wizard">
          <img id="wizard-img" src="chest_closed.png" alt="Chest" />
          <div id="prompt">Press E</div>
        </div>
        <div id="ground"></div>
        <div id="dialog-overlay">
          <div id="dialog-box">
            <div id="box-container"></div>
            <p id="dialog-text"></p>
            <button id="open-btn">ОТКРЫТЬ</button>
            <div id="feedback"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Responsive scaling
  function updateScale() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1200);
    const wrap = document.getElementById('wrapper');
    wrap.style.transform = `scale(${scale})`;
    wrap.style.left = `${(vw - 1920 * scale) / 2}px`;
    wrap.style.top = `${(vh - 1200 * scale) / 2}px`;
  }
  window.addEventListener('resize', updateScale);
  updateScale();

  // DOM refs
  const player = document.getElementById('player');
  const gameArea = document.getElementById('game-container');
  const prompt = document.getElementById('prompt');
  const overlay = document.getElementById('dialog-overlay');
  const dialogText = document.getElementById('dialog-text');
  const boxContainer = document.getElementById('box-container');
  const openBtn = document.getElementById('open-btn');
  const feedback = document.getElementById('feedback');
  const wizardImg = document.getElementById('wizard-img');

  // Puzzle state
  let puzzleSolved = false;
  let inDialog = false;
  let dragData = null;

  // Movement state
  let keys = {};
  let isJumping = false;
  let jumpSpeed = 0;
  const gravity = 0.8;

  // Puzzle data
  const colors = ['black', 'red', 'gold'];
  const words = { black: 'SWARTZ', red: 'BLUTEGE', gold: 'GOLDENE' };
  const correctOrder = ['black', 'red', 'gold'];

  // Movement bounds & spawn logic
  const playerWidth = 320;
  const leftLimit = 0;
  const rightLimit = 1920 - playerWidth;
  const exitSide = (data && data.exit) || 'right';
  const spawnSide = exitSide === 'left' ? 'right' : 'left';
  let posX = spawnSide === 'left' ? leftLimit : rightLimit;
  let posY = 0;

  // Greeting text
  const greeting = 'А вот и последняя загадка! Подарки уже совсем рядом!';

  // --- Confetti effect logic ---
  const confettiColors = [
    '#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93',
    '#fdffb6', '#b5ead7', '#f9c74f', '#f94144', '#43aa8b'
  ];
  let confettiActive = false;

  function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    const confettiCanvas = document.createElement('div');
    confettiCanvas.id = 'confetti-canvas';
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '99999';
    document.body.appendChild(confettiCanvas);

    function spawnConfetto() {
      if (!confettiActive) return;
      const confetto = document.createElement('div');
      const size = Math.random() * 16 + 8;
      confetto.style.position = 'absolute';
      confetto.style.width = `${size}px`;
      confetto.style.height = `${size * 0.5}px`;
      confetto.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetto.style.borderRadius = `${size / 3}px`;
      confetto.style.left = `${Math.random() * window.innerWidth}px`;
      confetto.style.top = `-32px`;
      confetto.style.opacity = Math.random() * 0.4 + 0.6;
      confetto.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetto.style.pointerEvents = 'none';
      confettiCanvas.appendChild(confetto);

      // Animate confetto
      const duration = Math.random() * 2 + 2.5; // seconds
      const xDrift = (Math.random() - 0.5) * 120;
      const keyframes = [
        { transform: confetto.style.transform, top: '-32px', left: confetto.style.left },
        {
          transform: `rotate(${360 + Math.random() * 180}deg)`,
          top: `${window.innerHeight + 32}px`,
          left: `calc(${confetto.style.left} + ${xDrift}px)`
        }
      ];
      confetto.animate(keyframes, {
        duration: duration * 1000,
        easing: 'linear'
      });

      setTimeout(() => confetto.remove(), duration * 1000);
    }

    function confettiLoop() {
      if (!confettiActive) return;
      for (let i = 0; i < 7; i++) setTimeout(spawnConfetto, i * 80);
      setTimeout(confettiLoop, 180);
    }
    confettiLoop();
  }
  // --- End Confetti effect logic ---

  // Dialog starter
  function startDialog() {
    if (puzzleSolved) return;
    inDialog = true;
    overlay.style.display = 'block';
    dialogText.textContent = greeting;
    boxContainer.innerHTML = '';
    openBtn.style.display = 'none';
    feedback.textContent = '';

    function proceed() {
      overlay.removeEventListener('click', proceed);
      document.removeEventListener('keydown', proceed);
      dialogText.innerHTML =
        'Aus der _________ der Knechtschaft durch _________ Schlachten ans _________ Licht der Freiheit.';
      setupPuzzle();
    }
    overlay.addEventListener('click', proceed, { once: true });
    document.addEventListener('keydown', proceed, { once: true });
  }

  // Create draggable box element
  function createBox(color) {
    const box = document.createElement('div');
    box.className = 'draggable-box';
    box.draggable = true;
    box.dataset.color = color;
    box.style.background = color;
    box.addEventListener('dragstart', () => {
      feedback.textContent = '';
      dragData = { color, from: 'box' };
    });
    return box;
  }

  // Setup puzzle UI
  function setupPuzzle() {
    boxContainer.innerHTML = '';
    colors.forEach(c => boxContainer.appendChild(createBox(c)));
    openBtn.style.display = 'none';
    dialogText.innerHTML =
      `Aus der <span class="drop-target" data-index="0"></span> der Knechtschaft durch <span class="drop-target" data-index="1"></span> Schlachten ans <span class="drop-target" data-index="2"></span> Licht der Freiheit.`;

    document.querySelectorAll('.drop-target').forEach(target => {
      target.draggable = true;
      target.addEventListener('dragstart', e => {
        if (!target.dataset.filled) { e.preventDefault(); return; }
        feedback.textContent = '';
        const color = target.dataset.filled;
        dragData = { color, from: 'target' };
        const img = document.createElement('div');
        img.style.cssText = `width:60px;height:40px;background:${color};position:absolute;top:-1000px;`;
        document.body.appendChild(img);
        e.dataTransfer.setDragImage(img, 30, 20);
        setTimeout(() => document.body.removeChild(img), 0);
        target.textContent = '';
        delete target.dataset.filled;
      });
      target.addEventListener('dragover', e => e.preventDefault());
      target.addEventListener('drop', e => {
        e.preventDefault();
        const prev = target.dataset.filled;
        if (prev) boxContainer.appendChild(createBox(prev));
        const { color, from } = dragData;
        target.textContent = words[color];
        target.style.color = color;
        target.dataset.filled = color;
        if (from === 'box') {
          const orig = boxContainer.querySelector(`.draggable-box[data-color="${color}"]`);
          if (orig) orig.remove();
        }
        checkAllFilled();
        dragData = null;
      });
      target.addEventListener('dragend', () => {
        if (dragData && dragData.from === 'target') {
          boxContainer.appendChild(createBox(dragData.color));
          checkAllFilled();
          dragData = null;
        }
      });
    });
  }

  function checkAllFilled() {
    const all = Array.from(document.querySelectorAll('.drop-target'));
    openBtn.style.display = all.every(t => t.dataset.filled) && !puzzleSolved ? 'inline-block' : 'none';
  }

  // Chest opening logic
  openBtn.addEventListener('click', () => {
    if (puzzleSolved) return;
    feedback.textContent = '';
    const order = Array.from(document.querySelectorAll('.drop-target')).map(t => t.dataset.filled);
    if (order.join() !== correctOrder.join()) {
      feedback.textContent = 'ЧТО-ТО НЕ ТО!';
      return;
    }
    puzzleSolved = true;
    prompt.style.display = 'none';
    if (window.audio && window.audio.stopBgm) window.audio.stopBgm();
    if (window.audio && window.audio.playChestOpen) {
      const chestAudio = window.audio.playChestOpen();
      wizardImg.src = 'chest_opened.png';
      overlay.style.display = 'none';
      inDialog = false;
      if (chestAudio) {
        chestAudio.addEventListener('ended', () => {
          overlay.style.display = 'block';
          inDialog = true;
          dialogText.innerHTML =
            'ПОЗДРАВЛЯЕМ С ДНЕМ РОЖДЕНИЯ! ВОТ ТУТ ТВОИ ПОДАРКИ!<br/><a href="#">[Google Drive Link]</a>';
          boxContainer.innerHTML = '';
          openBtn.style.display = 'none';
          feedback.textContent = '';
          if (window.audio && window.audio.playVictory) window.audio.playVictory();
          startConfetti();
        });
      }
    }
  });

  // Update player position and prompt
  function updatePos() {
    player.style.left = posX + 'px';
    player.style.bottom = (80 + posY) + 'px';
  }
  function checkProximity() {
    if (puzzleSolved) { prompt.style.display = 'none'; return; }
    const wizardX = (1920 - playerWidth) / 2;
    prompt.style.display = !inDialog && Math.abs(posX - wizardX) < playerWidth * 0.6 ? 'block' : 'none';
  }
  function gameLoop() {
    if (!inDialog && !puzzleSolved) {
      if (keys['arrowleft'] || keys['a']) { posX = Math.max(leftLimit, posX - 4); player.classList.add('flipped'); }
      if (keys['arrowright'] || keys['d']) { posX = Math.min(rightLimit, posX + 4); player.classList.remove('flipped'); }
      if ((keys[' '] || keys['arrowup'] || keys['w']) && !isJumping) { isJumping = true; jumpSpeed = 15; if (window.audio && window.audio.playJump) window.audio.playJump(); }
    }
    if (isJumping) {
      posY += jumpSpeed;
      jumpSpeed -= gravity;
      if (posY <= 0) { posY = 0; isJumping = false; }
    }
    updatePos();
    checkProximity();
    requestAnimationFrame(gameLoop);
  }
  updatePos();
  gameLoop();

  // Input listeners
  function keydownHandler(e) {
    if (puzzleSolved) return;
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === 'e' && prompt.style.display === 'block' && !inDialog) {
      if (window.audio && window.audio.playInteract) window.audio.playInteract();
      startDialog();
    }
  }
  function keyupHandler(e) {
    if (puzzleSolved) return;
    const key = e.key.toLowerCase();
    if (key === 'e' && window.audio && window.audio.playInteract) window.audio.playInteract();
    keys[key] = false;
  }
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);

  // Cleanup
  return {
    destroy() {
      window.removeEventListener('resize', updateScale);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
      confettiActive = false;
      const confettiCanvas = document.getElementById('confetti-canvas');
      if (confettiCanvas) confettiCanvas.remove();
    }
  };
};
