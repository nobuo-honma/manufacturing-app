'use client'
import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { supabase } from '@/lib/supabase'
import { Printer } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  planned:     '#3b82f6',
  in_progress: '#f59e0b',
  completed:   '#22c55e',
}

export default function ProductionCalendar() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('production_plans')
      .select('*, products(*), orders(*, customers(*))')
      .then(({ data }) => {
        setEvents((data ?? []).map(p => ({
          title: `${p.products?.variant_name} ${p.production_kg}kg/${p.planned_cs}c/s`,
          date:  p.production_date,
          color: STATUS_COLOR[p.status] ?? '#6b7280',
          extendedProps: { lot: p.lot_code, customer: p.orders?.customers?.name },
        })))
      })
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4 no-print">
        <h2 className="text-xl font-bold text-gray-900">製造予定表</h2>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm">
          <Printer size={15} />
          印刷
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        headerToolbar={{ left:'prev,next today', center:'title', right:'' }}
        eventContent={arg => (
          <div className="text-xs px-1 truncate">
            <strong>{arg.event.title}</strong>
            {arg.event.extendedProps.lot && (
              <span className="ml-1 opacity-70">{arg.event.extendedProps.lot}</span>
            )}
          </div>
        )}
        height="auto"
      />
    </div>
  )
}
