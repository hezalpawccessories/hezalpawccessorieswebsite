'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: "1000+", label: "Happy Customers" },
    { icon: <Award className="w-8 h-8" />, number: "500+", label: "Products Sold" },
    { icon: <Truck className="w-8 h-8" />, number: "50+", label: "Cities Served" },
    { icon: <Heart className="w-8 h-8" />, number: "100%", label: "Love & Care" }
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
              <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6">
                About <span className="text-primary-pink">Hezal Accessories</span>
              </h1>
              <p className="text-xl text-text-light max-w-3xl mx-auto">
                We're passionate about providing premium pet accessories that bring joy, comfort, and style to your beloved companions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src="https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Pet accessories collection"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-text-dark">Our Story</h2>
                <p className="text-text-light leading-relaxed">
                  Founded with a simple belief that every pet deserves the best, Hezal Accessories started as a small dream to create beautiful, functional, and safe accessories for our furry friends.
                </p>
                <p className="text-text-light leading-relaxed">
                  We understand the special bond between pets and their families. That's why every product in our collection is carefully selected and tested to ensure it meets our high standards of quality, safety, and style.
                </p>
                <p className="text-text-light leading-relaxed">
                  From premium collars and leashes to cozy beds and fun toys, we're committed to enhancing the lives of pets and bringing smiles to pet parents everywhere.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                Our Impact
              </h2>
              <p className="text-xl text-text-light">
                Numbers that reflect our commitment to pets and their families
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-primary-blue mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary-pink mb-2">
                    {stat.number}
                  </div>
                  <div className="text-text-light font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                Our Values
              </h2>
              <p className="text-xl text-text-light">
                What drives us every day
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality First",
                  description: "We never compromise on quality. Every product is carefully tested and selected to meet our high standards.",
                  icon: "🏆"
                },
                {
                  title: "Pet Safety",
                  description: "Safety is our top priority. All our products are made from pet-safe materials and undergo rigorous testing.",
                  icon: "🛡️"
                },
                {
                  title: "Customer Care",
                  description: "We're here for you and your pets. Our customer service team is always ready to help with any questions.",
                  icon: "💝"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg text-center card-hover"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    {value.title}
                  </h3>
                  <p className="text-text-light">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-r from-primary-blue to-light-purple">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                To create a world where every pet feels loved, comfortable, and stylish through our carefully crafted accessories. We believe that pets are family, and family deserves only the best.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}