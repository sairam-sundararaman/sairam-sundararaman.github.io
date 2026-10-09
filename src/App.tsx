import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, About } from './pages'
import { profile } from './content'

export default function App() {
  const loc = useLocation()
  return (
    <>
      <header className="nav">
        <NavLink to="/" className="mark">{profile.name}</NavLink>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'on' : '')}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'on' : '')}>About</NavLink>
        </nav>
      </header>
      {/* Nav and footer stay put; only the page's text animates out and in. */}
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main key={loc.pathname} exit={{ opacity: 0.999, transition: { duration: 0.55 } }}>
          <Routes location={loc}>
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
