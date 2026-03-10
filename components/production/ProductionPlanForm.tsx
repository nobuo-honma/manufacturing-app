'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, Product } from '@/lib/types'
import { generateLotCode, calcExpiryDate, calcProductionCounts, fmtDate } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

const MAX_DAYS = 8

interface DayPlan {
  date: string
  kg: number
  units: number
  cs: number
  piece: number
  lot_code: string
  expiry: string
  notes: string
}

const emptyDay = (): DayPlan => ({
  date:'', kg:0, units:0, cs:0, piece:0, lot_code:'', expiry:'', notes:''
})

interface Props {
  order: Order
  existingCs?: number  // 既登録のc/s合計
  comboSeqStart?: number  // MA/FDの連番開始値
}

export default function ProductionPlanForm({ order, existingCs = 0, comboSeqStart = 1 }: Props) {
  const [product, setProduct]   = useState<Product | null>(null)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([emptyDay()])
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', order.product_id).single()
      .then(({ data }) => setProduct(data))
  }, [order.product_id])

  const update = (idx: number, field: Partial<DayPlan>) => {
    setDayPlans(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], ...field }

      // kg or date が変わったら自動計算
      const d = next[idx]
      if (d.kg > 0 && d.date && product) {
        const { units, cs, piece } = calcProductionCounts(d.kg, product.unit_per_kg, product.unit_per_cs)
        const dt    = new Date(d.date)
        const expiry  = calcExpiryDate(dt).toISOString().slice(0, 10)
        const lot_code = generateLotCode({
          date: dt,
          productId: order.product_id,
          seqInDay: idx,
          comboSeq: comboSeqStart + idx,
        })
        next[idx] = { ...d, ...field, units, cs, piece, expiry, lot_code }
      }
      return next
    })
  }

  const totalCs  = dayPlans.reduce((s, d) => s + d.cs, 0)
  const remainCs = order.quantity - existingCs - totalCs

  const handleSubmit = async () => {
    setSaving(true)
    for (const day of dayPlans) {
      if (!day.date || day.kg <= 0) continue
      await supabase.from('production_plans').insert({
        id:              `PLN-${crypto.randomUUID().slice(0, 8)}`,
        order_id:        order.id,
        product_id:      order.product_id,
        production_date: day.date,
        production_kg:   day.kg,
        planned_units:   day.units,
        planned_cs:      day.cs,
        lot_code:        day.lot_code,
        expiry_date:     day.expiry || null,
        status:          'planned',
        notes:           day.notes || null,
      })
    }
    // 受注ステータスを製造中に更新
    await supabase.from('orders').update({ status: 'in_production' }).eq('id', order.id)
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="space-y-5">
      {/* サマリ */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-500">受注数</p>
          <p className="font-bold text-gray-900">{order.quantity} c/s</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">今回登録合計</p>
          <p className="font-bold text-blue-700">{totalCs} c/s</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">残り必要製造量</p>
          <p className={`font-bold ${remainCs < 0 ? 'text-red-600' : remainCs === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {remainCs} c/s
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✅ 製造計画を登録しました
        </div>
      )}

      {/* 日程入力 */}
      {dayPlans.map((day, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">製造予定日 {idx + 1}日目</h4>
            {dayPlans.length > 1 && (
              <button onClick={() => setDayPlans(p => p.filter((_, i) => i !== idx))}
                className="text-gray-400 hover:text-red-500">
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">製造予定日</label>
              <input type="date" className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={day.date}
                onChange={e => update(idx, { date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">製造量（kg）</label>
              <input type="number" min="0" step="0.5"
                className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={day.kg || ''}
                onChange={e => update(idx, { kg: Number(e.target.value) })} />
            </div>
          </div>

          {day.kg > 0 && day.date && (
            <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-5 gap-2 text-xs">
              <div><span className="text-gray-500">個数</span><br /><strong>{day.units}</strong></div>
              <div><span className="text-gray-500">c/s</span><br /><strong>{day.cs}</strong></div>
              <div><span className="text-gray-500">端数(p)</span><br /><strong>{day.piece}</strong></div>
              <div><span className="text-gray-500">賞味期限</span><br /><strong>{day.expiry}</strong></div>
              <div><span className="text-gray-500">Lot番号</span><br /><strong className="font-mono">{day.lot_code}</strong></div>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 mb-1 block">備考</label>
            <input type="text" placeholder="例: 50kg×4回"
              className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={day.notes}
              onChange={e => update(idx, { notes: e.target.value })} />
          </div>
        </div>
      ))}

      {dayPlans.length < MAX_DAYS && (
        <button onClick={() => setDayPlans(p => [...p, emptyDay()])}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2">
          <Plus size={16} />
          製造予定日を追加（最大{MAX_DAYS}日）
        </button>
      )}

      <button onClick={handleSubmit} disabled={saving}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
        {saving ? '登録中...' : '製造計画を登録する'}
      </button>
    </div>
  )
}
