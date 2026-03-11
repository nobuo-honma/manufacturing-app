'use client'
<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, ProductStock } from '@/lib/types'
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, SHIPMENT_STATUS_LABEL } from '@/lib/utils'

function OrderCard({ order, shippedCs, selected, onClick }: { order: Order; shippedCs: number; selected: boolean; onClick: () => void }) {
  const progress  = order.quantity > 0 ? Math.min(100, (shippedCs / order.quantity) * 100) : 0
  const remainCs  = order.quantity - shippedCs
  return (
    <div onClick={onClick} style={{
      borderRadius: '10px',
      padding: '14px',
      cursor: 'pointer',
      border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
      background: selected ? 'var(--surface-2)' : 'var(--surface-1)',
      boxShadow: selected ? '0 0 16px var(--accent-glow)' : 'none',
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', flex: 1, marginRight: '8px' }}>{order.customers?.name}</p>
        <span className={`badge ${ORDER_STATUS_COLOR[order.status] === 'bg-blue-100 text-blue-700' ? 'badge-blue' : ORDER_STATUS_COLOR[order.status] === 'bg-yellow-100 text-yellow-700' ? 'badge-warn' : 'badge-ok'}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{order.products?.name} / {order.products?.variant_name}</p>
      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <span>受注: <strong style={{ color: 'var(--text-primary)' }}>{order.quantity}</strong></span>
        <span>済: <strong style={{ color: 'var(--ok)' }}>{shippedCs}</strong></span>
        <span style={{ color: remainCs < 0 ? 'var(--danger)' : 'inherit' }}>残: <strong>{remainCs}</strong></span>
      </div>
      <div style={{ height: '3px', background: 'var(--surface-3)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: remainCs <= 0 ? 'var(--ok)' : 'var(--accent)', borderRadius: '2px', transition: 'width 0.5s' }} />
      </div>
      <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
        希望出荷: {new Date(order.desired_ship_date).toLocaleDateString('ja-JP')}
      </p>
    </div>
  )
}

export default function ShipmentsPage() {
  const [orders, setOrders]               = useState<Order[]>([])
  const [shipments, setShipments]         = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [productStocks, setProductStocks] = useState<ProductStock[]>([])
  const [lots, setLots] = useState([{ lot_code: '', qty_cs: 0, qty_piece: 0 }])
  const [shipDate, setShipDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)

  const fetchOrders   = async () => {
    const { data } = await supabase.from('orders').select('*, customers(*), products(*)').in('status', ['received','in_production','shipped']).order('desired_ship_date')
    setOrders(data || [])
  }
  const fetchShipments = async () => {
    const { data } = await supabase.from('shipments').select('*, orders(*, customers(*), products(*))').order('ship_date', { ascending: false })
    setShipments(data || [])
  }
  useEffect(() => { fetchOrders(); fetchShipments() }, [])

  const shippedCsFor = (orderId: string) => shipments.filter(s => s.order_id === orderId).reduce((sum, s) => sum + s.qty_cs, 0)

  const handleSelectOrder = async (order: Order) => {
    setSelectedOrder(order)
    const { data } = await supabase.from('product_stocks').select('*, products(*)').eq('product_id', order.product_id).order('expiry_date')
    setProductStocks(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return
    setLoading(true)
    for (const lot of lots) {
      if (!lot.lot_code || lot.qty_cs <= 0) continue
      const id = `SHP-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
      await supabase.from('shipments').insert({ id, order_id: selectedOrder.id, ship_date: new Date(shipDate).toISOString(), lot_code: lot.lot_code, qty_cs: lot.qty_cs, qty_piece: lot.qty_piece, status: 'scheduled' })
      const { data: stock } = await supabase.from('product_stocks').select('qty_cs, qty_piece').eq('lot_code', lot.lot_code).single()
      if (stock) await supabase.from('product_stocks').update({ qty_cs: Math.max(0, stock.qty_cs - lot.qty_cs), qty_piece: Math.max(0, stock.qty_piece - lot.qty_piece), updated_at: new Date().toISOString() }).eq('lot_code', lot.lot_code)
    }
    setLots([{ lot_code: '', qty_cs: 0, qty_piece: 0 }]); fetchShipments(); setLoading(false)
  }

  const shippedCs = selectedOrder ? shippedCsFor(selectedOrder.id) : 0
  const remainToShip = (selectedOrder?.quantity ?? 0) - shippedCs

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">出荷管理</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* 受注リスト */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '80vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>受注を選択</p>
          {orders.map(o => (
            <OrderCard key={o.id} order={o} shippedCs={shippedCsFor(o.id)} selected={selectedOrder?.id === o.id} onClick={() => handleSelectOrder(o)} />
          ))}
        </div>

        {/* 出荷登録エリア */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {selectedOrder ? (
            <>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-bright)', borderRadius: '10px', padding: '16px' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedOrder.customers?.name}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{selectedOrder.products?.name} / {selectedOrder.products?.variant_name}</p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>受注: <strong style={{ color: 'var(--text-primary)' }}>{selectedOrder.quantity} c/s</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>出荷済: <strong style={{ color: 'var(--ok)' }}>{shippedCs} c/s</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>残り: <strong style={{ color: remainToShip < 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{remainToShip} c/s</strong></span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', fontSize: '0.875rem' }}>出荷予定登録</h3>
                <div style={{ marginBottom: '14px' }}>
                  <label className="label">出荷日</label>
                  <input type="date" required className="input" style={{ width: '180px' }} value={shipDate} onChange={e => setShipDate(e.target.value)} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  {lots.map((lot, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: '8px', alignItems: 'end' }}>
                      <div>
                        {idx === 0 && <label className="label">製造Lot</label>}
                        <select className="input" style={{ fontSize: '0.8125rem' }} value={lot.lot_code}
                          onChange={e => setLots(p => p.map((l, i) => i === idx ? { ...l, lot_code: e.target.value } : l))}>
                          <option value="">Lot選択</option>
                          {productStocks.map(s => <option key={s.id} value={s.lot_code}>{s.lot_code}（在庫 {s.qty_cs}c/s）</option>)}
                        </select>
                      </div>
                      <div>
                        {idx === 0 && <label className="label">c/s</label>}
                        <input type="number" min="0" className="input" style={{ fontSize: '0.8125rem' }} value={lot.qty_cs || ''}
                          onChange={e => setLots(p => p.map((l, i) => i === idx ? { ...l, qty_cs: Number(e.target.value) } : l))} />
                      </div>
                      <div>
                        {idx === 0 && <label className="label">p（端数）</label>}
                        <input type="number" min="0" className="input" style={{ fontSize: '0.8125rem' }} value={lot.qty_piece || ''}
                          onChange={e => setLots(p => p.map((l, i) => i === idx ? { ...l, qty_piece: Number(e.target.value) } : l))} />
                      </div>
                    </div>
                  ))}
                </div>

                {lots.length < 10 && (
                  <button type="button" onClick={() => setLots(p => [...p, { lot_code: '', qty_cs: 0, qty_piece: 0 }])}
                    style={{ width: '100%', padding: '8px', background: 'none', border: '1px dashed var(--border-bright)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer', marginBottom: '14px' }}>
                    ＋ Lotを追加（最大10）
                  </button>
                )}

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                  {loading ? '登録中...' : '出荷予定を登録する'}
                </button>
              </form>

              {/* 出荷履歴 */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>この受注の出荷履歴</div>
                <table className="data-table">
                  <thead><tr>{['出荷日','Lot番号','c/s','p','ステータス'].map(h => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {shipments.filter(s => s.order_id === selectedOrder.id).map(s => (
                      <tr key={s.id}>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(s.ship_date).toLocaleDateString('ja-JP')}</td>
                        <td style={{ fontFamily: 'DM Mono', fontSize: '0.6875rem', color: 'var(--accent)' }}>{s.lot_code}</td>
                        <td style={{ fontWeight: 600 }}>{s.qty_cs}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{s.qty_piece}</td>
                        <td><span className={`badge ${s.status === 'shipped' ? 'badge-ok' : 'badge-warn'}`}>{SHIPMENT_STATUS_LABEL[s.status]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
              左の受注を選択してください
            </div>
          )}
        </div>
=======
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
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
      </div>
    </div>
  )
}
