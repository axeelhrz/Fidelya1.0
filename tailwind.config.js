/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
        // Educational theme colors
        education: {
          primary: "#1e293b",
          secondary: "#475569",
          accent: "#059669",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      animation: {
        "gentle-float": "gentle-float 4s ease-in-out infinite",
        "soft-pulse": "soft-pulse 3s ease-in-out infinite",
        "elegant-slide": "elegant-slide 0.6s ease-out",
        "subtle-glow": "subtle-glow 2s ease-in-out infinite",
        "content-appear": "content-appear 0.8s ease-out",
      },
      keyframes: {
        "gentle-float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
        "soft-pulse": {
          "0%, 100%": {
            opacity: "0.8",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.02)",
          },
        },
        "elegant-slide": {
          "0%": {
            transform: "translateX(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "subtle-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
          },
        },
        "content-appear": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        'elegant': '20px',
      },
    },
  },
  plugins: [],
}
