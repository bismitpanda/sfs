/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./login.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [require("rippleui")],
};
