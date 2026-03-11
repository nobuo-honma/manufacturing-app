'use client'
import { useStockAlerts } from '@/hooks/useInventory'
import { getStockStatus } from '@/lib/utils'
<<<<<<< HEAD
import { AlertTriangle } from 'lucide-react'
=======
import { AlertTriangle, AlertCircle } from 'lucide-react'
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0

export default function StockAlert() {
  const { alerts, loading } = useStockAlerts()

<<<<<<< HEAD
  if (loading) return <div className="card" style={{ height: '120px', animation: 'pulse 1.5s infinite' }} />

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={15} style={{ color: alerts.length > 0 ? 'var(--danger)' : 'var(--ok)' }} />
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>在庫アラート</span>
        {alerts.length > 0 && (
          <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>{alerts.length}件</span>
        )}
      </div>
      {alerts.length === 0 ? (
        <div style={{ padding: '14px 18px', fontSize: '0.8125rem', color: 'var(--ok)' }}>✓ アラートはありません</div>
      ) : (
        <ul style={{ maxHeight: '220px', overflowY: 'auto' }}>
          {alerts.map(s => {
            const status = getStockStatus(s.quantity, s.items?.safety_stock ?? 0)
            return (
              <li key={s.item_id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 18px',
                borderBottom: '1px solid var(--border)',
                fontSize: '0.8125rem',
              }}>
                <div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.items?.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginLeft: '6px', fontFamily: 'DM Mono' }}>{s.item_id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {s.quantity} <span style={{ color: 'var(--text-muted)' }}>/ {s.items?.safety_stock}{s.items?.unit}</span>
                  </span>
                  <span className={`badge ${status === '不足' ? 'badge-danger' : 'badge-warn'}`}>{status}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
=======
  if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-xl" />
  if (alerts.length === 0) return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
      ✅ 在庫アラートはありません
    </div>
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
        <AlertTriangle size={16} className="text-red-500" />
        <span className="text-sm font-semibold text-red-700">在庫アラート（{alerts.length}件）</span>
      </div>
      <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
        {alerts.map(s => {
          const status = getStockStatus(s.quantity, s.items?.safety_stock ?? 0)
          return (
            <li key={s.item_id} className="px-4 py-2.5 flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{s.items?.name}</span>
                <span className="ml-2 text-gray-400 text-xs">{s.items?.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">
                  {s.quantity} {s.items?.unit}
                  <span className="text-gray-400 ml-1">/ 安全在庫 {s.items?.safety_stock}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${status === '不足' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {status}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
    </div>
  )
}
