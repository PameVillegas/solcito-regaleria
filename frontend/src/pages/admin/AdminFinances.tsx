import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/price';

export function AdminFinances() {
  const [entries, setEntries] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'ingreso', description: '', amount: '', date: '' });
  const [message, setMessage] = useState('');

  const fetchData = () => {
    api.getFinances().then(setEntries).catch(() => {});
    api.getFinanceSummary().then(setSummary).catch(() => {});
  };

  useEffect(fetchData, []);

  const handleSubmit = async () => {
    if (!form.description || !form.amount) { setMessage('❌ Completá descripción y monto'); return; }
    try {
      await api.createFinance(form);
      setShowForm(false);
      setForm({ type: 'ingreso', description: '', amount: '', date: '' });
      fetchData();
      setMessage('✅ Registro guardado');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) { setMessage('❌ ' + err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este registro?')) return;
    await api.deleteFinance(id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800" style={{fontFamily:'Playfair Display,serif'}}>📈 Finanzas</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#C5A46B] text-white px-4 py-2 rounded hover:bg-[#B8956A]">
          + Nuevo registro
        </button>
      </div>

      {message && <p className="mb-4 text-sm font-medium">{message}</p>}

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-xl font-bold text-green-600">{formatPrice(summary.income)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <p className="text-sm text-gray-500">Gastos</p>
            <p className="text-xl font-bold text-red-500">{formatPrice(summary.expenses)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3E5E0]">
            <p className="text-sm text-gray-500">Ganancia</p>
            <p className={`text-xl font-bold ${summary.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>{formatPrice(summary.profit)}</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#F3E5E0] mb-6">
          <h3 className="font-bold text-lg mb-4">Nuevo registro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="border rounded px-3 py-2 text-sm">
              <option value="ingreso">💚 Ingreso</option>
              <option value="gasto">🔴 Gasto</option>
            </select>
            <input type="number" placeholder="Monto ($)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="border rounded px-3 py-2 text-sm" />
            <input type="text" placeholder="Descripción" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border rounded px-3 py-2 text-sm" />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="border rounded px-3 py-2 text-sm" />
          </div>
          <button onClick={handleSubmit} className="bg-[#C5A46B] text-white px-6 py-2 rounded font-medium hover:bg-[#B8956A]">Guardar</button>
        </div>
      )}

      {/* Entries list */}
      <div className="space-y-2">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-lg shadow-sm p-3 border border-[#F3E5E0] flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-700 text-sm">{entry.description}</p>
              <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString('es-AR')}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <p className={`font-bold ${entry.type === 'ingreso' ? 'text-green-600' : 'text-red-500'}`}>
                {entry.type === 'ingreso' ? '+' : '-'}{formatPrice(entry.amount)}
              </p>
              <button onClick={() => handleDelete(entry.id)} className="text-red-400 text-xs">✕</button>
            </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-gray-400 text-center py-8">No hay registros</p>}
      </div>
    </div>
  );
}
