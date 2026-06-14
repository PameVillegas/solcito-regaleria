/**
 * Formatea un precio en pesos argentinos (ARS).
 * Ejemplo: 1250.5 → "$1.250,50"
 */
export function formatPrice(price: number): string {
  return '$' + price.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
