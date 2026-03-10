'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, Factory,
  Package, Truck, Ship, Settings, BookOpen,
} from 'lucide-react'

const NAV = [
  { href: '/',           label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/orders',     label: '受注管理',       icon: ShoppingCart },
  { href: '/production', label: '製造管理',       icon: Factory },
  { href: '/inventory',  label: '在庫管理',       icon: Package },
  { href: '/arrivals',   label: '入荷管理',       icon: Truck },
  { href: '/shipments',  label: '出荷管理',       icon: Ship },
  { href: '/masters',    label: 'マスタ管理',     icon: Settings },
  { href: '/manual',     label: '操作マニュアル', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      <div className="px-5 py-5 text-base font-bold border-b border-gray-700 leading-tight">
        🍞 製造管理システム
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 text-xs text-gray-500 border-t border-gray-700">
        DisasterBread v1.0
      </div>
    </aside>
  )
}
