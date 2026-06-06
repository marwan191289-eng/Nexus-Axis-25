import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  title?: string
  subtitle?: string
  children: ReactNode
}

export default function SectionWrapper({ title, subtitle, children }: Props) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-neutral-500 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
