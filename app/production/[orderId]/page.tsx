'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Order, ProductionPlan } from '@/lib/types'
import ProductionPlanForm from '@/components/production/ProductionPlanForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { fmtDate } from '@/lib/utils'
import { PLAN_STATUS_LABEL } from '@/lib/types'

export default function ProductionDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder]   = useState<Order | null>(null)
  const [plans, setPlans]   = useState<ProductionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('*, customers(*), products(*)').eq('id', orderId).single(),
      supabase.from('production_plans').select('*, products(*)').eq('order_id', orderId).order('production_date'),
    ]).then(([{ data: o }, { data: p }]) => {
      setOrder(o)
      setPlans(p ?? [])
      setLoading(false)
    })
  }, [orderId])

  if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />
  if (!order)  return <p className="text-red-500">受注が見つかりません</p>

  const registeredCs = plans.reduce((s, p) => s + p.planned_cs, 0)

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/production" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">製造計画登録</h1>
      </div>

      {/* 受注情報 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
        <p><span className="text-gray-500">受注ID:</span> <span className="font-mono">{order.id}</span></p>
        <p><span className="text-gray-500">製品:</span> {order.products?.name} / {order.products?.variant_name}</p>
        <p><span className="text-gray-500">出荷先:</span> {order.customers?.name}</p>
        <p><span className="text-gray-500">受注数:</span> <strong>{order.quantity} c/s</strong></p>
        <p><span className="text-gray-500">希望出荷日:</span> {fmtDate(order.desired_ship_date)}</p>
      </div>

      {/* 既登録計画 */}
      {plans.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b text-sm font-semibold">登録済み製造計画</div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['製造予定日','製造量','c/s','Lot番号','賞味期限','ステータス','備考'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map(p => (
                <tr key={p.id}>
                  <td className="px-3 py-2">{fmtDate(p.production_date)}</td>
                  <td className="px-3 py-2">{p.production_kg}kg</td>
                  <td className="px-3 py-2">{p.planned_cs}</td>
                  <td className="px-3 py-2 font-mono">{p.lot_code}</td>
                  <td className="px-3 py-2">{p.expiry_date}</td>
                  <td className="px-3 py-2">{PLAN_STATUS_LABEL[p.status]}</td>
                  <td className="px-3 py-2 text-gray-500">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductionPlanForm
        order={order}
        existingCs={registeredCs}
        comboSeqStart={plans.length + 1}
      />
    </div>
  )
}
