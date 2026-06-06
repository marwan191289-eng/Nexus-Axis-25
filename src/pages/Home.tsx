import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Scale, Shield, Handshake, Gavel, Building2, FileCheck } from 'lucide-react'
import SectionWrapper from '../components/SectionWrapper'

const PRACTICE_HIGHLIGHTS = [
  { icon: Scale, title: 'Corporate Law', desc: 'M&A, structuring, and governance for growth-stage and enterprise clients.' },
  { icon: Shield, title: 'Litigation', desc: 'Aggressive advocacy in commercial disputes, arbitration, and appellate matters.' },
  { icon: Handshake, title: 'Intellectual Property', desc: 'Protecting innovations through patents, trademarks, and strategic IP portfolios.' },
  { icon: Gavel, title: 'Regulatory Compliance', desc: 'Navigating complex regulatory frameworks across jurisdictions.' },
  { icon: Building2, title: 'Real Estate & Finance', desc: 'High-value transactions, development deals, and structured finance.' },
  { icon: FileCheck, title: 'Contract Advisory', desc: 'Drafting, reviewing, and negotiating mission-critical agreements.' },
]

const STATS = [
  { value: '15+', label: 'Years of Practice' },
  { value: '200+', label: 'Cases Won' },
  { value: '50+', label: 'Corporate Clients' },
  { value: '98%', label: 'Client Retention' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(248,201,120,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(248,201,120,0.15) 0%, transparent 40%)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-accent-500/20 border border-accent-400/30 rounded-full text-accent-300 text-xs font-medium uppercase tracking-widest mb-8">
                Boutique Legal Advisory
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl text-white leading-[1.1] mb-6"
            >
              Strategic Counsel.
              <br />
              <span className="text-accent-300">Exceptional</span> Results.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-primary-200 leading-relaxed mb-10 max-w-xl"
            >
              Nexus Axis Consultants provides incisive legal strategy for
              businesses navigating complex regulatory landscapes, high-stakes
              disputes, and transformative transactions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-primary-900 font-semibold rounded-md hover:bg-accent-400 transition-colors group"
              >
                Schedule Consultation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/practice-areas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-primary-500 text-primary-100 font-medium rounded-md hover:bg-primary-800/50 transition-colors"
              >
                Our Practice Areas
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-4xl md:text-5xl font-bold text-primary-700 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Highlights */}
      <SectionWrapper
        title="Practice Areas"
        subtitle="We concentrate our expertise where it matters most — delivering depth over breadth in every engagement."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-8 bg-white rounded-lg border border-neutral-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <item.icon size={22} className="text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-800 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/practice-areas"
            className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm hover:text-primary-700 group"
          >
            View all practice areas
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="py-20 bg-primary-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Ready to Discuss Your Matter?
            </h2>
            <p className="text-primary-200 mb-8 max-w-xl mx-auto">
              Our attorneys are available for confidential consultations to
              understand your situation and outline a clear path forward.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-primary-900 font-semibold rounded-md hover:bg-accent-400 transition-colors group"
            >
              Book a Consultation
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
