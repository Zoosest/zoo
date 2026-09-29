(() => {
  "use strict";

  const TRACK_HEALTH = 24;
  const GAME_DURATION = 80;
  const MOLE_VISIBLE_MS = 500;
  const MOLE_INTERVAL_MS = 1400;

  const SNAKE_CHANCE = 0.25;
  const SNAKE_TIME_PENALTY = 10;

  const REMOVED_TRACKS_KEY = "rizneyWhackedTracks";

  let game = null;
  let gameStylesAdded = false;

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (error) {}
  }

  function youtube() {
    return window.rizneyPlayer || window.player || null;
  }

  function getCurrentSongId() {
    const player = youtube();

    if (!player || typeof player.getVideoData !== "function") {
      return null;
    }

    try {
      const data = player.getVideoData();

      if (!data || !data.video_id) {
        return null;
      }

      return String(data.video_id);
    } catch (error) {
      return null;
    }
  }

  function getCurrentSongNumber() {
    const currentId = getCurrentSongId();

    if (!currentId) {
      return null;
    }

    const songIds = Array.isArray(window.rizneySongIds)
      ? window.rizneySongIds
      : [];

    const index = songIds.indexOf(currentId);

    if (index < 0) {
      return null;
    }

    return index + 1;
  }

  function getSongIdForNumber(songNumber) {
    if (!songNumber || !Number.isInteger(songNumber)) {
      return null;
    }

    const songIds = Array.isArray(window.rizneySongIds)
      ? window.rizneySongIds
      : [];

    const songId = songIds[songNumber - 1];

    if (!songId) {
      return null;
    }

    return String(songId);
  }

  function getSavedWhackedTracks() {
    try {
      const saved = localStorage.getItem(REMOVED_TRACKS_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(Boolean)
        .map(value => String(value));
    } catch (error) {
      return [];
    }
  }

  function saveWhackedTrack(songId) {
    if (!songId) {
      return false;
    }

    try {
      const saved = new Set(getSavedWhackedTracks());

      saved.add(String(songId));

      localStorage.setItem(
        REMOVED_TRACKS_KEY,
        JSON.stringify(Array.from(saved))
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  function findSongRow(songNumber) {
    if (!songNumber || !Number.isInteger(songNumber)) {
      return null;
    }

    return document.querySelector(
      `#song-list .song[data-song-index="${songNumber}"]`
    );
  }

  function applyRoadworkToRow(row) {
    if (!row) {
      return false;
    }

    row.classList.add("rizney-roadwork");
    row.dataset.rizneyRoadwork = "true";

    return true;
  }

  function closeRoad(songNumber, songId) {
    const row = findSongRow(songNumber);

    if (!row) {
      return false;
    }

    if (songId) {
      saveWhackedTrack(songId);
    }

    return applyRoadworkToRow(row);
  }

  function loadSavedRoadwork() {
    const saved = new Set(getSavedWhackedTracks());

    if (!saved.size) {
      return;
    }

    document.querySelectorAll("#song-list .song").forEach(row => {
      const songNumber = Number(row.dataset.songIndex);

      if (
        !Number.isInteger(songNumber) ||
        songNumber < 1
      ) {
        return;
      }

      const songId = getSongIdForNumber(songNumber);

      if (songId && saved.has(songId)) {
        applyRoadworkToRow(row);
      }
    });
  }

  function addGameStyles() {
    if (gameStylesAdded) {
      return;
    }

    gameStylesAdded = true;

    const style = document.createElement("style");

    style.textContent = `
      #wat-game {
        margin: 18px 0 24px;
        padding: 18px;
        border-radius: 18px;
        background: #120b18;
        border: 1px solid rgba(192, 132, 252, .35);
        box-sizing: border-box;
      }

      #wat-game[hidden] {
        display: none !important;
      }

      #wat-game .wat-title {
        margin: 0 0 12px;
        text-align: center;
        color: #f5d76e;
        font-weight: 800;
        letter-spacing: .08em;
      }

      #wat-game .wat-status {
        min-height: 24px;
        margin-bottom: 10px;
        text-align: center;
        color: #f5d76e;
        font-weight: 700;
      }

      #wat-game .wat-health-wrap {
        margin-bottom: 10px;
      }

      #wat-game .wat-health-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        color: #c084fc;
        font-size: .82rem;
        font-weight: 700;
      }

      #wat-game .wat-health {
        height: 12px;
        overflow: hidden;
        border-radius: 999px;
        background: #24162f;
        border: 1px solid rgba(245, 215, 110, .3);
      }

      #wat-game .wat-health-bar {
        width: 100%;
        height: 100%;
        background: #d4af37;
        transition: width .15s ease;
      }

      #wat-game .wat-board {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 14px;
        min-height: 250px;
        padding: 16px;
        border-radius: 18px;
        background: #1d1028;
        box-sizing: border-box;
        overflow: hidden;
      }

      #wat-game .wat-hole {
        position: relative;
        min-height: 92px;
        border-radius: 50%;
        background: #000;
      }

      #wat-game .wat-hit-grid {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 14px;
        padding: 16px;
      }

      #wat-game .wat-hit {
        position: relative;
        border: 0;
        padding: 0;
        margin: 0;
        background: transparent;
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      #wat-game .wat-target {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 70px;
        height: 70px;
        transform: translate(-50%, -50%);
        object-fit: contain;
        pointer-events: none;
        user-select: none;
      }

      #wat-game .wat-target.wat-hit-image {
        animation: wat-hit-pop .24s ease-out both;
      }

      #wat-game .wat-popup {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 72px;
        height: 72px;
        transform: translate(-50%, -50%);
        object-fit: contain;
        pointer-events: none;
        z-index: 5;
        animation: wat-popup .45s ease-out both;
      }

      #wat-game .wat-splash {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 10px;
        height: 10px;
        border: 3px solid #f5d76e;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: wat-ripple .35s ease-out both;
      }

      #wat-game .wat-controls {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 12px;
      }

      #wat-game button {
        font: inherit;
      }

      #wat-game .wat-control {
        padding: 9px 14px;
        border: 1px solid rgba(192, 132, 252, .45);
        border-radius: 999px;
        background: #1d1028;
        color: #f5d76e;
        cursor: pointer;
      }

      #wat-game .wat-control:hover {
        background: #29163a;
      }

      @keyframes wat-hit-pop {
        0% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
          transform: translate(-50%, -50%) scale(.7);
          opacity: 0;
        }
      }

      @keyframes wat-popup {
        0% {
          transform: translate(-50%, -50%) scale(.6);
          opacity: 0;
        }
        30% {
          transform: translate(-50%, -50%) scale(1.15);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -75%) scale(1);
          opacity: 0;
        }
      }

      @keyframes wat-ripple {
        from {
          width: 10px;
          height: 10px;
          opacity: 1;
        }
        to {
          width: 70px;
          height: 70px;
          opacity: 0;
        }
      }

      @media (max-width: 600px) {
        #wat-game {
          padding: 12px;
        }

        #wat-game .wat-board {
          min-height: 220px;
          gap: 10px;
          padding: 12px;
        }

        #wat-game .wat-hit-grid {
          gap: 10px;
          padding: 12px;
        }

        #wat-game .wat-hole {
          min-height: 78px;
        }

        #wat-game .wat-target {
          width: 60px;
          height: 60px;
        }
      }

      #song-list .song.rizney-roadwork {
        opacity: .72;
      }

      #song-list .song.rizney-roadwork .song-number,
      #song-list .song.rizney-roadwork .song-title,
      #song-list .song.rizney-roadwork .play {
        display: none;
      }

      #song-list .song.rizney-roadwork::after {
        content: "🚧 WHACKED!";
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 1 / 4;
        grid-row: 1;
        min-height: 42px;
        color: #f5d76e;
        font-weight: 900;
        letter-spacing: .06em;
      }

      #song-list .song.rizney-roadwork .animal-button {
        grid-column: 4;
        grid-row: 1;
        cursor: not-allowed;
        opacity: .45;
        pointer-events: none;
      }
    `;

    document.head.appendChild(style);
  }

  function makeImage(src, alt, className) {
    const img = document.createElement("img");

    img.src = src;
    img.alt = alt || "";
    img.className = className || "";
    img.draggable = false;

    return img;
  }

  function createGamePanel() {
    const existing = $("#wat-game");

    if (existing) {
      return existing;
    }

    const panel = document.createElement("section");

    panel.id = "wat-game";
    panel.hidden = true;

    panel.innerHTML = `
      <h2 class="wat-title">WHACK-A-TRACK</h2>

      <div class="wat-status" id="wat-status">
        WHACK THE DUCKS!
      </div>

      <div class="wat-health-wrap">
        <div class="wat-health-label">
          <span>TRACK HEALTH</span>
          <span id="wat-health-number">24</span>
        </div>

        <div class="wat-health">
          <div class="wat-health-bar" id="wat-health-bar"></div>
        </div>
      </div>

      <div class="wat-board" id="wat-board">
        <div class="wat-hole"></div>
        <div class="wat-hole"></div>
        <div class="wat-hole"></div>
        <div class="wat-hole"></div>
        <div class="wat-hole"></div>
        <div class="wat-hole"></div>

        <div class="wat-hit-grid" id="wat-hit-grid">
          <button class="wat-hit" type="button" aria-label="Whack target"></button>
          <button class="wat-hit" type="button" aria-label="Whack target"></button>
          <button class="wat-hit" type="button" aria-label="Whack target"></button>
          <button class="wat-hit" type="button" aria-label="Whack target"></button>
          <button class="wat-hit" type="button" aria-label="Whack target"></button>
          <button class="wat-hit" type="button" aria-label="Whack target"></button>
        </div>
      </div>

      <div class="wat-controls">
        <button class="wat-control" id="wat-start" type="button">
          START
        </button>

        <button class="wat-control" id="wat-end" type="button">
          END GAME
        </button>

        <button class="wat-control" id="wat-refresh" type="button" hidden>
          REFRESH
        </button>
      </div>
    `;

    const list = $("#song-list");

    if (list) {
      list.parentNode.insertBefore(panel, list);
    } else {
      document.body.appendChild(panel);
    }

    return panel;
  }

  function playCurrentSongAgain() {
    const player = youtube();

    if (!player) {
      return;
    }

    try {
      if (typeof player.seekTo === "function") {
        player.seekTo(0, true);
      }

      if (typeof player.playVideo === "function") {
        player.playVideo();
      }
    } catch (error) {}
  }

  function getNextButton() {
    return $("#next-song");
  }

  function nextSong() {
    const button = getNextButton();

    if (button) {
      button.click();
    }
  }

  function clearTarget() {
    if (!game || !game.currentTarget) {
      return;
    }

    game.currentTarget.remove();
    game.currentTarget = null;
  }

  function clearTimers() {
    if (!game) {
      return;
    }

    if (game.spawnTimer) {
      clearTimeout(game.spawnTimer);
      game.spawnTimer = null;
    }

    if (game.targetTimer) {
      clearTimeout(game.targetTimer);
      game.targetTimer = null;
    }

    if (game.clockTimer) {
      clearInterval(game.clockTimer);
      game.clockTimer = null;
    }
  }

  function updateHealth() {
    if (!game) {
      return;
    }

    const number = $("#wat-health-number", game.panel);
    const bar = $("#wat-health-bar", game.panel);

    if (number) {
      number.textContent = String(
        Math.max(0, game.health)
      );
    }

    if (bar) {
      const percent =
        Math.max(0, game.health) /
        TRACK_HEALTH *
        100;

      bar.style.width = `${percent}%`;
    }
  }

  function updateStatus(text) {
    if (!game) {
      return;
    }

    game.status.textContent = text;
  }

  function showEffect(index, imageName, altText) {
    if (!game) {
      return;
    }

    const hitButton = game.hitButtons[index];

    if (!hitButton) {
      return;
    }

    const board = game.board;

    const rect =
      hitButton.getBoundingClientRect();

    const boardRect =
      board.getBoundingClientRect();

    const x =
      rect.left -
      boardRect.left +
      rect.width / 2;

    const y =
      rect.top -
      boardRect.top +
      rect.height / 2;

    const img = makeImage(
      `assets/${imageName}`,
      altText || "",
      "wat-popup"
    );

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    board.appendChild(img);

    setTimeout(() => {
      img.remove();
    }, 500);

    const splash =
      document.createElement("span");

    splash.className = "wat-splash";
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;

    board.appendChild(splash);

    setTimeout(() => {
      splash.remove();
    }, 400);
  }

  function spawnTarget() {
    if (!game || !game.running) {
      return;
    }

    clearTarget();

    const index = Math.floor(
      Math.random() *
      game.hitButtons.length
    );

    const isSnake =
      Math.random() < SNAKE_CHANCE;

    const hitButton =
      game.hitButtons[index];

    if (!hitButton) {
      scheduleSpawn();
      return;
    }

    const target = makeImage(
      isSnake
        ? "assets/snake.png"
        : "assets/duck.png",
      isSnake ? "Snake" : "Duck",
      "wat-target"
    );

    hitButton.appendChild(target);

    game.currentTarget = target;
    game.currentTargetIndex = index;
    game.currentTargetIsSnake = isSnake;

    game.targetTimer = setTimeout(() => {
      if (!game || !game.running) {
        return;
      }

      clearTarget();
      scheduleSpawn();
    }, MOLE_VISIBLE_MS);
  }

  function scheduleSpawn() {
    if (!game || !game.running) {
      return;
    }

    game.spawnTimer = setTimeout(() => {
      spawnTarget();
    }, MOLE_INTERVAL_MS);
  }

  function playQuack() {
    try {
      const audio =
        new Audio("assets/quack.mp3");

      audio.currentTime = 0;

      audio.play().catch(() => {});
    } catch (error) {}
  }

  function playHiss() {
    try {
      const audio =
        new Audio("assets/hiss.mp3");

      audio.currentTime = 0;

      audio.play().catch(() => {});
    } catch (error) {}
  }

  function hitTarget(index) {
    if (!game || !game.running) {
      return;
    }

    if (
      !game.currentTarget ||
      game.currentTargetIndex !== index
    ) {
      return;
    }

    const isSnake =
      game.currentTargetIsSnake;

    clearTarget();

    if (isSnake) {
      playHiss();
      vibrate([70, 40, 70]);

      game.seconds -=
        SNAKE_TIME_PENALTY;

      showEffect(
        index,
        "damage.png",
        "-10"
      );

      updateStatus("-10 SECONDS!");

      if (game.seconds <= 0) {
        game.seconds = 0;
        finish(false);
        return;
      }

      scheduleSpawn();
      return;
    }

    playQuack();
    vibrate(35);

    game.health -= 1;

    showEffect(
      index,
      "duck-hit.png",
      "WHACK!"
    );

    updateHealth();

    updateStatus("QUACK!");

    if (game.health <= 0) {
      game.health = 0;

      updateHealth();

      finish(true);
      return;
    }

    scheduleSpawn();
  }

  function updateClock() {
    if (!game || !game.running) {
      return;
    }

    game.seconds -= 1;

    if (game.seconds <= 0) {
      game.seconds = 0;
      finish(false);
      return;
    }

    updateStatus(
      `TIME: ${game.seconds}s`
    );
  }

  function finish(won) {
    if (!game || !game.running) {
      return;
    }

    game.running = false;

    clearTimers();
    clearTarget();

    const songId =
      getCurrentSongId();

    const songNumber =
      getCurrentSongNumber();

    saveWhackedTrack(songId);

    const roadClosed =
      closeRoad(
        songNumber,
        songId
      );

    if (roadClosed) {
      game.refreshButton.hidden = false;
    }

    if (won) {
      game.status.textContent =
        "TRACK BANISHED! 🚫";
    } else {
      game.status.textContent =
        "TIME'S UP!";
    }

    game.startButton.hidden = false;

    nextSong();

    requestAnimationFrame(() => {
      window.scrollTo({
        top: game.savedScrollPosition,
        behavior: "instant"
      });
    });
  }

  function startGame() {
    if (!game) {
      return;
    }

    const currentSongId =
      getCurrentSongId();

    if (!currentSongId) {
      updateStatus(
        "PLAY A SONG FIRST."
      );
      return;
    }

    const currentSongNumber =
      getCurrentSongNumber();

    if (!currentSongNumber) {
      updateStatus(
        "CURRENT TRACK NOT FOUND."
      );
      return;
    }

    const row =
      findSongRow(
        currentSongNumber
      );

    if (
      row &&
      row.classList.contains(
        "rizney-roadwork"
      )
    ) {
      updateStatus(
        "TRACK ALREADY WHACKED!"
      );
      return;
    }

    clearTimers();
    clearTarget();

    game.health = TRACK_HEALTH;
    game.seconds = GAME_DURATION;
    game.running = true;

    game.savedScrollPosition =
      window.scrollY;

    game.startButton.hidden = true;
    game.refreshButton.hidden = true;

    updateHealth();

    updateStatus(
      `TIME: ${game.seconds}s`
    );

    playCurrentSongAgain();

    game.clockTimer =
      setInterval(
        updateClock,
        1000
      );

    spawnTarget();
  }

  function endGame() {
    if (!game) {
      return;
    }

    game.running = false;

    clearTimers();
    clearTarget();

    game.startButton.hidden = false;

    updateStatus(
      "GAME ENDED."
    );
  }

  function refreshRoadwork() {
    window.location.reload();
  }

  function showGame() {
    if (!game) {
      return;
    }

    game.panel.hidden = false;

    requestAnimationFrame(() => {
      game.panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function setupToolbar() {
    const button =
      $("#whack-track");

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      () => {
        showGame();
      }
    );
  }

  function setupGame() {
    const panel =
      createGamePanel();

    const board =
      $("#wat-board", panel);

    const status =
      $("#wat-status", panel);

    const startButton =
      $("#wat-start", panel);

    const endButton =
      $("#wat-end", panel);

    const refreshButton =
      $("#wat-refresh", panel);

    const hitButtons =
      Array.from(
        document.querySelectorAll(
          "#wat-game .wat-hit"
        )
      );

    game = {
      panel,
      board,
      status,
      startButton,
      endButton,
      refreshButton,
      hitButtons,
      health: TRACK_HEALTH,
      seconds: GAME_DURATION,
      running: false,
      currentTarget: null,
      currentTargetIndex: -1,
      currentTargetIsSnake: false,
      spawnTimer: null,
      targetTimer: null,
      clockTimer: null,
      savedScrollPosition: 0
    };

    hitButtons.forEach(
      (button, index) => {
        button.addEventListener(
          "click",
          () => {
            hitTarget(index);
          }
        );
      }
    );

    startButton.addEventListener(
      "click",
      startGame
    );

    endButton.addEventListener(
      "click",
      endGame
    );

    refreshButton.addEventListener(
      "click",
      refreshRoadwork
    );

    updateHealth();
  }

  function setupRoadworkObserver() {
    const list =
      $("#song-list");

    if (!list) {
      return;
    }

    const observer =
      new MutationObserver(() => {
        loadSavedRoadwork();
      });

    observer.observe(list, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    addGameStyles();
    setupGame();
    setupToolbar();
    loadSavedRoadwork();
    setupRoadworkObserver();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
