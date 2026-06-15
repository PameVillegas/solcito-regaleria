import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/price';

export function AdminSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', paymentMethod: 'Efectivo', notes: '', items: [{ productName: '', quantity: 1, unitPrice: 0, color: '' }] });
  const [message, setMessage] = useState('');

  const fetchData = () => {
    api.getAdminSales().then(setSales).catch(() => {});
    api.getSalesStats().then(setStats).catch(() => {});
  };

  useEffect(fetchData, []);

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { productName: '', quantity: 1, unitPrice: 0, color: '' }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, field: string, value: any) => setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }));

  const total = form.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const handleSubmit = async () => {
    if (!form.items[0]?.productName) { setMessage('❌ Agregá al menos un artículo'); return; }
    try {
      await api.createSale({ ...form, total });
      setShowForm(false);
      setForm({ customerName: '', paymentMethod: 'Efectivo', notes: '', items: [{ productName: '', quantity: 1, unitPrice: 0, color: '' }] });
      fetchData();
      setMessage('✅ Venta registrada');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) { setMessage('❌ ' + err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta venta?')) return;
    await api.deleteSale(id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{fontFamily:'Playfair Display,serif'}}>💰 Ventas</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#C5A46B] text-white px-4 py-2 rounded hover:bg-[#B8956A]">
          + Nueva venta
        </button>
      </div>

      {message && <p className="mb-4 text-sm font-medium">{message}</p>}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <p className="text-sm text-gray-500">Hoy</p>
            <p className="text-xl font-bold text-[#C5A46B]">{formatPrice(stats.daily.revenue)}</p>
            <p className="text-xs text-gray-400">{stats.daily.sales} ventas</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <p className="text-sm text-gray-500">Este mes</p>
            <p className="text-xl font-bold text-[#C5A46B]">{formatPrice(stats.monthly.revenue)}</p>
            <p className="text-xs text-gray-400">{stats.monthly.sales} ventas</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <p className="text-sm text-gray-500">Total histórico</p>
            <p className="text-xl font-bold text-[#C5A46B]">{formatPrice(stats.total.revenue)}</p>
            <p className="text-xs text-gray-400">{stats.total.sales} ventas</p>
          </div>
        </div>
      )}

      {/* Top products */}
      {stats?.topProducts?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0] mb-6">
          <h3 className="font-bold text-gray-700 mb-2">⭐ Más vendidos</h3>
          <div className="space-y-1">
            {stats.topProducts.map((p: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{i + 1}. {p.name}</span>
                <span className="text-[#C5A46B] font-medium">{p.quantity} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New sale form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#F3E5E0] mb-6">
          <h3 className="font-bold text-lg mb-4">Registrar venta</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Nombre del cliente (opcional)" value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="border rounded px-3 py-2 text-sm" />
            <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="border rounded px-3 py-2 text-sm">
              <option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option><option>Mercado Pago</option>
            </select>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">Artículos:</p>
          {form.items.map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2">
              <input type="text" placeholder="Producto" value={item.productName} onChange={e => updateItem(i, 'productName', e.target.value)} className="border rounded px-2 py-1 text-sm col-span-2" />
              <input type="number" placeholder="Cant." min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} className="border rounded px-2 py-1 text-sm" />
              <div className="flex gap-1">
                <input type="number" placeholder="Precio" value={item.unitPrice || ''} onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)} className="border rounded px-2 py-1 text-sm flex-1" />
                {form.items.length > 1 && <button onClick={() => removeItem(i)} className="text-red-500 text-sm">✕</button>}
              </div>
            </div>
          ))}
          <button onClick={addItem} className="text-[#C5A46B] text-sm hover:underline mb-3">+ Agregar artículo</button>
          <div className="flex justify-between items-center mt-3">
            <p className="font-bold text-lg">Total: {formatPrice(total)}</p>
            <button onClick={handleSubmit} className="bg-[#C5A46B] text-white px-6 py-2 rounded font-medium hover:bg-[#B8956A]">Guardar venta</button>
          </div>
        </div>
      )}

      {/* Sales list */}
      <div className="space-y-3">
        {sales.map(sale => (
          <div key={sale.id} className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{sale.customerName || 'Cliente sin nombre'}</p>
                <p className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleString('es-AR')}</p>
                <p className="text-xs text-gray-500 mt-1">💳 {sale.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#C5A46B]">{formatPrice(sale.total)}</p>
                <button onClick={() => handleDelete(sale.id)} className="text-red-400 text-xs hover:underline mt-1">Eliminar</button>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {sale.items?.map((item: any, i: number) => (
                <span key={i}>{item.productName} x{item.quantity}{i < sale.items.length - 1 ? ' · ' : ''}</span>
              ))}
            </div>
          </div>
        ))}
        {sales.length === 0 && <p className="text-gray-400 text-center py-8">No hay ventas registradas</p>}
      </div>
    </div>
  );
}
