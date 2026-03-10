'use client'
import { Order } from '@/lib/types'
import { fmtDate } from '@/lib/utils'
import Link from 'next/link'
import { ORDER_STATUS_LABEL } from '@/lib/types'

const STATUS_CLS = {
  received:      'border-blue-300 bg-blue-50',
  in_production: 'border-yellow-300 bg-yellow-50',
  shipped:       'border-green-300 bg-green-50',
}

interface Props { order: Order }

export default function OrderCard({ order }: Props) {
  return (
    <div className={`border-2 rounded-xl p-4 space-y-2 ${STATUS_CLS[order.status]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-gray-900">{order.products?.name}</p>
          <p className="text-sm text-gray-600">{order.products?.variant_name}</p>
        </div>
        <span className="text-xs font-medium bg-white px-2 py-0.5 rounded-full border">
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>
      <div className="text-xs text-gray-500 space-y-0.5">
        <p>出荷先: {order.customers?.name}</p>
        <p>受注数: <strong className="text-gray-800">{order.quantity} c/s</strong></p>
        <p>希望出荷日: <strong className="text-gray-800">{fmtDate(order.desired_ship_date)}</strong></p>
        <p className="font-mono text-gray-400">{order.id}</p>
      </div>
      <Link href={`/production/${order.id}`}
        className="block text-center text-sm text-blue-600 font-medium hover:underline pt-1">
        製造計画を登録する →
      </Link>
    </div>
  )
}
