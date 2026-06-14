import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function PublicLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top bar with admin link */}
      <div className="bg-amber-700 text-amber-200 text-xs py-1 px-4 flex justify-end">
        <Link to="/admin/login" className="hover:text-white transition">
          Admin
        </Link>
      </div>

      {/* Header */}
      <header className="bg-amber-500 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logosol.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-white font-bold text-lg md:text-2xl whitespace-nowrap">
              SOLCITO REGALERIA
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md order-3 md:order-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </form>

          {/* Cart button */}
          <Link
            to="/cart"
            className="relative bg-white text-amber-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-amber-100 transition order-2 md:order-3"
          >
            🛒 Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-amber-600 text-white text-center py-4 text-sm">
        <p>🌻 SOLCITO REGALERIA - Regalos para toda ocasión</p>
      </footer>
    </div>
  );
}
