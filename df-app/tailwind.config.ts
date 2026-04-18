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
        ink: "#1A1E1D",
        "deep-teal": "#005151",
        "off-white": "#FFFEFE",
        "level-1": "#F7F8F8",
        "level-2": "#EBEEED",
        "level-3": "#D9DCB8",
        "secondary-text": "#556260",
        "tertiary-text": "#6F7A77",
        "sidebar-text": "#686873",
        "selected-bg": "#E6F2F2",
        "primary-action": "#005151",
        success: "#059669",
        caution: "#D97706",
        error: "#DC2626",
        info: "#2563EB",
      },
      fontFamily: {
        literata: ["var(--font-literata)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      fontSize: {
        "display-hero": ["57px", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.25px" }],
        "display-lg": ["45px", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "0px" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "400", letterSpacing: "0px" }],
        "headline-md": ["28px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0px" }],
        "headline-sm": ["24px", { lineHeight: "1.3", fontWeight: "400", letterSpacing: "0px" }],
        "title-lg": ["22px", { lineHeight: "1.3", fontWeight: "500", letterSpacing: "0px" }],
        "body-lg": ["16px", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.5px" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.25px" }],
        "label-lg": ["14px", { lineHeight: "1.4", fontWeight: "400", letterSpacing: "0.25px" }],
        "label-md": ["13px", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.5px" }],
        "label-sm": ["11px", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.5px" }],
        "code-sm": ["12px", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0px" }],
        "code-lg": ["16px", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0px" }],
      },
      borderRadius: {
        tight: "4px",
        standard: "6px",
        comfortable: "8px",
        featured: "12px",
        pill: "9999px",
      },
      spacing: {
        "4.5": "18px",
        "5.5": "22px",
        "15": "60px",
        "18": "72px",
        "20": "80px",
      },
      width: {
        sidebar: "200px",
      },
    },
  },
  plugins: [],
};
export default config;
