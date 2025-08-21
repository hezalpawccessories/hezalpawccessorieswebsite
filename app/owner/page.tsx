'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Heart, Award, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function Owner() {
   return (
      <>
         <Navbar />
         <main className='gradient-bg'>
            {/* Hero Section */}
            <section className='py-20'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-16'
                  >
                     <h1 className='text-4xl md:text-6xl font-heading font-extrabold text-text-dark mb-6 leading-tight tracking-wide'>
                        Meet the <span className='text-primary-pink'>Owner</span>
                     </h1>
                     <p className='text-xl font-body text-text-body max-w-3xl mx-auto'>
                        Get to know the passionate pet lover behind Hezal Accessories
                     </p>
                  </motion.div>

                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='relative'
                     >
                        <div className='bg-gradient-to-br from-primary-pink to-warm-orange p-2 rounded-3xl'>
                           <Image
                              src='https://res.cloudinary.com/dt2qyj4lj/image/upload/v1755749075/rivykj109ic1clmsmrnh.jpg'
                              alt='Owner with pets'
                              width={600}
                              height={384}
                              className='w-full h-96 object-contain rounded-2xl'
                              priority
                           />
                        </div>
                        <div className='absolute -bottom-4 -right-4 bg-soft-yellow p-4 rounded-2xl shadow-lg space-y-1'>
                           <p className='font-bold text-text-dark text-center'>🐾 Paws & kisses,</p>
                           <p className='text-sm text-text-light text-center'>Hezal Garg , Founder & CEO </p>
                        </div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className='space-y-6'
                     >
                        {/* <div>
                           <h2 className='text-3xl font-bold text-text-dark mb-2'>Hezal Garg</h2>
                           <p className='text-xl text-primary-pink font-semibold'>Founder & CEO</p>
                        </div> */}

                        <p className='text-text-light leading-relaxed'>
                           Woof woof! I’m Hezal, a fun-loving Labrador and the proud Top Dog behind Hezal Accessories
                           ! Ever since I was a wiggly pup, I knew life was too short for boring collars and plain
                           leashes. So, with a wagging tail and a big dream, I convinced my humans to help me create a
                           pawsome range of stylish bandanas, dapper bow ties, comfy collars, sturdy leashes, and treat
                           jars full of tail-wagging surprises!
                        </p>

                        <p className='text-text-light leading-relaxed'>
                           From playful prints to timeless classics, each piece is designed with love, tested on long
                           walks (and occasional squirrel chases!), and approved with a happy woof.
                        </p>

                        <p className='text-text-light leading-relaxed'>
                           {' '}
                           When I’m not busy sniffing out new designs, you’ll find me rolling in the grass, sampling
                           tasty treats, or giving my humans that “one more belly rub, please” look. Thank you for
                           stopping by my little corner of the internet. I hope my collection adds a little extra wag to
                           your day. After all, life’s better with style, treats, and a wagging tail!
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                           <div className='flex items-center space-x-3'>
                              <Calendar className='w-5 h-5 text-primary-blue' />
                              <span className='text-text-light'>Founded in 2022</span>
                           </div>
                           {/* <div className='flex items-center space-x-3'>
                              <Award className='w-5 h-5 text-primary-blue' />
                              <span className='text-text-light'>Pet Care Expert</span>
                           </div> */}
                           {/* <div className='flex items-center space-x-3'>
                              <Heart className='w-5 h-5 text-primary-blue' />
                              <span className='text-text-light'>Animal Welfare Advocate</span>
                           </div> */}
                           <div className='flex items-center space-x-3'>
                              <MapPin className='w-5 h-5 text-primary-blue' />
                              <span className='text-text-light'>Meerut, India</span>
                           </div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Personal Story Section */}
            {/* <section className='py-20 bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-16'
                  >
                     <h2 className='text-3xl md:text-4xl font-bold text-text-dark mb-4'>My Pet Family</h2>
                     <p className='text-xl text-text-light'>The inspiration behind everything we do</p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                     {[
                        {
                           name: 'Hezal',
                           breed: 'Golden Retriever',
                           age: '5 years',
                           image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
                           story: 'My first rescue and the inspiration for starting Hezal Accessories. Max loves his premium collar collection!',
                        },
                        // {
                        //    name: 'Luna',
                        //    breed: 'Persian Cat',
                        //    age: '3 years',
                        //    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600',
                        //    story: 'Our princess who tests all our cat accessories. She&apos;s very particular about comfort and style!',
                        // },
                        // {
                        //    name: 'Rocky',
                        //    breed: 'Beagle Mix',
                        //    age: '2 years',
                        //    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
                        //    story: 'The newest addition to our family. Rocky is our official toy tester and loves interactive games!',
                        // },
                     ].map((pet, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-soft-gray rounded-2xl overflow-hidden shadow-lg card-hover'
                        >
                           <Image
                              src={pet.image}
                              alt={pet.name}
                              width={600}
                              height={192}
                              className='w-full h-48 object-cover'
                           />
                           <div className='p-6'>
                              <h3 className='text-xl font-bold text-text-dark mb-1'>{pet.name}</h3>
                              <p className='text-primary-pink font-semibold mb-1'>{pet.breed}</p>
                              <p className='text-text-light text-sm mb-3'>{pet.age}</p>
                              <p className='text-text-light text-sm'>{pet.story.replace(/'/g, '&apos;')}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section> */}

            {/* Vision Section */}
            <section className='py-20 bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='space-y-6'
                     >
                        <h2 className='text-3xl font-bold text-text-dark'>My Vision</h2>
                        <p className='text-text-light leading-relaxed'>
                           I envision a world where every pet owner has access to high-quality, affordable accessories
                           that enhance their pet&apos;s life. Through Hezal Accessories, I want to create a community
                           of pet lovers who share the same passion for giving their furry friends the best.
                        </p>
                        <p className='text-text-light leading-relaxed'>
                           My goal is not just to sell products, but to build lasting relationships with pet families
                           and contribute to the overall well-being of pets everywhere. Every purchase supports our
                           mission to make pet care more accessible and enjoyable.
                        </p>
                        <div className='bg-primary-blue/10 p-6 rounded-2xl'>
                           <p className='text-primary-blue font-semibold italic'>
                              &quot;Every pet deserves to feel loved, comfortable, and special. That&apos;s not just our
                              tagline &ndash; it&apos;s my personal promise to every customer.&quot;
                           </p>
                        </div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                     >
                        <Image
                           src='https://res.cloudinary.com/dt2qyj4lj/image/upload/v1755749160/zzjqry7w9fxtmuugxuyr.jpg'
                           alt='Pet care vision'
                           width={600}
                           height={384}
                           className='w-full h-96 object-cover rounded-2xl shadow-2xl'
                           priority
                        />
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Contact Section */}
            <section className='py-20 bg-gradient-to-r from-primary-pink to-warm-orange'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                  >
                     <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>Let&apos;s Connect!</h2>
                     <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
                        I&apos;d love to hear from you and your pets! Feel free to reach out with any questions,
                        suggestions, or just to share your pet&apos;s story.
                     </p>
                     <div className='flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8'>
                        <div className='flex items-center space-x-2 text-white'>
                           <Mail className='w-5 h-5' />
                           <span>hezalpawccessories@gmail.com</span>
                        </div>
                        <div className='flex items-center space-x-2 text-white'>
                           <Phone className='w-5 h-5' />
                           <span>+91 70602 66900</span>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </section>
         </main>
         <Footer />
      </>
   )
}
