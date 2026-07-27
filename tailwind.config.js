/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1D4D3A',
          hover: '#153C2D',
          light: '#28684F',
          dark: '#123326',
        },
        emerald: {
          DEFAULT: '#2D7A57',
          light: '#3C9B70',
        },
        gold: {
          DEFAULT: '#C8A65A',
          hover: '#B59347',
          light: '#F4ECDA',
          muted: '#E5D3A6',
        },
        surface: {
          DEFAULT: '#F8F8F7',
          secondary: '#F3F4F5',
          tertiary: '#EAEBEC',
        },
        charcoal: {
          DEFAULT: '#202124',
          muted: '#666666',
          light: '#4A4A4A',
        },
        border: {
          DEFAULT: '#E9ECEF',
          dark: '#D0D5DD',
        },
        accent: {
          success: '#3D8B5A',
          danger: '#B54747',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      borderRadius: {
        '2xl': '24px',
        'xl': '20px',
        'lg': '16px',
        'md': '12px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(29, 77, 58, 0.06)',
        'glass-hover': '0 12px 40px 0 rgba(29, 77, 58, 0.12)',
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.04)',
        'floating': '0 30px 60px -12px rgba(29, 77, 58, 0.15)',
        'card-hover': '0 20px 40px -15px rgba(29, 77, 58, 0.12)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
