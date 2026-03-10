'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, Shipment, SHIPMENT_STATUS_LABEL } from '@/lib/types'
import { useOrders } from '@/hooks/useOrders'
import ShipmentForm from '@/components/shipments/ShipmentForm'
import { fmtDate } from '@/lib/utils'

export default function ShipmentsPage() {
  const { orders } = useOrders()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadShipments = async () => {
    const { data } = await supabase
      .from('shipments').select('*, orders(*, customers(*), products(*))')
      .order('ship_date', { ascending: true })
    setShipments(data ?? [])
  }
  useEffect(() => { loadShipments() }, [])

  const markShipped = async (id: string, orderId: string) => {
    await supabase.from('shipments').update({ status: 'shipped' }).eq('id', id)
    await supabase.from('orders').update({ status: 'shipped' }).eq('id', orderId)
    loadShipments()
  }

  const activeOrders = orders.filter(o => o.status !== 'shipped')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">出荷管理</h1>

      {/* 受注カード選択 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-3">受注選択</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeOrders.map(o => (
            <button key={o.id} onClick={() => setSelectedOrder(o)}
              className={`text-left border-2 rounded-xl p-4 transition-colors
                ${selectedOrder?.id === o.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <p className="font-bold text-sm">{o.products?.name} / {o.products?.variant_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{o.customers?.name}</p>
              <p className="text-xs text-gray-600 mt-1">{o.quantity} c/s｜{fmtDate(o.desired_ship_date)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 出荷登録フォーム */}
      {selectedOrder && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-2xl">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">出荷予定登録</h2>
          <ShipmentForm
            order={selectedOrder}
            onSaved={() => { loadShipments(); setSelectedOrder(null) }}
          />
        </div>
      )}

      {/* 出荷一覧 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">出荷一覧</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['出荷ID','出荷日','出荷先','製品','製造Lot','c/s','p','ステータス',''].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shipments.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs text-gray-500 max-w-xs truncate">{s.id}</td>
                <td className="px-3 py-2">{fmtDate(s.ship_date)}</td>
                <td className="px-3 py-2 max-w-xs truncate">{s.orders?.customers?.name}</td>
                <td className="px-3 py-2">{s.orders?.products?.variant_name}</td>
                <td className="px-3 py-2 font-mono text-xs">{s.lot_code}</td>
                <td className="px-3 py-2 font-bold">{s.qty_cs}</td>
                <td className="px-3 py-2">{s.qty_piece}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${s.status === 'shipped' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {SHIPMENT_STATUS_LABEL[s.status]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {s.status === 'scheduled' && (
                    <button onClick={() => markShipped(s.id, s.order_id)}
                      className="text-xs text-blue-600 hover:underline">出荷確認</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
