import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NProgressProvider from '@/components/NProgressProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hezal Accessories - Your pet deserves only the BEST',
  description: 'Premium pet accessories for your beloved companions. Dog accessories, toys, treats and more.',
  keywords: 'pet accessories, dog accessories, pet toys, pet treats, pet care',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NProgressProvider />
        {children}
      </body>
    </html>
  );
}
