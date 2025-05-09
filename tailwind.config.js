/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#f4511e',
                secondary: '#666666',
                success: '#4CAF50',
                danger: '#F44336',
                background: '#f5f5f5',
            },
        },
    },
    plugins: [],
} 