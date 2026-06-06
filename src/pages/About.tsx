import { motion } from 'framer-motion'
import { Target, Eye, Users, Award } from 'lucide-react'
import SectionWrapper from '../components/SectionWrapper'

const VALUES = [
  { icon: Target, title: 'Precision', desc: 'Every strategy is crafted with meticulous attention to detail and forward-looking analysis.' },
  { icon: Eye, title: 'Integrity', desc: 'Unwavering ethical standards guide every recommendation and action we take.' },
  { icon: Users, title: 'Partnership', desc: 'We work alongside our clients as trusted advisors, not just outside counsel.' },
  { icon: Award, title: 'Excellence', desc: 'Consistently delivering outcomes that exceed expectations through deep legal expertise.' },
]

const MILESTONES = [
  { year: '2011', event: 'Founded in New York with a vision for boutique advisory excellence.' },
  { year: '2014', event: 'Expanded into intellectual property and regulatory compliance practices.' },
  { year: '2017', event: 'Recognized as a top boutique firm by Legal 500 for corporate litigation.' },
  { year: '2020', event: 'Grew to 20+ attorneys, serving clients across three continents.' },
  { year: '2023', event: 'Launched specialized fintech and digital assets practice group.' },
  { year: '2025', event: 'Opened Washington D.C. office for regulatory and government affairs.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
}

export default function About() {
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
              About the Firm
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 leading-tight mb-6">
              Where Legal Expertise
              <br />
              Meets <span className="text-primary-600">Strategic Vision</span>
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Nexus Axis Consultants was founded on the principle that exceptional
              legal counsel requires more than knowledge of the law — it demands
              strategic thinking, commercial awareness, and an unwavering
              commitment to client success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <SectionWrapper title="Our Values" subtitle="The principles that define how we practice and serve our clients.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 rounded-lg bg-white border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5">
                <v.icon size={24} className="text-primary-600" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-neutral-800 mb-2">{v.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-4">Our Journey</h2>
            <p className="text-neutral-500">Key milestones in the growth of Nexus Axis Consultants.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary-200" />
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
              >
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-accent-500 rounded-full -translate-x-1.5 mt-1" />
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-12 md:pl-0`}>
                  <span className="font-serif text-2xl font-bold text-primary-600">{m.year}</span>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{m.event}</p>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-primary-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Our Mission</h2>
            <p className="text-lg text-primary-200 leading-relaxed max-w-2xl mx-auto">
              To empower businesses and individuals with incisive legal strategy
              that protects their interests, advances their objectives, and
              delivers measurable results — with the personalized attention that
              only a boutique firm can provide.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
