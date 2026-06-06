export const SITE_CONFIG = {
  name: 'Nexus Axis Consultants',
  domain: import.meta.env.VITE_SITE_DOMAIN || 'nexusaxisconsultants.com',
  baseUrl: import.meta.env.VITE_BASE_URL || 'https://nexusaxisconsultants.com',
  ogImage: '/opengraph.jpg',

  contact: {
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '+971585592355',
    phone: import.meta.env.VITE_PHONE || '+971585592355',
    email: import.meta.env.VITE_EMAIL || 'info@nexusaxisconsultants.com',
    address: import.meta.env.VITE_ADDRESS || '1200 Executive Tower, New York, NY 10001',
  },

  social: {
    whatsapp: import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/971585592355',
    facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com/nexusaxisconsultants',
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/nexus-axis-consultants',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/nexusaxisconsultants',
    twitter: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com/nexusaxis',
  },

  blog: {
    categories: ['Corporate', 'Real Estate', 'Dispute Resolution', 'Regulatory', 'Immigration'] as const,
  },
}

export type BlogCategory = typeof SITE_CONFIG.blog.categories[number]
