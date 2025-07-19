import Link from 'next/link';
import { Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-pink to-warm-orange rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-pink">Hezal Accessories</h3>
                <p className="text-sm text-gray-300">Your pet deserves only the BEST</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              We provide premium quality pet accessories to keep your furry friends happy, healthy, and stylish.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Mail className="w-4 h-4" />
              <span>hezal.accessories@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-blue">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-primary-pink transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-primary-pink transition-colors">About</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-primary-pink transition-colors">Products</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-primary-pink transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-blue">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-primary-pink transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-pink transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-pink transition-colors">Return Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-primary-pink transition-colors">Shipping Info</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 Hezal Accessories. All rights reserved.
          </p>
          <p className="text-gray-300 text-sm mt-2 md:mt-0">
            Developed with ❤️ for pet lovers
          </p>
        </div>
      </div>
    </footer>
  );
}