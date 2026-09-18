/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1B1D22',
          soft: '#5C606A',
          faint: '#9497A0',
        },
        paper: {
          DEFAULT: '#F7F7F1',
          raised: '#FFFFFF',
        },
        chrome: {
          DEFAULT: '#15171C',
          raised: '#1D2027',
          line: '#2B2F38',
        },
        citrus: {
          DEFAULT: '#D7E028',
          dim: '#AEB520',
          soft: '#F4F6D2',
        },
        rind: {
          DEFAULT: '#1F6F63',
          soft: '#DCEEE9',
        },
        amber: {
          DEFAULT: '#C8842A',
          soft: '#F5E6CE',
        },
        cherry: {
          DEFAULT: '#B4402F',
          soft: '#F5DAD5',
        },
        line: '#E4E2D8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '5px',
      },
    },
  },
  plugins: [],
}
