# The boards

A tiny Cloudflare Worker + D1 database serving four leaderboards for Primordial Soup: the daily dish, longest lived dish, deepest generation, and longest dynasty.

Design principles, matching the game's:

- **No accounts, no personal data.** Identity is a dish callsign (SOUP-XXXX-XX). A dish binds to a random secret token on first submit; only the same client can update it.
- **Cheat resistant by construction.** Simulated age is checked against the wall clock (a dish cannot claim more years than real time allows at maximum speed). The daily board only accepts today's shared world. Score submissions carry the dish seed, and because worlds are deterministic, any entry can in principle be re-run and verified from seed plus intervention log; storage for that is in place, the verifier is future work.
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
