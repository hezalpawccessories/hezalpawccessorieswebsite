'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "hezal.accessories@gmail.com",
      description: "Send us an email anytime!"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Sat 9AM-7PM"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "Mumbai, Maharashtra",
      description: "India"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Mon - Sat: 9AM - 7PM",
      description: "Sunday: Closed"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="gradient-bg">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-nunito font-extrabold text-text-dark mb-6 leading-tight tracking-wide">
                Get in <span className="text-primary-pink">Touch</span>
              </h1>
              <p className="text-xl font-dm-sans text-text-body max-w-3xl mx-auto">
                Have questions about our products or need help with your order? We&apos;re here to help!
              </p>
            </motion.div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center card-hover"
                >
                  <div className="text-primary-blue mb-4 flex justify-center">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-nunito font-bold text-text-dark mb-2">
                    {info.title}
                  </h3>
                  <p className="font-dm-sans text-primary-pink font-semibold mb-1">
                    {info.details}
                  </p>
                  <p className="font-dm-sans text-text-body text-sm">
                    {info.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Contact Form and Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-bold text-text-dark mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        placeholder="Enter your phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Subject *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      >
                        <option value="">Select a subject</option>
                        <option value="product-inquiry">Product Inquiry</option>
                        <option value="order-support">Order Support</option>
                        <option value="return-exchange">Return/Exchange</option>
                        <option value="general">General Question</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </motion.div>

              {/* Image and Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-primary-blue to-light-purple p-2 rounded-2xl">
                  <Image
                    src="https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Customer service"
                    width={600}
                    height={256}
                    className="w-full h-64 object-cover rounded-xl"
                    priority
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    Why Contact Us?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                      <span className="text-text-light">Product recommendations and sizing help</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                      <span className="text-text-light">Order tracking and delivery updates</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                      <span className="text-text-light">Return and exchange assistance</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                      <span className="text-text-light">Pet care tips and advice</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                      <span className="text-text-light">Custom orders and special requests</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-soft-yellow/20 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-text-dark mb-2">
                    Quick Response Promise
                  </h3>
                  <p className="text-text-light">
                    We typically respond to all inquiries within 24 hours. For urgent matters, 
                    please call us directly during business hours.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-text-light">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "What is your return policy?",
                  answer: "We offer a 30-day return policy for unused items in original packaging. Pet safety is our priority, so we cannot accept returns on used items for hygiene reasons."
                },
                {
                  question: "How long does shipping take?",
                  answer: "We typically ship within 1-2 business days. Delivery usually takes 3-7 business days depending on your location. Free shipping on orders over ₹1000!"
                },
                {
                  question: "Are your products safe for all pets?",
                  answer: "Yes! All our products are made from pet-safe materials and undergo rigorous testing. However, always supervise your pet with new toys and accessories."
                },
                {
                  question: "Do you offer custom sizing?",
                  answer: "Yes, we offer custom sizing for collars and harnesses. Please contact us with your pet's measurements and we'll help you find the perfect fit."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, debit cards, UPI, net banking, and cash on delivery for orders within our delivery areas."
                },
                {
                  question: "Can I track my order?",
                  answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also contact us anytime for order updates."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-soft-gray p-6 rounded-2xl"
                >
                  <h3 className="text-lg font-bold text-text-dark mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-text-light">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}