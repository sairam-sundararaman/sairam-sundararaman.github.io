import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const file = (rel: string) => fs.readFileSync(path.join(process.cwd(), 'node_modules', rel));
const MARK_PATH = 'M706.7 896.6Q695.7 861.6 683.2 842.1Q670.7 822.6 649.2 812.6Q627.7 802.6 588.7 798.6Q584.7 793.6 586.2 787.6Q587.7 781.6 591.7 778.6Q600.7 778.6 622.7 779.6Q644.7 780.6 670.2 781.6Q695.7 782.6 711.7 782.6Q736.7 782.6 736.7 758.6V313.6H540.7V330.6Q540.7 338.6 523.7 346.1Q506.7 353.6 483.7 353.6Q465.7 353.6 465.7 338.6Q465.7 333.6 466.2 310.6Q466.7 287.6 467.2 253.6Q467.7 219.6 468.2 181.1Q468.7 142.6 468.7 107.6Q468.7 34.6 460.7 14.6Q457.7 7.6 461.7 3.6Q466.7 -0.4 472.7 2.6Q484.7 7.6 510.2 20.1Q535.7 32.6 551.7 40.6H719.7Q728.7 40.6 730.7 35.6Q734.7 30.6 742.2 20.6Q749.7 10.6 753.7 4.6Q760.7 -3.4 770.7 2.6Q777.7 6.6 791.7 15.6Q805.7 24.6 820.2 33.6Q834.7 42.6 841.7 47.6Q849.7 52.6 848.7 59.6Q847.7 66.6 839.7 71.6Q835.7 73.6 830.2 76.6Q824.7 79.6 819.7 82.6Q812.7 86.6 810.7 92.6Q808.7 98.6 808.7 108.6V283.6Q808.7 415.6 810.7 521.6Q812.7 627.6 815.2 693.6Q817.7 759.6 817.7 773.6Q817.7 798.6 809.7 821.6Q801.7 844.6 778.2 864.1Q754.7 883.6 706.7 896.6ZM23.7 896.6Q1.7 896.6 1.7 880.6Q1.7 876.6 3.2 823.1Q4.7 769.6 6.7 680.1Q8.7 590.6 10.2 477.1Q11.7 363.6 11.7 240.6Q11.7 174.6 11.2 133.6Q10.7 92.6 9.2 69.1Q7.7 45.6 5.7 33.1Q3.7 20.6 0.7 12.6Q-1.3 5.6 2.7 2.6Q6.7 -1.4 13.7 1.6Q13.7 1.6 13.7 1.6Q20.7 4.6 35.2 11.6Q49.7 18.6 65.7 26.6Q81.7 34.6 92.7 40.6H260.7Q268.7 40.6 271.7 36.6Q276.7 30.6 284.7 20.6Q292.7 10.6 297.7 5.6Q302.7 -2.4 313.7 3.6Q320.7 7.6 333.7 17.1Q346.7 26.6 360.7 36.1Q374.7 45.6 380.7 50.6Q387.7 54.6 386.7 61.1Q385.7 67.6 377.7 72.6Q371.7 75.6 366.2 79.1Q360.7 82.6 355.7 84.6Q346.7 90.6 346.7 106.6Q346.7 133.6 347.7 170.1Q348.7 206.6 349.2 241.6Q349.7 276.6 350.7 301.1Q351.7 325.6 351.7 327.6Q351.7 336.6 334.7 344.6Q317.7 352.6 294.7 352.6Q275.7 352.6 275.7 336.6V313.6H84.7V867.6Q84.7 877.6 65.7 887.1Q46.7 896.6 23.7 896.6ZM245.7 816.6Q226.7 816.6 226.7 799.6Q226.7 795.6 227.7 769.1Q228.7 742.6 229.2 701.6Q229.7 660.6 230.7 611.6Q231.7 562.6 231.7 513.6Q231.7 466.6 229.7 441.6Q227.7 416.6 222.7 404.6Q219.7 399.6 224.7 394.6Q228.7 390.6 235.7 393.6Q243.7 396.6 258.7 403.6Q273.7 410.6 289.7 418.6Q305.7 426.6 315.7 432.6H481.7Q487.7 432.6 492.7 427.6Q496.7 422.6 504.2 413.1Q511.7 403.6 515.7 399.6Q521.7 390.6 533.7 397.6Q544.7 404.6 566.7 419.1Q588.7 433.6 599.7 441.6Q607.7 445.6 606.7 453.1Q605.7 460.6 597.7 464.6Q593.7 466.6 588.2 470.1Q582.7 473.6 578.7 475.6Q569.7 480.6 569.7 495.6Q569.7 514.6 570.2 546.1Q570.7 577.6 572.2 614.1Q573.7 650.6 574.7 684.1Q575.7 717.6 576.2 740.6Q576.7 763.6 576.7 767.6Q576.7 776.6 559.7 785.1Q542.7 793.6 518.7 793.6Q495.7 793.6 495.7 775.6V738.6H304.7V788.6Q304.7 798.6 288.2 807.6Q271.7 816.6 245.7 816.6ZM304.7 708.6H495.7V599.6H304.7ZM304.7 569.6H495.7V462.6H304.7ZM540.7 283.6H736.7V192.6H540.7ZM540.7 161.6H736.7V70.6H540.7ZM84.7 283.6H275.7V192.6H84.7ZM84.7 161.6H275.7V70.6H84.7Z';
const markUri = (fill: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 848.8 896.6"><path fill="${fill}" d="${MARK_PATH}"/></svg>`);

// Satori picks one face per family name, so each subset gets its own name and a title uses them as a font stack.
const SERIF = 'Source Serif 4, Source Serif 4 Ext, Source Serif 4 Greek';
let fonts: { name: string; data: Buffer; weight: 400; style: 'normal' }[] | undefined;
const loadFonts = () =>
  (fonts ??= [
    { name: 'Source Serif 4', data: file('@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Source Serif 4 Ext', data: file('@fontsource/source-serif-4/files/source-serif-4-latin-ext-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Source Serif 4 Greek', data: file('@fontsource/source-serif-4/files/source-serif-4-greek-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Geist Mono', data: file('@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  ]);

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown; [k: string]: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

/** 1200x630 card on the site's golden grid: text on the major side, a tonal aperture with 間 on the minor side. */
export async function ogPng({ title, kicker }: { title: string; kicker: string }) {
  const mono = { fontFamily: 'Geist Mono', fontSize: 22, letterSpacing: 2.6, color: '#5F5E5A' };
  const tree = h('div', { display: 'flex', boxSizing: 'border-box', width: '100%', height: '100%', background: '#E8E6E1', color: '#1C1C1B', padding: '74px 89px', justifyContent: 'space-between' }, [
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640 }, [
      h('div', { ...mono, textTransform: 'uppercase' }, kicker),
      h('div', { fontFamily: SERIF, fontSize: title.length > 60 ? 52 : 64, lineHeight: 1.1, letterSpacing: -1 }, title),
      h('div', mono, 'sairam-sundararaman.github.io'),
    ]),
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 298, height: 482, background: '#C9C5BC' }, [
      { type: 'img', props: { src: markUri('#1C1C1B'), width: 150, height: 158 } },
    ]),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg).render().asPng();
}
