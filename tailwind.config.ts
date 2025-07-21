import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'sans': ['DM Sans', 'Nunito', 'sans-serif'],
      },
      colors: {
        'primary-pink': '#ff6b9d',
        'primary-blue': '#4ecdc4',
        'soft-yellow': '#ffe66d',
        'warm-orange': '#ff8b5a',
        'light-purple': '#a8e6cf',
        'cream': '#fef7f0',
        'soft-gray': '#f8f9fa',
        'text-dark': '#2d3436',
        'text-light': '#6A6A6A',
        'text-body': '#4D4D4D',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
