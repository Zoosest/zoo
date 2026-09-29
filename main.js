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
    Song information is kept in chronological order.
    The first entry [index 0] is your intro track, followed by your animal-icon songs.
  */

  const SONG_INFO = [
    ["The Monkey Island Mega Mix 'N' Mojo Intro", "Intro", "skull.png"],
    ["Unfinished Business", "Transformation", "skull.png"],
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
    ["Slow Ride", "Patience", "tortoise.png"],
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
    ["MONSTERS INK (🎱)", "Mystery", "yeti.png"],
    ["The Bermuda Triangle (Strategy)", "Creation", "spider.png"],
    ["Sunday School", "Wisdom", "owl.png"],
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
    ["The B Line 🚂", "Momentum", "roadrunner.png"],
    ["Cognitive Dissonance", "Stillness", "sloth.png"],
    ["Celery Man (Somebody's Watching Me)", "Focus", "mantis.png"],
    ["DOGS (bargaining with terror)", "Loyalty", "wolf.png"],
    ["BAD (Jiminy Crickets)", "Resilience", "cricket.png"],
    ["The Hokey Pokey (GO)", "Exploration", "saiga.png"],
    ["Bear Necessities", "Introspection", "bear.png"],
    ["Mary Poppins (Spring Cleanin)", "Renewal", "stork.png"],
    ["The Wicker Man (Easter Remix)", "Community", "bee.png"],
    ["Stag-Nation (in defense of R Kelly)", "Nobility", "elk.png"],
    ["Lethal Weapon", "Protection", "kangaroo.png"],
    ["Lababus (April Fools)", "Mischief", "labubu.png"],
    ["Miss Thailand (50 Shades of Gay)", "Transformation", "werewolf.png"],
    ["The Alphabet", "Power", "panther.png"],
    ["tombsTONES", "Alertness", "chihuahua.png"],
    ["The Jetsons", "Adaptability", "jellyfish.png"],
    ["Poison Ivy", "Boundaries", "armadillo.png"],
    ["The Venus Fly Trap", "Patience", "venus-fly-trap.png"],
    ["Alligator Allegations (over-under)", "Instinct", "alligator.png"],
    ["Mr Sandman", "Solitude", "desert-fox.png"],
    ["BOYS R US (Sam the Manchild)", "Perspective", "giraffe.png"],
    ["I'm MAD as HELL", "Ferocity", "tazmanian-devil.png"],
    ["SCREAM (Vulture Culture)", "Renewal", "vulture.png"],
    ["Power Of Love (Beatriz and the Beast)", "Mystery", "sasquatch.png"],
    ["THE PLATYPUS", "Uniqueness", "platypus.png"],
    ["Bring Out Ya Dead (Buying Time)", "Cleansing", "toad.png"],
    ["The Lepri-Con (Rainbow Connection)", "Transformation", "frog.png"],
    ["Sin Tax (Stanley Ipkiss)", "Regeneration", "gekko.png"],
    ["The Witch Doctor", "Enigma", "chupacabra.png"],
    ["Punch The Monkey (Cable Guy)", "Ingenuity", "capuchin-monkey.png"],
    ["The Swamp 🐸", "Becoming", "tadpole.png"],
    ["The Famous Mr Ed (Duality)", "Freedom", "horse.png"],
    ["Mars Attacks", "Otherness", "martian.png"],
    ["Initiation (Under the Boardwalk)", "Protection", "crab.png"],
    ["Ghostwriters", "Adaptation", "chameleon.png"],
    ["Big Mouth Billy (Runaround)", "Depth", "bass.png"],
    ["Where's The Beef?", "Nurture", "cow.png"],
    ["American Nights (Iranian Days)", "Endurance", "camel.png"],
    ["Lemmings (Walt Desperate Studios)", "Conformity", "lemming.png"],
    ["Ay Carumba! (Love Is The Answer)", "Persistence", "woodpecker.png"],
    ["Hoist The Colors", "Adventure", "pirate.png"],
    ["Ordo Ab Chao", "Ascension", "eagle.png"],
    ["PIRAHNAS", "Instinct", "pirahna.png"],
    ["You Can Be", "Gentleness", "fawn.png"],
    ["Dont Look Down", "Defense", "hedgehog.png"],
    ["LADY LUCK", "Playfulness", "otter.png"],
    ["Doubtfire (Suspicious Minds)", "Hidden", "mole.png"],
    ["The Rules (stampede)", "Migration", "wildebeest.png"],
    ["Bottle Shock (PEW)", "Boundaries", "skunk.png"],
    ["JEWS (Ante Up)", "Fearlessness", "shark.png"],
    ["F*** Resilience", "Rebirth", "butterfly.png"],
    ["Monkey Judge 🐒⚖", "Expression", "howler-monkey.png"],
    ["Mask or No Mask (voodoo dolls)", "Display", "peacock.png"],
    ["6 Ways To Sunday", "Boundaries", "scorpion.png"],
    ["Tolerance", "Shedding", "snake.png"],
    ["Home On The Strange (Breathwork)", "Grounding", "buffalo.png"],
    ["CATS DONT DANCE", "Independence", "mountain-lion.png"],
    ["Poetic Justice (oo-de-lally)", "Cleverness", "fox.png"],
    ["Lost Angeles (Alessia In Wonderland)", "Extinction", "tazmanian-tiger.png"],
    ["Romanticized Paranoia 🧛🏻‍♂️ (Home Improvement)", "Vigilance", "lemur.png"],
    ["LOVEBIRDS (Feelings Arent Liabilities)", "Peace", "dove.png"],
    ["Hail Mary (The Playbook of Love)", "Joy", "hummingbird.png"],
    ["4th Quarter Fumble (There's no crying in Football)", "Humility", "donkey.png"],
    ["Dr. Hubris (Huberman)", "Tenacity", "badger.png"],
    ["It's not serious Batman", "Intuition", "bat.png"],
    ["Superbowl Limbo (business)", "Labor", "ox.png"],
    ["Play-Doh (Allegory of the Caveman)", "Resourcefulness", "raccoon.png"],
    ["The Ring Leader (Bread & Circuses) 🎪", "Persistence", "beetle.png"],
    ["Hall Of Mirrors", "Solitude", "puma.png"],
    ["M(ICE) There Is No Trust in America", "Caution", "mouse.png"],
    ["Everybody Was Zodiac Fighting ♑ VS ♌", "Courage", "ram.png"],
    ["dONt feAR tHE BEaVeR", "Construction", "beaver.png"],
    ["Gatekeepers (Purgatory)", "Perception", "lynx.png"],
    ["M.M.A (Multicultural Monetized Aggression)", "Dominance", "komodo-dragon.png"],
    ["ZIP-A-Dee-Doo-Files", "Observation", "blue-heron.png"],
    ["ZIP-IT", "Playfulness", "seal.png"],
    ["Arkhétypes", "Memory", "seahorse.png"],
    ["I See Dead People", "Passage", "headless-horseman.png"],
    ["Suffering Sycophants", "Emergence", "cicada.png"],
    ["\"That's Life\"", "Impermanence", "fly.png"],
    ["Johatsu (蒸发) Skumm Bar", "Mystery", "eel.png"],
    ["Pimps Dont Cry", "Independence", "minx.png"],
    ["EVA?", "Gentleness", "koala.png"],
    ["Enjoyin' My Coffee", "Serenity", "manatee.png"],
    ["BERNIE BANK LOAN", "Rebirth", "dung-beetle.png"],
    ["Doggy Doors (Technology)", "Courage", "boar.png"],
    ["Kingpin (Reputations)", "Power", "anaconda.png"],
    ["Assimilation (Addam's Family)", "Acceptance", "banana-slug.png"],
    ["EMINEMULATORS", "Survival", "rat.png"],
    ["MLK", "Adaptation", "jackal.png"],
    ["41", "Cycles", "woodchuck.png"],
    ["YEAR ONE (something to hold onto)", "Perseverance", "yak.png"],
    ["EMULATORS (day one)", "Renewal", "kudu.png"],
    ["Standing in the Light", "Awakening", "chicken.png"],
    ["WALK THE PLANK 🏴‍☠️", "Depth", "squid.png"],
    ["Mickey Rourke (All Or Nothing)", "Resilience", "hippo.png"],
    ["DJ Gentle Dental", "Endurance", "walrus.png"],
    ["Virtual Insanity", "Adaptation", "muskrat.png"],
    ["Satanic Park", "Rebellion", "satan.png"],
    ["Beware the WOOzles", "Imagination", "jackalope.png"],
    ["Dont Lose Your Dinosaur 🦖 (Innocence)", "Instinct", "t-rex.png"],
    ["Jafar", "Transformation", "cobra.png"],
    ["Public Domain (Betty Boop)", "Remembrance", "dodo.png"],
    ["Petey Quills", "Boundaries", "porcupine.png"],
    ["To The Pain 🍻 (Hard ⚔ Times)", "Tenacity", "warthog.png"],
    ["The Village Makes The Villain", "Independence", "bobcat.png"],
    ["WOOzy", "Patience", "shoebill.png"],
    ["Sunny", "Contentment", "kiwi.png"],
    ["The Chains", "Protection", "oyster.png"],
    ["Davy Jones and Me", "Simplicity", "sparrow.png"],
    ["CRINGE", "Acceptance", "blob-fish.png"],
    ["ELF 2", "Guidance", "reindeer.png"],
    ["Gremlins 2", "Solitude", "polar-bear.png"],
    ["Imposters (Wolves in Sheeps Clothing)", "Discernment", "snowy-owl.png"],
    ["Christmas Means CARNAGE!!", "Loyalty", "goose.png"],
    ["Pep Love", "Abundance", "pig.png"],
    ["Don't Fence Me In (Macauley Culkin Syndrome)", "Potential", "larva.png"],
    ["Surfin U.S.A 🏄‍♀️", "Freedom", "sea-lion.png"],
    ["And a Chocolate Chippy Cookie", "Vigilance", "mongoose.png"],
    ["Good Grief", "Gratitude", "turkey.png"],
    ["Fixer Upper", "Gentleness", "deer.png"],
    ["Wish Worth Making", "Hidden", "clam.png"],
    ["Another Illudium Q-36 Explosive Space Modulator", "Escape", "ostrich.png"],
    ["Stranger Danger", "Solitude", "snow-leopard.png"],
    ["HUP", "Persistence", "mole-rat.png"],
    ["Groundhog's Day", "Cycles", "groundhog.png"],
    ["Mercy", "Peace", "pigeon.png"],
    ["Apologize", "Reconciliation", "quail.png"],
    ["CLONE WARS", "Multiplicity", "hydra.png"],
    ["BOWSER JR", "Defense", "snapping-turtle.png"],
    ["Bluebird of Happiness", "Happiness", "bluejay.png"],
    ["The Illludium Q-36 Explosive Space Modulator", "Curiosity", "emu.png"],
    ["StarDucks 🦆 The DuckTator", "Adaptability", "mallard.png"],
    ["Chucky...", "Regeneration", "lobster.png"],
    ["My Creation (Pitchforks) A.I Frankenstein", "Creation", "monster.png"],
    ["We dont need no Helicopters we're a family", "Potential", "egg.png"],
    ["Duck Blur", "Adaptability", "duck.png"],
    ["I love you but you dont know what you're talking about", "Gentleness", "alpaca.png"],
    ["Nice & Slow", "Patience", "snail.png"],
    ["Invisible", "Community", "penguin.png"],
    ["JUMANJI'D", "Strength", "rhino.png"],
    ["ELVIS OF BAGHDAD", "Endurance", "llama.png"],
    ["6 6 6 7", "Sacrifice", "goat.png"],
    ["MUTANTS", "Ferocity", "wolverine.png"],
    ["Manny in the Mirror", "Ancestry", "woolly-mammoth.png"],
    ["H(YE)NZ", "Scavenging", "hyena.png"],
    ["Skinny Bones", "Ancestry", "neanderthal.png"],
    ["I Get By With A Little Help From Falkor", "Transformation", "dragonfly.png"],
    ["What Is Friend?", "Friendship", "wombat.png"],
    ["The Great Conjunction (DEC 21st 2020)", "Perseverance", "salmon.png"],
    ["ZOOCHOSIS", "Innocence", "lamb.png"],
    ["CANTE-SE", "Renewal", "newt.png"],
    ["A Rolling Stone Gathers NO MAS", "Mortality", "lion-skull.png"],
    ["Return of the King", "Leadership", "lion.png"],
    ["POTTY TIME", "Cleansing", "shrimp.png"],
    ["ELMOrtos 💀", "Mortality", "mouse-skull.png"],
    ["Hurry Up and Wait", "Impermanence", "bear-skull.png"],
    ["Puss' Eulogy", "Reckoning", "skull-hyena.png"],
    ["CROW XING", "Foresight", "crow.png"],
    ["Divine Comedy (outro)", "Discovery", "aardvark.png"]
  ];


  /* =========================================================
     STYLES
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


  function makeImage(filename) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "animal-button";

    const actualFilename = iconFilename(filename);
    const label = iconLabel(actualFilename);

    button.title = label;
    button.setAttribute("aria-label", label);

    const img = document.createElement("img");

    img.className = "animal-icon";
    img.alt = label;
    img.loading = "lazy";
    img.decoding = "async";

    img.src =
      RAW_PREFIX +
      encodeURIComponent(actualFilename);

    img.onerror = () => {
      img.replaceWith(fallback());
    };

    button.appendChild(img);

    return button;
  }


  function songRows() {
    return Array.from(
      document.querySelectorAll("#song-list .song")
    );
  }


  function playSongFromRow(row) {
    if (!row) return;

    const playButton = row.querySelector(".play");

    if (playButton) {
      playButton.click();
    }
  }


  /* =========================================================
     SEARCH BAR CREATION & LOGIC
     ========================================================= */

  function setupSearch() {
    const songListContainer =
      document.getElementById("song-list");

    if (
      !songListContainer ||
      document.getElementById("archive-search-container")
    ) {
      return;
    }

    const container =
      document.createElement("div");

    container.id =
      "archive-search-container";

    const wrapper =
      document.createElement("div");

    wrapper.id =
      "archive-search-wrapper";

    /* Custom search icon */
    const icon =
      document.createElement("span");

    icon.className =
      "search-magnifying-glass-column";

    const iconImage =
      document.createElement("img");

    iconImage.src = SEARCH_ICON;
    iconImage.alt = "";
    iconImage.width = 20;
    iconImage.height = 20;
    iconImage.loading = "lazy";
    iconImage.decoding = "async";

    icon.appendChild(iconImage);

    const input =
      document.createElement("input");

    input.type = "text";
    input.id = "archive-search";
    input.placeholder =
      "Search songs, keywords, or animals...";
    input.setAttribute(
      "autocomplete",
      "off"
    );

    const dropdown =
      document.createElement("div");

    dropdown.id =
      "search-dropdown";

    wrapper.appendChild(icon);
    wrapper.appendChild(input);

    container.appendChild(wrapper);
    container.appendChild(dropdown);

    songListContainer.parentNode.insertBefore(
      container,
      songListContainer
    );

    input.addEventListener(
      "input",
      () => {
        const query =
          input.value.toLowerCase().trim();

        dropdown.innerHTML = "";

        if (query.length === 0) {
          dropdown.classList.remove("active");
          return;
        }

        const matches = [];

        SONG_INFO.forEach(
          (info, index) => {
            const title =
              info[0].toLowerCase();

            const keyword =
              info[1].toLowerCase();

            const animal =
              iconLabel(
                iconFilename(info[2])
              ).toLowerCase();

            if (
              title.includes(query) ||
              keyword.includes(query) ||
              animal.includes(query)
            ) {
              matches.push({
                index,
                title: info[0],
                keyword: info[1],
                animal:
                  iconLabel(
                    iconFilename(info[2])
                  )
              });
            }
          }
        );

        if (matches.length === 0) {
          const noResult =
            document.createElement("div");

          noResult.className =
            "search-result-item";

          noResult.style.justifyContent =
            "center";

          noResult.style.fontStyle =
            "italic";

          noResult.textContent =
            "No matching songs found";

          dropdown.appendChild(noResult);
          dropdown.classList.add("active");

          return;
        }

        matches
          .slice(0, 15)
          .forEach(match => {
            const item =
              document.createElement("a");

            item.className =
              "search-result-item";

            item.href = "#";

            const textSpan =
              document.createElement("span");

            textSpan.className =
              "search-result-text";

            textSpan.textContent =
              `♫ ${match.title}`;

            const metaSpan =
              document.createElement("span");

            metaSpan.className =
              "search-result-meta";

            metaSpan.textContent =
              `${match.animal} • ${match.keyword}`;

            item.appendChild(textSpan);
            item.appendChild(metaSpan);

            item.addEventListener(
              "click",
              event => {
                event.preventDefault();

                dropdown.classList.remove(
                  "active"
                );

                input.value = "";

                const rows = songRows();

                const targetRow =
                  rows[match.index - 1];

                if (targetRow) {
                  targetRow.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                  });

                  playSongFromRow(
                    targetRow
                  );
                }
              }
            );

            dropdown.appendChild(item);
          });

        dropdown.classList.add("active");
      }
    );

    document.addEventListener(
      "click",
      event => {
        if (!container.contains(event.target)) {
          dropdown.classList.remove(
            "active"
          );
        }
      }
    );
  }


  /* =========================================================
     SONG NUMBERS
     ========================================================= */

  function makeSongNumber(row, index) {
    const oldNumber =
      row.querySelector(".song-number");

    if (!oldNumber) return;

    if (oldNumber.tagName === "A") {
      return;
    }

    const numberLink =
      document.createElement("a");

    numberLink.className =
      "song-number";

    numberLink.href = "#";

    numberLink.textContent =
      oldNumber.textContent.trim();

    numberLink.setAttribute(
      "aria-label",
      `Play song ${index + 2}`
    );

    numberLink.addEventListener(
      "click",
      event => {
        event.preventDefault();
        playSongFromRow(row);
      }
    );

    oldNumber.replaceWith(numberLink);
  }


  /* =========================================================
     SONG TITLES + KEYWORDS
     ========================================================= */

  function updateSongRows() {
    const rows = songRows();

    rows.forEach(
      (row, index) => {
        const info =
          SONG_INFO[index + 1];

        if (!info) return;

        const titleElement =
          row.querySelector(
            ".song-title"
          );

        if (!titleElement) return;

        titleElement.innerHTML = "";

        const titleText =
          document.createTextNode(
            `♫ ${info[0]}`
          );

        const keyword =
          document.createElement("small");

        keyword.textContent =
          info[1];

        titleElement.appendChild(
          titleText
        );

        titleElement.appendChild(
          keyword
        );
      }
    );
  }


  /* =========================================================
     ANIMAL ICONS ON SONG ROWS
     ========================================================= */

  function putIcons() {
    const rows = songRows();

    rows.forEach(
      (row, index) => {
        if (
          row.querySelector(
            ".animal-button"
          )
        ) {
          return;
        }

        const info =
          SONG_INFO[index + 1];

        if (!info) return;

        const filename =
          info[2];

        if (!filename) return;

        const icon =
          makeImage(filename);

        row.appendChild(icon);

        icon.addEventListener(
          "click",
          event => {
            event.preventDefault();
            event.stopPropagation();
            playSongFromRow(row);
          }
        );

        makeSongNumber(
          row,
          index
        );
      }
    );
  }


  /* =========================================================
     MUSIC READING CARDS
     ========================================================= */

  function getCardSongIndex(card) {
    const link =
      card.querySelector("a");

    if (!link) return -1;

    const match =
      link.textContent.match(
        /(\d+)/
      );

    if (!match) return -1;

    const songNumber =
      Number(match[1]);

    if (
      !Number.isInteger(songNumber) ||
      songNumber < 1
    ) {
      return -1;
    }

    return songNumber;
  }


  function playCard(card) {
    if (!card) return;

    const link =
      card.querySelector("a");

    if (!link) return;

    if (
      typeof link.onclick ===
      "function"
    ) {
      link.onclick({
        preventDefault() {},
        stopPropagation() {}
      });

      return;
    }

    const songIndex =
      getCardSongIndex(card);

    if (
      songIndex >= 0 &&
      typeof window.play ===
        "function"
    ) {
      window.play(songIndex);
    }
  }


  function makeCardClickable(card) {
    if (!card) return;

    if (
      card.dataset.animalCardReady ===
      "true"
    ) {
      return;
    }

    card.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();
        playCard(card);
      }
    );

    card.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          event.stopPropagation();
          playCard(card);
        }
      }
    );

    card.setAttribute(
      "role",
      "button"
    );

    card.setAttribute(
      "tabindex",
      "0"
    );

    card.setAttribute(
      "aria-label",
      "Play this music reading card"
    );

    card.dataset.animalCardReady =
      "true";
  }


  function addAnimalToCard(card) {
    if (!card) return;

    const songIndex =
      getCardSongIndex(card);

    if (songIndex < 0) return;

    const info =
      SONG_INFO[songIndex];

    if (!info) return;

    const animalFile =
      info[2];

    if (!animalFile) return;

    const actualFilename =
      iconFilename(animalFile);

    const animalName =
      iconLabel(actualFilename);

    if (
      card.querySelector(
        ".card-animal-icon"
      )
    ) {
      makeCardClickable(card);
      return;
    }

    const symbol =
      card.querySelector(
        ".symbol"
      );

    const strong =
      card.querySelector(
        "strong"
      );

    const link =
      card.querySelector("a");

    if (symbol) {
      symbol.style.display =
        "none";
    }

    if (strong) {
      strong.style.display =
        "none";
    }

    if (link) {
      link.style.display =
        "none";
    }

    const img =
      document.createElement("img");

    img.className =
      "card-animal-icon";

    img.src =
      RAW_PREFIX +
      encodeURIComponent(
        actualFilename
      );

    img.alt =
      animalName;

    img.title =
      animalName;

    img.loading =
      "lazy";

    img.decoding =
      "async";

    img.dataset.songIndex =
      String(songIndex);

    img.onerror = () => {
      img.replaceWith(
        fallback()
      );
    };

    const name =
      document.createElement(
        "span"
      );

    name.className =
      "card-animal-name";

    name.textContent =
      animalName;

    name.dataset.songIndex =
      String(songIndex);

    card.appendChild(img);
    card.appendChild(name);

    makeCardClickable(card);
  }


  let updatingCards = false;

  function addCardIcons() {
    if (updatingCards) return;

    updatingCards = true;

    try {
      const cardElements =
        document.querySelectorAll(
          "#cards .card"
        );

      cardElements.forEach(
        card => {
          addAnimalToCard(card);
        }
      );
    } finally {
      updatingCards = false;
    }
  }


  /* =========================================================
     CARDS BUTTON OPEN / CLOSE TOGGLE
     ========================================================= */

  let cardsToggleOpen = false;

  function setupCardsToggle() {
    const button =
      document.getElementById(
        "draw-cards"
      );

    const cards =
      document.getElementById(
        "cards"
      );

    if (!button || !cards) {
      return;
    }

    /*
      If cards already exist when the page loads,
      consider them open. Otherwise the first press
      of CARDS will open them.
    */
    cardsToggleOpen =
      !!cards.querySelector(".card");

    button.setAttribute(
      "aria-expanded",
      String(cardsToggleOpen)
    );

    button.addEventListener(
      "click",
      () => {
        /*
          SECOND PRESS:
          Close the cards.
        */
        if (cardsToggleOpen) {
          cardsToggleOpen = false;

          cards.style.display =
            "none";

          button.setAttribute(
            "aria-expanded",
            "false"
          );

          return;
        }

        /*
          FIRST / THIRD / NEXT OPEN PRESS:
          Let the existing CARDS code finish
          generating the reading first, then
          show the card grid.
        */
        cardsToggleOpen = true;

        button.setAttribute(
          "aria-expanded",
          "true"
        );

        requestAnimationFrame(
          () => {
            if (!cardsToggleOpen) {
              return;
            }

            cards.style.display =
              "grid";

            addCardIcons();
            scheduleReadingScroll();
          }
        );
      }
    );
  }


  /* =========================================================
     MUSIC READING POSITIONING
     ========================================================= */

  let scrollScheduled = false;

  function positionReading() {
    const reading =
      document.getElementById(
        "reading"
      );

    if (!reading) return;

    const cards =
      document.getElementById(
        "cards"
      );

    if (
      cards &&
      !cardsToggleOpen
    ) {
      return;
    }

    const readingRect =
      reading.getBoundingClientRect();

    const readingDocumentTop =
      window.scrollY +
      readingRect.top;

    const readingHeight =
      readingRect.height;

    const viewportHeight =
      window.innerHeight;

    const dock =
      document.querySelector(
        ".player-dock"
      );

    const dockHeight =
      dock
        ? dock.getBoundingClientRect()
            .height
        : 0;

    const usableHeight =
      viewportHeight -
      dockHeight;

    const targetY =
      readingDocumentTop -
      dockHeight -
      (usableHeight -
        readingHeight) /
        2;

    window.scrollTo({
      top: Math.max(
        0,
        targetY
      ),
      behavior: "smooth"
    });
  }


  function scheduleReadingScroll() {
    if (scrollScheduled) {
      return;
    }

    scrollScheduled = true;

    requestAnimationFrame(
      () => {
        scrollScheduled = false;

        requestAnimationFrame(
          () => {
            addCardIcons();

            if (cardsToggleOpen) {
              positionReading();
            }
          }
        );
      }
    );
  }


  /* =========================================================
     WATCH FOR NEW MUSIC READING CARDS
     ========================================================= */

  function setupCardWatching() {
    const cards =
      document.getElementById(
        "cards"
      );

    if (!cards) return;

    const observer =
      new MutationObserver(
        mutations => {
          let newCards = false;

          for (
            const mutation of mutations
          ) {
            if (
              mutation.type ===
                "childList" &&
              mutation.addedNodes.length
            ) {
              newCards = true;
              break;
            }
          }

          if (!newCards) {
            return;
          }

          if (!updatingCards) {
            addCardIcons();

            /*
              Only reposition the page when
              the CARDS section is actually open.
            */
            if (cardsToggleOpen) {
              scheduleReadingScroll();
            }
          }
        }
      );

    observer.observe(
      cards,
      {
        childList: true,
        subtree: true
      }
    );

    addCardIcons();
  }


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {
    addStyles();

    setupSearch();

    updateSongRows();

    putIcons();

    /*
      Set up the CARDS toggle before the
      MutationObserver begins watching for cards.
    */
    setupCardsToggle();

    setupCardWatching();

    addCardIcons();
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
