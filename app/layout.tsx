import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'HARDCODED - Consultoría en Desarrollo de Software',
  description: 'Impulsa tu negocio con un sitio web optimizado que convierte visitantes en clientes. Desarrollo web profesional para empresas de servicios con entrega en 15 días.',
  keywords: 'desarrollo web, sitios web profesionales, PyMEs, páginas web empresariales, tiendas en línea, HARDCODED',
  authors: [{ name: 'HARDCODED Agency' }],
  creator: 'HARDCODED Agency',
  publisher: 'HARDCODED Agency',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'HARDCODED - Consultoría en Desarrollo de Software',
    description: 'Impulsa tu negocio con un sitio web optimizado que convierte visitantes en clientes',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HARDCODED - Consultoría en Desarrollo de Software',
    description: 'Impulsa tu negocio con un sitio web optimizado que convierte visitantes en clientes',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}