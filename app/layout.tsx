import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Habourly – Find Verified Gaming Coaches',
    template: '%s | Habourly',
  },
  description:
    'Connect with skilled, verified gaming coaches. Improve your gameplay with personalised 1-on-1 sessions.',
  keywords: ['gaming coach', 'esports coaching', 'gaming tutor', 'rank improvement'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Habourly',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-inter bg-background text-text-primary min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
