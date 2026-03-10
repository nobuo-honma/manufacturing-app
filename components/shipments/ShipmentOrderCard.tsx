'use client'
import { Order } from '@/lib/types'
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '@/lib/utils'

interface Props {
  order: Order
  shippedCs: number
  selected: boolean
  onClick: () => void
}

export default function ShipmentOrderCard({ order, shippedCs, selected, onClick }: Props) {
  const progress    = order.quantity > 0 ? Math.min(100, (shippedCs / order.quantity) * 100) : 0
  const remainCs    = order.quantity - shippedCs
  const isCompleted = remainCs <= 0

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 cursor-pointer transition-all
        ${selected ? 'border-blue-500 bg-blue-50 shadow-md' : 'bg-white hover:shadow-sm'}
        ${isCompleted ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold text-sm leading-tight text-gray-800 flex-1 mr-2">{order.customers?.name}</p>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${ORDER_STATUS_COLOR[order.status]}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-1">
        {order.products?.name} / {order.products?.variant_name}
      </p>

      <div className="flex gap-4 text-xs text-gray-600 mb-2">
        <span>受注: <strong>{order.quantity}</strong> c/s</span>
        <span>出荷済: <strong className="text-green-600">{shippedCs}</strong> c/s</span>
        <span className={remainCs < 0 ? 'text-red-600' : ''}>残: <strong>{remainCs}</strong> c/s</span>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-1.5">
        希望出荷日: {new Date(order.desired_ship_date).toLocaleDateString('ja-JP')}
      </p>
    </div>
  )
}
