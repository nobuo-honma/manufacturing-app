'use client'
import { ProductStock } from '@/lib/types'

<<<<<<< HEAD
interface Props { stocks: ProductStock[]; search?: string }

export default function ProductStockTable({ stocks, search = '' }: Props) {
  const today    = new Date()
  const warnDate = new Date(today); warnDate.setMonth(warnDate.getMonth() + 3)
  const filtered = stocks.filter(s => !search || s.products?.name.includes(search) || s.lot_code.includes(search))

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table className="data-table">
        <thead>
          <tr>{['製造Lot','製品名','製造種類','在庫(c/s)','在庫(p)','賞味期限','期限状態'].map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {filtered.map(s => {
            const expiry    = s.expiry_date ? new Date(s.expiry_date) : null
            const isExpired = expiry && expiry < today
            const isWarn    = expiry && !isExpired && expiry < warnDate
            return (
              <tr key={s.id} style={{ background: isExpired ? 'rgba(248,113,113,0.05)' : undefined }}>
                <td style={{ fontFamily: 'DM Mono', fontSize: '0.6875rem', color: 'var(--accent)' }}>{s.lot_code}</td>
                <td>{s.products?.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.products?.variant_name}</td>
                <td style={{ fontWeight: 600 }}>{s.qty_cs}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.qty_piece > 0 ? s.qty_piece : '-'}</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.expiry_date ?? '-'}</td>
                <td>
                  {isExpired && <span className="badge badge-danger">期限切れ</span>}
                  {isWarn    && <span className="badge badge-warn">要注意</span>}
                  {!isExpired && !isWarn && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>正常</span>}
=======
interface Props {
  stocks: ProductStock[]
  search?: string
}

export default function ProductStockTable({ stocks, search = '' }: Props) {
  const filtered = stocks.filter(s =>
    !search || s.products?.name.includes(search) || s.lot_code.includes(search)
  )

  const today = new Date()
  const warnDate = new Date(today)
  warnDate.setMonth(warnDate.getMonth() + 3)

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {['製造Lot','製品名','製造種類','在庫(c/s)','在庫(p)','賞味期限','期限状態'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {filtered.map(s => {
            const expiry     = s.expiry_date ? new Date(s.expiry_date) : null
            const isExpired  = expiry && expiry < today
            const isWarning  = expiry && !isExpired && expiry < warnDate
            return (
              <tr key={s.id} className={`hover:bg-gray-50 ${isExpired ? 'bg-red-50' : ''}`}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.lot_code}</td>
                <td className="px-4 py-3">{s.products?.name}</td>
                <td className="px-4 py-3">{s.products?.variant_name}</td>
                <td className="px-4 py-3 font-medium">{s.qty_cs}</td>
                <td className="px-4 py-3">{s.qty_piece > 0 ? s.qty_piece : '-'}</td>
                <td className="px-4 py-3 text-xs">{s.expiry_date ?? '-'}</td>
                <td className="px-4 py-3">
                  {isExpired  && <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">期限切れ</span>}
                  {isWarning  && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">要注意</span>}
                  {!isExpired && !isWarning && <span className="text-xs text-gray-400">正常</span>}
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
                </td>
              </tr>
            )
          })}
          {filtered.length === 0 && (
<<<<<<< HEAD
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>データがありません</td></tr>
=======
            <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">データがありません</td></tr>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
          )}
        </tbody>
      </table>
    </div>
  )
}
