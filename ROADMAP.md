# 🧫 Primordial Soup Roadmap

*A small evolving universe in one HTML file. No dependencies, no scripts telling creatures what to become, just genomes, physics, and selection.*

**Play:** open `index.html`, or the published artifact. **Source:** everything lives in one file, on purpose: the whole universe should stay readable in one sitting. **Ideas:** open a GitHub issue; the Greenhouse below is the public garden of what might grow next.

---

## North star

A dish that keeps surprising us. Every feature must create **selection pressure**, never a scripted outcome. If we can predict exactly what evolves, the feature failed. The long goal: climb the ladder from *parameter evolution* (tuning knobs on a fixed animal) to *open-ended evolution* (new kinds of things keep appearing).

## Design principles

1. **Physics, not scripts.** Mechanics are costs and opportunities; behavior emerges. (Predators became viable through geometry fixes, not stat buffs.)
2. **Measure before tuning.** Every balance change in this project came from instrumenting a single creature and watching it live or die. Napkin math lies; telemetry doesn't.
3. **Bugs are field notes.** The best moments so far were diagnoses: creatures orbiting food they couldn't reach, hunters starving mid-contact, the rim carousel. Keep the stories.
4. **The dish must survive the player.** Catastrophes and dials can devastate but not brick the toy: extinction triggers spontaneous generation.
5. **One file.** Readability is a feature.

---

## Shipped

### v0.1 · The dish
Genomes (size, speed, vision, diet, fear, fertility, wander), energy economics, algae blooms, god tools (meteor, plague, ice age, bloom, seed), dials (food, radiation), inspector with named creatures, population + trait-drift charts.
*Field notes:* creatures orbited their food (turn radius > eat radius) and starved amid plenty; fixed with arrival slowdown + opportunistic grazing. First dish evolved **couch potatoes**, slowness as a survival strategy.

### v0.2 · Predation that works
Target lock with give-up timer, opportunistic bite, **lead pursuit** (intercept-point aiming; pure pursuit provably loses to a tighter-turning dodger), satiation, reproduction cooldown, diet-scaled metabolism, quadratic meat digestion (specialists only), nutrient recycling from corpses.
*Field notes:* the dish is too small for stable apex wolves (2-3 sustainable individuals → stochastic extinction), so the persistent niche is the **jackal** (omnivore). A cannibal-soup collapse taught us casual meat-eating must not pay. The rim of the dish was accidentally a predator-proof sanctuary; fixing it turned the rim into a hunting ground.

### v0.3 · Sex, species, herds
Sexual reproduction with courtship, uniform crossover + mutation, **hue-based mate compatibility (±40°)** with assortative preference, desperation-clone fallback for the lonely, herd gene (kin cohesion + alignment, stampedes), slowed hue drift so speciation takes generations.
*Field notes:* sex became 93-98% of births immediately. Herding verified (3× clustering) but **selected against in predator-free dishes**, crowding costs with no benefit. Natives stay one species under panmixia (honest biology: no isolation, no speciation); founder events via the seed tool create instantly isolated species. High radiation is now a genuine sterilization ray (mutational meltdown).

### v0.4 · Terrain
Rocks (physical obstacles: slide-along collision, prey can be cornered, wanderers steer off) and **current jets** that slowly wander across epochs, carry algae into food streams, and sweep small creatures while big ones resist; size is now also current-resistance. Marine snow advects with the flow, so currents are visible. Species counter, sexual/cloned birth counters, and divergence announcements in the HUD.

### v0.5 · The dish lives on your machine
Persistent worlds: the dish auto-saves every few seconds and resumes exactly where it left off (same rocks, same species, same history), and when you return it **simulates the time you were away** as a visible fast-forward ("⏩ while you slept: 214 born, 198 died"). Installable as an app (PWA): offline-capable, lives in your dock. "New dish" now asks before erasing a world, because worlds are worth something now.
*Field notes:* first step toward the ambient-companion goal: a dish that effectively runs 24/7. It remembers, and time passes while you're gone. Verified by save → wipe → restore → catch-up round-trip: the world returned atom-for-atom identical, then lived its missed five minutes to the exact second.

### v0.6 · The tree of life
A live phylogeny panel: every creature carries a lineage id, children inherit it until their color drifts past 30° from the lineage's founding hue, and that drift founds a branch. Seeded strangers found new roots. The tree renders as a streamgraph (band thickness is population, splits are speciation, fading bands are extinctions) and its envelope is the population curve itself. Adaptive downsampling keeps a week-old dish's whole history in bounded memory, dead twigs fold into their parents, and the tree survives save/load, so it grows across visits and through catch-up time.
*Field notes:* a high-radiation test dish produced 81 lineages in eleven minutes, and the great famine appeared in the tree as a pinch in the stream. Lineage count and species count measure different things: the tree records history, the species counter records current gene flow.

### v0.7 · Arms and gardens
Two builds in one. Armor and weapons: spike and shell genes with honest costs. Shells raise the size advantage a predator needs to crack you but slow you 28% and cost metabolism; quills wound attackers on contact, sometimes fatally. Predators account for shells when choosing targets. Plants that spread: algae now reproduce locally with logistic crowding instead of raining from the sky, leaving only a thin spore drizzle that strengthens over bare ground so deserts can recover. Corpses and meteor debris act as seeds, and the sunlight dial now scales growth.
*Field notes:* under seeded predation (157 kills), prey spikes nearly doubled and speed rose 22% in four minutes while shells rose only modestly. In a patchy-food world, defense that slows travel is too expensive, so evolution bought quills. Nobody designed that preference. The plant economy settled into a churn equilibrium where most deaths are adult starvation between patches: honest spatial ecology, fat patch-dwellers and dying travelers.

### v1.0 · A finished game
Dish seeds: export any world as a compact compressed seed string and import someone else's; trade ecosystems, replay famous dishes, watch alien life take hold in your own dish. Sound: a quiet Web Audio voice for the dish (births blip, kills thud, meteors rumble, ice shimmers) with a mute toggle and a limiter so busy dishes stay gentle. A first-visit welcome card explains the game in four lines. Together with the tree of life, persistent worlds, and the living plant ecology, this closes the v1.0 milestone: a polished toy a stranger can enjoy with no explanation.
*Field notes:* a seed is the save format itself, so sharing a dish shares its whole fossil record: terrain, genomes, and family tree arrive intact.

### v1.1 · Climate
The dish gets a warm end, a cold end, and a four minute year. Local temperature scales plant growth, metabolism, and movement speed: warm water is fast rich living, cold water is a slow larder. A twelfth gene, warmth, sets each creature's comfort zone with a discomfort cost for living outside it. Seasons swing the whole dish through spring, summer, autumn, and winter, shown in the report and as an amber and blue wash over the water. Also in this build: a real mobile layout with panels that fold to their headers, and link preview tags so shared links unfurl nicely.
*Field notes:* the warm side gets grazed bare by fast living creatures while the cold side accumulates standing algae, tropics and poles in miniature; nobody designed that. An eighteen minute geographic speciation watch found no sympatric split (gene flow wins while creatures roam freely) but strong local adaptation: the population's warmth gene tracked its habitat from 0.6 down to 0.31 as it settled the cold larder, with the warm side subpopulation consistently warmer adapted than the cold side. Adaptation is easy; speciation needs isolation.

### v1.2 · Minds, plagues, and shadows
Three systems in one build. Neural brains, the frontier groundwork: every creature now carries a 20 weight neural layer reading ten senses (food and threat bearings, energy, temperature, kin density) and outputting a steering nudge and thrust change, blended by a new brainW gene that starts near zero. Neural tissue costs real energy, so brains must earn their influence through selection; weights mutate and cross over like any gene. Evolving parasites: a second replicator living on hosts, one virulence gene governing both drain and spread, mutating at every transmission, countered by a new host immune gene with its own metabolic cost. Transmission by contact and by eating infected prey; patient zero arises naturally in any clean dish. Line of sight: rocks now block perception, so prey cannot fear what they cannot see, and predators remember hidden prey briefly and search. Also: persistent player records (longest dish, peak population, deepest generation, oldest creature) that survive across dishes, with ticker celebrations.
*Field notes:* the first epidemic build saturated the dish in a minute (89 percent infected) thanks to a double scaled patient zero rate; cooled, outbreaks now come in waves separated by quiet minutes. Immunity drifted upward even without parasites until it was given a metabolic cost: free insurance always wins, so nothing in the dish is free anymore.

### v1.3 · Trophies and the first thought
The badge gallery: seventeen named achievements built on the records system (Centenarian, Plague Survivor, Petty God, The Thinker, Ice Folk and friends), earned across dishes forever, opened by clicking the records line. The god tools reorganized into three blessings (bloom, seed, and the new elixir, which restores energy and cures parasites in an area) and three catastrophes (meteor, plague, ice age), with inspect standing alone. A brain trait sparkline joins the report.
*Field notes:* the brain selection experiment delivered. Under seeded predation, average brain weight tripled from 0.05 to 0.148 in about three minutes of heavy hunting, then relaxed back toward baseline once the predators died out: evolution rented a brain when hunted and let the lease lapse in peacetime. Total weight magnitude also grew steadily, meaning brains grew structurally, not just in influence. Thought, in this dish, is a wartime expense.

### v1.4 · Bloodlines and the Chronicle
Name any creature (the ✎ button in the inspector) and follow its line (the ☆ button): the report then tracks your bloodline forever, celebrating each ten generations and mourning the line's end if it comes. The dish also writes its own history now: the Chronicle (📜 in the tools panel) records each year's births and deaths alongside meteors, plagues, ice ages, first infections, divergences, and badges, and it persists with the save. A Dynast badge honors any followed line that reaches generation 25.
*Field notes:* in the first test, a founder named Adam was followed, produced 85 living descendants by generation 13, and died of old age during his own experiment. The feature works: it already hurts.

### v1.5 · Postcards and creature cards
The 📷 postcard button composes a shareable image of your dish: the living world, its stats, the tree of life, and the address. The 🎴 card button in the inspector renders any creature as a trading card: portrait with quills, shell, and jaws drawn true to its genes, plus all ten traits as bars. On phones both open the native share sheet; on desktop they download. A Photographer badge for your first postcard. Also: a visible version badge in the panel and self applying updates, so no device ever plays a stale build again.

### v1.6 · Names for worlds, worlds to choose
Every dish now has a callsign, a unique identity like SOUP-K7F3-9Q, shown in the report, written into the Chronicle at birth, and stamped on postcards and creature cards along with the date and season. New dish now opens a world picker: Classic, Ice World (endless winter), Eden (lush and gentle), or Plaguelands (the sickness is endemic), each persisted with the save. A 🪨 rock tool joins the panel: tap water to raise a rock, tap a rock to crumble it, and reshape the geography of evolution by hand. An Iceborn badge honors keeping an Ice World alive to year 2. Postcards gained the richer information line requested by David.

### v1.7 · Memory
The brain grows from a 20 weight reflex sheet into a 48 weight recurrent circuit with two memory cells: slow inner states with a roughly three second half life that the brain can write to and read from. All memory circuitry starts at zero, in founders and in migrated dishes alike: evolution must discover remembering on its own and pay for it, since active weights cost energy. Old brains migrate losslessly into the new architecture. A Rememberer badge waits for the first population whose memory circuits carry real weight.
*Field notes:* the substrate verified in a controlled scare: a wired memory cell charged to half strength within a second of threat exposure and, after the threat was removed, faded smoothly over seven seconds. Fear that outlasts its cause is now physically possible in the dish; whether evolution buys it is the experiment that never stops running. Also recorded for honesty: the first test subject was eaten by its own test apparatus, a predator placed too close and too hungry. Lab safety improved.

### v1.8 · Signals
Creatures gain a voice and ears, and nothing else is given. A fifth brain output emits a visible pulse that costs real energy and is rate limited; three new hearing inputs carry the direction and intensity of nearby calls. What a call means is defined nowhere in the code: meaning must evolve. If alarm calls appear, it is because kin who fled at the sound survived; if false alarms appear, it is because scattering the competition paid. The brain grows to 75 weights with all new circuitry at zero, old brains migrate losslessly, calls per minute joins the report, and a First Word badge waits for the first population that truly speaks.
*Field notes:* the channel verified end to end: a wired speaker emitted on schedule, the calls hung in the water for their moment, and a wired listener turned toward every one. Sound made, sound heard, behavior changed. The dish now waits for its first honest word, and for its first lie. Also in v1.8.1: a Field Guide panel (❓ in the tools) teaching new players everything the dish can do in plain scannable bullets, born from David's request; it is also linked from the welcome card.

### v1.9 · Pheromones
A scent field lives on the dish floor: a coarse grid costing six kilobytes of memory, fading over about fifteen seconds. A sixth brain output deposits scent at real energy cost; three new senses smell the local intensity and the direction of the gradient. Trails render as faint teal ghosts. As with calls, meaning is scripted nowhere: whether trails become roads to food, territorial markings, or lures is evolution's decision. The brain grows to 108 weights, every migration remains lossless, and a Trailblazer badge waits for the first people who leave trails worth following.
*Field notes:* a wired depositor painted its wandering across the floor and the field held its shape as designed. Performance stayed light on purpose, per David's rule that the dish must never be heavy: 0.6 milliseconds per simulation step at a population of 117.

### v1.10 · The Observatory
Watching evolution now feels like science. The 🔭 observe panel holds a live species census (color, population, average size, speed, diet, and brain per species), dish vital signs, and the record holders (fastest, largest, eldest, brainiest), each one tap from visiting the creature itself. The tree of life answers questions now: hover or tap any band to identify the lineage, its current and peak population, its birth year, and whether it has ended. And the whole world exports as clean JSON: dish identity, records, badges, species statistics, full trait histories, and the entire Chronicle, ready for anyone's graphs. A Naturalist badge for the first export.

### v1.11 · Morphology
Bodies leave the circle behind. Three shape genes with honest tradeoffs, all starting near zero so evolution sculpts its own anatomy. Elongation: a streamlined ellipse with cheaper straight line travel and a mouth at the nose, but slower turning. Fins: more thrust and resistance to the currents, at higher burn. Jaws: crack bigger and better shelled prey, for a standing metabolic cost. Rendering follows the genome: eels, sailfins, and crushers are now visibly different animals, on creature cards too. A Shapeshifter badge honors the first population whose bodies truly leave the circle.
*Field notes:* max jaws lower the size ratio needed to crack a full shell from 1.79 to 1.36; armor stays formidable but no longer absolute. The ecology absorbed all three genes without a tremor, and the genome then counted 17 genes plus 108 brain weights.

### v1.12 · Lifecycles
Three new genes, three ways to spend a life. Eggs: lay richer provisioned offspring that incubate helpless for fourteen seconds; eggs are food, so the egg thief is now a possible profession. Care: guard your nest (nobody raids while a parent stands watch within reach) and provision your hatchlings with energy transfers, paying for it with slower rebreeding. Torpor: when cold and starving, sleep; metabolism crashes and so does your ability to flee. All three start near zero. Winter, predators, and scarcity will decide who becomes a devoted mother, an egg thief, or a hibernator. Clutch and Winter Sleepers badges; the genome reaches 20 genes.
*Field notes:* a tracked egg hatched on schedule with its provisioned energy intact, nest protection blocked raids while the parent stood watch, and torpor engaged exactly at the cold and hungry threshold. The ecology absorbed all of it at population 311.

### v1.13 · Fungi and communion
The third kingdom rises, and the plague learns mercy. Death now feeds fungi: corpses sprout violet decomposers that either become rich scavenger food for anyone willing, herbivore and hunter alike, or mature and burst into fresh algae, closing the loop from death back to life. Kill zones become feeding grounds; plagues and meteors leave mourning blooms. And symbiosis: a parasite whose virulence mutates below 0.12 crosses into mutualism, nearly free to carry, granting a digestion bonus, and occupying the niche so harmful strains cannot infect its host; premunition emerges for free from the one parasite per host rule. Evolution can now walk a plague all the way down into a partnership. Mycelium and Communion badges; 29 in the gallery.
*Field notes:* death sprouted fungus, mature fungus burst into plants, and symbionts were counted and carried, all verified while a natural epidemic raged through the test dish, because the world no longer pauses for science. This closes the science ladder that began with the first evolvable brain.

### v1.14 · Destiny seeds
Every roll of fate now flows through one seeded generator, so a dish is perfectly reproducible: the new dish picker accepts an optional seed (a number, or any phrase, hashed), and the same seed builds the same world down to every rock, founder genome, and brain weight, with the same callsign. Verified beyond the requirement: two runs of the same seed matched even after ten simulated seconds of evolution. This is the foundation the social tier stands on: a daily dish where the whole world shares one morning seed, and dish versus dish. Also: armed tools now show a live reticle at the cursor with their true blast radius in their own color, so meteor and elixir can never be confused again.

### v1.15 · The daily dish and the war of two shores
The social tier arrives. 📅 Today's dish: one tap seeds the world from the date itself, so every player on Earth who starts today starts the same world, and the evening's postcards show how differently the same beginning can end. ⚔ Versus: two seeds found two peoples on opposite shores of one arena, their colors forced far enough apart that they are true separate species who cannot interbreed, and the dish referees: when one founding line's last descendant falls, the Chronicle records the victor. Day Player and Warbringer badges bring the gallery to 31.
*Field notes:* the versus referee was tested by exterminating the west twice, and twice the verdict correctly refused to come: the west survived the first purge through eggs laid before the fall, and the second because dying grazers ate their way back to life in their final frame, one bite of algae outweighing the poison. Only true extinction brought the verdict: the west has fallen, the east endures. A referee that cannot be rushed, and a lifecycle system that defeats genocide by lunch and by egg, were both working exactly as built.

---

## Next (each ~a session)

- **Performance floor (WebGL)**: renderer rewrite, 1k to 10k creatures; a dedicated session.
- **Leaderboard + callsign design session**: dish identities, per dish scores, the social layer; designed together with David before any backend exists.

## Later

- **Global leaderboard**: longest dishes and deepest generations worldwide; needs a small backend, design to be discussed. Design note from David: every dish gets a unique auto generated callsign (letters and numbers) as its identity, enabling tracking, per dish scores, and a running log; the social layer grows from there.
- **Performance floor**: spatial-hash tuning, offscreen sprites, optional WebGL renderer: 1k → 10k creatures.
- **The menu-bar pet**: a native always-on dish (Tauri) living in the corner of the screen; true 24/7 evolution, glanceable like a fish tank.

### v1.16 The Time Machine (2026-08-16)
Every dish now logs each intervention, every meteor, bloom, elixir, rock, stranger, plague, ice age, and dial change, stamped with its exact simulation step. Because worlds are seeded and deterministic, the log plus the seed IS the dish's complete history: press ⏪ replay and watch your world begin again, at 4x or 16x, pause it, or exit back to the present. Guards keep history read only: saves, tools, and dials are locked while the machine runs. Old dishes predate their own records and say so honestly; every dish born from v1.16 onward carries its whole past. Field note: the first replays diverged from history because the sunlight dial applied its present value to the past; the fix logs the dials the dish was born with as step zero entries. A second bug: versus dishes forgot which two founding seeds built them; the pair is now part of the save. Verified bit identical replays across classic, versus, and non default dial dishes: same random stream, same positions, same energies. Historian badge (32).

### v1.17 The Film (2026-08-16)
Press 🎬 film inside the time machine and the replay records itself: canvas capture at 30fps, exported as mp4 where the browser allows it, webm elsewhere, delivered through the native share sheet on phones or a straight download. A ten minute dish becomes a half minute film of its entire history. Cinematographer badge (33). Performance: 0.98ms per step at population 203; replay frames 8.4ms at 16x, comfortably inside the 60fps budget.

### v1.18 Heirloom dishes (2026-08-16)
When a world's story ends, it no longer has to end. The 👑 heirloom button in the world picker harvests the eight most evolved living cells, deepest generation first, and founds a new dish from their descendants: fresh terrain, fresh seed, seventy founders drawn from eight bloodlines with fixed founding mutation so replays stay honest. Dynasties chain: the dish report reads SOUP-XXXX · dyn II, the chronicle records the ancestry, and the heirs carry their parents' brains into the new world. Field note: the first heirloom replays diverged, and the cause was a ghost. The pheromone scent field was never cleared between worlds, so every new dish inherited the fading trails of the dead one, and a replay began atop the scent its own history had left behind. One line, scent.fill(0), exorcised it, and hardened the deterministic seed promise for every dish type. Heirloom badge (34).

### v1.19 The Workshop (2026-08-16)
Design a life by hand: twenty sliders, one per gene plus hue, a live portrait drawn from the genome as you shape it, and three presets to start from (hunter, tank, grazer). Release four of your design anywhere in the dish. Their bodies are yours; their minds are blank, and thought must evolve on its own. Released designs are logged like any intervention, genome and all, so a dish with designed creatures still replays bit identical. In testing, four hand built hunters became five within eight seconds: the design bred. Creator badge (35).

### v1.20 Sound evolution (2026-08-16)
Every creature sings its genome. The root note comes from hue on a pentatonic scale, the octave from size (the big sing low), tempo from speed, intervals from diet (herbivores major, carnivores minor), timbre from armor (shells sing square waves, quills sawtooth), phrase length from brain power, vibrato from wander. Click any creature to hear its line; when a species diverges, the newborn lineage announces itself in song. Motifs are pure functions of the genome: no randomness, no effect on the simulation stream, so replays stay bit identical and evolution becomes audible as songs drift with the genes that carry them.

### v1.21 The Museum and the calendar (2026-08-16)
Worlds no longer die when you leave them: replacing a dish retires it to the 🏛 museum with its callsign, dynasty, final census, and, for dishes born since the time machine, the complete seed and intervention log. Revival reruns the whole history at speed and then hands the world back alive, exactly where it stopped, bit identical, its own time machine intact. Twelve worlds rest at a time; the oldest yields its place. And the 🗓 calendar joined the daily dish: event weeks give everyone on earth the same themed world, the Great Winter in late December, the Age of Plagues at Halloween, the Garden Week in April, and the Birthday of the Soup in mid August, which is this very week. Curator badge (36).

### v1.22 The Classroom (2026-08-16)
Five guided experiments, each a question, a seeded world, and instructions on what to watch: selection under the hammer (predation reshapes prey bodies), thought is a wartime expense (brains grow only while the hunt is on), nothing free stays honest (virulence attenuates, immunity is rented not owned), speciation by color and by song (lineages drift apart in hue and in leitmotif together), and the ghost of the ice (endless winter selects hibernation and cold comfort). Because experiment worlds are seeded, every student who presses set up gets the identical dish, and a classroom can compare runs like real replicates. Setup releases are logged like any intervention, so experiment worlds replay bit identical in the time machine. Graduate badge for running three (37).

### v1.23 The Archipelago (2026-08-16)
One people, three lagoons. Sealed reef walls divide the dish into three seas joined only by narrow straits, and a single founding population is scattered across them. Geography does the rest: isolated lagoons drift apart in color and body until the strains counter climbs, which is allopatric speciation, the textbook mechanism the old panmictic dish could never produce. Migration is real and measured: rock sliding collision turns the reef walls into guide rails that funnel the bold through the passes, about a dozen crossings a minute in testing, each one counted with hysteresis so boundary loiterers do not inflate the ledger. The scent trails of wayfarers literally paint the migration highways on the reef. Wayfarer badge for witnessing ten crossings (38).

### v1.24 The ocean and the fast renderer (2026-08-16)
The 🌊 ocean scenario seeds a wide fertile sea, 120 founders and thick algae, and populations boom into the many hundreds. To draw them, a WebGL renderer now takes over above 250 cells: one buffer, one draw call, soft glowing oriented bodies with hue, elongation, energy, and torpor intact. Measured: 2,900 creatures render in 0.34 milliseconds where the canvas path needs 8.9, a 26x speedup with a flat cost curve, and the whole thing falls back to the hand drawn canvas automatically on small dishes and on browsers without WebGL. The toolbar also got its reckoning: nine panel launchers compressed into one three column grid, and the ticker moved to bottom center so updates never hide behind a growing toolbar again. And a confession from the audit: screen shake had been quietly drawing from the simulation's random stream every frame after a meteor, which made post meteor live timelines subtly unreplayable; shake now has its own private random stream, and the determinism promise is whole. Legion badge for a thousand cells alive at once (39).

### v1.25 Amber and the boards (2026-08-16)
The social layer begins. Amber is prestige that cannot be bought, only lived: a dish that survives two years earns its Fleck, five the Amber Seal (and a faint patina on the dish rim), ten Deep Amber, twenty Eternal Amber, honorific stars beside the callsign throughout. And the 🌐 boards: four world leaderboards, the daily dish, oldest world, deepest generation, longest dynasty, served by a one file Cloudflare Worker with a tiny database. There are no accounts and no names: a dish callsign is the whole identity, bound to a secret token on first publish so nobody can post as you. Cheating is structurally hard: simulated age is checked against the wall clock at maximum speed, the daily board only accepts today's shared world, and every entry carries its seed, so any suspicious world can in principle be re run and verified bit for bit, the time machine as anti cheat. Field note: the first publish only ever landed one board, because the per dish rate limit fired between sequential submissions from a single button press; the protocol became a batch, one request carrying all four boards. Verified end to end against a local worker: publish, rank, rate limit honesty, dynasty entries, token theft rejection. The client ships dark until the worker deploys. Amberbound and Herald badges (41).

### v1.26 The Body Plan (2026-08-16)
The first rung of the open endedness ladder: genomes that grow. A new mutation can duplicate a body segment, literal gene duplication, and each segment carries its own fin, quill, and shell genes with real physics: 45 percent more energy storage per segment, more current resistance, body quills that punish biters and body shells that resist jaws, against 26 percent more metabolism, less speed, and a wider turning circle. Fins on segments claw thrust back. Every creature in every world starts bodiless, exactly as before, so bodies are not given, they are discovered: in the first test dish two creatures grew their first segment within two minutes under high radiation. Segments render as undulating trail following chains in both the canvas and WebGL paths, and worlds with evolved bodies replay bit identical. Field note: the first replay test failed until the test itself was found guilty; two probe creatures spawned between world birth and history consumed unlogged random draws, lab contamination, not a code bug. The sterile rerun matched exactly. Leviathan badge for a four segment body (42).

### v1.27 The Reef Builders (2026-08-17)
Niche construction: the world itself joins the genome's reach. A 21st gene, masonry, lets an energy rich creature pay six energy to lay living stone. Deposits near an existing reef grow it; fresh stone starts as a pebble. Reefs are real terrain, they block sight and movement like any rock, and they erode steadily without upkeep, so a reef is a living thing that dies with its keepers. The payoff is the garden: currents collect nutrients at reef edges, so algae sprout faster and pack denser there. Measured at grazed equilibrium in a hungry dish, the reef circle held six times the standing crop of a mirrored control; in times of plenty the effect vanishes into saturation. That is the experiment the dish now runs forever: gardens feed every grazer, mason or not, so building is a public good, and whether builders can outlast freeloaders is left to selection. Two bugs fell in passing: algae were never clamped to the dish rim, so currents had been quietly sweeping food off the edge of the world since terrain shipped, uneatable and still counted against the cap; and the garden effect was invisible in early tests because saturated dishes hide it, a lesson in measuring at the equilibrium that matters. Architect badge for forty stone of creature built reef (43). Patch v1.27.1: reef pebbles crashed the rock highlight arc with a negative radius and one draw error could freeze the whole loop; the arc is clamped, draw errors can no longer stop the world, and the site now keeps its own error log, surfacing problems in the ticker and storing the last eight on device.

---

## Greenhouse (ideas under consideration, not yet scheduled)

Fun and attachment: Amber: a cosmetic prestige idea from David, rewards for dish longevity such as patinas, honorifics, and postcard flourishes, deliberately without blockchain or money; to be designed in the leaderboard phase.

Deeper evolution: and proto-culture: behavior spreading without genes once memory and signals exist.

## Greenhouse seedlings (planted 2026-08-15, fresh ideas awaiting approval)

The greenhouse stands empty for the first time: every seedling planted on 2026-08-15 has shipped. New seeds welcome at the idea box.

## Frontier (the "how far can this go" answer)

- **Neural brains.** Replace the fixed seek/flee/wander program with a tiny evolvable network (inputs: food/threat/kin vectors, energy; outputs: turn, thrust). Behavior itself then evolves: ambush, migration, hoarding, deception could appear *unprogrammed*. This is the jump from tuning an animal to growing one.
- **Morphology.** Multi-segment bodies (genes for plan: segments, fins, mouths), where speed/size/armor stop being abstract numbers and become consequences of shape.
- **Open-endedness.** The honest research frontier (Tierra, Avida, and friends): can the dish keep inventing? Nobody has fully solved this. We get to try in one HTML file.

**Ceilings, stated honestly:** gene ranges bound every trait (a pinned gene is a spent direction); one canvas thread comfortably holds ~1k creatures (WebGL raises it ~10×); and without new genes or brains, evolution here optimizes but never invents. The roadmap above is, precisely, the plan for removing those ceilings one at a time.

---

## Experiments worth running (science mode)

1. **Selection reversal:** seed predators → watch herd/speed/fear rise; remove them (plague) → watch the same traits decay.
2. **Founder speciation:** seed a stranger during algae recovery (not famine); its lineage is reproductively isolated by construction.
3. **Radiation dose-response:** find the mutation rate where adaptation tips into meltdown.
4. **Current niches:** compare mean size of creatures living inside vs. outside jet streams (drag selects).
5. **Island biogeography:** meteor one half of the dish repeatedly; compare diversity between disturbed and calm halves.
