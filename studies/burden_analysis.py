#!/usr/bin/env python3
"""Scores The Burden (v1.44) exactly as studies/burden-prereg.md fixes it, before any data exist.

    python3 studies/burden_analysis.py RUNS.json OUT.json

RUNS.json is what studies/lab_extract.py writes for study 'burden'. Validity checks, the
decomposition, its bootstrap intervals and the statements fixed in advance are all computed
here; nothing is chosen after seeing the numbers.
"""
import json
import math
import os
import random
import sys

SEEDS = [60606, 1001, 1002, 1003, 1004, 1005]
SWITCHES = [('THRESH_BASE', 'T'), ('SEG_MOVE', 'M'), ('SEG_BURN', 'B')]
ARMS = ['000', 'T00', '0M0', '00B', 'TM0', 'T0B', '0MB', 'TMB']
RESAMPLES = 10000
RNG_SEED = 44
FIELDS = ['n', 'kids', 'age', 'ateA', 'ateM', 'eyeSum', 'parts']
FIN = ['gen', 'min', 'pop', 'dKill', 'births', 'deaths']
HERE = os.path.dirname(os.path.abspath(__file__))


def arm_of(sw):
    return ''.join(letter if sw.get(name) else '0' for name, letter in SWITCHES)


def quantile(sorted_vals, q):
    pos = q * (len(sorted_vals) - 1)
    lo = math.floor(pos)
    hi = min(lo + 1, len(sorted_vals) - 1)
    return sorted_vals[lo] + (sorted_vals[hi] - sorted_vals[lo]) * (pos - lo)


def interval(vals):
    s = sorted(vals)
    return [round(quantile(s, 0.025), 4), round(quantile(s, 0.975), 4)]


# ---------- the two instruments: counts per run, cost from pooled counts ----------
def ledger_counts(run):
    b = run['FIT']['bins']
    one, none = b.get('1/noeye', {}), b.get('0/-', {})
    return (one.get('kids', 0), one.get('n', 0), none.get('kids', 0), none.get('n', 0))


def ledger_cost(counts):
    k1 = sum(c[0] for c in counts); n1 = sum(c[1] for c in counts)
    k0 = sum(c[2] for c in counts); n0 = sum(c[3] for c in counts)
    return 1 - (k1 / n1) / (k0 / n0)


def garden_counts(run):
    t = {'A': [0, 0], 'A2': [0, 0], 'B': [0, 0]}
    for row in run['garden']['f']:
        t[row[1]][0] += row[2]
        t[row[1]][1] += 1
    return (t['A'][0], t['A'][1], t['A2'][0], t['A2'][1], t['B'][0], t['B'][1])


def garden_cost(counts):
    kA = sum(c[0] + c[2] for c in counts); nA = sum(c[1] + c[3] for c in counts)
    kB = sum(c[4] for c in counts); nB = sum(c[5] for c in counts)
    return 1 - (kB / nB) / (kA / nA)


def garden_null(counts):
    kA = sum(c[0] for c in counts); nA = sum(c[1] for c in counts)
    kA2 = sum(c[2] for c in counts); nA2 = sum(c[3] for c in counts)
    return (kA2 / nA2) / (kA / nA) - 1


# ---------- the decomposition ----------
def shapley(v):
    """Each switch's Shapley share of the all-off cost, and the residual; they sum to one."""
    base = v['000']
    t = (v['000'] - v['T00']) / 3 + (v['0M0'] - v['TM0']) / 6 + (v['00B'] - v['T0B']) / 6 + (v['0MB'] - v['TMB']) / 3
    m = (v['000'] - v['0M0']) / 3 + (v['T00'] - v['TM0']) / 6 + (v['00B'] - v['0MB']) / 6 + (v['T0B'] - v['TMB']) / 3
    b = (v['000'] - v['00B']) / 3 + (v['T00'] - v['T0B']) / 6 + (v['0M0'] - v['0MB']) / 6 + (v['TM0'] - v['TMB']) / 3
    return {'THRESH_BASE': t / base, 'SEG_MOVE': m / base, 'SEG_BURN': b / base, 'residual': v['TMB'] / base}


def anchored(v):
    """Of the cost left with THRESH_BASE on, the fraction removed by adding each new switch."""
    return {'SEG_MOVE': 1 - v['TM0'] / v['T00'], 'SEG_BURN': 1 - v['T0B'] / v['T00'], 'both': 1 - v['TMB'] / v['T00']}


def share_statement(ci):
    if ci[0] > 0:
        return 'carries part of the body cost'
    if ci[1] < 0:
        return 'works against the body cost'
    return 'no detectable share'


def residual_statement(ci):
    if ci[1] < 0.25:
        return 'the three switches account for the body cost'
    if ci[0] > 0.25:
        return 'a substantial cost remains'
    return 'residual uncertain'


def score_instrument(by_arm, cost_fn, rng):
    point = {a: cost_fn(by_arm[a]) for a in ARMS}
    boot = {a: [] for a in ARMS}
    dec_boot, anc_boot = [], []
    for _ in range(RESAMPLES):
        v = {}
        for a in ARMS:
            runs = by_arm[a]
            v[a] = cost_fn([runs[rng.randrange(len(runs))] for _ in runs])
            boot[a].append(v[a])
        dec_boot.append(shapley(v))
        anc_boot.append(anchored(v))
    dec = shapley(point)
    dec_ci = {k: interval([d[k] for d in dec_boot]) for k in dec}
    anc = anchored(point)
    anc_ci = {k: interval([d[k] for d in anc_boot]) for k in anc}
    base_ci = interval(boot['000'])
    if base_ci[0] > 0:
        statements = {**{k: share_statement(dec_ci[k]) for k in ('THRESH_BASE', 'SEG_MOVE', 'SEG_BURN')},
                      'residual': residual_statement(dec_ci['residual'])}
    else:
        statements = {'void': 'the all-off cost interval reaches zero, so there is no cost to divide'}
    return {
        'cost': {a: {'point': round(point[a], 4), 'ci95': interval(boot[a]), 'perSeed': [round(cost_fn([c]), 4) for c in by_arm[a]]} for a in ARMS},
        'decomposition': {k: {'point': round(dec[k], 4), 'ci95': dec_ci[k]} for k in dec},
        'statements': statements,
        'anchoredOnThreshold': {k: {'point': round(anc[k], 4), 'ci95': anc_ci[k]} for k in anc},
    }, dec, dec_ci


def poisson_cost_ci(counts):
    k1 = sum(c[0] for c in counts); n1 = sum(c[1] for c in counts)
    k0 = sum(c[2] for c in counts); n0 = sum(c[3] for c in counts)
    r = (k1 / n1) / (k0 / n0)
    half = 1.96 * r * math.sqrt(1 / k1 + 1 / k0)
    return [round(1 - r - half, 4), round(1 - r + half, 4)]


def main():
    data = json.load(open(sys.argv[1]))
    runs, armed = data['runs'], data.get('armed', [])
    out_path = sys.argv[2]
    rng = random.Random(RNG_SEED)

    acceptance = [r for r in runs if r.get('label') == 'v1.42 acceptance']
    ledger = [r for r in runs if r['job']['kind'] == 'ledger' and r.get('label') != 'v1.42 acceptance']
    garden = [r for r in runs if r['job']['kind'] == 'garden']

    def by_arm(rs, counts_fn):
        d = {a: [] for a in ARMS}
        for r in sorted(rs, key=lambda r: SEEDS.index(r['job']['seed'])):
            d[arm_of(r['job']['sw'])].append((r['job']['seed'], counts_fn(r)))
        for a in ARMS:
            seeds = [s for s, _ in d[a]]
            assert sorted(seeds) == sorted(SEEDS), f'arm {a} has seeds {seeds}'
        return {a: [c for _, c in d[a]] for a in ARMS}

    # ---------- validity ----------
    builds = sorted({(r['build']['appV'], r['build']['script'], r['build']['labHash']) for r in runs})
    run_tabs = sorted({r['tab'] for r in runs})
    armed_ok = {a['tab'] for a in armed if a.get('preflight') and a['preflight']['ready']
                and all(c['pass'] for c in a['preflight']['checks'])}
    validity = {'V1_preflight': {'pass': len(builds) == 1 and all(t in armed_ok for t in run_tabs),
                                 'tabs': run_tabs, 'tabsWithPassingPreflight': sorted(armed_ok),
                                 'buildsUsed': [list(b) for b in builds],
                                 'note': 'a queue refuses to start without a passing preflight; each tab posts its checks when armed'}}
    validity['V2_acceptance'] = ({'pass': acceptance[0]['accept']['pass'], 'individuals': acceptance[0]['accept']['individuals'],
                                  'stopStep': acceptance[0]['accept']['stopStep'], 'diffs': acceptance[0]['accept']['diffs'][:10]}
                                 if acceptance else {'pass': False, 'note': 'acceptance run missing'})
    ref = json.load(open(os.path.join(HERE, 'threshold.json')))['raw']['runs']
    repro = []
    for r in ledger:
        arm = arm_of(r['job']['sw'])
        if arm not in ('000', 'T00'):
            continue
        th = 1 if arm == 'T00' else 0
        match = [x for x in ref if x['seed'] == r['job']['seed'] and x['th'] == th and x['ey'] == 0]
        diffs = []
        if len(match) != 1:
            diffs.append(['reference', 'missing', len(match), 1])
        else:
            m = match[0]
            keys = set(m['FIT']['bins']) | set(r['FIT']['bins'])
            for k in sorted(keys):
                for f in FIELDS:
                    a = r['FIT']['bins'].get(k, {}).get(f, 0)
                    b = m['FIT']['bins'].get(k, {}).get(f, 0)
                    if a != b:
                        diffs.append([k, f, a, b])
            for f in FIN:
                if r['fin'][f] != m['fin'][f]:
                    diffs.append(['fin', f, r['fin'][f], m['fin'][f]])
        repro.append({'arm': arm, 'seed': r['job']['seed'], 'identical': not diffs, 'diffs': diffs[:5]})
    validity['V3_reproducesV143'] = {'pass': len(repro) == 12 and all(x['identical'] for x in repro), 'runs': repro}

    # ---------- ledger ----------
    L = by_arm(ledger, ledger_counts)
    ledger_scored, L_dec, L_ci = score_instrument(L, ledger_cost, rng)
    for a in ARMS:
        ledger_scored['cost'][a]['poissonCi95'] = poisson_cost_ci(L[a])

    # ---------- garden ----------
    Gc = by_arm(garden, garden_counts)
    all_runs = [c for a in ARMS for c in Gc[a]]
    null_boot = [garden_null([all_runs[rng.randrange(len(all_runs))] for _ in all_runs]) for _ in range(RESAMPLES)]
    null_ci = interval(null_boot)
    validity['V4_gardenNull'] = {'point': round(garden_null(all_runs), 4), 'ci95': null_ci, 'pass': null_ci[0] <= 0 <= null_ci[1],
                                 'perArm': {a: round(garden_null(Gc[a]), 4) for a in ARMS}}
    garden_scored, G_dec, G_ci = score_instrument(Gc, garden_cost, rng)
    base_ci = garden_scored['cost']['000']['ci95']
    garden_scored['statements']['S3_causal'] = ('the body cost is caused by the part' if base_ci[0] > 0
                                                else 'the garden does not show a causal cost')
    if not validity['V4_gardenNull']['pass']:
        garden_scored['statements'] = {'void': 'V4 failed: the garden is biased and its results are not interpreted'}

    # ---------- predictions, recorded in advance ----------
    predictions = {
        'P1_burnShareExceedsMove': {'ledger': L_dec['SEG_BURN'] > L_dec['SEG_MOVE'], 'garden': G_dec['SEG_BURN'] > G_dec['SEG_MOVE']},
        'P2_moveShareSmall': {'ledger': abs(L_dec['SEG_MOVE']) < 0.15, 'garden': abs(G_dec['SEG_MOVE']) < 0.15},
        'P3_ledgerResidualBelowQuarter': L_ci['residual'][1] < 0.25,
        'P4_gardenBaselineCostAtLeast30pct': garden_scored['cost']['000']['point'] >= 0.30,
    }

    # ---------- descriptive ----------
    desc = {'ledger': {}, 'garden': {}}
    for a in ARMS:
        rs = [r for r in ledger if arm_of(r['job']['sw']) == a]
        shares, n_b, parts_b, n_2 = [], 0, 0, 0
        W = {}
        for r in rs:
            shares += [row[3] / row[2] for row in r['s'][1:] if row[2]]
            for k, b in r['FIT']['bins'].items():
                W.setdefault(k, [0, 0]); W[k][0] += b['kids']; W[k][1] += b['n']
                if not k.startswith('0'):
                    n_b += b['n']; parts_b += b['parts']
                    if not k.startswith('1'):
                        n_2 += b['n']
        desc['ledger'][a] = {'bodiedShareOfPopulation': round(sum(shares) / len(shares), 4),
                             'meanPartsAmongBodied': round(parts_b / n_b, 3), 'twoPlusPartsAmongBodied': round(n_2 / n_b, 4),
                             'W': {k: round(v[0] / v[1], 4) for k, v in sorted(W.items())}}
        gs = [r for r in garden if arm_of(r['job']['sw']) == a]
        roles = {}
        for r in gs:
            for row in r['garden']['f']:
                d = roles.setdefault(row[1], {'n': 0, 'age': 0.0, 'sex': 0, 'kin': 0, 'k': 0, 's': 0, 'a': 0, 'censored': 0})
                d['n'] += 1; d['age'] += row[3]; d['sex'] += row[5]; d['kin'] += row[6]; d['censored'] += row[9]
                if row[4]:
                    d[row[4]] += 1
        desc['garden'][a] = {
            'released': sum(r['garden']['released'] for r in gs), 'skipped': sum(r['garden']['skipped'] for r in gs),
            'byRole': {role: {'founders': d['n'], 'meanLifespan': round(d['age'] / d['n'], 2),
                              'deathShare': {'killed': round(d['k'] / d['n'], 4), 'starved': round(d['s'] / d['n'], 4), 'oldAge': round(d['a'] / d['n'], 4)},
                              'censored': d['censored'],
                              'sexualOffspringWithTripletSibling': round(d['kin'] / d['sex'], 4) if d['sex'] else None}
                       for role, d in sorted(roles.items())},
        }

    out = {'study': 'THE BURDEN (v1.44)', 'preregistration': 'studies/burden-prereg.md',
           'resamples': RESAMPLES, 'rngSeed': RNG_SEED, 'validity': validity,
           'ledger': ledger_scored, 'garden': garden_scored, 'predictions': predictions, 'descriptive': desc}
    json.dump(out, open(out_path, 'w'), indent=1)

    print('validity: preflight', validity['V1_preflight']['pass'], '| acceptance', validity['V2_acceptance']['pass'],
          '| v1.43 reproduced', validity['V3_reproducesV143']['pass'],
          '| garden null', validity['V4_gardenNull']['point'], validity['V4_gardenNull']['ci95'], validity['V4_gardenNull']['pass'])
    for name, sc in (('ledger', ledger_scored), ('garden', garden_scored)):
        print(f'\n{name}: cost by arm (point, 95% seed bootstrap)')
        for a in ARMS:
            print(f'  {a}  {sc["cost"][a]["point"]:.4f}  {sc["cost"][a]["ci95"]}')
        print(f'{name}: shares of the all-off cost')
        for k, v in sc['decomposition'].items():
            print(f'  {k:12s} {v["point"]:+.4f}  {v["ci95"]}')
        print(f'{name}: statements', json.dumps(sc['statements']))
    print('\npredictions', json.dumps(predictions))


if __name__ == '__main__':
    main()
