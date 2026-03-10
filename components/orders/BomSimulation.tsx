'use client'
import { useBomSimulation } from '@/hooks/useBomSimulation'

const STATUS_CLS = {
  '充足': 'bg-green-100 text-green-700',
  '注意': 'bg-yellow-100 text-yellow-700',
  '不足': 'bg-red-100 text-red-700',
}

interface Props {
  productId: string
  orderQtyCs: number
  productionKg: number
}

export default function BomSimulation({ productId, orderQtyCs, productionKg }: Props) {
  const { results, loading } = useBomSimulation(productId, orderQtyCs, productionKg)

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-lg" />
  if (!results.length) return null

  const shortage = results.filter(r => r.status === '不足').length
  const warning  = results.filter(r => r.status === '注意').length

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <span className="text-sm font-semibold">原材料・資材 使用シミュレーション</span>
        <div className="flex gap-2 text-xs">
          {shortage > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">不足 {shortage}件</span>}
          {warning  > 0 && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">注意 {warning}件</span>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['品目ID','品目名','種別','計算基準','必要数','現在庫','差分','状態'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map(r => (
              <tr key={r.item_id} className={r.status === '不足' ? 'bg-red-50' : ''}>
                <td className="px-3 py-2 font-mono text-gray-500">{r.item_id}</td>
                <td className="px-3 py-2 font-medium">{r.item_name}</td>
                <td className="px-3 py-2 text-gray-500">{r.item_type === 'raw_material' ? '原材料' : '資材'}</td>
                <td className="px-3 py-2 text-gray-500">{r.basis_type === 'production_qty' ? '製造量基準' : '受注数基準'}</td>
                <td className="px-3 py-2">{r.required_qty} {r.unit}</td>
                <td className="px-3 py-2">{r.current_stock} {r.unit}</td>
                <td className={`px-3 py-2 font-medium ${r.diff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {r.diff > 0 ? '+' : ''}{r.diff} {r.unit}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_CLS[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
