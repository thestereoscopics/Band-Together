import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "460px",
      },
      colors: {
        background: "#1a1a2e", // Deep dark blue for a moody 80's vibe
        foreground: "#eaeaea", // Light off-white for contrast
        primary: {
          50: "#eae4fc", // Soft lavender
          100: "#d2c4f9", // Light purple
          200: "#b39ef7", // Muted purple-blue
          300: "#9277f5", // Vibrant purple
          400: "#7b58f2", // Bold electric purple
          500: "#6a3ee6", // Deep indigo
          600: "#582cc4", // Rich dark purple
          700: "#431fa3", // Dark violet
          800: "#31147e", // Deep purple-blue
          900: "#1f0c5a", // Almost black blue
          950: "#14083b", // Midnight purple
        },
        accent: {
          50: "#ffeef6", // Soft pink
          100: "#ffd6ec", // Cotton candy pink
          200: "#ffb3e3", // Pastel hot pink
          300: "#ff8fd9", // Vibrant pink
          400: "#ff6cd0", // Electric pink
          500: "#ff3aba", // Deep magenta
          600: "#e600a9", // Hot magenta
          700: "#b80087", // Dark pink-purple
          800: "#8c0068", // Deep magenta
          900: "#5f0046", // Dark plum
          950: "#3b002c", // Midnight magenta
        },
        neon: {
          50: "#e3faff", // Light aqua
          100: "#c3f4ff", // Soft neon blue
          200: "#93f1ff", // Light electric blue
          300: "#4be8ff", // Bright cyan
          400: "#00e1ff", // Bold neon cyan
          500: "#00c7e6", // Deep cyan
          600: "#00a1b8", // Ocean blue
          700: "#00798c", // Deep teal
          800: "#00575f", // Dark teal
          900: "#00363b", // Deep blue-green
          950: "#001f24", // Almost black teal
        },
        gold: {
          50: "#fff5e1", // Soft gold shimmer
          100: "#ffebc4", // Light gold
          200: "#ffd18a", // Metallic gold
          300: "#ffb94f", // Rich gold
          400: "#ffa51a", // Bold gold
          500: "#e68a00", // Deep gold-orange
          600: "#b87300", // Burnished gold
          700: "#8c5c00", // Deep metallic gold
          800: "#5f3d00", // Dark gold
          900: "#3b2700", // Almost brown gold
          950: "#241800", // Deepest gold-brown
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
