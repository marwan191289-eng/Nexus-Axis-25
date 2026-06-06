import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = {
  firm: [
    { to: '/about', label: 'About Us' },
    { to: '/practice-areas', label: 'Practice Areas' },
    { to: '/team', label: 'Our Team' },
    { to: '/contact', label: 'Contact' },
  ],
  areas: [
    { to: '/practice-areas', label: 'Corporate Law' },
    { to: '/practice-areas', label: 'Litigation' },
    { to: '/practice-areas', label: 'Intellectual Property' },
    { to: '/practice-areas', label: 'Regulatory Compliance' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-primary-700 flex items-center justify-center">
                <span className="font-serif text-accent-300 text-xl font-bold">N</span>
              </div>
              <div className="leading-tight">
                <span className="font-serif text-lg font-semibold text-white tracking-tight block">
                  Nexus Axis
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary-300">
                  Consultants
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-300 leading-relaxed mb-6">
              Boutique legal advisory delivering strategic counsel at the
              intersection of law, business, and innovation.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@nexusaxisconsultants.com"
                className="flex items-center gap-2 text-sm text-primary-300 hover:text-accent-300 transition-colors"
              >
                <Mail size={14} />
                info@nexusaxisconsultants.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-sm text-primary-300 hover:text-accent-300 transition-colors"
              >
                <Phone size={14} />
                +1 (234) 567-890
              </a>
              <div className="flex items-start gap-2 text-sm text-primary-300">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>1200 Executive Tower<br />New York, NY 10001</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-white text-sm font-semibold mb-6 uppercase tracking-wider">
              The Firm
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.firm.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-300 hover:text-accent-300 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-sm font-semibold mb-6 uppercase tracking-wider">
              Practice Areas
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.areas.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-300 hover:text-accent-300 transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-sm font-semibold mb-6 uppercase tracking-wider">
              Stay Informed
            </h4>
            <p className="text-sm text-primary-300 mb-4">
              Legal insights and advisory updates delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2.5 bg-primary-800 border border-primary-600 rounded text-sm text-white placeholder:text-primary-400 focus:outline-none focus:border-accent-400 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-accent-500 text-primary-900 text-sm font-semibold rounded hover:bg-accent-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-400">
            &copy; {new Date().getFullYear()} Nexus Axis Consultants. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-xs text-primary-400 hover:text-primary-200 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-xs text-primary-400 hover:text-primary-200 transition-colors">
              Terms of Service
            </Link>
            <Link to="/about" className="text-xs text-primary-400 hover:text-primary-200 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
