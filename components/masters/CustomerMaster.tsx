'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Customer } from '@/lib/types'

function EditableCell({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal]         = useState(value)
  if (editing) return (
    <input className="border rounded px-1 py-0.5 text-xs w-full min-w-[80px]"
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { onSave(val); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onSave(val); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
      autoFocus />
  )
  return (
    <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded block truncate max-w-[200px]"
      title={value}
      onClick={() => { setVal(value); setEditing(true) }}>
      {value || <span className="text-gray-300">-</span>}
    </span>
  )
}

export default function CustomerMaster() {
  const [data, setData]   = useState<Customer[]>([])
  const [search, setSearch] = useState('')

  const fetch = async () => {
    const { data: d } = await supabase.from('customers').select('*').order('id')
    setData(d || [])
  }
  useEffect(() => { fetch() }, [])

  const handleUpdate = async (id: string, field: string, value: string) => {
    await supabase.from('customers').update({ [field]: value || null }).eq('id', id)
    fetch()
  }

  const filtered = data.filter(c =>
    !search || c.name.includes(search) || c.id.includes(search) || (c.address ?? '').includes(search)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">
          出荷先マスタ <span className="text-xs text-gray-400 font-normal">({data.length}件 / 表示:{filtered.length}件)</span>
        </h3>
        <input type="text" placeholder="名前・ID・住所で検索"
          className="border rounded-lg px-3 py-1.5 text-sm w-52"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>{['出荷先ID','出荷先名','担当者','郵便番号','住所','電話','FAX','備考'].map(h => (
              <th key={h} className="border px-3 py-2 text-left text-gray-600 font-semibold whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="border px-3 py-2 font-mono text-gray-400 whitespace-nowrap">{row.id}</td>
                <td className="border px-3 py-2"><EditableCell value={row.name} onSave={v => handleUpdate(row.id, 'name', v)} /></td>
                <td className="border px-3 py-2"><EditableCell value={row.contact_name ?? ''} onSave={v => handleUpdate(row.id, 'contact_name', v)} /></td>
                <td className="border px-3 py-2"><EditableCell value={row.postal_code ?? ''} onSave={v => handleUpdate(row.id, 'postal_code', v)} /></td>
                <td className="border px-3 py-2"><EditableCell value={row.address ?? ''} onSave={v => handleUpdate(row.id, 'address', v)} /></td>
                <td className="border px-3 py-2"><EditableCell value={row.phone ?? ''} onSave={v => handleUpdate(row.id, 'phone', v)} /></td>
                <td className="border px-3 py-2"><EditableCell value={row.fax ?? ''} onSave={v => handleUpdate(row.id, 'fax', v)} /></td>
                <td className="border px-3 py-2"><EditableCell value={row.notes ?? ''} onSave={v => handleUpdate(row.id, 'notes', v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
