
/*
=========================================================
GOATS
=========================================================

Prototype version 0.1

The idea:
- Goat starts on the left.
- Goat automatically moves toward the cliff.
- Player presses HORN.
- Goat faints.
- Fainted goat keeps moving because of momentum.
- Goat bounces if it hits the ground.
- The closer to the cliff edge, the better the score.

This is intentionally simple.
We can make it prettier later.
=========================================================
*/

(function () {

  // Prevent the game from being created twice.
  if (document.getElementById('goat-game')) {
    return;
  }

  /*
  =========================================================
  GAME HTML
  =========================================================
  */

  const game = document.createElement('section');

  game.id = 'goat-game';

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
  CENTER THE GAME AS A POPUP
  =========================================================
  */

  game.style.position = 'fixed';
  game.style.left = '50%';
  game.style.top = '50%';
  game.style.transform = 'translate(-50%, -50%)';
  game.style.zIndex = '2000';
  game.style.width = 'min(94vw, 700px)';
  game.style.maxHeight = '90vh';
  game.style.overflowY = 'auto';
  game.style.margin = '0';


  /*
  =========================================================
  GAME STYLES
  =========================================================
  */

  const style = document.createElement('style');

  style.textContent = `

    #goat-game {
      background: #120b18;
      border: 1px solid #d4af37;
      border-radius: 12px;
      padding: 18px 12px 22px;
      text-align: center;
      color: #c084fc;
      font-family: Georgia, "Times New Roman", serif;
      box-shadow: 0 15px 50px rgba(0,0,0,.9);
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

    .goat-ground {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 28px;
      height: 4px;
      background: #d4af37;
    }

    .goat-cliff {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 12%;
      height: 150px;
      border-left: 3px solid #f5d76e;
      background: #090509;
      color: #f5d76e;
      font-size: .55rem;
      letter-spacing: .08em;
      text-align: left;
    }

    .goat-cliff span {
      position: absolute;
      top: 8px;
      left: 5px;
      writing-mode: vertical-rl;
    }

    .goat {
      position: absolute;
      left: 4%;
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

    .goat.fainted {
      transform: rotate(90deg);
    }

    .goat-horn,
    .goat-reset {
      border: 1px solid #d4af37;
      border-radius: 999px;
      padding: 10px 18px;
      color: #fff;
      background: #55208a;
      font-family: Georgia, "Times New Roman", serif;
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
  GAME VARIABLES
  =========================================================
  */

  const arena = document.getElementById('goat-arena');
  const goat = document.getElementById('goat');
  const hornButton = document.getElementById('goat-horn');
  const resetButton = document.getElementById('goat-reset');
  const scoreDisplay = document.getElementById('goat-score');
  const message = document.getElementById('goat-message');

  let goatX = 0;
  let goatVelocity = 0;

  let goatFainted = false;
  let gameOver = false;

  let lastTime = null;

  const START_SPEED = 45;

  const GRAVITY = 900;

  const BOUNCE = 0.55;

  const MAX_BOUNCES = 3;

  let bounceCount = 0;


  /*
  =========================================================
  RESET GAME
  =========================================================
  */

  function resetGame() {

    goatX = 0;

    goatVelocity = START_SPEED;

    goatFainted = false;

    gameOver = false;

    bounceCount = 0;

    lastTime = null;

    goat.classList.remove('fainted');

    goat.style.left = '4%';

    goat.style.bottom = '31px';

    goat.style.transform = 'rotate(0deg)';

    hornButton.disabled = false;

    resetButton.hidden = true;

    scoreDisplay.textContent = '0';

    message.textContent = 'HORN THE GOAT!';

    message.classList.remove('big');

    requestAnimationFrame(gameLoop);
  }


  /*
  =========================================================
  HORN
  =========================================================
  */

  function horn() {

    if (goatFainted || gameOver) {
      return;
    }

    goatFainted = true;

    goat.classList.add('fainted');

    /*
      Give the goat some extra momentum when the horn
      is pressed.
    */

    goatVelocity += 90;

    hornButton.disabled = true;

    message.textContent =
      '🐐 BONK! THE GOAT IS OUT COLD!';

  }


  /*
  =========================================================
  SCORE
  =========================================================
  */

  function calculateScore() {

    const arenaWidth = arena.clientWidth;

    const cliffStart =
      arenaWidth * 0.88;

    const distanceFromEdge =
      cliffStart - goatX;

    /*
      The closer to the edge, the higher the score.
    */

    let score =
      Math.round(
        1000 -
        Math.max(0, distanceFromEdge) * 5
      );

    score =
      Math.max(
        0,
        Math.min(1000, score)
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

    scoreDisplay.textContent = score;

    message.classList.add('big');

    if (goatX >= arena.clientWidth * 0.88) {

      message.textContent =
        '💀 THE GOAT WENT OVER THE EDGE!';

      scoreDisplay.textContent = '0';

    } else {

      message.textContent =
        `🐐 FINAL SCORE: ${score}!`;

    }

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
      Prevent a giant jump if the browser pauses
      the animation for a moment.
    */

    delta =
      Math.min(delta, 0.05);


    /*
    ---------------------------------------------------------
    BEFORE THE HORN
    ---------------------------------------------------------
    */

    if (!goatFainted) {

      goatX +=
        goatVelocity * delta;

      const maxX =
        arena.clientWidth * 0.88 - 50;

      if (goatX >= maxX) {

        goatX = maxX;

        finishGame();

        return;
      }

    }


    /*
    ---------------------------------------------------------
    AFTER THE HORN
    ---------------------------------------------------------
    */

    else {

      goatX +=
        goatVelocity * delta;

      /*
        Gradually slow the goat down.
      */

      goatVelocity *=
        Math.pow(0.985, delta * 60);

      /*
        A little bounce effect.
        This is intentionally crude for now.
      */

      if (
        goatX >=
        arena.clientWidth * 0.82
      ) {

        if (
          bounceCount <
          MAX_BOUNCES
        ) {

          goatVelocity *=
            -BOUNCE;

          bounceCount++;

          message.textContent =
            'BOING!';

        } else {

          finishGame();

          return;
        }
      }

      /*
        If the goat is moving backward after a bounce,
        don't let it leave the left side.
      */

      if (goatX < 0) {

        goatX = 0;

        goatVelocity =
          Math.abs(goatVelocity) *
          BOUNCE;
      }

    }


    /*
    ---------------------------------------------------------
    DRAW GOAT
    ---------------------------------------------------------
    */

    goat.style.left =
      `${goatX}px`;


    /*
      Slightly raise the goat during its bouncing motion.
      Nothing fancy yet.
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
    ---------------------------------------------------------
    KEEP PLAYING
    ---------------------------------------------------------
    */

    requestAnimationFrame(gameLoop);
  }


  /*
  =========================================================
  BUTTON EVENTS
  =========================================================
  */

  hornButton.addEventListener(
    'click',
    horn
  );

  resetButton.addEventListener(
    'click',
    resetGame
  );


  /*
  =========================================================
  START
  =========================================================
  */

  resetGame();

})();
