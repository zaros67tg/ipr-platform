// postcss.config.mjs
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

const config = {
  plugins: {
    // Process @import statements first
    'postcss-import': {},
    // Tailwind CSS v4 (your current setup)
    '@tailwindcss/postcss': {},
    // Add vendor prefixes for better browser support
    autoprefixer: {},
  },
};

export default config;