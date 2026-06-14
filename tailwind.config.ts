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
        gold: { DEFAULT: "#C9A84C", light: "#D4B96A", dark: "#A07830" },
      },
      fontFamily: {
        /* 大見出し：Cormorant Garamond（ラグジュアリーセリフ） */
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        /* ラベル・ナビ：Bebas Neue（コンパクト大文字） */
        label: ["var(--font-bebas)", "sans-serif"],
        /* ボディ：Inter + Noto Sans JP */
        sans: ["var(--font-inter)", "var(--font-noto)", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
