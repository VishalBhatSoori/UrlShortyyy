/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    "@tailwindcss/postcss",
    "autoprefixer", // It's best practice to add autoprefixer as well
  ],
};

export default config;