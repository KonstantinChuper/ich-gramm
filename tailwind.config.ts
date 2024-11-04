import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "var(--primary-color)",
        borderColor: "var(--border-color)",
        linkColor: "var(--link-color)",
        textGrayColor: "var(--text-gray-color)",
        inputColor: "var(--input-bg)",
      },
      backgroundImage: {
        storyGradient:
          "linear-gradient(204deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".btn": {
          paddingTop: "7px",
          paddingBottom: "7px",
          borderRadius: "8px",
          fontWeight: "600",
          display: "inline-block",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "14px",
          "&:hover": {
            opacity: "0.9",
          },
          // "@media (min-width: 768px)": {
          //   padding: "10px 24px",
          //   fontSize: "18px",
          // },
        },
        ".btn-primary": {
          backgroundColor: "#0095F6",
          color: "#ffffff",
        },
        ".btn-secondary": {
          backgroundColor: "#EFEFEF",
          color: "#000000",
        },
      });
    }),
  ],
};
export default config;
