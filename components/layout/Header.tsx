'use client'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/':           'ダッシュボード',
  '/orders':     '受注管理',
  '/orders/new': '受注登録',
  '/production': '製造管理',
  '/production/calendar': '製造予定表',
  '/inventory':  '在庫管理',
  '/arrivals':   '入荷管理',
  '/shipments':  '出荷管理',
  '/masters':    'マスタ管理',
  '/manual':     '操作マニュアル',
}

export default function Header() {
  const pathname = usePathname()
  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname === key || pathname.startsWith(key + '/') )?.[1] ?? ''

  return (
    <header className="h-14 bg-white border-b flex items-center px-8">
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      <div className="ml-auto text-sm text-gray-400">
        {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
      </div>
    </header>
  )
}
