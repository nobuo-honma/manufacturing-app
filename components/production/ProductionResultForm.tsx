'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductionPlan } from '@/lib/types'

interface Props {
  plan: ProductionPlan
  onSaved: () => void
}

export default function ProductionResultForm({ plan, onSaved }: Props) {
  const [form, setForm] = useState({
    actual_units: plan.planned_units,
    actual_cs:    plan.planned_cs,
    actual_piece: 0,
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.from('production_results').insert({
      plan_id:      plan.id,
      lot_code:     plan.lot_code ?? '',
      actual_units: form.actual_units,
      actual_cs:    form.actual_cs,
      actual_piece: form.actual_piece,
      notes:        form.notes || null,
    })

    // 製造計画ステータスを完了に更新
    await supabase.from('production_plans').update({ status: 'completed' }).eq('id', plan.id)

    // 製品在庫に追加（Lotがある場合）
    if (plan.lot_code) {
      const { data: existing } = await supabase
        .from('product_stocks').select('qty_cs, qty_piece').eq('lot_code', plan.lot_code).single()

      if (existing) {
        await supabase.from('product_stocks').update({
          qty_cs:    existing.qty_cs + form.actual_cs,
          qty_piece: existing.qty_piece + form.actual_piece,
          updated_at: new Date().toISOString(),
        }).eq('lot_code', plan.lot_code)
      } else {
        await supabase.from('product_stocks').insert({
          lot_code:    plan.lot_code,
          product_id:  plan.product_id,
          qty_cs:      form.actual_cs,
          qty_piece:   form.actual_piece,
          expiry_date: plan.expiry_date ?? null,
        })
      }
    }

    setLoading(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-3 text-sm grid grid-cols-3 gap-2 mb-2">
        <div><p className="text-xs text-gray-400">計画個数</p><p>{plan.planned_units}</p></div>
        <div><p className="text-xs text-gray-400">計画c/s</p><p>{plan.planned_cs}</p></div>
        <div><p className="text-xs text-gray-400">Lot番号</p><p className="font-mono text-xs">{plan.lot_code ?? '-'}</p></div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">実績個数</label>
          <input type="number" min="0" required className="border rounded-lg px-3 py-2 w-full text-sm"
            value={form.actual_units}
            onChange={e => setForm(p => ({ ...p, actual_units: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">実績c/s</label>
          <input type="number" min="0" required className="border rounded-lg px-3 py-2 w-full text-sm"
            value={form.actual_cs}
            onChange={e => setForm(p => ({ ...p, actual_cs: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">端数(p)</label>
          <input type="number" min="0" className="border rounded-lg px-3 py-2 w-full text-sm"
            value={form.actual_piece}
            onChange={e => setForm(p => ({ ...p, actual_piece: Number(e.target.value) }))} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">備考</label>
        <input type="text" className="border rounded-lg px-3 py-2 w-full text-sm"
          value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
        {loading ? '登録中...' : '実績を登録する（完了）'}
      </button>
    </form>
  )
}
