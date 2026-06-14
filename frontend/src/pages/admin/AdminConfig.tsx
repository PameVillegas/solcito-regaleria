import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function AdminConfig() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newShipping, setNewShipping] = useState({ name: '', description: '' });
  const [newPayment, setNewPayment] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getAdminWhatsApp().then(c => setWhatsappNumber(c.phoneNumber)).catch(() => {});
    api.getAdminShipping().then(setShippingOptions).catch(() => {});
    api.getAdminPayment().then(setPaymentOptions).catch(() => {});
    api.getAdminCategories().then(setCategories).catch(() => {});
  }, []);

  const saveWhatsApp = async () => {
    try {
      await api.updateWhatsApp(whatsappNumber);
      setMessage('✅ Número de WhatsApp guardado');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  const addShipping = async () => {
    if (!newShipping.name || !newShipping.description) return;
    try {
      const opt = await api.createShipping(newShipping);
      setShippingOptions(prev => [...prev, opt]);
      setNewShipping({ name: '', description: '' });
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  const deleteShipping = async (id: string) => {
    await api.deleteShipping(id);
    setShippingOptions(prev => prev.filter(o => o.id !== id));
  };

  const addPayment = async () => {
    if (!newPayment.name || !newPayment.description) return;
    try {
      const opt = await api.createPayment(newPayment);
      setPaymentOptions(prev => [...prev, opt]);
      setNewPayment({ name: '', description: '' });
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  const deletePayment = async (id: string) => {
    await api.deletePayment(id);
    setPaymentOptions(prev => prev.filter(o => o.id !== id));
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const cat = await api.createCategory(newCategory.trim());
      setCategories(prev => [...prev, cat]);
      setNewCategory('');
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  const deleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">⚙️ Configuración</h1>

      {message && <p className="text-sm font-medium">{message}</p>}

      {/* WhatsApp */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg mb-3">📱 Número de WhatsApp</h2>
        <p className="text-sm text-gray-500 mb-2">Incluí el código de país (ej: 5491123456789 para Argentina)</p>
        <div className="flex gap-2">
          <input type="text" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
            placeholder="5491123456789" className="flex-1 border rounded px-3 py-2" />
          <button onClick={saveWhatsApp} className="bg-green-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg mb-3">🚚 Opciones de envío</h2>
        <div className="space-y-2 mb-4">
          {shippingOptions.map(opt => (
            <div key={opt.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div>
                <span className="font-medium">{opt.name}</span>
                <span className="text-sm text-gray-500 ml-2">{opt.description}</span>
              </div>
              <button onClick={() => deleteShipping(opt.id)} className="text-red-500 text-sm">Eliminar</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" value={newShipping.name} onChange={e => setNewShipping(p => ({ ...p, name: e.target.value }))}
            placeholder="Nombre" className="border rounded px-3 py-1" maxLength={50} />
          <input type="text" value={newShipping.description} onChange={e => setNewShipping(p => ({ ...p, description: e.target.value }))}
            placeholder="Descripción" className="border rounded px-3 py-1" maxLength={200} />
          <button onClick={addShipping} className="bg-amber-500 text-white px-4 py-1 rounded text-sm">Agregar</button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg mb-3">🏷️ Categorías</h2>
        <div className="space-y-2 mb-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="font-medium">{cat.name}</span>
              <button onClick={() => deleteCategory(cat.id)} className="text-red-500 text-sm">Eliminar</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)}
            placeholder="Nombre de categoría" className="flex-1 border rounded px-3 py-1" maxLength={50} />
          <button onClick={addCategory} className="bg-amber-500 text-white px-4 py-1 rounded text-sm">Agregar</button>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg mb-3">💳 Opciones de pago</h2>
        <div className="space-y-2 mb-4">
          {paymentOptions.map(opt => (
            <div key={opt.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div>
                <span className="font-medium">{opt.name}</span>
                <span className="text-sm text-gray-500 ml-2">{opt.description}</span>
              </div>
              <button onClick={() => deletePayment(opt.id)} className="text-red-500 text-sm">Eliminar</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" value={newPayment.name} onChange={e => setNewPayment(p => ({ ...p, name: e.target.value }))}
            placeholder="Nombre" className="border rounded px-3 py-1" maxLength={50} />
          <input type="text" value={newPayment.description} onChange={e => setNewPayment(p => ({ ...p, description: e.target.value }))}
            placeholder="Descripción" className="border rounded px-3 py-1" maxLength={200} />
          <button onClick={addPayment} className="bg-amber-500 text-white px-4 py-1 rounded text-sm">Agregar</button>
        </div>
      </div>
    </div>
  );
}
