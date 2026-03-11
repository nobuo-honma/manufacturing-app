'use client'
<<<<<<< HEAD
import { useState } from 'react'
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { OrderStatus } from '@/lib/types'
import { ORDER_STATUS_LABEL } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  received:      'badge badge-blue',
  in_production: 'badge badge-warn',
  shipped:       'badge badge-ok',
}

export default function OrderList() {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const { orders, loading } = useOrders(filterStatus === 'all' ? undefined : filterStatus)

  const tabs = [
    { value: 'all',           label: 'すべて' },
    { value: 'received',      label: '受注済' },
    { value: 'in_production', label: '製造中' },
    { value: 'shipped',       label: '出荷済' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="tab-bar" style={{ alignSelf: 'flex-start' }}>
        {tabs.map(t => (
          <button key={t.value} onClick={() => setFilterStatus(t.value as any)}
            className={`tab-item ${filterStatus === t.value ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              {['受注ID','受注日','希望出荷日','出荷先','製品名','製造種類','受注数','ステータス',''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'DM Mono', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{o.id}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{new Date(o.order_date).toLocaleDateString('ja-JP')}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{new Date(o.desired_ship_date).toLocaleDateString('ja-JP')}</td>
                <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.customers?.name}</td>
                <td>{o.products?.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{o.products?.variant_name}</td>
                <td style={{ fontWeight: 600 }}>{o.quantity} c/s</td>
                <td><span className={STATUS_STYLE[o.status]}>{ORDER_STATUS_LABEL[o.status]}</span></td>
                <td>
                  <Link href={`/production/${o.id}`} style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none' }}>
                    製造計画 →
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>受注データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
=======
import { useOrders } from '@/hooks/useOrders'
import { ORDER_STATUS_LABEL, OrderStatus } from '@/lib/types'
import { fmtDate } from '@/lib/utils'
import Link from 'next/link'

const STATUS_CLS: Record<OrderStatus, string> = {
  received:      'bg-blue-100 text-blue-700',
  in_production: 'bg-yellow-100 text-yellow-700',
  shipped:       'bg-green-100 text-green-700',
}

export default function OrderList() {
  const { orders, loading, updateStatus } = useOrders()

  if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {['受注ID','受注日','希望出荷日','出荷先','製品','製造種類','受注数','ステータス',''].map(h => (
              <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono text-xs text-gray-500">{o.id}</td>
              <td className="px-3 py-2 text-gray-600">{fmtDate(o.order_date)}</td>
              <td className="px-3 py-2 font-medium">{fmtDate(o.desired_ship_date)}</td>
              <td className="px-3 py-2 text-gray-700 max-w-xs truncate">{o.customers?.name}</td>
              <td className="px-3 py-2">{o.products?.name}</td>
              <td className="px-3 py-2">{o.products?.variant_name}</td>
              <td className="px-3 py-2 font-medium">{o.quantity} c/s</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[o.status]}`}>
                  {ORDER_STATUS_LABEL[o.status]}
                </span>
              </td>
              <td className="px-3 py-2">
                <Link href={`/production?orderId=${o.id}`}
                  className="text-blue-600 hover:underline text-xs">製造計画</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="text-center py-8 text-gray-400 text-sm">受注データがありません</p>
      )}
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
    </div>
  )
}
