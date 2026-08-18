# 🧫 Primordial Soup

**A small evolving universe in one HTML file. Now v1.29.**

Creatures with 21 genes and a 108 weight recurrent neural brain swim in a petri dish where they eat, hunt, court, breed with genetic crossover, speciate, remember, speak, leave scent trails, lay eggs, guard nests, hibernate, and grow bodies with real shapes. Nothing is scripted: predators, herds, jackal omnivores, quilled defenders, cold-adapted peoples, wartime brains, and devoted mothers all *evolved* in testing rather than being programmed. You play the environment.

## Play

**Just open the URL.** The game runs entirely in your browser. No download, no account, no server, no frameworks: one file.

Your dish **persists**: it auto-saves as you play, evolution continues while you are away, and your return triggers a visible fast-forward. Install it as an app from the address bar; it works offline and updates itself. Works on phones: panels fold to their headers, tap to expand.

When a dish grows past a few hundred cells, a WebGL renderer takes over and draws thousands of glowing bodies in a third of a millisecond; small dishes keep the hand drawn look, and browsers without WebGL never notice anything changed.

**Seeds**: new dish accepts an optional seed (any number or phrase); the same seed builds the exact same starting world for anyone, anywhere. The 📅 daily dish gives the whole world one shared morning seed, and ⚔ versus seeds two peoples on opposite shores of one arena to see whose line endures.

## What the creatures are

- **🧬 21 genes**: size, speed, vision, diet, fear, fertility, herding, wander, spikes, shell, comfort zone, immunity, brain power, body shape, fins, jaws, egg laying, parental care, hibernation, and masonry, plus color as lineage and mate compatibility
- **🧠 A real evolvable brain**: 108 weights with two recurrent memory cells; fear can outlast its cause; mutated and crossed over like any gene, paid for in energy
- **📣 A voice and ears, 🐜 scent trails**: physical channels only; what any signal means must evolve
- **💕 Sexual reproduction**: courtship, crossover, true species boundaries
- **🦴 Morphology**: eels, sailfins, and crushers are visibly different animals with different physics
- **🐛 Segmented bodies**: gene duplication can grow the genome itself; segments add energy storage, armor, and fins at the price of speed, agility, and hunger, and every creature starts bodiless, so bodies must evolve
- **🐣 Growing up**: newborns start at a third of adult size and grow smoothly into their inherited form by age twelve; a juvenile is genuinely smaller, weaker prey with a smaller bite, and only adults can breed or be courted
- **🥚 Lifecycles**: eggs that incubate and can be stolen, guarded nests, provisioning parents, torpor for the cold and starving
- **🦔 Quills and shells** with honest tradeoffs; **🦠 parasites** with evolving virulence; gentle strains become helpful **symbionts**

## The world

- **🌿 Plants** grow and spread themselves; **🍄 fungi** feed on the fallen and burst into new life
- **🪸 Reefs**: creatures with the masonry gene pay real energy to lay living stone; reefs block sight, gather algae gardens six times richer in famine, and erode without upkeep
- **🪨 Rocks** block movement and sight; ambush predation is real; sculpt them by hand
- **🌊 Currents** sweep the small; the big and the finned resist
- **🌡 Climate**: a warm end, a cold end, and a four minute year with seasons
- **🌍 Seven world types**: Classic, Ice World, Eden, Plaguelands, the Daily Dish, the Archipelago (one people, three lagoons, narrow straits; geography becomes speciation), and the Ocean (a wide fertile sea that grows crowds)

## You

- **🔍 inspect** any creature; **✎ name** it; **☆ follow** its bloodline forever; **🎴** turn it into a trading card
- **Blessings**: 🌿 bloom, 🧬 seed strangers, 🧪 elixir (heal and cure); **Catastrophes**: ☄️ meteor, 🦠 plague, ❄️ ice age
- **🧪 The Workshop**: design a genome by hand, sliders for all 20 genes with a live portrait, and release four of your design; their blank minds must still evolve
- **🎵 Leitmotifs**: every creature sings its genome; click one to hear it, and new species announce themselves in song
- Armed tools show a live reticle with their true blast radius
- **☀️ sunlight** and **☢️ radiation** dials; **❓ guide** teaches everything in plain bullets

## It remembers everything

- **🌳 Tree of life**: a live phylogeny streamgraph with hover tooltips naming any lineage
- **🔭 The Observatory**: species census, vital signs, record holders one tap away, and full JSON export of your world
- **📜 The Chronicle**: the dish writes its own yearly history
- **⏪ The Time Machine**: every dish records its interventions from birth; replay its entire history like film, then **🎬 export the whole story as a video timelapse**
- **🏛 The Museum**: retired worlds rest with their complete history; revivable ones rerun it and live again
- **🗓 The calendar**: event weeks retheme the shared daily dish (the Great Winter in December, the Age of Plagues at Halloween, the Garden Week in April, the Birthday of the Soup in August)
- **🎓 The Classroom**: six guided experiments on shared seeds; every student sets up the identical world, so results can be compared across a whole class
- **🟠 Amber**: long lived dishes earn patinas and honorifics; two years is a Fleck, five the Amber Seal, ten Deep Amber, twenty Eternal
- **🌐 The boards**: four world leaderboards (the daily dish, oldest world, deepest generation, longest dynasty); publishing sends only a callsign and statistics, no accounts, no names, and simulated age is checked against the wall clock so cheats bounce
- **🏆 Records and 🏅 44 badges** that survive every world; **🆔 every dish has a callsign** like SOUP-K7F3-9Q

## Sharing

- **⇪ Export** your whole world as a compressed seed string; **⇩ import** anyone else's, fossil record intact
- **📷 Postcards** with stats, records, and badges; **🎴 creature cards** drawn true to the genes
- **👑 Heirloom dishes**: when a world's story ends, harvest its best bloodlines to found the next one; dynasties chain with roman numerals

## Roadmap

The plan (shipped versions with field notes, what's next, and the honest answer to "how far can this go") lives in [ROADMAP.md](ROADMAP.md) (rendered at [roadmap.html](roadmap.html)).

Have an idea for the dish? Open an issue; the roadmap's Greenhouse section is where suggestions grow into versions.

The emergent findings are written up as an informal research note in [PAPER.md](PAPER.md): couch potato evolution, wartime brains, the jackal niche, and why nothing free stays honest.

## Field notes

This project's best moments were diagnoses: creatures that orbited food they could not reach, a predator that starved while touching its prey, a dish rim that was accidentally a merry-go-round sanctuary, brains that tripled under predation then shrank in peacetime, a test subject eaten by its own test apparatus, and new dishes haunted by the scent ghosts of the dead worlds before them. The debugging stories are preserved in the roadmap: bugs are field notes.

Performance is a standing rule: the whole simulation runs in well under a millisecond per step, and every release reports its numbers.

---

*Built live in conversation with Claude. The roadmap is the genome.*
