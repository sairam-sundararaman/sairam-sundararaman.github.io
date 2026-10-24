-- Daily aggregates only. No IP addresses, no per-visit rows, no cookies.
CREATE TABLE IF NOT EXISTS agg (
  day     TEXT    NOT NULL,              -- UTC date, YYYY-MM-DD
  path    TEXT    NOT NULL,
  country TEXT    NOT NULL,              -- ISO 3166-1 alpha-2, 'XX' when unknown
  city    TEXT    NOT NULL DEFAULT '',
  lat     REAL,                          -- rounded to 0.1 degree (~11 km)
  lon     REAL,
  views   INTEGER NOT NULL DEFAULT 0,
  uniques INTEGER NOT NULL DEFAULT 0,    -- visitors first seen that day (visitor-days)
  PRIMARY KEY (day, path, country, city)
) WITHOUT ROWID;

-- Lets a visitor count once per day. Rows for past days are deleted automatically.
CREATE TABLE IF NOT EXISTS seen (
  day TEXT NOT NULL,
  vid TEXT NOT NULL,
  PRIMARY KEY (day, vid)
) WITHOUT ROWID;

-- Today's random salt. Past salts are deleted, so an old hash can never be re-derived from an IP.
CREATE TABLE IF NOT EXISTS salt (
  day  TEXT PRIMARY KEY,
  salt TEXT NOT NULL
) WITHOUT ROWID;

-- Login throttle: failed attempts per hashed IP per 15-minute window.
CREATE TABLE IF NOT EXISTS auth_fail (
  k   TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  n   INTEGER NOT NULL
) WITHOUT ROWID;
