import { formatPrice } from './price';

export interface CartItemForMessage {
  productName: string;
  color: string | null;
  quantity: number;
  unitPrice: number;
}

export interface OrderForMessage {
  items: CartItemForMessage[];
  shippingOption: string;
  paymentOption: string;
  total: number;
}

/**
 * Genera el texto del mensaje de WhatsApp con los detalles del pedido.
 */
export function generateWhatsAppMessage(order: OrderForMessage): string {
  let message = '🌻 *PEDIDO - SOLCITO REGALERIA*\n\n';
  message += '📦 *Artículos:*\n';

  order.items.forEach((item, index) => {
    const subtotal = item.quantity * item.unitPrice;
    message += `${index + 1}. ${item.productName}`;
    if (item.color) message += ` (${item.color})`;
    message += `\n   Cantidad: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(subtotal)}\n`;
  });

  message += `\n🚚 *Envío:* ${order.shippingOption}`;
  message += `\n💳 *Pago:* ${order.paymentOption}`;
  message += `\n\n💰 *TOTAL: ${formatPrice(order.total)}*`;
  message += '\n\n¡Gracias por tu compra! 🌻';

  return message;
}

/**
 * Genera la URL de WhatsApp con el mensaje pre-redactado.
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
