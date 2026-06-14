import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatPrice } from '../utils/price';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (id) api.getProduct(id).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div className="text-center py-12">Cargando...</div>;

  const hasColors = product.colors && product.colors.length > 0;
  const isAvailable = product.stock > 0 && !product.isManuallyUnavailable;
  const activePromo = product.promotions?.[0];
  const displayPrice = activePromo
    ? Math.round(product.price * (1 - activePromo.discountPercentage / 100))
    : product.price;

  const handleAddToCart = () => {
    if (hasColors && !selectedColor) {
      setMessage('Seleccioná un color');
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      color: selectedColor,
      unitPrice: displayPrice,
      imageUrl: product.images?.[0]?.url || null,
      stock: product.stock,
    });
    setMessage('¡Agregado al carrito! 🌻');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <Link to="/" className="text-amber-600 hover:underline mb-4 inline-block">← Volver al catálogo</Link>

      <div className="bg-white rounded-lg shadow p-4 md:p-6 grid md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-2">
            {product.images?.[0] ? (
              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📷</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img: any) => (
                <img key={img.id} src={img.url} alt="" className="aspect-square object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

          {/* Price */}
          <div className="mt-4">
            {activePromo ? (
              <div>
                <span className="text-2xl font-bold text-red-500">{formatPrice(displayPrice)}</span>
                <span className="text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
                <span className="ml-2 bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded">
                  -{activePromo.discountPercentage}%
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-amber-700">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Availability */}
          {!isAvailable && (
            <p className="mt-3 text-red-500 font-medium">❌ No disponible</p>
          )}

          {/* Colors */}
          {hasColors && isAvailable && (
            <div className="mt-4">
              <p className="font-medium text-gray-700 mb-2">Color:</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1 border rounded-full text-sm transition ${
                      selectedColor === c.name
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-gray-300 hover:border-amber-400'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to cart */}
          {isAvailable && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <label className="font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center border rounded">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
                  <span className="px-4 py-1 border-x">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <span className="text-sm text-gray-500">({product.stock} disponibles)</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition"
              >
                🛒 Agregar al carrito
              </button>
            </div>
          )}

          {message && (
            <p className="mt-3 text-green-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
