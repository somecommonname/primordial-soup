# Genotype Encodings for Evolved Morphology

## Context

Primordial Soup grows bodies as linear chains, each segment an independent bundle of fin, quill, and shell genes (v1.26). Brains grow separately, by duplicating a hidden neuron with depth-aware crossover (v1.31). Bodies grow with age as a pure function of genome and age (v1.29), and randomness is drawn only inside the simulation step, never during replay.

DESIGN-BODY.md, in this folder, proposes a unified principle: a body becomes a tree of parts, each with its own small neuron bundle, a ganglion, that duplicates with the part. It poses three open questions: direct genomes versus generative encodings, whether plain duplication gives enough richness, and how ganglion wiring should sit inside the flat brain array. This survey covers six families against those requirements, then locomotion, then answers the three questions.

## Karl Sims (1994): Directed Graphs with Local Neurons

Core idea. Sims encoded each creature as a directed graph of nodes; a node is a body part with its own local sensors and neural circuit. Development walks the graph from a root, so one node can recurse into repeated or mirrored limbs.

Richness. The richest family surveyed: hierarchy, symmetry, repeated limbs, and branching all fall out of graph recursion, producing Sims's swimmers, walkers, and jumpers from a compact description.

Genome and crossover. Genomes run to a few dozen nodes, small but structurally irregular. Sims likened crossover between differently shaped graphs to reproductive isolation between species, since his loosest crossover, splicing a random subtree from one parent into another, frequently breaks the offspring.

Cost per tick. Building the part tree is only a growth tick cost, but the resulting jointed assembly still needs a constraint solver every step.

Fit. A plain chain is technically a degenerate graph, but a safe graph-walking interpreter is a large new subsystem, and crossover fragility works against our breeding model. Poor fit as a whole, but the clearest proof that a part carrying its own local neurons, our unified principle, works on its own.

## NEAT and CPPN-NEAT / HyperNEAT: Topology by Innovation, Pattern by Geometry

Core idea. NEAT evolves a network's weights and topology together, tagging new nodes and connections with historical markers called innovation numbers. CPPN-NEAT and HyperNEAT reuse that engine to evolve a small function of spatial coordinates, a pattern-producing network, painting structure onto a substrate.

Richness. NEAT alone shapes brains, not bodies. CPPNs are strong at morphology because functions like sine and gaussian give symmetry and repetition almost for free, though the result reads as a painted field, not a jointed hierarchy of limbs.

Genome and crossover. NEAT genomes are compact gene lists, tens to a few hundred entries; CPPN genomes stay small regardless of body resolution. Innovation numbers let differently shaped networks align gene by gene into a coherent child, precisely what sexual reproduction first needs; our brain crossover already does a simplified version by hidden neuron depth.

Cost per tick. Evaluating a small network or CPPN is a handful of multiplications, effectively free next to any physics cost.

Fit. Cheap and deterministic, but a CPPN body has no graceful degenerate case, and would replace the segment array rather than extend it. Strong candidate for validating ganglion crossover; awkward as the body encoding itself.

## L-systems: Grammars That Rewrite Into Bodies

Core idea. An L-system genome is a tiny grammar: an axiom plus a few rewrite rules over a small alphabet. The phenotype comes from rewriting the axiom a fixed number of times and reading the result as placement instructions, like turtle graphics drawing from a string.

Richness. Excellent for hierarchy, branching, and fractal-like repetition with variation; mirrored rules give symmetry cheaply, and because complexity grows with rewrite iterations rather than genome length, small genomes yield elaborate, natural-looking bodies.

Genome and crossover. Genomes are tiny, a handful of short rules. Crossover exchanges rules or subtrees, as in grammar-guided genetic programming; typing rules by the symbol they rewrite keeps offspring well-formed, though a swapped rule can cascade into a different body after several rewrite passes.

Cost per tick. Rewriting is a cheap growth tick cost, string operations rather than simulation; runtime cost is whatever the resulting parts cost to evaluate, a choice made by the locomotion model below, not the encoding.

Fit. An unbranched, single-rule L-system is exactly a linear chain, the cleanest degenerate case surveyed. Strong candidate: best richness for its code footprint, a lossless migration path, and a natural home for traveling ganglia.

## Framsticks: Sticks and Cell Programs

Core idea. Framsticks offers several encodings: f1 is a direct program building a tree of rigid sticks, joints, and neurons; f4 is developmental, a single ancestor cell that executes instructions and divides into a tree of cells.

Richness. Very high, the most complete creature description language surveyed: branching sticks, mirrored limbs, and neurons wired to specific parts, built for the coupling our unified principle wants.

Genome and crossover. Genomes are compact strings, tens to a few hundred codes. Framsticks documents f4 crossover explicitly: it swaps two subtrees sized ten to ninety percent of the genotype; the tree is well-formed by construction, but a swapped limb is not guaranteed to make sense where it lands.

Cost per tick. Parsing the code string is a cheap, growth tick only cost, but the resulting stick figure still needs full multibody rigid physics every step, the same expensive category as Sims.

Fit. A trivial f1 program, one stick repeated, collapses to a linear chain, but the interpreter and physics it needs are a larger undertaking than extending the current array. Possible: the closest prior art for coupling a part to its own neurons, too heavy to adopt wholesale at this budget.

## Gene Regulatory Networks: Development by Simulated Chemistry

Core idea. A GRN genome describes a small set of genes whose products activate or repress one another and often diffuse through space. Body plan and cell fate emerge only after simulating this chemistry over developmental time, much like Hox gene segmentation.

Richness. The highest ceiling in principle, capable of parts with individually different identities rather than our interchangeable ones, but naive GRNs are hard to tune and often collapse to trivial or unstable patterns.

Genome and crossover. Parameter counts are small, a handful of genes and weights, but the complexity lives in simulated developmental time, not genome size. Recombining two evolved GRNs is fragile: dynamics are sensitive to exact parameters, so a crossed network often fails to develop a coherent body at all.

Cost per tick. Development is a growth tick cost, not a true per step cost, but it is the heaviest one-time pass of the six, and a chaotic misfire is far harder to bound than one bad value in a direct gene.

Fit. No degenerate case reduces to today's chain without hand-tuning the network to reproduce it, so migration would be a rewrite. Poor fit for now: the richest idea on paper, but crossover fragility and the missing degenerate case break two hard requirements outright.

## Voxel and Soft Body Systems: Lenia and Evolved Soft Robots

Core idea. Here the body is the simulation substrate. Lenia generalizes Conway's Game of Life into continuous space, state, and time, so a creature is a stable pattern under a convolution kernel; voxel soft robots assign a material or actuation phase to each grid cell, simulated as a mass-spring system.

Richness. The most open-ended family surveyed, with no built-in bias toward chains or limbs; locomotion, self-repair, and unplanned shapes emerge from purely local rules, the closest thing here to evolving a mechanism nobody designed.

Genome and crossover. Direct voxel genomes scale with grid resolution, roughly a hundred to a thousand genes; CPPN-generated voxels stay small regardless of resolution. Splicing two grids on a shared plane is comparatively safe, since position is already the alignment key, but a bad cut can yield a disconnected body needing repair.

Cost per tick. Growth tick caching cannot help here, since structure and simulation are the same substrate. Fast, purpose-built simulators report only hundreds of steps per second for one robot, several milliseconds per creature per step alone, well past this game's whole budget.

Fit. No sense in which a chain is a degenerate case of a voxel grid or automaton; an existing creature would need reinterpreting from scratch. Poor fit at this scale and budget, despite being the best conceptual answer to genuine novelty.

## Swimming Locomotion: Solver, Analytic Paddle, or Stat Aggregation

Full constraint-solver articulated physics resolves joints and contacts iteratively, as in Box2D's sequential impulse solver, with cost scaling by joint and contact count: two hundred creatures means several hundred joints every tick, likely consuming most of the step budget alone. Determinism is reachable in principle, but iterative solvers are what this project's postmortems keep tripping over, from warm starting to contact ordering. This is the only option where thrust is a real consequence of geometry, capable of a genuinely unplanned mechanism.

Analytic paddle models compute a phase for each part from simulation time, a swim frequency gene, and a phase offset, the pattern real segmented swimmers such as lampreys use, then contribute a thrust vector in closed form: no solver, no iteration, no stored state, a handful of trig calls per part. Determinism risk is low: it is the same computation shape the game already runs for burn and speed, evaluated fresh each tick with nothing carried over. It cannot discover an unanticipated paddle shape, but it can discover where fins evolve, how many, and how their phases synchronize into a stroke nobody hand-tuned.

Stat aggregation lets parts modify scalar speed and turn while their positions come from trail history alone, cosmetic and disconnected from propulsion, what the game already does today. A fin here cannot evolve a mechanism, only a bigger number on one that was always designed in.

Analytic paddle models are the right target: they keep the cost and determinism of what already ships, with real evolutionary freedom over fin placement, count, and phase. Full solver physics is right in spirit but not in budget; stat aggregation is a ceiling already reached.

## Answers to the Open Decisions

On direct genomes versus generative encodings: go direct. A tree of part structs, each a small bundle of continuous traits plus a parent pointer, keeps crossover safe and keeps the linear chain a literal, lossless special case. Of every generative alternative surveyed, only L-systems clear every hard requirement; the rest fail on crossover safety, physics cost, or having no degenerate chain.

On whether duplication alone gives enough richness: yes, for now. Sims's own richest results and the current segment chain both lean on one primitive, copy an existing part with mutation, and Framsticks and L-systems confirm that adding a mirror flag and an attach point to it turns repetition into limbs and symmetry, no grammar or network required.

On ganglion wiring inside the flat brain array: let the part tree supply the alignment NEAT gets from innovation numbers. Walk the tree in the same fixed order crossover already uses, give each ganglion the slot shape used for today's hidden neurons, and duplicate or align ganglia exactly when their parts are duplicated or aligned.
