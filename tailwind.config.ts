import type { Config } from "tailwindcss";

/**
 * SĀMYA brand system.
 * Palette + type carried over from the original single-file site
 * (see reference/index.html), promoted to Tailwind tokens.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lilac: {
          DEFAULT: "#e3b8e6",
          soft: "#f0dcf1",
        },
        mauve: "#8a7690",
        plum: {
          DEFAULT: "#5a2350",
          deep: "#3d1636",
        },
        cream: "#faf6fa",
        ink: "#241022",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      letterSpacing: {
        wordmark: "0.42em",
        eyebrow: "0.28em",
      },
      borderRadius: {
        blob: "42% 58% 63% 37% / 42% 45% 55% 58%",
      },
      maxWidth: {
        prose: "68ch",
        shell: "1120px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.4s ease both",
        sway: "sway 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
