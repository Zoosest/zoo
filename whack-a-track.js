(() => {
"use strict";
/* =========================================================
WHACK-A-TRACK
========================================================= */
const TRACK_HEALTH = 24;
const GAME_DURATION = 80;
const MOLE_VISIBLE_MS = 660;
const MOLE_INTERVAL_MS = 1400;
const DUCK_IMAGE = "./assets/duck.png";
const DUCK_HIT_IMAGE = "./assets/duck-hit.png";
const WHACK_IMAGE = "./assets/whack.png";
const REMOVED_TRACKS_KEY = "rizneyWhackedTracks";
let gameEl = null;
let boardEl = null;
let messageEl = null;
let healthFillEl = null;
let timerEl = null;
let activeHole = null;
let activeDuck = null;
let activeWhack = null;
let health = TRACK_HEALTH;
let timeLeft = GAME_DURATION;
let gameRunning = false;
let gameTimer = null;
let moleTimer = null;
/* =========================================================
HELPERS
========================================================= */
const $ = selector =>
document.querySelector(selector);
function getCurrentTrack() {
if (
  typeof currentIndex === "undefined" ||
  currentIndex < 0
) {
  return null;
}

return currentIndex;

}
function getWhackedTracks() {
try {

  return JSON.parse(
    localStorage.getItem(
      REMOVED_TRACKS_KEY
    ) || "[]"
  );

} catch {

  return [];
}

}
function saveWhackedTrack(index) {
const tracks =
  getWhackedTracks();

if (!tracks.includes(index)) {

  tracks.push(index);

  localStorage.setItem(
    REMOVED_TRACKS_KEY,
    JSON.stringify(tracks)
  );
}

}
function isWhacked(index) {
return getWhackedTracks()
  .includes(index);

}
/* =========================================================
GAME HTML
========================================================= */
function createGame() {
if (gameEl) {
  return;
}

gameEl =
  document.createElement("section");

gameEl.id =
  "whack-a-track-game";

gameEl.innerHTML = `

  <style>

    #whack-a-track-game {
      width:100%;
      margin:0;
      padding:0;
      background:#000;
      border-top:0;
      position:relative;
    }

    .wat-inner {
      width:min(100%,620px);
      margin:0 auto;
      padding:0 10px 18px;
      background:#000;
    }

    .wat-title {
      margin:0;
      padding:12px 8px 8px;
      color:#f5d76e;
      text-align:center;
      font-size:1.15rem;
      border-bottom:1px solid #d4af37;
    }

    .wat-status {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
      padding:8px 4px;
      color:#e0aaff;
      font-family:Arial,sans-serif;
      font-size:.75rem;
    }

    .wat-health {
      flex:1;
      height:10px;
      border:1px solid #d4af37;
      border-radius:999px;
      overflow:hidden;
      background:#160c1c;
    }

    .wat-health-fill {
      width:100%;
      height:100%;
      background:#e0aaff;
      transition:width .15s linear;
    }

    .wat-board {
      position:relative;
      width:100%;
      max-width:500px;
      height:220px;
      margin:0 auto;
      background-color:#55208a;

      background-image:
        url("./assets/holes.png");

      background-repeat:no-repeat;
      background-position:center;
      background-size:100% 100%;

      overflow:hidden;
    }

    .wat-hole {
      position:absolute;

      width:76px;
      height:76px;

      margin:0;
      padding:0;

      background:transparent;
      border:0;
      border-radius:50%;

      appearance:none;
      -webkit-appearance:none;

      cursor:pointer;

      overflow:visible;

      z-index:5;
    }

    .wat-hole:focus {
      outline:none;
    }

    .wat-duck {
      position:absolute;

      width:72px;
      height:72px;

      left:50%;
      bottom:0;

      transform:
        translateX(-50%)
        scaleY(.94);

      object-fit:contain;

      pointer-events:none;

      z-index:10;

      transform-origin:
        center bottom;
    }

    .wat-duck-hit {
      position:absolute;

      width:72px;
      height:72px;

      left:50%;
      bottom:0;

      transform:
        translateX(-50%)
        scaleY(.94);

      object-fit:contain;

      pointer-events:none;

      z-index:11;

      transform-origin:
        center bottom;
    }

    .wat-whack {
      position:absolute;

      width:90px;
      height:90px;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%)
        rotate(-8deg);

      object-fit:contain;

      pointer-events:none;

      z-index:20;
    }

    .wat-controls {
      display:flex;
      justify-content:center;
      gap:8px;
      padding:10px 0 0;
    }

    .wat-controls button {
      border:1px solid #d4af37;
      border-radius:999px;
      padding:8px 13px;
      color:#fff;
      background:#55208a;
      font:inherit;
      font-size:.78rem;
      cursor:pointer;
    }

    .wat-controls button:hover {
      background:#7e35bc;
    }

    .wat-message {
      min-height:24px;
      padding:8px 4px 0;
      color:#e0aaff;
      text-align:center;
      font-family:Arial,sans-serif;
      font-size:.8rem;
    }

    @media(max-width:500px) {

      .wat-inner {
        padding-left:6px;
        padding-right:6px;
      }

      .wat-board {
        height:190px;
      }

      .wat-hole {
        width:62px;
        height:62px;
      }

      .wat-duck,
      .wat-duck-hit {
        width:60px;
        height:60px;
      }

      .wat-whack {
        width:76px;
        height:76px;
      }
    }

  </style>


  <div class="wat-inner">

    <h2 class="wat-title">
      🦆 WHACK-A-TRACK WITH A QUACK
    </h2>

    <div class="wat-status">

      <span>
        TRACK
      </span>

      <div class="wat-health">
        <div
          class="wat-health-fill"
        ></div>
      </div>

      <span class="wat-timer">
        80
      </span>

    </div>


    <div class="wat-board">

      <button
        class="wat-hole"
        type="button"
        aria-label="Whack duck"
      ></button>

      <button
        class="wat-hole"
        type="button"
        aria-label="Whack duck"
      ></button>

      <button
        class="wat-hole"
        type="button"
        aria-label="Whack duck"
      ></button>

      <button
        class="wat-hole"
        type="button"
        aria-label="Whack duck"
      ></button>

      <button
        class="wat-hole"
        type="button"
        aria-label="Whack duck"
      ></button>

      <button
        class="wat-hole"
        type="button"
        aria-label="Whack duck"
      ></button>

    </div>


    <div class="wat-controls">

      <button
        class="wat-start"
        type="button"
      >
        Start Game
      </button>

      <button
        class="wat-end"
        type="button"
      >
        End Game
      </button>

    </div>


    <div class="wat-message"></div>

  </div>
`;


/*
   IMPORTANT:

   The game is inserted immediately after
   the sticky toolbar.

   There is NO scrollIntoView().
*/

const controls =
  document.querySelector(
    ".controls"
  );

if (controls) {

  controls.insertAdjacentElement(
    "afterend",
    gameEl
  );

} else {

  document
    .querySelector("main")
    ?.prepend(gameEl);

}


boardEl =
  gameEl.querySelector(
    ".wat-board"
  );

messageEl =
  gameEl.querySelector(
    ".wat-message"
  );

healthFillEl =
  gameEl.querySelector(
    ".wat-health-fill"
  );

timerEl =
  gameEl.querySelector(
    ".wat-timer"
  );


setupHoles();

gameEl
  .querySelector(".wat-start")
  .addEventListener(
    "click",
    startGame
  );

gameEl
  .querySelector(".wat-end")
  .addEventListener(
    "click",
    endGame
  );


gameEl.style.display =
  "none";

}
/* =========================================================
HOLES
========================================================= */
function setupHoles() {
const holes =
  [...boardEl.querySelectorAll(
    ".wat-hole"
  )];

const positions = [

  { left:21, top:17 },
  { left:50, top:17 },
  { left:79, top:17 },

  { left:21, top:55 },
  { left:50, top:55 },
  { left:79, top:55 }

];


holes.forEach(
  (hole,index) => {

    const position =
      positions[index];

    hole.style.left =
      `calc(${position.left}% - 38px)`;

    hole.style.top =
      `calc(${position.top}% - 38px)`;


    hole.addEventListener(
      "click",
      () => {

        if (
          gameRunning &&
          hole === activeHole
        ) {

          hitDuck(hole);
        }

      }
    );

  }
);

}
/* =========================================================
DUCK
========================================================= */
function showDuck(hole) {
hideDuck();

activeHole = hole;

const duck =
  document.createElement("img");

duck.className =
  "wat-duck";

duck.src =
  DUCK_IMAGE;

duck.alt =
  "";

hole.appendChild(duck);

activeDuck = duck;


/*
   Simple squeeze/pop animation.
*/

duck.animate(

  [
    {
      transform:
        "translateX(-50%) scaleY(0)"
    },

    {
      transform:
        "translateX(-50%) scaleY(1.08)"
    },

    {
      transform:
        "translateX(-50%) scaleY(.94)"
    }

  ],

  {
    duration:180,
    easing:"ease-out"
  }

);


moleTimer =
  setTimeout(
    () => {

      hideDuck();

    },
    MOLE_VISIBLE_MS
  );

}
function hideDuck() {
if (moleTimer) {

  clearTimeout(
    moleTimer
  );

  moleTimer = null;
}


if (activeDuck) {

  activeDuck.remove();

  activeDuck = null;
}


activeHole = null;

}
/* =========================================================
HIT DUCK
========================================================= */
function hitDuck(hole) {
if (!activeDuck) {
  return;
}


clearTimeout(
  moleTimer
);

moleTimer = null;


const rect =
  hole.getBoundingClientRect();

const boardRect =
  boardEl.getBoundingClientRect();


activeDuck.remove();

activeDuck = null;


const hitDuck =
  document.createElement("img");

hitDuck.className =
  "wat-duck-hit";

hitDuck.src =
  DUCK_HIT_IMAGE;

hitDuck.alt =
  "";


hitDuck.style.left =
  `${rect.left - boardRect.left + rect.width / 2}px`;

hitDuck.style.top =
  `${rect.top - boardRect.top + rect.height / 2}px`;

hitDuck.style.bottom =
  "auto";

hitDuck.style.transform =
  "translate(-50%,-50%)";


boardEl.appendChild(
  hitDuck
);


const whack =
  document.createElement("img");

whack.className =
  "wat-whack";

whack.src =
  WHACK_IMAGE;

whack.alt =
  "";


whack.style.left =
  `${rect.left - boardRect.left + rect.width / 2}px`;

whack.style.top =
  `${rect.top - boardRect.top + rect.height / 2}px`;


boardEl.appendChild(
  whack
);


/*
   Remove the hit artwork shortly after
   the successful hit.
*/

setTimeout(
  () => {

    hitDuck.remove();
    whack.remove();

  },
  420
);


health--;

updateHealth();


if (health <= 0) {

  finishGame(
    "win"
  );

  return;
}


/*
   Immediately choose another hole.
*/

setTimeout(
  spawnDuck,
  80
);

}
/* =========================================================
SPAWN
========================================================= */
function spawnDuck() {
if (!gameRunning) {
  return;
}


const holes =
  [...boardEl.querySelectorAll(
    ".wat-hole"
  )];


if (!holes.length) {
  return;
}


const available =
  holes.filter(
    hole =>
      hole !== activeHole
  );


const choices =
  available.length
    ? available
    : holes;


const hole =
  choices[
    Math.floor(
      Math.random() *
      choices.length
    )
  ];


showDuck(hole);

}
/* =========================================================
HEALTH
========================================================= */
function updateHealth() {
const percent =
  Math.max(
    0,
    (health / TRACK_HEALTH) * 100
  );

healthFillEl.style.width =
  `${percent}%`;

}
/* =========================================================
START GAME
========================================================= */
function startGame() {
const track =
  getCurrentTrack();


if (
  track === null
) {

  messageEl.textContent =
    "Play a song first — the Intro cannot be whacked.";

  return;
}


if (
  isWhacked(track)
) {

  messageEl.textContent =
    "🚧 This track is already WHACKED! Road closed.";

  return;
}


endGame(true);


health =
  TRACK_HEALTH;

timeLeft =
  GAME_DURATION;

gameRunning =
  true;


updateHealth();

timerEl.textContent =
  timeLeft;

messageEl.textContent =
  "";


/*
   Restart the currently playing
   YouTube track.
*/

if (
  typeof player !== "undefined" &&
  player &&
  typeof player.seekTo === "function"
) {

  player.seekTo(
    0,
    true
  );

  player.playVideo();
}


spawnDuck();


moleTimer =
  setInterval(
    () => {

      if (
        gameRunning &&
        !activeDuck
      ) {

        spawnDuck();
      }

    },
    MOLE_INTERVAL_MS
  );


gameTimer =
  setInterval(
    () => {

      timeLeft--;

      timerEl.textContent =
        timeLeft;


      if (
        timeLeft <= 0
      ) {

        finishGame(
          "time"
        );
      }

    },
    1000
  );

}
/* =========================================================
END GAME
========================================================= */
function endGame(silent = false) {
gameRunning =
  false;


if (gameTimer) {

  clearInterval(
    gameTimer
  );

  gameTimer = null;
}


if (moleTimer) {

  clearInterval(
    moleTimer
  );

  moleTimer = null;
}


hideDuck();


if (!silent) {

  messageEl.textContent =
    "Game ended.";
}

}
/* =========================================================
FINISH GAME
========================================================= */
function finishGame(result) {
const track =
  getCurrentTrack();


endGame(true);


if (
  result === "win" &&
  track !== null
) {

  saveWhackedTrack(
    track
  );


  messageEl.textContent =
    "🚧 TRACK WHACKED! Road closed!";


  markWhackedRows();


  /*
     Stop the YouTube track.
  */

  if (
    typeof player !== "undefined" &&
    player &&
    typeof player.stopVideo === "function"
  ) {

    player.stopVideo();
  }

} else {

  messageEl.textContent =
    "Time's up! The track escaped. 🦆";
}

}
/* =========================================================
MARK CLOSED SONGS
========================================================= */
function markWhackedRows() {
const rows =
  document.querySelectorAll(
    "#song-list .song"
  );


rows.forEach(
  (row,index) => {

    if (
      isWhacked(index)
    ) {

      row.classList.add(
        "wat-track-closed"
      );


      const button =
        row.querySelector(
          ".play"
        );


      if (button) {

        button.textContent =
          "🚧 WHACKED!";

        button.disabled =
          true;

        button.title =
          "Road closed — this track has been whacked.";
      }


      const small =
        row.querySelector(
          "small"
        );


      if (small) {

        small.textContent =
          "ROAD CLOSED";
      }
    }

  }
);

}
/* =========================================================
PREVENT PLAYING CLOSED TRACKS
========================================================= */
function protectClosedRows() {
const list =
  document.querySelector(
    "#song-list"
  );


if (!list) {
  return;
}


list.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".play"
      );


    if (!button) {
      return;
    }


    const row =
      button.closest(
        ".song"
      );


    if (!row) {
      return;
    }


    const rows =
      [...list.querySelectorAll(
        ".song"
      )];

    const index =
      rows.indexOf(row);


    if (
      isWhacked(index)
    ) {

      event.preventDefault();
      event.stopImmediatePropagation();

      return;
    }

  },
  true
);

}
/* =========================================================
WHACK-A-TRACK TOOLBAR BUTTON
========================================================= */
function connectToolbarButton() {
const button =
  document.getElementById(
    "whack-track"
  );


if (!button) {
  return;
}


button.addEventListener(
  "click",
  () => {

    if (!gameEl) {
      createGame();
    }


    if (gameEl) {

      /*
         NO SCROLLING.

         Just reveal the game directly
         underneath the toolbar.
      */

      gameEl.style.display =
        "block";
    }

  }
);

}
/* =========================================================
INITIALIZE
========================================================= */
function initialize() {
createGame();

protectClosedRows();

markWhackedRows();

connectToolbarButton();

}
if (
document.readyState ===
"loading"
) {
document.addEventListener(
  "DOMContentLoaded",
  initialize
);

} else {
initialize();

}
})();
