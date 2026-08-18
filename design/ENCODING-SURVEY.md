# Genotype Encodings for Evolved Morphology

## Context

Primordial Soup grows bodies as linear chains: a mutation duplicates the last segment, and each segment is an independent bundle of fin, quill, and shell genes (v1.26). Brains grow separately, duplicating a hidden neuron in one shared layer, with crossover that aligns parents of different depth (v1.31). Bodies grow smoothly with age from a pure function of genome and age, no randomness in the curve itself (v1.29), and the simulation draws randomness only inside the simulation step, tool functions, and world init, never during replay.

The draft design in this folder, DESIGN-BODY.md, proposes a unified principle: a body becomes a tree of parts, each carrying its own small neuron bundle, a ganglion, that duplicates with the part rather than on a separate schedule. It poses three open questions for this survey: direct genomes versus generative encodings, whether plain duplication gives enough richness, and how ganglion wiring should sit inside the flat brain array. What follows surveys six families against its hard requirements, covers swimming locomotion on its own, and closes by answering those three questions.

## Karl Sims (1994): Directed Graphs with Local Neurons

Core idea. Sims encoded a creature as a directed graph of nodes and connections; each node is a rigid body part with its own local sensors and a small neural circuit, and development walks the graph outward from a root so one node can recurse into repeated or mirrored limbs.

Richness. The richest family surveyed: hierarchy, bilateral symmetry, repeated limbs, and branching all fall out of graph recursion, which is how Sims produced convincing swimmers, walkers, and jumpers from a compact description.

Genome and crossover. Genomes run to a few dozen nodes, small but structurally irregular. Sims compared crossover between differently shaped graphs to reproductive isolation between species; his loosest crossover, splicing a random subtree from one parent into another, frequently breaks the offspring, close to the opposite of sexual reproduction first.

Cost per tick. Building the part tree from the graph is only a growth tick cost; the real expense is downstream, since the jointed rigid assembly it produces still needs a true constraint solver every step.

Fit and verdict. A plain chain is technically a degenerate graph, but the interpreter needed to walk graphs safely is a large new subsystem, and crossover fragility cuts against our breeding model. Poor fit as a whole system, but the strongest proof here that a part carrying its own local neurons, our unified principle, works on its own, separable from the graph and solver that carried it.

## NEAT and CPPN-NEAT / HyperNEAT: Topology by Innovation, Pattern by Geometry

Core idea. NEAT evolves a network's weights and topology together, tagging new nodes and connections with historical markers called innovation numbers. CPPN-NEAT and HyperNEAT reuse that engine to evolve a small function of spatial coordinates, a pattern-producing network, that paints structure onto a substrate rather than listing it directly.

Richness. NEAT alone shapes brains, not bodies. CPPNs are strong at morphology because functions like sine and gaussian give symmetry and repetition almost for free, though the result reads as a painted field rather than a jointed hierarchy of limbs.

Genome and crossover. NEAT genomes are compact gene lists, tens to a few hundred entries; CPPN genomes stay small regardless of body resolution. Innovation numbers let differently shaped networks align gene by gene and produce a coherent child almost by construction, precisely what sexual reproduction first needs; our own brain crossover already does a simplified version of this by hidden neuron depth.

Cost per tick. Evaluating a small network or CPPN is a handful of multiplications, effectively free next to any physics cost.

Fit and verdict. Cheap and deterministic, but nothing maps to a segment array as a graceful degenerate case, and a CPPN body would replace the current representation rather than extend it. Strong candidate for how ganglion crossover should be validated; possible but awkward as the body encoding itself.

## L-systems: Grammars That Rewrite Into Bodies

Core idea. An L-system genome is a tiny grammar, an axiom plus a few rewrite rules over a small alphabet. The phenotype comes from rewriting the axiom a fixed number of times and reading the result as instructions for placing body parts, like a turtle graphics program drawing from a string.

Richness. Excellent for hierarchy, branching, and fractal-like repetition with variation; mirrored rules give symmetry cheaply, and small genomes yield elaborate bodies since complexity grows with rewrite iterations, not genome length, a documented improvement over direct, Sims-style encodings that look unnatural since nothing is reused.

Genome and crossover. Genomes are tiny, a handful of short rules. Crossover exchanges rules or subtrees, as in grammar-guided genetic programming; typing rules by the symbol they rewrite keeps offspring well-formed, though a single swapped rule can still cascade into a different body after several rewrite passes.

Cost per tick. Rewriting is a cheap growth tick cost, string operations rather than simulation; runtime cost per step is whatever the resulting parts cost to evaluate, a choice made by the locomotion model, not the encoding.

Fit and verdict. An unbranched, single-rule L-system is exactly a linear chain, the cleanest degenerate case surveyed, and a minimal turtle interpreter fits one file; attaching a ganglion to each generated symbol is natural, since rewriting already duplicates whatever payload a symbol carries. Strong candidate: best richness for its code footprint, a lossless migration path, and a natural home for traveling ganglia.

## Framsticks: Sticks and Cell Programs

Core idea. Framsticks offers several encodings side by side; its f1 format is a direct program of structural commands building a tree of rigid sticks, joints, and neurons, while its f4 format is developmental, a single ancestor cell executing genetic instructions and dividing into an emergent tree of differentiated cells.

Richness. Very high, arguably the most complete creature description language surveyed: explicit branching sticks, mirrored limbs, and neurons wired to specific parts, purpose-built for exactly the coupling our unified principle wants.

Genome and crossover. Genomes are compact strings, tens to a few hundred codes. Framsticks documents f4 crossover explicitly: it swaps two subtrees between genotype trees, sized between ten and ninety percent of the genotype; the tree is well-formed by construction so the child always parses, but a swapped limb is not guaranteed to make sense where it lands, better than raw graph splicing but not as safe as our own index-aligned segment crossover.

Cost per tick. Parsing the code string into a tree is a cheap, growth tick only cost, but the stick figure it describes still needs full multibody rigid physics every step, the same expensive category as Sims.

Fit and verdict. A trivial f1 program, one stick repeated, does collapse to a linear chain, but the interpreter and physics it needs are a much larger undertaking than extending the current array. Possible: the closest existing prior art for coupling a part to its own neurons, worth studying, too heavy to adopt wholesale at this budget.

## Gene Regulatory Networks: Development by Simulated Chemistry

Core idea. A GRN genome describes a small set of genes whose products activate or repress one another and often diffuse through space. Body plan and cell fate only emerge after simulating this chemistry forward over developmental time, much like real Hox gene segmentation.

Richness. The highest ceiling here in principle, capable of parts with individually different identities rather than our current interchangeable ones, since this is literally how real bodies pattern themselves; in practice, naive GRNs are hard to tune and often collapse to trivial or unstable patterns.

Genome and crossover. Raw parameter counts are small, a handful of genes and interaction weights, but the real complexity lives in simulated developmental time, not genome size. Recombining two independently evolved GRNs is fragile, since regulatory dynamics are sensitive to their exact parameters, so a crossed network frequently fails to develop a coherent body at all, a known struggle in the GRN alife literature.

Cost per tick. Development is a growth tick cost under our caching rule, not a true per step cost, which softens the concern, though it remains the heaviest one-time pass of the six, and a chaotic misfire during it is far harder to bound than one bad value in a direct gene.

Fit and verdict. No natural degenerate case reduces to today's identical chain without hand-tuning the network to reproduce it, so migration would be a rewrite. Poor fit for now: the richest idea on paper, but crossover fragility and the missing degenerate case break two hard requirements outright.

## Voxel and Soft Body Systems: Lenia and Evolved Soft Robots

Core idea. Here the body is the simulation substrate itself. Lenia generalizes Conway's Game of Life into continuous space, state, and time, so a creature is a stable pattern under a convolution kernel; voxel soft robots assign a material or actuation phase to each grid cell, simulated as a mass-spring system, sometimes generated indirectly by a CPPN.

Richness. The most genuinely open-ended family surveyed, with no built-in bias toward chains or limbs at all; locomotion, self-repair, and unplanned body shapes emerge from purely local rules, the closest thing here to evolving a mechanism nobody designed.

Genome and crossover. Direct voxel genomes scale with grid resolution, roughly a hundred to a thousand genes; CPPN-generated voxels stay small regardless of resolution. Splicing two grids on a shared coordinate plane is comparatively safe, since position is already the alignment key, but a bad cut can still yield a disconnected or non-functional body needing repair.

Cost per tick. This is the one family where growth tick caching cannot help: structure and simulation are the same substrate, so every tick re-integrates the whole body. Even fast, purpose-built simulators report only hundreds of steps per second for a single robot on optimized native code, several milliseconds per creature per step for one creature alone, already past this game's whole budget for two hundred.

Fit and verdict. No sense in which a linear chain is a degenerate case of a voxel grid or automaton; an existing creature would need reinterpreting from scratch. Poor fit at this scale and budget, despite being the best conceptual answer to genuine novelty.

## Swimming Locomotion: Solver, Analytic Paddle, or Stat Aggregation

Full constraint-solver articulated physics resolves joints and contacts iteratively, in the style of Box2D's sequential impulse solver, commonly around eight velocity iterations and three position iterations per constraint, with cost scaling with the number of joints and contacts in the world, not creature count alone. Two hundred creatures with a few parts each means several hundred joints resolved every tick, a large subsystem to hand-write in one file, likely to consume most of the whole step budget by itself. Determinism is reachable in principle, since the same code in the same order reproduces the same result, but iterative solvers are exactly what this project's own postmortems keep tripping over: warm-starting between ticks, contact ordering, and state keyed by object identity rather than a stable index are classic places for a replay bug to hide. This is the only option where thrust is a genuine physical consequence of geometry and torque, so it is also the only one capable of a truly unplanned mechanism.

Analytic paddle models compute a phase for each part from simulation time, a per-creature swim frequency gene, and a per-part phase offset, the same coupled oscillator pattern real segmented swimmers such as lampreys use, then contribute a thrust vector in closed form: no solver, no iteration, no stored contact state. Cost is a handful of trig calls per part, trivially inside budget for two hundred creatures. Determinism risk is low: this is the same shape of computation the game already runs for its burn and speed formulas, one deterministic expression evaluated fresh every tick from genome, age, and state, nothing carried over to warm-start or misorder. It cannot discover a paddle shape unlike anything the formula anticipates, but it can discover where fins evolve, how many, and how their phases synchronize into a stroke nobody hand-tuned, most of the goal's spirit at a fraction of the cost.

Stat aggregation lets parts modify scalar speed and turn multipliers while their positions come from trail history alone, cosmetic and disconnected from propulsion, which is what the game already does today, cheap and deterministic across several shipped versions. But a fin here cannot evolve a mechanism, only a bigger number on a mechanism that was always designed in; no search over gene values will ever surprise the designer with a new way to swim.

For this question, analytic paddle models are the right target: they keep the cost and determinism of what already ships while giving evolution real freedom over fin placement, count, and phase, the affordable part of evolving an undesigned paddle. Full solver physics is correct in spirit but not in budget; stat aggregation is a ceiling already reached, not a next step.

## Answers to the Open Decisions

On direct genomes versus generative encodings: go direct. A tree of part structs, each a small bundle of continuous traits plus a parent pointer, keeps crossover safe and keeps the linear chain a literal, lossless special case, exactly what migration and sexual reproduction first demand. Of every generative alternative surveyed, only L-systems clear every hard requirement; the rest fail on live crossover safety, live physics cost, or having no natural degenerate chain, so generative machinery is not worth its risk yet.

On whether duplication alone gives enough richness: yes, for now. Sims's own richest results and the current segment chain both lean on the same primitive, copy an existing part with mutation, and Framsticks and L-systems both confirm that adding a mirror flag and an attach point to that primitive turns repetition into limbs and symmetry, no rewriting grammar or network required.

On ganglion wiring inside the flat brain array: let the part tree supply the alignment NEAT gets from innovation numbers. Walk the tree in the same fixed order crossover already uses, give each ganglion the same small fixed slot shape used for today's hidden neurons, and duplicate or align ganglia exactly when their parts are duplicated or aligned. No separate historical bookkeeping is needed, since the tree itself is already the record.
