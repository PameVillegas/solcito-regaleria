import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [isManuallyUnavailable, setIsManuallyUnavailable] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [newColor, setNewColor] = useState('');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Promotion form
  const [promoDiscount, setPromoDiscount] = useState('');
  const [promoStart, setPromoStart] = useState('');
  const [promoEnd, setPromoEnd] = useState('');

  useEffect(() => {
    if (id) {
      api.getAdminProduct(id).then(p => {
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price.toString());
        setStock(p.stock.toString());
        setIsManuallyUnavailable(p.isManuallyUnavailable);
        setImages(p.images || []);
        setColors(p.colors || []);
        setPromotions(p.promotions || []);
      });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        isManuallyUnavailable,
      };
      if (isEditing) {
        await api.updateProduct(id!, data);
      } else {
        const product = await api.createProduct(data);
        navigate(`/admin/products/${product.id}`);
        return;
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !e.target.files) return;
    try {
      const files = Array.from(e.target.files);
      const result = await api.uploadImages(id, files);
      setImages(prev => [...prev, ...result]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!id) return;
    try {
      await api.deleteImage(id, imageId);
      setImages(prev => prev.filter(i => i.id !== imageId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddColor = async () => {
    if (!id || !newColor.trim()) return;
    try {
      const color = await api.addColor(id, newColor.trim());
      setColors(prev => [...prev, color]);
      setNewColor('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveColor = async (colorId: string) => {
    if (!id) return;
    try {
      await api.removeColor(id, colorId);
      setColors(prev => prev.filter(c => c.id !== colorId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreatePromotion = async () => {
    if (!id) return;
    try {
      const promo = await api.createPromotion(id, {
        discountPercentage: parseInt(promoDiscount),
        startDate: promoStart,
        endDate: promoEnd,
      });
      setPromotions(prev => [...prev, promo]);
      setPromoDiscount('');
      setPromoStart('');
      setPromoEnd('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancelPromotion = async (promoId: string) => {
    try {
      await api.cancelPromotion(promoId);
      setPromotions(prev => prev.map(p => p.id === promoId ? { ...p, isActive: false } : p));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? '✏️ Editar Artículo' : '➕ Nuevo Artículo'}
      </h1>

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={100}
            className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={500}
            className="w-full border rounded px-3 py-2 h-24" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
            <input type="number" step="0.01" min="0.01" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)}
              className="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="unavailable" checked={isManuallyUnavailable}
            onChange={e => setIsManuallyUnavailable(e.target.checked)} />
          <label htmlFor="unavailable" className="text-sm text-gray-700">Marcar como no disponible</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="bg-amber-500 text-white px-6 py-2 rounded font-medium hover:bg-amber-600 disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {/* Images section (only for existing products) */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h2 className="font-bold text-lg mb-3">🖼️ Imágenes ({images.length}/10)</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {images.map(img => (
              <div key={img.id} className="relative aspect-square">
                <img src={img.url} alt="" className="w-full h-full object-cover rounded" />
                <button onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs">✕</button>
              </div>
            ))}
          </div>
          {images.length < 10 && (
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageUpload}
              className="text-sm" />
          )}
        </div>
      )}

      {/* Colors section */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h2 className="font-bold text-lg mb-3">🎨 Colores ({colors.length}/20)</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map(c => (
              <span key={c.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {c.name}
                <button onClick={() => handleRemoveColor(c.id)} className="text-red-500 ml-1">✕</button>
              </span>
            ))}
          </div>
          {colors.length < 20 && (
            <div className="flex gap-2">
              <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)}
                placeholder="Nombre del color" className="border rounded px-3 py-1 flex-1" />
              <button onClick={handleAddColor} className="bg-amber-500 text-white px-4 py-1 rounded text-sm">
                Agregar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Promotions section */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h2 className="font-bold text-lg mb-3">🏷️ Promociones</h2>
          {promotions.filter(p => p.isActive).map(p => (
            <div key={p.id} className="bg-green-50 p-3 rounded mb-2 flex justify-between items-center">
              <span className="text-sm">-{p.discountPercentage}% (hasta {new Date(p.endDate).toLocaleDateString()})</span>
              <button onClick={() => handleCancelPromotion(p.id)} className="text-red-500 text-sm hover:underline">Cancelar</button>
            </div>
          ))}
          {!promotions.some(p => p.isActive) && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input type="number" min="1" max="99" value={promoDiscount} onChange={e => setPromoDiscount(e.target.value)}
                  placeholder="% desc." className="border rounded px-2 py-1 text-sm" />
                <input type="date" value={promoStart} onChange={e => setPromoStart(e.target.value)}
                  className="border rounded px-2 py-1 text-sm" />
                <input type="date" value={promoEnd} onChange={e => setPromoEnd(e.target.value)}
                  className="border rounded px-2 py-1 text-sm" />
              </div>
              <button onClick={handleCreatePromotion} className="bg-green-500 text-white px-4 py-1 rounded text-sm">
                Crear promoción
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
