/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f7',
          100: '#d5e0ef',
          600: '#2b6cb0',
          700: '#1a4f8a',
          800: '#1a365d',
          900: '#0f2444',
        },
        gold: {
          400: '#e8c96a',
          500: '#d4a017',
          600: '#b8860b',
        },
      },
      fontFamily: {
        sans: [
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          '"Noto Sans JP"',
          'Meiryo',
          'sans-serif',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: '1.9',
            'h2': { marginTop: '2em', marginBottom: '0.75em' },
            'h3': { marginTop: '1.5em', marginBottom: '0.5em' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
