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
     PHONE VIBRATION
     ========================================================= */ 

  function vibrate(duration) {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      try {
        navigator.vibrate(duration);
      } catch (error) {
        /* Vibration is optional. */
      }
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

      /*
       * ROADWORK ROW
       */ 

      #song-list .song.rizney-roadwork {
        opacity: .72;
      } 

      #song-list .song.rizney-roadwork::after {
        content: "🚧 WHACKED!";
        display: block;
        grid-column: 1 / -1;
        margin: 4px 0 4px;
        padding: 6px 10px;
        text-align: center;
        font-weight: 800;
        letter-spacing: .08em;
        color: #f5d76e;
        background: #120b18;
        border: 1px solid #d4af37;
        border-radius: 8px;
      } 

      #song-list .song.rizney-roadwork .animal-button {
        cursor: not-allowed;
        opacity: .45;
        pointer-events: none;
      } 

      #song-list .song.rizney-roadwork .song-number {
        cursor: not-allowed;
        opacity: .45;
        pointer-events: none;
      } 

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
          min-height: 58px !important;
          padding: 4px !important;
          font-size: 1.65rem !important;
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


  /* =========================================================
     CURRENT SONG
     ========================================================= */ 

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
    } catch (error) {
      /* ids may not be available yet. */
    } 

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
     GAME
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
        background: "#2a1b3d",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d4af37",
        position: "relative"
      }
    ); 

    const overlay = document.createElement("img");
    overlay.src = "holes.png";
    overlay.alt = "";
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      pointerEvents: "none",
      zIndex: "2",
      borderRadius: "10px"
    });
    board.appendChild(overlay);

    for (let i = 0; i < 6; i++) {
      const hole =
        document.createElement(
          "button"
        ); 

      hole.type = "button";
      hole.className =
        "wat-hole";
      hole.textContent =
        "";
      hole.dataset.active =
        "false"; 

      Object.assign(
        hole.style,
        {
          minHeight: "76px",
          padding: "8px",
          fontSize: "2rem",
          cursor: "crosshair",
          background: "transparent",
          border: "none",
          boxShadow: "none",
          position: "relative",
          zIndex: "1"
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
            "false"; 

          hole.textContent =
            "💥"; 
          hole.style.zIndex = "3";

          trackHealth--; 

          /*
           * STRONGER LITTLE PHYSICAL FEEDBACK.
           */
          if (
            trackHealth <= 0
          ) {
            vibrate(180);
          } else {
            vibrate(100);
          } 

          $("#wat-health", panel)
            .value =
            trackHealth; 

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

    const closeBtn = $("#wat-close", panel);
    const refreshBtn = $("#wat-refresh", panel);

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
      () =>
        window.location.reload()
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


  function hideMoles() {
    game.board
      .querySelectorAll(
        ".wat-hole"
      )
      .forEach(hole => {
        hole.dataset.active =
          "false"; 

        hole.textContent =
          "";
        hole.style.zIndex = "1";
      });
  }


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

    hole.textContent =
      "🐭"; 
    hole.style.zIndex = "3";

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
            hole.textContent =
              "";
            hole.style.zIndex = "1";
          } 

          hole.dataset.active =
            "false";
        },
        MOLE_VISIBLE_MS
      ); 

    moleTimer =
      setTimeout(
        spawnMole,
        MOLE_INTERVAL_MS
      );
  }


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

    /*
     * SAVE THE TRACK PERMANENTLY.
     */
    const savedId =
      saveWhackedTrack(
        songId
      ); 

    /*
     * CLOSE THE ROAD.
     */
    const roadClosed =
      closeRoad(
        songNumber,
        songId
      ); 

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
        `💥 TRACK WHACKED!<br>` +
        `<small>Could not locate Song ${
          songNumber || "?"
        }.</small>`;
    }
  }


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
    ).hidden = true; 

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

    /*
     * Don't allow a road-closed track
     * to be whacked again.
     */
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

    game.status.innerHTML =
      `🎵 ROAD OPEN<br>` +
      `<small>Song ${
        songNumber || "?"
      } · ${
        songId || "unknown"
      }</small><br>` +
      `<small>Whack every mouse before the clock runs out!</small>`; 

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

    /*
     * Restore all previously closed roads
     * from localStorage.
     */
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
