'use client'
import { useTodayProduction } from '@/hooks/useProduction'
import { Factory } from 'lucide-react'
import { PLAN_STATUS_LABEL } from '@/lib/types'

export default function TodaySchedule() {
  const { plans, loading } = useTodayProduction()

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Factory size={16} className="text-blue-500" />
        <span className="text-sm font-semibold text-gray-700">本日の製造予定</span>
      </div>
      {plans.length === 0
        ? <p className="px-4 py-4 text-sm text-gray-400">本日の製造予定はありません</p>
        : (
          <ul className="divide-y divide-gray-100">
            {plans.map(p => (
              <li key={p.id} className="px-4 py-3 text-sm flex items-center justify-between">
                <div>
                  <span className="font-medium">{p.products?.name}</span>
                  <span className="text-gray-500 ml-1">{p.products?.variant_name}</span>
                  <span className="ml-2 text-gray-400 text-xs">{p.orders?.customers?.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <span>{p.production_kg}kg</span>
                  <span>{p.planned_cs}c/s</span>
                  {p.lot_code && <span className="text-xs text-blue-600 font-mono">{p.lot_code}</span>}
                  <span className={`px-2 py-0.5 rounded-full text-xs
                    ${p.status === 'completed'   ? 'bg-green-100 text-green-700'
                    : p.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'}`}>
                    {PLAN_STATUS_LABEL[p.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  )
}
