import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        md: "810px",
      },
      colors: {
        primaryColor: "var(--primary-color)",
        borderColor: "var(--border-color)",
        linkColor: "var(--link-color)",
        textGrayColor: "var(--text-gray-color)",
        inputColor: "var(--input-bg)",
        bgColorLight: "var(--bg-color-light)",
        background: "var(--bg-color)",
        bgColorSecondary: "var(--bg-color-secondary)",
      },
      backgroundColor: {
        primary: "var(--bg-color)",
        secondary: "var(--bg-color-light)",
      },
      textColor: {
        primary: "var(--text-color)",
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
        ".aside-margin": {
          "margin-left": "0",
          "@screen sm": {
            "margin-left": "64px",
          },
          "@screen md": {
            "margin-left": "245px",
          },
        },
        ".link-hover": {
          "&:hover": {
            color: "var(--text-gray-color)",
            transition: "color 0.3s ease",
          },
        },
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
    require("flowbite/plugin")({
      theme: {
        darkMode: true,
        extend: {
          colors: {
            primary: {
              ring: "var(--text-gray-color)",
              border: "var(--text-gray-color)",
            },
            dark: {
              primary: "var(--dark-primary)",
              secondary: "var(--dark-secondary)",
              background: "var(--dark-background)",
              text: "var(--dark-text)",
            },
          },
        },
      },
    }),
  ],
};
export default config;
