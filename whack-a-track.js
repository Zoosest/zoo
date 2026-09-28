/* =========================================================
   WHACK-A-TRACK
   Standalone mini-game for the Rizney Music Archive
   ========================================================= */

(() => {
  "use strict";

  const TRACK_HEALTH = 24;
  const GAME_DURATION = 80;
  const MOLE_VISIBLE_MS = 460;
  const MOLE_INTERVAL_MS = 1400;

  let game = null;
  let active = false;
  let trackHealth = TRACK_HEALTH;
  let secondsLeft = GAME_DURATION;

  let moleTimer = null;
  let hideTimer = null;
  let gameTimer = null;

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function getPlayer() {
    return window.rizneyPlayer || window.player || null;
  }

  function isPlaying() {
    const player = getPlayer();

    if (!player || !window.YT) {
      return false;
    }

    if (typeof player.getPlayerState !== "function") {
      return false;
    }

    return player.getPlayerState() === YT.PlayerState.PLAYING;
  }

  function stopTimers() {
    clearTimeout(moleTimer);
    clearTimeout(hideTimer);
    clearInterval(gameTimer);

    moleTimer = null;
    hideTimer = null;
    gameTimer = null;
  }

  function hideMoles() {
    if (!game) return;

    game.holes.forEach(hole => {
      hole.dataset.active = "false";
      hole.textContent = "🕳️";
    });
  }

  function createGame() {
    if (game) {
      return game;
    }

    const panel = document.createElement("section");

    panel.id = "whack-a-track-game";

    panel.setAttribute(
      "aria-label",
      "Whack-A-Track game"
    );

    panel.innerHTML = `
      <h2>Whack-A-Track</h2>

      <p id="wat-status" aria-live="polite">
        Get ready...
      </p>

      <p>
        <strong id="wat-time">${GAME_DURATION}</strong>s
      </p>

      <progress
        id="wat-health"
        max="${TRACK_HEALTH}"
        value="${TRACK_HEALTH}"
        aria-label="Track health"
      ></progress>

      <div
        id="wat-board"
        role="group"
        aria-label="Whack-A-Track board"
      ></div>

      <div id="wat-buttons">
        <button
          id="wat-restart"
          type="button"
        >
          Restart
        </button>

        <button
          id="wat-close"
          type="button"
        >
          Close Game
        </button>
      </div>
    `;

    Object.assign(panel.style, {
      maxWidth: "620px",
      width: "calc(100% - 24px)",
      margin: "12px auto 20px",
      padding: "14px",
      boxSizing: "border-box",
      textAlign: "center",
      background: "#120b18",
      border: "2px solid #d4af37",
      borderRadius: "12px",
      boxShadow: "0 0 24px rgba(212,175,55,.35)",
      color: "#e0aaff",
      position: "relative",
      zIndex: "30"
    });

    const heading = $("h2", panel);

    if (heading) {
      Object.assign(heading.style, {
        margin: "0 0 6px",
        color: "#f5d76e"
      });
    }

    const status = $("#wat-status", panel);

    if (status) {
      Object.assign(status.style, {
        minHeight: "1.4em",
        margin: "4px 0"
      });
    }

    const health = $("#wat-health", panel);

    if (health) {
      Object.assign(health.style, {
        display: "block",
        width: "100%",
        height: "18px",
        margin: "10px 0 16px",
        accentColor: "#d4af37"
      });
    }

    const board = $("#wat-board", panel);

    Object.assign(board.style, {
      display: "grid",
      gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
      gap: "10px",
      margin: "16px auto"
    });

    const holes = [];

    for (let i = 0; i < 6; i++) {
      const hole = document.createElement("button");

      hole.type = "button";
      hole.className = "wat-hole";
      hole.textContent = "🕳️";
      hole.dataset.active = "false";

      Object.assign(hole.style, {
        minHeight: "76px",
        padding: "8px",
        fontSize: "2rem",
        cursor: "crosshair",
        touchAction: "manipulation"
      });

      hole.addEventListener("click", () => {
        if (!active) {
          return;
        }

        if (hole.dataset.active !== "true") {
          return;
        }

        hole.dataset.active = "false";
        hole.textContent = "💥";

        trackHealth--;

        if (health) {
          health.value = trackHealth;
        }

        if (trackHealth <= 0) {
          finish(true);
        }
      });

      board.appendChild(hole);
      holes.push(hole);
    }

    const restartButton =
      $("#wat-restart", panel);

    const closeButton =
      $("#wat-close", panel);

    restartButton?.addEventListener(
      "click",
      () => {
        startGame();
      }
    );

    closeButton?.addEventListener(
      "click",
      () => {
        closeGame();
      }
    );

    const anchor =
      $(".player-dock") ||
      $(".controls") ||
      $("main") ||
      document.body;

    anchor.insertAdjacentElement(
      "afterend",
      panel
    );

    panel.hidden = true;

    game = {
      panel,
      board,
      holes,
      status,
      health,
      time: $("#wat-time", panel)
    };

    return game;
  }

  function spawnMole() {
    if (!active || !game) {
      return;
    }

    hideMoles();

    const index =
      Math.floor(
        Math.random() *
        game.holes.length
      );

    const hole = game.holes[index];

    hole.dataset.active = "true";
    hole.textContent = "🐭";

    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      if (
        hole.dataset.active ===
        "true"
      ) {
        hole.dataset.active = "false";
        hole.textContent = "🕳️";
      }
    }, MOLE_VISIBLE_MS);

    clearTimeout(moleTimer);

    moleTimer = setTimeout(
      spawnMole,
      MOLE_INTERVAL_MS
    );
  }

  function startClock() {
    if (!game) return;

    clearInterval(gameTimer);

    secondsLeft = GAME_DURATION;

    game.time.textContent =
      secondsLeft;

    gameTimer = setInterval(() => {
      if (!active) {
        return;
      }

      secondsLeft--;

      game.time.textContent =
        secondsLeft;

      if (secondsLeft <= 0) {
        finish(false);
      }
    }, 1000);
  }

  function finish(won) {
    if (!active) {
      return;
    }

    active = false;

    stopTimers();
    hideMoles();

    if (won) {
      game.status.textContent =
        "💥 TRACK WHACKED!";
    } else {
      game.status.textContent =
        "The track survived. Try again!";
    }
  }

  function startGame() {
    const currentGame =
      createGame();

    stopTimers();

    currentGame.panel.hidden =
      false;

    trackHealth =
      TRACK_HEALTH;

    currentGame.health.value =
      TRACK_HEALTH;

    secondsLeft =
      GAME_DURATION;

    currentGame.time.textContent =
      secondsLeft;

    hideMoles();

    /*
      The game itself does not change
      songs or the playlist yet.
    */

    if (!isPlaying()) {
      active = false;

      currentGame.status.textContent =
        "▶️ Play a song first, then press Whack-A-Track.";

      currentGame.panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    active = true;

    currentGame.status.textContent =
      "🐭 WHACK THE TRACK!";

    startClock();
    spawnMole();

    currentGame.panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeGame() {
    active = false;

    stopTimers();

    if (game) {
      game.panel.hidden = true;
    }
  }

  function setupButton() {
    const button =
      $("#whack-track");

    if (!button) {
      return false;
    }

    if (
      button.dataset.whackGameBound ===
      "true"
    ) {
      return true;
    }

    button.dataset.whackGameBound =
      "true";

    button.type = "button";

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        startGame();
      }
    );

    return true;
  }

  function init() {
    createGame();
    setupButton();
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
