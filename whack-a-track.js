/* =========================================================
   RIZNEY MUSIC ARCHIVE
   WHACK-A-TRACK — CLEAN BASELINE
   ========================================================= */

(() => {
  "use strict";

  const TRACK_HEALTH = 12;
  const GAME_DURATION = 60;
  const MOLE_VISIBLE_MS = 700;
  const MOLE_INTERVAL_MS = 1200;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  let game = null;
  let active = false;
  let trackHealth = TRACK_HEALTH;
  let secondsLeft = GAME_DURATION;

  let moleTimer = null;
  let hideTimer = null;
  let gameTimer = null;


  /* =========================================================
     GAME CREATION
     ========================================================= */

  function createGame() {
    if (game) return game;

    const panel = document.createElement("section");

    panel.id = "whack-a-track-game";
    panel.setAttribute("aria-label", "Whack-a-Track");

    panel.innerHTML = `
      <h2>Whack-a-Track</h2>

      <p id="wat-status" aria-live="polite">
        Whack the mouse!
      </p>

      <p>
        <span id="wat-time">${GAME_DURATION}</span>s
      </p>

      <progress
        id="wat-health"
        max="${TRACK_HEALTH}"
        value="${TRACK_HEALTH}"
        aria-label="Track health">
      </progress>

      <div
        id="wat-board"
        role="group"
        aria-label="Whack-a-Track board">
      </div>

      <button id="wat-close" type="button">
        Close game
      </button>
    `;


    /* =======================================================
       PANEL STYLE
       ======================================================= */

    Object.assign(panel.style, {
      maxWidth: "min(92vw, 620px)",
      boxSizing: "border-box",
      margin: "12px auto 20px",
      padding: "14px",
      textAlign: "center",
      background: "#120b18",
      border: "2px solid #d4af37",
      borderRadius: "12px",
      boxShadow: "0 0 24px rgba(212,175,55,.35)"
    });


    /* =======================================================
       BOARD
       ======================================================= */

    const board = $("#wat-board", panel);

    Object.assign(board.style, {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "10px",
      margin: "18px auto"
    });


    /* =======================================================
       HEALTH BAR
       ======================================================= */

    const health = $("#wat-health", panel);

    Object.assign(health.style, {
      display: "block",
      width: "100%",
      height: "18px",
      margin: "10px 0 16px",
      accentColor: "#d4af37"
    });


    /* =======================================================
       CREATE SIX HOLES
       ======================================================= */

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
        cursor: "crosshair"
      });


      hole.addEventListener("click", () => {

        if (!active) return;

        if (hole.dataset.active !== "true") return;


        /* HIT */

        hole.dataset.active = "false";
        hole.textContent = "💥";

        trackHealth--;

        health.value = trackHealth;


        if (trackHealth <= 0) {
          finishGame(true);
        }

      });


      board.appendChild(hole);
    }


    /* =======================================================
       CLOSE BUTTON
       ======================================================= */

    $("#wat-close", panel).addEventListener(
      "click",
      closeGame
    );


    /* =======================================================
       INSERT GAME BELOW PLAYER
       ======================================================= */

    const playerDock =
      document.querySelector(".player-dock");

    const main =
      document.querySelector("main");

    const destination =
      playerDock || main || document.body;

    destination.insertAdjacentElement(
      "afterend",
      panel
    );


    panel.hidden = true;


    game = {
      panel,
      board,
      status: $("#wat-status", panel),
      time: $("#wat-time", panel),
      health
    };

    return game;
  }


  /* =========================================================
     HIDE ALL MICE
     ========================================================= */

  function hideMoles() {

    if (!game) return;

    const holes =
      game.board.querySelectorAll(".wat-hole");

    holes.forEach(hole => {

      hole.dataset.active = "false";
      hole.textContent = "🕳️";

    });
  }


  /* =========================================================
     SPAWN MOUSE
     ========================================================= */

  function spawnMole() {

    if (!active) return;

    const holes = [
      ...game.board.querySelectorAll(".wat-hole")
    ];

    if (!holes.length) return;


    hideMoles();


    const randomIndex =
      Math.floor(Math.random() * holes.length);

    const hole =
      holes[randomIndex];


    hole.dataset.active = "true";
    hole.textContent = "🐭";


    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {

      if (hole.dataset.active === "true") {
        hole.dataset.active = "false";
        hole.textContent = "🕳️";
      }

    }, MOLE_VISIBLE_MS);


    moleTimer =
      setTimeout(
        spawnMole,
        MOLE_INTERVAL_MS
      );
  }


  /* =========================================================
     GAME CLOCK
     ========================================================= */

  function startClock() {

    clearInterval(gameTimer);

    secondsLeft = GAME_DURATION;

    game.time.textContent =
      secondsLeft;


    gameTimer = setInterval(() => {

      if (!active) return;

      secondsLeft--;

      game.time.textContent =
        secondsLeft;


      if (secondsLeft <= 0) {
        finishGame(false);
      }

    }, 1000);
  }


  /* =========================================================
     FINISH GAME
     ========================================================= */

  function finishGame(won) {

    if (!active) return;

    active = false;

    clearTimeout(moleTimer);
    clearTimeout(hideTimer);
    clearInterval(gameTimer);

    hideMoles();


    if (won) {

      game.status.textContent =
        "💥 TRACK WHACKED!";

    } else {

      game.status.textContent =
        "The track survived. Try again!";

    }
  }


  /* =========================================================
     CLOSE GAME
     ========================================================= */

  function closeGame() {

    active = false;

    clearTimeout(moleTimer);
    clearTimeout(hideTimer);
    clearInterval(gameTimer);

    hideMoles();

    if (game) {
      game.panel.hidden = true;
    }
  }


  /* =========================================================
     START GAME
     ========================================================= */

  function startGame(event) {

    event.preventDefault();
    event.stopImmediatePropagation();


    game = createGame();


    clearTimeout(moleTimer);
    clearTimeout(hideTimer);
    clearInterval(gameTimer);


    /* RESET GAME */

    trackHealth = TRACK_HEALTH;
    secondsLeft = GAME_DURATION;

    game.health.value =
      trackHealth;

    game.time.textContent =
      secondsLeft;

    game.status.textContent =
      "Whack every mouse before the clock runs out!";


    hideMoles();


    /* SHOW GAME */

    game.panel.hidden = false;


    /* START */

    active = true;

    startClock();
    spawnMole();


    /* SCROLL TO GAME */

    requestAnimationFrame(() => {

      game.panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });
  }


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {

    const button =
      document.getElementById("whack-track");


    if (!button) {
      console.warn(
        "Whack-A-Track: #whack-track button not found."
      );
      return;
    }


    if (
      button.dataset.whackGameBound === "true"
    ) {
      return;
    }


    button.dataset.whackGameBound =
      "true";


    button.addEventListener(
      "click",
      startGame
    );

  }


  /* =========================================================
     WAIT FOR PAGE
     ========================================================= */

  if (
    document.readyState === "loading"
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
