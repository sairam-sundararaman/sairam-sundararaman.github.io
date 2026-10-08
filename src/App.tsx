import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Research, Projects, About } from './pages'
import { profile } from './content'

const links: [string, string][] = [['/', 'Index'], ['/research', 'Research'], ['/projects', 'Projects'], ['/about', 'About']]

export default function App() {
  const loc = useLocation()
  return (
    <>
      <header className="nav">
        <NavLink to="/" className="mark">S<i>.</i></NavLink>
        <nav>
          {links.map(([to, l]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>{l}</NavLink>
          ))}
        </nav>
      </header>
      {/* Nav and footer stay put; only the page's text animates out and in. The main exit just holds the page mounted until the words have left. */}
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main key={loc.pathname} exit={{ opacity: 0.999, transition: { duration: 0.55 } }}>
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Research />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <footer className="foot wrap">
        <a href={'mailto:' + profile.email}>{profile.email}</a>
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </footer>
    </>
  )
}
