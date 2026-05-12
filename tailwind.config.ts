import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',

        sidebar: 'var(--sidebar)',
        'sidebar-surface': 'var(--sidebar-surface)',
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-text': 'var(--sidebar-text)',
        'sidebar-text-active': 'var(--sidebar-text-active)',

        brand: 'var(--brand)',
        'brand-hover': 'var(--brand-hover)',
        'brand-foreground': 'var(--brand-foreground)',

        foreground: 'var(--foreground)',
        'foreground-muted': 'var(--foreground-muted)',
        'foreground-subtle': 'var(--foreground-subtle)',

        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) * 0.5)',
        lg: 'calc(var(--radius) * 1.5)',
        xl: 'calc(var(--radius) * 2)',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
