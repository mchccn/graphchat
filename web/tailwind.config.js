const defaults = require("tailwindcss/defaultConfig");

module.exports = {
  darkMode: "class",
  purge: ["./src/**/*.tsx"],
  theme: {
    colors: {
      ...defaults.theme.colors,
      primary: {
        100: "var(--color-primary-100)",
        200: "var(--color-primary-200)",
        300: "var(--color-primary-300)",
        600: "var(--color-primary-600)",
        700: "var(--color-primary-700)",
        800: "var(--color-primary-800)",
        900: "var(--color-primary-900)",
      },
      accent: {
        DEFAULT: "var(--color-accent)",
        glow: "var(--color-accent-glow)",
        hover: "var(--color-accent-hover)",
      },
      black: "#000000",
    },
  },
  variants: {},
  plugins: [],
};
