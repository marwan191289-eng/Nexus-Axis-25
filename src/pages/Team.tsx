import { motion } from 'framer-motion'
import { Link2, Mail } from 'lucide-react'
import SectionWrapper from '../components/SectionWrapper'

const TEAM = [
  {
    name: 'Victoria Ashford',
    role: 'Managing Partner',
    specialty: 'Corporate Law & M&A',
    bio: 'Over 20 years advising Fortune 500 companies on transformative transactions. Former clerk for the Second Circuit Court of Appeals.',
    img: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  },
  {
    name: 'Marcus Chen',
    role: 'Senior Partner',
    specialty: 'Commercial Litigation',
    bio: 'Trial-tested litigator with a 90% success rate in complex commercial disputes. Recognized by Super Lawyers for 8 consecutive years.',
    img: 'https://images.pexels.com/photos/8370249/pexels-photo-8370249.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Partner',
    specialty: 'Intellectual Property',
    bio: 'Former USPTO examiner turned strategic IP advisor. Has secured and defended patents valued at over $2B in aggregate.',
    img: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  },
  {
    name: 'James Whitfield',
    role: 'Partner',
    specialty: 'Regulatory Compliance',
    bio: 'Former SEC enforcement attorney advising fintech companies and financial institutions on compliance strategy and government investigations.',
    img: 'https://images.pexels.com/photos/8289418/pexels-photo-8289418.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  },
  {
    name: 'Priya Sharma',
    role: 'Of Counsel',
    specialty: 'International Law',
    bio: 'Dual-qualified attorney with expertise in cross-border transactions and international arbitration across 15+ jurisdictions.',
    img: 'https://images.pexels.com/photos/5491519/pexels-photo-5491519.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  },
  {
    name: 'David Okafor',
    role: 'Senior Associate',
    specialty: 'Real Estate & Finance',
    bio: 'Specialist in complex commercial real estate transactions and structured finance with over $3B in closed deals.',
    img: 'https://images.pexels.com/photos/7691105/pexels-photo-7691105.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
}

export default function Team() {
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
              Our People
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 leading-tight mb-6">
              Attorneys Who
              <br />
              <span className="text-primary-600">Make the Difference</span>
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Our team combines big-firm credentials with boutique-firm
              dedication — senior partners who personally handle your matter
              from start to finish.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white rounded-lg border border-neutral-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-neutral-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-accent-600 font-medium mb-1">
                  {member.role}
                </p>
                <p className="text-sm text-primary-600 font-medium mb-3">
                  {member.specialty}
                </p>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-primary-50 hover:text-primary-600 transition-colors" aria-label={`LinkedIn for ${member.name}`}>
                    <Link2 size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-primary-50 hover:text-primary-600 transition-colors" aria-label={`Email ${member.name}`}>
                    <Mail size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </>
  )
}
