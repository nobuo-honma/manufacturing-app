'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Item, ItemType } from '@/lib/types'

function EditableCell({ value, onSave }: { value: string | number; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal]         = useState(String(value))
  if (editing) return (
    <input className="border rounded px-1 py-0.5 text-xs w-full min-w-[60px]"
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { onSave(val); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onSave(val); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
      autoFocus />
  )
  return <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded block" onClick={() => { setVal(String(value)); setEditing(true) }}>{value}</span>
}

export default function ItemMaster() {
  const [data, setData]         = useState<Item[]>([])
  const [filterType, setFilterType] = useState<'all' | ItemType>('all')
  const [search, setSearch]     = useState('')

  const fetch = async () => {
    const { data: d } = await supabase.from('items').select('*').order('item_type').order('id')
    setData(d || [])
  }
  useEffect(() => { fetch() }, [])

  const handleUpdate = async (id: string, field: string, value: string) => {
    const v = ['unit_size','safety_stock'].includes(field) ? Number(value) : value
    await supabase.from('items').update({ [field]: v }).eq('id', id)
    fetch()
  }

  const filtered = data
    .filter(d => filterType === 'all' || d.item_type === filterType)
    .filter(d => !search || d.name.includes(search) || d.id.includes(search))

  return (
    <div>
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h3 className="font-semibold text-gray-700">品目マスタ <span className="text-xs text-gray-400 font-normal">({data.length}件)</span></h3>
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="品目名・IDで検索" className="border rounded-lg px-3 py-1.5 text-xs w-40"
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex border rounded-lg overflow-hidden text-xs">
            {(['all','raw_material','material'] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 ${filterType === t ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}>
                {t === 'all' ? 'すべて' : t === 'raw_material' ? '原材料' : '資材'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>{['品目ID','品目名','区分','規格量','単位','安全在庫'].map(h => (
              <th key={h} className="border px-3 py-2 text-left text-gray-600 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="border px-3 py-2 font-mono text-gray-400">{row.id}</td>
                <td className="border px-3 py-2"><EditableCell value={row.name} onSave={v => handleUpdate(row.id, 'name', v)} /></td>
                <td className="border px-3 py-2 text-gray-400">{row.item_type === 'raw_material' ? '原材料' : '資材'}</td>
                <td className="border px-3 py-2"><EditableCell value={row.unit_size} onSave={v => handleUpdate(row.id, 'unit_size', v)} /></td>
                <td className="border px-3 py-2">{row.unit}</td>
                <td className="border px-3 py-2"><EditableCell value={row.safety_stock} onSave={v => handleUpdate(row.id, 'safety_stock', v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
