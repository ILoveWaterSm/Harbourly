import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        surface: "#FFFFFF",
        accent: "#22C55E",
        "accent-dark": "#166534",
        "primary-text": "#111827",
        "secondary-text": "#6B7280",
        border: "#D1D5DB",
        error: "#EF4444",
        success: "#10B981",
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        input: "6px",
        button: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
