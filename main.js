/* =========================================================
   RIZNEY MUSIC ARCHIVE
   Animal Icons + Music Reading + Search Icon
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
     ========================================================= */

  const API_URL =
    "https://api.github.com/repos/the-zeusest/waltrizney-/contents/assets/animal-icons?ref=main";

  const RAW_PREFIX =
    "https://raw.githubusercontent.com/the-zeusest/waltrizney-/main/assets/animal-icons/";

  const FALLBACK_ICON =
    "🐾";

  const SEARCH_ICON =
    "./assets/search.png";


  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = selector =>
    document.querySelector(selector);


  /* =========================================================
     STYLES
     ========================================================= */

  function addStyles() {

    if (document.getElementById("rizney-main-js-styles")) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "rizney-main-js-styles";

    style.textContent = `

      /* =====================================================
         SONG ROW
         ===================================================== */

      .song {
        position:relative;
        display:grid !important;
        grid-template-columns:minmax(0,1fr) 62px !important;
        align-items:center;
        gap:10px;
        width:calc(100% - 58px);
        margin-left:58px;
        padding:2px 10px !important;
      }


      /* =====================================================
         SONG NUMBER
         ===================================================== */

      .song-number {
        position:absolute;
        left:-58px;
        top:50%;
        transform:translateY(-50%);

        width:58px;
        min-width:58px;

        display:flex;
        align-items:center;
        justify-content:center;

        color:var(--gold);

        text-decoration:none !important;
        -webkit-text-decoration:none !important;

        cursor:pointer;
      }

      .song-number:hover,
      .song-number:focus,
      .song-number:active {
        color:var(--bright-gold);

        text-decoration:none !important;
        -webkit-text-decoration:none !important;
      }


      /* =====================================================
         ANIMAL BUTTON
         ===================================================== */

      .animal-button {
        width:62px;
        height:62px;

        min-width:62px;
        min-height:62px;

        padding:0 !important;
        margin:0;

        display:flex;
        align-items:center;
        justify-content:center;

        border:1px solid var(--gold);
        border-radius:50%;

        background:#000;

        overflow:hidden;

        cursor:pointer;
      }

      .animal-button:hover {
        background:#21102e;
      }

      .animal-button img {
        display:block;

        width:58px;
        height:58px;

        object-fit:contain;
        object-position:center;

        border:0;
        margin:0;
        padding:0;

        background:#000;
      }


      /* =====================================================
         SEARCH ICON
         ===================================================== */

      .search-magnifying-glass-column {
        width:58px;
        min-width:58px;

        display:flex;
        align-items:center;
        justify-content:center;

        padding:0;
        margin:0;

        background:transparent;
        border:0;
        outline:0;
        box-shadow:none;

        color:transparent;

        text-decoration:none !important;
        -webkit-text-decoration:none !important;

        box-sizing:border-box;
      }

      .search-magnifying-glass-column img,
      .custom-search-icon {
        display:block;

        width:40px;
        height:40px;

        object-fit:contain;
        object-position:center;

        padding:0;
        margin:0;

        border:0;

        background:transparent;

        box-sizing:border-box;
      }


      /* =====================================================
         MUSIC READING CARDS
         ===================================================== */

      #cards {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:9px;
      }

      .music-reading-card {
        position:relative;

        min-height:150px;

        padding:12px 8px;

        color:var(--bright-purple);

        background:
          linear-gradient(
            145deg,
            #21102e,
            #090509
          );

        border:2px solid var(--gold);
        border-radius:12px;

        text-align:center;

        cursor:pointer;
      }

      .music-reading-card:hover {
        background:
          linear-gradient(
            145deg,
            #321547,
            #090509
          );
      }

      .music-reading-animal {
        display:block;

        width:104px;
        height:104px;

        margin:0 auto 8px;

        object-fit:contain;
        object-position:center;

        background:#000;

        border-radius:8px;
      }

      .music-reading-animal-name {
        display:block;

        color:var(--bright-gold);

        font-size:.78rem;
        font-weight:bold;
      }


      /* =====================================================
         HIDDEN PLAY BUTTONS
         ===================================================== */

      .song .play {
        display:none !important;
      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media(max-width:700px) {

        .song {
          grid-template-columns:minmax(0,1fr) 54px !important;

          width:calc(100% - 42px);

          margin-left:42px;

          gap:8px;

          padding:1px 8px !important;
        }


        .song-number {
          left:-42px;

          width:42px;
          min-width:42px;
        }


        .animal-button {
          width:54px;
          height:54px;

          min-width:54px;
          min-height:54px;
        }

        .animal-button img {
          width:50px;
          height:50px;
        }


        .search-magnifying-glass-column {
          width:42px;
          min-width:42px;
        }

        .search-magnifying-glass-column img,
        .custom-search-icon {
          width:30px;
          height:30px;
        }


        #cards {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        .music-reading-card {
          min-height:130px;
        }

        .music-reading-animal {
          width:76px;
          height:76px;
        }
      }


      @media(max-width:380px) {

        .music-reading-animal {
          width:66px;
          height:66px;
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     CUSTOM SEARCH ICON
     
     IMPORTANT:
     This does NOT create a search bar.
     
     It only replaces the old 🔎 emoji if another part
     of the site creates the search column.
     ========================================================= */

  function installSearchIcon() {

    const columns =
      document.querySelectorAll(
        ".search-magnifying-glass-column"
      );

    columns.forEach(column => {

      /*
         If our image is already there,
         leave it alone.
      */

      if (
        column.querySelector(
          ".custom-search-icon"
        )
      ) {
        return;
      }


      /*
         Remove the old emoji/text.
      */

      column.textContent = "";


      /*
         Create the real image.
      */

      const img =
        document.createElement("img");

      img.src =
        SEARCH_ICON;

      img.alt =
        "Search";

      img.title =
        "Search";

      img.loading =
        "lazy";

      img.decoding =
        "async";

      img.className =
        "custom-search-icon";


      column.appendChild(img);

    });
  }


  /* =========================================================
     WATCH FOR SEARCH ICON BEING CREATED
     
     Some older code creates the search bar after the page
     loads. This watches for that without creating a second
     search bar.
     ========================================================= */

  function watchForSearchIcon() {

    installSearchIcon();

    const observer =
      new MutationObserver(() => {

        installSearchIcon();

      });

    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================================
     ANIMAL IMAGE
     ========================================================= */

  function makeImage(filename) {

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "animal-button";

    button.title =
      filename.replace(
        /\.[^/.]+$/,
        ""
      );


    const img =
      document.createElement("img");

    img.src =
      RAW_PREFIX + filename;

    img.alt =
      button.title;

    img.loading =
      "lazy";

    img.decoding =
      "async";


    img.onerror = () => {

      img.remove();

      button.textContent =
        FALLBACK_ICON;

    };


    button.appendChild(img);

    return button;
  }


  /* =========================================================
     SONG NUMBER
     ========================================================= */

  function makeSongNumber(
    row,
    index
  ) {

    const oldNumber =
      row.querySelector(
        ".song-number"
      );

    if (!oldNumber) {
      return;
    }


    /*
       Don't rebuild it if it is already a link.
    */

    if (
      oldNumber.tagName === "A"
    ) {
      return;
    }


    const number =
      document.createElement("a");

    number.className =
      "song-number";

    number.href =
      "#";


    number.textContent =
      index + 1;


    number.onclick = e => {

      e.preventDefault();

      const playButton =
        row.querySelector(
          ".play"
        );

      if (playButton) {
        playButton.click();
      }

    };


    oldNumber.replaceWith(
      number
    );
  }


  /* =========================================================
     ADD ANIMAL TO SONG ROW
     ========================================================= */

  function putIcons(
    iconFiles
  ) {

    const rows =
      document.querySelectorAll(
        "#song-list .song"
      );


    rows.forEach(
      (row, index) => {

        /*
           Avoid duplicate icons.
        */

        if (
          row.querySelector(
            ".animal-button"
          )
        ) {
          makeSongNumber(
            row,
            index
          );

          return;
        }


        const filename =
          iconFiles[
            index %
            iconFiles.length
          ];


        if (!filename) {
          return;
        }


        const animal =
          makeImage(filename);


        row.appendChild(
          animal
        );


        makeSongNumber(
          row,
          index
        );

      }
    );
  }


  /* =========================================================
     ANIMAL NAME
     ========================================================= */

  function animalName(
    filename
  ) {

    return filename
      .replace(
        /\.[^/.]+$/,
        ""
      )
      .replace(
        /[-_]+/g,
        " "
      )
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );
  }


  /* =========================================================
     ADD ANIMAL TO MUSIC READING CARD
     ========================================================= */

  function addAnimalToCard(
    card,
    filename
  ) {

    if (
      card.querySelector(
        ".music-reading-animal"
      )
    ) {
      return;
    }


    const img =
      document.createElement("img");

    img.className =
      "music-reading-animal";

    img.src =
      RAW_PREFIX + filename;

    img.alt =
      animalName(filename);

    img.loading =
      "lazy";

    img.decoding =
      "async";


    img.onerror = () => {

      img.remove();

    };


    const name =
      document.createElement("span");

    name.className =
      "music-reading-animal-name";

    name.textContent =
      animalName(filename);


    card.prepend(
      name
    );

    card.prepend(
      img
    );
  }


  /* =========================================================
     MAKE CARD CLICKABLE
     ========================================================= */

  function makeCardClickable(
    card,
    position
  ) {

    if (
      card.dataset.rizneyClickable ===
      "true"
    ) {
      return;
    }


    card.dataset.rizneyClickable =
      "true";


    card.addEventListener(
      "click",
      e => {

        /*
           Don't interfere with an existing
           link or button inside the card.
        */

        if (
          e.target.closest(
            "a, button"
          )
        ) {
          return;
        }


        const link =
          card.querySelector(
            "a"
          );

        if (link) {
          link.click();
        }

      }
    );
  }


  /* =========================================================
     WATCH MUSIC READING CARDS
     ========================================================= */

  function setupCardWatching(
    iconFiles
  ) {

    const cards =
      document.getElementById(
        "cards"
      );

    if (!cards) {
      return;
    }


    const observer =
      new MutationObserver(() => {

        const cardElements =
          cards.children;


        Array.from(
          cardElements
        ).forEach(
          (card, position) => {

            if (
              !iconFiles[position]
            ) {
              return;
            }


            addAnimalToCard(
              card,
              iconFiles[position]
            );


            makeCardClickable(
              card,
              position
            );

          }
        );

      });


    observer.observe(
      cards,
      {
        childList:true,
        subtree:true
      }
    );

  }


  /* =========================================================
     MUSIC READING POSITION
     ========================================================= */

  function positionReading() {

    const reading =
      document.getElementById(
        "reading"
      );

    if (!reading) {
      return;
    }


    if (
      !reading.hidden
    ) {

      const dock =
        document.querySelector(
          ".player-dock"
        );


      const controls =
        document.querySelector(
          ".controls"
        );


      const offset =
        (
          dock?.offsetHeight || 0
        ) +
        (
          controls?.offsetHeight || 0
        ) +
        12;


      const top =
        reading.getBoundingClientRect()
          .top +
        window.scrollY -
        offset;


      window.scrollTo({
        top:Math.max(0, top),
        behavior:"smooth"
      });

    }

  }


  /* =========================================================
     SCHEDULE READING SCROLL
     ========================================================= */

  function scheduleReadingScroll() {

    const reading =
      document.getElementById(
        "reading"
      );

    if (!reading) {
      return;
    }


    const observer =
      new MutationObserver(() => {

        if (
          !reading.hidden
        ) {

          setTimeout(
            positionReading,
            50
          );

        }

      });


    observer.observe(
      reading,
      {
        attributes:true,
        attributeFilter:[
          "hidden"
        ]
      }
    );

  }


  /* =========================================================
     GET ANIMAL FILES
     ========================================================= */

  async function getAnimalFiles() {

    try {

      const response =
        await fetch(
          API_URL,
          {
            cache:"no-store"
          }
        );


      if (
        !response.ok
      ) {

        throw new Error(
          `GitHub returned ${response.status}`
        );

      }


      const files =
        await response.json();


      return files

        .filter(
          file =>
            file.type === "file" &&
            /\.(png|jpg|jpeg|webp|gif)$/i.test(
              file.name
            )
        )

        .map(
          file =>
            file.name
        )

        .sort(
          (a,b) =>
            a.localeCompare(
              b,
              undefined,
              {
                numeric:true,
                sensitivity:"base"
              }
            )
        );

    } catch (error) {

      console.error(
        "Rizney animal icon loading error:",
        error
      );

      return [];

    }

  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  async function init() {

    addStyles();


    /*
       Deal with the mysterious ghost 🔎.
       We only replace it if another script creates it.
    */

    watchForSearchIcon();


    const iconFiles =
      await getAnimalFiles();


    if (
      iconFiles.length === 0
    ) {

      console.warn(
        "No animal icons were found."
      );

      return;
    }


    /*
       Give the chronological song list
       its animal icons.
    */

    putIcons(
      iconFiles
    );


    /*
       Watch for CARDS being generated.
    */

    setupCardWatching(
      iconFiles
    );


    /*
       Watch for Music Reading
       opening/closing.
    */

    scheduleReadingScroll();


    /*
       If CARDS are already visible,
       position them correctly.
    */

    setTimeout(
      positionReading,
      100
    );

  }


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
