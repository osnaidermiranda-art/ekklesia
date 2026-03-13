import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ekklesia',
  description: 'Plataforma de gestion de concilios e iglesias',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
