'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Arrival, ARRIVAL_STATUS_LABEL } from '@/lib/types'
import ArrivalForm from '@/components/arrivals/ArrivalForm'
import ArrivalCalendar from '@/components/arrivals/ArrivalCalendar'
import { fmtDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function ArrivalsPage() {
  const [arrivals, setArrivals] = useState<Arrival[]>([])
  const [showForm, setShowForm] = useState(false)

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
    </div>
  )
}
