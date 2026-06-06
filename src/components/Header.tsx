import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-primary-700 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
            <span className="font-serif text-accent-300 text-xl font-bold">N</span>
          </div>
          <div className="leading-tight">
            <span className="font-serif text-lg font-semibold text-primary-800 tracking-tight block">
              Nexus Axis
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Consultants
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  active
                    ? 'text-primary-700'
                    : 'text-neutral-600 hover:text-primary-600'
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          <Link
            to="/contact"
            className="ml-4 px-5 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-md hover:bg-primary-600 transition-colors"
          >
            Book Consultation
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-neutral-700 hover:text-primary-700 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-100 shadow-lg overflow-hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link
                to="/contact"
                className="mt-2 px-4 py-3 bg-primary-700 text-white text-sm font-medium rounded-md text-center hover:bg-primary-600 transition-colors"
              >
                Book Consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
