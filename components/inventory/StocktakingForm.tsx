'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
<<<<<<< HEAD
import { ItemStock } from '@/lib/types'

interface Props { stock: ItemStock; onClose: () => void; onSaved: () => void }
const REASONS = ['定例棚卸','入荷確認','ロス計上','廃棄','その他']

export default function StocktakingForm({ stock, onClose, onSaved }: Props) {
  const [newQty, setNewQty] = useState<number>(stock.quantity)
  const [reason, setReason] = useState(REASONS[0])
  const [notes,  setNotes]  = useState('')
  const [loading, setLoading] = useState(false)
  const diff = Math.round((newQty - stock.quantity) * 1000) / 1000

  const handleSave = async () => {
    setLoading(true)
    await supabase.from('item_stocks').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('item_id', stock.item_id)
    await supabase.from('inventory_adjustments').insert({ item_id: stock.item_id, before_qty: stock.quantity, after_qty: newQty, reason, notes: notes || null })
    setLoading(false); onSaved(); onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="card" style={{ width: '400px', padding: '24px', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>棚卸入力</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
          <span style={{ fontFamily: 'DM Mono', fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '6px' }}>{stock.item_id}</span>
          {stock.items?.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          現在庫: {stock.quantity} {stock.items?.unit}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="label">実棚卸数（{stock.items?.unit}）</label>
            <input type="number" step="0.001" className="input" autoFocus value={newQty} onChange={e => setNewQty(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">理由</label>
            <select className="input" value={reason} onChange={e => setReason(e.target.value)}>
              {REASONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">備考</label>
            <input type="text" className="input" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div style={{
            padding: '10px 14px', borderRadius: '8px',
            background: diff > 0 ? 'var(--ok-bg)' : diff < 0 ? 'var(--danger-bg)' : 'var(--surface-2)',
            color: diff > 0 ? 'var(--ok)' : diff < 0 ? 'var(--danger)' : 'var(--text-muted)',
            fontSize: '0.875rem', fontWeight: 600,
          }}>
            差異: {diff > 0 ? '+' : ''}{diff} {stock.items?.unit}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>キャンセル</button>
          <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ flex: 1 }}>
            {loading ? '保存中...' : '保存する'}
=======
import { X } from 'lucide-react'

interface Props {
  itemId: string
  currentQty: number
  onClose: () => void
}

export default function StocktakingForm({ itemId, currentQty, onClose }: Props) {
  const [newQty, setNewQty]   = useState<string>(String(currentQty))
  const [reason, setReason]   = useState('定例棚卸')
  const [notes, setNotes]     = useState('')
  const [saving, setSaving]   = useState(false)

  const diff = Number(newQty) - currentQty

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('inventory_adjustments').insert({
      item_id:    itemId,
      before_qty: currentQty,
      after_qty:  Number(newQty),
      reason,
      notes: notes || null,
    })
    await supabase.from('item_stocks')
      .update({ quantity: Number(newQty), updated_at: new Date().toISOString() })
      .eq('item_id', itemId)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">棚卸入力</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        <div className="text-sm space-y-3">
          <div>
            <label className="text-gray-500 block mb-1">棚卸前在庫数</label>
            <p className="font-bold text-gray-900">{currentQty}</p>
          </div>
          <div>
            <label className="text-gray-500 block mb-1">棚卸後在庫数 <span className="text-red-500">*</span></label>
            <input type="number" step="0.001" className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newQty} onChange={e => setNewQty(e.target.value)} />
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            差異: <strong className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>
              {diff >= 0 ? '+' : ''}{diff}
            </strong>
          </div>
          <div>
            <label className="text-gray-500 block mb-1">理由</label>
            <select className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reason} onChange={e => setReason(e.target.value)}>
              <option>定例棚卸</option>
              <option>誤差修正</option>
              <option>廃棄</option>
              <option>その他</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 block mb-1">備考</label>
            <input type="text" className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
            キャンセル
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-50">
            {saving ? '保存中...' : '保存する'}
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
          </button>
        </div>
      </div>
    </div>
  )
}
