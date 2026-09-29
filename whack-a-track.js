/* Whack-a-Track mini-game for the Rizney Music Archive. */
(() => {
  "use strict";

  const TRACK_HEALTH = 24;
  const GAME_DURATION = 80;
  const MOLE_VISIBLE_MS = 660;
  const MOLE_INTERVAL_MS = 1400;

  const REMOVED_TRACKS_KEY =
    "rizneyWhackedTracks";

  const youtube = () =>
    window.rizneyPlayer || window.player || null;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const controls = () =>
    $(".controls");

  let game;
  let active = false;
  let trackHealth = TRACK_HEALTH;
  let secondsLeft = GAME_DURATION;
  let moleTimer;
  let hideTimer;
  let gameTimer;


  /* =========================================================
     AUDIO & VIBRATION
     ========================================================= */

  function playQuackSound() {
    try {
      const sound = new Audio("assets/quack.mp3");
      sound.volume = 0.8;
      sound.play().catch(() => {});
    } catch (error) {}
  }

  function vibrate(pattern) {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {}
    }
  }


  /* =========================================================
     TOOLBAR
     ========================================================= */

  function setToolbarHidden(hidden) {
    controls()?.classList.toggle(
      "toolbar-hidden",
      hidden
    );
  }

  function positionToolbar() {
    const dock = $(".player-dock");

    if (dock) {
      document.documentElement.style.setProperty(
        "--player-dock-height",
        `${dock.offsetHeight}px`
      );
    }
  }

  function setupToolbar() {
    const style =
      document.createElement("style");

    style.textContent = `
      .controls {
        position: sticky;
        top: var(--player-dock-height, 0px);
        z-index: 90;
        transition: opacity .18s ease, visibility .18s ease;
      }

      .controls.toolbar-hidden {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
      }

      #reading,
      #whack-a-track-game {
        scroll-margin-top:
          calc(var(--player-dock-height, 0px) + 8px);
      }

      @keyframes lakeRipplePan {
        0% { background-position: 0px 0px; }
        100% { background-position: 80px 40px; }
      }

      #wat-board {
        background-color: #1d5b87 !important;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'><path d='M 0 10 Q 20 4, 40 10 T 80 10' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='1.5'/><path d='M 0 22 Q 20 16, 40 22 T 80 22' fill='none' stroke='rgba(255,255,255,0.16)' stroke-width='1.2'/><path d='M 0 34 Q 20 28, 40 34 T 80 34' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/></svg>") !important;
        background-size: 80px 40px !important;
        animation: lakeRipplePan 6s linear infinite !important;
      }

      @keyframes watSplashRing {
        0% {
          transform: scale(0.2);
          opacity: 1;
          border-width: 3px;
        }
        100% {
          transform: scale(1.35);
          opacity: 0;
          border-width: 1.2px;
        }
      }

      .wat-ripple {
        position: absolute;
        bottom: -3px;
        left: 50%;
        width: 36px;
        height: 18px;
        margin-left: -18px;
        border: 2.5px solid rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: watSplashRing 0.32s ease-out forwards;
      }

      @keyframes quackPop {
        0% {
          transform: scale(0.3) var(--base-rot);
          opacity: 0;
        }
        50% {
          transform: scale(1.25) var(--mid-rot);
          opacity: 1;
        }
        100% {
          transform: scale(1.1) var(--end-rot);
          opacity: 0;
        }
      }

      .wat-quack-pop {
        position: absolute;
        width: 72px;
        height: 72px;
        object-fit: contain;
        pointer-events: none;
        z-index: 10;
        animation: quackPop 0.4s ease-out forwards;
      }

      @keyframes duckSquashPop {
        0% {
          transform: scale(0.3, 1.6) translateY(36px);
          opacity: 0;
        }
        35% {
          transform: scale(1.22, 0.78) translateY(-8px);
          opacity: 1;
        }
        65% {
          transform: scale(0.94, 1.06) translateY(3px);
        }
        100% {
          transform: scale(1, 1) translateY(0);
          opacity: 1;
        }
      }

      .wat-duck {
        position: absolute;
        inset: 4px;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        object-fit: contain;
        pointer-events: none;
        display: block;
        animation: duckSquashPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }

      @keyframes duckRetreat {
        0% {
          transform: scale(1, 1) translateY(0);
          opacity: 1;
        }
        40% {
          transform: scale(0.88, 1.12) translateY(-4px);
          opacity: 1;
        }
        100% {
          transform: scale(0.3, 1.5) translateY(36px);
          opacity: 0;
        }
      }

      .wat-duck-hiding {
        animation: duckRetreat 0.18s ease-in forwards !important;
      }

      @keyframes duckFallAndWobble {
        0% {
          transform: scaleX(var(--duck-flip, 1)) translateY(0) rotate(0deg);
          opacity: 1;
        }
        25% {
          transform: scaleX(var(--duck-flip, 1)) translateY(8px) rotate(-14deg);
        }
        50% {
          transform: scaleX(var(--duck-flip, 1)) translateY(18px) rotate(16deg);
        }
        75% {
          transform: scaleX(var(--duck-flip, 1)) translateY(28px) rotate(-10deg);
        }
        100% {
          transform: scaleX(var(--duck-flip, 1)) translateY(45px) rotate(22deg);
          opacity: 0;
        }
      }

      .wat-duck-hit {
        position: absolute;
        inset: 4px;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        object-fit: contain;
        pointer-events: none;
        display: block;
        animation: duckFallAndWobble 0.4s ease-in forwards;
      }


      /* =====================================================
         WHACKED SONG ROW
         ===================================================== */

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
        min-width: 0;
        min-height: 62px;
        margin: 0;
        padding: 0 8px;
        text-align: center;
        font-weight: 800;
        letter-spacing: .08em;
        color: #f5d76e;
        background: transparent;
        border: 0;
        border-radius: 0;
        grid-column: 1 / 4;
        grid-row: 1;
      }

      #song-list .song.rizney-roadwork .animal-button {
        grid-column: 4;
        grid-row: 1;
        cursor: not-allowed;
        opacity: .45;
        pointer-events: none;
      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 640px) {

        #whack-a-track-game {
          width: 100%;
          margin-top: 4px;
          margin-bottom: 12px;
          padding: 8px 10px 10px;
        }

        #whack-a-track-game #wat-board {
          gap: 6px;
          margin: 10px auto;
        }

        #whack-a-track-game .wat-hole {
          height: 58px !important;
          min-height: 58px !important;
        }

        #song-list .song.rizney-roadwork::after {
          min-height: 54px;
          padding: 0 5px;
          font-size: .78rem;
        }
      }
    `;

    document.head.appendChild(style);

    positionToolbar();

    window.addEventListener(
      "resize",
      positionToolbar,
      { passive: true }
    );

    if (window.ResizeObserver) {
      const dock = $(".player-dock");

      if (dock) {
        new ResizeObserver(
          positionToolbar
        ).observe(dock);
      }
    }

    setToolbarHidden(false);
  }


  /* =========================================================
     YOUTUBE
     ========================================================= */

  const playing = () => {
    const player = youtube();

    return (
      player &&
      typeof player.getPlayerState ===
        "function" &&
      window.YT &&
      player.getPlayerState() ===
        YT.PlayerState.PLAYING
    );
  };


  function getCurrentSongId() {
    const player = youtube();

    if (
      !player ||
      typeof player.getVideoData !==
        "function"
    ) {
      return null;
    }

    try {
      const data =
        player.getVideoData();

      if (
        !data ||
        !data.video_id
      ) {
        return null;
      }

      return String(
        data.video_id
      );

    } catch (error) {
      return null;
    }
  }


  function getCurrentSongNumber() {
    const nowPlaying =
      $("#now-playing");

    if (!nowPlaying) {
      return null;
    }

    const match =
      nowPlaying.textContent.match(
        /Song\s+(\d+)/i
      );

    if (!match) {
      return null;
    }

    return Number(match[1]);
  }


  function getSongIdForNumber(songNumber) {
    if (
      !songNumber ||
      !Number.isInteger(songNumber)
    ) {
      return null;
    }

    try {
      if (
        typeof ids !== "undefined" &&
        ids[songNumber]
      ) {
        return String(
          ids[songNumber]
        );
      }
    } catch (error) {}

    return null;
  }


  /* =========================================================
     PERSISTENT ROADWORK
     ========================================================= */

  function getWhackedTracks() {
    try {
      const raw =
        localStorage.getItem(
          REMOVED_TRACKS_KEY
        );

      const parsed =
        JSON.parse(
          raw || "[]"
        );

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {
      return [];
    }
  }


  function saveWhackedTrack(songId) {
    if (!songId) {
      return null;
    }

    try {
      const tracks =
        getWhackedTracks();

      if (
        !tracks.includes(songId)
      ) {
        tracks.push(songId);

        localStorage.setItem(
          REMOVED_TRACKS_KEY,
          JSON.stringify(tracks)
        );
      }

      return songId;

    } catch (error) {
      return null;
    }
  }


  function isTrackRemembered(songId) {
    if (!songId) {
      return false;
    }

    return getWhackedTracks()
      .includes(songId);
  }


  function findSongRow(songNumber) {
    if (!songNumber) {
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

    row.classList.add(
      "rizney-roadwork"
    );

    row.dataset.rizneyRoadwork =
      "true";

    const playButton =
      row.querySelector(".play");

    if (playButton) {
      playButton.disabled = true;

      playButton.setAttribute(
        "aria-label",
        "Song closed for roadwork"
      );
    }

    return true;
  }


  function closeRoad(
    songNumber,
    songId
  ) {
    if (
      !songNumber &&
      !songId
    ) {
      return false;
    }

    const row =
      findSongRow(songNumber);

    if (!row) {
      return false;
    }

    if (songId) {
      saveWhackedTrack(songId);
    }

    return applyRoadworkToRow(
      row
    );
  }


  function loadSavedRoadwork() {
    const saved =
      new Set(
        getWhackedTracks()
      );

    if (!saved.size) {
      return;
    }

    document
      .querySelectorAll(
        "#song-list .song"
      )
      .forEach(row => {

        const songNumber =
          Number(
            row.dataset.songIndex
          );

        if (
          !Number.isInteger(
            songNumber
          ) ||
          songNumber < 1
        ) {
          return;
        }

        const songId =
          getSongIdForNumber(
            songNumber
          );

        if (
          songId &&
          saved.has(songId)
        ) {
          applyRoadworkToRow(
            row
          );
        }
      });
  }


  /* =========================================================
     CREATE GAME
     ========================================================= */

  function createGame() {
    if (game) return game;

    const panel =
      document.createElement(
        "section"
      );

    panel.id =
      "whack-a-track-game";

    panel.setAttribute(
      "aria-label",
      "Whack-a-Track"
    );

    panel.innerHTML = `
      <h2>Whack-a-Track</h2>

      <p id="wat-status"
         aria-live="polite"></p>

      <p>
        <span id="wat-time">
          ${GAME_DURATION}
        </span>s
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
        aria-label="Whack-a-Track board"
      ></div>

      <button
        id="wat-refresh"
        type="button"
        hidden
      >
        Refresh playlist
      </button>

      <button
        id="wat-close"
        type="button"
      >
        Close game
      </button>
    `;

    Object.assign(
      panel.style,
      {
        position: "sticky",
        top:
          "var(--player-dock-height, 104px)",
        zIndex: "20",
        maxWidth:
          "min(92vw, 620px)",
        boxSizing: "border-box",
        margin:
          "8px auto 18px",
        padding:
          "10px 14px 14px",
        textAlign: "center",
        background:
          "#120b18",
        border:
          "2px solid #d4af37",
        borderRadius:
          "12px",
        boxShadow:
          "0 0 24px rgba(212,175,55,.35)",
        scrollMarginTop:
          "calc(var(--player-dock-height, 0px) + 8px)"
      }
    );

    Object.assign(
      $("h2", panel).style,
      {
        margin: "0 0 6px"
      }
    );

    Object.assign(
      $("#wat-status", panel).style,
      {
        margin: "0 0 4px",
        minHeight: "1.4em"
      }
    );

    Object.assign(
      $("#wat-time", panel)
        .parentElement.style,
      {
        margin: "0 0 8px"
      }
    );

    Object.assign(
      $("#wat-health", panel).style,
      {
        display: "block",
        width: "100%",
        height: "18px",
        margin: "8px 0 14px",
        accentColor: "#d4af37"
      }
    );

    const board =
      $("#wat-board", panel);

    Object.assign(
      board.style,
      {
        display: "grid",
        gridTemplateColumns:
          "repeat(3, minmax(0, 1fr))",
        gap: "10px",
        margin: "18px auto",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d4af37",
        position: "relative",
        overflow: "visible"
      }
    );

    for (let i = 0; i < 6; i++) {

      const hole =
        document.createElement(
          "button"
        );

      hole.type = "button";
      hole.className =
        "wat-hole";

      hole.innerHTML =
        "";

      hole.dataset.active =
        "false";

      Object.assign(
        hole.style,
        {
          height: "76px",
          width: "100%",
          padding: "0",
          cursor: "crosshair",
          background: "transparent",
          border: "none",
          outline: "none",
          position: "relative",
          zIndex: "1",
          overflow: "hidden"
        }
      );

      hole.addEventListener(
        "click",
        () => {

          if (
            !active ||
            hole.dataset.active !==
              "true"
          ) {
            return;
          }

          hole.dataset.active =
            "hit";

          trackHealth--;

          if (
            trackHealth <= 0
          ) {
            vibrate([40, 30, 80]);
          } else {
            vibrate([15, 30, 45]);
          }

          playQuackSound();

          $("#wat-health", panel)
            .value =
            trackHealth;

          const duckFlip =
            Math.random() < 0.5
              ? -1
              : 1;

          hole.innerHTML =
            `<img src="assets/duck-hit.png" alt="" class="wat-duck-hit" style="--duck-flip: ${duckFlip};" />`;

          hole.style.zIndex = "3";

          triggerSplash(hole);

          const quackPop =
            document.createElement(
              "img"
            );

          quackPop.src =
            "assets/quack.png";

          quackPop.alt =
            "QUACK!";

          quackPop.className =
            "wat-quack-pop";

          const offsetX =
            (Math.random() - 0.5) * 44;

          const offsetY =
            -16 +
            (Math.random() - 0.5) * 16;

          const baseRot =
            -15 +
            Math.random() * 10;

          const midRot =
            -5 +
            Math.random() * 20;

          const endRot =
            5 +
            Math.random() *
              20 *
              (
                Math.random() < 0.5
                  ? 1
                  : -1
              );

          quackPop.style.setProperty(
            "--base-rot",
            `rotate(${baseRot}deg)`
          );

          quackPop.style.setProperty(
            "--mid-rot",
            `rotate(${midRot}deg)`
          );

          quackPop.style.setProperty(
            "--end-rot",
            `rotate(${endRot}deg)`
          );

          quackPop.style.left =
            `${
              hole.offsetLeft +
              (hole.offsetWidth / 2) -
              36 +
              offsetX
            }px`;

          quackPop.style.top =
            `${
              hole.offsetTop +
              (hole.offsetHeight / 2) -
              36 +
              offsetY
            }px`;

          board.appendChild(
            quackPop
          );

          setTimeout(() => {
            quackPop.remove();
          }, 400);

          setTimeout(() => {

            if (
              hole.dataset.active ===
              "hit"
            ) {
              hole.innerHTML =
                "";

              hole.style.zIndex =
                "1";
            }

          }, 400);

          if (
            trackHealth <= 0
          ) {
            finish(true);
          }
        }
      );

      board.appendChild(
        hole
      );
    }

    const closeBtn =
      $("#wat-close", panel);

    const refreshBtn =
      $("#wat-refresh", panel);

    [closeBtn, refreshBtn].forEach(btn => {

      if (btn) {

        Object.assign(btn.style, {
          backgroundColor: "#000000",
          color: "#f5d76e",
          border: "1px solid #d4af37",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "8px"
        });

      }

    });

    closeBtn.addEventListener(
      "click",
      closeGame
    );

    refreshBtn.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          REMOVED_TRACKS_KEY
        );

        window.location.reload();
      }
    );

    (
      $(".player-dock") ||
      $("main") ||
      document.body
    ).insertAdjacentElement(
      "afterend",
      panel
    );

    panel.hidden = true;

    new MutationObserver(
      () =>
        setToolbarHidden(
          !panel.hidden
        )
    ).observe(
      panel,
      {
        attributes: true,
        attributeFilter: [
          "hidden"
        ]
      }
    );

    game = {
      panel,
      board,
      status:
        $("#wat-status", panel)
    };

    return game;
  }


  /* =========================================================
     SPLASH
     ========================================================= */

  function triggerSplash(hole) {
    const ripple =
      document.createElement(
        "div"
      );

    ripple.className =
      "wat-ripple";

    hole.appendChild(
      ripple
    );

    setTimeout(() => {
      ripple.remove();
    }, 320);
  }


  /* =========================================================
     HIDE MOLES
     ========================================================= */

  function hideMoles() {

    game.board
      .querySelectorAll(
        ".wat-hole"
      )
      .forEach(hole => {

        hole.dataset.active =
          "false";

        hole.innerHTML =
          "";

        hole.style.zIndex =
          "1";
      });
  }


  /* =========================================================
     SPAWN MOLE
     ========================================================= */

  function spawnMole() {

    if (!active) return;

    const holes = [
      ...game.board
        .querySelectorAll(
          ".wat-hole"
        )
    ];

    const hole =
      holes[
        Math.floor(
          Math.random() *
            holes.length
        )
      ];

    hideMoles();

    hole.dataset.active =
      "true";

    hole.innerHTML =
      `<img src="assets/duck.png" alt="" class="wat-duck" />`;

    hole.style.zIndex =
      "3";

    triggerSplash(
      hole
    );

    clearTimeout(
      hideTimer
    );

    hideTimer =
      setTimeout(
        () => {

          if (
            hole.dataset.active ===
            "true"
          ) {

            const duckImg =
              hole.querySelector(
                ".wat-duck"
              );

            if (duckImg) {

              duckImg.classList.add(
                "wat-duck-hiding"
              );

              triggerSplash(
                hole
              );

              setTimeout(() => {

                if (
                  hole.dataset.active ===
                  "true"
                ) {
                  hole.innerHTML =
                    "";

                  hole.style.zIndex =
                    "1";

                  hole.dataset.active =
                    "false";
                }

              }, 180);

            } else {

              hole.innerHTML =
                "";

              hole.style.zIndex =
                "1";

              hole.dataset.active =
                "false";
            }

          } else {

            hole.dataset.active =
              "false";
          }

        },
        MOLE_VISIBLE_MS
      );

    moleTimer =
      setTimeout(
        spawnMole,
        MOLE_INTERVAL_MS
      );
  }


  /* =========================================================
     CLOCK
     ========================================================= */

  function startClock() {

    clearInterval(
      gameTimer
    );

    secondsLeft =
      GAME_DURATION;

    $("#wat-time",
      game.panel
    ).textContent =
      secondsLeft;

    gameTimer =
      setInterval(
        () => {

          if (!active) return;

          secondsLeft--;

          $("#wat-time",
            game.panel
          ).textContent =
            secondsLeft;

          if (
            secondsLeft <= 0
          ) {
            finish(false);
          }

        },
        1000
      );
  }


  /* =========================================================
     FINISH
     ========================================================= */

  function finish(won) {

    if (!active) return;

    active = false;

    clearTimeout(
      moleTimer
    );

    clearTimeout(
      hideTimer
    );

    clearInterval(
      gameTimer
    );

    hideMoles();

    if (!won) {

      game.status.textContent =
        "The track survived. Try again!";

      return;
    }

    const songId =
      getCurrentSongId();

    const songNumber =
      getCurrentSongNumber();

    const savedId =
      saveWhackedTrack(
        songId
      );

    const roadClosed =
      closeRoad(
        songNumber,
        songId
      );

    if (roadClosed) {

      $("#wat-refresh",
        game.panel
      ).hidden = false;
    }

    if (
      roadClosed &&
      savedId
    ) {

      game.status.innerHTML =
        `💥 TRACK WHACKED!<br>` +
        `<small>🚧 ROAD CLOSED FOR ROADWORK</small>`;

    } else if (
      roadClosed
    ) {

      game.status.innerHTML =
        `💥 TRACK WHACKED!<br>` +
        `<small>🚧 ROAD CLOSED FOR ROADWORK</small>`;

    } else {

      game.status.innerHTML =
        `💥 TRACK WHACKED!`;
    }
  }


  /* =========================================================
     CLOSE GAME
     ========================================================= */

  function closeGame() {

    active = false;

    clearTimeout(
      moleTimer
    );

    clearTimeout(
      hideTimer
    );

    clearInterval(
      gameTimer
    );

    if (game) {

      game.panel.hidden =
        true;
    }
  }


  /* =========================================================
     START GAME
     ========================================================= */

  function startGame(event) {

    event?.preventDefault();
    event?.stopImmediatePropagation();

    game =
      createGame();

    clearTimeout(
      moleTimer
    );

    clearTimeout(
      hideTimer
    );

    clearInterval(
      gameTimer
    );

    $("#wat-refresh",
      game.panel
    ).hidden =
      getWhackedTracks().length === 0;

    game.panel.hidden =
      false;

    if (!playing()) {

      active = false;

      game.status.textContent =
        "Play a track to start the game.";

      game.panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    const songNumber =
      getCurrentSongNumber();

    const songId =
      getCurrentSongId();

    if (
      isTrackRemembered(
        songId
      )
    ) {

      active = false;

      const row =
        findSongRow(
          songNumber
        );

      applyRoadworkToRow(
        row
      );

      game.status.innerHTML =
        `🚧 ROAD CLOSED<br>` +
        `<small>This track is already closed for roadwork.</small>`;

      game.panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    trackHealth =
      TRACK_HEALTH;

    active = true;

    $("#wat-health",
      game.panel
    ).value =
      trackHealth;

    hideMoles();

    /*
       CLEAN GAME START MESSAGE.

       No testing/debug information.
       No song number.
       No YouTube ID.
       No "ROAD OPEN".
    */

    game.status.textContent =
      "Whack the ducks!";

    startClock();

    spawnMole();

    game.panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {

    setupToolbar();

    loadSavedRoadwork();

    const button =
      $("#whack-track");

    if (
      !button ||
      button.dataset.whackGameBound ===
        "true"
    ) {
      return;
    }

    button.dataset.whackGameBound =
      "true";

    Object.assign(
      button.style,
      {
        cursor: "pointer"
      }
    );

    button.addEventListener(
      "click",
      startGame
    );
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
