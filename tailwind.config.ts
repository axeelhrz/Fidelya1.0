import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Colores principales
        primary: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          lighter: '#334155',
        },
        accent: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          lighter: '#93C5FD',
        },
        // Colores de fondo
        background: '#FAFBFC',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F8FAFC',
          hover: '#F1F5F9',
        },
        // Colores de texto
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          tertiary: '#94A3B8',
          inverse: '#FFFFFF',
        },
        // Colores de estado
        success: {
          DEFAULT: '#059669',
          light: '#10B981',
          bg: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
          bg: '#FFFBEB',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          bg: '#FEF2F2',
        },
        info: {
          DEFAULT: '#0284C7',
          light: '#0EA5E9',
          bg: '#F0F9FF',
        },
        // Bordes
        border: {
          light: '#E2E8F0',
          medium: '#CBD5E1',
          strong: '#94A3B8',
        },
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'elevated': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'floating': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'loading': 'loading 1.5s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
