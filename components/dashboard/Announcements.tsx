'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Announcement } from '@/lib/types'
import { Megaphone } from 'lucide-react'
import { fmtDate } from '@/lib/utils'

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([])

  useEffect(() => {
    supabase.from('announcements')
      .select('*').order('published_at', { ascending: false }).limit(5)
      .then(({ data }) => setItems(data ?? []))
  }, [])

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Megaphone size={16} className="text-blue-500" />
        <span className="text-sm font-semibold text-gray-700">お知らせ</span>
      </div>
      {items.length === 0
        ? <p className="px-4 py-4 text-sm text-gray-400">お知らせはありません</p>
        : (
          <ul className="divide-y divide-gray-100">
            {items.map(a => (
              <li key={a.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-gray-400">{fmtDate(a.published_at)}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                {a.content && <p className="text-xs text-gray-500 mt-0.5">{a.content}</p>}
              </li>
            ))}
          </ul>
        )
      }
    </div>
  )
}
