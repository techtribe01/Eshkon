import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Space_Mono } from 'next/font/google'

import StoreProvider from '@/components/StoreProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Page Studio',
  description: 'A schema-driven CMS page editor with Contentful, live preview, and automated SemVer publishing.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} bg-background`}
    >
      <body className="font-sans text-foreground antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
