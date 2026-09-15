# The Burden (v1.44): preregistration

Written and committed before any run of this study, together with the switches, the lab that runs it (`studies/lab.js`) and the script that scores it (`studies/burden_analysis.py`).

## The question

v1.42 found that a creature with one body part leaves 40 percent fewer offspring than a bodiless one. v1.43's THRESH_BASE switch, which measures breeding readiness against base capacity, removed 35 percent of that cost. This study asks what the remaining 65 percent is made of, and whether the cost is caused by the part at all rather than by the lineages that happen to carry parts.

## What a body part does in v1.44

For a creature with n parts, scaled by its growth (0 at birth, full at age 12):

1. **Storage.** Capacity rises 45 percent per part. Breeding readiness is measured against it for the creature and for a prospective mate (THRESH_BASE, v1.43). So are hunger, torpor, care, building, eating until full, the brain's energy input, and the energy lost at mating, which is a fixed share of the store. None of these is switched.
2. **Metabolism.** Every energy cost is multiplied by 1 + 0.10 n (`PART_BURN`), plus 0.05 per unit of mouth and 0.04 per unit of eye.
3. **Movement.** Turning rate is divided by 1 + 0.12 n, paddle thrust by 1 + 0.20 n (fins add 0.30 per unit of forward fin before the division), and the current's push by 1 + 0.25 n.
4. **Organs.** Fins push and steer, spikes and shells defend, eyes widen sight, mouths graze.

## The switches

All are 0 by default, and 0 is bit for bit v1.43: fingerprint 2830395165 on seed 60606, WORLD 1, 18,000 steps.

- **THRESH_BASE** (v1.43): readiness against base capacity.
- **SEG_MOVE** (new): parts stop slowing the turn, dividing paddle thrust and damping the current. Fins still add their thrust and torque.
- **SEG_BURN** (new): parts stop adding `PART_BURN` each to metabolism. Mouths and eyes keep their costs.

Both new switches act where the value is used, so they apply to every creature at once.

## Instruments

### Ledger (as v1.42 and v1.43)

Every creature of generation 2 or later is recorded at death by body (0, 1, 2, 3+ parts) and eye (strongest eye above 0.4). W is offspring divided by individuals.

Ledger cost = 1 − W(1 part, no eye) / W(bodiless).

### Common garden (new)

From step 72,000 (20 simulated minutes), every 1,800 steps (30 seconds) until the stop rule fires, the lab picks a random living resident aged 12 or more that is not itself a garden founder.

**Release.** Three newborn founders are placed 40 px from the resident, 120 degrees apart, clamped inside the dish. All three copy its genome, brain and lineage, and take its generation plus one. They share one heading, phase and lifespan, and start with full newborn energy.

**Treatments.**
- A and A2 are bodiless.
- B carries one bare part: no fin, spike, shell, eye or mouth.

**Randomisation.** Which founder stands where, and the order in which they move within a step, are randomised. The lab draws all its choices from its own random stream, so releasing never consumes the world's.

**Drain.** When the stop rule fires, releases end and the world runs on until every founder has died. The drain is capped at 60,000 steps, and a founder still alive then is recorded as censored with its offspring so far.

**Outcome.** A founder's outcome is its lifetime offspring. Founders are kept out of the ledger; their descendants are not.

Garden cost = 1 − W(B) / W(A and A2 pooled). Garden null = W(A2) / W(A) − 1.

## Design

- Full factorial of THRESH_BASE × SEG_MOVE × SEG_BURN, 8 arms, run separately for each instrument. EYE_FOOD 0, ENTRENCH 0.
- Seeds 60606, 1001, 1002, 1003, 1004, 1005. WORLD 3 (R = 1002), classic scenario.
- Stop at maxGen ≥ 400, checked every 60 steps as in v1.43. Simulated cap 600 minutes; extinction also stops a run.
- Sample every 6 simulated minutes: minute, maximum generation, population, bodied, eyed bodied, and live founders in garden runs.
- 48 ledger runs, 48 garden runs and the acceptance test: 97 runs across eight browser tabs, each on its own origin. The acceptance test runs first in tab A. The study jobs are dealt round robin so every tab holds a mix of arms and seeds.

The jobs, exactly as every tab generates them:

```js
const SEEDS = [60606, 1001, 1002, 1003, 1004, 1005], TABS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const stop = { maxGen: 400, every: 60, capMin: 600 };
const garden = { treat: 'part', start: 72000, every: 1800, radius: 40, drainMax: 60000 };
const jobs = [];
for (let m = 0; m < 8; m++) for (const seed of SEEDS) for (const kind of ['ledger', 'garden']) {
  const sw = { THRESH_BASE: m & 1, SEG_MOVE: (m >> 1) & 1, SEG_BURN: (m >> 2) & 1 };
  jobs.push(Object.assign({ study: 'burden', kind, seed, world: 3, sw, stop, sampleEvery: 21600 }, kind === 'garden' ? { garden } : {}));
}
const dealt = LAB.deal(jobs, TABS);
dealt.A.unshift(await LAB.acceptanceJob('burden'));
```

## Validity checks

- **V1.** Every tab passes the lab's preflight before any job, and a queue refuses to start otherwise. The preflight checks:
  - the running game is `index.html` as on disk;
  - every switch is present and off;
  - food rate 1 and mutation 0.1;
  - fixed 1280 × 720 geometry (R = 1002 at WORLD 3);
  - a window resize leaves the world untouched;
  - fingerprint 2830395165.
- **V2.** Acceptance: seed 60606, all switches off, stop checked every 3,600 steps, reproduces the v1.42 ledger in `studies/eye-selection.json` in every field. That means 67,490 individuals and a stop at step 1,123,200.
- **V3.** Reproduction: the ledger runs with SEG_MOVE and SEG_BURN off reproduce v1.43's runs field for field, on all six seeds. Arm 000 must match `th0_eye0` and arm T00 must match `th1_eye0`; compared are every ledger bin and generation, minute, population, kills, births and deaths.
- **V4.** Garden null: pooled over all 48 garden runs, the 95 percent interval of W(A2)/W(A) − 1 contains zero. A and A2 are exchangeable by construction, so a failure means the garden is broken.

If V2 or V3 fails, results are reported marked unverified until the cause is found. If V4 fails, the garden is declared biased and its statements are not made.

## Analysis

All of it is in `studies/burden_analysis.py`, committed with this file.

- **Pooling.** Offspring and individuals are summed over an arm's six seeds.
- **Intervals.** 95 percent intervals come from a bootstrap over seeds: each arm's six seeds are resampled with replacement, independently per arm, 10,000 times (Python `random.Random(44)`), percentile method. Ledger costs also carry v1.43's Poisson delta method intervals, for continuity. The garden null's interval resamples the 48 garden runs.
- **Decomposition.** Let v(S) be an instrument's cost with the switches in S on.
  - A switch's share of the all-off cost is its Shapley value divided by v(∅). The Shapley value is the cost the switch removes when added, averaged over the six orders in which the three switches can be added.
  - The residual is v(T, M, B) / v(∅).
  - The three shares and the residual sum to one. Their intervals come from the same bootstrap resamples.
- **Anchored on THRESH_BASE** (descriptive). Of the cost left with THRESH_BASE on, the fraction removed by adding SEG_MOVE, SEG_BURN, and both.

## Statements fixed in advance

Applied to the ledger and the garden separately.

- **S0.** An instrument's decomposition is interpreted only if its all-off cost interval lies above zero.
- **S1.** A switch *carries part of the body cost* if its share's interval lies above zero, and *works against it* if the interval lies below zero. Otherwise it has *no detectable share*.
- **S2.** *The three switches account for the body cost* if the residual's upper bound is below 0.25. *A substantial cost remains* if its lower bound is above 0.25. Otherwise the residual is *uncertain*.
- **S3.** The garden *shows the body cost is caused by the part* if its all-off cost interval lies above zero.
- **S4.** The ledger and garden all-off costs are reported side by side without a test. The ledger's one-part creatures carry whatever organs evolved; the garden's part is bare.

## Predictions

Recorded, not tests:

- **P1.** SEG_BURN's share exceeds SEG_MOVE's, in both instruments. A tenth more metabolism is comparable to a creature's whole lifetime spending on offspring, and starvation is the commonest death.
- **P2.** SEG_MOVE's share is small, under 0.15 in magnitude, with its sign uncertain: a slower body also burns less.
- **P3.** In the ledger, the residual with all three switches on is below 0.25, so S2 is met.
- **P4.** The garden cost of a bare part with all switches off is at least 30 percent. In other words, the ledger's cost is mostly caused by the part.

## Descriptive outcomes

Reported, not tested:
- **Per arm:** the bodied share of the population, mean parts among bodied creatures, the share of bodied creatures with 2 or more parts, and W by bin.
- **Per role:** garden founders' lifespans and causes of death, and the share of their sexual offspring conceived with a sibling from the same release.

## Shakedown before writing this

The machinery was tested on seeds 777–779, which are not study seeds, for 45 simulated minutes.

- **Six tabs, switches on and off.** Every release happened on schedule (71 of 71 per garden run), roles were balanced, every founder's death was recorded, none was censored, every export passed its checksum, and no resize reached a running world.
- **Speed.** The same ledger job ran in one tab alone (100 seconds) and in eight tabs at once (100 to 103 seconds each), so eight tabs cost nothing in speed.
- **Determinism.** All ten copies of that job produced identical ledgers, samples and stop steps, including one in a tab that had already run other worlds.

Founders' offspring were not examined.

## What cannot change

Nothing in the design changes once data exist. A run lost to a tooling fault is rerun from the same job, and the fault is reported.
