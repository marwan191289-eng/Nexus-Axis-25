import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CircleCheck as CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CONTACT_INFO = [
  { icon: MapPin, label: 'Office', value: '1200 Executive Tower, New York, NY 10001' },
  { icon: Phone, label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
  { icon: Mail, label: 'Email', value: 'info@nexusaxisconsultants.com', href: 'mailto:info@nexusaxisconsultants.com' },
  { icon: Clock, label: 'Hours', value: 'Mon — Fri: 8:30 AM — 6:00 PM EST' },
]

const PRACTICE_OPTIONS = [
  'Corporate Law',
  'Commercial Litigation',
  'Intellectual Property',
  'Regulatory Compliance',
  'Real Estate & Finance',
  'Contract Advisory',
  'Fintech & Digital Assets',
  'International Law',
  'Employment Law',
  'Other',
]

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    practice_area: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        practice_area: form.practice_area || null,
        message: form.message,
      })

      if (error) throw error
      setFormState('success')
      setForm({ name: '', email: '', phone: '', practice_area: '', message: '' })
    } catch {
      setFormState('error')
    }
  }

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
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 leading-tight mb-6">
              Let's Discuss
              <br />
              <span className="text-primary-600">Your Legal Needs</span>
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Reach out for a confidential consultation. We respond to all
              inquiries within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-serif text-2xl text-neutral-900 mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <item.icon size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-neutral-700 hover:text-primary-600 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-neutral-700">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-primary-800 rounded-lg">
                <h3 className="font-serif text-lg text-white mb-3">Confidentiality Notice</h3>
                <p className="text-sm text-primary-200 leading-relaxed">
                  All communications with our firm are protected by
                  attorney-client privilege. Your information is handled with
                  the strictest confidence and security protocols.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-neutral-100 p-8 md:p-10 shadow-sm">
                {formState === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle size={48} className="text-success-500 mx-auto mb-4" />
                    <h3 className="font-serif text-2xl text-neutral-800 mb-2">
                      Inquiry Received
                    </h3>
                    <p className="text-neutral-500 text-sm">
                      Thank you for reaching out. A member of our team will
                      contact you within one business day.
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="mt-6 text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="font-serif text-2xl text-neutral-900 mb-2">
                      Request a Consultation
                    </h2>
                    <p className="text-sm text-neutral-500 mb-6">
                      All fields marked with * are required.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label htmlFor="practice_area" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Area of Interest
                        </label>
                        <select
                          id="practice_area"
                          name="practice_area"
                          value={form.practice_area}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors bg-white"
                        >
                          <option value="">Select a practice area</option>
                          {PRACTICE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors resize-none"
                        placeholder="Briefly describe your legal matter..."
                      />
                    </div>

                    {formState === 'error' && (
                      <div className="p-3 bg-error-500/10 border border-error-500/20 rounded text-sm text-error-500">
                        Something went wrong. Please try again or contact us directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-700 text-white font-medium rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formState === 'submitting' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
