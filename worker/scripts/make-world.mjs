// Generates public/world.js: a Natural Earth country outline (Natural Earth 110m via world-atlas, public domain),
// antimeridian-clipped by d3-geo, plus the constants the dashboard uses to place city dots. Run: `npm run world`.
import fs from 'node:fs';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';

const topo = JSON.parse(fs.readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url), 'utf8'));
const fc = { type: 'FeatureCollection', features: feature(topo, topo.objects.countries).features.filter((f) => f.id !== '010') }; // no Antarctica

const proj = geoNaturalEarth1().fitWidth(1000, fc);
const path = geoPath(proj).digits(1);
const [[, , ], [, y1]] = path.bounds(fc);
const [tx, ty] = proj.translate();
const world = { d: path(fc), w: 1000, h: Math.ceil(y1), k: +proj.scale().toFixed(4), tx: +tx.toFixed(4), ty: +ty.toFixed(4) };
const out = `window.WORLD=${JSON.stringify(world)};\n`;
fs.writeFileSync(new URL('../public/world.js', import.meta.url), out);
console.log('world.js', (out.length / 1024).toFixed(1) + ' KB', `viewBox 1000x${world.h}`, `k=${world.k} t=[${world.tx}, ${world.ty}]`);
