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
        },
        card: 'rgb(var(--wld-card-rgb) / 1)',
        border: 'rgb(var(--wld-border-rgb) / 0.12)',
        muted: 'rgb(var(--wld-muted-rgb) / 0.68)',
      },
      fontFamily: {
        primary: [
          'Parabolica Text',
          'Parabolica',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Parabolica',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '16px',
      },
      maxWidth: {
        container: '1180px',
        article: '720px',
      },
      aspectRatio: {
        '4/5': '4 / 5',
      },
    },
  },
  plugins: [],
}

export default config
