/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
    darkMode: ["class"],
    content: [
    "./node_modules/@nextui-org/react/**/*.{js,ts,jsx,tsx}", // Add NextUI paths
    "./src/**/*.{js,ts,jsx,tsx}", // Your app's files
    "./index.html", "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
			rubik: [
				'Rubik',
				'sans-serif'
			],
			marcellus: [
				'Marcellus',
				'sans-serif'
			],
  			sans: [
  				'Roboto',
  				'sans-serif'
  			],
  			inter: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		colors: {
  			primary: "#0950a0",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [nextui(), require("tailwindcss-animate")],
};
