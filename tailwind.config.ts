import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — pulled straight from the design brief.
        brand: {
          maroon: '#801a1a',   // primary accent — buttons, top bar, headings
          maroonDark: '#5e1313', // hover/darker state for maroon elements
          dark: '#0b0c10',     // navbar + footer background
          bg: '#fcfaf7',       // warm off-white page background
        },
      },
      fontFamily: {
        // Elegant serif for headings (Playfair Display), clean sans for body (Inter).
        // Actual font loading happens via next/font in app/layout.tsx, which
        // exposes them as the --font-serif / --font-sans CSS variables below.
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -4px rgba(11, 12, 16, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
