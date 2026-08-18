# The Body Mountain: design document

*Status: DECIDED 2026-08-18. Constraints were written before the survey concluded so the requirements could not be bent to fit a favorite answer; the decisions below were made after reading ENCODING-SURVEY.md and the emergence rate study.*

The goal, in one sentence: a creature should be able to evolve a body part we never drew, and that part should genuinely matter, so that the day a lineage grows a paddle of its own invention, the paddle propels it.

## Hard requirements

Any design that fails one of these is rejected regardless of its other virtues.

1. **Determinism.** The body is a pure function of genome and age. Randomness only ever occurs inside the simulation step, tool functions, and world init, drawn from the seeded stream. Replays must remain bit identical. No physics accumulation scheme that amplifies floating point noise into divergence.
2. **Migration.** Every creature alive today must load into the new system unchanged in behavior. The existing linear segment chain must be expressible as a degenerate case of the new body representation: a chain is a tree that never branched. No save wipe, no behavior cliff.
3. **Budget.** The whole step stays under about 1.5 milliseconds at population 200 on ordinary hardware. Body evaluation is cached per creature and recomputed only on growth ticks (age changes), never per step. Per step costs must be linear in part count with a small constant.
4. **One file, no libraries.** The entire system, physics included, remains readable in one sitting.
5. **Sexual reproduction first.** Crossover between two differently shaped parents must usually produce a viable child. Encodings where crossover is destructive are penalized heavily; this rules out several classical schemes in their naive form.
6. **The unified principle.** Each part carries its own small neuron bundle (ganglion). Duplicating a part duplicates its ganglion, wired the same way. Body growth and brain growth are one mechanism, extending v1.31's hidden neuron machinery rather than replacing it.
7. **Nothing is free.** Every part has mass, drag, metabolic upkeep, and growth cost. Every ganglion neuron burns energy through the existing wsum economics. A bigger body must earn its keep, exactly as brains and segments already must.

## The migration bridge

Today a creature is: one head (all head genes) plus 0 to 4 chain segments, each with {fin, spike, shell}. The bridge: a body is a tree of parts; the head is the root; today's segment chain is the root with a single line of descendants. Old saves load as exactly that tree. Nothing else changes on load day: the revolution begins only when the first branching mutation occurs in a birth.

## Part model (independent of encoding choice)

Each part: {parent, attach angle on parent, size ratio to parent, type weights}. Type is not an enum but a blend of expressed traits (fin, spike, shell, sensor, mouth), continuous like every other gene, so intermediate organs exist and selection sharpens them. Sensors extend perception in their facing direction; mouths gate what the creature can eat and where; fins contribute propulsion. The head starts as the only mouth-and-sensor bearing part, so founders behave exactly as today.

## The locomotion question

Three candidate physics models, to be settled by the survey's cost analysis:

- (a) Full articulated physics with a constraint solver. Highest fidelity, highest cost, highest determinism risk. Likely rejected on budget and risk.
- (b) Analytic paddle model: each fin part contributes a thrust vector computed in closed form from an oscillation phase (a pure function of simT and the part's ganglion output), summed at the body center with torque from off axis placement. No solver, costs a few multiplies per part, deterministic by construction. The paddle genuinely propels; placement genuinely steers.
- (c) Stat aggregation only: parts modify scalar speed and turn. Cheapest, already proven by segments, but a paddle would not be a paddle, only a number. Fails the goal sentence.

Working preference: (b), with (c) as the degenerate fallback for parts whose ganglion has not yet learned to oscillate, which preserves the founder behavior bridge.

## Phase ladder

- **Phase 1, The First Branch.** Trees instead of chains. Branching duplication, part model, stat level effects, tree rendering in both renderers. Chains remain the common case until selection says otherwise.
- **Phase 2, The Paddle.** Analytic locomotion. Fin parts oscillate under ganglion control; thrust and torque come from geometry. The moment shape starts mattering physically.
- **Phase 3, The Organ.** Sensor and mouth parts move perception and feeding onto the body plan. Eyes that face somewhere; mouths that must reach food. The head becomes a choice rather than a given.

Each phase is its own release, tested to the standing invariants, shippable alone, and reversible in scope if the dish's ecology rejects it.

## Open decisions for the encoding survey

1. Direct tree genome versus generative encoding (grammar or network producing the tree). Directness favors crossover viability and one file readability; generative favors symmetry and repetition richness.
2. Whether subtree duplication suffices for the repetition and symmetry that made Sims creatures lifelike, without paying for a full generative system.
3. Ganglion wiring layout inside the flat brain array, preserving the v1.31 property that the legacy layout is the zero case.

## Watch window note

Wild emergence data for hidden neurons (v1.31) is accumulating in daily dishes during this design phase. If structural brain mutations prove too rare to observe at all in real play, the same rates will be too rare for body branching, and the mutation economics get revisited before Phase 1 ships.

## Decisions

**1. The genome is a direct tree of parts.** Today's segment array, generalized to allow branching: each part names its parent, and the encoding is the tree itself, not a grammar or network that generates one. The survey confirmed what the requirements predicted: directness is the only representation where lossless migration (a chain is a tree that never branched), crossover viability, one file cost, and cached evaluation all fall out for free. L systems were the only generative family to clear every constraint and are noted as the one technique worth revisiting if richer symmetric branching ever becomes a priority; grammar indirection is not worth its cost today.

**2. Ganglion crossover aligns by tree position.** NEAT solved crossover between different structures with innovation numbers; our part tree supplies the same alignment for free through a fixed order walk. Shared positions cross weight by weight, unshared subtrees travel whole from the structure parent, exactly the pattern proven by v1.31's crossBrainT. We borrow NEAT's idea, not its machinery.

**3. Locomotion is analytic per part phase oscillators.** Each fin part contributes a thrust vector computed in closed form from an oscillation phase driven by its ganglion output, with torque from off axis placement. No constraint solver, deterministic by the same pattern as every existing formula, a few multiplies per part. The survey's cost analysis confirmed this is the only affordable option where a paddle is genuinely a paddle: placement, count, and phase all evolve, and the physics rewards them honestly.

**4. Mutation economics: lower the rent, not raise the rate.** The emergence study (five seeds, 5,745 births, default dials) found structures appear in the first minute of every world; scarcity was never the bottleneck. Segments are selected out by cost: 26 percent metabolism per segment retains only 6.5 percent of expected carriers, while hidden neurons at their gentler price retain 83 percent at peak. Before Phase 1 ships, the per segment burn drops toward 15 percent, verified by a before and after emergence study. Branching rates start at the segment duplication rate and are tuned from measurement, never from taste.

## Build order

1. Segment economics rebalance (pre Phase 1, its own measured release).
2. Phase 1, The First Branch: trees, branching duplication, part model, both renderers.
3. Phase 2, The Paddle: analytic locomotion.
4. Phase 3, The Organ: sensors and mouths on the body plan.

Each phase ships alone, tested to the standing invariants, with emergence measured after each.

