# Study archive notes

Raw study data now lives in this directory so it survives scratchpad wipes. Earlier study archives (emergence, rent, body mountain 15/45/90 minute runs) were lost to a scratchpad wipe on 2026-08-19; their headline numbers survive in ROADMAP.md, PAPER.md, and the project memory, and every study is reproducible from its seeds since the engine is deterministic.

## 2026-08-19 continuation studies (v1.38, commit e2eaaf3)

**A. Founder bottleneck decomposed** (founder-bottleneck.json): the minute one to two crash is boom bust overshoot, not founder death. Early reproduction nearly doubles the population within seconds while stripping algae to near zero; starvation then removes an average of 62 percent from the peak. Starvation dominates in four to five of six seeds; parasites are a stochastic secondary channel that occasionally dominates (seed 111); predation is zero in all 108 samples. Verdict: healthy ecology, not a bug.

**B. The crown run** (crown-and-replication.json): seed 60606 to 180 minutes. The minute 90 complete animal is a peak, not an equilibrium: depth touched four parts at minute 96, eyes stayed near universal through minute 144 (a fifty minute golden age), paddling stayed volatile throughout, and after minute 144 the structure collapsed entirely: eyes extinct by 162, population reverted to near featureless bodies by 180, despite 266 generations.

**C. Replication** (crown-and-replication.json): six fresh 90 minute seeds. Zero reproduced the sustained complete animal; one (7006) brushed the pattern briefly around minutes 49 to 54 before collapsing. A 60606 style outcome at 90 minutes is roughly one in six or rarer.

**Combined reading, held for the Paper's fourth edition:** every world pays a steep, food driven toll in its first two minutes as healthy overshoot correction; the elaborate eyed, paddling body plans that occasionally emerge are transient peaks that collapse back toward simplicity even without external shocks; the dish's most celebrated snapshots are highlight reels from a genuinely stochastic sandbox, bit reproducible from their seeds but far from the expected outcome of any run. The open question this sharpens: what would let a complete animal persist, and that is the true next frontier.

## 2026-08-19 incubator trials (incubator-trials.json)

The question: what lets complex life persist? Two candidate incubators, both already built into the game, eight worlds, 120 minutes each.

**Ocean (population size hypothesis): failed, twice over.** The premise never materialized: the founding boom busts within six minutes and the population converges to the same modest range as classic worlds (average 22.6 versus classic 24.4), a bigger boom simply buying a proportionally worse bust. And on every complexity measure the ocean underperformed classic: zero complete animals, peak eyed share 12.5 percent, paddlers essentially absent. Sheer numbers do not buy complexity time.

**Archipelago (refugia hypothesis): won on every persistence metric.** Structure survived to minute 120 in four of four worlds, the best of any scenario tested, despite the lowest populations. Seed 9002 held a fully eyed multi part population continuously for the final 66 minutes, still intact at cutoff, sustained by lagoons holding as few as one individual. Five genuine local extinctions (a lagoon population reaching exactly zero) were each followed by migration driven recolonization, and in three of five the recolonists carried structure back with them: the refugia mechanism, observed directly.

**The finding in one line: it is not numbers that keep life, it is geography that lets a population fail locally without failing globally.** No world yet carried a complete animal to the end, so permanence remains open; the next push is refugia design itself: longer runs, more and smaller lagoons, looser straits.

## 2026-08-19 refugia geometry sweep (refugia-sweep.json)

Four new archipelago geometries (tight straits, loose straits, five lagoons, five tight) against the archived baseline, eight new 120 minute worlds. Verdict: NO new geometry beat the baseline (three lagoons, forty pixel straits) on sustained complexity; the baseline alone has produced a golden age and remains at or near the optimum. The sweep resolved the isolation versus flow question cleanly, and it is a law worth keeping: LOOSE STRAITS make worlds stable but sterile (zero wipeouts, populations up fifty percent, and not one eyed creature ever fixed; connectivity homogenizes the gene pool and removes the drift and bottleneck dynamics that fix new structure), while TIGHT straits and extra lagoons raise the churn of local extinction and rescue (structure carried home by recolonists in most events; tight three: one hundred percent immediately). Empty refugia in the five lagoon configs were colonized fast and with structure aboard in eight of eight cases. Caveat: two seeds per config is directional. If a confirmatory run is ever wanted, tight three is the candidate; otherwise ship nothing, the shipped world is already well shaped. The line for the Paper: complexity needs a little chaos; perfectly connected worlds never invent, and the archipelago works because local death fuels global invention.

## 2026-08-19 collision ecology (collision-ecology.json)

Twelve recipient worlds, three arms, every pour through the shipped collide machinery. **Island lineages die on the mainland: zero of twelve archipelago transplants kept their founding lineage alive an hour after the pour** (fastest extinction three minutes), and every transient burst of island eyes (peaks up to eleven at once) melted to zero by the hour mark, echoing the unaided classic world collapse already on record. **But the genes survive the lineage:** wherever donor and native hues sat inside the forty degree mate window, cross lineage hybrid births ran from the dozens into the hundreds, folding transplant genomes into native lines; at a seventy six degree gap the flow collapsed to a residual four, proving the hue gate does real ecological work. **The nursery is shock proof in reverse:** pouring bodyless mainlanders into the archipelago, hybridization and all, left the refugia worlds with more branched structure at the hour than either classic arm managed, so the geography that lets local extinction fuel invention also absorbs a demographic flood better than any single lineage survives leaving home. Follow up candidate: whether hue distance changes structural survival (one invasive replicate is suggestive, not a finding).

## 2026-08-20 the breeder's line (breeders-line.json)

Serial passaging: pour survivors into a fresh world, let forty five minutes of ecology decide, pour the winners onward, five rounds, three chains (structure line from an archipelago nursery, hardy line of oldest survivors, random control). **Passaging is artificial selection by migration, and it works for structure:** the structure line averaged three times the branched population that any single archipelago to mainland pour produced, and twice ended a round with a majority eyed population in a world that began the round with zero eyes. It worked through two channels: hue gated hybridization when the forty degree window happened to be met (only three of fifteen passages, since each fresh world draws its native hue independently), and pure visitor lineage takeover when hybridization was blocked (passages two and four of the structure line ended majority structured at hue gaps near one hundred seventy degrees). Passaging raises the ceiling and the average, not the floor: round one crashed to nothing and round five nearly did. **Passaging fails for hardiness, and the reason is a genome gap:** breeding the oldest survivors five rounds running could not raise the line's age at all, because the engine assigns lifespan as an unheritable per creature random draw (lifespan = max(70, 130 + gauss * 25), no gene) and collideArrive resets every migrant's age to twelve. Body size climbed in every chain, a generic effect of surviving repeated founder bottlenecks. Lesson for every future breeding line: passaging amplifies only what the genome encodes; the question is not can we select for it but did we build it into the genes. Candidate fix for the roadmap: a heritable longevity gene with the classic life history tradeoff (longevity against fertility or metabolism), measured like everything else.


## 2026-09-11 the entanglement (entanglement.json)

Lever 3 of the persistence frontier, paired across eight seeds declared before any result, ninety minutes each, lever off against lever on. **Failed its prewritten criterion: complete animals standing at minute ninety in one seed of eight either way, against a bar of four of eight.**

The mechanism is not inert, and that is what makes the failure informative. Mean peak part lineage age rose from 18.1 generations to 32.5 and the oldest surviving part at minute ninety averaged 19.9 against 9.9, so structure genuinely stops churning. Bodies at least two parts deep stood at minute ninety in seven seeds of eight against four. Mean bodied share across the run rose from 31.6 percent to 44.6. Populations came out marginally healthier, not sicker, which kills the museum risk the design document named. **But any eyed creature at all survived to minute ninety in exactly two seeds of eight in both arms.** Retention was never the binding constraint; organ acquisition is, and the complete animal is gated on eyes.

The study also answered the question it was named for. Seed 1006 with the lever on reached minute 84 with 31 of 51 creatures bodied and its oldest part 75 generations deep, then arrived at minute 90 with five bodied and its oldest part two. The 60606 baseline shows the same shape, mean part age halving from 58 to 24 across the window where eyes fell from 14 to 2. **Long held structure is not eroded, it gives way all at once**, which is the ratchet the survey predicted, and entrenchment slows it without fitting it a pawl. One seed was actively harmed: 60606 with the lever ended with no bodied creatures at all where its own control ended with 40 of 41, which suggests a low shed rate can lock a young lineage into a dead end.

Caveat kept with the result: `ENTRENCH_HALF=20` was judgement, never calibrated, and a sweep would separate a wrong mechanism from a wrong dial.

**And an unbidden finding, recorded because it is load bearing.** This machine could not reproduce the archived v1.38 crown run for seed 60606. The world builds identically, same callsign SOUP-C57V-HM and the same seventy founders, but then plays differently: at 18000 steps this machine reads pop 33, births 312, maxGen 9 where crown-and-replication.json records 44, 332, and 10. Local repeats here are bit identical, so the divergence is between machines rather than between runs. PAPER.md section 4 flagged cross machine determinism as never tested; this is the first evidence it does not hold, and the boards' anti cheat design assumes the opposite.

## 2026-09-12 the crowd (crowd.json)

Two findings, one structural and one uncomfortable.

**The dish was the browser window.** `R=min(W,H)/2-26` and nothing else, so there was never an arena parameter, and the ocean scenario was never a bigger world. `WORLD` now scales radius, with every density scaling as its square. And scaling the world alone was not enough: the standing algae crop sits near ten in a classic dish, grazed to bare rock, so proportional regrowth is negligible and food is dominated by the spore drizzle, which was an absolute six per second for the whole dish rather than a density. Fixed, equilibrium population runs 32, 110, 258, 583 at WORLD 1 through 4, close to linear in area, at 1.386ms per step at WORLD 4.

**The drift hypothesis was refuted in the opposite direction.** Raising the population fifteenfold did not rescue the eye, it suppressed it: peak eyed share fell from 5.9 and 44.4 percent in the small worlds to 1.0 and 2.2 percent in the large ones. Bodied share wandered with a standard deviation of 33.0 and 18.1 points in the small worlds against 2.8 and 7.6 in the large. Small populations swing between 7 and 98 percent bodied, large ones sit steadily near 15. **Drift was never what prevented eyes; drift is what produced them.** A costly trait at 44 percent of a population of eighteen and 2 percent of a population of five hundred is floating, not fixing, and every celebrated golden age in this project happened at a population near thirty. The fourth edition of the paper will have to say so.

Two seeds, reported as a pilot. Honest confound: WORLD=4 widens the arena as well as the population, so travel and mixing change too, and generations should be matched rather than minutes in any confirmatory run. The cheap confirmation is six seeds at WORLD 1 against WORLD 3, lever off, roughly 25 minutes.

## 2026-09-12 the drift audit (drift-audit.json)

Six seeds classic against six archipelago at WORLD 3, lever off, matched on generations rather than minutes. All twelve stopped at four hundred generations, none on the clock, none extinct, about 315 simulated minutes each.

**The complete animal does not survive.** Zero of twelve, against one of eight at population thirty. Peak eyed share averaged 2.3 percent in both arms against 44 percent in a population of eighteen, and where eyes lasted to the end it was one to three individuals out of well over a hundred. Bodied share now wanders with a standard deviation of 4.4 points (classic) and 5.7 (archipelago) against 33.0 and 18.1 at population thirty: three population sizes, one monotone trend, drift being squeezed out.

**The archipelago arm is inconclusive and it is my error.** `archTerrain` is written in fractions of `R`, so the lagoons and straits scaled with the world while creatures did not. At WORLD 3 the channels are three times wider relative to a body, and the arm ran about 38 crossings a minute against the dozen the refugia sweep measured, roughly 30 per generation against seven. That is the loose straits configuration the sweep already found stable but sterile. The arms came out near identical, but the test cannot separate refugia failing at scale from refugia never having been tested. **The proper design tiles more lagoons of the original size across the bigger world**, holding local Ne and strait width fixed while raising global Ne. That experiment is still owed.

## 2026-09-12 the selection coefficient of the eye (eye-selection.json)

Six seeds at WORLD 3, four hundred generations each, **396,109 individuals recorded** through a new fitness ledger that logs every creature once at death with its lifetime offspring, lifespan, and energy eaten split by source.

**The eye is neutral.** At one body part, 1,080 eyed against 54,309 eyeless: s = −2.4 percent, 95 percent interval ±6.3. At two parts, −2.9 ±22.3. No benefit at any body size.

**The reason is the wiring, not the world.** Line 1251 finds algae with plain `sense` and no eye term; line 1274 extends *prey* detection 1.5× linear. The eye reads only the prey channel, and flesh is 0.23 percent of lifetime energy even though 8.5 percent of deaths are kills and appetite averages 0.76 carnivore. **My hypothesis was wrong**: the food field is genuinely patchy, variance-to-mean 3.89 against 1.0 for random. The information exists; vision cannot read it.

**The body costs 40 percent of fitness.** Bodiless 1.476 offspring, one part 0.881 (s = −40.3 ±0.6), two parts 0.536 (−63.7), three or more 0.498 (−66.2). Roughly 130 standard errors. The designed cost is 10 percent metabolism; the realised cost is 4× that because bodied creatures also **eat less**, 1,718 against 2,220 a lifetime, and die younger. v1.33 priced segment rent at population thirty where a 40 percent coefficient was invisible under a 4 percent drift barrier.

Next, preregistered: wire the eye to the algae channel. Mean sense is 113 px against 140 px mean algae spacing, so a creature usually cannot see one alga; 1.5× would cover 2.25× the area, taking expected algae in range from 0.65 to 1.46. **Criterion set before the run:** s rises above +10 percent with an interval excluding zero, and eyed share exceeds 50 percent for 100 generations in most of six seeds. **Falsifier:** if s stays at zero after wiring, abandon the vision line and go after the body cost instead.

## 2026-09-14 the threshold (threshold.json)

A 2x2 of THRESH_BASE (breeding readiness against base storage) and EYE_FOOD (an eye extends algae detection), six seeds, WORLD 3, 400 generations, fitness ledger on, preregistered in `threshold-prereg.md` before any run.

**Primary test failed, harmfully.** Eye wired to food, threshold off: s(eye | 1 part) = −11.7 percent, 95 percent interval −18.1 to −5.3. The falsifier applies and the vision line is set aside. With the threshold on the same eye is +4.6 percent (+1.3 to +7.9), short of the +10 bar; controls with the eye unwired sit at zero (−2.3, −1.6). At two parts the signs flip in both eye arms, which is exploratory and small but is also what a lineage confound looks like. Secondary share test: 0 of 6 seeds in both arms; eyed share among bodied averaged 1.6 and 4.5 percent.

Two explanations the design cannot separate. A code mechanism: food in sight means a full speed chase (arrive rises with distance, `index.html:1343`) where a creature with no target wanders at 75 percent speed (`index.html:1483`), and movement burn scales with speed squared (`index.html:1500`), so an eye in a grazed, crowded dish may mostly buy chases lost to nearer grazers. A design limit: eyes are not randomised, so an eye cannot be separated from the lineage carrying it. A common garden release of matched genomes differing only in an eye would decide it.

**The threshold explains about a third of the body cost:** one part costs 40.3 percent with it off, 26.1 with it on, so 35 percent removed (39 with the eye wired); the two seed pilot said 43. Bodied share rises from 14.6 to 21.1 percent.

**Reproducibility, as preregistered: failed, then exact.** The control arm came in 425 deaths short of v1.42 across six seeds, every bin at or below, because the new harness checked its stop every 60 steps rather than 3,600. Rerunning seed 60606 with the stop aligned reproduced v1.42's ledger in every field over 1.12 million steps: the build is bit for bit v1.42 with both switches off, and the v1.42 eye study was never touched by the resize hazard found during this run.

Tooling faults found and fixed during the run, all recorded in the study file: the resize handler regenerating terrain, viewport clears at turn end voiding three runs, stop granularity, and zsh word splitting blinding the monitor.

## 2026-09-15 the burden (burden.json)

THRESH_BASE x SEG_MOVE x SEG_BURN, eight arms, six seeds, WORLD 3, 400 generations, measured twice: the fitness ledger, and a new randomised common garden run by `lab.js`. Every 30 simulated seconds after minute 20 the garden releases three newborns beside a random adult resident, copying its genome, brain, lineage, heading, phase and lifespan: A and A2 bodiless, B with one bare part. Outcome: lifetime offspring. 97 runs, preregistered with the analysis script in `burden-prereg.md` (701b750) before any run.

**Validity: all four checks pass.** Preflight in every tab; the acceptance test reproduces v1.42's seed 60606 ledger in every field (67,490 individuals, stop at step 1,123,200); all 12 runs with the new switches off reproduce v1.43's `th0_eye0` and `th1_eye0` field for field; garden null W(A2)/W(A) - 1 = -1.2 percent (-3.6 to +1.2) over 48 runs. Exploratory: the null excludes zero in one arm of eight (SEG_MOVE + SEG_BURN, -9.6).

**Cost of one part, 1 - W(part)/W(bodiless), seed bootstrap intervals:**

| arm | ledger | garden |
|---|---|---|
| all penalties (default) | 40.3 (37.3 to 43.3) | 52.2 (49.2 to 55.9) |
| threshold freed | 26.1 | 33.7 |
| movement freed | 2.4 (-1.7 to 5.9) | 6.1 (-1.9 to 13.4) |
| metabolism freed | 27.5 | 36.7 |
| threshold + movement | -18.6 | -9.3 |
| threshold + metabolism | -2.2 | 5.1 |
| movement + metabolism | -16.3 | -25.5 |
| all three freed | -35.5 (-43.8 to -28.8) | -53.7 (-70.8 to -38.9) |

**Shapley shares of the default cost** (ledger, garden): movement 0.95 (0.86 to 1.06), 1.01 (0.87 to 1.15); threshold 0.49, 0.45; metabolism 0.44, 0.57; residual -0.88, -1.03. Every share above zero. The residual is negative: with all three freed a part is an advantage, so the shares sum to about two. Of the 26.1 percent left with the threshold freed, adding movement removes 171 percent and adding metabolism 108.

**Mechanism (exploratory):** garden founders with a bare part eat 0.695 of their identical siblings' algae under the default, 1.083 with movement freed. A finless part divides thrust by 1.2 (five sixths speed), slows turning 11 percent, damps the current 20 percent; 69 percent of control founders die starving. The ledger's intake gap does not close with movement freed (0.684), which is what a gap driven partly by who carries parts looks like.

**Predictions:** P1 metabolism share above movement, wrong in both. P2 movement share under 0.15, wrong in both. P3 ledger residual under 0.25, held. P4 garden default cost at least 30 percent, held.

**Descriptive:** bodied share of the living population 14 percent (default), 21 threshold, 24 metabolism, 70 movement (2.4 parts, 74 percent of bodied with 2+), 83 threshold + metabolism, 97 threshold + movement, 98 movement + metabolism, 99 all three (5.5 parts against a cap of 6). Mean population 191 default, 273 movement, 385 to 455 with two or three freed.

What is left of a part with all three freed is 45 percent more storage, and storage is what selection favours there: selection, not drift, for more structure, but for a side effect of capacity rather than for function. Next question for design, not measurement: what a part should cost and what its storage should be worth.

Tooling: the Browser pane closed seconds into the first launch, taking eight tabs, before any run finished; relaunched one tab at a time. Hidden tabs got about half a core each; arms with bodies freed ran up to 2.7x slower. 176 minutes on eight tabs.
