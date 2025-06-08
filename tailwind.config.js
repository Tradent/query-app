/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Earth colors
        earth: {
          50: "#f0f7f7",
          100: "#d6eaeb",
          200: "#b0d6d8",
          300: "#7cbdc1",
          400: "#4a9ea3",
          500: "#2c7f85",
          600: "#1f666d",
          700: "#1a5258",
          800: "#173e43",
          900: "#0f292d",
          950: "#071618",
        },
        forest: {
          50: "#f0f9ee",
          100: "#dcf1d7",
          200: "#bce3b3",
          300: "#92ce85",
          400: "#6ab45c",
          500: "#4d9a3f",
          600: "#3a7b2f",
          700: "#306128",
          800: "#294d24",
          900: "#1e3a1c",
          950: "#0f2010",
        },
        soil: {
          50: "#f9f6f1",
          100: "#f0e9dd",
          200: "#e1d0ba",
          300: "#d0b28e",
          400: "#c19467",
          500: "#b47c4d",
          600: "#a66941",
          700: "#8a5338",
          800: "#724433",
          900: "#5f392d",
          950: "#331c16",
        },
        // Sun colors
        sun: {
          50: "#fff9eb",
          100: "#ffefc6",
          200: "#ffdd89",
          300: "#ffc44d",
          400: "#ffa620",
          500: "#ff8c0a",
          600: "#e16500",
          700: "#bc4a02",
          800: "#983a0a",
          900: "#7c310d",
          950: "#461804",
        },
        sky: {
          50: "#f0f8ff",
          100: "#e0f0fe",
          200: "#bae2fd",
          300: "#7dcdfb",
          400: "#3ab3f5",
          500: "#0d96e6",
          600: "#0078c9",
          700: "#0061a4",
          800: "#065186",
          900: "#0a446f",
          950: "#072a49",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
