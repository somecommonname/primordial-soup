# Field Notes from a Petri Dish: Emergent Findings from a Browser-Based Evolution Simulator

*Third edition draft, for David and Claude to revise.*

## Abstract

Primordial Soup is a browser based artificial life simulator, one HTML file, where creatures with 23 genes and a growable recurrent neural brain eat, hunt, court, breed, speak, and leave scent trails in a persistent dish. No behavior is scripted: every channel is physically implemented and paid for in energy, with meaning left to selection. Bodies are now trees, not chains, parts forking at evolved angles, mirroring into bilateral symmetry, beating with closed form paddle physics, and carrying an eye or second mouth, while a newborn grows into that form over twelve simulated years before it may breed. This third edition adds what a long watch shows: cutting a body part's metabolic rent from twenty six to ten percent nearly tripled carrier survival; every world loses roughly sixty percent of its founders in its first two minutes; branching structure ignites everywhere and mostly prunes back, except where an eye lineage fixes first and earns its keep; and across ninety minutes, one seed in four became a genuinely complete animal, three parts deep, mostly eyed, paddling, and the healthiest population in the study despite paying the most rent of all. These findings come from single creature telemetry, seeded deterministic runs, and accelerated runs now stretched past the hour, not theory. They show that honest costs generate real selection pressure in a small toy system, and that given enough time, that pressure can briefly resemble a whole animal, though sustaining it remains the project's newest open question.

## 1. The System

Primordial Soup runs in one HTML file: no server, no build step, no dependencies, readability itself a stated feature. Each creature carries 23 genes: size, speed, vision, appetite, two digestive enzymes, fear, fertility, herding, wander, spikes, shell, comfort zone, immunity, brain power, body shape, fins, jaws, egg laying, parental care, hibernation, masonry, and color, which doubles as lineage marker and mate signal.

Bodies are now trees, not chains: up to six parts, grown by forking at an evolved attachment angle or mirroring into instant bilateral symmetry, each part its own fin, quill, shell, eye, and mouth. Fins beat with closed form physics, thrust following the cosine of a paddle's angle off the spine, torque the sine times its lever arm, so a straight fin is an engine and an angled one a rudder; an eye extends sensing range where a part faces, a mouth is a second feeding point, and every part raises metabolism.

Behavior is not a decision tree. Every creature carries at least a 108 weight recurrent neural brain with two memory cells, reading senses from food and threat bearings to kin density, calls, and scent, then outputting steering, thrust, a call, and a scent deposit. A structural mutation can duplicate a hidden neuron up to eight deep, the same trick that grows a body part, and gaining a part now makes gaining a neuron a coin flip too: a brain earns its size.

Reproduction is sexual, hue based mate compatibility near plus or minus 40 degrees with assortative preference, and only adults breed: a newborn grows into its inherited form by age twelve, so childhood is a real gauntlet first. Parasites are a second replicator on hosts, one virulence gene controlling drain and spread, countered by a host immune gene with its own cost; virulence that mutates low enough crosses into mutualism, a nearly free symbiont.

Climate and terrain complete the dish: a warm end and cold end cycle through a four minute year, scaling growth, metabolism, and speed against each creature's comfort zone; rocks block movement and sight; current jets sweep small or finless creatures along. The code implements a channel and a cost, never an outcome: meaning is scripted nowhere.

## 2. Methods

Four practices produced the findings below.

Single creature telemetry. Every balance change followed from instrumenting one creature and watching it live or die in the inspector: napkin math lies, telemetry does not. One followed founder produced 85 living descendants by generation 13 before dying of old age mid experiment.

Seeded determinism. Since version 1.14, every random draw flows through a single seeded generator; a dish seed, a number or hashed phrase, rebuilds the same world down to every rock, founder genome, and brain weight. Two runs from one seed matched exactly after ten simulated seconds of evolution, so any run is reproducible and checkable.

Headless, accelerated runs. The dish keeps running unwatched: time away is computed and replayed as a visible catch-up, verified by returning a saved world exactly as left, then living out five missing minutes to the second. Most findings below were read off similarly fast runs, measured in single digit minutes.

Universal energy costs. No mechanic is free. Neural weights, calls, and scent deposits draw energy; shells slow their bearer; care delays the next clutch; torpor crashes the ability to flee; immunity carries a metabolic cost, added after early builds showed it drifting upward for nothing. Every trait has a price.

## 3. Findings

Fifteen results stand out from the roadmap's field notes.

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

### 3.8 Speech spreads everywhere; meaning is seed dependent

Calls (v1.8) were built with no meaning wired in, leaving evolution to decide what, if anything, they would come to mean. In a single seeded dish, seed 424242, calling caught on fast: the call rate rose from near zero to roughly 170 per minute by generation 20. Whether the calls said anything was tracked separately, as an approach index comparing how often hearers closed in on a caller against a silent control. Early in the dish's life the index read 0.112 versus a 0.085 control, already a thin margin; by generation 20 it had collapsed to 0.004 versus negative 0.022, hearers approaching callers no better than chance: a cacophony, not a culture.

Replication across five fresh seeds, same protocol, confirmed half of that finding and overturned the other half. Speech itself replicated cleanly: call rates in all five climbed into the common range, reaching 116 to 378 per minute by the late window, evolution finds the channel every time. Meaninglessness did not replicate as cleanly: only two of the five seeds kept their late approach index down near or below the control, matching the original cacophony, while the other three held a late approach minus control gap of 0.07 to 0.08 on large hearer samples, a modest but real tilt the original seed never showed. The honest conclusion: vocalization is a universal outcome of this model; call directed orientation is seed dependent, appearing faintly in most runs. One caveat covers all of it: hearer counts are drawn from consecutive frames of the same moving creatures rather than independent samples, so every number here is a trend, not a significance test.

### 3.9 Geography finally speciates

An early finding, kept in the roadmap since v0.3, was that panmixia prevents native speciation: a population stays one species under free gene flow no matter how far its genes drift locally, as section 3.5 found again in the climate dish. The archipelago scenario (v1.23) removes that free mixing on purpose. One founding population is scattered across three lagoons, sealed off from each other by reef walls with a single narrow strait linking each pair. Geography did what open water never did: seven species formed from one lineage within ten simulated minutes, the allopatric speciation that the old well mixed dish never produced. An unplanned mechanism emerged alongside it: slide along rock collision, ordinary physics built for a single boulder, turns the reef walls into guide rails that funnel wanderers through the straits, about a dozen crossings a minute. Walls meant only to divide the population turned out to also govern how it mixes back together.

Replication across five fresh seeds, five minutes each instead of the original ten, confirmed the mechanism: every seed speciated from its one founding lineage into two to eight concurrent species (median six), two seeds matching or beating the original's seven. Migrations ran hotter throughout, 84 to 158 crossings in five minutes, roughly 17 to 32 a minute against the stated dozen. The one weak seed collapsed to a population of 15 and 2 species, a crash rather than a failed mechanism.

### 3.10 Bodies from duplication

Version 1.26 let genomes physically grow for the first time. A mutation can now duplicate an existing body segment, and each duplicate carries its own copy of the fin, quill, and shell genes, with real costs attached: 45 percent more energy storage per segment and 26 percent more metabolism, plus a speed penalty and a wider turning circle. Every world still starts bodiless, exactly as before, so a body is discovered, not given: in the first test dish, run under raised mutation, two creatures grew their first segment within two minutes. This is the first rung of open endedness rather than a finished climb: new structure can now appear that was not present at the start, which no amount of parameter tuning can do, but the trait vocabulary available to each segment (fins, quills, shell) is still fixed by the code. Growing a second kind of segment is not yet possible; growing a first one now is.

Replication across five fresh seeds, the full five minutes each, overturned the single seed's reliable two minute reading: only two of five grew any segment by the end, one or two dish wide and never more than one per creature, the other three ended with zero, and what did appear held rather than vanishing. The mutation slider's ceiling capped the raise at two and a half times baseline, not the intended four, and four of five populations fell under 25 creatures, so scarcity looks tied to survival pressure as much as to the mechanism being rare.

### 3.11 The reef and the freeloader

Version 1.27 adds a twenty first gene, masonry: an energy rich creature can pay six energy to lay a stone of eroding reef, and deposits near an existing reef make it grow. The stone is real terrain, blocking sight and movement like any rock, and it erodes without upkeep, so a reef is a living thing that dies with its keepers. The payoff shows up in the garden around it: currents collect nutrients at reef edges, so algae sprout faster and pack denser there. Measured at grazed equilibrium in a hungry dish, the reef circle held six times the standing crop of a mirrored control, eighteen algae samples versus three, across a dish thirty two algae cells wide; in times of plenty the same effect disappears into saturation, masked rather than absent. The garden a reef grows feeds every grazer nearby, mason or not, so building is a public good with an obvious cheat available to anyone unwilling to pay the six energy. The dish now runs that experiment permanently: whether builders can outlast freeloaders, or get quietly outcompeted by the very abundance they create.

Replication across five fresh seeds did not hold up: near versus control ratios came back at 0.14, 1.33, 0.14, 2.0, and 0.7, averaging below parity rather than six fold, and three of five seeds held fewer algae near the reef than at the control point. Every seed built and sustained a reef, so masonry itself is robust, but the builder population collapsed in most runs, from eight released masons down to zero survivors in one seed, and sample counts stayed in the single digits, too few to show a reliable garden effect. Six fold looks like a single seed high point, not a stable property.

### 3.12 The rent decides

Section 3.10 left segments looking rare. They were expensive, not rare: at twenty six percent extra metabolism per body part, the first Body Mountain study found only 6.5 percent of the expected segment carriers survived a fifteen minute world (v1.33). Two more studies, cutting that rent to fifteen and then ten percent across twenty two seeds and twenty seven thousand births, pushed the ratio up each cut, 6.5, then 10.8, then 17.4 percent, nearly tripling, while mean population per seed climbed from 28.2 to 33.6 to 37.6 and no seed let carriers exceed half the population, the closest 48.7 percent. A hidden neuron control, priced only indirectly, drifted on seed noise instead. The law the dish is teaching back: when a structure fails to spread, check its price before its mutation rate.

### 3.13 The founder bottleneck

The rent studies exposed a second effect without looking for it: every world loses roughly sixty percent of its founders between the first and second minute, deterministic in size, while exactly which founders die is pure chance. Whichever lineage carries a duplicated segment or a growing brain through that crash can shape a dish's later story more than any tuned constant. It is now its own line on the research list (v1.33): a bottleneck this uniform was not something anyone went looking for.

### 3.14 Structure must earn its keep

The Bolder Mutations study (v1.38) already showed branching igniting everywhere and surviving almost nowhere. A forty five minute follow up, six seeds run three times as long, found the same pattern at the larger scale: every world branched, but depth two or more became a settled feature, held through the final fifteen continuous minutes, in only two of the six. What set those two apart looks like sensing, not brawn: in seed 2727 and seed 60606 alone, an eye lineage held more than two consecutive samples, three to six minutes before depth stabilized. The other four branched and pruned away, one of them, seed 82828, all the way to zero parts before regrowing. Bare structure without an organ to justify it got taxed back down; only structure paired with an eye stopped shrinking, the sensing apparently earning back the body's cost.

### 3.15 The ninety minute animal

A ninety minute study pushed four seeds from the forty five minute run, two sustainers and two cyclers, twice as long again. The clearest answer is the 60606 story: by minute ninety, depth three, 87 percent eyed, hidden neurons at one hundred percent, and paddlers, a wild side fin strong enough to row, seen exactly once in 250 prior samples, fixed at 63 percent of the population and held, the first paddler lineage in this program to survive a checkpoint at all, let alone dominate one.

The honest counterweight sits beside it: sustaining is a phase, not a trait. Seed 505, deepest structure of any world in that study, gave it back, ending at a single part. Seed 2727 reverted to zero parts twice, a double collapse with a recovery between, and nearly died out, its population falling from a peak of forty one to five. Of the four seeds run this long, only one was still standing at the close. Yet complexity is not simply fragile: 60606, paying the most metabolic rent of any surviving lineage, deepest body, most eyes, the only paddlers, was also the healthiest population in the study, while the seed that reverted to bodiless simplicity nearly died out. Complexity, priced honestly, can win.

## 4. Honest Limitations

Population sizes are small: one canvas thread comfortably holds about a thousand creatures, and the apex predator finding above rests on two to three individuals, barely distinguishable from noise. Planned WebGL work would raise the ceiling tenfold, but nothing here exceeded four figures of population. Small populations mean the founder bottleneck of section 3.13 can shape a run more than the mechanic under study.

Timescales are short. Most findings above come from single digit minute runs: three for brain weight, four for quills, eleven for a radiation driven count of 81 lineages, eighteen for the climate watch, long enough to see a gene shift but short against timescales usually tied to speciation in nature. A five seed sweep has since tested the archipelago, body plan, and reef findings: archipelago speciation held up best, though migrations ran hotter than first reported; body segments mostly did not, appearing in only two of five seeds; and the reef garden multiplier did not replicate at all, averaging near parity rather than six fold. The speech result was the first to go through that process, and it came back mixed: five fresh seeds confirmed that calls become common everywhere but only partly confirmed that they stay meaningless, a reminder that a single seed result here can be half right. The Body Mountain route has pushed past that ceiling but stays modest: ninety minutes at most, four to eight seeds a study, and whether the climb and crash cycle looks the same at the scale of hours or days is untested.

Determinism is real but local. Seeded runs reproduce exactly, rock for rock and weight for weight, on a given build and machine, enough for checkable experiments and shareable seeds. Whether the same seed reproduces identically across different hardware or browsers has never been tested.

Parameter evolution is not open-endedness. Every trait moves within a gene range fixed by the code; a pinned gene is, in the project's phrase, a spent direction. The dish repeatedly finds good, sometimes surprising settings for the knobs it is given, but has not been shown to invent a new knob outside the space the code anticipates: tuning an animal, not growing a new kind of thing.

## 5. Open Questions

Proto-culture, an answer with an asterisk. Calls, scent trails, and memory all exist, everything needed for behavior to spread through signals rather than genes. Section 3.8 has now tested it across six seeds and returned a mixed answer: speech itself is universal, but real orientation toward a caller showed up faintly in only about half the runs. The open question is no longer whether meaning can appear at all; it can, faintly, in the right seed. It is whether that trace orientation can ever amplify into something like reliable signaling rather than stay a permanent low hum, and what about a seed, terrain, founder genomes, or plain chance, tips a dish into the meaning bearing group instead of the cacophony group.

Whether reefs outlast freeloaders. Section 3.11 leaves the dish running a permanent, unresolved experiment: masons pay real energy to grow a public good that feeds every grazer nearby, cheats included. Whether builders can hold a reef together across generations against creatures that only ever graze it, or whether freeloading quietly wins and reefs stay a young dish's phenomenon that mature dishes lose, is open, and unlike the short test runs above, it is a question the dish can only answer by running a long time.

Virulence attenuation in the wild. The mutualism pathway in section 3.6 was verified as a working mechanism during a live epidemic in a test dish, but a mechanism firing correctly once differs from an unprompted general tendency. Whether ordinary, unseeded dishes walk their parasites down into symbionts as a rule, rather than by chance, remains open.

What players will find that test dishes did not. Every finding here comes from a handful of short, single machine test runs. The daily dish and versus modes now put many independently seeded populations in front of many players at once, at a volume no test run has matched. Whether that turns up genuinely new strategies, rather than re-derivations of what test dishes already found, is the most direct test of the project's stated goal: a dish that keeps surprising the people watching it, not only the people who built it.

Whether 60606 style animals are a destination, and what ends the climb and crash cycle behind them. One seed in four settled, by minute ninety, into a body three parts deep, mostly eyed, with paddlers fixed after appearing once in 250 prior samples, while the other three cycled or gave their structure back. Whether that combination is an attractor more worlds find given time, whether paddler fixation repeats, and whether a longer run ever finds equilibrium rather than climbing and pruning indefinitely, are questions this edition's four seeds could only begin to ask.
