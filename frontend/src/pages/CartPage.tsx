import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
        <Link to="/" className="text-amber-600 hover:underline">Ver catálogo →</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🛒 Tu Carrito</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}`} className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
            {/* Image */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{item.productName}</h3>
              {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
              <p className="text-amber-700 font-bold">{formatPrice(item.unitPrice)}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 text-lg"
              >-</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 text-lg"
              >+</button>
            </div>

            {/* Subtotal */}
            <div className="text-right hidden sm:block">
              <p className="font-bold text-gray-800">{formatPrice(item.quantity * item.unitPrice)}</p>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.productId, item.color)}
              className="text-red-500 hover:text-red-700 text-xl"
              aria-label="Eliminar"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="mt-6 bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xl font-bold text-gray-800">
          Total: <span className="text-amber-700">{formatPrice(totalPrice)}</span>
        </p>
        <Link
          to="/checkout"
          className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition"
        >
          Finalizar pedido →
        </Link>
      </div>
    </div>
  );
}
