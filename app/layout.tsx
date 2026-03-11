import type { Metadata } from 'next'
<<<<<<< HEAD
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Header  from '@/components/layout/Header'
=======
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0

export const metadata: Metadata = {
  title: '製造管理システム',
  description: 'DisasterBread 製造・在庫・出荷管理',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
<<<<<<< HEAD
      <body style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy-950)' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header />
          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
            {children}
          </main>
        </div>
=======
      <body className={`${inter.className} flex bg-gray-50 min-h-screen`}>
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
      </body>
    </html>
  )
}
