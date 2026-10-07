/*
=========================================================
GOATS
=========================================================

Prototype version 0.5

- Goat starts on the RIGHT.
- Goat automatically moves LEFT.
- The cliff/edge is on the LEFT.
- Press HORN.
- Goat faints and flips upside down.
- Goat continues moving with momentum.
- Goat bounces.
- Score is based on how close it gets to the LEFT edge.
- TRY AGAIN appears after EVERY completed round.

=========================================================
*/

(function () {

  "use strict";


  /*
  =========================================================
  GAME HTML
  =========================================================
  */

  const game = document.createElement("section");

  game.id = "goat-game-container";

  game.hidden = true;

  game.innerHTML = `
    <div class="goat-game-title">
      🐐 GOATS
    </div>

    <div class="goat-game-subtitle">
      Get as close to the edge as possible.
    </div>

    <div class="goat-score">
      Score: <span id="goat-score">0</span>
    </div>

    <div class="goat-arena" id="goat-arena">

      <div class="goat-ground"></div>

      <div class="goat-cliff">
        <span>EDGE</span>
      </div>

      <div
        class="goat"
        id="goat"
      >🐐</div>

    </div>

    <button
      class="goat-horn"
      id="goat-horn"
      type="button"
    >
      📯 HORN
    </button>

    <div
      class="goat-message"
      id="goat-message"
    >
      HORN THE GOAT!
    </div>

    <button
      class="goat-reset"
      id="goat-reset"
      type="button"
      hidden
    >
      TRY AGAIN
    </button>
  `;

  document.body.appendChild(game);


  /*
  =========================================================
  CENTERED POPUP
  =========================================================
  */

  game.style.position = "fixed";
  game.style.left = "50%";
  game.style.top = "50%";
  game.style.transform = "translate(-50%, -50%)";
  game.style.zIndex = "2000";
  game.style.width = "min(94vw, 700px)";
  game.style.maxHeight = "90vh";
  game.style.overflowY = "auto";
  game.style.margin = "0";


  /*
  =========================================================
  GAME STYLES
  =========================================================
  */

  const style = document.createElement("style");

  style.textContent = `

    #goat-game-container {
      background: #120b18;
      border: 1px solid #d4af37;
      border-radius: 12px;
      padding: 18px 12px 22px;
      text-align: center;
      color: #c084fc;
      font-family: Georgia, "Times New Roman", serif;
      box-shadow: 0 15px 50px rgba(0,0,0,.9);
    }

    #goat-game-container[hidden] {
      display: none !important;
    }

    .goat-game-title {
      color: #f5d76e;
      font-size: 1.5rem;
      font-weight: bold;
      letter-spacing: .08em;
    }

    .goat-game-subtitle {
      margin-top: 4px;
      color: #b9a8c5;
      font-size: .78rem;
    }

    .goat-score {
      margin-top: 10px;
      color: #e0aaff;
      font-size: .9rem;
    }

    #goat-score {
      color: #f5d76e;
      font-weight: bold;
    }


    /*
    =======================================================
    GAME BOARD
    =======================================================
    */

    .goat-arena {
      position: relative;
      width: 100%;
      height: 190px;
      margin: 16px auto;
      overflow: hidden;

      background:
        linear-gradient(
          to bottom,
          #21102e 0%,
          #090509 72%,
          #050305 72%,
          #050305 100%
        );

      border: 1px solid #3b1d50;
      border-radius: 8px;
    }


    /*
    =======================================================
    GROUND
    =======================================================
    */

    .goat-ground {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 28px;
      height: 4px;
      background: #d4af37;
    }


    /*
    =======================================================
    LEFT-SIDE CLIFF
    =======================================================
    */

    .goat-cliff {
      position: absolute;
      left: 0;
      bottom: 0;

      width: 12%;
      height: 150px;

      border-right: 3px solid #f5d76e;

      background: #090509;

      color: #f5d76e;

      font-size: .55rem;

      letter-spacing: .08em;

      text-align: right;
    }

    .goat-cliff span {
      position: absolute;
      top: 8px;
      right: 5px;

      writing-mode: vertical-rl;
    }


    /*
    =======================================================
    GOAT
    =======================================================
    */

    .goat {
      position: absolute;

      right: 4%;
      bottom: 31px;

      width: 50px;
      height: 50px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 2.5rem;

      line-height: 1;

      transform-origin: center center;

      user-select: none;

      pointer-events: none;

      z-index: 5;
    }


    /*
    =======================================================
    FAINTED GOAT
    =======================================================

    180 degrees = upside down.
    */

    .goat.fainted {
      transform: rotate(180deg) !important;
    }


    /*
    =======================================================
    BUTTONS
    =======================================================
    */

    .goat-horn,
    .goat-reset {
      border: 1px solid #d4af37;

      border-radius: 999px;

      padding: 10px 18px;

      color: #fff;

      background: #55208a;

      font-family:
        Georgia,
        "Times New Roman",
        serif;

      font-size: .9rem;

      cursor: pointer;
    }

    .goat-horn:hover,
    .goat-reset:hover {
      background: #7e35bc;
    }

    .goat-horn:disabled {
      opacity: .45;
      cursor: not-allowed;
    }


    /*
    =======================================================
    MESSAGE
    =======================================================
    */

    .goat-message {
      min-height: 22px;

      margin-top: 10px;

      color: #b9a8c5;

      font-size: .75rem;
    }

    .goat-message.big {
      color: #f5d76e;

      font-size: .95rem;

      font-weight: bold;
    }

  `;

  document.head.appendChild(style);


  /*
  =========================================================
  GAME ELEMENTS
  =========================================================
  */

  const arena =
    document.getElementById("goat-arena");

  const goat =
    document.getElementById("goat");

  const hornButton =
    document.getElementById("goat-horn");

  const resetButton =
    document.getElementById("goat-reset");

  const scoreDisplay =
    document.getElementById("goat-score");

  const message =
    document.getElementById("goat-message");


  /*
  =========================================================
  GAME VARIABLES
  =========================================================
  */

  let goatX = 0;

  let goatVelocity = 45;

  let goatFainted = false;

  let gameOver = false;

  let lastTime = null;

  let bounceCount = 0;

  let animationFrame = null;


  const START_SPEED = 45;

  const BOUNCE = 0.55;

  const MAX_BOUNCES = 3;


  /*
  =========================================================
  RESET GAME
  =========================================================
  */

  function resetGame() {

    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

    }


    const arenaWidth =
      arena.clientWidth;


    /*
      Start near the RIGHT side.
    */

    goatX =
      arenaWidth -
      50 -
      arenaWidth * 0.04;


    goatVelocity =
      START_SPEED;


    goatFainted = false;

    gameOver = false;

    bounceCount = 0;

    lastTime = null;


    /*
      Restore normal goat.
    */

    goat.classList.remove(
      "fainted"
    );

    goat.style.left = "auto";

    goat.style.right = "4%";

    goat.style.bottom = "31px";

    goat.style.transform =
      "rotate(0deg)";


    /*
      Reset buttons.
    */

    hornButton.disabled = false;

    resetButton.hidden = true;


    /*
      Reset score/message.
    */

    scoreDisplay.textContent =
      "0";

    message.textContent =
      "HORN THE GOAT!";

    message.classList.remove(
      "big"
    );


    /*
      Start a new round.
    */

    animationFrame =
      requestAnimationFrame(
        gameLoop
      );
  }


  /*
  =========================================================
  HORN
  =========================================================
  */

  function horn() {

    if (
      goatFainted ||
      gameOver
    ) {

      return;
    }


    goatFainted = true;


    /*
      Flip goat completely upside down.
    */

    goat.classList.add(
      "fainted"
    );


    /*
      Give goat extra momentum.
    */

    goatVelocity += 90;


    hornButton.disabled = true;


    message.textContent =
      "🐐 BONK! THE GOAT IS OUT COLD!";
  }


  /*
  =========================================================
  SCORE
  =========================================================
  */

  function calculateScore() {

    const cliffEnd =
      arena.clientWidth * 0.12;


    const distanceFromEdge =
      goatX - cliffEnd;


    let score =
      Math.round(
        1000 -
        Math.max(
          0,
          distanceFromEdge
        ) * 5
      );


    score =
      Math.max(
        0,
        Math.min(
          1000,
          score
        )
      );


    return score;
  }


  /*
  =========================================================
  GAME OVER
  =========================================================
  */

  function finishGame() {

    gameOver = true;

    goatVelocity = 0;


    const score =
      calculateScore();


    scoreDisplay.textContent =
      score;


    message.classList.add(
      "big"
    );


    /*
    -------------------------------------------------------
    GOAT WENT OVER THE EDGE
    -------------------------------------------------------
    */

    if (
      goatX <=
      arena.clientWidth * 0.12
    ) {

      message.textContent =
        "💀 THE GOAT WENT OVER THE EDGE!";

      scoreDisplay.textContent =
        "0";

    }


    /*
    -------------------------------------------------------
    GOAT STOPPED SAFELY
    -------------------------------------------------------
    */

    else {

      message.textContent =
        `🐐 FINAL SCORE: ${score}!`;
    }


    /*
    =======================================================
    TRY AGAIN ALWAYS APPEARS
    =======================================================
    */

    resetButton.hidden = false;

    hornButton.disabled = true;
  }


  /*
  =========================================================
  GAME LOOP
  =========================================================
  */

  function gameLoop(timestamp) {

    if (gameOver) {

      return;
    }


    if (lastTime === null) {

      lastTime = timestamp;
    }


    let delta =
      (timestamp - lastTime) / 1000;


    lastTime = timestamp;


    /*
      Prevent giant jumps.
    */

    delta =
      Math.min(
        delta,
        0.05
      );


    /*
    =======================================================
    BEFORE THE HORN

    Goat moves LEFT.
    =======================================================
    */

    if (!goatFainted) {

      goatX -=
        goatVelocity * delta;


      const cliffEdge =
        arena.clientWidth * 0.12;


      if (
        goatX <= cliffEdge
      ) {

        goatX =
          cliffEdge;

        finishGame();

        return;
      }
    }


    /*
    =======================================================
    AFTER THE HORN

    Goat keeps moving LEFT.
    =======================================================
    */

    else {

      goatX -=
        goatVelocity * delta;


      /*
        Gradually slow the goat.
      */

      goatVelocity *=
        Math.pow(
          0.985,
          delta * 60
        );


      /*
        Bounce in dangerous area.
      */

      if (
        goatX <=
        arena.clientWidth * 0.18
      ) {

        if (
          bounceCount <
          MAX_BOUNCES
        ) {

          goatVelocity *=
            -BOUNCE;

          bounceCount++;

          message.textContent =
            "BOING!";

        }


        else {

          finishGame();

          return;
        }
      }


      /*
        Prevent goat from leaving
        the RIGHT side.
      */

      const rightLimit =
        arena.clientWidth - 50;


      if (
        goatX >
        rightLimit
      ) {

        goatX =
          rightLimit;

        goatVelocity =
          -Math.abs(
            goatVelocity
          ) * BOUNCE;
      }
    }


    /*
    =======================================================
    DRAW GOAT
    =======================================================
    */

    goat.style.left =
      `${goatX}px`;

    goat.style.right =
      "auto";


    /*
      Little bounce effect after fainting.
    */

    if (goatFainted) {

      const bounceHeight =
        Math.abs(
          Math.sin(
            goatX * 0.08
          )
        ) * 12;


      goat.style.bottom =
        `${31 + bounceHeight}px`;
    }


    /*
    =======================================================
    KEEP PLAYING
    =======================================================
    */

    animationFrame =
      requestAnimationFrame(
        gameLoop
      );
  }


  /*
  =========================================================
  BUTTONS
  =========================================================
  */

  hornButton.addEventListener(
    "click",
    horn
  );


  resetButton.addEventListener(
    "click",
    resetGame
  );


  /*
  =========================================================
  GOAT SONG DETECTOR
  =========================================================
  */

  let goatWasPlaying = false;


  function checkGoatSong() {

    const nowPlaying =
      document.getElementById(
        "now-playing"
      );


    if (!nowPlaying) {

      return;
    }


    const text =
      nowPlaying.textContent || "";


    const goatSongPlaying =
      text.includes("6 6 6 7");


    /*
      Goat song just started.
    */

    if (
      goatSongPlaying &&
      !goatWasPlaying
    ) {

      goatWasPlaying = true;

      game.hidden = false;

      resetGame();

      return;
    }


    /*
      Goat song ended.
    */

    if (
      !goatSongPlaying &&
      goatWasPlaying
    ) {

      goatWasPlaying = false;

      game.hidden = true;


      if (animationFrame) {

        cancelAnimationFrame(
          animationFrame
        );

        animationFrame = null;
      }


      return;
    }
  }


  /*
  =========================================================
  WATCH NOW PLAYING
  =========================================================
  */

  window.setInterval(
    checkGoatSong,
    250
  );


  /*
  =========================================================
  INITIAL STATE
  =========================================================
  */

  game.hidden = true;

})();
