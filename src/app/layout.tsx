import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'next.js minesweeper',
  description: 'simple implementation of a classical game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`transition w-screen h-screen ${inter.className}`}>{children}</body>
    </html>
  )
}
