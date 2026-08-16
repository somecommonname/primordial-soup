# Field Notes from a Petri Dish: Emergent Findings from a Browser-Based Evolution Simulator

*This is a first draft, for David and Claude to revise.*

## Abstract

Primordial Soup is a browser based artificial life simulator, one HTML file, where creatures with 20 genes and a 108 weight recurrent neural brain eat, hunt, court, breed, speak, and leave scent trails in a persistent dish. No behavior is scripted: every channel is physically implemented and paid for in energy, with meaning left to selection. Across twenty three shipped versions the dish produced unplanned outcomes: creatures that evolved to sit still near food, an omnivore niche where apex predators could not persist, quills chosen over armor, brains that grew under predation and shrank in peace, and a parasite that evolved into a partner. These findings come from single creature telemetry, seeded deterministic runs, and accelerated runs measured in minutes, not theory. They show that honest costs generate real selection pressure in a small toy system, not open-ended evolution, which remains the project's unmet frontier.

## 1. The System

Primordial Soup runs in one HTML file: no server, no build step, no dependencies, readability itself a stated feature. Each creature carries 20 genes: size, speed, vision, diet, fear, fertility, herding, wander, spikes, shell, comfort zone, immunity, brain power, body shape, fins, jaws, egg laying, parental care, hibernation, and color, which doubles as lineage marker and mate signal.

Behavior is not a decision tree. Every creature carries a 108 weight recurrent neural brain with two memory cells, reading senses such as food and threat bearings, energy, temperature, kin density, and nearby calls and scent, then outputting steering, thrust, a call, and a scent deposit. Neural tissue costs real energy: a brain earns its size.

Reproduction is sexual, with hue based mate compatibility near plus or minus 40 degrees and assortative preference for similar hues. Parasites are a second replicator on hosts, governed by one virulence gene controlling drain and spread, countered by a host immune gene with its own metabolic cost; virulence that mutates low enough crosses into mutualism, a nearly free symbiont.

Climate and terrain complete the dish: a warm end and cold end cycle through a four minute year, scaling growth, metabolism, and speed against each creature's comfort zone; rocks block movement and sight; current jets sweep small or finless creatures along. The code implements a channel and a cost, never an outcome: meaning is scripted nowhere.

## 2. Methods

Four practices produced the findings below.

Single creature telemetry. Every balance change followed from instrumenting one creature and watching it live or die in the inspector: napkin math lies, telemetry does not. One followed founder produced 85 living descendants by generation 13 before dying of old age mid experiment.

Seeded determinism. Since version 1.14, every random draw flows through a single seeded generator; a dish seed, a number or hashed phrase, rebuilds the same world down to every rock, founder genome, and brain weight. Two runs from one seed matched exactly after ten simulated seconds of evolution, so any run is reproducible and checkable.

Headless, accelerated runs. The dish keeps running unwatched: time away is computed and replayed as a visible catch-up, verified by returning a saved world exactly as left, then living out five missing minutes to the second. That capacity is what makes the findings below observable: most were read off runs of single digit minutes.

Universal energy costs. No mechanic is free. Neural weights, calls, and scent deposits draw energy; shells slow their bearer; care delays the next clutch; torpor crashes the ability to flee; immunity carries a metabolic cost, added after early builds showed it drifting upward for nothing. Every trait has a price.

## 3. Findings

Seven results stand out from the field notes kept in the roadmap.

### 3.1 Couch potato evolution

The first dish (v0.1) showed creatures orbiting food they could not quite reach, turning radius exceeding eating radius, starving amid plenty. The fix was an arrival slowdown plus opportunistic grazing, but the dish's own answer was behavioral: it evolved slowness. Low speed as a survival strategy, the couch potato, was the dish's first unplanned result.

### 3.2 The jackal niche and apex wolf extinction

Once predation worked (v0.2), the dish could not sustain an apex predator: only two to three obligate carnivores survived at once, few enough that chance kept wiping them out. The persistent niche was the jackal, an omnivore that hunts without depending on it. A cannibal soup collapse taught the same lesson from the other side: casual meat eating has to cost something, or it eats the dish.

### 3.3 Quills over armor in patchy food worlds

Shells and quills (v0.7) both carry honest costs: shells raise the size advantage a predator needs to attack but slow their bearer 28 percent; quills wound attackers on contact for a smaller ongoing cost. Under 157 seeded kills, prey spikes nearly doubled and speed rose 22 percent within four minutes, while shells rose only modestly. Where food grows in patches, a defense that slows travel costs more than one that does not, so the dish bought quills, a preference nobody wrote in.

### 3.4 Thought as a wartime expense

Under sustained seeded predation (v1.3), average brain weight nearly tripled, from 0.05 to 0.148, over about three minutes of heavy hunting, and the growth was structural, not just in influence. Once predators died out, brain weight relaxed toward baseline. The dish treats cognition like an economy treats an army: worth raising under threat, expensive to keep, quick to shrink in peace.

### 3.5 Local adaptation without sympatric speciation

An eighteen minute watch of a dish with a warm end and a cold end (v1.1) found strong local adaptation without speciation: the population's warmth gene tracked its habitat from 0.6 down to 0.31, and the warm side subpopulation stayed consistently warmer than the cold side, without the two ever splitting into species. Gene flow wins under free movement: adaptation is easy, but speciation needs real isolation.

### 3.6 Virulence dynamics and the immunity cost lesson

The first parasite build (v1.2) saturated the dish, 89 percent infected, within a minute, because patient zero's infection rate was scaled twice as high as intended; cooling it turned one wave into recurring outbreaks. Separately, host immunity drifted upward with no parasite present, simply because it was free, until given its own metabolic cost: the lesson recurring everywhere here is that nothing free stays honest. Version 1.13 closed the loop: virulence mutating below 0.12 crosses into mutualism, nearly free to carry, blocking harsher strains from the same host.

### 3.7 Egg and grazing resilience against extermination

Version 1.15's versus mode declares a winner only at true extinction. Testing that referee by exterminating one side twice produced two refusals to call the game: eggs laid before the final blow hatched and kept the line alive the first time; dying creatures grazed enough algae to survive poison the second, one bite outweighing the damage. Only a third, complete wipe ended the line: lifecycle and grazing systems made the dish harder to kill than expected.

## 4. Honest Limitations

Population sizes are small: one canvas thread comfortably holds about a thousand creatures, and the apex predator finding above rests on just two to three individuals, barely distinguishable from noise. Planned WebGL work would raise the ceiling roughly tenfold, but nothing here was gathered above four figures of population.

Timescales are short. Most findings above come from single digit minute runs: three for brain weight, four for quills, eleven for a radiation driven count of 81 lineages, eighteen for the climate watch, long enough to see a gene shift but short against timescales usually tied to speciation in nature.

Determinism is real but local. Seeded runs reproduce exactly, rock for rock and weight for weight, on a given build and machine, enough for checkable experiments and shareable seeds. Whether the same seed reproduces identically across different hardware or browsers has never been tested.

Parameter evolution is not open-endedness. Every trait moves within a gene range fixed by the code; a pinned gene is, in the project's own phrase, a spent direction. The dish repeatedly finds good, sometimes surprising settings for the knobs it is given, but has not been shown to invent a new knob outside the space the code anticipates. That distinction, tuning an animal against growing a new kind of thing, is the project's own stated unmet frontier.

## 5. Open Questions

Proto-culture. Calls, scent trails, and memory now all exist, everything needed for behavior to spread through signals rather than genes. Whether it happens, a call or trail pattern moving through a population faster than genes could carry it, is untested, and would be the first evidence here of culture in a minimal sense, rather than instinct.

Virulence attenuation in the wild. The mutualism pathway in section 3.6 was verified as a working mechanism during a live epidemic in a test dish, but a mechanism firing correctly once differs from an unprompted general tendency. Whether ordinary, unseeded dishes actually walk their parasites down into symbionts on their own, rather than occasionally and by chance, remains open.

What players will find that test dishes did not. Every finding here comes from a handful of short, single machine test runs. The daily dish and versus modes now put many independently seeded populations in front of many players at once, at a volume no test run has matched. Whether that turns up genuinely new strategies, rather than re-derivations of what test dishes already found, is the most direct test of the project's stated goal: a dish that keeps surprising the people watching it, not only the people who built it.
