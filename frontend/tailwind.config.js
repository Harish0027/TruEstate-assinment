/****
 * Tailwind configuration wired for shadcn-inspired design tokens.
 */
import { fontFamily } from "tailwindcss/defaultTheme";

/****************
 * Tailwind Config
 ***************/
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(216 12% 84%)",
        input: "hsl(216 12% 92%)",
        ring: "hsl(210 100% 50%)",
        background: "hsl(210 20% 98%)",
        foreground: "hsl(222 47% 11%)",
        primary: {
          DEFAULT: "hsl(221 83% 53%)",
          foreground: "hsl(210 20% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(216 12% 92%)",
          foreground: "hsl(222 47% 11%)",
        },
        muted: {
          DEFAULT: "hsl(216 12% 92%)",
          foreground: "hsl(222 47% 35%)",
        },
        accent: {
          DEFAULT: "hsl(166 72% 44%)",
          foreground: "hsl(210 20% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(210 20% 98%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222 47% 11%)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      boxShadow: {
        card: "0px 10px 30px -20px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
