
// main.js — SPA game engine & scene router

const scenes = {}; // registry: { [name]: { init, destroy } }
let currentScene = null;
let lastParams = {};

// DOM root
const SPA_ROOT_ID = "spa-root";

function setSceneContent(html, css) {
    const root = document.getElementById(SPA_ROOT_ID);
    root.innerHTML = `<style>${css}</style>\n${html}`;
}

// SCENE REGISTRATION


scenes['index'] = {
  init: function(params) {
    setSceneContent('<div id="wrapper">\n    <div id="game-container">\n      <div id="start-screen" class="centered">\n        <button id="go-btn">ПОГНАЛИ</button>\n      </div>\n      <div id="loading-screen" class="centered" style="display:none">\n        <p>СОБИРАЕМ ПОДАРКИ...</p>\n      </div>\n      <div id="gift-section" class="centered">\n        <div id="gift-cards">\n          <img id="gift1" class="gift-card" src="gift_card_1.png" alt="Gift 1">\n          <img id="gift2" class="gift-card" src="gift_card_2.png" alt="Gift 2">\n        </div>\n        <button id="get-presents"></button>\n      </div>\n      <div id="dragon-bundle" class="dragon-bundle">\n        <div id="dragon" class="dragon"></div>\n      </div>\n    </div>\n  </div>\n  <div id="transition-overlay"></div>\n\n  <script>\n    // Scale wrapper to fit viewport\n    function updateScale() {\n      const vw = window.innerWidth, vh = window.innerHeight;\n      const scale = Math.min(vw/1920, vh/1200);\n      const w = document.getElementById(\'wrapper\');\n      w.style.transform = `scale(${scale})`;\n      w.style.left = `${(vw - 1920*scale)/2}px`;\n      w.style.top  = `${(vh - 1200*scale)/2}px`;\n    }\n    window.addEventListener(\'resize\', updateScale);\n    updateScale();\n\n    // DOM refs\n    const goBtn = document.getElementById(\'go-btn\');\n    const startS = document.getElementById(\'start-screen\');\n    const loadS  = document.getElementById(\'loading-screen\');\n    const giftS  = document.getElementById(\'gift-section\');\n    const gift1  = document.getElementById(\'gift1\');\n    const gift2  = document.getElementById(\'gift2\');\n    const getBtn = document.getElementById(\'get-presents\');\n    const gameC  = document.getElementById(\'game-container\');\n    const dragonB= document.getElementById(\'dragon-bundle\');\n    const dragon = document.getElementById(\'dragon\');\n\n    // Transition\n    function startTransition() {\n      gameC.classList.add(\'pixelate\');\n      document.getElementById(\'transition-overlay\').style.opacity = \'1\';\n      gameC.addEventListener(\'animationend\', () => {\n        window.location.href = \'scene2.html\';\n      }, { once: true });\n    }\n\n    // GO -> loading -> gifts\n    goBtn.addEventListener(\'click\', () => {\n      startS.style.display = \'none\';\n      loadS.style.display  = \'block\';\n      setTimeout(() => {\n        loadS.style.display = \'none\';\n        giftS.style.display = \'block\';\n      }, 2000);\n    });\n\n    // Gift selection\n    let selected = new Set();\n    function toggleGift(img) {\n      if (selected.has(img.id)) {\n        selected.delete(img.id);\n        img.classList.remove(\'selected\');\n      } else {\n        selected.add(img.id);\n        img.classList.add(\'selected\');\n      }\n      getBtn.classList.toggle(\'enabled\', selected.size===2);\n    }\n    gift1.addEventListener(\'click\', ()=>toggleGift(gift1));\n    gift2.addEventListener(\'click\', ()=>toggleGift(gift2));\n\n    // Dragon sequence\n    getBtn.addEventListener(\'click\', ()=>{\n      if (!getBtn.classList.contains(\'enabled\')) return;\n      gameC.classList.add(\'shake\');\n       window.audio.playExplosion();\n      setTimeout(()=>{\n        dragonB.style.display=\'block\';\n        dragonB.style.left=\'30%\'; dragonB.style.top=\'20%\';\n        setTimeout(()=>{\n          dragonB.style.left=\'50%\'; dragonB.style.top=\'30%\';\n          dragonB.style.transform=\'translate(-50%,-50%) scale(3)\';\n          setTimeout(()=>{\n            const bubble=document.createElement(\'div\');\n            bubble.className=\'speech\'; \n            bubble.textContent=\'ХА-ХА!\';\n            window.audio.playEvilLaugh();\n            dragon.appendChild(bubble);\n            [gift1,gift2].forEach((g,i)=>{\n              g.style.position=\'absolute\';\n              g.style.top=\'70px\';\n              g.style.left = i? \'120px\':\'-60px\';\n              dragonB.appendChild(g);\n            });\n            setTimeout(()=>{\n              dragonB.style.left=\'120%\'; dragonB.style.top=\'10%\';\n              setTimeout(startTransition,1000);\n            },1500);\n          },1000);\n        },1000);\n      },500);\n    });\n\n    // Touch support\n    [goBtn,gift1,gift2,getBtn].forEach(btn=>{\n      btn.addEventListener(\'touchstart\',e=>{e.preventDefault();btn.click();},{passive:false});\n    });\n  </script>', "/* Reset & base */\n    html, body {\n      margin: 0; padding: 0;\n      width: 100%; height: 100%;\n      overflow: hidden; background: black;\n      font-family: 'Courier New', monospace;\n    }\n    /* Wrapper at base resolution */\n    #wrapper {\n      position: absolute; top: 0; left: 0;\n      width: 1920px; height: 1200px;\n      transform-origin: top left;\n    }\n    /* Game container fills wrapper */\n    #game-container {\n      position: relative;\n      width: 100%; height: 100%;\n      background: url('background.png') center center no-repeat;\n      background-size: contain;\n    }\n    /* Centered helper */\n    .centered {\n      position: absolute;\n      top: 50%; left: 50%;\n      transform: translate(-50%, -50%);\n      text-align: center;\n    }\n    /* Start button */\n    #go-btn {\n      width: 800px; height: 360px;\n      font-size: 120px;\n      cursor: pointer;\n    }\n    /* Loading text */\n    #loading-screen p {\n      font-size: 70px; color: black;\n      margin: 0;\n    }\n    /* Gift cards section */\n    #gift-section { display: none; }\n    #gift-cards {\n      display: flex; gap: 40px;\n      justify-content: center;\n    }\n    .gift-card {\n      width: 288px; height: 432px;\n      image-rendering: pixelated;\n      cursor: pointer;\n      border: 4px solid white;\n      transition: border 0.3s;\n    }\n    .gift-card.selected {\n      border: 8px dashed yellow;\n    }\n    /* Get presents button */\n    #get-presents {\n      margin-top: 40px;\n      width: 800px; height: 360px;\n      background: url('button01.png') center center no-repeat;\n      background-size: contain;\n      border: none; cursor: pointer;\n      opacity: 0.5; pointer-events: none;\n    }\n    #get-presents.enabled {\n      opacity: 1; pointer-events: auto;\n    }\n    /* Shake effect */\n    .shake { animation: shake 0.5s; }\n    @keyframes shake {\n      0%   { transform: translate(2px,2px); }\n      25%  { transform: translate(-2px,-2px); }\n      50%  { transform: translate(2px,-2px); }\n      75%  { transform: translate(-2px,2px); }\n      100% { transform: translate(0,0); }\n    }\n    /* Dragon bundle and dragon */\n    .dragon-bundle {\n      position: absolute; display: none;\n      width: 128px; height: 64px;\n      transition: all 2s ease-in-out;\n    }\n    .dragon {\n      width: 128px; height: 64px;\n      background: url('dragon.png') center center no-repeat;\n      background-size: contain;\n      image-rendering: pixelated;\n      position: absolute; top: 0; left: 0;\n    }\n    /* Speech bubble */\n    .speech {\n      position: absolute;\n      bottom: calc(100% + 10px);\n      left: 50%; transform: translateX(-50%);\n      background: white; color: black;\n      padding: 8px 12px;\n      border: 4px solid red;\n      border-radius: 4px;\n      font-size: 24px;\n      font-family: 'Arial Black', sans-serif;\n      text-transform: uppercase;\n      text-align: center;\n      white-space: nowrap;\n    }\n    /* Transition overlay */\n    #transition-overlay {\n      position: absolute; top:0; left:0;\n      width:100%; height:100%;\n      background: black; opacity: 0;\n      pointer-events: none;\n      transition: opacity 1s ease-in-out;\n    }\n    #game-container.pixelate {\n      animation: pixelateOut 1s ease-in-out forwards;\n    }\n    @keyframes pixelateOut {\n      0%   { filter: blur(0); transform: scale(1); }\n      40%  { filter: blur(4px); transform: scale(0.1); image-rendering: pixelated; }\n      70%  { opacity: 0.4; }\n      100% { filter: blur(0); transform: scale(1); opacity: 0; }\n    }");
    (function() // Scale wrapper to fit viewport
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

    // Transition
    function startTransition() {
      gameC.classList.add('pixelate');
      document.getElementById('transition-overlay').style.opacity = '1';
      gameC.addEventListener('animationend', () => {
        window.location.href = 'scene2.html';
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

    // Dragon sequence
    getBtn.addEventListener('click', ()=>{
      if (!getBtn.classList.contains('enabled')) return;
      gameC.classList.add('shake');
       window.audio.playExplosion();
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
            window.audio.playEvilLaugh();
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
    ).call(window);
  },
  destroy: function() {}
};

scenes['scene2'] = {
  init: function(params) {
    setSceneContent('<div id="wrapper">\n    <div id="game-container">\n      <div id="player"></div>\n      <!-- Touch controls overlay -->\n      <div id="touch-controls">\n        <button id="btn-left" class="touch-btn">◀</button>\n        <button id="btn-jump" class="touch-btn">▲</button>\n        <button id="btn-right" class="touch-btn">▶</button>\n      </div>\n    </div>\n  </div>\n\n  <script>\n    // Responsive scaling\n    function updateScale() {\n      const vw = window.innerWidth, vh = window.innerHeight;\n      const scale = Math.min(vw/1920, vh/1200);\n      const wrap = document.getElementById(\'wrapper\');\n      wrap.style.transform = `scale(${scale})`;\n      wrap.style.left = `${(vw - 1920*scale)/2}px`;\n      wrap.style.top  = `${(vh - 1200*scale)/2}px`;\n    }\n    window.addEventListener(\'resize\', updateScale);\n    updateScale();\n\n    // Scene2 logic\n    const player       = document.getElementById(\'player\');\n    const wrapper      = document.getElementById(\'wrapper\');\n    const leftLimit    = 0;\n    const rightLimit   = 1920 - 320;\n    let posX           = 800;\n    let posY           = 0;\n    let isJumping      = false;\n    let jumpSpeed      = 0;\n    const gravity      = 0.8;\n    let keys           = {};\n    let canMove        = false;\n    let transitioning  = false;\n\n    // Initial speech bubble\n    const bubble = document.createElement(\'div\');\n    bubble.className = \'speech\';\n    bubble.textContent = \'НУ И ГДЕ МОИ ПОДАРКИ?! КУДА ТЕПЕРЬ ИДТИ - НАЛЕВО ИЛИ НАПРАВО?\';\n    player.appendChild(bubble);\n\n    // Input handlers\n    window.addEventListener(\'keydown\', e => {\n      keys[e.key.toLowerCase()] = true;\n      if (!canMove && !transitioning) {\n        canMove = true;\n        bubble.remove();\n      }\n    });\n    window.addEventListener(\'keyup\', e => {\n      keys[e.key.toLowerCase()] = false;\n    });\n    window.addEventListener(\'mousedown\', () => {\n      if (!canMove && !transitioning) {\n        canMove = true;\n        bubble.remove();\n      }\n    });\n    [[\'left\',\'arrowleft\'], [\'jump\',\' \'], [\'right\',\'arrowright\']].forEach(([id, key]) => {\n      const btn = document.getElementById(\'btn-\' + id);\n      btn.addEventListener(\'touchstart\', e => {\n        e.preventDefault(); keys[key] = true;\n        if (!canMove && !transitioning) {\n          canMove = true;\n          bubble.remove();\n        }\n      }, {passive:false});\n      btn.addEventListener(\'touchend\', e => {\n        e.preventDefault(); keys[key] = false;\n      }, {passive:false});\n    });\n\n    // Update player position\n    function updatePos() {\n      player.style.left   = posX + \'px\';\n      player.style.bottom = (100 + posY) + \'px\';\n    }\n\n    /**\n     * startTransition(side)\n     * side = \'left\' or \'right\'\n     * Pixelated zoom-out, then navigate passing exit side\n     */\n    function startTransition(side) {\n      if (transitioning) return;\n      transitioning = true;\n      canMove = false;\n      wrapper.classList.add(\'transition\');\n      setTimeout(() => {\n        window.location.href = `wizard01.html?exit=${side}`;\n      }, 600); // matches --transition-duration\n    }\n\n    // Main game loop\n    function gameLoop() {\n      if (canMove && !transitioning) {\n        // Move left\n        if (keys[\'arrowleft\'] || keys[\'a\']) {\n          posX = Math.max(leftLimit, posX - 4);\n          player.classList.add(\'flipped\');\n          if (posX === leftLimit) startTransition(\'left\');\n        }\n        // Move right\n        if (keys[\'arrowright\'] || keys[\'d\']) {\n          posX = Math.min(rightLimit, posX + 4);\n          player.classList.remove(\'flipped\');\n          if (posX === rightLimit) startTransition(\'right\');\n        }\n        // Jump\n        if ((keys[\' \'] || keys[\'spacebar\']) && !isJumping) {\n          isJumping = true;\n          jumpSpeed = 15;\n          // play jump SFX\n          window.audio.playJump();\n        }\n      }\n\n      // Gravity\n      if (isJumping) {\n        posY += jumpSpeed;\n        jumpSpeed -= gravity;\n        if (posY <= 0) {\n          posY = 0;\n          isJumping = false;\n        }\n      }\n\n      updatePos();\n      requestAnimationFrame(gameLoop);\n    }\n\n    updatePos();\n    gameLoop();\n  </script>', "/* Reset & base */\n    html, body {\n      margin: 0; padding: 0;\n      width: 100%; height: 100%;\n      overflow: hidden; background: black;\n      font-family: 'Courier New', monospace;\n    }\n    /* Transition timing var */\n    :root {\n      --transition-duration: 600ms;\n    }\n    /* Pixelated zoom-out animation */\n    @keyframes pixelate-out {\n      to {\n        transform: scale(0.1);\n        opacity: 0;\n      }\n    }\n    /* Wrapper at base resolution */\n    #wrapper {\n      position: absolute; top: 0; left: 0;\n      width: 1920px; height: 1200px;\n      transform-origin: top left;\n      image-rendering: pixelated;\n    }\n    /* When transitioning, apply the pixellated zoom out */\n    #wrapper.transition {\n      animation: pixelate-out var(--transition-duration) steps(8) forwards;\n      transform-origin: center center;\n    }\n    /* Game area */\n    #game-container {\n      position: relative;\n      width: 100%; height: 100%;\n      background: url('background.png') center center no-repeat;\n      background-size: contain;\n    }\n    /* Player sprite */\n    #player {\n      position: absolute;\n      width: 640px; height: 320px;\n      left: 800px; bottom: 100px;\n      background: url('player_idle.png') center center no-repeat;\n      background-size: contain;\n      image-rendering: pixelated;\n      transform-origin: center bottom;\n    }\n    #player.flipped { transform: scaleX(-1); }\n    /* Speech bubble */\n    .speech {\n      position: absolute;\n      bottom: calc(100% + 10px);\n      left: 50%; transform: translateX(-50%);\n      background: white; color: black;\n      padding: 8px 12px;\n      border: 4px solid red;\n      border-radius: 4px;\n      font-size: 24px;\n      font-family: 'Arial Black', sans-serif;\n      text-transform: uppercase;\n      text-align: center;\n      white-space: normal;\n    }\n    /* Touch controls */\n    #touch-controls {\n      position: absolute;\n      bottom: 5vh;\n      left: 50%; transform: translateX(-50%);\n      display: flex; gap: 2vw;\n      pointer-events: none;\n    }\n    .touch-btn {\n      width: 12vw; height: 12vw;\n      max-width: 80px; max-height: 80px;\n      background: rgba(255,255,255,0.8);\n      border: 2px solid #333; border-radius: 50%;\n      font-size: 4vw; line-height: 1; text-align: center;\n      pointer-events: auto; user-select: none;\n    }");
    (function() // Responsive scaling
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

    // Scene2 logic
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
    window.addEventListener('keydown', e => {
      keys[e.key.toLowerCase()] = true;
      if (!canMove && !transitioning) {
        canMove = true;
        bubble.remove();
      }
    });
    window.addEventListener('keyup', e => {
      keys[e.key.toLowerCase()] = false;
    });
    window.addEventListener('mousedown', () => {
      if (!canMove && !transitioning) {
        canMove = true;
        bubble.remove();
      }
    });
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

    /**
     * startTransition(side)
     * side = 'left' or 'right'
     * Pixelated zoom-out, then navigate passing exit side
     */
    function startTransition(side) {
      if (transitioning) return;
      transitioning = true;
      canMove = false;
      wrapper.classList.add('transition');
      setTimeout(() => {
        window.location.href = `wizard01.html?exit=${side}`;
      }, 600); // matches --transition-duration
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
          // play jump SFX
          window.audio.playJump();
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
    ).call(window);
  },
  destroy: function() {}
};

scenes['wizard01'] = {
  init: function(params) {
    setSceneContent('<div id="wrapper">\n    <div id="game-container">\n      <div id="player"></div>\n      <div id="wizard">\n        <img id="wizard-img" src="wizard1.png" alt="Wizard" />\n        <div id="prompt">Press E</div>\n      </div>\n      <div id="ground"></div>\n      <div id="dialog-overlay">\n        <div id="dialog-box">\n          <p id="dialog-text"></p>\n          <div id="choices"></div>\n        </div>\n      </div>\n      <div id="minigame-ui"></div>\n      <div id="minigame-score"></div>\n    </div>\n  </div>\n\n  <script>\n    // Responsive scaling\n    function updateScale() {\n      const vw = window.innerWidth, vh = window.innerHeight;\n      const scale = Math.min(vw/1920, vh/1200);\n      const wrap = document.getElementById(\'wrapper\');\n      wrap.style.transform = `scale(${scale})`;\n      wrap.style.left = `${(vw - 1920*scale)/2}px`;\n      wrap.style.top  = `${(vh - 1200*scale)/2}px`;\n    }\n    window.addEventListener(\'resize\', updateScale);\n    updateScale();\n\n    // DOM refs\n    const player     = document.getElementById(\'player\');\n    const gameArea   = document.getElementById(\'game-container\');\n    const prompt     = document.getElementById(\'prompt\');\n    const overlay    = document.getElementById(\'dialog-overlay\');\n    const dialogText = document.getElementById(\'dialog-text\');\n    const choicesDiv = document.getElementById(\'choices\');\n    const minigameUI = document.getElementById(\'minigame-ui\');\n    const minigameScore = document.getElementById(\'minigame-score\');\n\n    // Movement bounds\n    const playerWidth = 320;\n    const leftLimit   = 0;\n    const rightLimit  = gameArea.clientWidth - playerWidth;\n\n    // Spawn logic (for returning from wizard2)\n    const params   = new URLSearchParams(location.search);\n    const exitSide = params.get(\'exit\');\n    let spawnSide  = (exitSide === \'left\') ? \'right\' : \'left\';\n    let posX       = (spawnSide === \'left\') ? leftLimit : rightLimit;\n    let posY       = 0;\n\n    // State & physics\n    let keys = {}, isJumping = false, jumpSpeed = 0, gravity = 0.8;\n    let inDialog = false, interactionFinished = false, waitingBlock = false;\n    let puzzleSolved = false;\n    let blockColor = \'red\';\n    let minigameActive = false;\n\n    // Dialog data\n    const greeting   = \'Привет, Саша! Представляешь, в голове вертится песня! Но не могу ноты ПОДОБРАТЬ, поможешь?\';\n    const correctTip = \'Ну точно! Спасибо! Кстати, я должен дать тебе подсказку - это <span style="color:red;font-weight:bold;">BLUTEGE</span>.\';\n\n    // --------------- MINIGAME LOGIC ---------------\n    function startMiniGame() {\n      minigameActive = true;\n      prompt.style.display = \'none\';\n\n      minigameUI.style.display = \'block\';\n      minigameUI.innerHTML = \'ПОДБЕРИ 7 нот 🎵\';\n      minigameScore.style.display = \'block\';\n      minigameScore.textContent = `0 / 7`;\n\n      // Switch BGM to minigame.mp3\n      window.audio && window.audio.switchBgm && window.audio.switchBgm(\'minigame\');\n\n      player.style.background = "url(\'player_collects.png\') center center no-repeat";\n      player.style.backgroundSize = \'contain\';\n\n      let notesCollected = 0, notesFalling = 0, totalNotes = 7, gameActive = true;\n      const activeNotes = [];\n\n      function spawnNote() {\n        if (!gameActive) return;\n        notesFalling++;\n        const note = document.createElement(\'div\');\n        note.className = \'note\';\n        note.innerText = \'🎵\';\n        // random x within play area\n        let nx = Math.floor(Math.random() * (gameArea.clientWidth - 60));\n        note.style.left = nx + \'px\';\n        note.style.top = \'0px\';\n        gameArea.appendChild(note);\n        activeNotes.push(note);\n\n        // animation state\n        let noteY = 0, speed = 4 + Math.random() * 3, caught = false;\n        function fall() {\n          if (!gameActive) { note.remove(); return; }\n          noteY += speed;\n          note.style.top = noteY + \'px\';\n          // Collision test with player\n          const playerRect = player.getBoundingClientRect();\n          const noteRect   = note.getBoundingClientRect();\n          const pa = playerRect.left, pb = playerRect.right, na = noteRect.left, nb = noteRect.right;\n          const overlapX = (na < pb && nb > pa);\n          const noteBottom = noteRect.bottom, playerTop = playerRect.top + 60;\n          const overlapY = (noteBottom > playerTop && noteRect.top < playerRect.bottom);\n\n          if (!caught && overlapX && overlapY) {\n            caught = true;\n            window.audio && window.audio.playCollect && window.audio.playCollect();\n            note.style.filter = \'brightness(2) drop-shadow(0 0 10px #ff0)\';\n            setTimeout(() => note.remove(), 100);\n            notesCollected++;\n            minigameScore.textContent = `${notesCollected} / ${totalNotes}`;\n            minigameUI.innerHTML = `Поймано: ${notesCollected} / ${totalNotes} нот 🎵`;\n            if (notesCollected >= totalNotes) {\n              gameActive = false;\n              setTimeout(minigameComplete, 350);\n              minigameUI.innerHTML = `Готово!`;\n              minigameScore.textContent = `${notesCollected} / ${totalNotes}`;\n            }\n            return;\n          }\n          // Out of bounds: missed\n          if (noteY > gameArea.clientHeight - 30 && !caught) {\n            note.remove();\n            if (gameActive) setTimeout(spawnNote, 350);\n            return;\n          }\n          if (!caught && gameActive) requestAnimationFrame(fall);\n        }\n        requestAnimationFrame(fall);\n      }\n\n      // Spawn first wave\n      let notesStarted = 0;\n      function spawnNotesInterval() {\n        if (!gameActive) return;\n        spawnNote();\n        notesStarted++;\n        if (notesStarted < totalNotes) setTimeout(spawnNotesInterval, 700 + Math.random()*800);\n      }\n      spawnNotesInterval();\n\n      // Player controls (left/right, no jump in minigame)\n      function minigameLoop() {\n        if (!gameActive) return;\n        if (keys[\'arrowleft\']||keys[\'a\']) { posX = Math.max(leftLimit, posX-6); player.classList.add(\'flipped\'); }\n        if (keys[\'arrowright\']||keys[\'d\']){ posX = Math.min(rightLimit,posX+6); player.classList.remove(\'flipped\'); }\n        updatePos();\n        requestAnimationFrame(minigameLoop);\n      }\n      minigameLoop();\n\n      // End minigame and proceed\n      function minigameComplete() {\n        minigameActive = false;\n        activeNotes.forEach(n=>n.remove());\n        minigameUI.style.display = \'none\';\n        minigameScore.style.display = \'none\';\n        player.style.background = "url(\'player_idle.png\') center center no-repeat";\n        player.style.backgroundSize = \'contain\';\n        // Restore BGM!\n        window.audio && window.audio.restoreBgm && window.audio.restoreBgm();\n        showBLUTEGETip();\n      }\n    }\n    // --- END MINIGAME LOGIC ---\n\n    // Show BLUTEGE tip\n    function showBLUTEGETip() {\n      inDialog = true;\n      overlay.style.display = \'block\';\n      dialogText.innerHTML = correctTip;\n      choicesDiv.innerHTML = \'\';\n      const onInput = () => {\n        cleanup(); overlay.style.display = \'none\'; inDialog = false; interactionFinished = true; setupCollectible();\n      };\n      const cleanup = () => {\n        window.removeEventListener(\'keydown\', onInput);\n        window.removeEventListener(\'mousedown\', onInput);\n      };\n      window.addEventListener(\'keydown\', onInput);\n      window.addEventListener(\'mousedown\', onInput);\n    }\n\n    // Initial dialog (greeting, then minigame)\n    function startDialog() {\n      inDialog = true;\n      overlay.style.display = \'block\';\n      dialogText.textContent = greeting;\n      choicesDiv.innerHTML = \'\';\n      setTimeout(() => {\n        const proceed = () => { cleanupListeners(); overlay.style.display=\'none\'; inDialog=false; startMiniGame(); };\n        const cleanupListeners = () => {\n          window.removeEventListener(\'keydown\', proceed);\n          window.removeEventListener(\'mousedown\', proceed);\n        };\n        window.addEventListener(\'keydown\', proceed);\n        window.addEventListener(\'mousedown\', proceed);\n      }, 0);\n    }\n\n    // Set up collectible block\n    function setupCollectible() {\n      waitingBlock = true;\n      player.style.background = "url(\'player_hands.png\') center center no-repeat";\n      player.style.backgroundSize = \'contain\';\n      const block = document.createElement(\'div\');\n      block.className = \'collect-block\';\n      block.style.background = blockColor;\n      block.style.left = (posX + (playerWidth - 60)/2) + \'px\';\n      block.style.bottom = (80 + posY + playerWidth + 10) + \'px\';\n      gameArea.appendChild(block);\n      block.addEventListener(\'click\', () => {\n        block.style.transition = \'all 0.5s ease-out\';\n        block.style.left = \'0px\'; block.style.bottom = (gameArea.clientHeight - 40) + \'px\';\n        block.addEventListener(\'transitionend\', () => {\n          block.remove(); waitingBlock = false; interactionFinished = true; puzzleSolved = true; player.style.background = "url(\'player_idle.png\') center center no-repeat"; player.style.backgroundSize = \'contain\';\n        }, { once: true });\n      });\n    }\n\n    // Update position, proximity, loop\n    function updatePos() { player.style.left = posX + \'px\'; player.style.bottom = (80 + posY) + \'px\'; }\n    function checkProximity() {\n      const wizardX = (gameArea.clientWidth - playerWidth)/2;\n      // Hide prompt if minigame active\n      if (minigameActive) {\n        prompt.style.display = \'none\';\n      } else {\n        prompt.style.display = (!inDialog && !waitingBlock && Math.abs(posX - wizardX) < playerWidth*0.6) ? \'block\' : \'none\';\n      }\n    }\n    function gameLoop() {\n      if (!inDialog && !waitingBlock) {\n        if (keys[\'arrowleft\']||keys[\'a\']) { posX = Math.max(leftLimit, posX-4); player.classList.add(\'flipped\'); }\n        if (keys[\'arrowright\']||keys[\'d\']){ posX = Math.min(rightLimit,posX+4); player.classList.remove(\'flipped\'); }\n        if ((keys[\' \']||keys[\'arrowup\']||keys[\'w\']) && !isJumping) { isJumping=true; jumpSpeed=15; window.audio.playJump(); }\n      }\n      if (isJumping) { posY+=jumpSpeed; jumpSpeed-=gravity; if(posY<=0){posY=0;isJumping=false;} }\n      updatePos(); checkProximity(); requestAnimationFrame(gameLoop);\n    }\n    updatePos(); gameLoop();\n\n    // Input\n    document.addEventListener(\'keydown\', e => {\n      const key = e.key.toLowerCase(); keys[key]=true;\n      // Interact\n      if (key===\'e\' && prompt.style.display===\'block\') {\n        if (minigameActive) return; // Prevent interaction during minigame!\n        window.audio.playInteract();\n        if (!interactionFinished) startDialog();\n        else if (!waitingBlock) {\n          overlay.style.display=\'block\'; dialogText.textContent=\'ЙЕЕЕ РОЦК! Можешь идти дальше!\'; choicesDiv.innerHTML=\'\';\n          setTimeout(()=>overlay.style.display=\'none\',2000);\n        }\n      }\n      // Leave\n      if (puzzleSolved) {\n        if ((key===\'arrowleft\'||key===\'a\')&&posX<=leftLimit) location.href=\'wizard02.html?exit=left\';\n        if ((key===\'arrowright\'||key===\'d\')&&posX>=rightLimit) location.href=\'wizard02.html?exit=right\';\n      }\n    });\n    document.addEventListener(\'keyup\', e => { keys[e.key.toLowerCase()]=false; });\n\n  </script>', "html, body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: black; font-family: 'Courier New', monospace; }\n    #wrapper { position: absolute; top: 0; left: 0; width: 1920px; height: 1200px; transform-origin: top left; }\n    #game-container { position: relative; width: 100%; height: 100%; background: url('background.png') center center / cover no-repeat; }\n    #player {\n      position: absolute; width: 320px; height: 320px; bottom: 80px; transform-origin: center bottom;\n      background: url('player_idle.png') center center no-repeat;\n      background-size: contain; image-rendering: pixelated;\n      transition: background-image 0.2s;\n    }\n    #player.flipped { transform: scaleX(-1); }\n    #wizard { position: absolute; width: 300px; height: 300px; bottom: 80px; left: 50%; transform: translateX(-50%); pointer-events: none; }\n    #wizard-img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }\n    #prompt {\n      position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);\n      background: white; color: black; padding: 8px 12px; border: 4px solid red; border-radius: 4px;\n      font-size: 28px; font-family: 'Arial Black'; text-transform: uppercase;\n      pointer-events: none; display: none; white-space: nowrap;\n    }\n    #dialog-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); display:none; }\n    #dialog-box {\n      position: absolute; top:50%; left:50%; transform: translate(-50%,-50%);\n      background: white; padding: 24px; border: 4px solid black; width: 600px; max-width: 80vw;\n      font-family: 'Courier New', monospace;\n    }\n    #dialog-text { margin-bottom: 16px; font-size: 28px; color: black; }\n    .collect-block { position: absolute; width: 60px; height: 40px; cursor: pointer; image-rendering: pixelated; }\n    .note {\n      position: absolute; font-size: 60px; transition: filter 0.2s;\n      user-select: none; pointer-events: none;\n      text-shadow: 1px 2px 4px #000, 0 0 20px #fff;\n      filter: drop-shadow(0 0 8px #00f5);\n      z-index: 5;\n    }\n    #minigame-ui {\n      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);\n      color: white; font-size: 32px; background: rgba(0,0,0,0.6); border-radius: 12px; padding: 12px 28px; z-index: 6; display: none;\n      letter-spacing: 2px;\n      font-family: 'Arial Black', monospace;\n    }\n    #minigame-score {\n      position: absolute; top: 28px; right: 64px;\n      color: #fff; background: rgba(0,0,0,0.65);\n      font-size: 42px; padding: 14px 38px; border-radius: 14px;\n      font-family: 'Arial Black', monospace; letter-spacing: 2px; z-index:7; display: none;\n      box-shadow: 0 2px 8px #000a;\n    }");
    (function() // Responsive scaling
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
    const rightLimit  = gameArea.clientWidth - playerWidth;

    // Spawn logic (for returning from wizard2)
    const params   = new URLSearchParams(location.search);
    const exitSide = params.get('exit');
    let spawnSide  = (exitSide === 'left') ? 'right' : 'left';
    let posX       = (spawnSide === 'left') ? leftLimit : rightLimit;
    let posY       = 0;

    // State & physics
    let keys = {}, isJumping = false, jumpSpeed = 0, gravity = 0.8;
    let inDialog = false, interactionFinished = false, waitingBlock = false;
    let puzzleSolved = false;
    let blockColor = 'red';
    let minigameActive = false;

    // Dialog data
    const greeting   = 'Привет, Саша! Представляешь, в голове вертится песня! Но не могу ноты ПОДОБРАТЬ, поможешь?';
    const correctTip = 'Ну точно! Спасибо! Кстати, я должен дать тебе подсказку - это <span style="color:red;font-weight:bold;">BLUTEGE</span>.';

    // --------------- MINIGAME LOGIC ---------------
    function startMiniGame() {
      minigameActive = true;
      prompt.style.display = 'none';

      minigameUI.style.display = 'block';
      minigameUI.innerHTML = 'ПОДБЕРИ 7 нот 🎵';
      minigameScore.style.display = 'block';
      minigameScore.textContent = `0 / 7`;

      // Switch BGM to minigame.mp3
      window.audio && window.audio.switchBgm && window.audio.switchBgm('minigame');

      player.style.background = "url('player_collects.png') center center no-repeat";
      player.style.backgroundSize = 'contain';

      let notesCollected = 0, notesFalling = 0, totalNotes = 7, gameActive = true;
      const activeNotes = [];

      function spawnNote() {
        if (!gameActive) return;
        notesFalling++;
        const note = document.createElement('div');
        note.className = 'note';
        note.innerText = '🎵';
        // random x within play area
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
          // Collision test with player
          const playerRect = player.getBoundingClientRect();
          const noteRect   = note.getBoundingClientRect();
          const pa = playerRect.left, pb = playerRect.right, na = noteRect.left, nb = noteRect.right;
          const overlapX = (na < pb && nb > pa);
          const noteBottom = noteRect.bottom, playerTop = playerRect.top + 60;
          const overlapY = (noteBottom > playerTop && noteRect.top < playerRect.bottom);

          if (!caught && overlapX && overlapY) {
            caught = true;
            window.audio && window.audio.playCollect && window.audio.playCollect();
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
          // Out of bounds: missed
          if (noteY > gameArea.clientHeight - 30 && !caught) {
            note.remove();
            if (gameActive) setTimeout(spawnNote, 350);
            return;
          }
          if (!caught && gameActive) requestAnimationFrame(fall);
        }
        requestAnimationFrame(fall);
      }

      // Spawn first wave
      let notesStarted = 0;
      function spawnNotesInterval() {
        if (!gameActive) return;
        spawnNote();
        notesStarted++;
        if (notesStarted < totalNotes) setTimeout(spawnNotesInterval, 700 + Math.random()*800);
      }
      spawnNotesInterval();

      // Player controls (left/right, no jump in minigame)
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
        // Restore BGM!
        window.audio && window.audio.restoreBgm && window.audio.restoreBgm();
        showBLUTEGETip();
      }
    }
    // --- END MINIGAME LOGIC ---

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
      const wizardX = (gameArea.clientWidth - playerWidth)/2;
      // Hide prompt if minigame active
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
        if ((keys[' ']||keys['arrowup']||keys['w']) && !isJumping) { isJumping=true; jumpSpeed=15; window.audio.playJump(); }
      }
      if (isJumping) { posY+=jumpSpeed; jumpSpeed-=gravity; if(posY<=0){posY=0;isJumping=false;} }
      updatePos(); checkProximity(); requestAnimationFrame(gameLoop);
    }
    updatePos(); gameLoop();

    // Input
    document.addEventListener('keydown', e => {
      const key = e.key.toLowerCase(); keys[key]=true;
      // Interact
      if (key==='e' && prompt.style.display==='block') {
        if (minigameActive) return; // Prevent interaction during minigame!
        window.audio.playInteract();
        if (!interactionFinished) startDialog();
        else if (!waitingBlock) {
          overlay.style.display='block'; dialogText.textContent='ЙЕЕЕ РОЦК! Можешь идти дальше!'; choicesDiv.innerHTML='';
          setTimeout(()=>overlay.style.display='none',2000);
        }
      }
      // Leave
      if (puzzleSolved) {
        if ((key==='arrowleft'||key==='a')&&posX<=leftLimit) location.href='wizard02.html?exit=left';
        if ((key==='arrowright'||key==='d')&&posX>=rightLimit) location.href='wizard02.html?exit=right';
      }
    });
    document.addEventListener('keyup', e => { keys[e.key.toLowerCase()]=false; });
    ).call(window);
  },
  destroy: function() {}
};

scenes['wizard02'] = {
  init: function(params) {
    setSceneContent('<div id="wrapper">\n    <div id="game-container">\n      <div id="player"></div>\n      <div id="wizard">\n        <img id="wizard-img" src="wizard2.png" alt="Wizard" />\n        <div id="prompt">Press E</div>\n      </div>\n      <div id="ground"></div>\n\n      <!-- Puzzle Container -->\n      <div id="puzzle-overlay">\n        <div id="puzzle-box">\n          <div id="dialog-name"></div>\n          <div id="dialog-text"></div>\n          <div id="blocks" class="blocks-container"></div>\n          <div class="drop-areas">\n            <div id="rejectContainer" class="drop-area-container">\n              <div id="rejectArea" class="drop-area">ОТКЛОНИТЬ</div>\n            </div>\n            <div id="approveContainer" class="drop-area-container">\n              <div id="approveArea" class="drop-area">УТВЕРДИТЬ</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <script>\n    // Responsive scaling\n    function updateScale() {\n      const vw = window.innerWidth, vh = window.innerHeight;\n      const scale = Math.min(vw / 1920, vh / 1200);\n      const wrap = document.getElementById(\'wrapper\');\n      wrap.style.transform = `scale(${scale})`;\n      wrap.style.left = `${(vw - 1920 * scale) / 2}px`;\n      wrap.style.top  = `${(vh - 1200 * scale) / 2}px`;\n    }\n    window.addEventListener(\'resize\', updateScale);\n    updateScale();\n\n    // DOM refs\n    const player           = document.getElementById(\'player\');\n    const gameArea         = document.getElementById(\'game-container\');\n    const prompt           = document.getElementById(\'prompt\');\n    const overlayPuzzle    = document.getElementById(\'puzzle-overlay\');\n    const dialogName       = document.getElementById(\'dialog-name\');\n    const dialogTextPuzzle = document.getElementById(\'dialog-text\');\n    const blocksDiv        = document.getElementById(\'blocks\');\n    const rejectContainer  = document.getElementById(\'rejectContainer\');\n    const approveContainer = document.getElementById(\'approveContainer\');\n    const rejectArea       = document.getElementById(\'rejectArea\');\n    const approveArea      = document.getElementById(\'approveArea\');\n\n    // Spawn logic for entering from wizard01.html\n    const params    = new URLSearchParams(location.search);\n    const exitSide  = params.get(\'exit\');\n    const spawnSide = (exitSide === \'left\') ? \'right\' : \'left\';\n    const leftLimit  = 0;\n    const rightLimit = gameArea.clientWidth - player.clientWidth;\n    const spawnX     = (spawnSide === \'left\') ? leftLimit : rightLimit;\n    player.style.left   = spawnX + \'px\';\n    player.style.bottom = \'80px\';\n\n    // Puzzle data\n    const rejectItems = [\n      \'Дресс-код для всех работников в любое время года - только черный костюм\',\n      \'Объявление выговора работникам, не употреблявшим коньяк Арарат на последнем корпоративе\',\n      \'Ձայնագրություն Երևանի աշխատակիցներին շտապաբար վերադարձնելու մասին Պետերբուրգ։\',\n      \'Приказ об окончании COVID в связи со срочным переездом\',\n      \'Приказ об ОБЯЗАТЕЛЬНОМ использовании eMM в работе всех департаментов\'\n    ];\n    const approveItems = [\n      \'Приказ о принятии политики использования софта в компании\',\n      \'Приказ об установлении режима конфиденциальности в компании\',\n      \'Приказ о предоставлении сотрудникам дополнительного выходного дня в течение года\',\n      \'Приказ о порядке проведения  корпоративных мероприятий\',\n      \'Приказ о порядке утилизации мусора на территории компании\'\n    ];\n    const items = [...rejectItems, ...approveItems].sort(() => Math.random() - 0.5);\n    const rejectSet = new Set(rejectItems);\n    const totalCount = items.length;\n    let placedCount = 0;\n    let interactionFinished = false;\n    let waitingBlock = false;\n    let puzzleSolved = false;\n\n    // 1) Greeting → Puzzle\n    function startDialog() {\n      interactionFinished = true;\n      overlayPuzzle.style.display = \'block\';\n      dialogName.textContent = \'\';\n      dialogTextPuzzle.textContent = \'Ох, как хорошо что ты здесь, Саша! Все приказы в моей папке перепутались, помоги разобраться!\';\n      const proceed = e => {\n        if (e.type === \'keydown\' && e.key.toLowerCase() === \'e\') return;\n        window.removeEventListener(\'keydown\', proceed);\n        window.removeEventListener(\'mousedown\', proceed);\n        showPuzzle();\n      };\n      window.addEventListener(\'keydown\', proceed);\n      window.addEventListener(\'mousedown\', proceed);\n    }\n\n    function showPuzzle() {\n      dialogName.textContent = \'НА ПОДПИСЬ\';\n      dialogTextPuzzle.textContent = \'\';\n      blocksDiv.innerHTML = \'\';\n      items.forEach((text,i) => {\n        const d = document.createElement(\'div\');\n        d.className = \'block\';\n        d.textContent = text;\n        d.draggable = true;\n        d.id = \'block\' + i;\n        d.addEventListener(\'dragstart\', e => e.dataTransfer.setData(\'text/plain\', d.id));\n        blocksDiv.appendChild(d);\n      });\n      blocksDiv.style.display        = \'grid\';\n      rejectContainer.style.display  = \'block\';\n      approveContainer.style.display = \'block\';\n    }\n\n    // 2) Drag & Drop with screenshake on wrong\n    [rejectArea, approveArea].forEach(area => {\n      area.addEventListener(\'dragover\', e => e.preventDefault());\n      area.addEventListener(\'drop\', e => {\n        e.preventDefault();\n        const id    = e.dataTransfer.getData(\'text/plain\');\n        const block = document.getElementById(id);\n        const correct = (area === rejectArea) ? rejectSet.has(block.textContent) : !rejectSet.has(block.textContent);\n        if (correct) {\n          block.remove(); placedCount++;\n          if (placedCount === totalCount) finishPuzzle();\n        } else {\n          dialogTextPuzzle.textContent = \'Что на это скажет Марк?\';\n          gameArea.classList.add(\'shake\');\n          gameArea.addEventListener(\'animationend\', () => gameArea.classList.remove(\'shake\'), { once: true });\n          setTimeout(() => dialogTextPuzzle.textContent = \'\', 3000);\n        }\n      });\n    });\n\n    // 3) Puzzle Complete\n    function finishPuzzle() {\n      dialogName.textContent = \'\';\n      blocksDiv.style.display        = \'none\';\n      rejectContainer.style.display  = \'none\';\n      approveContainer.style.display = \'none\';\n      dialogTextPuzzle.innerHTML = \'Фух! Большое спасибо! Вот еще одна подсказка - \' +\n  \'<span style="color: gold; font-weight: bold;">GOLDEN</span>.\';\n      const proceed = e => {\n        if (e.type === \'keydown\' && e.key.toLowerCase() === \'e\') return;\n        window.removeEventListener(\'keydown\', proceed);\n        window.removeEventListener(\'mousedown\', proceed);\n        overlayPuzzle.style.display = \'none\';\n        setupCollectible(); puzzleSolved = true;\n      };\n      window.addEventListener(\'keydown\', proceed);\n      window.addEventListener(\'mousedown\', proceed);\n    }\n\n    // Collectible spawn\n    function setupCollectible() {\n      waitingBlock = true;\n      player.style.background = "url(\'player_hands.png\') center center no-repeat";\n      player.style.backgroundSize = \'contain\';\n      const block = document.createElement(\'div\'); block.className = \'collect-block\';\n      block.style.background = \'gold\';\n      const xPos = (player.offsetLeft + (320 - 60)/2) + \'px\';\n      block.style.left = xPos; block.style.bottom = (80 + 320 + 10) + \'px\'; gameArea.appendChild(block);\n      block.addEventListener(\'click\', () => {\n        block.style.transition = \'all 0.5s ease-out\';\n        block.style.left = \'0px\'; block.style.bottom = (gameArea.clientHeight - 40) + \'px\';\n        block.addEventListener(\'transitionend\', () => {\n          block.remove(); waitingBlock = false;\n          player.style.background = "url(\'player_idle.png\') center center no-repeat";\n          player.style.backgroundSize = \'contain\';\n        }, { once: true });\n      });\n    }\n\n    // Movement & game loop\n    let keys={}, isJumping=false, jumpSpeed=0, gravity=0.8;\n    function checkProximity() {\n      const wizardX = (gameArea.clientWidth-320)/2;\n      prompt.style.display = (!waitingBlock && Math.abs(player.offsetLeft-wizardX)<192)?\'block\':\'none\';\n    }\n    function gameLoop(){\n      if(!waitingBlock){\n        if(keys[\'arrowleft\']||keys[\'a\']){player.style.left=Math.max(0,player.offsetLeft-4)+\'px\';player.classList.add(\'flipped\');}\n        if(keys[\'arrowright\']||keys[\'d\']){player.style.left=Math.min(gameArea.clientWidth-320,player.offsetLeft+4)+\'px\';player.classList.remove(\'flipped\');}\n        if((keys[\' \']||keys[\'arrowup\']||keys[\'w\'])&&!isJumping){isJumping=true;jumpSpeed=15;window.audio.playJump();}\n      }\n      if(isJumping){const bottom=parseFloat(player.style.bottom)||0;player.style.bottom=bottom+jumpSpeed+\'px\';jumpSpeed-=gravity;if(bottom+jumpSpeed<=80){player.style.bottom=\'80px\';isJumping=false;}}\n      checkProximity();requestAnimationFrame(gameLoop);\n    }\n    gameLoop();\n\n    // Input & scene transition\n    document.addEventListener(\'keydown\',e=>{keys[e.key.toLowerCase()]=true;\n      if(e.key.toLowerCase()===\'e\'){ window.audio.playInteract(); if(!interactionFinished)startDialog();else if(!waitingBlock){overlayPuzzle.style.display=\'block\';dialogTextPuzzle.textContent=\'Иди же дальше!\';setTimeout(()=>overlayPuzzle.style.display=\'none\',2000);}}\n      if(puzzleSolved){const posX=player.offsetLeft;if((e.key.toLowerCase()===\'arrowleft\'||e.key.toLowerCase()===\'a\')&&posX<=leftLimit)location.href=\'wizard03.html?exit=left\';if((e.key.toLowerCase()===\'arrowright\'||e.key.toLowerCase()===\'d\')&&posX>=rightLimit)location.href=\'wizard03.html?exit=right\';}}\n    );\n    document.addEventListener(\'keyup\',e=>{keys[e.key.toLowerCase()]=false;});\n  </script>', "/* Base reset */\n    html, body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: black; font-family: 'Courier New', monospace; }\n    /* Wrapper scaling */\n    #wrapper { position: absolute; top: 0; left: 0; width: 1920px; height: 1200px; transform-origin: top left; }\n    /* Background */\n    #game-container { position: relative; width: 100%; height: 100%; background: url('background.png') center center / cover no-repeat; }\n    /* Player sprite */\n    #player {\n      position: absolute; width: 320px; height: 320px; bottom: 80px; transform-origin: center bottom;\n      background: url('player_idle.png') center center no-repeat;\n      background-size: contain; image-rendering: pixelated;\n    }\n    #player.flipped { transform: scaleX(-1); }\n    /* Wizard */\n    #wizard { position: absolute; width: 280px; height: 280px; bottom: 80px; left: 50%; transform: translateX(-50%); pointer-events: none; }\n    #wizard-img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }\n    /* Prompt */\n    #prompt {\n      position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);\n      background: white; color: black; padding: 8px 12px; border: 4px solid red; border-radius: 4px;\n      font-size: 28px; font-family: 'Arial Black'; text-transform: uppercase;\n      pointer-events: none; display: none; white-space: nowrap;\n    }\n    /* Collectible block */\n    .collect-block { position: absolute; width: 60px; height: 40px; cursor: pointer; image-rendering: pixelated; }\n\n    /* Puzzle-specific styles */\n    #puzzle-overlay {\n      position: absolute; top: 0; left: 0; width: 100%; height: 100%;\n      background: rgba(0,0,0,0.7);\n      display: none; z-index: 100;\n    }\n    #puzzle-box {\n      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);\n      background: white; padding: 32px; border: 4px solid black;\n      width: 800px; max-width: 90vw; font-family: 'Courier New', monospace;\n    }\n    #puzzle-box #dialog-name {\n      text-align: center; font-size: 28px; font-weight: bold;\n      margin-bottom: 16px;\n    }\n    #puzzle-box #dialog-text {\n      text-align: center; font-size: 24px; margin-bottom: 24px;\n    }\n    .blocks-container {\n      display: grid; grid-template-columns: repeat(2,1fr);\n      gap: 8px; max-height: 400px; overflow-y: auto; margin-bottom: 24px;\n    }\n    .block {\n      padding: 12px; background: #eee; border: 2px solid #333;\n      cursor: grab; user-select: none; font-size: 20px;\n    }\n    .drop-areas { display: flex; justify-content: space-between; }\n    .drop-area-container { width: 45%; display: none; }\n    .drop-area {\n      width: 100%; min-height: 80px; border: 3px dashed #333;\n      display: flex; align-items: center; justify-content: center;\n      font-size: 22px; font-weight: bold;\n    }\n\n    /* Screenshake animation */\n    @keyframes screenshake {\n      0%   { transform: translate(0, 0); }\n      20%  { transform: translate(-8px, 0); }\n      40%  { transform: translate(8px, 0); }\n      60%  { transform: translate(-8px, 0); }\n      80%  { transform: translate(8px, 0); }\n      100% { transform: translate(0, 0); }\n    }\n    #game-container.shake { animation: screenshake 0.4s ease-in-out; }");
    (function() // Responsive scaling
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

    // Spawn logic for entering from wizard01.html
    const params    = new URLSearchParams(location.search);
    const exitSide  = params.get('exit');
    const spawnSide = (exitSide === 'left') ? 'right' : 'left';
    const leftLimit  = 0;
    const rightLimit = gameArea.clientWidth - player.clientWidth;
    const spawnX     = (spawnSide === 'left') ? leftLimit : rightLimit;
    player.style.left   = spawnX + 'px';
    player.style.bottom = '80px';

    // Puzzle data
    const rejectItems = [
      'Дресс-код для всех работников в любое время года - только черный костюм',
      'Объявление выговора работникам, не употреблявшим коньяк Арарат на последнем корпоративе',
      'Ձայնագրություն Երևանի աշխատակիցներին շտապաբար վերադարձնելու մասին Պետերբուրգ։',
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
      items.forEach((text,i) => {
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
      dialogTextPuzzle.innerHTML = 'Фух! Большое спасибо! Вот еще одна подсказка - ' +
  '<span style="color: gold; font-weight: bold;">GOLDEN</span>.';
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
      const xPos = (player.offsetLeft + (320 - 60)/2) + 'px';
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
    let keys={}, isJumping=false, jumpSpeed=0, gravity=0.8;
    function checkProximity() {
      const wizardX = (gameArea.clientWidth-320)/2;
      prompt.style.display = (!waitingBlock && Math.abs(player.offsetLeft-wizardX)<192)?'block':'none';
    }
    function gameLoop(){
      if(!waitingBlock){
        if(keys['arrowleft']||keys['a']){player.style.left=Math.max(0,player.offsetLeft-4)+'px';player.classList.add('flipped');}
        if(keys['arrowright']||keys['d']){player.style.left=Math.min(gameArea.clientWidth-320,player.offsetLeft+4)+'px';player.classList.remove('flipped');}
        if((keys[' ']||keys['arrowup']||keys['w'])&&!isJumping){isJumping=true;jumpSpeed=15;window.audio.playJump();}
      }
      if(isJumping){const bottom=parseFloat(player.style.bottom)||0;player.style.bottom=bottom+jumpSpeed+'px';jumpSpeed-=gravity;if(bottom+jumpSpeed<=80){player.style.bottom='80px';isJumping=false;}}
      checkProximity();requestAnimationFrame(gameLoop);
    }
    gameLoop();

    // Input & scene transition
    document.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;
      if(e.key.toLowerCase()==='e'){ window.audio.playInteract(); if(!interactionFinished)startDialog();else if(!waitingBlock){overlayPuzzle.style.display='block';dialogTextPuzzle.textContent='Иди же дальше!';setTimeout(()=>overlayPuzzle.style.display='none',2000);}}
      if(puzzleSolved){const posX=player.offsetLeft;if((e.key.toLowerCase()==='arrowleft'||e.key.toLowerCase()==='a')&&posX<=leftLimit)location.href='wizard03.html?exit=left';if((e.key.toLowerCase()==='arrowright'||e.key.toLowerCase()==='d')&&posX>=rightLimit)location.href='wizard03.html?exit=right';}}
    );
    document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
    ).call(window);
  },
  destroy: function() {}
};

scenes['wizard03'] = {
  init: function(params) {
    setSceneContent('<div id="wrapper">\n    <div id="game-container">\n      <div id="player"></div>\n      <div id="wizard">\n        <img id="wizard-img" src="wizard3.png" alt="Wizard" />\n        <div id="prompt">Press E</div>\n        <div id="wizard-message"></div>\n      </div>\n      <div id="ground"></div>\n      <!-- Puzzle & Greeting Overlay -->\n      <div id="puzzle-overlay">\n        <div id="greet-box" class="box">\n          <div>О, Саша, слава богу ты здесь! Надо срочно ответить на письмо из Финанзамт!</div>\n        </div>\n        <div id="puzzle-box" class="box">\n          <h1>Чему вас научила немецко-армянская налоговая одиссея?</h1>\n          <div id="error-text" style="display:none; margin:16px 0; font-size:30px; color:red;">Эх, все же придется звонить KPMG!</div>\n          <button class="puzzle-answer" data-correct="false">Провайдеры бывают глобальными, а ответственность нет</button>\n          <button class="puzzle-answer" data-correct="false">В Finanzamt отвечают медленно, но зато верно</button>\n          <button class="puzzle-answer" data-correct="false">Когда тебе отвечают “мы это уточним” — лучше начинай уточнять сам</button>\n          <button class="puzzle-answer" data-correct="false">На лучшую налоговую консультацию к SVP R&D можно записаться через телеграм</button>\n          <button class="puzzle-answer" data-correct="true">Все вышеперечисленное</button>\n          \n        </div>\n      </div>\n    </div>\n  </div>\n  <script>\n    // Scaling\n    function updateScale() {\n      const vw = window.innerWidth, vh = window.innerHeight;\n      const scale = Math.min(vw / 1920, vh / 1200);\n      const wrap = document.getElementById(\'wrapper\');\n      wrap.style.transform = `scale(${scale})`;\n      wrap.style.left = `${(vw - 1920 * scale) / 2}px`;\n      wrap.style.top = `${(vh - 1200 * scale) / 2}px`;\n    }\n    window.addEventListener(\'resize\', updateScale);\n    updateScale();\n\n    // DOM refs\n    const player = document.getElementById(\'player\');\n    const gameArea = document.getElementById(\'game-container\');\n    const prompt = document.getElementById(\'prompt\');\n    const overlay = document.getElementById(\'puzzle-overlay\');\n    const greetBox = document.getElementById(\'greet-box\');\n    const puzzleBox = document.getElementById(\'puzzle-box\');\n    const wizardMsg = document.getElementById(\'wizard-message\');\n\n    // Initial spawn\n    const params = new URLSearchParams(location.search);\n    const exitSide = params.get(\'exit\');\n    const leftLimit = 0;\n    const rightLimit = gameArea.clientWidth - player.clientWidth;\n    const spawnX = (exitSide === \'left\') ? rightLimit : leftLimit;\n    player.style.left = spawnX + \'px\';\n    player.style.bottom = \'80px\';\n\n    let interactionFinished = false;\n    let waitingBlock = false;\n    let puzzleSolved = false;\n    let blockSpawned = false; // prevents duplicate block spawn\n\n    // Greeting & puzzle\n    function startPlaceholder() {\n      interactionFinished = true;\n      overlay.style.display = \'block\';\n      greetBox.style.display = \'block\';\n      function ack() {\n        greetBox.style.display = \'none\';\n        puzzleBox.style.display = \'block\';\n      }\n      overlay.addEventListener(\'click\', ack, { once: true });\n      document.addEventListener(\'keydown\', ack, { once: true });\n    }\n\n    // Collectible\n    function setupCollectible() {\n      blockSpawned = true;\n      waitingBlock = true;\n      player.style.background = "url(\'player_hands.png\') center center no-repeat";\n      player.style.backgroundSize = \'contain\';\n      const block = document.createElement(\'div\');\n      block.className = \'collect-block\';\n      block.style.background = \'black\';\n      const xPos = (player.offsetLeft + (320 - 60) / 2) + \'px\';\n      block.style.left = xPos;\n      block.style.bottom = (80 + 320 + 10) + \'px\';\n      gameArea.appendChild(block);\n      block.addEventListener(\'click\', () => {\n        block.style.transition = \'all 0.5s ease-out\';\n        block.style.left = \'0px\';\n        block.style.bottom = (gameArea.clientHeight - 40) + \'px\';\n        block.addEventListener(\'transitionend\', () => {\n          block.remove();\n          waitingBlock = false;\n          player.style.background = "url(\'player_idle.png\') center center no-repeat";\n          player.style.backgroundSize = \'contain\';\n        }, { once: true });\n      });\n    }\n\n    // Final dialog after collect (not automatic)\n    function showFinalDialog() {\n      wizardMsg.innerHTML = \'Отлично! Осталось совсем чуть-чуть! Не отступай!\';\n      wizardMsg.style.display = \'block\';\n      wizardMsg.addEventListener(\'click\', () => { wizardMsg.style.display = \'none\'; }, { once: true });\n      document.addEventListener(\'keydown\', () => { wizardMsg.style.display = \'none\'; }, { once: true });\n    }\n\n    // Puzzle answer logic\n    document.querySelectorAll(\'.puzzle-answer\').forEach(btn => btn.addEventListener(\'click\', () => {\n      const correct = btn.dataset.correct === \'true\';\n      if (!correct) {\n        puzzleBox.style.animation = \'shake 0.5s\';\n        document.getElementById(\'error-text\').style.display = \'block\';\n        function clearErr() {\n          puzzleBox.style.animation = \'\';\n          document.getElementById(\'error-text\').style.display = \'none\';\n          document.removeEventListener(\'mousemove\', clearErr);\n        }\n        document.addEventListener(\'mousemove\', clearErr, { once: true });\n      } else {\n        overlay.style.display = \'none\';\n        puzzleSolved = true;\n        puzzleBox.style.display = \'none\';\n        // Show Schwarz hint and then collectible\n        wizardMsg.innerHTML = \'Ну конечно! Спасибо тебе! Последняя подсказка - <strong>SCHWARZ</strong>\';\n        wizardMsg.style.display = \'block\';\n        function ackWizard() {\n          wizardMsg.style.display = \'none\';\n          if (!blockSpawned) setupCollectible();\n        }\n        wizardMsg.addEventListener(\'click\', ackWizard, { once: true });\n        document.addEventListener(\'keydown\', ackWizard, { once: true });\n      }\n    }));\n\n    // Movement\n    let keys = {}, isJumping = false, jumpSpeed = 0, gravity = 0.8;\n    function checkProximity() {\n      const wizardX = (gameArea.clientWidth - 320) / 2;\n      const near = Math.abs(player.offsetLeft - wizardX) < 192;\n      const show = !waitingBlock && near && (!interactionFinished || puzzleSolved);\n      prompt.style.display = show ? \'block\' : \'none\';\n    }\n    function gameLoop() {\n      if (!waitingBlock) {\n        if (keys[\'arrowleft\'] || keys[\'a\']) {\n          player.style.left = Math.max(0, player.offsetLeft - 4) + \'px\';\n          player.classList.add(\'flipped\');\n        }\n        if (keys[\'arrowright\'] || keys[\'d\']) {\n          player.style.left = Math.min(gameArea.clientWidth - 320, player.offsetLeft + 4) + \'px\';\n          player.classList.remove(\'flipped\');\n        }\n        if ((keys[\' \'] || keys[\'arrowup\'] || keys[\'w\']) && !isJumping) {\n          isJumping = true;\n          jumpSpeed = 15;\n          window.audio.playJump();\n        }\n      }\n      if (isJumping) {\n        const bottom = parseFloat(player.style.bottom) || 0;\n        player.style.bottom = bottom + jumpSpeed + \'px\';\n        jumpSpeed -= gravity;\n        if (bottom + jumpSpeed <= 80) {\n          player.style.bottom = \'80px\';\n          isJumping = false;\n        }\n      }\n      checkProximity();\n      requestAnimationFrame(gameLoop);\n    }\n    gameLoop();\n\n    // Input handling\n    document.addEventListener(\'keydown\', e => {\n      const key = e.key.toLowerCase();\n      keys[key] = true;\n      if (key === \'e\') {\n        window.audio.playInteract();\n        const wizardX = (gameArea.clientWidth - 320) / 2;\n        const near = Math.abs(player.offsetLeft - wizardX) < 192;\n        if (!interactionFinished && near) {\n          startPlaceholder();\n        } else if (puzzleSolved && near) {\n          // Final dialog only on E\n          showFinalDialog();\n        }\n      }\n      if (puzzleSolved) {\n        const posX = player.offsetLeft;\n        if ((key === \'arrowleft\' || key === \'a\') && posX <= leftLimit) {\n          window.location.href = `chest.html?exit=left`;\n        }\n        if ((key === \'arrowright\' || key === \'d\') && posX >= rightLimit) {\n          window.location.href = `chest.html?exit=right`;\n        }\n      }\n    });\n    document.addEventListener(\'keyup\', e => { keys[e.key.toLowerCase()] = false; });\n  </script>', "/* Base reset */\n    html, body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: black; font-family: 'Courier New', monospace; }\n    /* Wrapper scaling */\n    #wrapper { position: absolute; top: 0; left: 0; width: 1920px; height: 1200px; transform-origin: top left; }\n    /* Background */\n    #game-container { position: relative; width: 100%; height: 100%; background: url('background.png') center center / cover no-repeat; }\n    /* Player sprite */\n    #player { position: absolute; width: 320px; height: 320px; bottom: 80px; transform-origin: center bottom;\n      background: url('player_idle.png') center center no-repeat; background-size: contain; image-rendering: pixelated; }\n    #player.flipped { transform: scaleX(-1); }\n    /* Wizard */\n    #wizard { position: absolute; width: 300px; height: 300px; bottom: 80px; left: 50%; transform: translateX(-50%); pointer-events: none; }\n    #wizard-img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }\n    /* Prompt */\n    #prompt { position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);\n      background: white; color: black; padding: 8px 12px; border: 4px solid red; border-radius: 4px;\n      font-size: 28px; font-family: 'Arial Black'; text-transform: uppercase;\n      pointer-events: none; display: none; white-space: nowrap; }\n    /* Dialog/puzzle overlay */\n    #puzzle-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7);\n      display: none; z-index: 100; }\n    /* Box common style */\n    .box {\n      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);\n      background: white; padding: 48px; border: 4px solid black;\n      width: 900px; max-width: 90vw; text-align: center;\n      font-family: 'Arial Black';\n    }\n    /* Greeting box */\n    #greet-box { display: none; }\n    /* Puzzle box */\n    #puzzle-box { display: none; }\n    #puzzle-box h1 { font-size: 42px; margin-bottom: 24px; }\n    .puzzle-answer {\n      display: block; width: 100%; margin: 12px 0; padding: 12px; font-size: 30px;\n      cursor: pointer; border: 2px solid #333; background: #eee; user-select: none;\n    }\n    /* Shake animation */\n    @keyframes shake {\n      0% { transform: translate(-50%,-50%) translateX(0); }\n      25% { transform: translate(-50%,-50%) translateX(-10px); }\n      50% { transform: translate(-50%,-50%) translateX(10px); }\n      75% { transform: translate(-50%,-50%) translateX(-10px); }\n      100% { transform: translate(-50%,-50%) translateX(0); }\n    }\n    /* Collectible block */\n    .collect-block { position: absolute; width: 60px; height: 40px; cursor: pointer; image-rendering: pixelated; }\n    /* After-puzzle hint box above wizard */\n    #wizard-message {\n      position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);\n      background: white; padding: 32px; border: 4px solid black;\n      width: 600px; max-width: 90vw; text-align: center;\n      font-family: 'Arial Black'; font-size: 32px; display: none; pointer-events: auto; cursor: pointer; z-index: 101;\n    }");
    (function() // Scaling
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

    // Initial spawn
    const params = new URLSearchParams(location.search);
    const exitSide = params.get('exit');
    const leftLimit = 0;
    const rightLimit = gameArea.clientWidth - player.clientWidth;
    const spawnX = (exitSide === 'left') ? rightLimit : leftLimit;
    player.style.left = spawnX + 'px';
    player.style.bottom = '80px';

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
      const xPos = (player.offsetLeft + (320 - 60) / 2) + 'px';
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
    document.querySelectorAll('.puzzle-answer').forEach(btn => btn.addEventListener('click', () => {
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
      const wizardX = (gameArea.clientWidth - 320) / 2;
      const near = Math.abs(player.offsetLeft - wizardX) < 192;
      const show = !waitingBlock && near && (!interactionFinished || puzzleSolved);
      prompt.style.display = show ? 'block' : 'none';
    }
    function gameLoop() {
      if (!waitingBlock) {
        if (keys['arrowleft'] || keys['a']) {
          player.style.left = Math.max(0, player.offsetLeft - 4) + 'px';
          player.classList.add('flipped');
        }
        if (keys['arrowright'] || keys['d']) {
          player.style.left = Math.min(gameArea.clientWidth - 320, player.offsetLeft + 4) + 'px';
          player.classList.remove('flipped');
        }
        if ((keys[' '] || keys['arrowup'] || keys['w']) && !isJumping) {
          isJumping = true;
          jumpSpeed = 15;
          window.audio.playJump();
        }
      }
      if (isJumping) {
        const bottom = parseFloat(player.style.bottom) || 0;
        player.style.bottom = bottom + jumpSpeed + 'px';
        jumpSpeed -= gravity;
        if (bottom + jumpSpeed <= 80) {
          player.style.bottom = '80px';
          isJumping = false;
        }
      }
      checkProximity();
      requestAnimationFrame(gameLoop);
    }
    gameLoop();

    // Input handling
    document.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      keys[key] = true;
      if (key === 'e') {
        window.audio.playInteract();
        const wizardX = (gameArea.clientWidth - 320) / 2;
        const near = Math.abs(player.offsetLeft - wizardX) < 192;
        if (!interactionFinished && near) {
          startPlaceholder();
        } else if (puzzleSolved && near) {
          // Final dialog only on E
          showFinalDialog();
        }
      }
      if (puzzleSolved) {
        const posX = player.offsetLeft;
        if ((key === 'arrowleft' || key === 'a') && posX <= leftLimit) {
          window.location.href = `chest.html?exit=left`;
        }
        if ((key === 'arrowright' || key === 'd') && posX >= rightLimit) {
          window.location.href = `chest.html?exit=right`;
        }
      }
    });
    document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
    ).call(window);
  },
  destroy: function() {}
};

scenes['chest'] = {
  init: function(params) {
    setSceneContent('<div id="wrapper">\n    <div id="game-container">\n      <div id="player"></div>\n      <div id="wizard">\n        <img id="wizard-img" src="chest_closed.png" alt="Chest" />\n        <div id="prompt">Press E</div>\n      </div>\n      <div id="ground"></div>\n      <div id="dialog-overlay">\n        <div id="dialog-box">\n          <div id="box-container"></div>\n          <p id="dialog-text"></p>\n          <button id="open-btn">ОТКРЫТЬ</button>\n          <div id="feedback"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <script>\n    // Responsive scaling\n    function updateScale() {\n      const vw = window.innerWidth, vh = window.innerHeight;\n      const scale = Math.min(vw / 1920, vh / 1200);\n      const wrap = document.getElementById(\'wrapper\');\n      wrap.style.transform = `scale(${scale})`;\n      wrap.style.left = `${(vw - 1920 * scale) / 2}px`;\n      wrap.style.top = `${(vh - 1200 * scale) / 2}px`;\n    }\n    window.addEventListener(\'resize\', updateScale);\n    updateScale();\n\n    // DOM refs\n    const player = document.getElementById(\'player\');\n    const gameArea = document.getElementById(\'game-container\');\n    const prompt = document.getElementById(\'prompt\');\n    const overlay = document.getElementById(\'dialog-overlay\');\n    const dialogText = document.getElementById(\'dialog-text\');\n    const boxContainer = document.getElementById(\'box-container\');\n    const openBtn = document.getElementById(\'open-btn\');\n    const feedback = document.getElementById(\'feedback\');\n\n    // Puzzle state\n    let puzzleSolved = false;\n    let inDialog = false;\n    let dragData = null;\n\n    // Movement state\n    let keys = {};\n    let isJumping = false;\n    let jumpSpeed = 0;\n    const gravity = 0.8;\n\n    // Puzzle data\n    const colors = [\'black\', \'red\', \'gold\'];\n    const words = { black: \'SWARTZ\', red: \'BLUTEGE\', gold: \'GOLDENE\' };\n    const correctOrder = [\'black\', \'red\', \'gold\'];\n\n    // Movement bounds & spawn logic (defined before functions)\n    const playerWidth = 320;\n    const leftLimit = 0;\n    const rightLimit = gameArea.clientWidth - playerWidth;\n    const params = new URLSearchParams(location.search);\n    const exitSide = params.get(\'exit\');\n    const spawnSide = exitSide === \'left\' ? \'right\' : \'left\';\n    let posX = spawnSide === \'left\' ? leftLimit : rightLimit;\n    let posY = 0;\n\n    // Greeting text\n    const greeting = \'А вот и последняя загадка! Подарки уже совсем рядом!\';\n\n    // Dialog starter\n    function startDialog() {\n      if (puzzleSolved) return;\n      inDialog = true;\n      overlay.style.display = \'block\';\n      dialogText.textContent = greeting;\n      boxContainer.innerHTML = \'\';\n      openBtn.style.display = \'none\';\n      feedback.textContent = \'\';\n\n      function proceed() {\n        overlay.removeEventListener(\'click\', proceed);\n        document.removeEventListener(\'keydown\', proceed);\n        dialogText.textContent =\n          \'Aus der _________ der Knechtschaft durch _________ Schlachten ans _________ Licht der Freiheit.\';\n        setupPuzzle();\n      }\n\n      overlay.addEventListener(\'click\', proceed, { once: true });\n      document.addEventListener(\'keydown\', proceed, { once: true });\n    }\n\n    // Create draggable box element\n    function createBox(color) {\n      const box = document.createElement(\'div\');\n      box.className = \'draggable-box\';\n      box.draggable = true;\n      box.dataset.color = color;\n      box.style.background = color;\n      box.addEventListener(\'dragstart\', () => {\n        feedback.textContent = \'\';\n        dragData = { color, from: \'box\' };\n      });\n      return box;\n    }\n\n    // Setup puzzle UI\n    function setupPuzzle() {\n      boxContainer.innerHTML = \'\';\n      colors.forEach(c => boxContainer.appendChild(createBox(c)));\n      openBtn.style.display = \'none\';\n      dialogText.innerHTML =\n        `Aus der <span class="drop-target" data-index="0"></span> der Knechtschaft durch <span class="drop-target" data-index="1"></span> Schlachten ans <span class="drop-target" data-index="2"></span> Licht der Freiheit.`;\n\n      document.querySelectorAll(\'.drop-target\').forEach(target => {\n        target.draggable = true;\n        target.addEventListener(\'dragstart\', e => {\n          if (!target.dataset.filled) { e.preventDefault(); return; }\n          feedback.textContent = \'\';\n          const color = target.dataset.filled;\n          dragData = { color, from: \'target\' };\n          const img = document.createElement(\'div\');\n          img.style.cssText = `width:60px;height:40px;background:${color};position:absolute;top:-1000px;`;\n          document.body.appendChild(img);\n          e.dataTransfer.setDragImage(img, 30, 20);\n          setTimeout(() => document.body.removeChild(img), 0);\n          target.textContent = \'\';\n          delete target.dataset.filled;\n        });\n        target.addEventListener(\'dragover\', e => e.preventDefault());\n        target.addEventListener(\'drop\', e => {\n          e.preventDefault();\n          const prev = target.dataset.filled;\n          if (prev) boxContainer.appendChild(createBox(prev));\n          const { color, from } = dragData;\n          target.textContent = words[color];\n          target.style.color = color;\n          target.dataset.filled = color;\n          if (from === \'box\') {\n            const orig = boxContainer.querySelector(`.draggable-box[data-color="${color}"]`);\n            if (orig) orig.remove();\n          }\n          checkAllFilled();\n          dragData = null;\n        });\n        target.addEventListener(\'dragend\', () => {\n          if (dragData && dragData.from === \'target\') {\n            boxContainer.appendChild(createBox(dragData.color));\n            checkAllFilled();\n            dragData = null;\n          }\n        });\n      });\n    }\n\n    // Verify slots before enabling open button\n    function checkAllFilled() {\n      const all = Array.from(document.querySelectorAll(\'.drop-target\'));\n      openBtn.style.display = all.every(t => t.dataset.filled) && !puzzleSolved ? \'inline-block\' : \'none\';\n    }\n\n    // --- Confetti effect logic ---\n    const confettiColors = [\n      \'#ff595e\', \'#ffca3a\', \'#8ac926\', \'#1982c4\', \'#6a4c93\',\n      \'#fdffb6\', \'#b5ead7\', \'#f9c74f\', \'#f94144\', \'#43aa8b\'\n    ];\n    let confettiActive = false;\n\n    function startConfetti() {\n      if (confettiActive) return;\n      confettiActive = true;\n      const confettiCanvas = document.createElement(\'div\');\n      confettiCanvas.id = \'confetti-canvas\';\n      confettiCanvas.style.position = \'fixed\';\n      confettiCanvas.style.left = \'0\';\n      confettiCanvas.style.top = \'0\';\n      confettiCanvas.style.width = \'100vw\';\n      confettiCanvas.style.height = \'100vh\';\n      confettiCanvas.style.pointerEvents = \'none\';\n      confettiCanvas.style.zIndex = \'99999\';\n      document.body.appendChild(confettiCanvas);\n\n      function spawnConfetto() {\n        if (!confettiActive) return;\n        const confetto = document.createElement(\'div\');\n        const size = Math.random() * 16 + 8;\n        confetto.style.position = \'absolute\';\n        confetto.style.width = `${size}px`;\n        confetto.style.height = `${size * 0.5}px`;\n        confetto.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];\n        confetto.style.borderRadius = `${size / 3}px`;\n        confetto.style.left = `${Math.random() * window.innerWidth}px`;\n        confetto.style.top = `-32px`;\n        confetto.style.opacity = Math.random() * 0.4 + 0.6;\n        confetto.style.transform = `rotate(${Math.random() * 360}deg)`;\n        confetto.style.pointerEvents = \'none\';\n        confettiCanvas.appendChild(confetto);\n\n        // Animate confetto\n        const duration = Math.random() * 2 + 2.5; // seconds\n        const xDrift = (Math.random() - 0.5) * 120;\n        const keyframes = [\n          { transform: confetto.style.transform, top: \'-32px\', left: confetto.style.left },\n          {\n            transform: `rotate(${360 + Math.random() * 180}deg)`,\n            top: `${window.innerHeight + 32}px`,\n            left: `calc(${confetto.style.left} + ${xDrift}px)`\n          }\n        ];\n        confetto.animate(keyframes, {\n          duration: duration * 1000,\n          easing: \'linear\'\n        });\n\n        // Remove after falling\n        setTimeout(() => confetto.remove(), duration * 1000);\n      }\n\n      // Spawn confetti in a loop\n      function confettiLoop() {\n        if (!confettiActive) return;\n        for (let i = 0; i < 7; i++) setTimeout(spawnConfetto, i * 80);\n        setTimeout(confettiLoop, 180);\n      }\n      confettiLoop();\n    }\n    // --- End Confetti effect logic ---\n\n    // Chest opening logic\n    openBtn.addEventListener(\'click\', () => {\n      if (puzzleSolved) return;\n      feedback.textContent = \'\';\n      const order = Array.from(document.querySelectorAll(\'.drop-target\')).map(t => t.dataset.filled);\n      if (order.join() !== correctOrder.join()) {\n        feedback.textContent = \'ЧТО-ТО НЕ ТО!\';\n        return;\n      }\n      puzzleSolved = true;\n      prompt.style.display = \'none\';\n      window.audio.stopBgm();\n      const chestAudio = window.audio.playChestOpen();\n      document.getElementById(\'wizard-img\').src = \'chest_opened.png\';\n      overlay.style.display = \'none\';\n      inDialog = false;\n      if (chestAudio) {\n        chestAudio.addEventListener(\'ended\', () => {\n          overlay.style.display = \'block\';\n          inDialog = true;\n          dialogText.innerHTML =\n            \'ПОЗДРАВЛЯЕМ С ДНЕМ РОЖДЕНИЯ! ВОТ ТУТ ТВОИ ПОДАРКИ!<br/><a href="#">[Google Drive Link]</a>\';\n          boxContainer.innerHTML = \'\';\n          openBtn.style.display = \'none\';\n          feedback.textContent = \'\';\n          window.audio.playVictory();\n          startConfetti(); // <- Start confetti!\n        });\n      }\n    });\n\n    // Update player position and prompt\n    function updatePos() {\n      player.style.left = posX + \'px\';\n      player.style.bottom = (80 + posY) + \'px\';\n    }\n    function checkProximity() {\n      if (puzzleSolved) { prompt.style.display = \'none\'; return; }\n      const wizardX = (gameArea.clientWidth - playerWidth) / 2;\n      prompt.style.display = !inDialog && Math.abs(posX - wizardX) < playerWidth * 0.6 ? \'block\' : \'none\';\n    }\n    function gameLoop() {\n      if (!inDialog && !puzzleSolved) {\n        if (keys[\'arrowleft\'] || keys[\'a\']) { posX = Math.max(leftLimit, posX - 4); player.classList.add(\'flipped\'); }\n        if (keys[\'arrowright\'] || keys[\'d\']) { posX = Math.min(rightLimit, posX + 4); player.classList.remove(\'flipped\'); }\n        if ((keys[\' \'] || keys[\'arrowup\'] || keys[\'w\']) && !isJumping) { isJumping = true; jumpSpeed = 15; window.audio.playJump(); }\n      }\n      if (isJumping) {\n        posY += jumpSpeed;\n        jumpSpeed -= gravity;\n        if (posY <= 0) { posY = 0; isJumping = false; }\n      }\n      updatePos();\n      checkProximity();\n      requestAnimationFrame(gameLoop);\n    }\n    updatePos();\n    gameLoop();\n\n    // Input listeners\n    document.addEventListener(\'keydown\', e => {\n      if (puzzleSolved) return;\n      keys[e.key.toLowerCase()] = true;\n      if (e.key.toLowerCase() === \'e\' && prompt.style.display === \'block\' && !inDialog) {\n        window.audio.playInteract();\n        startDialog();\n      }\n    });\n    document.addEventListener(\'keyup\', e => {\n      if (puzzleSolved) return;\n      const key = e.key.toLowerCase();\n      if (key === \'e\') window.audio.playInteract();\n      keys[key] = false;\n    });\n  </script>', "/* Base reset */\n    html, body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: black; font-family: 'Courier New', monospace; }\n    /* Wrapper scaling */\n    #wrapper { position: absolute; top: 0; left: 0; width: 1920px; height: 1200px; transform-origin: top left; }\n    /* Background */\n    #game-container { position: relative; width: 100%; height: 100%; background: url('background.png') center center / cover no-repeat; }\n    /* Player sprite */\n    #player { position: absolute; width: 320px; height: 320px; bottom: 80px; transform-origin: center bottom; background: url('player_idle.png') center center no-repeat; background-size: contain; image-rendering: pixelated; }\n    #player.flipped { transform: scaleX(-1); }\n    /* Wizard / Chest sprite */\n    #wizard { position: absolute; width: 320px; height: 320px; bottom: 80px; left: 50%; transform: translateX(-50%); pointer-events: none; }\n    #wizard-img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }\n    /* Prompt */\n    #prompt { position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); background: white; color: black; padding: 8px 12px; border: 4px solid red; border-radius: 4px; font-size: 28px; font-family: 'Arial Black'; text-transform: uppercase; pointer-events: none; display: none; white-space: nowrap; }\n    /* Dialog overlay */\n    #dialog-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); display:none; }\n    #dialog-box { position: relative; top:50%; left:50%; transform: translate(-50%,-50%); background: white; padding: 24px; border: 4px solid black; width: 800px; max-width: 90vw; font-family: 'Courier New', monospace; text-align: center; }\n    #box-container { display: flex; justify-content: center; width: 100%; margin-bottom: 20px; }\n    .draggable-box { width: 60px; height: 40px; margin: 0 10px; cursor: grab; image-rendering: pixelated; }\n    #dialog-text { margin: 20px 0 0; font-size: 28px; color: black; }\n    .drop-target { display: inline-block; width: 120px; border-bottom: 2px solid #333; margin: 0 5px; vertical-align: middle; min-height: 36px; cursor: pointer; }\n    #open-btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #eee; border: 2px solid #333; font-size: 24px; cursor: pointer; }\n    #feedback { margin-top: 12px; font-size: 24px; color: red; height: 30px; }\n    /* Confetti - nothing to style, handled in JS */");
    (function() // Responsive scaling
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

    // Movement bounds & spawn logic (defined before functions)
    const playerWidth = 320;
    const leftLimit = 0;
    const rightLimit = gameArea.clientWidth - playerWidth;
    const params = new URLSearchParams(location.search);
    const exitSide = params.get('exit');
    const spawnSide = exitSide === 'left' ? 'right' : 'left';
    let posX = spawnSide === 'left' ? leftLimit : rightLimit;
    let posY = 0;

    // Greeting text
    const greeting = 'А вот и последняя загадка! Подарки уже совсем рядом!';

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
        dialogText.textContent =
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

    // Verify slots before enabling open button
    function checkAllFilled() {
      const all = Array.from(document.querySelectorAll('.drop-target'));
      openBtn.style.display = all.every(t => t.dataset.filled) && !puzzleSolved ? 'inline-block' : 'none';
    }

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

        // Remove after falling
        setTimeout(() => confetto.remove(), duration * 1000);
      }

      // Spawn confetti in a loop
      function confettiLoop() {
        if (!confettiActive) return;
        for (let i = 0; i < 7; i++) setTimeout(spawnConfetto, i * 80);
        setTimeout(confettiLoop, 180);
      }
      confettiLoop();
    }
    // --- End Confetti effect logic ---

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
      window.audio.stopBgm();
      const chestAudio = window.audio.playChestOpen();
      document.getElementById('wizard-img').src = 'chest_opened.png';
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
          window.audio.playVictory();
          startConfetti(); // <- Start confetti!
        });
      }
    });

    // Update player position and prompt
    function updatePos() {
      player.style.left = posX + 'px';
      player.style.bottom = (80 + posY) + 'px';
    }
    function checkProximity() {
      if (puzzleSolved) { prompt.style.display = 'none'; return; }
      const wizardX = (gameArea.clientWidth - playerWidth) / 2;
      prompt.style.display = !inDialog && Math.abs(posX - wizardX) < playerWidth * 0.6 ? 'block' : 'none';
    }
    function gameLoop() {
      if (!inDialog && !puzzleSolved) {
        if (keys['arrowleft'] || keys['a']) { posX = Math.max(leftLimit, posX - 4); player.classList.add('flipped'); }
        if (keys['arrowright'] || keys['d']) { posX = Math.min(rightLimit, posX + 4); player.classList.remove('flipped'); }
        if ((keys[' '] || keys['arrowup'] || keys['w']) && !isJumping) { isJumping = true; jumpSpeed = 15; window.audio.playJump(); }
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
    document.addEventListener('keydown', e => {
      if (puzzleSolved) return;
      keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e' && prompt.style.display === 'block' && !inDialog) {
        window.audio.playInteract();
        startDialog();
      }
    });
    document.addEventListener('keyup', e => {
      if (puzzleSolved) return;
      const key = e.key.toLowerCase();
      if (key === 'e') window.audio.playInteract();
      keys[key] = false;
    });
    ).call(window);
  },
  destroy: function() {}
};


// SPA navigation (replaces window.location)
function loadScene(name, params={}) {
  if (currentScene && scenes[currentScene].destroy) scenes[currentScene].destroy();
  currentScene = name;
  lastParams = params;
  scenes[name].init(params);
}

// Export navigation globally for scene scripts
window.loadScene = loadScene;

// Initial load
window.addEventListener('DOMContentLoaded', function() {
  loadScene('index');
});
