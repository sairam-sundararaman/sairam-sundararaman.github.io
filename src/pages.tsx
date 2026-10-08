import { useEffect, useRef, useState } from 'react'
import type { ReactNode, PointerEvent as RPE } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { profile, publication, research, projects, about } from './content'
import type { Link as L } from './content'

export const EASE = [0.2, 0.7, 0.1, 1] as const
const EASE_IN = [0.55, 0, 1, 0.45] as const
const SPRING = { stiffness: 140, damping: 14, mass: 0.5 }
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Words enter from below and leave through the top, so a page change reads as text moving, not the page.
const letterMotion = (i: number, delay: number) => ({
  initial: { y: '112%' },
  animate: { y: '0%' },
  exit: { y: '-112%', transition: { duration: 0.4, delay: i * 0.012, ease: EASE_IN } },
  transition: { duration: 0.9, delay: delay + i * 0.035, ease: EASE },
})

function Split({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className="ch" aria-hidden="true">
          <motion.span {...letterMotion(i, delay)}>{c}</motion.span>
        </span>
      ))}
    </>
  )
}

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      exit={{ opacity: 0, y: -36, transition: { duration: 0.4, ease: EASE_IN } }}
    >
      {children}
    </motion.div>
  )
}

function Md({ s }: { s: string }) {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index))
    out.push(<a key={m.index} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>)
    last = re.lastIndex
  }
  out.push(s.slice(last))
  return <>{out}</>
}

function Ext({ links }: { links: L[] }) {
  return (
    <div className="ext">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="xl">{l.label} <span>↗</span></a>
      ))}
    </div>
  )
}

function PageHead({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <header className="phead wrap">
      <Rise><p className="lab">{n}</p></Rise>
      <h1 className="big" aria-label={title}><Split text={title} delay={0.1} /></h1>
      {sub && <Rise delay={0.3}><p className="lede">{sub}</p></Rise>}
    </header>
  )
}

// Hero letters are pushed away from the mouse and spring back.
function HeroChar({ c, i, delay, mx, my }: { c: string; i: number; delay: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null)
  const base = useRef({ x: -1e4, y: -1e4 })
  useEffect(() => {
    const m = () => {
      const r = ref.current?.getBoundingClientRect()
      if (r) base.current = { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY }
    }
    m()
    window.addEventListener('resize', m)
    document.fonts?.ready.then(m)
    const t = window.setTimeout(m, 2000)
    return () => { window.removeEventListener('resize', m); clearTimeout(t) }
  }, [])
  const push = (axis: 0 | 1) => ([px, py]: number[]) => {
    const dx = base.current.x - px, dy = base.current.y - py
    const d = Math.hypot(dx, dy) || 1
    const s = Math.max(0, 1 - d / 260)
    return ((axis ? dy : dx) / d) * s * s * 56
  }
  const x = useSpring(useTransform([mx, my], push(0)), SPRING)
  const y = useSpring(useTransform([mx, my], push(1)), SPRING)
  return (
    <motion.span ref={ref} className="cx" style={{ x, y }}>
      <span className="ch" aria-hidden="true">
        <motion.span {...letterMotion(i, delay)}>{c}</motion.span>
      </span>
    </motion.span>
  )
}

export function Home() {
  const mx = useMotionValue(-1e4)
  const my = useMotionValue(-1e4)
  const move = (e: RPE) => { if (!reduce && e.pointerType === 'mouse') { mx.set(e.pageX); my.set(e.pageY) } }
  const leave = () => { mx.set(-1e4); my.set(-1e4) }
  const lines: [string, number][] = [['Sairam', 0.15], ['Sundararaman', 0.3]]
  const rows: [string, string, string, string][] = [
    ['01', 'Research', 'Differentially private mechanisms for transformer LLMs', '/research'],
    ['02', 'Publication', 'The Final-Stage Bottleneck · TMLR 2026', '/research'],
    ['03', 'Projects', 'Optimization geometry, rebuilt from scratch', '/projects'],
    ['04', 'About', 'Background, contact, résumé', '/about'],
  ]
  return (
    <>
      <section className="hero" onPointerMove={move} onPointerLeave={leave}>
        <Rise><p className="lab">{profile.role}</p></Rise>
        <h1 className="name" aria-label={profile.name}>
          {lines.map(([t, d]) => (
            <span className="line" key={t}>
              {Array.from(t).map((c, i) => <HeroChar key={i} c={c} i={i} delay={d} mx={mx} my={my} />)}
            </span>
          ))}
        </h1>
        <div className="hero-foot"><Rise delay={0.8}><p className="lab cue">Scroll ↓</p></Rise></div>
      </section>
      <section className="wrap intro">
        <Rise><p className="statement">{profile.tagline}</p></Rise>
        {rows.map(([n, k, t, to]) => (
          <Rise key={n}>
            <Link to={to} className="hrow">
              <span className="num">{n}</span>
              <span className="lab">{k}</span>
              <span className="et ht">{t}</span>
              <span className="arr">→</span>
            </Link>
          </Rise>
        ))}
      </section>
    </>
  )
}

export function Research() {
  return (
    <>
      <PageHead n="02" title="Research" sub="Privacy and robustness, argued from first principles." />
      <section className="wrap block">
        <Rise>
          <p className="lab">Publication · {publication.year}</p>
          <h2 className="et lg">{publication.title}</h2>
          <p className="meta">
            {publication.authors.map((a, i) => (
              <span key={a}>{a === profile.short ? <b>{a}</b> : a}{i < publication.authors.length - 1 ? ', ' : ''}</span>
            ))}
          </p>
          <p className="meta">{publication.venue}</p>
          <Ext links={publication.links} />
        </Rise>
      </section>
      <section className="wrap block">
        <Rise>
          <p className="lab">{research.when}</p>
          <h2 className="et lg">{research.title}</h2>
          <p className="meta"><Md s={research.where} /></p>
          <ol className="steps">{research.points.map((p) => <li key={p}>{p}</li>)}</ol>
        </Rise>
      </section>
      <section className="wrap block">
        <Rise><p className="lab">Themes</p></Rise>
        <div className="themes">
          {research.interests.map((w, i) => (
            <Rise key={w} delay={i * 0.08}>
              <div className="theme"><span className="num">{String(i + 1).padStart(2, '0')}</span><span className="et">{w}</span></div>
            </Rise>
          ))}
        </div>
      </section>
    </>
  )
}

export function Projects() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <PageHead n="03" title="Projects" sub="Optimizers, geometry, and autodiff, rebuilt to see where they break." />
      <section className="wrap">
        {projects.map((p, i) => (
          <Rise key={p.title}>
            <div className="prow">
              <button className="phd" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span className="pt">{p.title}</span>
                <span className="yr">{p.when}</span>
                <span className={'plus' + (open === i ? ' x' : '')}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div key="c" className="pbody" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                    <div className="pin">
                      <p>{p.summary}</p>
                      <Ext links={p.links} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Rise>
        ))}
      </section>
    </>
  )
}

export function About() {
  return (
    <>
      <PageHead n="04" title="About" />
      <section className="wrap abt">
        <motion.img
          className="portrait" src="/photo.jpg" alt={profile.name} width={440} height={550}
          initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0% 0 100% 0)', transition: { duration: 0.45, ease: EASE_IN } }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        />
        <div>
          {profile.bio.map((p, i) => <Rise key={p} delay={i * 0.1}><p className="bio"><Md s={p} /></p></Rise>)}
          <Rise>
            <div className="kv"><span className="lab">Education</span><span>{about.education.school}<br /><em>{about.education.degree}</em></span><span className="yr">{about.education.years}</span></div>
            {about.honors.map((h) => <div key={h.t} className="kv"><span className="lab">Honors</span><span>{h.t}</span><span className="yr">{h.y}</span></div>)}
            <div className="kv"><span className="lab">Teaching</span><span>{about.teaching.t}</span><span className="yr">{about.teaching.y}</span></div>
          </Rise>
          <Rise>
            <div className="ext">
              <a className="xl solid" href={'mailto:' + profile.email}>Email <span>↗</span></a>
              <a className="xl solid" href={profile.resume}>Résumé <span>↓</span></a>
              {profile.links.map((l) => (
                <a key={l.label} className="xl" href={l.href} target="_blank" rel="noreferrer">{l.label} <span>↗</span></a>
              ))}
            </div>
          </Rise>
        </div>
      </section>
    </>
  )
}
