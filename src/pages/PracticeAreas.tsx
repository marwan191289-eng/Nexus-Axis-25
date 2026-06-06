import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Scale, Shield, Handshake, Gavel, Building2, FileCheck,
  Landmark, Globe, Briefcase, ArrowRight,
} from 'lucide-react'
import SectionWrapper from '../components/SectionWrapper'

const PRACTICE_AREAS = [
  {
    icon: Scale,
    title: 'Corporate Law',
    desc: 'Full-spectrum corporate legal services including entity formation, governance, M&A transactions, and corporate restructuring.',
    details: ['Mergers & Acquisitions', 'Corporate Governance', 'Entity Structuring', 'Joint Ventures', 'Due Diligence'],
  },
  {
    icon: Shield,
    title: 'Commercial Litigation',
    desc: 'Aggressive representation in complex commercial disputes, from trial through appeal, with a track record of favorable outcomes.',
    details: ['Business Disputes', 'Arbitration', 'Class Actions', 'Appellate Practice', 'Fraud Litigation'],
  },
  {
    icon: Handshake,
    title: 'Intellectual Property',
    desc: 'Protecting innovations and creative assets through comprehensive IP strategies encompassing registration, enforcement, and licensing.',
    details: ['Patent Prosecution', 'Trademark Registration', 'IP Licensing', 'Trade Secrets', 'IP Litigation'],
  },
  {
    icon: Gavel,
    title: 'Regulatory Compliance',
    desc: 'Navigating complex regulatory frameworks to keep your business compliant while enabling strategic growth across jurisdictions.',
    details: ['Securities Compliance', 'Data Privacy', 'Anti-Money Laundering', 'Industry-Specific Regulation', 'Government Investigations'],
  },
  {
    icon: Building2,
    title: 'Real Estate & Finance',
    desc: 'Structuring and closing high-value real estate transactions, development projects, and sophisticated financing arrangements.',
    details: ['Commercial Transactions', 'Development Agreements', 'Structured Finance', 'Real Estate Finance', 'Construction Law'],
  },
  {
    icon: FileCheck,
    title: 'Contract Advisory',
    desc: 'Drafting, reviewing, and negotiating mission-critical agreements to protect your business interests and minimize risk exposure.',
    details: ['Commercial Contracts', 'Service Agreements', 'Licensing Deals', 'Employment Contracts', 'Vendor Agreements'],
  },
  {
    icon: Landmark,
    title: 'Fintech & Digital Assets',
    desc: 'Advising innovative companies at the frontier of financial technology, blockchain, and digital asset regulatory frameworks.',
    details: ['Token Offerings', 'Digital Asset Regulation', 'Payment Systems', 'Smart Contracts', 'DeFi Compliance'],
  },
  {
    icon: Globe,
    title: 'International Law',
    desc: 'Cross-border legal strategy for businesses operating in multiple jurisdictions, including trade compliance and international arbitration.',
    details: ['Cross-Border Transactions', 'International Arbitration', 'Trade Compliance', 'Foreign Investment', 'Treaty Matters'],
  },
  {
    icon: Briefcase,
    title: 'Employment Law',
    desc: 'Comprehensive employment counsel from executive contracts to workplace policies, protecting both employers and key personnel.',
    details: ['Executive Compensation', 'Non-Compete Agreements', 'Workplace Policies', 'Employment Litigation', 'HR Compliance'],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
}

export default function PracticeAreas() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary-50 to-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium uppercase tracking-widest rounded mb-4">
              Our Expertise
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 leading-tight mb-6">
              Practice Areas Built on
              <br />
              <span className="text-primary-600">Deep Specialization</span>
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed">
              We concentrate our resources where we can deliver the greatest
              impact — providing focused expertise rather than superficial
              coverage across the legal spectrum.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Areas Grid */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_AREAS.map((area, i) => (
            <motion.div
              key={area.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group p-8 bg-white rounded-lg border border-neutral-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <area.icon size={22} className="text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-800 mb-3">
                {area.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                {area.desc}
              </p>
              <ul className="mt-auto space-y-1.5">
                {area.details.map((d) => (
                  <li key={d} className="text-xs text-neutral-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="py-20 bg-primary-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Need Counsel in Your Area?
            </h2>
            <p className="text-primary-200 mb-8 max-w-xl mx-auto">
              Even if your specific matter isn't listed, our cross-practice
              experience often means we can help — or connect you with the right
              specialist.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-primary-900 font-semibold rounded-md hover:bg-accent-400 transition-colors group"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
