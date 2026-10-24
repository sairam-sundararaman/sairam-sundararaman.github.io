// ma-stats: a private, cookieless visit counter for one static site.
//   POST /collect    page-view beacon from the site (path only; geo comes from Cloudflare's request metadata)
//   GET  /           dashboard (login required)
//   GET  /api/stats  dashboard data (login required)
//   POST /login, /logout
// Stored: daily aggregates only (views, visitors-per-day, country + city). No IPs, no per-visit rows, no cookies for visitors.
import { MARK_H, MARK_PATH, MARK_W } from './mark';

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
  DASH_PASSWORD: string;
  SESSION_SECRET: string;
}

const enc = new TextEncoder();
const SESSION_SECONDS = 7 * 24 * 3600;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILS = 8;
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python-requests|go-http-client|httpclient|monitor|uptime/i;

// ---------- small helpers ----------
const toHex = (u: Uint8Array) => Array.from(u, (b) => b.toString(16).padStart(2, '0')).join('');
const randomHex = (bytes: number) => toHex(crypto.getRandomValues(new Uint8Array(bytes)));
const sha256 = async (s: string) => toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s))));
async function hmac(key: string, msg: string) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(msg))));
}
const safeEqual = (a: string, b: string) => a.length === b.length && crypto.subtle.timingSafeEqual(enc.encode(a), enc.encode(b));
const dayOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const SECURE_HEADERS = {
  'Content-Security-Policy':
    "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
};
const html = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURE_HEADERS } });
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...SECURE_HEADERS } });
const redirect = (to: string, extra: Record<string, string> = {}) =>
  new Response(null, { status: 303, headers: { Location: to, 'Cache-Control': 'no-store', ...extra } });

// ---------- visitor counting ----------
let saltCache: { day: string; salt: string } | undefined;

/** Today's random salt. Creating a new day's salt also deletes everything that could identify yesterday's visitors. */
async function dailySalt(env: Env, day: string): Promise<string> {
  if (saltCache?.day === day) return saltCache.salt;
  await env.DB.prepare('INSERT OR IGNORE INTO salt(day, salt) VALUES(?1, ?2)').bind(day, randomHex(16)).run();
  const row = await env.DB.prepare('SELECT salt FROM salt WHERE day = ?1').bind(day).first<{ salt: string }>();
  const salt = row?.salt ?? randomHex(16);
  saltCache = { day, salt };
  await env.DB.batch([
    env.DB.prepare('DELETE FROM salt WHERE day < ?1').bind(day),
    env.DB.prepare('DELETE FROM seen WHERE day < ?1').bind(day),
    env.DB.prepare('DELETE FROM auth_fail WHERE day < ?1').bind(day),
  ]);
  return salt;
}

function cleanPath(p: unknown): string {
  if (typeof p !== 'string') return '/other';
  let s = p.split(/[?#]/)[0] ?? '';
  if (!/^\/[A-Za-z0-9\-_./]{0,120}$/.test(s)) return '/other';
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

async function record(env: Env, req: Request, path: string) {
  const cf = (req as Request & { cf?: IncomingRequestCfProperties }).cf;
  const country = (cf?.country as string | undefined) || 'XX';
  const city = ((cf?.city as string | undefined) ?? '').slice(0, 80);
  const coord = (v: unknown) => (city && v != null && v !== '' ? Math.round(parseFloat(String(v)) * 10) / 10 : null);
  const lat = coord(cf?.latitude);
  const lon = coord(cf?.longitude);
  const day = dayOf(Date.now());
  const ua = req.headers.get('User-Agent') ?? '';
  const ip = req.headers.get('CF-Connecting-IP') ?? '';
  const salt = await dailySalt(env, day);
  const vid = (await sha256(`${salt}|${ip}|${ua}`)).slice(0, 24); // never stored with the IP or UA, and the salt is deleted tomorrow
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO agg(day, path, country, city, lat, lon, views, uniques)
       VALUES(?1, ?2, ?3, ?4, ?5, ?6, 1, CASE WHEN EXISTS(SELECT 1 FROM seen WHERE day = ?1 AND vid = ?7) THEN 0 ELSE 1 END)
       ON CONFLICT(day, path, country, city) DO UPDATE SET views = views + 1, uniques = uniques + excluded.uniques`,
    ).bind(day, path, country, city, lat, lon, vid),
    env.DB.prepare('INSERT OR IGNORE INTO seen(day, vid) VALUES(?1, ?2)').bind(day, vid),
  ]);
}

async function collect(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const done = () => new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN, Vary: 'Origin' } });
  if (req.headers.get('Origin') !== env.ALLOWED_ORIGIN) return new Response(null, { status: 204, headers: { 'X-Ma': 'ignored-origin' } });
  if (req.headers.get('DNT') === '1' || req.headers.get('Sec-GPC') === '1') return done();
  const ua = req.headers.get('User-Agent') ?? '';
  if (!ua || BOT.test(ua)) return done();
  let body: { p?: unknown };
  try {
    const text = await req.text();
    if (text.length > 512) return done();
    body = JSON.parse(text);
  } catch {
    return done();
  }
  ctx.waitUntil(record(env, req, cleanPath(body?.p)).catch((e) => console.error('record failed', e)));
  return done();
}

// ---------- dashboard data ----------
const clampDays = (v: string | null) => Math.min(365, Math.max(1, parseInt(v ?? '30', 10) || 30));

async function stats(env: Env, days: number) {
  const since = dayOf(Date.now() - (days - 1) * 86_400_000);
  const [daily, places, countries] = await env.DB.batch<Record<string, number | string | null>>([
    env.DB.prepare('SELECT day, SUM(views) AS views, SUM(uniques) AS uniques FROM agg WHERE day >= ?1 GROUP BY day').bind(since),
    env.DB.prepare(
      `SELECT country, city, MAX(lat) AS lat, MAX(lon) AS lon, SUM(views) AS views, SUM(uniques) AS uniques
       FROM agg WHERE day >= ?1 AND city <> '' GROUP BY country, city ORDER BY views DESC LIMIT 400`,
    ).bind(since),
    env.DB.prepare('SELECT country, SUM(views) AS views, SUM(uniques) AS uniques FROM agg WHERE day >= ?1 GROUP BY country ORDER BY views DESC LIMIT 100').bind(since),
  ]);
  const byDay = new Map((daily?.results ?? []).map((r) => [String(r.day), r]));
  const series: { day: string; views: number; uniques: number }[] = [];
  for (let i = 0; i < days; i++) {
    const day = dayOf(Date.now() - (days - 1 - i) * 86_400_000);
    const r = byDay.get(day);
    series.push({ day, views: Number(r?.views ?? 0), uniques: Number(r?.uniques ?? 0) });
  }
  return {
    since,
    days,
    series,
    totals: { views: series.reduce((a, r) => a + r.views, 0), uniques: series.reduce((a, r) => a + r.uniques, 0) },
    places: places?.results ?? [],
    countries: countries?.results ?? [],
  };
}

// ---------- login ----------
async function authed(req: Request, env: Env): Promise<boolean> {
  const m = /(?:^|;\s*)ma_session=(\d+)\.([0-9a-f]{64})/.exec(req.headers.get('Cookie') ?? '');
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  return safeEqual(m[2]!, await hmac(env.SESSION_SECRET, m[1]!));
}

async function login(req: Request, env: Env): Promise<Response> {
  const now = Date.now();
  const ip = req.headers.get('CF-Connecting-IP') ?? 'local';
  const key = `${Math.floor(now / LOGIN_WINDOW_MS)}:${(await sha256(ip + env.SESSION_SECRET)).slice(0, 16)}`;
  const row = await env.DB.prepare('SELECT n FROM auth_fail WHERE k = ?1').bind(key).first<{ n: number }>();
  if ((row?.n ?? 0) >= MAX_LOGIN_FAILS) return html(loginPage('Too many attempts. Try again later.'), 429);
  let pw = '';
  try {
    pw = String((await req.formData()).get('password') ?? '');
  } catch {
    /* empty password */
  }
  if (!safeEqual(await sha256(pw), await sha256(env.DASH_PASSWORD))) {
    await env.DB.prepare('INSERT INTO auth_fail(k, day, n) VALUES(?1, ?2, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1').bind(key, dayOf(now)).run();
    return html(loginPage('Not that one.'), 401);
  }
  const exp = String(Math.floor(now / 1000) + SESSION_SECONDS);
  const cookie = `ma_session=${exp}.${await hmac(env.SESSION_SECRET, exp)}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Strict`;
  return redirect('/', { 'Set-Cookie': cookie });
}

// ---------- pages ----------
const mark = `<svg class="mark" viewBox="0 0 ${MARK_W} ${MARK_H}" fill="currentColor" aria-hidden="true"><path d="${MARK_PATH}"/></svg>`;
const shell = (title: string, body: string) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="color-scheme" content="light dark"><title>${title}</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/dash.css"></head><body>${body}</body></html>`;

const loginPage = (error = '') =>
  shell(
    'Stats · sign in',
    `<main class="login">${mark}<form method="post" action="/login"><label class="label" for="pw">Password</label><input id="pw" name="password" type="password" autocomplete="current-password" autofocus required><button type="submit">Enter</button>${
      error ? `<p class="err" role="alert">${esc(error)}</p>` : ''
    }</form></main>`,
  );

const dashPage = () =>
  shell(
    'Stats',
    `<header class="bar wrap"><a class="brand" href="/">${mark}<span>Stats</span></a>
<nav class="label"><span id="range" role="group" aria-label="Range"><button data-days="7">7d</button><button data-days="30" aria-pressed="true">30d</button><button data-days="90">90d</button><button data-days="365">1y</button></span>
<form method="post" action="/logout"><button type="submit" class="plain">Sign out</button></form></nav></header>
<main class="wrap">
<section id="kpis" class="kpis" aria-label="Totals"></section>
<div class="grid">
<section><h2 class="label">Views and visitors per day</h2><div id="chart" class="chart"></div>
<details class="data"><summary class="label">Data</summary><table id="table"><thead><tr><th>Day (UTC)</th><th>Views</th><th>Visitors</th></tr></thead><tbody></tbody></table></details></section>
<section><h2 class="label">Countries</h2><ol id="countries" class="rank"></ol></section>
<section><h2 class="label">Where from</h2><div id="map" class="map"></div></section>
<section><h2 class="label">Cities</h2><ol id="cities" class="rank"></ol></section>
</div>
<p class="note label">Daily aggregates in UTC. A visitor counts once per day, so longer ranges add up visitor-days. No IP addresses or cookies are stored.</p>
</main>
<script src="/world.js"></script><script src="/dash.js"></script>`,
  );

// ---------- router ----------
export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname, searchParams } = new URL(req.url);

    if (pathname === '/collect') {
      if (req.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: { 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' },
        });
      }
      return req.method === 'POST' ? collect(req, env, ctx) : new Response(null, { status: 405 });
    }
    if (pathname === '/login') {
      if (req.method === 'POST') return login(req, env);
      return (await authed(req, env)) ? redirect('/') : html(loginPage());
    }
    if (pathname === '/logout' && req.method === 'POST') {
      return redirect('/login', { 'Set-Cookie': 'ma_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict' });
    }
    if (pathname === '/api/stats' && req.method === 'GET') {
      if (!(await authed(req, env))) return json({ error: 'unauthorized' }, 401);
      return json(await stats(env, clampDays(searchParams.get('days'))));
    }
    if (pathname === '/' && req.method === 'GET') {
      return (await authed(req, env)) ? html(dashPage()) : redirect('/login');
    }
    return new Response('Not found', { status: 404, headers: SECURE_HEADERS });
  },
} satisfies ExportedHandler<Env>;
