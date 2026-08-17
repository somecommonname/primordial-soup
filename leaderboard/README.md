# The boards

A tiny Cloudflare Worker + D1 database serving four leaderboards for Primordial Soup: the daily dish, longest lived dish, deepest generation, and longest dynasty.

Design principles, matching the game's:

- **No accounts, no personal data.** Identity is a dish callsign (SOUP-XXXX-XX). A dish binds to a random secret token on first submit; only the same client can update it.
- **Cheat resistant by construction.** Simulated age, generation, dynasty depth, and peak population are all checked against the wall clock or a hard ceiling (a dish cannot claim more years, generations, or heirs than real time allows at maximum speed, and peak population has a flat ceiling regardless of time). The daily board only accepts today's shared world. Score submissions carry the dish seed, and because worlds are deterministic, any entry can in principle be re-run and verified from seed plus intervention log; storage for that is in place, the verifier is future work. See SECURITY.md finding H2 for the details, fixed 2026-08-17.
- **One file.** The whole backend is worker.js.

## Local development (no account needed)

```bash
cd leaderboard
npx wrangler d1 execute soup-boards --local --file=schema.sql
npx wrangler dev --local
```

## Deploy (needs the Cloudflare account owner once)

```bash
npx wrangler login                    # owner approves in browser
npx wrangler d1 create soup-boards    # paste the id into wrangler.toml
npx wrangler d1 execute soup-boards --remote --file=schema.sql
npx wrangler deploy
```

Then set `BOARDS_URL` in index.html to the deployed worker URL and the 🌐 boards panel comes alive.

## API

- `POST /submit` `{board, callsign, dish, token, seed, scenario, stats}` where stats carries `{years, gen, peakPop, dynasty, dishTag}`. Returns `{ok, rank, label}`.
- `GET /board?b=daily|age|gen|dynasty&day=YYYY-MM-DD&limit=20` returns `{entries:[{callsign, label, score, updated}]}`.
- `GET /health`

## Security

A security review was done on 2026-08-17 in two rounds: read only on index.html at first, since another agent was editing it, then with fixes applied there once that agent finished. Six of eight findings are now fixed, including the dish seed sharing token leak in index.html and the missing plausibility checks on generation, dynasty, and peak population in worker.js. Two findings remain open. Full write up in SECURITY.md.
