// Dashboard: fetches /api/stats (cookie-authenticated) and draws SVG. No libraries, no third-party requests.
(() => {
  'use strict';
  const W = window.WORLD;
  const $ = (q) => document.querySelector(q);
  const nf = new Intl.NumberFormat('en-US');
  const regions = new Intl.DisplayNames(['en'], { type: 'region' });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const country = (c) => { if (c === 'XX') return 'Unknown'; try { return regions.of(c) || c; } catch { return c; } };
  const dayLabel = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const niceMax = (v) => { const p = 10 ** Math.floor(Math.log10(v)); const f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; };

  // Natural Earth, same formula and constants the map outline was generated with.
  const rad = Math.PI / 180;
  function project(lon, lat) {
    const l = lon * rad, p = lat * rad, p2 = p * p, p4 = p2 * p2;
    const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
    const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
    return [W.tx + W.k * x, W.ty - W.k * y];
  }

  function kpis(d) {
    const k = (label, v) => `<div class="kpi"><span class="label">${label}</span><span class="num">${nf.format(v)}</span></div>`;
    $('#kpis').innerHTML = k('Views', d.totals.views) + k('Visitor-days', d.totals.uniques) +
      k('Countries', d.countries.filter((c) => c.country !== 'XX').length) + k('Cities', d.places.length);
  }

  function chart(d) {
    const s = d.series, n = s.length, host = $('#chart');
    if (!d.totals.views) { host.innerHTML = '<p class="empty">No visits recorded in this range yet.</p>'; return; }
    const Wd = 900, Ht = 300, L = 44, R = 70, T = 16, B = 32;
    const top = niceMax(Math.max(...s.map((r) => r.views)));
    const x = (i) => L + (n < 2 ? (Wd - L - R) / 2 : (i * (Wd - L - R)) / (n - 1));
    const y = (v) => T + (1 - v / top) * (Ht - T - B);
    const pts = (k) => s.map((r, i) => `${x(i).toFixed(1)},${y(r[k]).toFixed(1)}`).join(' ');
    const base = y(0).toFixed(1), last = s[n - 1];
    const yt = [0, top / 2, top].map((v) => `<text class="ax" x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${nf.format(v)}</text>`).join('');
    const idx = [...new Set([0, Math.floor((n - 1) / 2), n - 1])];
    const xt = idx.map((i) => `<text class="ax" x="${x(i).toFixed(1)}" y="${Ht - 8}" text-anchor="${i === 0 && n > 1 ? 'start' : i === n - 1 && n > 1 ? 'end' : 'middle'}">${dayLabel(s[i].day)}</text>`).join('');
    const nudge = Math.abs(y(last.views) - y(last.uniques)) < 14 ? 14 : 0;
    host.innerHTML = `<svg viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="Views and visitors per day, ${esc(dayLabel(s[0].day))} to ${esc(dayLabel(last.day))}">
<line class="base" x1="${L}" x2="${Wd - R}" y1="${base}" y2="${base}"/>${yt}${xt}
<polygon class="area" points="${x(0).toFixed(1)},${base} ${pts('views')} ${x(n - 1).toFixed(1)},${base}"/>
<polyline class="views" points="${pts('views')}"/><polyline class="uniq" points="${pts('uniques')}"/>
<text class="end views-t" x="${(x(n - 1) + 8).toFixed(1)}" y="${(y(last.views) + 4).toFixed(1)}">views</text>
<text class="end" x="${(x(n - 1) + 8).toFixed(1)}" y="${(y(last.uniques) + 4 + nudge).toFixed(1)}">visitors</text>
<line id="cur" class="cur" x1="0" x2="0" y1="${T}" y2="${base}"/>
<rect class="hit" x="${L}" y="${T}" width="${Wd - L - R}" height="${Ht - T - B}"/></svg><div id="tip" class="tip" hidden></div>`;
    const svg = host.querySelector('svg'), cur = host.querySelector('#cur'), tip = host.querySelector('#tip'), hit = host.querySelector('.hit');
    hit.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * Wd;
      const i = n < 2 ? 0 : Math.max(0, Math.min(n - 1, Math.round(((px - L) / (Wd - L - R)) * (n - 1))));
      cur.setAttribute('x1', x(i)); cur.setAttribute('x2', x(i)); cur.classList.add('on');
      tip.hidden = false;
      tip.innerHTML = `<span class="label">${dayLabel(s[i].day)}</span> ${nf.format(s[i].views)} views · ${nf.format(s[i].uniques)} visitors`;
      tip.style.left = `${(x(i) / Wd) * r.width}px`;
    });
    hit.addEventListener('pointerleave', () => { cur.classList.remove('on'); tip.hidden = true; });
  }

  function map(d) {
    const dots = d.places.filter((p) => p.lat != null && p.lon != null);
    const max = Math.max(1, ...dots.map((p) => p.views));
    const circles = dots.map((p) => {
      const [cx, cy] = project(p.lon, p.lat), r = 3 + 12 * Math.sqrt(p.views / max);
      return `<circle class="dot" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"><title>${esc(p.city)}, ${esc(country(p.country))}: ${nf.format(p.views)} views, ${nf.format(p.uniques)} visitors</title></circle>`;
    }).join('');
    $('#map').innerHTML = `<svg viewBox="0 0 ${W.w} ${W.h}" role="img" aria-label="Map of where visitors are from"><path class="land" d="${W.d}"/>${circles}</svg>`;
  }

  function rank(sel, rows, name) {
    const max = Math.max(1, ...rows.map((r) => r.views));
    $(sel).innerHTML = rows.length
      ? rows.slice(0, 12).map((r) => `<li><span>${esc(name(r))}</span><span class="num">${nf.format(r.views)}</span><span class="bar-fill" data-w="${((r.views / max) * 100).toFixed(1)}"></span></li>`).join('')
      : '<li class="empty">Nothing yet.</li>';
    // Widths are set through the style API: the page's CSP forbids inline style attributes.
    $(sel).querySelectorAll('[data-w]').forEach((e) => e.style.setProperty('--w', e.dataset.w + '%'));
  }

  function table(d) {
    $('#table tbody').innerHTML = [...d.series].reverse().map((r) => `<tr><td>${r.day}</td><td>${r.views}</td><td>${r.uniques}</td></tr>`).join('');
  }

  async function load(days) {
    const res = await fetch(`/api/stats?days=${days}`, { credentials: 'same-origin' });
    if (res.status === 401) { location.href = '/login'; return; }
    const d = await res.json();
    kpis(d); chart(d); map(d); table(d);
    rank('#countries', d.countries, (r) => country(r.country));
    rank('#cities', d.places, (r) => `${r.city}, ${r.country}`);
  }

  document.querySelectorAll('#range button').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('#range button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      load(Number(b.dataset.days));
    }),
  );
  load(30);
})();
