import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cozy: {
                    cream: {
                        50: '#FCFAF7',
                        100: '#F7F2EB',
                        200: '#F0E5D8',
                        300: '#E6D5C3',
                        400: '#D7C0A9',
                        500: '#C4A484',
                    },
                    brown: {
                        50: '#F7F5F2',
                        100: '#EBE5DF',
                        200: '#D5C9BE',
                        300: '#BEAC9D',
                        400: '#A48E7C',
                        500: '#8B5E3C', // Warm Oak
                        600: '#754D30',
                        700: '#5F3E26',
                        800: '#4A301D',
                        900: '#372213', // Dark Wood Bark
                    }
                }
            }
        },
    },

    plugins: [forms],
};
