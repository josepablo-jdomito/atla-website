import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wld: {
          paper: '#FFF9EF',
          white: '#FFFFFF',
          ink: '#1D1D1D',
          blue: '#160FCF',
        },
        card: '#F3EFE8',
        border: 'rgba(29, 29, 29, 0.12)',
        muted: 'rgba(29, 29, 29, 0.68)',
      },
      fontFamily: {
        primary: [
          'Parabolica',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Times Now',
          'Times New Roman',
          'Times',
          'serif',
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
