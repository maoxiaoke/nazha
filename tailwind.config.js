/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const hoverPlugin = plugin(function ({ addVariant, e, postcss }) {
  addVariant('hover', ({ container, separator }) => {
    const hoverRule = postcss.atRule({ name: 'media', params: '(hover: hover)' });
    hoverRule.append(container.nodes);
    container.append(hoverRule);
    hoverRule.walkRules((rule) => {
      rule.selector = `.${e(`hover${separator}${rule.selector.slice(1)}`)}:hover`;
    });
  });
});

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{jsx,tsx}',
    './components/**/*.{jsx,tsx}',
    './content/**/*.{mdx}',
    './posts/**/*.{mdx}',
    './notes/**/*.{mdx}'
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        gothamsm: ['var(--font-gothamsm)'],
        catamaran: ['var(--font-catamaran)'],
        montserrat: ['var(--font-montserrat)'],
        overpass: ['var(--font-overpass)'],
        inter: ['var(--font-inter)']
      },

      colors: {
        ...colors,
        hacker: '#ff6600', // rgb(255, 102, 0)
        purple: '#3f3cbb',
        unhovered: '#d1e8f3ed',
        'unhovered-dark': '#2b4555',
        'hovered-dark': '#395f73',
        hovered: '#bae3f7',
        'hovered-tag': '#ffd090',
        'unhovered-tag': '#faebd7',
        // 'hovered-tag-dark': '#b07065',
        'hovered-tag-dark': '#bc857c',
        'unhovered-tag-dark': '#292524',
        // primary: 'var(--color-text)',
        // secondary: 'var(--color-text-secondary)',
        bg: 'var(--color-background)',
        nav: 'var(--color-nav-background)',
        // muted: 'var(--color-muted)',
        // accent: 'var(--color-link-posts)',
        subscrible: '#FF354D',
        subscribleRight: '#FE6108',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      animation: {
        gradient: 'gradient 10s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 100%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 100%' }
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      backgroundImage: {
        iridescent: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
      },
      backgroundSize: {
        'zoom-350': '350% 350%',
        'zoom-150': '150% 150%'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [hoverPlugin, require('flowbite/plugin'), require('tailwindcss-animate')],

  content: ['./node_modules/flowbite/**/*.js', 'app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}']
};
