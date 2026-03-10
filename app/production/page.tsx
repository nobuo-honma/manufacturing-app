'use client'
import { useOrders } from '@/hooks/useOrders'
import OrderCard from '@/components/production/OrderCard'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function ProductionPage() {
  const { orders, loading } = useOrders()
  const active = orders.filter(o => o.status !== 'shipped')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">製造管理</h1>
        <Link href="/production/calendar"
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
          <Calendar size={16} />
          製造予定表（カレンダー）
        </Link>
      </div>

      {loading
        ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />
        : (
          <>
            <p className="text-sm text-gray-500">受注を選択して製造計画を登録します</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map(o => <OrderCard key={o.id} order={o} />)}
              {active.length === 0 && (
                <p className="text-gray-400 text-sm col-span-3">対象の受注がありません</p>
              )}
            </div>
          </>
        )
      }
    </div>
  )
}
