export interface SizePricing {
  size: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  sizePricing?: SizePricing[]; // Array of size-based pricing
  image: string;
  images?: string[]; // Optional array for additional images
  category: string;
  collection?: string; // New field for collections
  description: string;
  details: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const categories = [
  'All',
  'Bandana/neck scarf',
  'Bow ties',
  'Collars',
  'Collar-leash set',
  'Treat Jars'
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '400ml', '900ml', '1000ml'];

export const products: Product[] = [
  {
    id: '1',
    title: 'Premium Leather Dog Collar',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Collars',
    description: 'Handcrafted premium leather collar with adjustable sizing and comfortable padding.',
    details: [
      'Made from genuine leather',
      'Adjustable size (30-45cm)',
      'Soft padding for comfort',
      'Durable metal buckle',
      'Available in multiple colors'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    title: 'Stylish Pet Bandana',
    price: 299,
    originalPrice: 449,
    image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bandana/neck scarf',
    description: 'Soft cotton bandana perfect for any occasion. Machine washable and comfortable.',
    details: [
      '100% cotton material',
      'Machine washable',
      'Adjustable tie closure',
      'Multiple colors available',
      'Lightweight and breathable'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: '3',
    title: 'Elegant Bow Tie',
    price: 399,
    originalPrice: 599,
    image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bow ties',
    description: 'Perfect for special occasions. Adjustable bow tie that makes your pet look dapper.',
    details: [
      'Premium fabric construction',
      'Adjustable neck strap',
      'Easy clip-on design',
      'Perfect for photos',
      'Multiple patterns available'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: '4',
    title: 'Collar & Leash Set',
    price: 1299,
    originalPrice: 1799,
    image: 'https://images.pexels.com/photos/7210758/pexels-photo-7210758.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Collar-leash set',
    description: 'Matching collar and leash set made from durable materials with comfortable padding.',
    details: [
      'Matching collar and leash',
      'Durable nylon construction',
      'Comfortable padding',
      'Strong metal hardware',
      'Available in multiple colors'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: '5',
    title: 'Ceramic Treat Jar',
    price: 799,
    originalPrice: 1099,
    image: 'https://images.pexels.com/photos/5731838/pexels-photo-5731838.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Treat Jars',
    description: 'Beautiful ceramic treat jar to keep your pet\'s treats fresh and organized.',
    details: [
      'Food-grade ceramic',
      'Airtight seal lid',
      'Easy to clean',
      'Decorative design',
      'Keeps treats fresh'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 267
  },
  {
    id: '6',
    title: 'Floral Bandana',
    price: 349,
    originalPrice: 499,
    image: 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bandana/neck scarf',
    description: 'Beautiful floral pattern bandana perfect for spring and summer outings.',
    details: [
      'Soft cotton blend',
      'Floral print design',
      'Snap closure',
      'Machine washable',
      'Fade resistant colors'
    ],
    inStock: true,
    rating: 4.6,
    reviews: 98
  },
  {
    id: '7',
    title: 'Formal Bow Tie Set',
    price: 699,
    originalPrice: 999,
    image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bow ties',
    description: 'Set of 3 formal bow ties for special occasions and photo sessions.',
    details: [
      'Set of 3 bow ties',
      'Different formal patterns',
      'Adjustable straps',
      'Premium materials',
      'Perfect for weddings'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 145
  },
  {
    id: '8',
    title: 'Designer Collar',
    price: 1199,
    originalPrice: 1599,
    image: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Collars',
    description: 'Premium designer collar with rhinestone details and soft padding.',
    details: [
      'Rhinestone embellishments',
      'Soft leather padding',
      'Adjustable sizing',
      'Durable construction',
      'Elegant design'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 178
  },
  {
    id: '9',
    title: 'Glass Treat Jar with Lid',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.pexels.com/photos/7210733/pexels-photo-7210733.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Treat Jars',
    description: 'Clear glass treat jar with bamboo lid for easy treat storage and access.',
    details: [
      'Clear glass construction',
      'Bamboo lid with seal',
      'Dishwasher safe',
      'Large capacity',
      'Modern design'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: '10',
    title: 'Luxury Collar & Leash Set',
    price: 1899,
    originalPrice: 2499,
    image: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Collar-leash set',
    description: 'Luxury leather collar and leash set with gold hardware and premium finishing.',
    details: [
      'Genuine leather construction',
      'Gold-plated hardware',
      'Hand-stitched details',
      'Premium quality',
      'Luxury gift box included'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 167
  },
  {
    id: '11',
    title: 'Polka Dot Bandana',
    price: 279,
    originalPrice: 399,
    image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bandana/neck scarf',
    description: 'Cute polka dot bandana that adds a playful touch to your pet\'s look.',
    details: [
      'Polka dot pattern',
      'Soft cotton fabric',
      'Tie closure',
      'Multiple color options',
      'Easy care'
    ],
    inStock: true,
    rating: 4.6,
    reviews: 112
  },
  {
    id: '12',
    title: 'Wooden Treat Jar',
    price: 1099,
    originalPrice: 1499,
    image: 'https://images.pexels.com/photos/7210766/pexels-photo-7210766.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Treat Jars',
    description: 'Handcrafted wooden treat jar with personalization option and secure lid.',
    details: [
      'Handcrafted wood',
      'Personalization available',
      'Secure lid mechanism',
      'Natural finish',
      'Eco-friendly material'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 189
  },
  {
    id: '13',
    title: 'Velvet Bow Tie',
    price: 549,
    originalPrice: 799,
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bow ties',
    description: 'Luxurious velvet bow tie perfect for formal events and special occasions.',
    details: [
      'Premium velvet material',
      'Rich color options',
      'Comfortable fit',
      'Easy attachment',
      'Elegant appearance'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 92
  },
  {
    id: '14',
    title: 'Studded Collar',
    price: 999,
    originalPrice: 1399,
    image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Collars',
    description: 'Edgy studded collar for pets with attitude. Comfortable and stylish.',
    details: [
      'Metal studs decoration',
      'Durable leather base',
      'Adjustable sizing',
      'Strong buckle',
      'Unique design'
    ],
    inStock: true,
    rating: 4.5,
    reviews: 134
  },
  {
    id: '15',
    title: 'Complete Collar-Leash Bundle',
    price: 1599,
    originalPrice: 2199,
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Collar-leash set',
    description: 'Complete bundle with collar, leash, and matching waste bag holder.',
    details: [
      'Collar, leash & bag holder',
      'Matching design',
      'Durable materials',
      'Complete walking set',
      'Great value bundle'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 156
  }
];