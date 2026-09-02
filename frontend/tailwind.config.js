/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#0B0B0B',
        ink: '#F5F5F5',
        inksoft: '#B5B5B5',
        brass: '#FF6A00',
        brasssoft: '#2A1307',
        sage: '#FB923C',
        sagesoft: '#21140C',
        rust: '#F97316',
        rustsoft: '#2E1208',
        line: '#2D2D2D',
      },
      fontFamily: {
        serif: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
