/* =========================================================
   RIZNEY MUSIC ARCHIVE
   Animal icons + song titles + keywords + Music Reading cards
   ========================================================= */

(() => {
  "use strict";

  const RAW_PREFIX =
    "https://raw.githubusercontent.com/zoosest/zoo/main/assets/animal-icons/";

  const SEARCH_ICON =
    "https://raw.githubusercontent.com/zoosest/zoo/main/assets/search.png";

  const FALLBACK_ICON = "🐾";

  /*
    Whack-A-Track remembers defeated tracks
    using this same localStorage key.
  */
  const REMOVED_TRACKS_KEY =
    "rizneyWhackedTracks";

  /*
    Pirate Duel unlocks POTTY TIME.
    The pirate game sets this to "true"
    after the correct answer is given.
  */
  const POTTY_TIME_UNLOCK_KEY =
    "pottyTimeUnlocked";

  /*
    Delaware Pirate Duel unlocks NICE & SLOW.
  */
  const NICE_AND_SLOW_UNLOCK_KEY =
    "niceAndSlowUnlocked";

  /*
    YOHO Pirate Duel unlocks
    A ROLLING STONE GATHERS NO MAS.
  */
  const ROLLING_STONE_UNLOCK_KEY =
    "rollingStoneUnlocked";

  /*
    =========================================================
    SHARED LINK — EARLY STARTUP CHECK
    =========================================================

    IMPORTANT:

    Normal visit:
      No ?song= parameter
      → normal intro behavior remains untouched.

    Shared song link:
      ?song=1 through ?song=222
      → suppress the normal intro/autoload immediately.

    This happens BEFORE DOMContentLoaded so the regular
    player startup has a chance to see these flags.
  */

  const sharedSongParams =
    new URLSearchParams(window.location.search);

  const sharedSongNumber =
    Number(sharedSongParams.get("song"));

  const hasValidSharedSong =
    sharedSongParams.has("song") &&
    Number.isInteger(sharedSongNumber) &&
    sharedSongNumber >= 1 &&
    sharedSongNumber <= 222;

  if (hasValidSharedSong) {
    window.__rizneySharedSongTarget = sharedSongNumber;

    window.autoload = false;
    window.skipAutoload = true;
    window.initialSong = null;
  }

  /*
    Special Whac-a-Track suggestions
    for two particularly suspicious tracks.
  */
  let whacTipLastSong = null;

  let whacTipTimer = null;

  /*
    Song information is kept in chronological order.
    The first entry [index 0] is your intro track, followed by your animal-icon songs.
  */

  const SONG_INFO = [
    ["The Monkey Island Mega Mix 'N' Mojo Intro", "Intro", "skull.png"],
    ["Unfinished Business", "Redemption", "skull.png"],
    ["The Age of Hypergamy ♒", "Renewal", "earthworm.png"],
    ["Babraham Lincoln", "Vision", "falcon.png"],
    ["Hijacked", "Awareness", "hawk.png"],
    ["Humblebrag", "Strength", "bull.png"],
    ["Delaware (Under The Sea)", "Wisdom", "whale.png"],
    ["Charlie Brown", "Persistence", "gopher.png"],
    ["July 4th (Domi-Nation)", "Freedom", "bald-eagle.png"],
    ["Chucky (Child's Play)", "Mischief", "red-panda.png"],
    ["Wish Fulfillment", "Abundance", "goldfish.png"],
    ["Magical Thinking", "Wonder", "unicorn.png"],
    ["Friends", "Connection", "toucan.png"],
    ["Blood is Thicker than Seawater", "Instinct", "leopard.png"],
    ["Seawater", "Patience", "crocodile.png"],
    ["Santa Cruz Kid", "Expression", "parrot.png"],
    ["Reputations", "Aspiration", "mt-goat.png"],
    ["Slow Ride", "Composure", "tortoise.png"],
    ["Norah Jones", "Calm", "capybara.png"],
    ["The Wolf Cup", "Innocence", "rabbit.png"],
    ["The Economy (World Cup)", "Adaptability", "gazelle.png"],
    ["Judge Doom (consent)", "Cunning", "weasel.png"],
    ["YOHO (Davy Jones)", "Flexibility", "octopus.png"],
    ["It's a Nice Day for a Shawshank Redemption", "Endurance", "mule.png"],
    ["The Way Love Goes", "Gentleness", "panda.png"],
    ["Vicarious World (The Mummy)", "Mortality", "bull-skull.png"],
    ["Mother", "Protection", "saber-tooth-tiger.png"],
    ["Blow The Lid Off", "Release", "pelican.png"],
    ["Shutter Island", "Perspective", "seagull.png"],
    ["#9", "Metamorphosis", "catepillar.png"],
    ["BAD APE 3 (JEWrassic PARK)", "Boldness", "baboon.png"],
    ["BAD APE 2", "Curiosity", "chimpanzee.png"],
    ["KING KONG", "Power", "gorilla.png"],
    ["Baby Belugas 🐬", "Imagination", "narwhal.png"],
    ["CHECKMATE", "Vigilance", "meercat.png"],
    ["I Know What You Are But What Am I?", "Discernment", "anteater.png"],
    ["M:I 9 (Mother's Day)", "Memory", "elephant.png"],
    ["/ʃpuːfɪn/ (Mothers Day)\"", "Grace", "swan.png"],
    ["Get With The Program", "Mystery", "raven.png"],
    ["Maps, Raps, Reality and Nancy Sinatra", "Balance", "zebra.png"],
    ["The Nutty Professors", "Preparation", "squirrel.png"],
    ["Land of the Slots 🎰", "Confidence", "flamingo.png"],
    ["THE ATM", "Regeneration", "lizard.png"],
    ["Cigarettes (CONSENT)", "Playfulness", "dolphin.png"],
    ["The Number 4", "Harmony", "siamese-twin-turtles.png"],
    ["The Imposters", "Awakening", "rooster.png"],
    ["MONSTERS INK (🎱)", "Uncertainty", "yeti.png"],
    ["The Bermuda Triangle (Strategy)", "Creation", "spider.png"],
    ["Sunday School", "Insight", "owl.png"],
    ["ON & OFF (binary)", "Duality", "anglefish.png"],
    ["Krypto-NITES (Friday)", "Resourcefulness", "possum.png"],
    ["5-LETTER WORDS", "Grounding", "tapir.png"],
    ["The Brave Little Bullshit Detector", "Diligence", "ant.png"],
    ["WHEEL OF FORTUNE", "Cycles", "hamster.png"],
    ["BLKMGK", "Adaptation", "flying-fox.png"],
    ["Nocturnal Comedy 🦉", "Transmutation", "medusa.png"],
    ["Devil Went Down pt III", "Independence", "coyote.png"],
    ["Devil Went Down pt II (Banana Republic)", "Sovereignty", "moose.png"],
    ["Hypocrites (Devil Went Down)", "Authenticity", "grouse.png"],
    ["Astrophage 2 (Atrophy)", "Momentum", "cheetah.png"],
    ["Astrophage (Me Tarzan you Jane)", "Vitality", "mandrill.png"],
    ["Planet of the Apes (Swords in the Stone Age)", "Humanity", "orangutan.png"],
    ["Underdog (Quid Pro Quo)", "Joy", "quokka.png"],
    ["The B Line 🚂", "Drive", "roadrunner.png"],
    ["Cognitive Dissonance", "Stillness", "sloth.png"],
    ["Celery Man (Somebody's Watching Me)", "Focus", "mantis.png"],
    ["DOGS (bargaining with terror)", "Loyalty", "wolf.png"],
    ["BAD (Jiminy Crickets)", "Resilience", "cricket.png"],
    ["The Hokey Pokey (GO)", "Exploration", "saiga.png"],
    ["Bear Necessities", "Introspection", "bear.png"],
    ["Mary Poppins (Spring Cleanin)", "Revival", "stork.png"],
    ["The Wicker Man (Easter Remix)", "Community", "bee.png"],
    ["Stag-Nation (in defense of R Kelly)", "Nobility", "elk.png"],
    ["Lethal Weapon", "Guardianship", "kangaroo.png"],
    ["Lababus (April Fools)", "Prankishness", "labubu.png"],
    ["Miss Thailand (50 Shades of Gay)", "Evolution", "werewolf.png"],
    ["The Alphabet", "Influence", "panther.png"],
    ["tombsTONES", "Alertness", "chihuahua.png"],
    ["The Jetsons", "Versatility", "jellyfish.png"],
    ["Poison Ivy", "Boundaries", "armadillo.png"],
    ["The Venus Fly Trap", "Steadiness", "venus-fly-trap.png"],
    ["Alligator Allegations (over-under)", "Reflex", "alligator.png"],
    ["Mr Sandman", "Solitude", "desert-fox.png"],
    ["BOYS R US (Sam the Manchild)", "Outlook", "giraffe.png"],
    ["I'm MAD as HELL", "Ferocity", "tazmanian-devil.png"],
    ["SCREAM (Vulture Culture)", "Rejuvenation", "vulture.png"],
    ["Power Of Love (Beatriz and the Beast)", "Veiledness", "sasquatch.png"],
    ["THE PLATYPUS", "Uniqueness", "platypus.png"],
    ["Bring Out Ya Dead (Buying Time)", "Cleansing", "toad.png"],
    ["The Lepri-Con (Rainbow Connection)", "Reinvention", "frog.png"],
    ["Sin Tax (Stanley Ipkiss)", "Revitalization", "gekko.png"],
    ["The Witch Doctor", "Enigma", "chupacabra.png"],
    ["Punch The Monkey (Cable Guy)", "Ingenuity", "capuchin-monkey.png"],
    ["The Swamp 🐸", "Becoming", "tadpole.png"],
    ["The Famous Mr Ed (Duality)", "Liberation", "horse.png"],
    ["Mars Attacks", "Otherness", "martian.png"],
    ["Initiation (Under the Boardwalk)", "Shelter", "crab.png"],
    ["Ghostwriters", "Adjustment", "chameleon.png"],
    ["Big Mouth Billy (Runaround)", "Depth", "bass.png"],
    ["Where's The Beef?", "Nurture", "cow.png"],
    ["American Nights (Iranian Days)", "Stamina", "camel.png"],
    ["Lemmings (Walt Desperate Studios)", "Conformity", "lemming.png"],
    ["Ay Carumba! (Love Is The Answer)", "Steadfastness", "woodpecker.png"],
    ["Hoist The Colors", "Adventure", "pirate.png"],
    ["Ordo Ab Chao", "Ascension", "eagle.png"],
    ["PIRAHNAS", "Impulse", "pirahna.png"],
    ["You Can Be", "Tenderness", "fawn.png"],
    ["Dont Look Down", "Defense", "hedgehog.png"],
    ["LADY LUCK", "Frolic", "otter.png"],
    ["Doubtfire (Suspicious Minds)", "Hidden", "mole.png"],
    ["The Rules (stampede)", "Migration", "wildebeest.png"],
    ["Bottle Shock (PEW)", "Limits", "skunk.png"],
    ["JEWS (Ante Up)", "Fearlessness", "shark.png"],
    ["F Resilience", "Rebirth", "butterfly.png"],
    ["Monkey Judge 🐒⚖", "Articulation", "howler-monkey.png"],
    ["Mask or No Mask (voodoo dolls)", "Display", "peacock.png"],
    ["6 Ways To Sunday", "Demarcation", "scorpion.png"],
    ["Tolerance", "Shedding", "snake.png"],
    ["Home On The Strange (Breathwork)", "Centering", "buffalo.png"],
    ["CATS DONT DANCE", "Self-Reliance", "mountain-lion.png"],
    ["Poetic Justice (oo-de-lally)", "Cleverness", "fox.png"],
    ["Lost Angeles (Alessia In Wonderland)", "Extinction", "tazmanian-tiger.png"],
    ["Romanticized Paranoia 🧛🏻‍♂️ (Home Improvement)", "Watchfulness", "lemur.png"],
    ["LOVEBIRDS (Feelings Arent Liabilities)", "Peace", "dove.png"],
    ["Hail Mary (The Playbook of Love)", "Delight", "hummingbird.png"],
    ["4th Quarter Fumble (There's no crying in Football)", "Humility", "donkey.png"],
    ["Dr. Hubris (Huberman)", "Tenacity", "badger.png"],
    ["It's not serious Batman", "Intuition", "bat.png"],
    ["Superbowl Limbo (business)", "Labor", "ox.png"],
    ["Play-Doh (Allegory of the Caveman)", "Inventiveness", "raccoon.png"],
    ["The Ring Leader (Bread & Circuses) 🎪", "Resolve", "beetle.png"],
    ["Hall Of Mirrors", "Withdrawal", "puma.png"],
    ["M(ICE) There Is No Trust in America", "Caution", "mouse.png"],
    ["Everybody Was Zodiac Fighting ♑ VS ♌", "Courage", "ram.png"],
    ["dONt feAR tHE BEaVeR", "Construction", "beaver.png"],
    ["Gatekeepers (Purgatory)", "Perception", "lynx.png"],
    ["M.M.A (Multicultural Monetized Aggression)", "Dominance", "komodo-dragon.png"],
    ["ZIP-A-Dee-Doo-Files", "Observation", "blue-heron.png"],
    ["ZIP-IT", "Lightheartedness", "seal.png"],
    ["Arkhétypes", "Recall", "seahorse.png"],
    ["I See Dead People", "Passage", "headless-horseman.png"],
    ["Suffering Sycophants", "Emergence", "cicada.png"],
    ["\"That's Life\"", "Impermanence", "fly.png"],
    ["Johatsu (蒸发) Skumm Bar", "Ambiguity", "eel.png"],
    ["Pimps Dont Cry", "Individuality", "minx.png"],
    ["EVA?", "Softness", "koala.png"],
    ["Enjoyin' My Coffee", "Serenity", "manatee.png"],
    ["BERNIE BANK LOAN", "Reemergence", "dung-beetle.png"],
    ["Doggy Doors (Technology)", "Bravery", "boar.png"],
    ["Kingpin (Reputations)", "Potency", "anaconda.png"],
    ["Assimilation (Addam's Family)", "Acceptance", "banana-slug.png"],
    ["EMINEMULATORS", "Survival", "rat.png"],
    ["MLK", "Malleability", "jackal.png"],
    ["41", "Rhythm", "woodchuck.png"],
    ["YEAR ONE (something to hold onto)", "Doggedness", "yak.png"],
    ["EMULATORS (day one)", "Restoration", "kudu.png"],
    ["Standing in the Light", "Illumination", "chicken.png"],
    ["WALK THE PLANK 🏴‍☠️", "Profundity", "squid.png"],
    ["Mickey Rourke (All Or Nothing)", "Hardiness", "hippo.png"],
    ["DJ Gentle Dental", "Durability", "walrus.png"],
    ["Virtual Insanity", "Responsiveness", "muskrat.png"],
    ["Satanic Park", "Rebellion", "satan.png"],
    ["Beware the WOOzles", "Creativity", "jackalope.png"],
    ["Dont Lose Your Dinosaur 🦖 (Innocence)", "Urge", "t-rex.png"],
    ["Jafar", "Shift", "cobra.png"],
    ["Public Domain (Betty Boop)", "Remembrance", "dodo.png"],
    ["Petey Quills", "Thresholds", "porcupine.png"],
    ["To The Pain 🍻 (Hard ⚔ Times)", "Grit", "warthog.png"],
    ["The Village Makes The Villain", "Agency", "bobcat.png"],
    ["WOOzy", "Forbearance", "shoebill.png"],
    ["Sunny", "Contentment", "kiwi.png"],
    ["The Chains", "Safekeeping", "oyster.png"],
    ["Davy Jones and Me", "Simplicity", "sparrow.png"],
    ["CRINGE", "Receptivity", "blob-fish.png"],
    ["ELF 2", "Guidance", "reindeer.png"],
    ["Gremlins 2", "Aloneness", "polar-bear.png"],
    ["Imposters (Wolves in Sheeps Clothing)", "Judgment", "snowy-owl.png"],
    ["Christmas Means CARNAGE!!", "Devotion", "goose.png"],
    ["Pep Love", "Plenty", "pig.png"],
    ["Don't Fence Me In (Macauley Culkin Syndrome)", "Potential", "larva.png"],
    ["Surfin U.S.A 🏄‍♀", "Autonomy", "sea-lion.png"],
    ["And a Chocolate Chippy Cookie", "Attentiveness", "mongoose.png"],
    ["Good Grief", "Gratitude", "turkey.png"],
    ["Fixer Upper", "Kindness", "deer.png"],
    ["Wish Worth Making", "Concealed", "clam.png"],
    ["Another Illudium Q-36 Explosive Space Modulator", "Escape", "ostrich.png"],
    ["Stranger Danger", "Seclusion", "snow-leopard.png"],
    ["HUP", "Constancy", "mole-rat.png"],
    ["Groundhog's Day", "Recurrence", "groundhog.png"],
    ["Mercy", "Tranquility", "pigeon.png"],
    ["Apologize", "Accountability", "quail.png"],
    ["CLONE WARS", "Multiplicity", "hydra.png"],
    ["BOWSER JR", "Shielding", "snapping-turtle.png"],
    ["Bluebird of Happiness", "Happiness", "bluejay.png"],
    ["The Illludium Q-36 Explosive Space Modulator", "Inquiry", "emu.png"],
    ["StarDucks 🦆 The DuckTator", "Agility", "mallard.png"],
    ["Chucky...", "Resurgence", "lobster.png"],
    ["My Creation (Pitchforks) A.I Frankenstein", "Origination", "monster.png"],
    ["We dont need no Helicopters we're a family", "Possibility", "egg.png"],
    ["Duck Blur", "Elasticity", "duck.png"],
    ["I love you but you dont know what you're talking about", "Compassion", "alpaca.png"],
    ["Nice & Slow", "Calmness", "snail.png"],
    ["Invisible", "Kinship", "penguin.png"],
    ["JUMANJI'D", "Fortitude", "rhino.png"],
    ["ELVIS OF BAGHDAD", "Staying Power", "llama.png"],
    ["6 6 6 7", "Sacrifice", "goat.png"],
    ["MUTANTS", "Fierceness", "wolverine.png"],
    ["Manny in the Mirror", "Ancestry", "woolly-mammoth.png"],
    ["H(YE)NZ", "Scavenging", "hyena.png"],
    ["Skinny Bones", "Heritage", "neanderthal.png"],
    ["I Get By With A Little Help From Falkor", "Reframing", "dragonfly.png"],
    ["What Is Friend?", "Friendship", "wombat.png"],
    ["The Great Conjunction (DEC 21st 2020)", "Perseverance", "salmon.png"],
    ["ZOOCHOSIS", "Purity", "lamb.png"],
    ["CANTE-SE", "Reawakening", "newt.png"],
    ["A Rolling Stone Gathers NO MAS", "Transience", "lion-skull.png"],
    ["Return of the King", "Leadership", "lion.png"],
    ["POTTY TIME", "Purification", "shrimp.png"],
    ["ELMOrtos 💀", "Finitude", "mouse-skull.png"],
    ["Hurry Up and Wait", "Ephemerality", "bear-skull.png"],
    ["Puss' Eulogy", "Reckoning", "skull-hyena.png"],
    ["CROW XING", "Foresight", "crow.png"],
    ["Divine Comedy (outro)", "Discovery", "aardvark.png"]
  ];

  /* =========================================================
     STYLES (Includes Share Notification Toast)
     ========================================================= */

  function addStyles() {
    if (document.getElementById("animal-icon-styles")) return;

    const style = document.createElement("style");
    style.id = "animal-icon-styles";

    style.textContent = `

      #archive-search-container {
        position: relative;
        width: calc(100% - 58px);
        margin-left: 58px;
        margin-bottom: 20px;
        box-sizing: border-box;
      }

      #archive-search-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
      }

      #archive-search {
        width: 100%;
        padding: 12px 16px;
        background: transparent;
        border: 2px solid rgba(150, 150, 150, 0.4);
        border-radius: 12px;
        color: var(--bright-purple, #e0aaff);
        font-family: inherit;
        font-size: .95rem;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      #archive-search::placeholder {
        color: rgba(224, 170, 255, 0.5);
      }

      #archive-search:focus {
        border-color: var(--bright-gold, #f5d76e);
        background: rgba(33, 16, 46, 0.6);
      }

      .search-magnifying-glass-column {
        position: absolute;
        left: calc(
          -1 * (
            (
              (100vw - min(100vw - 24px, 900px)) / 2 + 58px
            ) / 2
          ) - 29px
        );
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        color: var(--gold, #d4af37);
        font-size: 1.1rem;
        line-height: 1;
        pointer-events: none;
        z-index: 0 !important;
        box-sizing: border-box;
      }

      .search-magnifying-glass-column img {
        display: block;
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      #search-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        width: 100%;
        max-height: 280px;
        overflow-y: auto;
        background: linear-gradient(145deg, #21102e, #090509);
        border: 2px solid var(--gold, #d4af37);
        border-radius: 12px;
        z-index: 100;
        display: none;
        box-sizing: border-box;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      }

      #search-dropdown.active {
        display: block;
      }

      .search-result-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        color: var(--bright-purple, #e0aaff);
        text-decoration: none;
        font-size: .88rem;
        transition: background 0.15s ease;
      }

      .search-result-item:last-child {
        border-bottom: none;
      }

      .search-result-item:hover {
        background: rgba(212, 175, 55, 0.12);
        color: var(--bright-gold, #f5d76e);
      }

      .search-result-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 10px;
      }

      .search-result-meta {
        font-family: Georgia, "Times New Roman", serif;
        font-style: italic;
        font-size: .75rem;
        opacity: 0.7;
        white-space: nowrap;
      }

      #song-list .song {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 62px;
        gap: 10px;
        width: calc(100% - 58px);
        min-width: 0;
        margin-left: 58px;
        align-items: center;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
      }

      #song-list .song-number {
        position: absolute;
        left: calc(
          -1 * (
            (
              (100vw - min(100vw - 24px, 900px)) / 2 + 58px
            ) / 2
          ) - 29px
        );
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        color: var(--gold, #d4af37);
        background: transparent;
        border: 0;
        outline: 0;
        box-shadow: none;
        font-weight: 700;
        font-size: 1rem;
        line-height: 1;
        padding: 0;
        margin: 0;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
        z-index: 0 !important;
        box-sizing: border-box;
        text-decoration: none;
      }

      #song-list .song-number:hover,
      #song-list .song-number:focus {
        color: var(--bright-gold, #f5d76e);
        text-decoration: none;
      }

      #song-list .song .play {
        display: none;
      }

      #song-list .song-title {
        min-width: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-self: stretch;
        text-align: left;
        box-sizing: border-box;
        line-height: 1.2;
        color: var(--bright-purple, #e0aaff);
        cursor: pointer;
      }

      #song-list .song-title:focus-visible {
        outline: 2px solid var(--bright-gold, #f5d76e);
        outline-offset: 3px;
        border-radius: 4px;
      }

      #song-list .song.playing .song-title,
      #song-list .song.playing .song-title small {
        color: var(--bright-gold, #f5d76e) !important;
      }

      #song-list .song-title small {
        display: block;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 4px;
        line-height: 1.2;
        color: var(--bright-purple, #e0aaff);
        font-family: Georgia, "Times New Roman", serif;
        font-size: .72rem;
        font-style: italic;
      }

      #song-list .animal-button {
        width: 62px;
        height: 62px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        box-sizing: border-box;
      }

      #song-list .animal-button img {
        display: block;
        width: 58px;
        height: 58px;
        object-fit: contain;
        object-position: center;
        border: 0;
        background: transparent;
        box-sizing: border-box;
        transition: transform 0.15s ease;
      }

      #song-list .animal-button:hover img {
        transform: scale(1.08);
      }

      /*
        =======================================================
        SHARE NOTIFICATION TOAST
        =======================================================
      */

      #rizney-share-toast {
        position: fixed;
        left: 50%;
        bottom: 120px;
        transform: translateX(-50%) translateY(20px);
        background: linear-gradient(145deg, #21102e, #090509);
        border: 2px solid var(--bright-gold, #f5d76e);
        color: var(--bright-gold, #f5d76e);
        padding: 10px 18px;
        border-radius: 12px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 0.9rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
        z-index: 99999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        text-align: center;
      }

      #rizney-share-toast.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      /*
        =======================================================
        🔒 POTTY TIME — LOCKED VISUAL
        =======================================================
      */

      #song-list .song.rizney-potty-locked .song-title,
      #song-list .song.rizney-potty-locked .song-title small {
        color: rgba(180, 180, 180, 0.45) !important;
      }

      #song-list .song.rizney-potty-locked .song-number {
        color: rgba(180, 180, 180, 0.4) !important;
      }

      #song-list .song.rizney-potty-locked .animal-button {
        opacity: 0.35;
        filter: grayscale(1);
      }

      #song-list .song.rizney-potty-locked {
        cursor: not-allowed;
      }

      #song-list .song.rizney-potty-locked .song-title,
      #song-list .song.rizney-potty-locked .animal-button,
      #song-list .song.rizney-potty-locked .song-number {
        cursor: not-allowed;
      }

      /*
        =======================================================
        🔒 NICE & SLOW — LOCKED VISUAL
        =======================================================
      */

      #song-list .song.rizney-nice-slow-locked .song-title,
      #song-list .song.rizney-nice-slow-locked .song-title small {
        color: rgba(180, 180, 180, 0.45) !important;
      }

      #song-list .song.rizney-nice-slow-locked .song-number {
        color: rgba(180, 180, 180, 0.4) !important;
      }

      #song-list .song.rizney-nice-slow-locked .animal-button {
        opacity: 0.35;
        filter: grayscale(1);
      }

      #song-list .song.rizney-nice-slow-locked {
        cursor: not-allowed;
      }

      #song-list .song.rizney-nice-slow-locked .song-title,
      #song-list .song.rizney-nice-slow-locked .animal-button,
      #song-list .song.rizney-nice-slow-locked .song-number {
        cursor: not-allowed;
      }

      /*
        =======================================================
        🔒 A ROLLING STONE GATHERS NO MAS — LOCKED VISUAL
        =======================================================
      */

      #song-list .song.rizney-rolling-stone-locked .song-title,
      #song-list .song.rizney-rolling-stone-locked .song-title small {
        color: rgba(180, 180, 180, 0.45) !important;
      }

      #song-list .song.rizney-rolling-stone-locked .song-number {
        color: rgba(180, 180, 180, 0.4) !important;
      }

      #song-list .song.rizney-rolling-stone-locked .animal-button {
        opacity: 0.35;
        filter: grayscale(1);
      }

      #song-list .song.rizney-rolling-stone-locked {
        cursor: not-allowed;
      }

      #song-list .song.rizney-rolling-stone-locked .song-title,
      #song-list .song.rizney-rolling-stone-locked .animal-button,
      #song-list .song.rizney-rolling-stone-locked .song-number {
        cursor: not-allowed;
      }

      /*
        =======================================================
        WHAC-A-TRACK SONG TIPS
        =======================================================
      */

      #whac-song-tip {
        position: fixed;
        left: 50%;
        bottom: 180px;
        transform: translateX(-50%) translateY(20px);
        width: min(90%, 420px);
        box-sizing: border-box;
        padding: 14px 16px;
        background: linear-gradient(145deg, #21102e, #090509);
        border: 2px solid var(--gold, #d4af37);
        border-radius: 12px;
        color: var(--bright-purple, #e0aaff);
        text-align: center;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 8px 24px rgba(0,0,0,.65);
        z-index: 99998;
        opacity: 0;
        pointer-events: none;
        transition:
          opacity .25s ease,
          transform .25s ease;
      }

      #whac-song-tip.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }

      #whac-song-tip strong {
        display: block;
        color: var(--bright-gold, #f5d76e);
        font-size: 1rem;
        line-height: 1.35;
        margin-bottom: 8px;
      }

      #whac-song-tip button {
        padding: 8px 14px;
        background: var(--purple, #c084fc);
        color: #120b18;
        border: 0;
        border-radius: 5px;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 700;
        cursor: pointer;
      }

      #whac-song-tip button:hover {
        background: var(--bright-purple, #e0aaff);
      }

      #cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 9px;
        margin: 0 0 22px;
      }

      #cards .card {
        min-width: 0;
        min-height: 0;
        box-sizing: border-box;
        padding: 9px 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        color: var(--bright-purple, #e0aaff);
        background: linear-gradient(145deg, #21102e, #090509);
        border: 2px solid var(--gold, #d4af37);
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        font: inherit;
        transition:
          transform .12s ease,
          background .12s ease,
          border-color .12s ease;
        -webkit-tap-highlight-color: transparent;
      }

      #cards .card:hover {
        background: linear-gradient(145deg, #2b1540, #100817);
        border-color: var(--bright-gold, #f5d76e);
        transform: translateY(-2px);
      }

      #cards .card:active {
        transform: translateY(0);
      }

      #cards .card:focus-visible {
        outline: 2px solid var(--bright-gold, #f5d76e);
        outline-offset: 3px;
      }

      #cards .card .symbol,
      #cards .card strong,
      #cards .card a {
        display: none !important;
      }

      #cards .card-animal-icon {
        display: block;
        width: 104px;
        height: 104px;
        margin: 0 auto 5px;
        object-fit: contain;
        object-position: center;
        border: 0;
        background: transparent;
        box-sizing: border-box;
        flex: 0 0 auto;
      }

      #cards .card-animal-name {
        display: block;
        width: 100%;
        max-width: 100%;
        margin: 0;
        color: var(--bright-gold, #f5d76e);
        font-family: Georgia, "Times New Roman", serif;
        font-size: .78rem;
        font-weight: 700;
        line-height: 1.1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      @media (max-width: 700px) {

        #archive-search-container {
          width: calc(100% - 42px);
          margin-left: 42px;
        }

        .search-magnifying-glass-column {
          left: calc(
            -1 * (
              (
                (100vw - min(100vw - 24px, 900px)) / 2 + 42px
              ) / 2
            ) - 21px
          );
          width: 42px;
          font-size: 1rem;
        }

        #song-list .song {
          grid-template-columns: minmax(0, 1fr) 54px;
          gap: 8px;
          width: calc(100% - 42px);
          margin-left: 42px;
          padding-top: 3px;
          padding-bottom: 3px;
          padding-left: 8px;
          padding-right: 8px;
        }

        #song-list .song-number {
          left: calc(
            -1 * (
              (
                (100vw - min(100vw - 24px, 900px)) / 2 + 42px
              ) / 2
            ) - 21px
          );
          width: 42px;
          font-size: .9rem;
          z-index: 0 !important;
        }

        #song-list .animal-button {
          width: 54px;
          height: 54px;
        }

        #song-list .animal-button img {
          width: 50px;
          height: 50px;
        }

        #song-list .song-title {
          font-size: .82rem;
        }

        #song-list .song-title small {
          font-size: .67rem;
        }

        #cards {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
          margin-top: 0;
          margin-bottom: 18px;
        }

        #cards .card {
          padding: 6px 4px;
          border-radius: 10px;
        }

        #cards .card-animal-icon {
          width: 76px;
          height: 76px;
          margin-bottom: 4px;
        }

        #cards .card-animal-name {
          font-size: .65rem;
        }
      }

      @media (max-width: 380px) {

        #cards {
          gap: 5px;
        }

        #cards .card {
          padding: 5px 3px;
        }

        #cards .card-animal-icon {
          width: 66px;
          height: 66px;
        }

        #cards .card-animal-name {
          font-size: .59rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     SHARE LINK NOTIFICATION TOAST (CLEAN URL ONLY)
     ========================================================= */

  let toastTimer = null;

  function showShareToast(message) {
    let toast = document.getElementById("rizney-share-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "rizney-share-toast";
      document.body.appendChild(toast);
    }

    clearTimeout(toastTimer);

    toast.textContent = message;

    requestAnimationFrame(() => {
      toast.classList.add("visible");
    });

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("visible");
    }, 3000);
  }

  function handleShareClick(row, songTitle) {
    if (
      (isRollingStoneRow(row) && !isRollingStoneUnlocked()) ||
      (isNiceAndSlowRow(row) && !isNiceAndSlowUnlocked()) ||
      (isPottyTimeRow(row) && !isPottyTimeUnlocked())
    ) {
      showShareToast("🔒 This song is currently locked!");
      return;
    }

    const songIndex = row.dataset.songIndex || "";
    const cleanUrl = `${window.location.origin}${window.location.pathname}?song=${songIndex}`;

    copyToClipboard(cleanUrl);
  }

  function copyToClipboard(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showShareToast(`🔗 Copied link: ${url}`);
      }).catch(() => {
        fallbackCopyText(url);
      });
    } else {
      fallbackCopyText(url);
    }
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      showShareToast(`🔗 Copied link: ${text}`);
    } catch (err) {
      showShareToast("⚠️ Could not copy link automatically");
    }
    document.body.removeChild(textarea);
  }

  /* =========================================================
     SHARED LINK (?song=X)
     ========================================================= */

  function handleSharedSongParameter() {
    /*
      If there is no valid shared-song link, do absolutely
      nothing. This preserves normal intro behavior.
    */

    if (!hasValidSharedSong) {
      return;
    }

    /*
      This number represents the ACTUAL archive song number.

      ?song=1 → rows[0] → Unfinished Business
      ?song=2 → rows[1] → The Age of Hypergamy
      ...
      ?song=222 → rows[221] → Divine Comedy

      The intro is NOT part of this numbering.
    */

    const targetSongNumber = sharedSongNumber;

    window.__rizneySharedSongTarget = targetSongNumber;

    /*
      Re-apply the startup suppression here as well,
      after the DOM is ready.
    */
    window.autoload = false;
    window.skipAutoload = true;
    window.initialSong = null;

    /*
      Stop any ordinary media elements that may have started.
      This prevents the normal intro from continuing while
      the shared song is being selected.
    */
    const audioElements =
      document.querySelectorAll("audio, video");

    audioElements.forEach(el => {
      try {
        el.pause();
        el.removeAttribute("src");
        el.load();
      } catch (error) {}
    });

    /*
      Wait for the actual archive rows to exist.
    */
    const checkReadyInterval = window.setInterval(() => {
      const rows = songRows();

      /*
        We need at least targetSongNumber rows because
        song #1 is rows[0], not the intro.
      */
      if (rows.length < targetSongNumber) {
        return;
      }

      window.clearInterval(checkReadyInterval);

      /*
        CRITICAL MAPPING:

        Song 1 → rows[0]
        Song 2 → rows[1]
        Song 222 → rows[221]

        This intentionally skips the intro.
      */
      const targetRow =
        rows[targetSongNumber - 1];

      if (!targetRow) {
        return;
      }

      targetRow.dataset.songIndex =
        String(targetSongNumber);

      /*
        Scroll directly to the shared song.
      */
      targetRow.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      /*
        -------------------------------------------------------
        SHARED-LINK AUTOPLAY
        -------------------------------------------------------

        Give the normal player startup a moment to finish,
        then explicitly play the shared song.

        IMPORTANT:

        If the visitor interacts with ANY normal control
        before this happens, cancel the pending shared-song
        playback.

        This prevents the shared song from suddenly coming
        back after pressing RANDOM, NEXT, PREVIOUS, CARDS,
        WHAC-A-TRACK, etc.
      */

      let sharedSongCancelled = false;

      const cancelSharedSong = () => {
        sharedSongCancelled = true;

        document.removeEventListener(
          "click",
          cancelSharedSong
        );

        document.removeEventListener(
          "keydown",
          cancelSharedSong
        );
      };

      /*
        Listen for a real user interaction while the shared
        song is waiting to take control.

        We intentionally do NOT prevent the user's action.
        We only cancel the pending shared-song autoplay.
      */
      document.addEventListener(
        "click",
        cancelSharedSong,
        { once: true }
      );

      document.addEventListener(
        "keydown",
        cancelSharedSong,
        { once: true }
      );

      /*
        Give the existing player startup time to settle.
        Then explicitly play the requested archive song,
        unless the visitor already chose another action.
      */
      window.setTimeout(() => {
        if (sharedSongCancelled) {
          return;
        }

        document.removeEventListener(
          "click",
          cancelSharedSong
        );

        document.removeEventListener(
          "keydown",
          cancelSharedSong
        );

        /*
          Explicitly select the shared archive row.

          This is the important part that was missing from
          the current version of the function.
        */
        playSongFromRow(targetRow);

      }, 900);

    }, 100);

    /*
      Safety timeout so the watcher can never run forever.
    */
    window.setTimeout(() => {
      window.clearInterval(checkReadyInterval);
    }, 10000);
  }

  /* =========================================================
     WHACK-A-TRACK SONG TIPS
     ========================================================= */

  function showWhacSongTip(songNumber) {
    const messages = {
      4: {
        title: "This track is kinda whack... 😸",
        button: "PLAY WHAC-A-TRACK"
      },

      9: {
        title: "This track is definitely whack!! 😸",
        button: "PLAY WHAC-A-TRACK"
      }
    };

    const message = messages[songNumber];

    if (!message) {
      return;
    }

    let tip = document.getElementById("whac-song-tip");

    if (!tip) {
      tip = document.createElement("div");
      tip.id = "whac-song-tip";
      document.body.appendChild(tip);
    }

    clearTimeout(whacTipTimer);

    tip.innerHTML = `
      <strong>${message.title}</strong>
      <button type="button" id="whac-song-tip-button">
        ${message.button}
      </button>
    `;

    const button = document.getElementById("whac-song-tip-button");

    if (button) {
      button.onclick = () => {
        const whackButton = document.getElementById("whack-track");

        if (whackButton) {
          whackButton.click();
        }

        tip.classList.remove("visible");
      };
    }

    requestAnimationFrame(() => {
      tip.classList.add("visible");
    });

    whacTipTimer = window.setTimeout(() => {
      tip.classList.remove("visible");
    }, 7000);
  }

  function checkForWhacSongTip() {
    const nowPlaying = document.getElementById("now-playing");

    if (!nowPlaying) {
      return;
    }

    const text = nowPlaying.textContent.toLowerCase();

    let currentSongNumber = null;

    if (text.includes("hijacked")) {
      currentSongNumber = 4;
    }

    if (text.includes("chucky (child's play)")) {
      currentSongNumber = 9;
    }

    if (currentSongNumber === null) {
      whacTipLastSong = null;
      return;
    }

    if (whacTipLastSong === currentSongNumber) {
      return;
    }

    whacTipLastSong = currentSongNumber;

    showWhacSongTip(currentSongNumber);
  }

  /* =========================================================
     WHACK-A-TRACK ROADWORK RESTORATION
     ========================================================= */

  function getSavedWhackedTracks() {
    try {
      const raw = localStorage.getItem(REMOVED_TRACKS_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function getSongIdForNumber(songNumber) {
    if (!songNumber || !Number.isInteger(songNumber)) {
      return null;
    }

    try {
      if (typeof ids !== "undefined" && ids[songNumber - 1]) {
        return String(ids[songNumber - 1]);
      }
    } catch (error) {}

    return null;
  }

  function restoreRoadworkRows() {
    const saved = new Set(getSavedWhackedTracks());

    if (!saved.size) {
      return;
    }

    document.querySelectorAll("#song-list .song").forEach(row => {
      const songNumber = Number(row.dataset.songIndex);

      if (!Number.isInteger(songNumber) || songNumber < 1) {
        return;
      }

      const songId = getSongIdForNumber(songNumber);

      if (songId && saved.has(songId)) {
        row.classList.add("rizney-roadwork");
        row.dataset.rizneyRoadwork = "true";
      }
    });
  }

  function setupRoadworkWatching() {
    const songList = document.getElementById("song-list");

    if (!songList) {
      return;
    }

    const observer = new MutationObserver(mutations => {
      let changed = false;

      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          changed = true;
          break;
        }
      }

      if (changed) {
        requestAnimationFrame(() => {
          updateSongRowNumbersOnly();
          restoreRoadworkRows();
          updatePottyTimeLock();
          updateNiceAndSlowLock();
          updateRollingStoneLock();
        });
      }
    });

    observer.observe(songList, {
      childList: true,
      subtree: true
    });

    restoreRoadworkRows();
  }

  function updateSongRowNumbersOnly() {
    const rows = songRows();

    rows.forEach((row, index) => {
      row.dataset.songIndex = String(index + 1);
    });
  }

  /* =========================================================
     POTTY TIME UNLOCK
     ========================================================= */

  function isPottyTimeUnlocked() {
    return localStorage.getItem(POTTY_TIME_UNLOCK_KEY) === "true";
  }

  function isPottyTimeRow(row) {
    if (!row) {
      return false;
    }

    const songIndex = Number(row.dataset.songIndex);

    if (!Number.isInteger(songIndex) || songIndex < 1) {
      return false;
    }

    const info = SONG_INFO[songIndex];

    return info && info[0] === "POTTY TIME";
  }

  function isPottyTimeSongNumber(songNumber) {
    if (!Number.isInteger(songNumber) || songNumber < 1) {
      return false;
    }

    const info = SONG_INFO[songNumber];

    return info && info[0] === "POTTY TIME";
  }

  function updatePottyTimeLock() {
    const rows = songRows();

    rows.forEach(row => {
      if (!isPottyTimeRow(row)) {
        return;
      }

      const locked = !isPottyTimeUnlocked();

      row.classList.toggle("rizney-potty-locked", locked);
    });
  }

  let pottyTimeLockWatcher = null;

  function setupPottyTimeLockWatching() {
    updatePottyTimeLock();

    if (isPottyTimeUnlocked()) {
      return;
    }

    pottyTimeLockWatcher = window.setInterval(() => {
      updatePottyTimeLock();

      if (isPottyTimeUnlocked()) {
        window.clearInterval(pottyTimeLockWatcher);
        pottyTimeLockWatcher = null;
        updatePottyTimeLock();
      }
    }, 500);
  }

  /* =========================================================
     NICE & SLOW UNLOCK
     ========================================================= */

  function isNiceAndSlowUnlocked() {
    return localStorage.getItem(NICE_AND_SLOW_UNLOCK_KEY) === "true";
  }

  function isNiceAndSlowRow(row) {
    if (!row) {
      return false;
    }

    const songIndex = Number(row.dataset.songIndex);

    if (!Number.isInteger(songIndex) || songIndex < 1) {
      return false;
    }

    const info = SONG_INFO[songIndex];

    return info && info[0] === "Nice & Slow";
  }

  function isNiceAndSlowSongNumber(songNumber) {
    if (!Number.isInteger(songNumber) || songNumber < 1) {
      return false;
    }

    const info = SONG_INFO[songNumber];

    return info && info[0] === "Nice & Slow";
  }

  function updateNiceAndSlowLock() {
    const rows = songRows();

    rows.forEach(row => {
      if (!isNiceAndSlowRow(row)) {
        return;
      }

      row.classList.toggle(
        "rizney-nice-slow-locked",
        !isNiceAndSlowUnlocked()
      );
    });
  }

  /* =========================================================
     A ROLLING STONE GATHERS NO MAS UNLOCK
     ========================================================= */

  function isRollingStoneUnlocked() {
    return localStorage.getItem(ROLLING_STONE_UNLOCK_KEY) === "true";
  }

  function isRollingStoneRow(row) {
    if (!row) {
      return false;
    }

    const songIndex = Number(row.dataset.songIndex);

    if (!Number.isInteger(songIndex) || songIndex < 1) {
      return false;
    }

    const info = SONG_INFO[songIndex];

    return info && info[0] === "A Rolling Stone Gathers NO MAS";
  }

  function isRollingStoneSongNumber(songNumber) {
    if (!Number.isInteger(songNumber) || songNumber < 1) {
      return false;
    }

    const info = SONG_INFO[songNumber];

    return info && info[0] === "A Rolling Stone Gathers NO MAS";
  }

  function updateRollingStoneLock() {
    const rows = songRows();

    rows.forEach(row => {
      if (!isRollingStoneRow(row)) {
        return;
      }

      row.classList.toggle(
        "rizney-rolling-stone-locked",
        !isRollingStoneUnlocked()
      );
    });
  }

  /* =========================================================
     HELPERS
     ========================================================= */

  function iconLabel(filename) {
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function iconFilename(filename) {
    if (filename === "cidada.png") {
      return "cicada.png";
    }

    if (filename === "shrimp") {
      return "shrimp.png";
    }

    return filename;
  }

  function fallback() {
    const span = document.createElement("span");

    span.textContent = FALLBACK_ICON;
    span.style.display = "flex";
    span.style.alignItems = "center";
    span.style.justifyContent = "center";
    span.style.fontSize = "2rem";
    span.style.lineHeight = "1";

    return span;
  }

  function makeImage(filename, songTitle) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "animal-button";

    const actualFilename = iconFilename(filename);
    const label = iconLabel(actualFilename);

    button.title = `Copy link for: ${songTitle}`;
    button.setAttribute("aria-label", `Copy link for ${songTitle}`);

    const img = document.createElement("img");

    img.className = "animal-icon";
    img.alt = label;
    img.loading = "lazy";
    img.decoding = "async";

    img.src = RAW_PREFIX + encodeURIComponent(actualFilename);

    img.onerror = () => {
      img.replaceWith(fallback());
    };

    button.appendChild(img);

    return button;
  }

  function songRows() {
    return Array.from(document.querySelectorAll("#song-list .song"));
  }

  function playSongFromRow(row) {
    if (!row) return;

    if (isRollingStoneRow(row) && !isRollingStoneUnlocked()) {
      row.classList.add("rizney-rolling-stone-locked");
      return;
    }

    if (isRollingStoneRow(row)) {
      row.classList.remove("rizney-rolling-stone-locked");
    }

    if (isNiceAndSlowRow(row) && !isNiceAndSlowUnlocked()) {
      row.classList.add("rizney-nice-slow-locked");
      return;
    }

    if (isNiceAndSlowRow(row)) {
      row.classList.remove("rizney-nice-slow-locked");
    }

    if (isPottyTimeRow(row) && !isPottyTimeUnlocked()) {
      row.classList.add("rizney-potty-locked");
      return;
    }

    if (isPottyTimeRow(row)) {
      row.classList.remove("rizney-potty-locked");
    }

    const playButton = row.querySelector(".play");

    if (playButton) {
      playButton.click();
    }
  }

  /* =========================================================
     SEARCH BAR CREATION & LOGIC
     ========================================================= */

  function setupSearch() {
    const songListContainer = document.getElementById("song-list");

    if (!songListContainer || document.getElementById("archive-search-container")) {
      return;
    }

    const container = document.createElement("div");
    container.id = "archive-search-container";

    const wrapper = document.createElement("div");
    wrapper.id = "archive-search-wrapper";

    const icon = document.createElement("span");
    icon.className = "search-magnifying-glass-column";

    const iconImage = document.createElement("img");
    iconImage.src = SEARCH_ICON;
    iconImage.alt = "";
    iconImage.width = 20;
    iconImage.height = 20;
    iconImage.loading = "lazy";
    iconImage.decoding = "async";

    icon.appendChild(iconImage);

    const input = document.createElement("input");
    input.type = "search";
    input.id = "archive-search";
    input.placeholder = "Search songs, keywords, or animals...";
    input.setAttribute("autocomplete", "off");

    const dropdown = document.createElement("div");
    dropdown.id = "search-dropdown";

    wrapper.appendChild(icon);
    wrapper.appendChild(input);

    container.appendChild(wrapper);
    container.appendChild(dropdown);

    songListContainer.parentNode.insertBefore(container, songListContainer);

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase().trim();

      dropdown.innerHTML = "";

      if (query.length === 0) {
        dropdown.classList.remove("active");
        return;
      }

      const matches = [];

      SONG_INFO.forEach((info, index) => {
        const title = info[0].toLowerCase();
        const keyword = info[1].toLowerCase();
        const animal = iconLabel(iconFilename(info[2])).toLowerCase();

        if (
          title.includes(query) ||
          keyword.includes(query) ||
          animal.includes(query)
        ) {
          matches.push({
            index,
            title: info[0],
            keyword: info[1],
            animal: iconLabel(iconFilename(info[2]))
          });
        }
      });

      if (matches.length === 0) {
        const noResult = document.createElement("div");
        noResult.className = "search-result-item";
        noResult.style.justifyContent = "center";
        noResult.style.fontStyle = "italic";
        noResult.textContent = "No matching songs found";

        dropdown.appendChild(noResult);
        dropdown.classList.add("active");
        return;
      }

      matches.slice(0, 15).forEach(match => {
        const item = document.createElement("a");
        item.className = "search-result-item";
        item.href = "#";

        const textSpan = document.createElement("span");
        textSpan.className = "search-result-text";
        textSpan.textContent = `♫ ${match.title}`;

        const metaSpan = document.createElement("span");
        metaSpan.className = "search-result-meta";
        metaSpan.textContent = `${match.animal} • ${match.keyword}`;

        item.appendChild(textSpan);
        item.appendChild(metaSpan);

        item.addEventListener("click", event => {
          event.preventDefault();
          dropdown.classList.remove("active");
          input.value = "";

          const rows = songRows();
          const targetRow = rows[match.index - 1];

          if (targetRow) {
            targetRow.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            playSongFromRow(targetRow);
          }
        });

        dropdown.appendChild(item);
      });

      dropdown.classList.add("active");
    });

    document.addEventListener("click", event => {
      if (!container.contains(event.target)) {
        dropdown.classList.remove("active");
      }
    });
  }

  /* =========================================================
     SONG NUMBERS
     ========================================================= */

  function makeSongNumber(row, index) {
    const oldNumber = row.querySelector(".song-number");

    if (!oldNumber) return;

    if (oldNumber.tagName === "A") {
      return;
    }

    const numberLink = document.createElement("a");
    numberLink.className = "song-number";
    numberLink.href = "#";
    numberLink.textContent = oldNumber.textContent.trim();
    numberLink.setAttribute("aria-label", `Play song ${index + 2}`);

    numberLink.addEventListener("click", event => {
      event.preventDefault();
      playSongFromRow(row);
    });

    oldNumber.replaceWith(numberLink);
  }

  /* =========================================================
     SONG TITLES + KEYWORDS
     ========================================================= */

  function updateSongRows() {
    const rows = songRows();

    rows.forEach((row, index) => {
      row.dataset.songIndex = String(index + 1);

      const info = SONG_INFO[index + 1];

      if (!info) return;

      const titleElement = row.querySelector(".song-title");

      if (!titleElement) return;

      titleElement.innerHTML = "";

      const titleText = document.createTextNode(`♫ ${info[0]}`);

      const keyword = document.createElement("small");
      keyword.textContent = `${iconLabel(iconFilename(info[2]))} — ${info[1]}`;

      titleElement.appendChild(titleText);
      titleElement.appendChild(keyword);

      titleElement.setAttribute("role", "button");
      titleElement.setAttribute("tabindex", "0");
      titleElement.setAttribute("aria-label", `Play ${info[0]}`);

      titleElement.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        playSongFromRow(row);
      });

      titleElement.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          playSongFromRow(row);
        }
      });
    });

    restoreRoadworkRows();
    updatePottyTimeLock();
    updateNiceAndSlowLock();
    updateRollingStoneLock();
  }

  /* =========================================================
     ANIMAL ICONS AS SHARE BUTTONS
     ========================================================= */

  function putIcons() {
    const rows = songRows();

    rows.forEach((row, index) => {
      row.dataset.songIndex = String(index + 1);

      if (row.querySelector(".animal-button")) {
        return;
      }

      const info = SONG_INFO[index + 1];

      if (!info) return;

      const filename = info[2];

      if (!filename) return;

      const songTitle = info[0];
      const icon = makeImage(filename, songTitle);

      row.appendChild(icon);

      icon.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        handleShareClick(row, songTitle);
      });

      makeSongNumber(row, index);
    });

    restoreRoadworkRows();
    updatePottyTimeLock();
    updateNiceAndSlowLock();
    updateRollingStoneLock();
  }

  /* =========================================================
     MUSIC READING CARDS
     ========================================================= */

  function getCardSongIndex(card) {
    const link = card.querySelector("a");

    if (!link) return -1;

    const match = link.textContent.match(/(\d+)/);

    if (!match) return -1;

    const songNumber = Number(match[1]);

    if (!Number.isInteger(songNumber) || songNumber < 1) {
      return -1;
    }

    return songNumber;
  }

  function playCard(card) {
    if (!card) return;

    const link = card.querySelector("a");

    if (!link) return;

    const songIndex = getCardSongIndex(card);

    if (isPottyTimeSongNumber(songIndex) && !isPottyTimeUnlocked()) {
      return;
    }

    if (isNiceAndSlowSongNumber(songIndex) && !isNiceAndSlowUnlocked()) {
      return;
    }

    if (isRollingStoneSongNumber(songIndex) && !isRollingStoneUnlocked()) {
      return;
    }

    if (typeof link.onclick === "function") {
      link.onclick({
        preventDefault() {},
        stopPropagation() {}
      });
      return;
    }

    if (songIndex >= 0 && typeof window.play === "function") {
      window.play(songIndex);
    }
  }

  function makeCardClickable(card) {
    if (!card) return;

    if (card.dataset.animalCardReady === "true") {
      return;
    }

    card.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      playCard(card);
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        playCard(card);
      }
    });

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Play this music reading card");
    card.dataset.animalCardReady = "true";
  }

  function addAnimalToCard(card) {
    if (!card) return;

    const songIndex = getCardSongIndex(card);

    if (songIndex < 0) return;

    const info = SONG_INFO[songIndex];

    if (!info) return;

    const animalFile = info[2];

    if (!animalFile) return;

    const actualFilename = iconFilename(animalFile);
    const animalName = iconLabel(actualFilename);

    if (card.querySelector(".card-animal-icon")) {
      makeCardClickable(card);
      return;
    }

    const symbol = card.querySelector(".symbol");
    const strong = card.querySelector("strong");
    const link = card.querySelector("a");

    if (symbol) symbol.style.display = "none";
    if (strong) strong.style.display = "none";
    if (link) link.style.display = "none";

    const img = document.createElement("img");
    img.className = "card-animal-icon";
    img.src = RAW_PREFIX + encodeURIComponent(actualFilename);
    img.alt = animalName;
    img.title = animalName;
    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.songIndex = String(songIndex);

    img.onerror = () => {
      img.replaceWith(fallback());
    };

    const name = document.createElement("span");
    name.className = "card-animal-name";
    name.textContent = animalName;
    name.dataset.songIndex = String(songIndex);

    card.appendChild(img);
    card.appendChild(name);

    makeCardClickable(card);
  }

  let updatingCards = false;

  function addCardIcons() {
    if (updatingCards) return;

    updatingCards = true;

    try {
      const cardElements = document.querySelectorAll("#cards .card");

      cardElements.forEach(card => {
        addAnimalToCard(card);
      });
    } finally {
      updatingCards = false;
    }
  }

  /* =========================================================
     CARDS BUTTON OPEN / CLOSE TOGGLE
     ========================================================= */

  let cardsToggleOpen = false;

  function setupCardsToggle() {
    const button = document.getElementById("draw-cards");
    const cards = document.getElementById("cards");
    const reading = document.getElementById("reading");

    if (!button || !cards || !reading) {
      return;
    }

    cardsToggleOpen = !!cards.querySelector(".card");

    button.setAttribute("aria-expanded", String(cardsToggleOpen));

    button.addEventListener("click", () => {
      if (cardsToggleOpen) {
        cardsToggleOpen = false;
        reading.hidden = true;
        cards.style.display = "none";
        button.setAttribute("aria-expanded", "false");
        return;
      }

      cardsToggleOpen = true;
      reading.hidden = false;
      button.setAttribute("aria-expanded", "true");

      requestAnimationFrame(() => {
        if (!cardsToggleOpen) {
          return;
        }

        cards.style.display = "grid";
        addCardIcons();
        scheduleReadingScroll();
      });
    });
  }

  /* =========================================================
     MUSIC READING POSITIONING
     ========================================================= */

  let scrollScheduled = false;

  function positionReading() {
    const reading = document.getElementById("reading");

    if (!reading) return;

    const cards = document.getElementById("cards");

    if (cards && !cardsToggleOpen) {
      return;
    }

    const readingRect = reading.getBoundingClientRect();
    const readingDocumentTop = window.scrollY + readingRect.top;
    const readingHeight = readingRect.height;
    const viewportHeight = window.innerHeight;

    const dock = document.querySelector(".player-dock");
    const dockHeight = dock ? dock.getBoundingClientRect().height : 0;
    const usableHeight = viewportHeight - dockHeight;

    const targetY =
      readingDocumentTop -
      dockHeight -
      (usableHeight - readingHeight) / 2;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth"
    });
  }

  function scheduleReadingScroll() {
    if (scrollScheduled) {
      return;
    }

    scrollScheduled = true;

    requestAnimationFrame(() => {
      scrollScheduled = false;

      requestAnimationFrame(() => {
        addCardIcons();

        if (cardsToggleOpen) {
          positionReading();
        }
      });
    });
  }

  /* =========================================================
     WATCH FOR NEW MUSIC READING CARDS
     ========================================================= */

  function setupCardWatching() {
    const cards = document.getElementById("cards");

    if (!cards) return;

    const observer = new MutationObserver(mutations => {
      let newCards = false;

      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          newCards = true;
          break;
        }
      }

      if (!newCards) {
        return;
      }

      if (!updatingCards) {
        addCardIcons();

        if (cardsToggleOpen) {
          scheduleReadingScroll();
        }
      }
    });

    observer.observe(cards, {
      childList: true,
      subtree: true
    });

    addCardIcons();
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {
    /*
      Shared-link handling runs first.

      If there is no ?song= link, this function returns
      immediately and the site's normal intro behavior
      remains unchanged.
    */
    handleSharedSongParameter();

    addStyles();

    setupSearch();

    updateSongRows();

    putIcons();

    setupRoadworkWatching();

    setupPottyTimeLockWatching();

    window.addEventListener(
      "niceAndSlowUnlocked",
      updateNiceAndSlowLock
    );

    window.addEventListener(
      "rollingStoneUnlocked",
      updateRollingStoneLock
    );

    setupCardsToggle();

    setupCardWatching();

    window.setInterval(
      checkForWhacSongTip,
      500
    );

    addCardIcons();

    restoreRoadworkRows();

    updatePottyTimeLock();

    updateNiceAndSlowLock();

    updateRollingStoneLock();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
