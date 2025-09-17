'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  comment: string
  date: string
  verified?: boolean
}

interface ReviewsProps {
  reviews: Review[]
  productName?: string
  averageRating?: number
  totalReviews?: number
  className?: string
}

export default function Reviews({ 
  reviews, 
  productName = "Hezal Accessories Products", 
  averageRating = 4.8, 
  totalReviews = 500,
  className = "" 
}: ReviewsProps) {
  
  // Generate review schema for SEO
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": totalReviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews.map((review) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.comment,
      "datePublished": review.date,
      "headline": review.title
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      
      <section className={`py-12 ${className}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text-dark mb-4">
              Customer Reviews
            </h2>
            
            {/* Aggregate Rating Display */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-2xl font-bold text-text-dark">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-text-body">
                ({totalReviews} reviews)
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Review Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>

                {/* Review Title */}
                {review.title && (
                  <h3 className="font-semibold text-text-dark mb-2">
                    {review.title}
                  </h3>
                )}

                {/* Review Comment */}
                <p className="text-text-body mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Author and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{review.author}</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}