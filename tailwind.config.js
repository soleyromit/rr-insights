import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        bg4: 'var(--bg4)',
        accent: 'var(--accent)',
        teal: 'var(--teal)',
        amber: 'var(--amber)',
        coral: 'var(--coral)',
        green: 'var(--green)',
        blue: 'var(--blue)',
        pink: 'var(--pink)',
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['Instrument Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
