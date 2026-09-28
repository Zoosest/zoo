(() => {
"use strict";
/* =========================================================
WHACK-A-TRACK WITH A QUACK
========================================================= */
const TRACK_HEALTH = 24;
const GAME_DURATION = 80;
const MOLE_VISIBLE_MS = 660;
const MOLE_INTERVAL_MS = 1400;
const DUCK_IMAGE = "./assets/duck.png";
const DUCK_HIT_IMAGE = "./assets/duck-hit.png";
const WHACK_IMAGE = "./assets/whack.png";
const REMOVED_TRACKS_KEY =
"rizneyWhackedTracks";
/* =========================================================
STATE
========================================================= */
let gameActive = false;
let gameTrackIndex = null;
let health = TRACK_HEALTH;
let timeLeft = GAME_DURATION;
let timer = null;
let moleTimer = null;
let activeHole = null;
let activeDuck = null;
let gameEl = null;
let boardEl = null;
let healthEl = null;
let timerEl = null;
let statusEl = null;
/* =========================================================
HELPERS
========================================================= */
const $ = selector =>
document.querySelector(selector);
function getWhackedTracks() {
try {
return JSON.parse(
localStorage.getItem(
REMOVED_TRACKS_KEY
)
) || [];
} catch {
return [];
}
}
function saveWhackedTracks(tracks) {
localStorage.setItem(
REMOVED_TRACKS_KEY,
JSON.stringify(tracks)
);
}
function isTrackWhacked(index) {
return getWhackedTracks()
.includes(index);
}
/* =========================================================
STYLES
========================================================= */
function addStyles() {
if (
  document.getElementById(
    "whack-a-track-styles"
  )
) {
  return;
}

const style =
  document.createElement("style");

style.id =
  "whack-a-track-styles";

style.textContent = `

  /* =====================================================
     GAME WRAPPER
     ===================================================== */

  #whack-a-track-game {
    width: min(100%, 900px);
    margin: 25px auto;
    padding: 16px;
    background: #120b18;
    border: 1px solid #d4af37;
    border-radius: 12px;
    text-align: center;
  }


  #whack-a-track-game h2 {
    margin-top: 0;
    color: #f5d76e;
  }


  /* =====================================================
     GAME INFO
     ===================================================== */

  #whack-a-track-game .wat-info {
    display: flex;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-bottom: 12px;
    color: #e0aaff;
    font-family: Georgia,
      "Times New Roman",
      serif;
    font-size: .9rem;
  }


  #whack-a-track-game .wat-health {
    color: #f5d76e;
  }


  #whack-a-track-game .wat-time {
    color: #e0aaff;
  }


  /* =====================================================
     BOARD
     ===================================================== */

  #whack-a-track-game .wat-board {
    position: relative;

    width: 100%;
    max-width: 500px;

    aspect-ratio: 500 / 220;

    margin: 12px auto;

    background-color: #55208a;

    background-image:
      url("./assets/holes.png");

    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;

    border: 2px solid #d4af37;
    border-radius: 10px;

    overflow: hidden;
  }


  /* =====================================================
     HOLES / INVISIBLE HIT BUTTONS
     ===================================================== */

  #whack-a-track-game .wat-hole {
    position: absolute;

    width: 76px;
    height: 76px;

    padding: 0;
    margin: 0;

    /*
       The buttons are now invisible.

       They still exist and still receive clicks,
       but the holes.png artwork provides the
       visible holes.
    */

    background: transparent;

    border: 0;

    border-radius: 50%;

    appearance: none;
    -webkit-appearance: none;

    cursor: pointer;

    overflow: visible;

    z-index: 5;
  }


  #whack-a-track-game .wat-hole:hover {
    background: transparent;
  }


  #whack-a-track-game .wat-hole:focus {
    outline: none;
  }


  /* =====================================================
     DUCK
     ===================================================== */

  #whack-a-track-game .wat-duck {
    position: absolute;

    left: 50%;
    bottom: 2px;

    width: 72px;
    height: 72px;

    transform:
      translateX(-50%)
      scaleY(.94);

    object-fit: contain;

    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;

    z-index: 10;

    transform-origin: bottom center;
  }


  /* =====================================================
     HIT IMAGE
     ===================================================== */

  #whack-a-track-game .wat-duck-hit {
    position: absolute;

    left: 50%;
    bottom: 2px;

    width: 72px;
    height: 72px;

    transform:
      translateX(-50%);

    object-fit: contain;

    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;

    z-index: 11;
  }


  /* =====================================================
     WHACK / QUACK IMAGE
     ===================================================== */

  #whack-a-track-game .wat-whack {
    position: absolute;

    left: 50%;
    top: 50%;

    width: 90px;
    height: 90px;

    object-fit: contain;

    transform:
      translate(-50%, -50%)
      rotate(-8deg);

    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;

    z-index: 20;

    animation:
      wat-whack-pop .18s
      ease-out;
  }


  @keyframes wat-whack-pop {

    0% {
      transform:
        translate(-50%, -50%)
        scale(.55)
        rotate(-8deg);
      opacity: 0;
    }

    100% {
      transform:
        translate(-50%, -50%)
        scale(1)
        rotate(-8deg);
      opacity: 1;
    }
  }


  /* =====================================================
     CONTROLS
     ===================================================== */

  #whack-a-track-game .wat-controls {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }


  #whack-a-track-game button.wat-start,
  #whack-a-track-game button.wat-end {
    border: 1px solid #d4af37;
    border-radius: 999px;

    padding: 9px 14px;

    color: #fff;
    background: #55208a;

    font: inherit;
    font-size: .8rem;

    cursor: pointer;
  }


  #whack-a-track-game button.wat-start:hover,
  #whack-a-track-game button.wat-end:hover {
    background: #7e35bc;
  }


  /* =====================================================
     STATUS
     ===================================================== */

  #whack-a-track-game .wat-status {
    min-height: 22px;

    margin-top: 10px;

    color: #b9a8c5;

    font-size: .8rem;
  }


  /* =====================================================
     ROAD CLOSED
     ===================================================== */

  .wat-road-closed {
    display: inline-block;

    margin-left: 8px;

    color: #f5d76e;
    font-weight: bold;
  }


  .wat-whacked-row {
    opacity: .72;
  }


  .wat-whacked-row .play {
    opacity: .45;
    cursor: not-allowed;
  }


  /* =====================================================
     MOBILE
     ===================================================== */

  @media (max-width: 500px) {

    #whack-a-track-game {
      padding: 12px;
    }


    #whack-a-track-game .wat-hole {
      width: 62px;
      height: 62px;
    }


    #whack-a-track-game .wat-duck,
    #whack-a-track-game .wat-duck-hit {
      width: 60px;
      height: 60px;
    }


    #whack-a-track-game .wat-whack {
      width: 76px;
      height: 76px;
    }

  }

`;

document.head.appendChild(style);

}
/* =========================================================
CREATE GAME
========================================================= */
function createGame() {
if (
  document.getElementById(
    "whack-a-track-game"
  )
) {
  return;
}

addStyles();

const main =
  document.querySelector("main");

if (!main) {
  return;
}


gameEl =
  document.createElement("section");

gameEl.id =
  "whack-a-track-game";


gameEl.innerHTML = `

  <h2>WHACK-A-TRACK WITH A QUACK 😸</h2>

  <div class="wat-info">

    <span class="wat-health">
      Track Health:
      <strong id="wat-health">
        ${TRACK_HEALTH}
      </strong>
    </span>

    <span class="wat-time">
      Time:
      <strong id="wat-time">
        ${GAME_DURATION}
      </strong>
    </span>

  </div>


  <div
    class="wat-board"
    id="wat-board"
  ></div>


  <div class="wat-controls">

    <button
      class="wat-start"
      id="wat-start"
      type="button"
    >
      Start Game
    </button>

    <button
      class="wat-end"
      id="wat-end"
      type="button"
    >
      End Game
    </button>

  </div>


  <div
    class="wat-status"
    id="wat-status"
  >
    Whack every duck before the clock runs out!
  </div>

`;


main.appendChild(gameEl);


boardEl =
  $("#wat-board");

healthEl =
  $("#wat-health");

timerEl =
  $("#wat-time");

statusEl =
  $("#wat-status");


$("#wat-start").onclick =
  startGame;

$("#wat-end").onclick =
  endGame;


buildHoles();

markWhackedRows();

}
/* =========================================================
BUILD SIX INVISIBLE HIT BUTTONS
========================================================= */
function buildHoles() {
boardEl.innerHTML = "";


/*
   3 columns x 2 rows.

   These positions correspond to the
   holes in holes.png.
*/

const positions = [

  { left: "21%", top: "17%" },
  { left: "50%", top: "17%" },
  { left: "79%", top: "17%" },

  { left: "21%", top: "55%" },
  { left: "50%", top: "55%" },
  { left: "79%", top: "55%" }

];


positions.forEach(
  (position, index) => {

    const hole =
      document.createElement(
        "button"
      );

    hole.type = "button";

    hole.className =
      "wat-hole";

    hole.dataset.index =
      index;


    hole.style.left =
      `calc(${position.left} - 38px)`;

    hole.style.top =
      `calc(${position.top} - 38px)`;


    /*
       Empty by default.

       The duck gets inserted here
       only when this hole is active.
    */

    hole.innerHTML = "";


    hole.onclick = () => {

      if (!gameActive) {
        return;
      }

      if (
        hole !== activeHole
      ) {
        return;
      }

      hitDuck(hole);
    };


    boardEl.appendChild(hole);
  }
);

}
/* =========================================================
SPAWN DUCK
========================================================= */
function spawnMole() {
if (!gameActive) {
  return;
}


/*
   Remove previous duck.
*/

clearActiveHole();


const holes =
  Array.from(
    boardEl.querySelectorAll(
      ".wat-hole"
    )
  );


if (!holes.length) {
  return;
}


const randomIndex =
  Math.floor(
    Math.random() *
    holes.length
  );


const hole =
  holes[randomIndex];


activeHole =
  hole;


const duck =
  document.createElement(
    "img"
  );


duck.className =
  "wat-duck";

duck.src =
  DUCK_IMAGE;

duck.alt =
  "Duck target";

duck.draggable =
  false;


hole.appendChild(
  duck
);


activeDuck =
  duck;


/*
   Little squash as the duck appears.
*/

duck.animate(
  [
    {
      transform:
        "translateX(-50%) scaleY(.35)"
    },
    {
      transform:
        "translateX(-50%) scaleY(1.02)"
    },
    {
      transform:
        "translateX(-50%) scaleY(.94)"
    }
  ],
  {
    duration: 180,
    easing: "ease-out"
  }
);


/*
   Automatically disappear after
   a short amount of time.
*/

setTimeout(() => {

  if (
    gameActive &&
    hole === activeHole
  ) {
    clearActiveHole();
  }

}, MOLE_VISIBLE_MS);

}
/* =========================================================
CLEAR ACTIVE DUCK
========================================================= */
function clearActiveHole() {
if (activeHole) {

  activeHole.innerHTML =
    "";

}

activeHole =
  null;

activeDuck =
  null;

}
/* =========================================================
HIT DUCK
========================================================= */
function hitDuck(hole) {
if (
  !gameActive ||
  hole !== activeHole
) {
  return;
}


/*
   Duck gets replaced by
   the hit version.
*/

if (activeDuck) {

  activeDuck.src =
    DUCK_HIT_IMAGE;

  activeDuck.className =
    "wat-duck-hit";

}


/*
   Add WHACK image.
*/

const whack =
  document.createElement(
    "img"
  );

whack.className =
  "wat-whack";

whack.src =
  WHACK_IMAGE;

whack.alt =
  "WHACK";


hole.appendChild(
  whack
);


/*
   Vibrate when available.
*/

if (
  navigator.vibrate
) {
  navigator.vibrate(100);
}


/*
   Remove one health.
*/

health--;

healthEl.textContent =
  health;


/*
   The track is defeated.
*/

if (health <= 0) {

  if (
    navigator.vibrate
  ) {
    navigator.vibrate(180);
  }


  finishGame(true);

  return;
}


/*
   Clear the hit animation.
*/

setTimeout(() => {

  if (
    hole === activeHole
  ) {
    clearActiveHole();
  }

}, 220);

}
/* =========================================================
START GAME
========================================================= */
function startGame() {
if (gameActive) {
  return;
}


/*
   Get the currently playing song
   from the main player's state.
*/

if (
  typeof currentIndex ===
  "undefined"
) {
  statusEl.textContent =
    "Play a track first.";
  return;
}


if (
  currentIndex < 0
) {
  statusEl.textContent =
    "Play a track first.";
  return;
}


if (
  typeof isTrackWhacked ===
  "function" &&
  isTrackWhacked(
    currentIndex
  )
) {
  statusEl.textContent =
    "🚧 This track is already whacked!";
  return;
}


gameTrackIndex =
  currentIndex;


health =
  TRACK_HEALTH;

timeLeft =
  GAME_DURATION;


healthEl.textContent =
  health;

timerEl.textContent =
  timeLeft;


gameActive =
  true;


statusEl.textContent =
  "Whack every duck before the clock runs out!";


/*
   Scroll the game into view.
*/

gameEl.scrollIntoView({
  behavior: "smooth",
  block: "center"
});


/*
   Start the duck cycle.
*/

spawnMole();


moleTimer =
  setInterval(
    spawnMole,
    MOLE_INTERVAL_MS
  );


/*
   Start countdown.
*/

timer =
  setInterval(() => {

    if (!gameActive) {
      return;
    }


    timeLeft--;


    timerEl.textContent =
      timeLeft;


    if (
      timeLeft <= 0
    ) {

      finishGame(false);

    }

  }, 1000);

}
/* =========================================================
END GAME
========================================================= */
function endGame() {
if (!gameActive) {
  return;
}


gameActive =
  false;


clearInterval(timer);
clearInterval(moleTimer);


timer =
  null;

moleTimer =
  null;


clearActiveHole();


statusEl.textContent =
  "Game ended.";


gameTrackIndex =
  null;

}
/* =========================================================
FINISH GAME
========================================================= */
function finishGame(defeated) {
gameActive =
  false;


clearInterval(timer);
clearInterval(moleTimer);


timer =
  null;

moleTimer =
  null;


clearActiveHole();


if (defeated) {

  /*
     Save the track as whacked.
  */

  const tracks =
    getWhackedTracks();


  if (
    gameTrackIndex !== null &&
    !tracks.includes(
      gameTrackIndex
    )
  ) {

    tracks.push(
      gameTrackIndex
    );

    saveWhackedTracks(
      tracks
    );
  }


  statusEl.textContent =
    "🚧 TRACK WHACKED! Road closed!";


  markWhackedRows();


  /*
     Stop the YouTube song.
  */

  if (
    window.rizneyPlayer &&
    typeof
      window.rizneyPlayer.stopVideo ===
      "function"
  ) {

    window.rizneyPlayer.stopVideo();

  }


} else {

  statusEl.textContent =
    "Time's up! The track survived.";
}


gameTrackIndex =
  null;

}
/* =========================================================
MARK WHACKED SONGS
========================================================= */
function markWhackedRows() {
const whacked =
  getWhackedTracks();


const rows =
  document.querySelectorAll(
    "#song-list .song"
  );


rows.forEach(
  (row, index) => {

    const button =
      row.querySelector(
        ".play"
      );


    if (
      whacked.includes(index)
    ) {

      row.classList.add(
        "wat-whacked-row"
      );


      if (button) {

        button.disabled =
          true;

        button.textContent =
          "🚧 WHACKED!";

      }


      let label =
        row.querySelector(
          ".wat-road-closed"
        );


      if (!label) {

        label =
          document.createElement(
            "span"
          );

        label.className =
          "wat-road-closed";

        label.textContent =
          "ROAD CLOSED";

        const title =
          row.querySelector(
            ".song-title"
          );

        if (title) {
          title.appendChild(
            label
          );
        }

      }

    }

  }
);

}
/* =========================================================
PROTECT PLAY BUTTONS FOR WHACKED TRACKS
========================================================= */
document.addEventListener(
"click",
e => {
  const button =
    e.target.closest(
      "#song-list .play"
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
    Array.from(
      document.querySelectorAll(
        "#song-list .song"
      )
    );


  const index =
    rows.indexOf(row);


  if (
    isTrackWhacked(index)
  ) {

    e.preventDefault();
    e.stopImmediatePropagation();

  }

},
true

);
/* =========================================================
INITIALIZE
========================================================= */
if (
document.readyState ===
"loading"
) {
document.addEventListener(
  "DOMContentLoaded",
  createGame
);

} else {
createGame();

}
})();
