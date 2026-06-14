import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { formatPrice } from '../utils/price';
import { generateWhatsAppMessage, generateWhatsAppUrl } from '../utils/whatsapp';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.getShippingOptions().then(setShippingOptions).catch(() => {});
    api.getPaymentOptions().then(setPaymentOptions).catch(() => {});
    api.getWhatsAppConfig().then(c => setPhoneNumber(c.phoneNumber)).catch(() => {});
  }, []);

  if (sent) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🌻</p>
        <h2 className="text-2xl font-bold text-green-600 mb-2">¡Pedido enviado!</h2>
        <p className="text-gray-600 mb-4">Tu pedido fue enviado por WhatsApp. La vendedora te contactará para coordinar.</p>
        <Link to="/" className="text-amber-600 hover:underline">Volver al catálogo →</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No hay artículos en tu carrito</p>
        <Link to="/" className="text-amber-600 hover:underline">Ver catálogo →</Link>
      </div>
    );
  }

  const handleSendOrder = () => {
    setError('');
    if (!selectedShipping) { setError('Seleccioná una opción de envío'); return; }
    if (!selectedPayment) { setError('Seleccioná una opción de pago'); return; }
    if (!phoneNumber) { setError('El número de WhatsApp no está configurado. Contactá al local.'); return; }

    const shippingName = shippingOptions.find(o => o.id === selectedShipping)?.name || '';
    const paymentName = paymentOptions.find(o => o.id === selectedPayment)?.name || '';

    const message = generateWhatsAppMessage({
      items: items.map(i => ({
        productName: i.productName,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      shippingOption: shippingName,
      paymentOption: paymentName,
      total: totalPrice,
    });

    const url = generateWhatsAppUrl(phoneNumber, message);
    window.open(url, '_blank');
    clearCart();
    setSent(true);
  };

  return (
    <div>
      <Link to="/cart" className="text-amber-600 hover:underline mb-4 inline-block">← Volver al carrito</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 Finalizar Pedido</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-lg mb-3">Resumen del pedido</h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={`${item.productId}-${item.color}`} className="flex justify-between text-sm">
                <span>
                  {item.productName} {item.color && `(${item.color})`} x{item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.quantity * item.unitPrice)}</span>
              </div>
            ))}
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-amber-700">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Shipping */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-3">🚚 Opción de envío</h2>
            {shippingOptions.length === 0 ? (
              <p className="text-red-500 text-sm">No hay opciones de envío disponibles</p>
            ) : (
              <div className="space-y-2">
                {shippingOptions.map(opt => (
                  <label key={opt.id} className={`block p-3 border rounded cursor-pointer transition ${
                    selectedShipping === opt.id ? 'border-amber-500 bg-amber-50' : 'hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={selectedShipping === opt.id}
                      onChange={() => setSelectedShipping(opt.id)}
                      className="mr-2"
                    />
                    <span className="font-medium">{opt.name}</span>
                    <p className="text-sm text-gray-500 ml-5">{opt.description}</p>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-3">💳 Opción de pago</h2>
            {paymentOptions.length === 0 ? (
              <p className="text-red-500 text-sm">No hay opciones de pago disponibles</p>
            ) : (
              <div className="space-y-2">
                {paymentOptions.map(opt => (
                  <label key={opt.id} className={`block p-3 border rounded cursor-pointer transition ${
                    selectedPayment === opt.id ? 'border-amber-500 bg-amber-50' : 'hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={selectedPayment === opt.id}
                      onChange={() => setSelectedPayment(opt.id)}
                      className="mr-2"
                    />
                    <span className="font-medium">{opt.name}</span>
                    <p className="text-sm text-gray-500 ml-5">{opt.description}</p>
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 font-medium">{error}</p>}

          <button
            onClick={handleSendOrder}
            className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <span>📱</span> Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
