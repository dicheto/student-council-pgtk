import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0047AB', // Deep Blue
          light: '#87CEEB',   // Sky Blue
          dark: '#003366',
          glow: '#5B9BD5',
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber
          light: '#FCD34D',
          dark: '#D97706',
          glow: '#FFB84D',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0a1929', // Deep navy, not pure black
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        neon: {
          blue: '#00D9FF',
          purple: '#B026FF',
          pink: '#FF006E',
          cyan: '#00F5FF',
        },
      },
      fontFamily: {
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        space: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'gradient-xy': 'gradientXY 15s ease infinite',
        'neon-flicker': 'neonFlicker 2s infinite',
        'particle-float': 'particleFloat 20s infinite',
        'rotate-gradient': 'rotateGradient 10s linear infinite',
        'morph': 'morph 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 71, 171, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(135, 206, 235, 0.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 71, 171, 0.4), 0 0 40px rgba(135, 206, 235, 0.2)',
            opacity: '1',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 71, 171, 0.8), 0 0 80px rgba(135, 206, 235, 0.4)',
            opacity: '0.8',
          },
        },
        gradientXY: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
            backgroundSize: '200% 200%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
            backgroundSize: '200% 200%',
          },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '41.99%': { opacity: '1', filter: 'brightness(1)' },
          '42%': { opacity: '0.8', filter: 'brightness(0.8)' },
          '43%': { opacity: '1', filter: 'brightness(1)' },
          '45.99%': { opacity: '1', filter: 'brightness(1)' },
          '46%': { opacity: '0.8', filter: 'brightness(0.8)' },
          '46.5%': { opacity: '1', filter: 'brightness(1)' },
        },
        particleFloat: {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: '0.3' },
          '33%': { transform: 'translateY(-30px) translateX(20px) rotate(120deg)', opacity: '0.6' },
          '66%': { transform: 'translateY(-60px) translateX(-20px) rotate(240deg)', opacity: '0.4' },
          '100%': { transform: 'translateY(0px) translateX(0px) rotate(360deg)', opacity: '0.3' },
        },
        rotateGradient: {
          '0%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 71, 171, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 71, 171, 0.4)',
        'glow-xl': '0 0 60px rgba(0, 71, 171, 0.5)',
        'glow-primary': '0 0 30px rgba(0, 71, 171, 0.5)',
        'glow-primary-lg': '0 0 50px rgba(0, 71, 171, 0.6), 0 0 100px rgba(135, 206, 235, 0.3)',
        'glow-accent': '0 0 30px rgba(245, 158, 11, 0.5)',
        'glow-accent-lg': '0 0 50px rgba(245, 158, 11, 0.6), 0 0 100px rgba(252, 211, 77, 0.3)',
        'glow-neon-blue': '0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.4), 0 0 60px rgba(0, 217, 255, 0.2)',
        'glow-neon-purple': '0 0 20px rgba(176, 38, 255, 0.6), 0 0 40px rgba(176, 38, 255, 0.4), 0 0 60px rgba(176, 38, 255, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(135, 206, 235, 0.1)',
        'inner-glow-lg': 'inset 0 0 40px rgba(135, 206, 235, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
