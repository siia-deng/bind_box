import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f3f0e4",
        ink: "#0a0a08",
        muted: "#6f6b5d",
        line: "#1b1a16",
        coral: "#e9745f",
        mint: "#68bfa8",
        gold: "#eacb62",
        sky: "#6fa4ca"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        poster: ["Arial Black", "Impact", "Arial", "sans-serif"]
      },
      boxShadow: {
        sketch: "0 0 0 2px #111, 8px 8px 0 rgba(10,10,8,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
