import OrderList from '@/components/orders/OrderList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">受注管理</h1>
        <Link href="/orders/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} />
          新規受注登録
        </Link>
      </div>
      <OrderList />
    </div>
  )
}
