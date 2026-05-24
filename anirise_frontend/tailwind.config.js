/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        '200': '200% 200%',
      },
      boxShadow: {
        aqua: '0 4px 20px rgba(0, 255, 255, 0.3)',
      },
      animation: {
        'gradient-flow': 'gradientFlow 8s ease infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      colors: {
        main: "var(--text-main)",
        secondary: "var(--text-secondary)",
        bg: "var(--bg-main)",
        surface: "var(--bg-surface)",
        card: "var(--card-bg)",
        accent: "var(--accent)",
        hoverbg: "var(--hover-bg)",
      },
    },
  },
  plugins: [],
}