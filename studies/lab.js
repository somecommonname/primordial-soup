/* Primordial Soup study lab.
 *
 * Runs preregistered studies inside a game tab served by studies/lab_server.py.
 * Load it into the tab, pass the preflight, then queue jobs:
 *
 *   await new Promise(r => { const s = document.createElement('script');
 *     s.src = '/studies/lab.js?v=' + Date.now(); s.onload = r; document.head.appendChild(s); });
 *   await LAB.preflight();       // nothing runs unless every check passes
 *   LAB.queue('A', jobs);        // runs in order; progress and results go to the server
 *   LAB.status();                // where the queue is
 *
 * A job:
 *   { study, kind: 'ledger' | 'garden', seed, world: 3,
 *     sw: { THRESH_BASE: 1, ... },                    // every switch not named is 0
 *     stop: { maxGen: 400, every: 60, capMin: 600 },  // checked only when stepN % every === 0
 *     sampleEvery: 21600,
 *     garden: { treat: 'part', start: 72000, every: 1800, radius: 40, drainMax: 60000 },
 *     expect: { bins, stopStep, individuals, fin } }  // an exact reproduction test
 *
 * Hazards this file exists to contain, each found the hard way:
 *   - the window resize handler regenerates terrain and rescues creatures, drawing on the
 *     simulation's random stream, so during a study only initWorld may make terrain;
 *   - the dish size comes from the window, so study geometry is fixed at 1280 x 720;
 *   - the service worker serves a stale index.html on the first reload after an edit, so
 *     the preflight compares the running script with the file on disk;
 *   - anything that unpauses the page would step the world outside the lab, so every step
 *     is counted and a foreign step stops the run;
 *   - the stop rule's granularity changes where a run ends, so it is part of the job.
 *
 * The common garden releases matched founders beside a living resident: its genome, brain
 * and lineage, the same heading, phase and lifespan, differing only in the treatment. The
 * lab draws its own choices from a separate stream, so releases never consume the world's.
 */
(function () {
  'use strict';
  if (window.LAB && window.LAB.version) { console.warn('lab.js is already loaded: ' + window.LAB.version); return; }

  const VERSION = 'lab-1';
  const FINGERPRINT = { seed: 60606, world: 1, steps: 18000, fp: 2830395165 };

  // ---------- switches: every one is set on every job, unnamed ones to 0 ----------
  const SWITCHES = {
    ENTRENCH:    { get: () => ENTRENCH,    set: v => { ENTRENCH = v; } },
    THRESH_BASE: { get: () => THRESH_BASE, set: v => { THRESH_BASE = v; } },
    EYE_FOOD:    { get: () => EYE_FOOD,    set: v => { EYE_FOOD = v; } },
    SEG_MOVE:    { get: () => SEG_MOVE,    set: v => { SEG_MOVE = v; } },
    SEG_BURN:    { get: () => SEG_BURN,    set: v => { SEG_BURN = v; } },
  };

  // ---------- small helpers ----------
  const r1 = x => Math.round(x * 10) / 10;
  const r2 = x => Math.round(x * 100) / 100;
  function fnv(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function crcOf(s) {
    let c = 0;
    for (let i = 0; i < s.length; i++) c = (c + s.charCodeAt(i) * (i + 1)) % 1000000007;
    return c;
  }
  const ascii = s => s.replace(/[\u007f-\uffff]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
  function shuffle(a) {                       // uses rnd(): call only inside a lab stream swap
    for (let i = a.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // the fingerprint every build since v1.40 has been checked against
  function fingerprint() {
    let h = 2166136261 >>> 0;
    const P = (x) => { const s = (Math.round((x || 0) * 1e6) / 1e6).toString(); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } };
    for (const c of creatures) {
      P(c.x); P(c.y); P(c.dir); P(c.energy); P(c.age); P(c.gen);
      const sg = c.sg || []; P(sg.length);
      for (const o of sg) { P(o.fin); P(o.spike); P(o.shell); P(o.eye); P(o.mouth); P(o.par); P(o.ang); }
    }
    return h >>> 0;
  }

  // ---------- guards ----------
  const G = { installed: false, lock: false, inInit: false, blocked: 0 };
  let GD = null;                                // the running garden, if any

  function install() {
    if (G.installed) return;
    const _initWorld = initWorld, _genTerrain = genTerrain, _rescue = rescue, _resize = resize;
    const _fitRecord = fitRecord, _crossBrainT = crossBrainT;
    initWorld = function () { G.inInit = true; try { return _initWorld.apply(this, arguments); } finally { G.inInit = false; } };
    genTerrain = function () { if (G.inInit || !G.lock) return _genTerrain.apply(this, arguments); G.blocked++; };
    rescue = function () { if (!G.lock) return _rescue.apply(this, arguments); G.blocked++; };
    resize = function () {
      if (!G.lock) return _resize.apply(this, arguments);
      W = 1280; H = 720; CX = W / 2 * WORLD; CY = H / 2 * WORLD; R = (Math.min(W, H) / 2 - 26) * WORLD; applyWorldScale();
    };
    // garden founders are recorded by the garden and kept out of the ledger
    fitRecord = function (c) { if (GD && GD.onDeath(c)) return; return _fitRecord.apply(this, arguments); };
    // the only place two parents meet: lets the garden count its founders' matings
    crossBrainT = function (a, bha, b, bhb) { if (GD) GD.onCross(a, b); return _crossBrainT.apply(this, arguments); };
    G.installed = true;
  }

  function quiet() {
    paused = true; catchupLeft = 0; replay = null;
    versusSeeds = null; heirSeeds = null; dynasty = 0; parentDish = '';
  }

  function setSwitches(sw) {
    for (const k in SWITCHES) SWITCHES[k].set(0);
    for (const k in (sw || {})) {
      if (!SWITCHES[k]) throw new Error('unknown switch ' + k);
      SWITCHES[k].set(sw[k]);
    }
  }

  function newWorld(seed, world, sw) {
    G.lock = true; quiet();
    setSwitches(sw);
    WORLD = world; resize(); initScent();
    initWorld('classic', seed); paused = true; fitReset(); worldReady = true;
    const want = (Math.min(1280, 720) / 2 - 26) * world;
    if (R !== want) throw new Error('geometry: R is ' + R + ', expected ' + want);
  }

  function runSteps(n) {
    const s0 = stepN;
    for (let i = 0; i < n; i++) step(1 / 60);
    if (stepN !== s0 + n) throw new Error('foreign steps during a lab run');
  }

  // ---------- preflight ----------
  const LAB = window.LAB = {
    version: VERSION, ready: false, build: null, preflightResult: null,
    fingerprint, fnv,
  };

  async function preflight() {
    install();
    LAB.ready = false;
    const checks = [];
    const check = (name, pass, detail) => { checks.push({ name, pass: !!pass, detail }); return !!pass; };

    // 1. the running page is the file on disk
    try {
      const html = await (await fetch('/index.html?lab=' + Date.now(), { cache: 'no-store' })).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const longest = list => [...list].map(s => s.textContent).sort((a, b) => b.length - a.length)[0] || '';
      const served = longest(doc.querySelectorAll('script:not([src])'));
      const running = longest(document.querySelectorAll('script:not([src])'));
      const labSrc = [...document.querySelectorAll('script[src]')].map(s => s.src).filter(u => u.indexOf('/studies/lab.js') >= 0).pop();
      const labText = labSrc ? await (await fetch(labSrc, { cache: 'no-store' })).text() : '';
      LAB.build = { appV: APP_V, script: fnv(running), scriptLength: running.length, lab: VERSION, labHash: fnv(labText) };
      check('build: the running game is index.html as it is on disk', served.length > 0 && served === running,
        { running: fnv(running), onDisk: fnv(served), appV: APP_V });
    } catch (e) { check('build: the running game is index.html as it is on disk', false, String(e)); }

    // 2. every switch exists and is off
    const sw = {};
    for (const k in SWITCHES) { try { sw[k] = SWITCHES[k].get(); } catch (e) { sw[k] = 'missing'; } }
    check('switches: all present and off', Object.values(sw).every(v => v === 0), sw);

    // 3. settings the fingerprint was taken under
    const settings = { foodRate, mutRate, ENTRENCH_HALF, POP_CAP0, ALGAE_CAP0 };
    check('settings: food rate 1, mutation 0.1', foodRate === 1 && mutRate === 0.1, settings);

    try {
      // 4. fixed geometry
      G.lock = true; quiet(); WORLD = 3; resize(); initScent();
      check('geometry: 1280 x 720 whatever the window, R = 1002 at WORLD 3', W === 1280 && H === 720 && R === 1002, { W, H, R });

      // 5. a window resize must not touch the world
      newWorld(4242, 1, {});
      runSteps(600);
      const snap = () => JSON.stringify({ rngS, rocks: rocks.map(r => [r.x, r.y, r.r]), cs: creatures.map(c => [c.x, c.y]), R, CX, CY });
      const before = snap(), b0 = G.blocked;
      window.dispatchEvent(new Event('resize'));
      check('resize: a window resize leaves the world untouched', snap() === before && G.blocked - b0 === 2, { blockedCalls: G.blocked - b0 });

      // 6. bit identity with every build since v1.40
      newWorld(FINGERPRINT.seed, FINGERPRINT.world, {});
      runSteps(FINGERPRINT.steps);
      const fp = fingerprint();
      check('fingerprint: seed 60606, WORLD 1, 18,000 steps is 2830395165', fp === FINGERPRINT.fp,
        { fp, pop: creatures.length, births, deaths, maxGen });
    } catch (e) { check('preflight ran to the end', false, String(e && e.stack || e)); }

    LAB.settings = settings;
    LAB.ready = checks.every(c => c.pass);
    LAB.preflightResult = { ready: LAB.ready, at: new Date().toISOString(), checks, build: LAB.build };
    return LAB.preflightResult;
  }

  // ---------- the common garden ----------
  const BARE = () => ({ fin: 0, spike: 0, shell: 0, eye: 0, mouth: 0, par: -1, ang: 0, la: 0, oa: 0 });
  // Every treatment releases three founders per resident: A and A2 are identical controls,
  // so A2 against A is a null test built into every run; B carries the treatment.
  const TREATMENTS = {
    none: { body: () => [] },
    part: { body: role => role === 'B' ? [BARE()] : [] },
    eye:  { body: role => role === 'B' ? [Object.assign(BARE(), { eye: 0.8 })] : [BARE()] },
  };
  const ROLES = ['A', 'A2', 'B'];

  function makeGarden(job) {
    const cfg = Object.assign({ treat: 'part', start: 72000, every: 1800, radius: 40, drainMax: 60000 }, job.garden || {});
    const T = TREATMENTS[cfg.treat];
    if (!T) throw new Error('unknown garden treatment ' + cfg.treat);
    const gd = {
      cfg, releasing: true, live: 0, peakLive: 0, released: 0, skipped: 0,
      rng: (Math.imul(job.seed | 0, 2654435761) ^ 0x5eed5a1d) | 0,
      tag: new Map(), byBrain: new Map(), founders: [], rel: [],

      afterStep(n) {
        if (this.releasing && n >= cfg.start && (n - cfg.start) % cfg.every === 0) this.release(n);
      },

      release(n) {
        const saved = rngS; rngS = this.rng;
        try {
          const pool = [];
          for (const c of creatures) if (!c.dead && c.age >= 12 && !this.tag.has(c)) pool.push(c);
          if (!pool.length) { this.skipped++; return; }
          const tpl = pool[(rnd() * pool.length) | 0];
          const th0 = rnd() * TAU;
          const roles = shuffle(ROLES.slice());          // which founder stands where
          const made = [];
          for (let k = 0; k < roles.length; k++) {
            const a = th0 + k * TAU / roles.length;
            let x = tpl.x + Math.cos(a) * cfg.radius, y = tpl.y + Math.sin(a) * cfg.radius;
            const dx = x - CX, dy = y - CY, d = Math.sqrt(dx * dx + dy * dy), lim = R - tpl.g.size - 16;
            if (d > lim) { x = CX + dx / d * lim; y = CY + dy / d * lim; }
            const c = makeCreature({ ...tpl.g }, x, y, null, tpl.gen + 1);
            c.br = tpl.br.slice(); c.bh = tpl.bh || 0; c.wsum = brainSum(c.br); c.lin = tpl.lin;
            applySegs(c, T.body(roles[k]));
            made.push(c);
          }
          const m0 = made[0];
          for (const c of made) { c.dir = m0.dir; c.phase = m0.phase; c.lifespan = m0.lifespan; c.energy = c.cap; }
          const rel = this.rel.length;
          this.rel.push([n, tpl.gen, (tpl.sg || []).length, r2(tpl.g.diet), r2(tpl.g.size), r1(m0.lifespan)]);
          for (const k of shuffle([0, 1, 2])) {            // who moves first within a step
            const c = made[k];
            const f = { rel, role: roles[k], kids: 0, age: 0, cause: '', sex: 0, kin: 0, ateA: 0, ateM: 0, cens: 0 };
            this.tag.set(c, f); this.byBrain.set(c.br, f); this.founders.push(f);
            creatures.push(c);
          }
          this.live += 3; if (this.live > this.peakLive) this.peakLive = this.live;
          this.released++;
        } finally { this.rng = rngS; rngS = saved; }
      },

      onDeath(c) {
        const f = this.tag.get(c);
        if (!f) return false;
        f.kids = c.kids | 0; f.age = c.age; f.ateA = c.ateA || 0; f.ateM = c.ateM || 0;
        f.cause = c.killed ? 'k' : (c.energy <= 0 ? 's' : 'a');
        this.tag.delete(c); this.byBrain.delete(c.br); this.live--;
        return true;
      },

      onCross(a, b) {
        const fa = this.byBrain.get(a), fb = this.byBrain.get(b);
        if (fa) { fa.sex++; if (fb && fb.rel === fa.rel) fa.kin++; }
        if (fb) { fb.sex++; if (fa && fa.rel === fb.rel) fb.kin++; }
      },

      censor() {
        for (const [c, f] of this.tag) { f.kids = c.kids | 0; f.age = c.age; f.ateA = c.ateA || 0; f.ateM = c.ateM || 0; f.cens = 1; }
      },

      export() {
        return {
          cfg, released: this.released, skipped: this.skipped, peakLive: this.peakLive, censored: this.tag.size,
          relFields: ['step', 'tplGen', 'tplParts', 'tplDiet', 'tplSize', 'lifespan'], rel: this.rel,
          fFields: ['rel', 'role', 'kids', 'age', 'cause', 'sex', 'kin', 'ateA', 'ateM', 'censored'],
          f: this.founders.map(f => [f.rel, f.role, f.kids, r1(f.age), f.cause, f.sex, f.kin, Math.round(f.ateA), r1(f.ateM), f.cens]),
        };
      },
    };
    return gd;
  }

  // ---------- reproduction tests ----------
  function compareLedger(fit, expect, run) {
    const fields = ['n', 'kids', 'age', 'ateA', 'ateM', 'eyeSum', 'parts'];
    const keys = new Set([...Object.keys(fit.bins), ...Object.keys(expect.bins || {})]);
    const diffs = [];
    for (const k of keys) for (const f of fields) {
      const a = fit.bins[k] ? fit.bins[k][f] : 0, b = expect.bins[k] ? expect.bins[k][f] : 0;
      if (a !== b) diffs.push([k, f, a, b]);
    }
    let individuals = 0;
    for (const k in fit.bins) individuals += fit.bins[k].n;
    const out = { diffs, individuals, stopStep: run.stopStep };
    if (expect.stopStep != null && run.stopStep !== expect.stopStep) diffs.push(['stopStep', '', run.stopStep, expect.stopStep]);
    if (expect.individuals != null && individuals !== expect.individuals) diffs.push(['individuals', '', individuals, expect.individuals]);
    for (const k in (expect.fin || {})) if (run.atStop.fin[k] !== expect.fin[k]) diffs.push(['fin', k, run.atStop.fin[k], expect.fin[k]]);
    out.pass = diffs.length === 0;
    return out;
  }

  // v1.42's seed 60606 ledger, stop checked every 3,600 steps: 67,490 individuals, stop at step 1,123,200
  async function acceptanceJob(study) {
    const ref = await (await fetch('/studies/eye-selection.json', { cache: 'no-store' })).json();
    const p = ref.raw.perSeed.find(x => x.seed === 60606);
    return {
      study: study || 'acceptance', label: 'v1.42 acceptance', kind: 'ledger', seed: 60606, world: 3, sw: {},
      stop: { maxGen: 400, every: 3600, capMin: 600 }, sampleEvery: 21600,
      expect: { bins: p.bins, individuals: 67490, stopStep: 1123200 },
    };
  }

  // ---------- the queue ----------
  const Q = { tab: '', jobs: [], i: -1, run: null, results: [], state: 'idle', port: null, error: null };

  async function post(kind, obj) {
    const body = ascii(JSON.stringify(obj)), crc = crcOf(body);
    for (let a = 0; a < 6; a++) {
      try {
        const r = await fetch('/__lab/' + kind + '?tab=' + encodeURIComponent(Q.tab) + '&crc=' + crc,
          { method: 'POST', body, headers: { 'Content-Type': 'text/plain' } });
        if (r.status === 204) return true;
      } catch (e) { /* retry */ }
      await new Promise(res => setTimeout(res, 2000 * (a + 1)));
    }
    return false;
  }

  const labelOf = j => j.label || [j.study, j.kind, Object.keys(j.sw || {}).filter(k => j.sw[k]).join('+') || 'base', j.seed].join('/');

  function beginJob(job) {
    if (!job.stop || !job.stop.every) throw new Error('job has no stop rule: ' + labelOf(job));
    newWorld(job.seed, job.world, job.sw);
    if (foodRate !== LAB.settings.foodRate || mutRate !== LAB.settings.mutRate) throw new Error('settings changed since the preflight');
    GD = job.kind === 'garden' ? makeGarden(job) : null;
    const t = performance.now();
    const run = { job, label: labelOf(job), t0: t, lastPost: t, lastStep: 0, samples: [], stop: null, stopStep: null,
      atStop: null, draining: false, drainSteps: 0, sps: 0 };
    if (job.sampleEvery) sample(run);
    return run;
  }

  // a short world outside any queue: does a switch change anything?
  function probe(seed, world, sw, steps) {
    if (Q.state === 'running') throw new Error('a queue is running in this tab');
    install(); GD = null;
    newWorld(seed, world, sw);
    runSteps(steps);
    let bodied = 0, parts = 0;
    for (const c of creatures) { const n = (c.sg || []).length; if (n) { bodied++; parts += n; } }
    const out = { sw, fp: fingerprint(), pop: creatures.length, bodied, parts, births, deaths, maxGen };
    setSwitches({});
    return out;
  }

  function sample(run) {
    let bodied = 0, eyed = 0;
    for (const c of creatures) {
      const sg = c.sg || []; if (!sg.length) continue;
      bodied++;
      let em = 0; for (const o of sg) if (o.eye > em) em = o.eye;
      if (em > 0.4) eyed++;
    }
    const row = [Math.round(simT / 60), maxGen, creatures.length, bodied, eyed];
    if (GD) row.push(GD.live);
    run.samples.push(row);
  }

  // called after every step; true when the run is over
  function afterStep(run) {
    const j = run.job, n = stepN;
    if (j.sampleEvery && n % j.sampleEvery === 0) sample(run);
    if (run.draining) { run.drainSteps++; return GD.live === 0 || run.drainSteps >= GD.cfg.drainMax; }
    if (GD) GD.afterStep(n);
    if (n % j.stop.every !== 0) return false;
    let why = null;
    if (maxGen >= j.stop.maxGen) why = 'gen';
    else if (simT / 60 >= j.stop.capMin) why = 'cap';
    else if (creatures.length === 0) why = 'ext';
    if (!why) return false;
    run.stop = why; run.stopStep = n;
    sample(run);
    run.atStop = { fin: { gen: maxGen, min: Math.round(simT / 60), pop: creatures.length, dKill, births, deaths },
      FIT: JSON.parse(JSON.stringify(window.__FIT)) };
    if (!GD) return true;
    GD.releasing = false; run.draining = true;
    return GD.live === 0;
  }

  function tick() {
    const run = Q.run;
    if (!run || Q.state !== 'running') return;
    try {
      const t0 = performance.now();
      while (performance.now() - t0 < 45) {
        if (paused !== true) throw new Error('the page unpaused itself');
        for (let i = 0; i < 60; i++) {
          const s0 = stepN;
          step(1 / 60);
          if (stepN !== s0 + 1) throw new Error('foreign steps: stepN jumped from ' + s0 + ' to ' + stepN);
          if (afterStep(run)) { finish(run); return; }
        }
      }
      const now = performance.now();
      if (now - run.lastPost > 60000) {
        run.sps = Math.round((stepN - run.lastStep) / ((now - run.lastPost) / 1000));
        run.lastPost = now; run.lastStep = stepN;
        post('progress', { study: run.job.study, tab: Q.tab, i: Q.i, n: Q.jobs.length, label: run.label, step: stepN,
          min: Math.round(simT / 60), gen: maxGen, pop: creatures.length, sps: run.sps, live: GD ? GD.live : null });
      }
      Q.port.postMessage(0);
    } catch (e) { fail(run, e); }
  }

  function finish(run) {
    if (GD) GD.censor();
    const rec = {
      lab: VERSION, study: run.job.study, tab: Q.tab, i: Q.i, n: Q.jobs.length, label: run.label, job: run.job,
      build: LAB.build, wallMs: Math.round(performance.now() - run.t0),
      stop: run.stop, stopStep: run.stopStep, endStep: stepN, fin: run.atStop.fin,
      s: run.samples, FIT: run.atStop.FIT, blockedCalls: G.blocked,
    };
    if (GD) { rec.garden = GD.export(); rec.garden.drainSteps = run.drainSteps; }
    if (run.job.expect) rec.accept = compareLedger(rec.FIT, run.job.expect, run);
    if (rec.job.expect) rec.job = Object.assign({}, rec.job, { expect: '(reference omitted)' });
    GD = null; Q.run = null;
    Q.results.push(rec);
    post('data', rec).then(ok => { rec.posted = ok; next(); });
  }

  function fail(run, e) {
    Q.state = 'error';
    Q.error = { label: run && run.label, message: String(e && e.message || e), stack: String(e && e.stack || ''), step: stepN };
    GD = null; Q.run = null;
    post('error', Object.assign({ tab: Q.tab, i: Q.i }, Q.error));
  }

  function next() {
    if (Q.state !== 'running') return;
    Q.i++;
    if (Q.i >= Q.jobs.length) {
      Q.state = 'done';
      post('complete', { tab: Q.tab, n: Q.jobs.length, posted: Q.results.filter(r => r.posted).length });
      return;
    }
    try { Q.run = beginJob(Q.jobs[Q.i]); Q.port.postMessage(0); }
    catch (e) { fail({ label: labelOf(Q.jobs[Q.i]) }, e); }
  }

  function queue(tab, jobs) {
    if (!LAB.ready) throw new Error('the preflight has not passed in this tab');
    if (Q.state === 'running') throw new Error('a queue is already running');
    Object.assign(Q, { tab, jobs, i: -1, run: null, results: [], state: 'running', error: null });
    const ch = new MessageChannel();
    ch.port1.onmessage = tick; Q.port = ch.port2;
    post('armed', { tab, n: jobs.length, study: jobs.length ? jobs[0].study : '', labels: jobs.map(labelOf),
      build: LAB.build, preflight: LAB.preflightResult });
    next();
    return jobs.map(labelOf);
  }

  // every combination of the named switches, for every seed
  function factorial(base, names, seeds) {
    const out = [];
    for (let m = 0; m < (1 << names.length); m++) {
      for (const seed of seeds) {
        const sw = Object.assign({}, base.sw || {});
        names.forEach((k, b) => { sw[k] = (m >> b) & 1; });
        out.push(Object.assign({}, base, { sw, seed }));
      }
    }
    return out;
  }

  // deal jobs across tabs so every tab holds a mix of arms
  function deal(jobs, tabs) {
    const out = {}; tabs.forEach(t => { out[t] = []; });
    jobs.forEach((j, i) => out[tabs[i % tabs.length]].push(j));
    return out;
  }

  function status() {
    const run = Q.run;
    return {
      version: VERSION, ready: LAB.ready, state: Q.state, tab: Q.tab, job: Q.i + 1, of: Q.jobs.length,
      label: run && run.label, step: stepN, min: Math.round(simT / 60), gen: maxGen, pop: creatures.length,
      sps: run && run.sps, live: GD ? GD.live : null, done: Q.results.length,
      unposted: Q.results.filter(r => !r.posted).length, error: Q.error,
    };
  }

  Object.assign(LAB, {
    install, preflight, queue, status, probe, factorial, deal, acceptanceJob,
    results: () => Q.results,
    resend: i => post('data', Q.results[i]).then(ok => { Q.results[i].posted = ok; return ok; }),
    stop: () => { Q.state = 'stopped'; GD = null; Q.run = null; },
    TREATMENTS,
  });
})();
