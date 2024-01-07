/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./login.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                dark: {
                    50: "#101010",
                    100: "#171717",
                    200: "#1e1e1e",
                    300: "#232323",
                    400: "#2a2a2a",
                    500: "#323232",
                    600: "#393939",
                    700: "#404040",
                    800: "#484848",
                    900: "#aaa",
                },
            },
        },
        colors: {
            success: "#56df74",
            error: "#ff5a5a",
        },
    },
    plugins: [require("rippleui")],
};
