/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0f1117',
        surface: '#1a1d27',
        card: '#21252f',
        border: '#2e3347',
        accent: '#6366f1',
        'accent-hover': '#4f52e0',
        muted: '#8b8fa8',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}
