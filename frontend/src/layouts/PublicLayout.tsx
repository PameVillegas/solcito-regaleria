import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function PublicLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[--color-crema] pb-16 md:pb-0 font-[--font-poppins]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-[--color-rosa-suave]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Menu hamburger (mobile) */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[--color-terracota] text-xl">
            ☰
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logosol.png" alt="Logo" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <span className="font-[--font-playfair] font-bold text-[--color-terracota] text-sm leading-tight block">Solcito Regalería</span>
              <span className="text-xs text-[--color-rosa-viejo] font-light">Detalles únicos, para momentos especiales</span>
            </div>
          </Link>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-[--color-rosa-suave] rounded-l-full text-sm bg-white focus:outline-none focus:border-[--color-terracota] font-[--font-poppins]"
            />
            <button type="submit" className="bg-[--color-terracota] text-white px-4 rounded-r-full hover:bg-[--color-terracota-light] transition">
              🔍
            </button>
          </form>

          {/* Cart */}
          <Link to="/cart" className="relative text-[--color-terracota]">
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-[--color-terracota] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Search (mobile) */}
        <div className="md:hidden px-4 pb-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-[--color-rosa-suave] rounded-l-full text-sm bg-white focus:outline-none focus:border-[--color-terracota]"
            />
            <button type="submit" className="bg-[--color-terracota] text-white px-4 rounded-r-full">
              🔍
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[--color-rosa-suave] px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-700">🏠 Inicio</Link>
            <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-700">📍 Nosotros</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-700">🛒 Carrito</Link>
            <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-400 text-sm">🔒 Admin</Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[--color-terracota] text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logosol.png" alt="Logo" className="h-8 w-auto" />
                <div>
                  <p className="font-[--font-playfair] font-bold">Solcito Regalería</p>
                  <p className="text-[--color-rosa-suave] text-xs">Detalles únicos, para momentos especiales</p>
                </div>
              </div>
              <p className="text-[--color-rosa-suave] text-sm">Vendedora: Sol Fernandez</p>
            </div>
            <div>
              <p className="font-medium mb-2">📍 Ubicación</p>
              <p className="text-[--color-rosa-suave] text-sm">Bolivia N° 592, Ciudad Junín</p>
              <p className="text-[--color-rosa-suave] text-sm">Provincia de Buenos Aires, Argentina</p>
              <p className="text-[--color-rosa-suave] text-sm mt-1">📞 +54 236 427 4864</p>
            </div>
            <div>
              <p className="font-medium mb-2">🕐 Horarios</p>
              <p className="text-[--color-rosa-suave] text-sm">Lunes a Sábados</p>
              <p className="text-[--color-rosa-suave] text-sm">08:00 a 12:00 | 16:00 a 21:00</p>
              <a href="https://www.instagram.com/solcito.regaleria?igsh=YzFndTRlMDI4Z2V5" target="_blank" rel="noopener noreferrer"
                className="text-[--color-rosa-suave] text-sm hover:text-white mt-2 inline-block">
                📸 @solcito.regaleria
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[--color-terracota-light] text-center py-2">
          <Link to="/admin/login" className="text-[--color-rosa-suave] text-xs hover:text-white">Acceso administración</Link>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/542364274864?text=Hola%20Solcito%20Regalería!%20Quiero%20consultar%20por%20un%20producto"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-4 bg-green-500 text-white rounded-full flex items-center gap-2 shadow-lg hover:bg-green-600 transition z-50 px-4 py-3"
        aria-label="WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="hidden md:inline font-medium text-sm">Consultanos</span>
      </a>

      {/* Bottom navigation (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[--color-rosa-suave] flex justify-around py-2 z-50">
        <Link to="/" className="flex flex-col items-center text-xs text-[--color-terracota]">
          <span className="text-lg">🏠</span>
          Inicio
        </Link>
        <Link to="/nosotros" className="flex flex-col items-center text-xs text-gray-500">
          <span className="text-lg">📍</span>
          Nosotros
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-xs text-gray-500 relative">
          <span className="text-lg">🛒</span>
          Carrito
          {totalItems > 0 && (
            <span className="absolute -top-1 right-2 bg-[--color-terracota] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </div>
  );
}
