(() => {
"use strict";
const TRACK_HEALTH = 24;
const GAME_DURATION = 80;
const MOLE_VISIBLE_MS = 660;
const MOLE_INTERVAL_MS = 1400;
const DUCK_IMAGE = "./assets/duck.png";
const DUCK_HIT_IMAGE = "./assets/duck-hit.png";
const WHACK_IMAGE = "./assets/whack.png";
const REMOVED_TRACKS_KEY =
"rizneyWhackedTracks";
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
STORAGE
========================================================= */
function getWhackedTracks() {
try {
return JSON.parse(
localStorage.getItem(REMOVED_TRACKS_KEY)
) || [];
} catch (error) {
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
return getWhackedTracks().includes(index);
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
     PURPLE BOARD + TRANSPARENT HOLES PNG
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
     INVISIBLE CLICKABLE BUTTONS
     ===================================================== */

  #whack-a-track-game .wat-hole {
    position: absolute;

    width: 76px;
    height: 76px;

    padding: 0;
    margin: 0;

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
    display: block;

    position: absolute;

    left: 50%;
    bottom: 0;

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
     HIT DUCK
     ===================================================== */

  #whack-a-track-game .wat-duck-hit {
    display: block;

    position: absolute;

    left: 50%;
    bottom: 0;

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
     WHACK IMAGE
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


  #whack-a-track-game .wat-start,
  #whack-a-track-game .wat-end {
    border: 1px solid #d4af37;
    border-radius: 999px;

    padding: 9px 14px;

    color: #fff;
    background: #55208a;

    font: inherit;
    font-size: .8rem;

    cursor: pointer;
  }


  #whack-a-track-game .wat-start:hover,
  #whack-a-track-game .wat-end:hover {
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
  document.getElementById(
    "wat-board"
  );

healthEl =
  document.getElementById(
    "wat-health"
  );

timerEl =
  document.getElementById(
    "wat-time"
  );

statusEl =
  document.getElementById(
    "wat-status"
  );

document.getElementById(
  "wat-start"
).onclick = startGame;

document.getElementById(
  "wat-end"
).onclick = endGame;

buildHoles();

markWhackedRows();

}
/* =========================================================
BUILD SIX INVISIBLE HIT AREAS
========================================================= */
function buildHoles() {
boardEl.innerHTML = "";

const positions = [

  { left: 21, top: 17 },
  { left: 50, top: 17 },
  { left: 79, top: 17 },

  { left: 21, top: 55 },
  { left: 50, top: 55 },
  { left: 79, top: 55 }

];

positions.forEach(
  (position, index) => {

    const hole =
      document.createElement(
        "button"
      );

    hole.type =
      "button";

    hole.className =
      "wat-hole";

    hole.dataset.index =
      index;

    hole.style.left =
      `calc(${position.left}% - 38px)`;

    hole.style.top =
      `calc(${position.top}% - 38px)`;

    /*
       The button is completely invisible.
       holes.png supplies the visible hole.
    */

    hole.innerHTML =
      "";

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

    boardEl.appendChild(
      hole
    );
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
   Simple squeeze/pop.
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
CLEAR DUCK
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

if (activeDuck) {

  activeDuck.src =
    DUCK_HIT_IMAGE;

  activeDuck.className =
    "wat-duck-hit";
}


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


if (
  navigator.vibrate
) {
  navigator.vibrate(100);
}


health--;

healthEl.textContent =
  health;


if (health <= 0) {

  if (
    navigator.vibrate
  ) {
    navigator.vibrate(180);
  }

  finishGame(true);

  return;
}


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
   currentIndex is supplied by index.html.

   -1 = intro
    0+ = actual songs
*/

if (
  typeof currentIndex ===
  "undefined" ||
  currentIndex < 0
) {

  statusEl.textContent =
    "Play a track first.";

  return;
}


if (
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


gameEl.scrollIntoView({
  behavior: "smooth",
  block: "center"
});


spawnMole();


moleTimer =
  setInterval(
    spawnMole,
    MOLE_INTERVAL_MS
  );


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
PROTECT WHACKED TRACKS
========================================================= */
document.addEventListener(
"click",
event => {
  const button =
    event.target.closest(
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

    event.preventDefault();

    event.stopImmediatePropagation();

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
