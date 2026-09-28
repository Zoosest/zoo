/* =========================================================
   RIZNEY MUSIC ARCHIVE
   WHACK-A-TRACK
   ========================================================= */

(() => {
  "use strict";

  const TRACK_HEALTH = 24;
  const GAME_DURATION = 80;
  const MOLE_VISIBLE_MS = 460;
  const MOLE_INTERVAL_MS = 1400;

  const youtube = () =>
    window.rizneyPlayer ||
    window.player ||
    null;

  const $ = (
    selector,
    root = document
  ) => root.querySelector(selector);

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
     TOOLBAR
     ========================================================= */

  function setToolbarHidden(hidden) {
    controls()?.classList.toggle(
      "toolbar-hidden",
      hidden
    );
  }


  function positionToolbar() {
    const dock =
      $(".player-dock");

    if (dock) {
      document.documentElement.style.setProperty(
        "--player-dock-height",
        `${dock.offsetHeight}px`
      );
    }
  }


  function scrollToReading() {
    const reading =
      $("#reading");

    if (
      !reading ||
      reading.hidden
    ) {
      return;
    }

    requestAnimationFrame(() => {
      reading.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }


  function setupToolbar() {
    const style =
      document.createElement("style");

    style.textContent = `
      .controls {
        position: sticky;
        top: var(--player-dock-height, 0px);
        z-index: 90;
        transition:
          opacity .18s ease,
          visibility .18s ease;
      }

      .controls.toolbar-hidden {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
      }

      #reading,
      #whack-a-track-game {
        scroll-margin-top:
          calc(
            var(--player-dock-height, 0px) + 8px
          );
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
      const dock =
        $(".player-dock");

      if (dock) {
        new ResizeObserver(
          positionToolbar
        ).observe(dock);
      }
    }

    setToolbarHidden(false);

    /*
      If CARDS is pressed while the reading
      is already open, close the reading.
    */
    const cardsButton =
      $("#draw-cards");

    const reading =
      $("#reading");

    cardsButton?.addEventListener(
      "click",
      event => {
        if (
          !reading ||
          reading.hidden
        ) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        reading.hidden = true;
      },
      true
    );

    cardsButton?.addEventListener(
      "click",
      scrollToReading
    );
  }


  /* =========================================================
     YOUTUBE PLAYER
     ========================================================= */

  function playing() {
    const player =
      youtube();

    return (
      player &&
      typeof player.getPlayerState ===
        "function" &&
      window.YT &&
      player.getPlayerState() ===
        YT.PlayerState.PLAYING
    );
  }


  /* =========================================================
     CURRENT TRACK
     ========================================================= */

  function getCurrentTrackId() {
    /*
      main.js exposes this information through
      window.rizneyArchive.

      We intentionally use the archive API rather
      than trying to read the YouTube player ourselves.
    */
    const archive =
      window.rizneyArchive;

    if (
      archive &&
      typeof archive.getCurrentTrackId ===
        "function"
    ) {
      return archive.getCurrentTrackId();
    }

    /*
      Fallback for compatibility with older versions.
    */
    if (
      archive &&
      typeof archive.getCurrentTrackIndex ===
        "function" &&
      Array.isArray(archive.ids)
    ) {
      const index =
        archive.getCurrentTrackIndex();

      if (
        Number.isInteger(index) &&
        index >= 0
      ) {
        return archive.ids[index] || null;
      }
    }

    return null;
  }


  function getCurrentTrackIndex() {
    const archive =
      window.rizneyArchive;

    if (
      archive &&
      typeof archive.getCurrentTrackIndex ===
        "function"
    ) {
      return archive.getCurrentTrackIndex();
    }

    return -1;
  }


  /* =========================================================
     REMOVE THE CURRENT TRACK
     ========================================================= */

  function removeCurrentTrack() {
    const archive =
      window.rizneyArchive;

    if (
      !archive ||
      typeof archive.removeTrack !==
        "function"
    ) {
      return false;
    }

    const trackId =
      getCurrentTrackId();

    if (!trackId) {
      return false;
    }

    /*
      main.js uses the YouTube ID as the permanent
      identifier.

      This is what makes the removal survive
      closing the browser and returning later.
    */
    const removed =
      archive.removeTrack(
        trackId
      );

    return removed !== false;
  }


  /* =========================================================
     GAME CREATION
     ========================================================= */

  function createGame() {
    if (game) {
      return game;
    }

    const panel =
      document.createElement("section");

    panel.id =
      "whack-a-track-game";

    panel.setAttribute(
      "aria-label",
      "Whack-a-Track"
    );

    panel.innerHTML = `
      <h2>Whack-a-Track</h2>

      <p
        id="wat-status"
        aria-live="polite"
      ></p>

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
        top: "var(--player-dock-height, 104px)",
        zIndex: "20",
        maxWidth: "min(92vw, 620px)",
        boxSizing: "border-box",
        margin: "8px auto 18px",
        padding: "10px 14px 14px",
        textAlign: "center",
        background: "#120b18",
        border: "2px solid #d4af37",
        borderRadius: "12px",
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
        margin: "18px auto"
      }
    );

   
