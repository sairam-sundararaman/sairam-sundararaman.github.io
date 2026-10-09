import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { profile, publication, research, projects, about, news } from './content'
import type { Link as L } from './content'

export const EASE = [0.2, 0.7, 0.1, 1] as const
const EASE_IN = [0.55, 0, 1, 0.45] as const

// Words enter from below and leave through the top, so a page change reads as text moving.
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      exit={{ opacity: 0, y: -28, transition: { duration: 0.4, ease: EASE_IN } }}
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

function TextLinks({ links }: { links: L[] }) {
  return (
    <div className="tls">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="tl">{l.label} ↗</a>
      ))}
    </div>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="wrap sec">
      <Rise><h2 className="lab">{label}</h2></Rise>
      <div>{children}</div>
    </section>
  )
}

function Name() {
  return (
    <h1 className="name" aria-label={profile.name}>
      <span className="line"><Split text="Sairam" delay={0.1} /></span>
      <span className="line"><Split text="Sundararaman" delay={0.25} /></span>
    </h1>
  )
}

export function Home() {
  return (
    <>
      <section className="wrap hero">
        <div>
          <Rise><p className="lab">{profile.role}</p></Rise>
          <Name />
          <Rise delay={0.45}><p className="blurb"><Md s={profile.blurb} /></p></Rise>
          <Rise delay={0.55}><p className="interests">{research.interests.join('  ·  ')}</p></Rise>
          <Rise delay={0.65}>
            <div className="ext">
              <a className="xl solid" href={'mailto:' + profile.email}>Email</a>
              <a className="xl solid" href={profile.resume}>CV ↓</a>
              {profile.links.map((l) => (
                <a key={l.label} className="xl" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
              ))}
            </div>
          </Rise>
        </div>
        <motion.img
          className="portrait" src="/photo.jpg" alt={profile.name} width={440} height={550}
          initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0% 0 100% 0)', transition: { duration: 0.45, ease: EASE_IN } }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
        />
      </section>

      <Section label="News">
        {news.map((n) => (
          <Rise key={n.date + n.text}>
            <div className="news"><span className="date">{n.date}</span><span><Md s={n.text} /></span></div>
          </Rise>
        ))}
      </Section>

      <Section label="Publications">
        <Rise>
          <h3 className="et">{publication.title}</h3>
          <p className="authors">
            {publication.authors.map((a, i) => (
              <span key={a}>{a === profile.short ? <b>{a}</b> : a}{i < publication.authors.length - 1 ? ', ' : ''}</span>
            ))}
          </p>
          <p className="venue">{publication.venue}, {publication.year}</p>
          <TextLinks links={publication.links} />
        </Rise>
      </Section>

      <Section label="Research">
        <Rise>
          <h3 className="et">{research.title}</h3>
          <p className="venue"><Md s={research.where} /> · {research.when}</p>
          <ul className="pts">{research.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </Rise>
      </Section>

      <Section label="Projects">
        {projects.map((p) => (
          <Rise key={p.title} className="prj-wrap">
            <div className="prj">
              <div>
                <h3 className="et">{p.title}</h3>
                <p className="date">{p.when}</p>
                <TextLinks links={p.links} />
              </div>
              <p className="sum">{p.summary}</p>
            </div>
          </Rise>
        ))}
      </Section>
    </>
  )
}

export function About() {
  return (
    <>
      <header className="wrap phead">
        <Rise><p className="lab">About</p></Rise>
        <Name />
      </header>
      <section className="wrap abt">
        {profile.bio.map((p, i) => <Rise key={p} delay={i * 0.1}><p className="bio"><Md s={p} /></p></Rise>)}
        <Rise>
          <div className="kv"><span className="lab">Education</span><span>{about.education.school}<br /><em>{about.education.degree}</em></span><span className="date">{about.education.years}</span></div>
          {about.honors.map((h) => <div key={h.t} className="kv"><span className="lab">Honors</span><span>{h.t}</span><span className="date">{h.y}</span></div>)}
          <div className="kv"><span className="lab">Teaching</span><span>{about.teaching.t}</span><span className="date">{about.teaching.y}</span></div>
          <div className="kv"><span className="lab">Interests</span><span>{research.interests.join(', ')}</span><span /></div>
        </Rise>
        <Rise>
          <div className="ext">
            <a className="xl solid" href={'mailto:' + profile.email}>Email</a>
            <a className="xl solid" href={profile.resume}>CV ↓</a>
            {profile.links.map((l) => (
              <a key={l.label} className="xl" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        </Rise>
      </section>
    </>
  )
}
