import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#D1D5DB',
        accent: {
          DEFAULT: '#22C55E',
          dark: '#166534',
        },
        success: '#10B981',
        error: '#EF4444',
        overlay: 'rgba(11, 15, 20, 0.8)',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        button: '6px',
        avatar: '50%',
      },
      boxShadow: {
        subtle: '0 1px 4px rgba(0,0,0,0.1)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(to bottom right, #22C55E, #166534)',
      },
    },
  },
  plugins: [],
}
export default config
