'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, ProductStock } from '@/lib/types'
import { fmtDate } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

const MAX_LOTS = 10

interface LotRow { lot_code: string; qty_cs: number; qty_piece: number }

export default function ShipmentForm({ order, onSaved }: { order: Order; onSaved: () => void }) {
  const [shipDate, setShipDate]   = useState('')
  const [lotRows, setLotRows]     = useState<LotRow[]>([{ lot_code:'', qty_cs:0, qty_piece:0 }])
  const [availLots, setAvailLots] = useState<ProductStock[]>([])
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    supabase.from('product_stocks')
      .select('*, products(*)')
      .eq('product_id', order.product_id)
      .gt('qty_cs', 0)
      .then(({ data }) => setAvailLots(data ?? []))
  }, [order.product_id])

  const totalCs    = lotRows.reduce((s, r) => s + r.qty_cs, 0)
  const totalPiece = lotRows.reduce((s, r) => s + r.qty_piece, 0)

  const updateRow = (idx: number, field: Partial<LotRow>) => {
    setLotRows(prev => prev.map((r, i) => i === idx ? { ...r, ...field } : r))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0,14)
    for (const [i, row] of lotRows.entries()) {
      if (!row.lot_code || (row.qty_cs === 0 && row.qty_piece === 0)) continue
      const id = `SHP-${shipDate.replace(/-/g,'')}-${ts}-${String(i+1).padStart(2,'0')}`
      await supabase.from('shipments').insert({
        id,
        order_id:  order.id,
        ship_date: shipDate,
        lot_code:  row.lot_code,
        qty_cs:    row.qty_cs,
        qty_piece: row.qty_piece,
        status:    'scheduled',
      })
    }
    setSaving(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
        <p><span className="text-gray-500">受注ID:</span> <span className="font-mono">{order.id}</span></p>
        <p><span className="text-gray-500">製品:</span> {order.products?.name} / {order.products?.variant_name}</p>
        <p><span className="text-gray-500">出荷先:</span> {order.customers?.name}</p>
        <p><span className="text-gray-500">受注数:</span> <strong>{order.quantity} c/s</strong></p>
      </div>

      <div>
<<<<<<< HEAD
        <label className="label">出荷日 <span className="text-red-500">*</span></label>
        <input type="date" required className="input"
=======
        <label className="text-sm font-medium block mb-1">出荷日 <span className="text-red-500">*</span></label>
        <input type="date" required className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
          value={shipDate} onChange={e => setShipDate(e.target.value)} />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">出荷Lot（最大{MAX_LOTS}Lot）</label>
        {lotRows.map((row, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            <span className="text-xs text-gray-400 w-4">{idx+1}</span>
<<<<<<< HEAD
            <select className="input" style={{ borderRadius:"999px" }}
=======
            <select className="border rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
              value={row.lot_code} onChange={e => updateRow(idx, { lot_code: e.target.value })}>
              <option value="">Lot選択</option>
              {availLots.map(l => (
                <option key={l.lot_code} value={l.lot_code}>
                  {l.lot_code}（在庫: {l.qty_cs}c/s {l.qty_piece}p）
                </option>
              ))}
            </select>
            <input type="number" min="0" placeholder="c/s"
<<<<<<< HEAD
              className="input" style={{ width:"80px" }}
              value={row.qty_cs || ''} onChange={e => updateRow(idx, { qty_cs: Number(e.target.value) })} />
            <span className="text-xs text-gray-400">c/s</span>
            <input type="number" min="0" placeholder="p"
              className="input" style={{ width:"64px" }}
=======
              className="border rounded-lg px-2 py-1.5 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={row.qty_cs || ''} onChange={e => updateRow(idx, { qty_cs: Number(e.target.value) })} />
            <span className="text-xs text-gray-400">c/s</span>
            <input type="number" min="0" placeholder="p"
              className="border rounded-lg px-2 py-1.5 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
              value={row.qty_piece || ''} onChange={e => updateRow(idx, { qty_piece: Number(e.target.value) })} />
            <span className="text-xs text-gray-400">p</span>
            {lotRows.length > 1 && (
              <button type="button" onClick={() => setLotRows(p => p.filter((_,i) => i !== idx))}>
                <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>
        ))}
        {lotRows.length < MAX_LOTS && (
          <button type="button" onClick={() => setLotRows(p => [...p, { lot_code:'', qty_cs:0, qty_piece:0 }])}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <Plus size={14} />Lotを追加
          </button>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-3 text-sm flex gap-6">
        <span>合計: <strong>{totalCs} c/s {totalPiece > 0 ? `+ ${totalPiece}p` : ''}</strong></span>
        <span className={order.quantity - totalCs < 0 ? 'text-red-600' : ''}>
          残出荷: <strong>{order.quantity - totalCs} c/s</strong>
        </span>
      </div>

      <button type="submit" disabled={saving}
        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
        {saving ? '登録中...' : '出荷予定を登録する'}
      </button>
    </form>
  )
}
