'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  faqs: FAQItem[]
  title?: string
  className?: string
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What is your return policy?",
    answer: "We don't allow returns, cancellations, or refunds on any products sold. All purchases are final."
  },
  {
    question: "How long does shipping take?",
    answer: "We typically dispatch within 3-4 business days as our products are made to order. Delivery usually takes 3-7 business days depending on your location. Free shipping on orders over ₹799!"
  },
  {
    question: "Are your products safe for all pets?",
    answer: "Yes! All our products are made from pet-safe materials and undergo rigorous testing. However, always supervise your pet with new accessories."
  },
  {
    question: "What sizing options do you offer?",
    answer: "We have a range of sizes available for all our products. Please refer to the sizing chart on product page for detailed measurements."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, UPI, and Net Banking."
  },
  {
    question: "Can I track my order?",
    answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also contact us anytime for order updates."
  },
  {
    question: "Do you offer custom designs and personalization?",
    answer: "Yes! We specialize in custom designs including personalized names, special patterns, and custom colors. Contact us through WhatsApp or our contact form to discuss your custom requirements."
  },
  {
    question: "How do I care for and clean the accessories?",
    answer: "Most items can be hand washed with mild soap and air dried. Avoid harsh chemicals or machine washing for leather items. Care instructions are included with each product."
  }
]

export default function FAQ({ faqs = defaultFAQs, title = "Frequently Asked Questions", className = "" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate FAQ schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className={`py-12 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-heading font-bold text-text-dark text-center mb-12"
          >
            {title}
          </motion.h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-medium text-text-dark pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-pink flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-text-body leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}