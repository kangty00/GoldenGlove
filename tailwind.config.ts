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
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          deep: "#001A3D",
          accent: "#002B66",
          light: "#E6EDF5",
        },
        slate: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          900: "#212529",
        },
        "diamond-gold": "#DAA520",
      },
      backgroundImage: {
        'modern-gradient': 'linear-gradient(180deg, #001A3D 0%, #000D1F 100%)',
      },
      borderRadius: {
        "base-square": "4px",
      }
    },
  },
  plugins: [],
};
export default config;
