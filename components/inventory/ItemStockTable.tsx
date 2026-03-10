'use client'
import { useState } from 'react'
import { useItemStocks, useProductStocks } from '@/hooks/useInventory'
import { getStockStatus } from '@/lib/utils'
import { ItemType } from '@/lib/types'
import StocktakingForm from './StocktakingForm'

const STATUS_CLS = {
  '充足': 'bg-green-100 text-green-700',
  '注意': 'bg-yellow-100 text-yellow-700',
  '不足': 'bg-red-100 text-red-700',
}

type Tab = ItemType | 'product'

export default function ItemStockTable() {
  const [tab, setTab]           = useState<Tab>('raw_material')
  const [takingId, setTakingId] = useState<string | null>(null)

  const { stocks: itemStocks, loading: iLoading, refresh } = useItemStocks(
    tab !== 'product' ? tab : undefined
  )
  const { stocks: productStocks, loading: pLoading } = useProductStocks()

  const tabs: { key: Tab; label: string }[] = [
    { key: 'raw_material', label: '原材料' },
    { key: 'material',     label: '資材'   },
    { key: 'product',      label: '製品'   },
  ]

  return (
    <div className="space-y-4">
      {/* タブ */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
              ${tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 棚卸モーダル */}
      {takingId && (
        <StocktakingForm
          itemId={takingId}
          currentQty={itemStocks.find(s => s.item_id === takingId)?.quantity ?? 0}
          onClose={() => { setTakingId(null); refresh() }}
        />
      )}

      {/* 品目在庫テーブル */}
      {tab !== 'product' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['品目ID','品目名','在庫数','単位','安全在庫','ステータス','棚卸'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {iLoading
                ? <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">読込中...</td></tr>
                : itemStocks
                    .filter(s => s.items?.item_type === tab)
                    .map(s => {
                      const status = getStockStatus(s.quantity, s.items?.safety_stock ?? 0)
                      return (
                        <tr key={s.item_id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono text-xs text-gray-500">{s.item_id}</td>
                          <td className="px-3 py-2 font-medium">{s.items?.name}</td>
                          <td className="px-3 py-2 font-bold">{s.quantity}</td>
                          <td className="px-3 py-2 text-gray-500">{s.items?.unit}</td>
                          <td className="px-3 py-2 text-gray-500">{s.items?.safety_stock}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[status]}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <button onClick={() => setTakingId(s.item_id)}
                              className="text-xs text-blue-600 hover:underline">棚卸</button>
                          </td>
                        </tr>
                      )
                    })
              }
            </tbody>
          </table>
        </div>
      )}

      {/* 製品在庫テーブル */}
      {tab === 'product' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['製造Lot','製品名','製造種類','在庫(c/s)','在庫(p)','賞味期限'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pLoading
                ? <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">読込中...</td></tr>
                : productStocks.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-xs">{s.lot_code}</td>
                      <td className="px-3 py-2">{s.products?.name}</td>
                      <td className="px-3 py-2">{s.products?.variant_name}</td>
                      <td className="px-3 py-2 font-bold">{s.qty_cs}</td>
                      <td className="px-3 py-2">{s.qty_piece}</td>
                      <td className="px-3 py-2 text-gray-600">{s.expiry_date}</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
