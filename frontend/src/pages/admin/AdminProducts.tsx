import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/price';

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api.getAdminProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás segura de eliminar "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📦 Artículos</h1>
        <Link to="/admin/products/new" className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition">
          + Nuevo artículo
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No hay artículos. Creá el primero.</p>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {p.images?.[0] ? (
                  <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">📷</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{p.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatPrice(p.price)} · Stock: {p.stock}
                  {p.isManuallyUnavailable && ' · ❌ No disponible'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/products/${p.id}`} className="text-amber-600 hover:underline text-sm">Editar</Link>
                <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:underline text-sm">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
