import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wld: {
          paper: 'rgb(var(--wld-paper-rgb) / 1)',
          white: 'rgb(var(--wld-white-rgb) / 1)',
          ink: 'rgb(var(--wld-ink-rgb) / 1)',
          blue: 'rgb(var(--wld-blue-rgb) / 1)',
          accent: 'rgb(var(--wld-accent-rgb) / 1)',
        },
        card: 'rgb(var(--wld-card-rgb) / 1)',
        border: 'rgb(var(--wld-border-rgb) / 0.10)',
        muted: 'rgb(var(--wld-muted-rgb) / 0.45)',
      },
      fontFamily: {
        primary: [
          'Parabolica Text',
          'Parabolica',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'JHA Times',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
      },
      borderRadius: {
        card: '12px',
        'card-lg': '18px',
      },
      maxWidth: {
        container: '1180px',
        article: '720px',
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
        '16/9': '16 / 9',
      },
      letterSpacing: {
        label: '0.08em',
        widest: '0.12em',
      },
      boxShadow: {
        'card-hover': '0 8px 32px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.05)',
        'feature': '0 20px 60px rgba(0,0,0,0.15)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
