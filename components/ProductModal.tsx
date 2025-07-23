import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    category: string;
    description: string;
    details: string[];
    inStock: boolean;
    rating?: number;
    reviews?: number;
  };
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const allImages = [product.image, ...(product.images?.filter(Boolean) || [])];
  const [mainImage, setMainImage] = useState(allImages[0]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-center justify-center mb-4">
                <Image
                  src={mainImage}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="rounded-xl object-contain max-h-80 bg-gray-100"
                  priority
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-2 justify-center">
                  {allImages.map((img, idx) => (
                    <button
                      key={img + idx}
                      onClick={() => setMainImage(img)}
                      className={`border-2 rounded-lg p-0.5 transition-all ${mainImage === img ? 'border-primary-blue' : 'border-transparent'}`}
                      style={{ outline: 'none' }}
                    >
                      <Image
                        src={img.replace('/upload/', '/upload/w_64,h_64,c_fill,q_auto,f_auto/')}
                        alt={`Thumbnail ${idx + 1}`}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-text-dark mb-2">{product.title}</h2>
              <p className="text-text-light text-sm mb-1">{product.category}</p>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-lg font-bold text-primary-pink">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base line-through text-gray-400">₹{product.originalPrice}</span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-1">Description</h3>
                <p className="text-text-light text-sm">{product.description}</p>
              </div>
              {product.details && product.details.length > 0 && (
                <div>
                  <h3 className="font-semibold text-text-dark mb-1">Product Details</h3>
                  <ul className="list-disc pl-5 text-sm text-text-light">
                    {product.details.filter(Boolean).map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              {typeof product.rating === 'number' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500 font-bold">★ {product.rating}</span>
                  {product.reviews ? <span className="text-xs text-gray-500">({product.reviews} reviews)</span> : null}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
