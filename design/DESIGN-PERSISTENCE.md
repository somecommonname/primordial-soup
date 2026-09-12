# The Persistence Frontier: design document

*Status: CONSTRAINTS WRITTEN 2026-08-20, before the survey (PERSISTENCE-SURVEY.md) concluded, so the requirements cannot be bent to fit a favorite answer. Decisions follow the survey and David's call.*

The goal, in one sentence: a world should be able to keep a complex animal once it has made one, so that complexity becomes a floor the dish builds on rather than a peak it falls from.

## What we measured before asking

Everything below is in studies/NOTES.md and PAPER.md.

- Complexity rises, reigns, and falls. Every world tested grows multi part bodies; the best (seed 60606) held a complete animal, eyes, paddles, depth three, for a fifty minute golden age, then collapsed to near featureless bodies by three hours with no external shock.
- Structure persists only when it pays. In every world that sustained depth, an organ lineage (eyes) had fixed first; bare structure without function was taxed back down every time. The rent decides.
- Geography shelters but does not secure. The archipelago keeps structure alive through local extinction and rescue, and sits near the optimum among shapes tried; loose connectivity is stable but sterile, tight isolation is chaotic but inventive. Complexity needs a little chaos.
- Lineages die but genes flow. Poured into open water, island lineages go extinct within the hour; their genomes survive through hybridization whenever hue allows.
- Thought is cheap, flesh is conditional. Hidden neurons saturate to one hundred percent given time; bodies never do.

So the dish has no shortage of invention. It has no memory. Nothing in its economics makes a won structure hard to lose.

## Hard requirements

Any lever failing one of these is rejected regardless of its other virtues.

1. **Selection pressure, never a script.** The north star. A lever must change what pays; it must never decree that complexity survives. If we can predict exactly what evolves, the feature failed.
2. **Determinism.** Every mechanism is a pure function of state and the seeded stream inside step, tools, and world init. Replays stay bit identical.
3. **Migration.** Every living creature loads unchanged in behavior on release day. New genes get neutral defaults; new resources start absent or inert until selection notices them.
4. **Budget.** Under about 1.5 milliseconds per step at population 200; per creature costs linear in part count; cached where possible.
5. **One file, no libraries.**
6. **Measured, with a prewritten success criterion.** The test is the crown run protocol: at least eight seeds, ninety minutes, and the lever wins only if complete animals (depth two or more, eyes at twenty five percent or more of population, paddlers present) are standing at the final sample in at least half the seeds, against a baseline of one in four at ninety minutes and zero at one hundred eighty. Persistence half life is reported alongside.
7. **Reversible and honest.** Each lever ships alone, can be turned down to neutral by a dial or constant, and its release note reports the study result even when it fails.
8. **Nothing is free.** New organs, preferences, and dependencies all pay rent through existing economics. No structure is protected by fiat.

## The three levers

### Lever 1: Necessity

Make some food reachable only by bodies. Candidate mechanisms, all deterministic and cheap:

- **Reach food.** A second resource anchored near rocks or the rim (call it crust), edible only by a mouth part whose world position lies within reach, since head grazing happens at the nose. Tail mouths and branched mouths become the only way to eat it. Rent is already paid by the organ; the new thing is a payoff that only that organ can collect.
- **Sight food.** Scattered high value morsels that only eye bearing creatures detect beyond base sense range (eye cones already extend prey spotting; extend them to morsel spotting).
- **Station food.** Rich drift carried in current jets where only paddle bearing creatures can hold position (torque and thrust already exist; the payoff is holding station against flow).

Pressure created: organs gain a private niche, so losing them costs a food source. Risks: feels scripted if the resource exists only to reward a part; mitigation is giving the resource its own ecology (crust grows where grazing is low, drift depends on jets) so it can also fail. Falsifier: if organ lineages still collapse when crust is abundant, necessity is not the missing piece.

### Lever 2: The peacock ratchet

Add a heritable mate preference gene: when choosing among candidate mates, a creature weights candidates by a display score (part count, fin symmetry, organ count, possibly hue saturation) in proportion to its preference gene. Fisherian runaway then links preference and ornament across generations. Rent bounds the runaway: a peacock that cannot eat dies. Pressure created: complexity acquires a second currency, attractiveness, that is paid out even when the food economy is flat. Risks: runaway to absurd bodies (bounded by rent but watch it), stagnation if preference fixes at zero, and the mating code is hot; the score must be cached per creature on growth ticks, never per candidate per step. Falsifier: if preference never rises above neutral across seeds, there is no ratchet to climb.

### Lever 3: Entanglement

Make long held structure hard to shed. Candidates:

- **Mutation entrenchment.** The shed and organ loss mutation rates decay with the part's lineage age (how many generations the part has been inherited). Old parts become near fixed; new ones stay plastic. Cheap, deterministic, a one line change to segInherit, and it is exactly Wimsatt's generative entrenchment in miniature.
- **Functional dependence.** Creatures that feed mostly through mouth parts slowly lose head grazing efficiency (use it or lose it, inverted into dependence). Riskier: brittleness and a possibly scripted feel.

Pressure created: a won structure stops being a coin flip away from loss, so selection has time to find its payoff. Risks: entrenchment of bad structure (the dish keeps dead weight), and it weakens the beautiful reversibility that let seed 82828 wipe to zero parts and re evolve. Falsifier: if entrenched lineages persist but populations sicken, we have built a museum, not a floor.

## Open decisions for the survey

1. Which lever first, and whether the literature says any two are synergistic (necessity plus entrenchment is the intuitive pair: a reason to keep, and a brake on losing).
2. Whether mate choice on morphology can be implemented without per step cost blowups and without runaway past the rent ceiling.
3. Whether lineage age per part is a legitimate entrenchment proxy or whether function measured over a window is required.
4. What the field's open endedness measures would say about our worlds today, so the Paper can report where we stand honestly.

## Phase ladder, provisional

- **Phase 1, The Floor.** Mutation entrenchment alone: the smallest change with the clearest mechanism, measured by the crown run protocol.
- **Phase 2, The Reason.** Necessity: crust first (mouth parts), then sight food and station food as separate measured releases.
- **Phase 3, The Mirror.** The peacock ratchet, last, because it is the most volatile and the most interesting; by then the floor and the reason will tell us whether ornament has anything to stand on.

Each phase ships alone, tested to the standing invariants, with the success criterion above decided before the study runs. If all three fail, the Paper says so, and the frontier stays open, which is also a result.

---

## Decision log

### 2026-09-11 · Lever 3, Entanglement: TESTED, FAILED, SHIPPED DORMANT

Built as specified: `la` counts the generations a structural slot has been inherited, `oa` the generations since that part's organs were last jolted. The shed rate decays with the mean `la` of the sheddable leaves; eye and mouth drift is damped symmetrically by `oa`, deliberately symmetric so the lever canalises rather than ratcheting organs upward, which would have been a script by the back door. `plast(age)=1/(1+ENTRENCH*age/ENTRENCH_HALF)`, shipped at `ENTRENCH=0`.

Against the eight requirements: **1 selection pressure not script** — met, it changes a rate, never an outcome. **2 determinism** — met, no new draws; `ENTRENCH=0` reproduces v1.39.2's fingerprint for seed 60606 bit for bit. **3 migration** — met, both clocks default to zero and old seven element part arrays load unchanged. **4 budget** — met, two integer increments per part per birth. **5 one file** — met. **6 prewritten criterion** — met and **failed**. **7 reversible** — met, one constant. **8 nothing free** — met, no structure is protected by fiat, only made cheaper to keep.

The result, paired over eight seeds: complete animals at minute ninety, one of eight with the lever against one of eight without, where the bar was four. The mechanism is not inert — parts held about twice as long, depth survived in seven seeds of eight against four, bodied share rose from 31.6 to 44.6 percent, and populations were slightly healthier, not sicker. It simply does not reach the thing being measured, because **the thing being measured is gated on eyes, and eyes survived in two seeds of eight in both arms**.

**What this changes in the design.** The document opened by assuming retention was the missing piece. It is not. Structure is retained fine once it exists; what no world manages is to keep an *organ*, because nothing in the economy pays for one reliably. Necessity, Lever 1, was written as the answer to exactly that and is hereby promoted to the front of the queue, in its Garden form: a coevolving food supply, so the payoff for an eye never goes flat. Entanglement stays in the build, dormant, with an uncalibrated half life; a sweep is the cheap way to learn whether twenty generations was simply the wrong number.

**The falsifier held.** The document said: *if entrenched lineages persist but populations sicken, we have built a museum.* They persisted and the populations did not sicken, so it is not a museum. It is a well built floor under the wrong room.
