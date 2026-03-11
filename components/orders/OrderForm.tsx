'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Customer, Product } from '@/lib/types'
import { generateOrderId } from '@/lib/utils'
import BomSimulation from './BomSimulation'

export default function OrderForm() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts]   = useState<Product[]>([])
  const [search, setSearch]       = useState('')
  const [form, setForm] = useState({
    desired_ship_date: '',
    customer_id: '',
    product_id: '',
    quantity: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('customers').select('id,name').order('name'),
      supabase.from('products').select('*').order('name'),
    ]).then(([{ data: c }, { data: p }]) => {
      setCustomers(c ?? [])
      setProducts(p ?? [])
    })
  }, [])

  const filteredCustomers = customers.filter(c =>
    c.name.includes(search) || c.id.includes(search)
  )

  // 製品名でグループ化
  const productGroups = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.name]) acc[p.name] = []
    acc[p.name].push(p)
    return acc
  }, {})

  const selectedProduct = products.find(p => p.id === form.product_id)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: latest } = await supabase
      .from('orders')
      .select('id')
      .like('id', `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-%%`)
      .order('id', { ascending: false })
      .limit(1)
    const seq = latest?.length ? parseInt(latest[0].id.slice(-3)) + 1 : 1
    const id  = generateOrderId(new Date(), seq)

    const { error } = await supabase.from('orders').insert({
      id,
      order_date:        new Date().toISOString(),
      desired_ship_date: form.desired_ship_date,
      customer_id:       form.customer_id,
      product_id:        form.product_id,
      quantity:          Number(form.quantity),
      notes:             form.notes || null,
      status:            'received',
    })
    if (!error) {
      setSubmitted(true)
      setForm({ desired_ship_date:'', customer_id:'', product_id:'', quantity:'', notes:'' })
      setSearch('')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✅ 受注登録が完了しました
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 希望出荷日 */}
        <div>
          <label className="block text-sm font-medium mb-1">希望出荷日 <span className="text-red-500">*</span></label>
<<<<<<< HEAD
          <input type="date" required className="input"
=======
          <input type="date" required className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
            value={form.desired_ship_date} onChange={e => set('desired_ship_date', e.target.value)} />
        </div>

        {/* 出荷先（検索付き） */}
        <div>
          <label className="block text-sm font-medium mb-1">出荷先 <span className="text-red-500">*</span></label>
          <input type="text" placeholder="出荷先名・IDで検索..."
<<<<<<< HEAD
            className="input" style={{ marginBottom:"8px" }}
            value={search} onChange={e => setSearch(e.target.value)} />
          <select required className="input"
=======
            className="border rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select required className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
            value={form.customer_id} onChange={e => set('customer_id', e.target.value)}>
            <option value="">選択してください</option>
            {filteredCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.id} {c.name}</option>
            ))}
          </select>
        </div>

        {/* 製品名（グループ選択） */}
        <div>
          <label className="block text-sm font-medium mb-1">製品名 / 製造種類 <span className="text-red-500">*</span></label>
<<<<<<< HEAD
          <select required className="input"
=======
          <select required className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
            value={form.product_id} onChange={e => set('product_id', e.target.value)}>
            <option value="">選択してください</option>
            {Object.entries(productGroups).map(([name, prods]) => (
              <optgroup key={name} label={name}>
                {prods.map(p => (
                  <option key={p.id} value={p.id}>{p.variant_name}（{p.id}）</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* 受注数 */}
        <div>
          <label className="block text-sm font-medium mb-1">受注数（c/s） <span className="text-red-500">*</span></label>
<<<<<<< HEAD
          <input type="number" required min="1" className="input"
=======
          <input type="number" required min="1" className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
            value={form.quantity} onChange={e => set('quantity', e.target.value)} />
          {selectedProduct && form.quantity && (
            <p className="text-xs text-gray-500 mt-1">
              ≈ {Number(form.quantity) * selectedProduct.unit_per_cs} 個
              （1c/s = {selectedProduct.unit_per_cs}個）
            </p>
          )}
        </div>

        {/* 備考 */}
        <div>
          <label className="block text-sm font-medium mb-1">備考</label>
<<<<<<< HEAD
          <textarea rows={2} className="input"
=======
          <textarea rows={2} className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <button type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 w-full font-medium">
          受注を登録する
        </button>
      </form>

      {/* BOMシミュレーション */}
      {form.product_id && form.quantity && (
        <BomSimulation
          productId={form.product_id}
          orderQtyCs={Number(form.quantity)}
          productionKg={Number(form.quantity) / selectedProduct!.unit_per_kg * selectedProduct!.unit_per_cs}
        />
      )}
    </div>
  )
}
