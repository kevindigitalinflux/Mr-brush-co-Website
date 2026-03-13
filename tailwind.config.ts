import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ivory:'#F5F4EF', charcoal:'#3d3b3a', slate:'#434b4d', green:'#2f4a3d', brass:'#B8A77A' },
      fontFamily: { heading:['Poppins','sans-serif'], body:['Lato','sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config
