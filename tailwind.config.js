/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#111827',
        'bg-secondary': '#f9fafb',
        'bg-tertiary': '#ffffff',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'text-light': '#f9fafb',
        'border-color': '#e5e7eb',
        'accent-color': '#4f46e5',
        'accent-hover': '#4338ca',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}