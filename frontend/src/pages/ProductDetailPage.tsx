import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatPrice } from '../utils/price';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (id) api.getProduct(id).then(setProduct).catch(() => setProduct(null));
    api.getWhatsAppConfig().then(c => setWhatsappNumber(c.phoneNumber)).catch(() => {});
  }, [id]);

  if (!product) return <div className="text-center py-12 text-gray-500">Cargando...</div>;

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

  const handleWhatsAppConsult = () => {
    if (!whatsappNumber) return;
    const text = `Hola! Me interesa el producto: ${product.name} (${formatPrice(displayPrice)})`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="px-4 py-4">
      <Link to="/" className="text-orange-500 hover:underline text-sm mb-4 inline-block">← Volver</Link>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Image gallery */}
        <div className="aspect-square bg-gray-50 relative">
          {product.images?.length > 0 ? (
            <img src={product.images[selectedImage]?.url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📷</div>
          )}
          {activePromo && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              -{activePromo.discountPercentage}%
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {product.images?.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {product.images.map((img: any, i: number) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? 'border-orange-400' : 'border-transparent'}`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Product info */}
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>

          {/* Availability */}
          {isAvailable ? (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">✓ Disponible</p>
          ) : (
            <p className="text-red-500 text-sm mt-1">❌ No disponible</p>
          )}

          {/* Price */}
          <div className="mt-3">
            {activePromo ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-600">{formatPrice(displayPrice)}</span>
                <span className="text-gray-400 line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-3">{product.description}</p>

          {/* Colors */}
          {hasColors && isAvailable && (
            <div className="mt-4">
              <p className="font-medium text-gray-700 text-sm mb-2">Colores disponibles:</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 border rounded-full text-sm transition ${
                      selectedColor === c.name
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-gray-300 text-gray-600 hover:border-orange-400'
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
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-full">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-full">−</button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-full">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 text-white py-2.5 rounded-full font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  🛒 Agregar al carrito
                </button>
              </div>

              {/* WhatsApp consult */}
              {whatsappNumber && (
                <button
                  onClick={handleWhatsAppConsult}
                  className="w-full border-2 border-green-500 text-green-600 py-2.5 rounded-full font-medium hover:bg-green-50 transition flex items-center justify-center gap-2"
                >
                  💬 Consultar por WhatsApp
                </button>
              )}
            </div>
          )}

          {message && (
            <p className="mt-3 text-green-600 font-medium text-sm text-center">{message}</p>
          )}
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <p className="text-lg">💳</p>
          <p className="text-xs text-gray-600">Pagos seguros</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <p className="text-lg">🚚</p>
          <p className="text-xs text-gray-600">Envíos a todo el país</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <p className="text-lg">✨</p>
          <p className="text-xs text-gray-600">100% originales</p>
        </div>
      </div>
    </div>
  );
}
