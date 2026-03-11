import OrderList from '@/components/orders/OrderList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function OrdersPage() {
  return (
<<<<<<< HEAD
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="page-title">受注管理</h1>
        <Link href="/orders/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <Plus size={15} /> 新規受注登録
=======
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">受注管理</h1>
        <Link href="/orders/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} />
          新規受注登録
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
        </Link>
      </div>
      <OrderList />
    </div>
  )
}
