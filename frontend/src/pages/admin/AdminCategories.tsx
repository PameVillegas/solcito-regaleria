import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getAdminCategories().then(setCategories).catch(() => {});
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const cat = await api.createCategory(newCategory.trim());
      setCategories(prev => [...prev, cat]);
      setNewCategory('');
      setMessage('✅ Categoría creada');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`¿Estás segura de eliminar la categoría "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      setMessage('✅ Categoría eliminada');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🏷️ Categorías</h1>
      <p className="text-gray-500 text-sm mb-6">
        Creá categorías para organizar tus productos. Después al agregar un artículo podés asignarle una categoría.
      </p>

      {message && <p className="text-sm font-medium mb-4">{message}</p>}

      {/* Add new category */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold text-lg mb-3">Agregar nueva categoría</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Nombre de la categoría (ej: Maquillaje, Peluches, Flores...)"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            maxLength={50}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
          />
          <button
            onClick={addCategory}
            className="bg-amber-500 text-white px-6 py-2 rounded font-medium hover:bg-amber-600 transition"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* List of categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg mb-3">Categorías existentes ({categories.length})</h2>
        {categories.length === 0 ? (
          <p className="text-gray-400">No hay categorías. Creá la primera arriba.</p>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <span className="font-medium text-gray-700">{cat.name}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id, cat.name)}
                  className="text-red-500 hover:text-red-700 text-sm hover:underline"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
