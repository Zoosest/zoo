/*
=========================================================
GOATS
=========================================================

Prototype version 0.7

THE GAME:

- Goat starts on the RIGHT.
- Goat automatically walks LEFT.
- The LEFT side is a real cliff.
- The player controls only the HORN.
- The longer you wait, the closer the goat gets
  to the edge.
- Closer to the edge = more points.
- HORN stops the goat from walking and sends him
  sliding with momentum.
- If the goat crosses the edge:
    HE FALLS.
    SCORE = 0.
- No wall at the edge.
- No bouncing off the cliff.
- TRY AGAIN appears after every round.

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
        <span>CLIFF</span>
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
  STYLES
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


    /*
    =======================================================
    TITLE
    =======================================================
    */

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


    /*
    =======================================================
    SCORE
    =======================================================
    */

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
    ARENA
    =======================================================
    */

    .goat-arena {
      position: relative;

      width: 100%;
      height: 190px;

      margin: 16px auto;

      /*
        IMPORTANT:

        The arena is allowed to show the goat
        falling below the ground.
      */

      overflow: visible;

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

      left: 12%;
      right: 0;

      bottom: 28px;

      height: 4px;

      background: #d4af37;
    }


    /*
    =======================================================
    THE CLIFF

    There is NO WALL.

    The ground simply ends.

    =======================================================
    */

    .goat-cliff {
      position: absolute;

      left: 0;
      bottom: 0;

      width: 12%;
      height: 150px;

      background:
        linear-gradient(
          to bottom,
          #090509 0%,
          #090509 70%,
          #050305 70%,
          #050305 100%
        );

      color: #f5d76e;

      font-size: .55rem;

      letter-spacing: .08em;

      text-align: right;
    }


    /*
    =======================================================
    CLIFF EDGE LINE

    This is the actual danger line.

    =======================================================
    */

    .goat-cliff::after {
      content: "";

      position: absolute;

      top: 0;
      right: 0;

      width: 3px;
      height: 100%;

      background: #f5d76e;
    }


    .goat-cliff span {
      position: absolute;

      top: 8px;
      right: 6px;

      writing-mode: vertical-rl;

      color: #f5d76e;
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
    */

    .goat.fainted {
      transform: rotate(180deg) !important;
    }


    /*
    =======================================================
    FALLING GOAT
    =======================================================
    */

    .goat.falling {
      transition:
        bottom 0.8s ease-in,
        transform 0.8s ease-in;

      transform:
        rotate(180deg)
        rotate(90deg);
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
  ELEMENTS
  =========================================================
  */

  const arena =
    document.getElementById(
      "goat-arena"
    );

  const goat =
    document.getElementById(
      "goat"
    );

  const hornButton =
    document.getElementById(
      "goat-horn"
    );

  const resetButton =
    document.getElementById(
      "goat-reset"
    );

  const scoreDisplay =
    document.getElementById(
      "goat-score"
    );

  const message =
    document.getElementById(
      "goat-message"
    );


  /*
  =========================================================
  GAME VARIABLES
  =========================================================
  */

  let goatX = 0;

  let goatVelocity = 45;

  let goatFainted = false;

  let goatFalling = false;

  let gameOver = false;

  let lastTime = null;

  let animationFrame = null;


  /*
  =========================================================
  GAME SETTINGS
  =========================================================
  */

  const START_SPEED = 45;

  const HORN_BOOST = 90;

  const FRICTION = 0.985;

  const STOP_SPEED = 8;


  /*
  =========================================================
  RESET
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
      Start on RIGHT.
    */

    goatX =
      arenaWidth -
      50 -
      arenaWidth * 0.04;


    goatVelocity =
      START_SPEED;


    goatFainted = false;

    goatFalling = false;

    gameOver = false;

    lastTime = null;


    /*
      Restore goat.
    */

    goat.classList.remove(
      "fainted"
    );

    goat.classList.remove(
      "falling"
    );


    goat.style.left =
      "auto";

    goat.style.right =
      "4%";

    goat.style.bottom =
      "31px";

    goat.style.transform =
      "rotate(0deg)";


    /*
      Reset controls.
    */

    hornButton.disabled = false;

    resetButton.hidden = true;


    /*
      Reset message.
    */

    scoreDisplay.textContent =
      "0";

    message.textContent =
      "HORN THE GOAT!";

    message.classList.remove(
      "big"
    );


    /*
      Start.
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
      goatFalling ||
      gameOver
    ) {

      return;
    }


    goatFainted = true;


    /*
      Goat faints.
    */

    goat.classList.add(
      "fainted"
    );


    /*
      Give him momentum.
    */

    goatVelocity +=
      HORN_BOOST;


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

    /*
      The cliff begins at 12%.

      Goat's X position is measured
      from the LEFT side.
    */

    const cliffEdge =
      arena.clientWidth * 0.12;


    const distanceFromEdge =
      goatX - cliffEdge;


    /*
      Every pixel closer to the edge
      is worth more points.
    */

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
  FALL OFF CLIFF
  =========================================================
  */

  function fallOffCliff() {

    if (goatFalling || gameOver) {

      return;
    }


    goatFalling = true;

    gameOver = true;


    goatVelocity = 0;


    /*
      ZERO POINTS.
    */

    scoreDisplay.textContent =
      "0";


    message.classList.add(
      "big"
    );


    message.textContent =
      "💀 TOO LATE! THE GOAT FELL!";


    hornButton.disabled = true;

    resetButton.hidden = true;


    /*
      Move goat slightly into
      the empty space.

      Then drop him.
    */

    goat.classList.remove(
      "fainted"
    );

    goat.classList.add(
      "falling"
    );


    goat.style.left =
      `${goatX}px`;


    goat.style.right =
      "auto";


    requestAnimationFrame(
      function () {

        goat.style.bottom =
          "-90px";

      }
    );


    /*
      Show TRY AGAIN after
      the fall animation.
    */

    window.setTimeout(
      function () {

        resetButton.hidden =
          false;

      },
      900
    );
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


    message.textContent =
      `🐐 FINAL SCORE: ${score}!`;


    hornButton.disabled = true;

    resetButton.hidden = false;
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
      Prevent huge jumps.
    */

    delta =
      Math.min(
        delta,
        0.05
      );


    /*
    =======================================================
    BEFORE HORN

    Goat walks toward the cliff.
    =======================================================
    */

    if (!goatFainted) {

      goatX -=
        goatVelocity * delta;


      const cliffEdge =
        arena.clientWidth * 0.12;


      /*
        CROSSING THE EDGE
        = FALL
        = ZERO
      */

      if (
        goatX <= cliffEdge
      ) {

        goatX =
          cliffEdge;


        goat.style.left =
          `${goatX}px`;


        goat.style.right =
          "auto";


        fallOffCliff();

        return;
      }
    }


    /*
    =======================================================
    AFTER HORN

    Goat slides toward the edge.

    IMPORTANT:

    There is NO BOUNCE.

    =======================================================
    */

    else {

      goatX -=
        goatVelocity * delta;


      /*
        Friction gradually slows
        the goat down.
      */

      goatVelocity *=
        Math.pow(
          FRICTION,
          delta * 60
        );


      /*
      -------------------------------------------------------
      IF GOAT CROSSES EDGE

      Even after the horn, momentum can carry
      him over the cliff.

      This is the risk.
      -------------------------------------------------------
      */

      const cliffEdge =
        arena.clientWidth * 0.12;


      if (
        goatX <= cliffEdge
      ) {

        goatX =
          cliffEdge;


        goat.style.left =
          `${goatX}px`;


        goat.style.right =
          "auto";


        fallOffCliff();

        return;
      }


      /*
      -------------------------------------------------------
      GOAT STOPS
      -------------------------------------------------------
      */

      if (
        Math.abs(goatVelocity) <
        STOP_SPEED
      ) {

        goatVelocity = 0;

        finishGame();

        return;
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
      Slight bouncing while sliding.
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
    NEXT FRAME
    =======================================================
    */

    animationFrame =
      requestAnimationFrame(
        gameLoop
      );
  }


  /*
  =========================================================
  BUTTON EVENTS
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
