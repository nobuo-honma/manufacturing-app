'use client'
<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Arrival } from '@/lib/types'
import { generateArrivalId, ARRIVAL_STATUS_LABEL } from '@/lib/utils'
import ArrivalCalendar from '@/components/arrivals/ArrivalCalendar'
import ArrivalForm     from '@/components/arrivals/ArrivalForm'
=======
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Arrival, ARRIVAL_STATUS_LABEL } from '@/lib/types'
import ArrivalForm from '@/components/arrivals/ArrivalForm'
import ArrivalCalendar from '@/components/arrivals/ArrivalCalendar'
import { fmtDate } from '@/lib/utils'
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
import { Plus } from 'lucide-react'

export default function ArrivalsPage() {
  const [arrivals, setArrivals] = useState<Arrival[]>([])
  const [showForm, setShowForm] = useState(false)
<<<<<<< HEAD
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const fetchArrivals = async () => {
    const { data } = await supabase.from('arrivals').select('*, items(*)').order('expected_date')
    setArrivals(data || [])
  }
  useEffect(() => { fetchArrivals() }, [])

  const handleArrive = async (id: string, itemId: string, qty: number) => {
    await supabase.from('arrivals').update({ status: 'arrived' }).eq('id', id)
    const { data: stock } = await supabase.from('item_stocks').select('quantity').eq('item_id', itemId).single()
    await supabase.from('item_stocks').upsert({ item_id: itemId, quantity: (stock?.quantity ?? 0) + qty, updated_at: new Date().toISOString() })
    fetchArrivals()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="page-title">入荷管理</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="tab-bar">
            <button onClick={() => setViewMode('list')}     className={`tab-item ${viewMode === 'list'     ? 'active' : ''}`}>一覧</button>
            <button onClick={() => setViewMode('calendar')} className={`tab-item ${viewMode === 'calendar' ? 'active' : ''}`}>カレンダー</button>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> 入荷予定登録
          </button>
        </div>
      </div>

      {showForm && (
        <ArrivalForm onSaved={() => { setShowForm(false); fetchArrivals() }} onCancel={() => setShowForm(false)} />
      )}

      {viewMode === 'calendar' ? (
        <ArrivalCalendar arrivals={arrivals} />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>{['入荷ID','品目','発注日','入荷予定日','予定数','単位','ステータス',''].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {arrivals.map(a => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'DM Mono', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{a.id}</td>
                  <td>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{a.item_id}</p>
                    <p style={{ fontWeight: 500 }}>{a.items?.name}</p>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{new Date(a.order_date).toLocaleDateString('ja-JP')}</td>
                  <td>{new Date(a.expected_date).toLocaleDateString('ja-JP')}</td>
                  <td style={{ fontWeight: 600 }}>{a.quantity}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{a.unit}</td>
                  <td>
                    <span className={`badge ${a.status === 'arrived' ? 'badge-ok' : 'badge-warn'}`}>
                      {ARRIVAL_STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td>
                    {a.status === 'pending' && (
                      <button onClick={() => handleArrive(a.id, a.item_id, a.quantity)}
                        style={{ fontSize: '0.75rem', background: 'var(--ok-bg)', color: 'var(--ok)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                        入荷処理
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {arrivals.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>入荷データがありません</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
=======

  const load = async () => {
    const { data } = await supabase
      .from('arrivals').select('*, items(*)')
      .order('expected_date', { ascending: true })
    setArrivals(data ?? [])
  }
  useEffect(() => { load() }, [])

  const markArrived = async (id: string) => {
    await supabase.from('arrivals').update({ status: 'arrived' }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">入荷管理</h1>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} />入荷予定を登録
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <ArrivalForm onSaved={() => { load(); setShowForm(false) }} />
        </div>
      )}

      <ArrivalCalendar />

      {/* 一覧 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['入荷ID','品目','数量','発注日','入荷予定日','ステータス',''].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {arrivals.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs text-gray-500">{a.id}</td>
                <td className="px-3 py-2 font-medium">{a.items?.name}</td>
                <td className="px-3 py-2">{a.quantity} {a.items?.unit}</td>
                <td className="px-3 py-2 text-gray-600">{fmtDate(a.order_date)}</td>
                <td className="px-3 py-2">{fmtDate(a.expected_date)}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${a.status === 'arrived' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {ARRIVAL_STATUS_LABEL[a.status]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {a.status === 'pending' && (
                    <button onClick={() => markArrived(a.id)}
                      className="text-xs text-blue-600 hover:underline">入荷確認</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
    </div>
  )
}
