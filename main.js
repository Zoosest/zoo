/* =========================================================
   RIZNEY MUSIC ARCHIVE
   Animal icons + song titles + keywords + Music Reading cards
   ========================================================= */

(() => {
  "use strict";

  const RAW_PREFIX =
    "https://raw.githubusercontent.com/the-zeusest/waltrizney-/main/assets/animal-icons/";

  const FALLBACK_ICON = "🐾";

  const SONG_INFO = [
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

  const SONG_URLS = [
    "https://youtube.com/shorts/nSog7wdCuzM?si=kwpPnc7mIfaYzYcr",
    "https://youtu.be/9lMRH8Q47KU?si=wo9NVfAnzgorED6u",
    "https://youtu.be/_X3lvzQ-LPU?si=CMK-x94GNN6NEzmi",
    "https://youtu.be/UPrAovWTbPg?si=pEBoQEMFUuFtEi_y",
    "https://youtu.be/eEMpzOWMOss?si=mBDaF-JSDQWEUvc6",
    "https://youtu.be/IJyh3qTjNXg?si=9SYJD2UTzkijZ5VS",
    "https://youtu.be/kasqOqUM9c8?si=-E7z-JqggxICbUx1",
    "https://youtu.be/eaii8UpU3nY?si=QOBDbtq9ZV0B9b3x",
    "https://youtu.be/gVx8-14vNyc?si=iEO8RKxRL5SJ-D9Z",
    "https://youtu.be/i-iAw8ldPKA?si=VerGBUv9b9mcZpX7",
    "https://youtu.be/zTw4hQfcq5s?si=rV457_3OrKfIKuZW",
    "https://youtu.be/_yrFNLWUMUI?si=vBIs1b34cTcpvdlX",
    "https://youtu.be/YTI-Gfy_e1c?si=rWmWgBStiXv8Zdjq",
    "https://youtu.be/BhEPKP_8EmA?si=f2xCAEK0qnO_x2u0",
    "https://youtu.be/u6kzuoyMGNI?si=uJHzlvJrSgRXvgfR",
    "https://youtu.be/7S5CGfcv7jo?si=O9H8JH9lsn6UqJ9X",
    "https://youtu.be/10_lgpIvQgk?si=Y_vinJ2DI-SgPeG8",
    "https://youtu.be/gDwbTglsZJY?si=u_xcxJ59rfFB52cK",
    "https://youtu.be/TBXd7UZK3qI?si=puFwBwLMw41bbtUQ",
    "https://youtu.be/7rtoEbi6Pdk?si=oLG7gk5iEzBIQ3rc",
    "https://youtu.be/TSkWo5NC9v4?si=-MkIWCitIEOgGcvf",
    "https://youtu.be/b4i7RWKF5jQ?si=aRDHyKGcaPqVuBWq",
    "https://youtu.be/kT6elgb33VY?si=sfu1azuZst1oXLNz",
    "https://youtu.be/aQdOCtKqRyQ?si=ViSHDIMeVx5UqC7l",
    "https://youtu.be/MdzDESjZEPc?si=Qfw93C0aXEVHUk5x",
    "https://youtu.be/gLtz61TxWrM?si=1vrtuDaO_66EOQif",
    "https://youtu.be/4tXQdNFetBo?si=4KZMK9-8elJJR1J0",
    "https://youtu.be/FUztI7OonBM?si=ez7caGyC3b4my96A",
    "https://youtu.be/NzoX2TKQw0I?si=G5yNggRr-GtGq0NW",
    "https://youtu.be/2zDnxyQ--Wg?si=AkIVzoJuylkOwAyf",
    "https://youtu.be/azce-gXKSF8?si=8wnqtO_FpAvY2S9j",
    "https://youtu.be/VeAhTMWuF1s?si=yzgUWmqcyJ5GzmPU",
    "https://youtu.be/M02ODBjIy6w?si=4-FhD4oJKu7kn-01",
    "https://youtu.be/q6e_ddPAWKE?si=2Juq-x88zXt01pzt",
    "https://youtu.be/pyPrRO6TGAs?si=nYi6Jpc_eHZcl9-I",
    "https://youtu.be/b9TbozTf6Qk?si=aHuTdSW-hVaLSVJv",
    "https://youtu.be/5xXedAnruJI?si=1tEHEkZ-Xw-m9vFi",
    "https://youtu.be/4mw62DQ9-FQ?si=wKawBod7bwZRQMEA",
    "https://youtu.be/kyv4PVpj78U?si=Zf7Z_8FDNC8vqaLd",
    "https://youtu.be/Uee0zrEt-N8?si=lV6YDvMTeoav_Wjh",
    "https://youtu.be/2OWU6PP_KJM?si=6Eg6s2s9KfR8_3Sv",
    "https://youtu.be/vypaky2Kitc?si=apvyck1hwqtiwIcM",
    "https://youtu.be/eEKToxRuqm4?si=XWuxWIxQitAQuM66",
    "https://youtu.be/Uq3ivXGqurs?si=37TFtC2wXAx8KJJY",
    "https://youtu.be/hlJM0LmCWBM?si=XtfW_3yASgLZcgD0",
    "https://youtu.be/GoBmEVpWNJs?si=ONltYY3WWNWA1yEo",
    "https://youtu.be/rAJN-rvOfLw?si=1y-M3Oomc9rVAuw3",
    "https://youtu.be/oByKEoTc6eU?si=-JtWGAORPnX6klfa",
    "https://youtu.be/sL5jUjL8udU?si=mc72XlNYpN8xYz2a",
    "https://youtu.be/fHofWnhhyyc?si=bhaxupWqbEQ0Y15y",
    "https://youtu.be/tDGH5cE8uvk?si=Q6UrHnoRy_p5NjkO",
    "https://youtu.be/5pwPH0xaIZY?si=aBxM8zStYHeXANLx",
    "https://youtu.be/uPrk4qEE7S8?si=Z9fVdYsvCu_E-tFn",
    "https://youtu.be/icbAY9naNMA?si=J-OhICPO3A23auHO",
    "https://youtu.be/HpMC2yam8PM?si=qJdQ_xhFCFYUQuX3",
    "https://youtu.be/r6cjVRFugM0?si=I8RAWIDJ2XeL7OrR",
    "https://youtu.be/i72aGyLuzsk?si=bmT5o7JZinzro31f",
    "https://youtu.be/8jb12q-Rqyo?si=J5i65RqVQL_RNeO_",
    "https://youtu.be/IvNPXZUTnvE?si=ubFYz7XvllJexDgi",
    "https://youtu.be/JkPLPWgclqs?si=ew7PK4XBxJ0sgUID",
    "https://youtu.be/taOcjDcAt-s?si=_5NgmvMu0QllBu2s",
    "https://youtu.be/o4R05kcZV-Y?si=jPBZEprbu4RzVxKY",
    "https://youtu.be/Qy5totGVOYc?si=LufDSQKIEBYP5mPv",
    "https://youtu.be/qm2xTOhpbCk?si=pAQNZS_yi0a1eBIe",
    "https://youtu.be/WHPUaT48TG0?si=rrE5tTTgh8vk297-",
    "https://youtu.be/-IO5z1jwbLE?si=FKISWQUPdMOYsnBO",
    "https://youtu.be/ZoiFadiQG6E?si=C5iDp-K0vmDhwnpn",
    "https://youtu.be/7duBbZ22yPs?si=1rVqVzW4fBuczzPn",
    "https://youtu.be/6mgQ_altXc8?si=JKliaqiLaJVZrqCG",
    "https://youtu.be/P_EvP3_SZAk?si=GoKB5yaOP9aj4ihh",
    "https://youtu.be/DjjWeVkpnM8?si=DxvUE333bGYEAjDT",
    "https://youtu.be/Nsy1fZlWsXU?si=kPxVb3_i3ASZ4ggE",
    "https://youtu.be/amx-s-ps1BU?si=6W6z20KepX-ivrSN",
    "https://youtu.be/adc6FmQUClE?si=oewGRRqAvGPUkxrZ",
    "https://youtu.be/oRn_OyaZao8?si=2zr5_QKnmPIOPW_6",
    "https://youtu.be/oPZuoczX1Og?si=wZJYXGZ7ma2kgb8y",
    "https://youtu.be/OyoHueUZ1o8?si=9VWt0WYFWp00Dzr5",
    "https://youtu.be/6Im5a5ILeXA?si=O37Pfx62yTNXcsrc",
    "https://youtu.be/Xh2Rvl_A_-k?si=YAH9wpBPNCsCzRZ0",
    "https://youtu.be/94JSM5MjxLc?si=qechCiaRX1jnWTEp",
    "https://youtu.be/ZQFO_QFuYQI?si=24bBiGlPtL2KIN13",
    "https://youtu.be/4UE8diN0Cao?si=zskEbbbZnadap7B9",
    "https://youtu.be/9tPTW9ukQ2w?si=UG4HmnLtYIa_VrUA",
    "https://youtu.be/GAamtqGx8y0?si=MPT_jR0B23iQhyj8",
    "https://youtu.be/G8dTYB_WaIE?si=JbBXLx6CG5ozAb6t",
    "https://youtu.be/WbPH9ikKq7A?si=y6iTxzPawuCotTfJ",
    "https://youtu.be/fE2YtLUgAmk?si=W6BIjjt1wPFTHDus",
    "https://youtu.be/F27lxAZhmnM?si=1b5y9cnYcDV3ifL4",
    "https://youtu.be/2fYhqwQeIqY?si=EUD4U1mgZONFHc_i",
    "https://youtu.be/CQ-HN7m0kH8?si=AXwtz-85avNrjjFl",
    "https://youtu.be/OmLcbddZLgg?si=Leu0EV25tDIxf3DI",
    "https://youtu.be/is4-8CBCUmA?si=0z-W3y7tAh_wiXuw",
    "https://youtu.be/AOYAqOMya8I?si=YhsWY2dyoGPcCM6V",
    "https://youtu.be/T2GxEGavo4Q?si=iuYcxZVaik1ulvZB",
    "https://youtu.be/0pGkNmIP4zc?si=eA5ae5fYCxGgHV6K",
    "https://youtu.be/lFTldznPCnE?si=K0xRf3-fp5vdJC-X",
    "https://youtu.be/jV-9jOffbJs?si=kt0oCfeiNUd0EaMR",
    "https://youtu.be/rgXvzz87ONw?si=PXai-lvPUP6pG0sO",
    "https://youtu.be/TI0i6bCDFC4?si=QQM4Cjc63Oq-rU9Y",
    "https://youtu.be/E4vBJG4CT0w?si=VYVJnpeScrD5VuvZ",
    "https://youtu.be/jSTVWXnvQEY?si=Dgd17lyc86tTsIde",
    "https://youtu.be/NcJigVJt9fI?si=85ZdJfPSj3VqjubG",
    "https://youtu.be/-OlOlJAfRrM?si=KsAjfnEi3kcFkGpj",
    "https://youtu.be/66_1LFWwpXs?si=MJ2-8oKMgEwpTWLG",
    "https://youtu.be/QDieYFckAPg?si=G2ljhbcRrnT_vW0e",
    "https://youtu.be/JUN__9svvX4?si=Zj8ADBqyUyztttsn",
    "https://youtu.be/58ddh3ND2bI?si=ysW0vghsL081d2lH",
    "https://youtu.be/abMQCyo76LI?si=APMEYMietfsLb4y3",
    "https://youtu.be/aeZGKnigKmA?si=P7tnSmx9hsARY0Vs",
    "https://youtu.be/0TycDzowjdk?si=Cl-fNoNGWZqdo7jF",
    "https://youtu.be/k9EJdVrIOp4?si=yJi2nS73-j_1VOpa",
    "https://youtu.be/qgkFU7aQxI8?si=Zf011xXQiZg31-d6",
    "https://youtu.be/i59iCrLkd78?si=j6c41HV2ayCgwB0H",
    "https://youtu.be/SHhsdD5viWs?si=ZJwA77UbTggTywJp",
    "https://youtu.be/Gfy31tDV_no?si=CuJIth76kud7vtUT",
    "https://youtu.be/yvcJABgGAdo?si=LWhC_jM2gtSt4tNY",
    "https://youtu.be/s4sp3ooj7KE?si=mvmnfyDtFZOcA8T5",
    "https://youtu.be/BVnXCpyatxM?si=PFIdSa2mNA2D8Ovw",
    "https://youtu.be/20ihDXK0CkE?si=oRCccZQ_IvlApI7n",
    "https://youtu.be/i_kZ7KSiHmc?si=bEDC8pzqLlWX4HJD",
    "https://youtu.be/sL_DWtojWrw?si=TzIeEnla2JTZdggO",
    "https://youtu.be/YXQ2UchbJrs?si=ZtK_aDSf52tJd0ua",
    "https://youtu.be/130wQn9hPhE?si=_23DtBQvqaQs53B0",
    "https://youtu.be/xGRVi4GIV-s?si=uoj6pegTLCK4b9o_",
    "https://youtu.be/5JDY6C1UyN8?si=RbSgNNHlzYS-Es3n",
    "https://youtu.be/6bhT34bY-Js?si=0mJ4qJjYehMBoJ4Q",
    "https://youtu.be/emZjfAaHD-c?si=1QERNk9lmg7Lo07B",
    "https://youtu.be/P8lHafrsmY4?si=mvEkGs9j23ZlpP8f",
    "https://youtu.be/GF0LoexovMo?si=0TBl54UZev6Cndgn",
    "https://youtu.be/mfbnpijaDdM?si=J5RcBt9i2gZTPtAL",
    "https://youtu.be/oInpReDmZrc?si=FqNNQja0GJSwTVfQ",
    "https://youtu.be/r814RQX3IE4?si=iIAivldiDx9wZlta",
    "https://youtu.be/sjJyzWufuS4?si=piidv5QhWlMVqe_E",
    "https://youtu.be/oGQ0Lvt1z9U?si=MNi8WDdj8Nj-OHqa",
    "https://youtu.be/dr2IiLA6PPc?si=Uh2akQcmE0-4BIWd",
    "https://youtu.be/aOsenVYYOkM?si=xIeHe5vLAssbNrk6",
    "https://youtu.be/qAW5LqxyyCU?si=zEJJSx5BnTgvksRA",
    "https://youtu.be/DBij5XTBEqM?si=L8FhXxYyND6LgzAa",
    "https://youtu.be/8pezb1KjWEo?si=lhxnCNUyH--jJIO-",
    "https://youtu.be/ce0VRgTvjWE?si=UFKeJf6zGLT4kHz6",
    "https://youtu.be/cpF7ssgKdiw?si=jJmO00PJ6IOW9qqH",
    "https://youtu.be/QfOamOb8M3I?si=E2V1xlZ-XTUCz_xH",
    "https://youtu.be/iCv-RGZDbP0?si=svrCkd6STsu_b49S",
    "https://youtu.be/rHig-mas9do?si=Y5RqXAnZdsUCMLJd",
    "https://youtu.be/9kPzE3-eTQw?si=uSul9t0Ycoklf_GX",
    "https://youtu.be/OE1R8XS0gQY?si=bZ7nvoS_bUgQ1TQ4",
    "https://youtu.be/heSXocBU0Zg?si=FkdYnK7XzJGx-YE6",
    "https://youtu.be/bma2BvDWCnY?si=z5mwn9gta1vJmcBk",
    "https://youtu.be/nQmQo2LWFpQ?si=As_jFnMyoiB091FR",
    "https://youtu.be/2UFOc97Rp40?si=jhQKyXCVUb9jZSvW",
    "https://youtu.be/IFxtiGyF9o4?si=lQT4ofhUXx67jucw",
    "https://youtu.be/XqRxstJsJkU?si=WP8HemoZ1P1k4G0J",
    "https://youtu.be/8bMeGvT8ybs?si=DwQMuq4xm-8RlqLA",
    "https://youtu.be/TS5v0O3T6w8?si=qvyJAcBUrGY65GFG",
    "https://youtu.be/aI5wBezjMI4?si=h8fFadOTOWMVxJIy",
    "https://youtu.be/ZKQLbHZYmKw?si=3XUWPqIIcipPxV-G",
    "https://youtu.be/qI_GCgPtJzA?si=anVG6vNxWhKICp_6",
    "https://youtu.be/_7gUtHyroNE?si=lcxeHiWeyBfUb91E",
    "https://youtu.be/na8jHFCRWd4?si=CQX2DTSX37Th_s2G",
    "https://youtu.be/S3WsdoEDTyg?si=9zrATIQCpROWXH1w",
    "https://youtu.be/McXO1rxmFLE?si=1BXq8QXPOz1JYHTm",
    "https://youtu.be/uKHmcamvruM?si=-4pglnMSEn2lr5SE",
    "https://youtu.be/_SmqwV7k3zY?si=ftSrOuxhL4tAYk-E",
    "https://youtu.be/8evvIeYilao?si=FBRnTUlpvZwXHNB1",
    "https://youtu.be/YZtoMiTtiwg?si=Vs4-YxGaMkGyog2y",
    "https://youtu.be/ykUbEs782ZU?si=17FPriopvJXy9D5C",
    "https://youtu.be/NMPLE0CsGGo?si=pDcT91veO4E9iKrP",
    "https://youtu.be/ZZl-WJM1MgM?si=QpVI21MuPZ3gYyc9",
    "https://youtu.be/33I_Fm6tK4E?si=u_gkEzV3FFHPaKIH",
    "https://youtu.be/VN2N48emqXw?si=oN8ymvOSPlaTVaYW",
    "https://youtu.be/uUmR6Z4aUmA?si=3kyGnTyj0HTUYZ8G",
    "https://youtu.be/9cJ6I3hWz5E?si=2KeriJLIvXrBf0Jq",
    "https://youtu.be/tr96Ee9Ulto?si=EKoLjGrZxWV0SDYK",
    "https://youtu.be/qMIdoRAsYeo?si=Jq1haKX2ADVIQIMN",
    "https://youtu.be/B_fhCvx_xPk?si=QEVUprVjFHNfIKsA",
    "https://youtu.be/nxgqXeuc-CU?si=ww8xxq_E3miv5c4s",
    "https://youtu.be/vm6WpO-U9xA?si=-1oUv1C1ntCR8rH3",
    "https://youtu.be/zPH4F0UUpGM?si=gXB23zwRiMallTYS",
    "https://youtu.be/6jRDo2q6Dtg?si=-MSDh6JsV96nGKV6",
    "https://youtu.be/EfLMAfxEc7A?si=QW49UNNKAhuwiI-6",
    "https://youtu.be/bdext1tW3YM?si=2V5MsU7jsAGmmdLO",
    "https://youtu.be/tuoh783O1KU?si=88q5SIleEajxHSvK",
    "https://youtu.be/NIFfftdWYO0?si=uDdm6BfmiXqsgvpd",
    "https://youtu.be/LhEAe8tuS18?si=4PBGoytFIS2e9dp9",
    "https://youtu.be/BrccqDo-qxw?si=G_abna87GBfMgrd_",
    "https://youtu.be/GCPGxDdpugE?si=l5K0_mpPR_VD5q2S",
    "https://youtu.be/5RVldUp7n_c?si=b1ejmIMmCSk2yIKT",
    "https://youtu.be/0CFmzniu4SE?si=o0Mh0pnBjvkT8KlW",
    "https://youtu.be/ojTgtAqibLE?si=Em1AV7jTUgUXvVBy",
    "https://youtu.be/x7Edg_aqeaU?si=7U3neDQaRxzq9mFw",
    "https://youtu.be/FigWQ4xaWoc?si=6NQKd8Xa9ohJ0nCr",
    "https://youtu.be/8koRvyJpZuw?si=pdXBrJRWSN9AuxtV",
    "https://youtu.be/50qPRfx1uc0?si=ixMytVNU9TEzkmpZ",
    "https://youtu.be/Kg8nSXhgjdk?si=n26ePhfbhNibjVBI",
    "https://youtu.be/jgSv8g5bxT8?si=bKPM0GB7cJMXKWRD",
    "https://youtu.be/S2gfGK3DwJ0?si=02QWg_X_0o5qpwRd",
    "https://youtu.be/5wlDe0rmGgw?si=uL-KBCEO-Jgl_Ux-",
    "https://youtu.be/7ebxTqZSfuA?si=IFyBADsSw2bcA5JL",
    "https://youtu.be/4YvO0gGiaxs?si=eaQQZ5a2HlVPCmXI",
    "https://youtu.be/Aa59hZscrYg?si=dYLuKTogSuRf5Gkx",
    "https://youtu.be/na2pWme1cZ4?si=6lz4Ue0DpZ0oWUw3",
    "https://youtu.be/URfWqSuBf5c?si=4z1CRu0f7JlmgX5v",
    "https://youtu.be/FOeZaZRRRZ0?si=LIlNQdjibnc-D2BO",
    "https://youtu.be/hv86n3luqpo?si=erCMDwTkPtT4QiWa",
    "https://youtu.be/sCLUO6SzQtg?si=MmUs7PtX7ltNMC2S",
    "https://youtu.be/lsYUN1hftyw?si=cPPur6LF6gk2x1Gx",
    "https://youtu.be/U8wk5Ed90fk?si=mBmXEQnELaasjbdX",
    "https://youtu.be/hh-U98bN3Vc?si=m1cuantABTda0gBU",
    "https://youtu.be/npayCUDcWoE?si=jPGcOWMigfHRVvwl",
    "https://youtu.be/GIf2CUNburw?si=a0SDduyUixogn5JF",
    "https://youtu.be/nPzfOkoNiFk?si=m1dwvyUGeC7ZakBM",
    "https://youtu.be/wG7SRL1Do00?si=i_cSBtuIrPBySFQx",
    "https://youtu.be/OD5x9DY2dzU?si=MiYMbHiGdAhf0urS",
    "https://youtu.be/iOJcb6XLyVU?si=z2OLsfqnOe7Dl7tm",
    "https://youtu.be/sPgU2PMOqkI?si=-isK2qop_4mdWnEG",
    "https://youtu.be/1qAKYJo1zRc?si=F24bNFAuC7BYoa2b",
    "https://youtu.be/mBBU3nAUL94?si=YRtypsOdc-QcIf9a",
    "https://youtu.be/CAwy7WirHTA?si=EY_Wz7LWNGaxVRDf",
    "https://youtu.be/uVDGYtRELas?si=TuRpyosAGjPPhtZ3",
    "https://youtu.be/zb0vUX07fn0?si=j1tU4G8zYjzBZ69c",
    "https://youtu.be/zb0vUX07fn0?si=d-q1tOTOBpfpAqXA",
    "https://youtu.be/K2Dujl_bFZg?si=yN477Ppzw1KcF8nk"
  ];

  const SONGS = SONG_INFO.map(([title, keyword, icon], index) => ({
    title,
    keyword,
    icon,
    url: SONG_URLS[index] || ""
  }));

  const extractVideoId = url => {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/|watch\?v=)([^?&/]+)/);
    return match ? match[1] : "";
  };

  const ids = SONGS.map(song => extractVideoId(song.url)).filter(Boolean);

  const $ = selector => document.querySelector(selector);
  const nowPlaying = $("#now-playing");
  const list = $("#song-list");
  const cards = $("#cards");
  const reading = $("#reading");
  const previousButton = $("#previous-song");
  const nextButton = $("#next-song");

  let player = null;
  let currentIndex = 0;
  let cardPlaylist = null;
  let cardPosition = 0;

  const titleFor = i => `Song ${i + 1}`;

  function updateButtons() {
    previousButton.disabled = cardPlaylist === null ? currentIndex <= 0 : cardPosition <= 0;
    nextButton.disabled = cardPlaylist === null ? currentIndex >= ids.length - 1 : cardPosition >= cardPlaylist.length - 1;
  }

  function play(index) {
    if (!ids[index]) return;

    currentIndex = index;
    nowPlaying.textContent = `Now playing: ${SONGS[index]?.title || titleFor(index)}`;

    if (player) {
      player.loadVideoById({ videoId: ids[index] });
    }

    updateButtons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function playPosition(position) {
    if (!cardPlaylist || cardPlaylist[position] === undefined) return;

    cardPosition = position;
    currentIndex = cardPlaylist[position];
    nowPlaying.textContent = `Reading ${position + 1} of ${cardPlaylist.length}: ${SONGS[currentIndex]?.title || titleFor(currentIndex)}`;

    if (player) {
      player.loadVideoById({ videoId: ids[currentIndex] });
    }

    updateButtons();
  }

  function next() {
    if (cardPlaylist !== null) {
      if (cardPosition < cardPlaylist.length - 1) {
        return playPosition(cardPosition + 1);
      }

      cardPlaylist = null;
      cardPosition = 0;
      nowPlaying.textContent = "Music reading complete ✦";
      updateButtons();
      return;
    }

    if (currentIndex < ids.length - 1) {
      play(currentIndex + 1);
    } else {
      nowPlaying.textContent = "You reached the end of the collection ✦";
    }

    updateButtons();
  }

  function previous() {
    if (cardPlaylist !== null) {
      if (cardPosition > 0) {
        playPosition(cardPosition - 1);
      }
      return;
    }

    if (currentIndex > 0) {
      play(currentIndex - 1);
    }
  }

  function attachRowEvents(row, index) {
    const playButton = row.querySelector(".play");
    if (playButton) {
      playButton.onclick = () => {
        cardPlaylist = null;
        cardPosition = 0;
        play(index);
      };
    }

    const iconButton = row.querySelector(".animal-button");
    if (iconButton) {
      iconButton.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        cardPlaylist = null;
        cardPosition = 0;
        play(index);
      };
    }
  }

  function renderSongList() {
    list.innerHTML = "";

    SONGS.forEach((song, index) => {
      const row = document.createElement("article");
      row.className = "song";

      const icon = makeImage(song.icon);
      icon.title = song.title;
      icon.setAttribute("aria-label", song.title);
      icon.style.cursor = "pointer";

      const title = document.createElement("span");
      title.className = "song-title";
      title.textContent = `♫ ${song.title}`;

      const subtitle = document.createElement("small");
      subtitle.textContent = song.keyword || "YouTube video";
      title.appendChild(subtitle);

      const number = document.createElement("span");
      number.className = "song-number";
      number.textContent = `${index + 1}`;

      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "play";
      playButton.textContent = "Play";
      playButton.onclick = () => {
        cardPlaylist = null;
        cardPosition = 0;
        play(index);
      };

      row.append(number, title, icon, playButton);
      attachRowEvents(row, index);
      list.appendChild(row);
    });
  }

  function makeImage(filename) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "animal-button";

    const actualFilename = filename || "skull.png";
    const label = actualFilename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

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

  function buildReadingCards() {
    cardPlaylist = [...SONGS.keys()].sort(() => Math.random() - 0.5).slice(0, Math.min(6, SONGS.length));
    cardPosition = 0;
    reading.hidden = false;
    cards.innerHTML = "";

    ["✦", "✧", "✩", "✹", "✺", "✷"].slice(0, cardPlaylist.length).forEach((symbol, position) => {
      const card = document.createElement("article");
      card.className = "card";

      const image = makeImage(SONGS[cardPlaylist[position]].icon);
      image.classList.add("card-animal-icon");
      image.querySelector("img").classList.add("card-animal-icon-img");

      const name = document.createElement("span");
      name.className = "card-animal-name";
      name.textContent = SONGS[cardPlaylist[position]].title;

      const link = document.createElement("a");
      link.href = "#";
      link.textContent = `Play song ${cardPlaylist[position] + 1}`;
      link.onclick = e => {
        e.preventDefault();
        playPosition(position);
      };

      card.appendChild(image);
      card.appendChild(name);
      card.appendChild(link);
      cards.appendChild(card);
    });

    updateButtons();
  }

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("player", {
      videoId: ids[0] || "",
      playerVars: {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: () => {
          window.rizneyPlayer = player;
          updateButtons();
        },
        onStateChange: e => {
          if (e.data === YT.PlayerState.ENDED) {
            next();
          }
        }
      }
    });

    window.rizneyPlayer = player;
  };

  function initMusicControls() {
    $("#random-song").onclick = () => {
      cardPlaylist = null;
      cardPosition = 0;
      play(Math.floor(Math.random() * ids.length));
    };

    previousButton.onclick = previous;
    nextButton.onclick = next;
    $("#draw-cards").onclick = buildReadingCards;
  }

  function initContext() {
    const contextButton = $("#context-button");
    const contextOverlay = $("#context-overlay");
    const contextClose = $("#context-close");

    function openContext() {
      contextOverlay.classList.add("open");
      contextOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      contextClose.focus();
    }

    function closeContext() {
      contextOverlay.classList.remove("open");
      contextOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      contextButton.focus();
    }

    contextButton.addEventListener("click", openContext);
    contextClose.addEventListener("click", closeContext);
    contextOverlay.addEventListener("click", event => {
      if (event.target === contextOverlay) closeContext();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && contextOverlay.classList.contains("open")) {
        closeContext();
      }
    });
  }

  function init() {
    renderSongList();
    initMusicControls();
    initContext();
    updateButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
