'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { STATUS_COLOR } from '@/lib/utils'

interface ForecastRow {
  item_id: string
  item_name: string
  unit: string
  current_stock: number
  planned_usage: number
  after_stock: number
  safety_stock: number
  status: '充足' | '注意' | '不足'
}

export default function StockForecast() {
  const [rows, setRows] = useState<ForecastRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calc = async () => {
      setLoading(true)
      // 製造中・受注済の受注に紐づく製造計画を取得
      const { data: plans } = await supabase
        .from('production_plans')
        .select('product_id, production_kg, orders(status)')
        .in('status', ['planned', 'in_progress'])

      // 各製品のBOMを取得して使用予定数を計算
      const usageMap: Record<string, number> = {}
      for (const plan of plans ?? []) {
        const { data: bom } = await supabase
          .from('bom').select('item_id, usage_rate, basis_type')
          .eq('product_id', plan.product_id)
        for (const b of bom ?? []) {
          const usage = b.basis_type === 'production_qty'
            ? plan.production_kg * b.usage_rate
            : 0 // order_qty基準は別途計算（簡略化）
          usageMap[b.item_id] = (usageMap[b.item_id] ?? 0) + usage
        }
      }

      // 在庫と比較
      const { data: stocks } = await supabase.from('item_stocks').select('*, items(*)')
      const result: ForecastRow[] = (stocks ?? [])
        .filter(s => s.items)
        .map(s => {
          const planned = Math.round((usageMap[s.item_id] ?? 0) * 1000) / 1000
          const after   = Math.round((s.quantity - planned) * 1000) / 1000
          const status: '充足' | '注意' | '不足' =
            after < s.items.safety_stock        ? '不足'
            : after < s.items.safety_stock * 1.5 ? '注意'
            : '充足'
          return {
            item_id:       s.item_id,
            item_name:     s.items.name,
            unit:          s.items.unit,
            current_stock: s.quantity,
            planned_usage: planned,
            after_stock:   after,
            safety_stock:  s.items.safety_stock,
            status,
          }
        })
        .filter(r => r.planned_usage > 0 || r.status !== '充足')
        .sort((a, b) => (a.status === '不足' ? -1 : b.status === '不足' ? 1 : 0))

      setRows(result)
      setLoading(false)
    }
    calc()
  }, [])

  if (loading) return <p className="text-sm text-gray-400 py-4">計算中...</p>

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3">在庫予測（製造計画ベース）</h3>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['品目ID','品目名','現在庫','計画使用予定','計画後在庫','安全在庫','予測ステータス'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(r => (
              <tr key={r.item_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.item_id}</td>
                <td className="px-4 py-3 font-medium">{r.item_name}</td>
                <td className="px-4 py-3">{r.current_stock} {r.unit}</td>
                <td className="px-4 py-3 text-orange-600">{r.planned_usage} {r.unit}</td>
                <td className={`px-4 py-3 font-medium ${r.after_stock < 0 ? 'text-red-600' : ''}`}>
                  {r.after_stock} {r.unit}
                </td>
                <td className="px-4 py-3 text-gray-500">{r.safety_stock} {r.unit}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">計画中の製造はありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
