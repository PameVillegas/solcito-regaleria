export function NosotrosPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">📍 Sobre Nosotros</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Logo and name */}
        <div className="text-center">
          <img src="/logosol.png" alt="Solcito Regalería" className="h-20 w-auto mx-auto mb-3" />
          <h2 className="text-xl font-bold text-amber-700">Solcito Regalería</h2>
          <p className="text-gray-500">Regalos para toda ocasión</p>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">👩‍💼</span>
            <div>
              <p className="font-medium text-gray-700">Vendedora</p>
              <p className="text-gray-600">Sol Fernandez</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-medium text-gray-700">Dirección</p>
              <p className="text-gray-600">Bolivia N° 592, Ciudad Junín</p>
              <p className="text-gray-600">Provincia de Buenos Aires, Argentina</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-medium text-gray-700">Teléfono / WhatsApp</p>
              <a href="tel:+542364274864" className="text-orange-600 hover:underline">+54 236 427 4864</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🕐</span>
            <div>
              <p className="font-medium text-gray-700">Horarios de atención</p>
              <p className="text-gray-600">Lunes a Sábados</p>
              <p className="text-gray-600">08:00 a 12:00 hs</p>
              <p className="text-gray-600">16:00 a 21:00 hs</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">📸</span>
            <div>
              <p className="font-medium text-gray-700">Instagram</p>
              <a
                href="https://www.instagram.com/solcito.regaleria?igsh=YzFndTRlMDI4Z2V5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                @solcito.regaleria
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/542364274864?text=Hola%20Solcito%20Regalería!%20Quiero%20hacer%20una%20consulta"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-500 text-white text-center py-3 rounded-full font-medium hover:bg-green-600 transition"
        >
          💬 Escribinos por WhatsApp
        </a>
      </div>
    </div>
  );
}
