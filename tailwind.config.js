/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Raleway', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        raleway: ['Raleway', 'Georgia', 'serif'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        ring: 'hsl(var(--ring))',
        // Antaraatma Brand Palette
        'teal-depth': '#1A6B6B',
        'sage-forest': '#3A7A5A',
        'aqua-light': '#5FBDBD',
        'mint-mist': '#A8D8CE',
        'sacred-gold': '#C4A052',
        'warm-pearl': '#F4EFE6',
        'pale-mist': '#D4EDE8',
        'deep-night': '#242C2C',
        // Legacy aliases for backward compat
        gold: 'hsl(var(--gold))',
        earth: 'hsl(var(--earth))',
        sage: 'hsl(var(--sage))',
        charcoal: 'hsl(var(--charcoal))',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        'display-xl': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '0.04em' }],
        'display-lg': ['clamp(2.25rem, 4vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '0.04em' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(26,107,107,0.06), 0 1px 2px rgba(26,107,107,0.04)',
        'card-hover': '0 4px 12px rgba(26,107,107,0.10), 0 2px 4px rgba(26,107,107,0.06)',
        'modal': '0 20px 60px rgba(36,44,44,0.15)',
        'sidebar': '1px 0 0 rgba(168,216,206,0.3)',
      },
      maxWidth: {
        'reading': '68ch',
        'prose': '72ch',
      },
      transitionTimingFunction: {
        'ease-editorial': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};