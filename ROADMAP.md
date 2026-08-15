# 🧫 Primordial Soup Roadmap

*A small evolving universe in one HTML file. No dependencies, no scripts telling creatures what to become, just genomes, physics, and selection.*

**Play:** open `index.html`, or the published artifact. **Source:** everything lives in one file, on purpose: the whole universe should stay readable in one sitting.

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

---

## Next (each ~a session)

- **The Observatory**: deeper data views; per species stat tables, trait histories, tree tooltips, exportable dish data. Watching evolution should feel like science.
- **Performance floor (WebGL)**: renderer rewrite, 1k to 10k creatures; a dedicated session.
- **Leaderboard + callsign design session**: dish identities, per dish scores, the social layer; designed together with David before any backend exists.

## Later

- **Global leaderboard**: longest dishes and deepest generations worldwide; needs a small backend, design to be discussed. Design note from David: every dish gets a unique auto generated callsign (letters and numbers) as its identity, enabling tracking, per dish scores, and a running log; the social layer grows from there.
- **Performance floor**: spatial-hash tuning, offscreen sprites, optional WebGL renderer: 1k → 10k creatures.
- **The menu-bar pet**: a native always-on dish (Tauri) living in the corner of the screen; true 24/7 evolution, glanceable like a fish tank.

## Greenhouse (ideas under consideration, not yet scheduled)

Fun and attachment: postcards (one tap shareable dish portraits), daily dish (one global seed per day, every copy diverges), scenario worlds (Ice World, Eden, Plaguelands), creature trading cards, finger painted terrain, dish versus dish (two seeds collide in a split world).

Deeper evolution: memory neurons (fear that lingers, remembered food), evolved signaling and hearing (alarm calls, and eventually lying), pheromone trails, morphology genes (bodies with segments, fins, jaws), lifecycles (eggs, parental care, evolvable hibernation), decomposer fungi, parasites softening into symbionts, and proto-culture: behavior spreading without genes once memory and signals exist.

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
