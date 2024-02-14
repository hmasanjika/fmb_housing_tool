/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#7500c0", //corePurple2
          secondary: "#a100ff", //corePurple1
          accent: "#e6dcff", //accentPurple5
          neutral: "#96968c", //darkGray
          "base-100": "#fff",
          info: "#0041f0",
          success: "#05f0a5",
          warning: "#ffeb32",
          error: "#ff3246",
          "--rounded-box": "0.3rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.3rem", // XX border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-text-case": "uppercase", // set default text transform for buttons
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.3rem", // border radius of tabs
        },
      },
    ],
  },
};
