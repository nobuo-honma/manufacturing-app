import ItemStockTable from '@/components/inventory/ItemStockTable'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">在庫管理</h1>
      <ItemStockTable />
    </div>
  )
}
