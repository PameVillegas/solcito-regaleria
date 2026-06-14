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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Menu hamburger (mobile) */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600 text-xl">
            ☰
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logosol.png" alt="Logo" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <span className="font-bold text-gray-800 text-sm leading-tight block">Solcito Regalería</span>
              <span className="text-xs text-gray-500">Regalos para toda ocasión</span>
            </div>
          </Link>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full text-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <button type="submit" className="bg-orange-500 text-white px-4 rounded-r-full hover:bg-orange-600">
              🔍
            </button>
          </form>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-700">
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full text-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <button type="submit" className="bg-orange-500 text-white px-4 rounded-r-full">
              🔍
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-1 text-gray-700">🏠 Inicio</Link>
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
      <footer className="bg-green-700 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logosol.png" alt="Logo" className="h-8 w-auto" />
                <div>
                  <p className="font-bold">Solcito Regalería</p>
                  <p className="text-green-200 text-xs">Regalos para toda ocasión</p>
                </div>
              </div>
              <p className="text-green-200 text-sm">Vendedora: Sol Fernandez</p>
            </div>
            <div>
              <p className="font-medium mb-2">📍 Ubicación</p>
              <p className="text-green-200 text-sm">Calle Bolivia, Ciudad Junín</p>
              <p className="text-green-200 text-sm">Provincia de Buenos Aires, Argentina</p>
            </div>
            <div>
              <p className="font-medium mb-2">📱 Redes</p>
              <a href="https://www.instagram.com/solcito.regaleria?igsh=YzFndTRlMDI4Z2V5" target="_blank" rel="noopener noreferrer"
                className="text-green-200 text-sm hover:text-white flex items-center gap-1">
                📸 @solcito.regaleria
              </a>
            </div>
          </div>
        </div>
        {/* Admin link tiny */}
        <div className="border-t border-green-600 text-center py-2">
          <Link to="/admin/login" className="text-green-300 text-xs hover:text-white">Acceso administración</Link>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/5491123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-4 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition text-2xl z-50"
        aria-label="WhatsApp"
      >
        💬
      </a>

      {/* Bottom navigation (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
        <Link to="/" className="flex flex-col items-center text-xs text-orange-500">
          <span className="text-lg">🏠</span>
          Inicio
        </Link>
        <Link to="/?view=categories" className="flex flex-col items-center text-xs text-gray-500">
          <span className="text-lg">📂</span>
          Categorías
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-xs text-gray-500 relative">
          <span className="text-lg">🛒</span>
          Carrito
          {totalItems > 0 && (
            <span className="absolute -top-1 right-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </div>
  );
}
