import OrderForm from '@/components/orders/OrderForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/orders" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">受注登録</h1>
      </div>
      <OrderForm />
    </div>
  )
}
