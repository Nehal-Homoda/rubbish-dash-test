/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background))",
        foreground: "rgb(var(--color-foreground))",
        muted: "rgb(var(--color-muted))",
        surface: {
          DEFAULT: "rgb(var(--color-surface))",
          100: "rgb(var(--color-surface-100))",
          200: "rgb(var(--color-surface-200))",
          300: "rgb(var(--color-surface-300))",
          400: "rgb(var(--color-surface-400))",
          500: "rgb(var(--color-surface-500))",
          600: "rgb(var(--color-surface-600))",
          700: "rgb(var(--color-surface-700))",
          800: "rgb(var(--color-surface-800))",
          900: "rgb(var(--color-surface-900))",
          light: {
            DEFAULT: "rgb(var(--color-surface-light))",
            100: "rgb(var(--color-surface-light-100))",
            200: "rgb(var(--color-surface-light-200))",
            300: "rgb(var(--color-surface-light-300))",
            400: "rgb(var(--color-surface-light-400))",
            500: "rgb(var(--color-surface-light-500))",
            600: "rgb(var(--color-surface-light-600))",
            700: "rgb(var(--color-surface-light-700))",
            800: "rgb(var(--color-surface-light-800))",
          },
        }
      },
    },
  },
  plugins: [],
};
