-- Primordial Soup leaderboard schema (D1 / SQLite)
CREATE TABLE IF NOT EXISTS entries(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board TEXT NOT NULL,             -- daily | age | gen | dynasty
  day TEXT,                        -- YYYY-MM-DD for the daily board, '' otherwise
  callsign TEXT NOT NULL,          -- SOUP-XXXX-XX, no personal data ever
  dish TEXT NOT NULL,
  tokenhash TEXT NOT NULL,         -- binds a dish to its first submitter
  score REAL NOT NULL,
  label TEXT NOT NULL,             -- human readable score, e.g. "gen 14 · peak 213"
  stats TEXT NOT NULL,             -- JSON snapshot
  seed INTEGER,
  scenario TEXT,
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL,
  UNIQUE(board, day, dish)
);
CREATE INDEX IF NOT EXISTS idx_board ON entries(board, day, score DESC);

CREATE TABLE IF NOT EXISTS dishes(
  dish TEXT PRIMARY KEY,
  tokenhash TEXT NOT NULL,
  firstseen INTEGER NOT NULL,
  lastseen INTEGER NOT NULL,
  submits INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ips(
  iphash TEXT NOT NULL,
  day TEXT NOT NULL,
  submits INTEGER NOT NULL DEFAULT 0,
  dishes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(iphash, day)
);
