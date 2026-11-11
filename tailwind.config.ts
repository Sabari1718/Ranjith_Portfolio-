import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07070a",
        foreground: "#f4f4f6",
        dark: {
          950: "#050507",
          900: "#08080c",
          850: "#0d0d14",
          800: "#13131d",
          750: "#181825",
          700: "#222233",
          600: "#323247",
        },
        electric: {
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          glow: "rgba(168, 85, 247, 0.4)",
        },
        neon: {
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          orange: "#ff6b00",
          glow: "rgba(255, 107, 0, 0.4)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero": "radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.18) 0%, rgba(255, 107, 0, 0.1) 40%, transparent 70%)",
        "mesh-glow": "radial-gradient(at 0% 0%, rgba(168,85,247,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255,107,0,0.15) 0px, transparent 50%)",
        "cinema-gradient": "linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(255, 107, 0, 0.08) 100%)",
      },
      boxShadow: {
        "glow-purple": "0 0 35px -5px rgba(168, 85, 247, 0.4)",
        "glow-orange": "0 0 35px -5px rgba(255, 107, 0, 0.4)",
        "glow-combo": "0 0 45px -5px rgba(168, 85, 247, 0.25), 0 0 25px -5px rgba(255, 107, 0, 0.25)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "glow-shift": "glowShift 8s ease infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glowShift: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
