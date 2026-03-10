'use client'
import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { supabase } from '@/lib/supabase'
import { Printer } from 'lucide-react'

export default function ArrivalCalendar() {
  const [events, setEvents] = useState<any[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('arrivals').select('*, items(*)')
    setEvents((data ?? []).map(a => ({
      title: `${a.items?.name} ${a.quantity}${a.items?.unit}`,
      date:  a.expected_date.slice(0, 10),
      color: a.status === 'arrived' ? '#22c55e' : '#3b82f6',
    })))
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4 no-print">
        <h2 className="text-lg font-semibold text-gray-800">入荷予定表</h2>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800">
          <Printer size={14} />印刷
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        headerToolbar={{ left:'prev,next today', center:'title', right:'' }}
        height="auto"
      />
    </div>
  )
}
