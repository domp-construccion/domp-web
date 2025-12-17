import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#101932",
          dark: "#101932",
        },
        accent: {
          DEFAULT: "#F18121",
          hover: "#e0771a",
        },
        background: {
          light: "#EDEDED",
        },
        text: {
          dark: "#171719",
        },
      },
    },
  },
  plugins: [],
};
export default config;

