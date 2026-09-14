# v1.43 The Threshold · preregistration

Written 2026-09-14 and committed with the code, before any run of this study.

## The two switches

- **THRESH_BASE** (0 or 1). Breeding readiness, for a creature and for a prospective mate, is measured against *base* capacity, `12·size²·gk²`, instead of body-inflated capacity, which adds 45 percent per body part. The hunger threshold is unchanged.
- **EYE_FOOD** (0 or 1). An eye (`sgEye > 0.15`) extends algae detection exactly as it already extends prey detection: the neighbourhood query widens 1.5×, and an alga is accepted out to `2.25·sense²` if it lies inside the eye's cone (`eyeSees`).
- Both at 0 is bit for bit v1.42.

## Design

A 2×2 of THRESH_BASE × EYE_FOOD. Six seeds per arm, the v1.40 declared set: 60606, 1001, 1002, 1003, 1004, 1005. WORLD 3, R = 1002; the harness refuses to run at any other radius. ENTRENCH = 0, classic scenario. Each run stops when maxGen reaches 400, with a cap of 600 simulated minutes. The fitness ledger is on: every creature born in the run, founders excluded, is recorded once at death with its lifetime offspring. The living population is sampled every 6 simulated minutes for population, bodied count, eyed bodied count, and maxGen.

**Reproducibility check.** The (0,0) arm must reproduce the v1.42 eye selection ledger in `studies/eye-selection.json` exactly, seed by seed.

## Pilot (descriptive, no pass or fail)

Seeds 60606 and 1001 in arms (0,0) and (1,0). Quantity: the body cost `s(1 part vs bodiless) = W(1/noeye) / W(0/-) − 1` in each arm, and the fraction of it the switch removes, `1 − s(1,0) / s(0,0)`. The same quantity is then reported from all six seeds.

## Primary criterion: is the eye adaptive once it is wired to food?

In the **(0,1)** arm, pooled over six seeds, `s(eye | 1 part) = W(1/eye) / W(1/noeye) − 1` exceeds **+10 percent**, and its 95 percent interval, by the delta method on Poisson offspring counts as in v1.42, lies entirely **above zero**.

The same test is reported, not substituted, for **(1,1)**: whether the result holds when bodies are cheaper to breed. In the controls (0,0) and (1,0), where the eye is not wired to food, it is expected near zero.

## Secondary criterion: does the eye spread among bodied creatures? (amended)

This replaces the v1.42 test "eyed share exceeds 50 percent", which cannot be met while eyes can sit only on body parts and bodied share is held near 15 percent. It is amended here, before any data.

In one seed the criterion is met if eyed share **among bodied creatures** exceeds 50 percent continuously for at least **100 generations** of maxGen, counting only 6 minute samples with at least 10 bodied creatures; a sample with fewer than 10 bodied breaks the run. It is met overall if it holds in **at least 4 of 6 seeds**. Evaluated in (0,1) and reported for (1,1).

## Falsifier

If `s(eye | 1 part)` is not above zero in the (0,1) arm, the wiring was not the problem, and under the v1.42 falsifier the vision line is set aside in favour of the body cost.

## What this cannot show

Eyed and eyeless creatures are not randomised; they are whatever mutation produced. One machine, and cross machine determinism is known broken. Under EYE_FOOD the wider algae query is also the neighbourhood the mouth then scans, which can change which alga is taken first when a creature fills up; that is part of the switch, not a separate effect.
