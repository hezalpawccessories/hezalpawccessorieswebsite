'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Award, Users, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: "1000+", label: "Happy Customers" },
    { icon: <Award className="w-8 h-8" />, number: "2000+", label: "Products Sold" },
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
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-text-dark mb-6 leading-tight tracking-wide">
                About <span className="text-primary-pink">Hezal Accessories</span>
              </h1>
              <p className="text-xl font-body text-text-body max-w-3xl mx-auto">
                We&apos;re passionate about providing premium pet accessories that bring joy, comfort, and style to your beloved companions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Image
                  src="https://res.cloudinary.com/dt2qyj4lj/image/upload/v1755786707/dhagh0dnky92h2atq2no.jpg"
                  alt="Pet accessories collection"
                  width={600}
                  height={384}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                {/* <h2 className="text-3xl font-heading font-bold text-text-dark">About Us – Hezal Accessories</h2> */}
                <p className="font-body text-text-body leading-relaxed">
                  At Hezal Accessories, we believe pets are not just companions – they&apos;re family, our little bundles of joy who deserve nothing but the best.
                  Born out of unconditional love for furry babies, our brand is dedicated to creating stylish, quirky, and heartwarming accessories that add charm to every wag, woof, and purr.
                </p>
                <p className="font-body text-text-body leading-relaxed">
                  From playful bandanas and bow ties to elegant collars, leashes, and customized treat jars, each product is thoughtfully designed with comfort, durability, and a touch of luxury. We love blending fun prints, trendy colors, and quality craftsmanship so your four-legged darling looks and feels absolutely paw-some.
                </p>
                <p className="font-body text-text-body leading-relaxed">
                  What started as a passion project soon grew into a space where pet parents could find accessories as unique as their fur kids. Every piece we create carries a piece of love, joy, and the belief that pets bring sparkle to our everyday lives.
                </p>
                <p className="font-body text-text-body leading-relaxed">
                  At Hezal Accessories, it&apos;s always about celebrating love, one paw at a time.
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
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-dark mb-4 leading-tight tracking-wide">
                Our Impact
              </h2>
              <p className="text-xl font-body text-text-body">
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