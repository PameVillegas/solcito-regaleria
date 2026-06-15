import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden bg-[#C5A46B] text-white p-4 flex items-center justify-between">
        <span className="font-bold" style={{fontFamily:'Playfair Display,serif'}}>🌻 Admin</span>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`${menuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#C5A46B] text-white min-h-screen`}>
        <div className="p-4 hidden md:block">
          <Link to="/admin" className="block">
            <h1 className="font-bold text-lg" style={{fontFamily:'Playfair Display,serif'}}>🌻 SOLCITO</h1>
            <p className="text-[#FFF9F5] text-sm opacity-80">Panel de Administración</p>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            📊 Dashboard
          </Link>
          <Link to="/admin/products" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            📦 Artículos
          </Link>
          <Link to="/admin/categories" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            🏷️ Categorías
          </Link>
          <Link to="/admin/sales" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            💰 Ventas
          </Link>
          <Link to="/admin/finances" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            📈 Finanzas
          </Link>
          <Link to="/admin/config" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            ⚙️ Configuración
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded hover:bg-[#B8956A] transition">
            👁️ Ver catálogo
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 rounded hover:bg-red-500 transition text-left mt-4">
            🚪 Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
