'use client'
<<<<<<< HEAD
import { useState } from 'react'
import ProductMaster  from '@/components/masters/ProductMaster'
import ItemMaster     from '@/components/masters/ItemMaster'
import CustomerMaster from '@/components/masters/CustomerMaster'
import BomMaster      from '@/components/masters/BomMaster'

type MasterTab = 'products' | 'items' | 'customers' | 'bom'

const TABS: { key: MasterTab; label: string }[] = [
  { key: 'products',  label: '製品マスタ' },
  { key: 'items',     label: '品目マスタ' },
  { key: 'customers', label: '出荷先マスタ' },
  { key: 'bom',       label: 'BOM（部品表）' },
]

export default function MastersPage() {
  const [tab, setTab] = useState<MasterTab>('products')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">マスタ管理</h1>
      <div className="tab-bar" style={{ alignSelf: 'flex-start' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`tab-item ${tab === t.key ? 'active' : ''}`}>
=======
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Item, Customer } from '@/lib/types'

type MasterTab = 'product' | 'item' | 'customer' | 'bom'

export default function MastersPage() {
  const [tab, setTab] = useState<MasterTab>('product')

  const tabs: { key: MasterTab; label: string }[] = [
    { key: 'product',  label: '製品マスタ'   },
    { key: 'item',     label: '品目マスタ'   },
    { key: 'customer', label: '出荷先マスタ' },
    { key: 'bom',      label: 'BOM'          },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">マスタ管理</h1>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
              ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
            {t.label}
          </button>
        ))}
      </div>
<<<<<<< HEAD
      <div className="card" style={{ padding: '20px' }}>
        {tab === 'products'  && <ProductMaster />}
        {tab === 'items'     && <ItemMaster />}
        {tab === 'customers' && <CustomerMaster />}
        {tab === 'bom'       && <BomMaster />}
=======

      {tab === 'product'  && <ProductMasterTable />}
      {tab === 'item'     && <ItemMasterTable />}
      {tab === 'customer' && <CustomerMasterTable />}
      {tab === 'bom'      && <BomTable />}
    </div>
  )
}

// --- 製品マスタ ---
function ProductMasterTable() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    supabase.from('products').select('*').order('id').then(({ data }) => setProducts(data ?? []))
  }, [])
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>{['製品ID','製品名','製造種類','1kg個数','1c/s個数','親製品ID'].map(h => (
            <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono font-medium">{p.id}</td>
              <td className="px-3 py-2">{p.name}</td>
              <td className="px-3 py-2">{p.variant_name}</td>
              <td className="px-3 py-2">{p.unit_per_kg}</td>
              <td className="px-3 py-2">{p.unit_per_cs}</td>
              <td className="px-3 py-2 font-mono text-gray-400">{p.parent_id ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- 品目マスタ ---
function ItemMasterTable() {
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    supabase.from('items').select('*').order('id').then(({ data }) => setItems(data ?? []))
  }, [])
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>{['品目ID','品目名','区分','規格量','単位','安全在庫'].map(h => (
            <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map(i => (
            <tr key={i.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono">{i.id}</td>
              <td className="px-3 py-2 font-medium">{i.name}</td>
              <td className="px-3 py-2 text-gray-500">{i.item_type === 'raw_material' ? '原材料' : '資材'}</td>
              <td className="px-3 py-2">{i.unit_size}</td>
              <td className="px-3 py-2">{i.unit}</td>
              <td className="px-3 py-2">{i.safety_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- 出荷先マスタ ---
function CustomerMasterTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  useEffect(() => {
    supabase.from('customers').select('*').order('id').then(({ data }) => setCustomers(data ?? []))
  }, [])
  const filtered = customers.filter(c => c.name.includes(search) || c.id.includes(search))
  return (
    <div className="space-y-3">
      <input type="text" placeholder="出荷先名・IDで検索..."
        className="border rounded-lg px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search} onChange={e => setSearch(e.target.value)} />
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['出荷先ID','出荷先名','担当者','郵便番号','住所'].map(h => (
              <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.slice(0, 50).map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono">{c.id}</td>
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-gray-500">{c.contact_name ?? '-'}</td>
                <td className="px-3 py-2 text-gray-500">{c.postal_code ?? '-'}</td>
                <td className="px-3 py-2 text-gray-500 max-w-xs truncate">{c.address ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 50 && (
          <p className="text-xs text-gray-400 px-4 py-2">他 {filtered.length - 50} 件（検索で絞り込んでください）</p>
        )}
      </div>
    </div>
  )
}

// --- BOM ---
function BomTable() {
  const [bom, setBom]         = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter]   = useState('')
  useEffect(() => {
    Promise.all([
      supabase.from('bom').select('*, items(*)').order('product_id'),
      supabase.from('products').select('*').order('id'),
    ]).then(([{ data: b }, { data: p }]) => {
      setBom(b ?? [])
      setProducts(p ?? [])
    })
  }, [])

  const filteredBom = filter
    ? bom.filter(b => b.product_id === filter)
    : bom

  return (
    <div className="space-y-3">
      <select className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">全製品</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.id} {p.variant_name}</option>
        ))}
      </select>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['製品ID','品目ID','品目名','区分','使用率','単位','計算基準'].map(h => (
              <th key={h} className="px-3 py-2.5 text-left font-medium text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBom.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono">{b.product_id}</td>
                <td className="px-3 py-2 font-mono text-gray-500">{b.item_id}</td>
                <td className="px-3 py-2 font-medium">{b.items?.name}</td>
                <td className="px-3 py-2 text-gray-500">{b.items?.item_type === 'raw_material' ? '原材料' : '資材'}</td>
                <td className="px-3 py-2">{b.usage_rate}</td>
                <td className="px-3 py-2">{b.unit}</td>
                <td className="px-3 py-2 text-gray-500">
                  {b.basis_type === 'production_qty' ? '製造量基準' : '受注数基準'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
      </div>
    </div>
  )
}
