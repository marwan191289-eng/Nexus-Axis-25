import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <span className="font-serif text-8xl font-bold text-primary-200">404</span>
        <h1 className="font-serif text-2xl text-neutral-800 mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Return Home
        </Link>
      </motion.div>
    </section>
  )
}
