// Primordial Soup leaderboard worker
// Boards: daily (shared seed score), age (years lived), gen (deepest generation), dynasty (heirloom chain)
// Identity is a dish callsign only: no accounts, no personal data.
// A dish binds to a secret token on first submit; later submits must present the same token.
// Age plausibility: a dish cannot claim more simulated years than real elapsed time allows.

const BOARDS = ['daily', 'age', 'gen', 'dynasty'];
const MAX_BODY = 16 * 1024;
const SPEED_CEIL = 5;           // max sim speed is 4x, allow slack for catch up bursts
const CATCHUP_GRACE_YEARS = 3;  // one catch up window is capped, this is generous
const SEASON_SECONDS = 240;     // one dish year

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function utcDay(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

function validCallsign(t) {
  return typeof t === 'string' && /^SOUP-[A-Z0-9]{2,6}-[A-Z0-9]{2,4}$/.test(t);
}

function scoreFor(board, s) {
  if (board === 'daily' || board === 'gen') {
    const gen = Math.max(1, Math.min(9999, s.gen | 0));
    const peak = Math.max(0, Math.min(99999, s.peakPop | 0));
    return { score: gen * 100000 + peak, label: 'gen ' + gen + ' · peak ' + peak };
  }
  if (board === 'age') {
    const years = Math.max(0, Math.min(100000, +s.years || 0));
    return { score: years, label: 'year ' + Math.floor(years) };
  }
  if (board === 'dynasty') {
    const dyn = Math.max(1, Math.min(999, s.dynasty | 0));
    const gen = Math.max(1, Math.min(9999, s.gen | 0));
    return { score: dyn * 10000 + gen, label: 'dynasty ' + dyn + ' · gen ' + gen };
  }
  return null;
}

async function handleSubmit(req, env) {
  if ((req.headers.get('content-length') | 0) > MAX_BODY) return json({ error: 'too large' }, 413);
  let raw;
  try { raw = await req.text(); } catch (e) { return json({ error: 'bad json' }, 400); }
  if (raw.length > MAX_BODY) return json({ error: 'too large' }, 413);
  let b;
  try { b = JSON.parse(raw); } catch (e) { return json({ error: 'bad json' }, 400); }
  if (typeof b !== 'object' || b === null) return json({ error: 'bad json' }, 400);

  const { callsign, dish, token, stats } = b;
  const boards = Array.isArray(b.boards) ? b.boards : [b.board];
  if (!boards.length || boards.length > 4 || !boards.every(x => BOARDS.includes(x))) {
    return json({ error: 'unknown board' }, 400);
  }
  if (!validCallsign(callsign) || !validCallsign(dish)) return json({ error: 'bad callsign' }, 400);
  if (typeof token !== 'string' || token.length < 16 || token.length > 80) return json({ error: 'bad token' }, 400);
  if (!stats || typeof stats !== 'object') return json({ error: 'no stats' }, 400);

  const now = Date.now();
  const tokenhash = await sha256(token);

  // dish identity: first submitter binds the token
  const drow = await env.DB.prepare('SELECT tokenhash, firstseen, submits FROM dishes WHERE dish=?1').bind(dish).first();
  if (drow && drow.tokenhash !== tokenhash) return json({ error: 'dish belongs to another player' }, 403);
  if (drow && drow.submits > 2000) return json({ error: 'rate limit' }, 429);
  const firstseen = drow ? drow.firstseen : now;

  // per IP limit: guard against mass dish creation and flooding
  const iphash = await sha256(req.headers.get('CF-Connecting-IP') || 'unknown');
  const ipRow = await env.DB.prepare(
    'INSERT INTO ips(iphash, day, submits, dishes) VALUES(?1, ?2, 1, ?3) ' +
    'ON CONFLICT(iphash, day) DO UPDATE SET submits=submits+1, dishes=dishes+?3 ' +
    'RETURNING submits, dishes'
  ).bind(iphash, utcDay(now), drow ? 0 : 1).first();
  if (ipRow && (ipRow.submits > 300 || ipRow.dishes > 40)) return json({ error: 'rate limit' }, 429);

  // rate limit: at most one submit per dish per 30 seconds
  const recent = await env.DB.prepare('SELECT lastseen FROM dishes WHERE dish=?1 AND lastseen>?2').bind(dish, now - 30000).first();
  if (recent) return json({ error: 'slow down' }, 429);

  // age plausibility: sim years cannot outrun the wall clock
  const years = Math.max(0, +stats.years || 0);
  const elapsedYears = ((now - firstseen) / 1000) * SPEED_CEIL / SEASON_SECONDS + CATCHUP_GRACE_YEARS;
  if (years > elapsedYears) return json({ error: 'implausible age; the dish is younger than that' }, 422);
  if ((stats.gen | 0) > elapsedYears * 25 + 30) return json({ error: 'implausible generation; too many births for the time elapsed' }, 422);
  if ((stats.dynasty | 0) > elapsedYears + 2) return json({ error: 'implausible dynasty; too many heirs for the time elapsed' }, 422);
  if ((stats.peakPop | 0) > 2500) return json({ error: 'implausible peak population; past the physical ceiling' }, 422);

  const statsJson = JSON.stringify(stats).slice(0, 4000);
  await env.DB.prepare(
    'INSERT INTO dishes(dish, tokenhash, firstseen, lastseen, submits) VALUES(?1, ?2, ?3, ?3, 1) ' +
    'ON CONFLICT(dish) DO UPDATE SET lastseen=?3, submits=submits+1'
  ).bind(dish, tokenhash, now).run();

  const results = [];
  for (const board of boards) {
    let day = '';
    if (board === 'daily') {
      day = utcDay(now);
      if (stats.dishTag !== day && stats.dishTag !== utcDay(now - 86400000)) {
        results.push({ board, error: 'not today' });
        continue;
      }
      day = stats.dishTag;
    }
    const sc = scoreFor(board, stats);
    if (!sc) { results.push({ board, error: 'bad stats' }); continue; }
    await env.DB.prepare(
      'INSERT INTO entries(board, day, callsign, dish, tokenhash, score, label, stats, seed, scenario, created, updated) ' +
      'VALUES(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?11) ' +
      'ON CONFLICT(board, day, dish) DO UPDATE SET ' +
      'score=CASE WHEN excluded.score>score THEN excluded.score ELSE score END, ' +
      'label=CASE WHEN excluded.score>score THEN excluded.label ELSE label END, ' +
      'stats=CASE WHEN excluded.score>score THEN excluded.stats ELSE stats END, ' +
      'updated=?11'
    ).bind(board, day, callsign, dish, tokenhash, sc.score, sc.label,
           statsJson, (b.seed | 0) || null, ('' + (b.scenario || '')).slice(0, 12), now).run();
    const rank = await env.DB.prepare(
      'SELECT COUNT(*) AS n FROM entries WHERE board=?1 AND day=?2 AND score>?3'
    ).bind(board, day, sc.score).first();
    results.push({ board, rank: (rank.n | 0) + 1, label: sc.label });
  }
  return json({ ok: true, results });
}

async function handleBoard(url, env) {
  const board = url.searchParams.get('b');
  if (!BOARDS.includes(board)) return json({ error: 'unknown board' }, 400);
  const day = board === 'daily' ? (url.searchParams.get('day') || utcDay(Date.now())) : '';
  const limit = Math.min(50, Math.max(1, url.searchParams.get('limit') | 0 || 20));
  const rows = await env.DB.prepare(
    'SELECT callsign, dish, label, score, stats, updated FROM entries ' +
    'WHERE board=?1 AND day=?2 ORDER BY score DESC, updated ASC LIMIT ?3'
  ).bind(board, day, limit).all();
  return json({ board, day, entries: rows.results || [] });
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    try {
      if (url.pathname === '/submit' && req.method === 'POST') return await handleSubmit(req, env);
      if (url.pathname === '/board' && req.method === 'GET') return await handleBoard(url, env);
      if (url.pathname === '/health') return json({ ok: true, boards: BOARDS });
    } catch (e) {
      return json({ error: 'server error' }, 500);
    }
    return json({ error: 'not found' }, 404);
  },
};
