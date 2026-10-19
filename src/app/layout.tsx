import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from "sonner"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Maderas & Diseño - Muebles a Medida',
    template: '%s | Maderas & Diseño',
  },
  description: 'Empresa de construcción expandida a muebles personalizados. Catálogo, proformas y galería 3D.',
  keywords: ['muebles', 'carpintería', 'proformas', 'madera', 'diseño personalizado', 'construcción'],
  authors: [{ name: 'Maderas & Diseño' }],
  creator: 'Maderas & Diseño',
  publisher: 'Maderas & Diseño',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://maderasydiseno.com',
    siteName: 'Maderas & Diseño',
    title: 'Maderas & Diseño - Muebles a Medida',
    description: 'Empresa de construcción expandida a muebles personalizados.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maderas & Diseño',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maderas & Diseño',
    description: 'Muebles personalizados de madera.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a3a5c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// La app depende de cookies (Supabase SSR), datos de Supabase y
// useSearchParams() en cliente: no puede producir un shell estático.
// Optamos la app completa fuera de la validación de shell estático.
export const instant = false

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-background text-foreground font-sans min-h-screen flex flex-col">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-card border-border',
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  )
}