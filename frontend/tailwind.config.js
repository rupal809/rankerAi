/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support toggling dark mode via class
  theme: {
    extend: {
      colors: {
        darkBg: {
          900: '#030712', // Deep space black
          800: '#0b0f19', // Dark card background
          700: '#1f2937', // Hover state dark
        },
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#6366f1', // Indigo glow
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        accent: {
          violet: '#8b5cf6',
          fuchsia: '#d946ef',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glassAccent: '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
      },
      backdropFilter: {
        glass: 'blur(12px)',
      }
    },
  },
  plugins: [],
}
