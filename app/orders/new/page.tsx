import OrderForm from '@/components/orders/OrderForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewOrderPage() {
  return (
<<<<<<< HEAD
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/orders" style={{ color: 'var(--text-muted)', display: 'flex' }}><ChevronLeft size={20} /></Link>
        <h1 className="page-title">受注登録</h1>
=======
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/orders" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">受注登録</h1>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
      </div>
      <OrderForm />
    </div>
  )
}
