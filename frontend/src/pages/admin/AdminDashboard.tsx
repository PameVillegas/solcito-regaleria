import { Link, useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Logo arriba */}
      <div className="text-center mb-8">
        <img src="/logosol.png" alt="Solcito Regalería" className="h-20 w-auto mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-[#C5A46B]" style={{fontFamily:'Playfair Display,serif'}}>Panel de Administración</h1>
        <p className="text-gray-500 text-sm">Bienvenida Sol. Elegí una sección para gestionar tu negocio.</p>
      </div>

      {/* Grid de secciones */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition border border-[#F3E5E0] group">
          <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">📦</p>
          <h2 className="font-bold text-gray-800 text-sm">Artículos</h2>
          <p className="text-xs text-gray-400 mt-1">Agregar, editar y eliminar productos</p>
        </Link>

        <Link to="/admin/categories" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition border border-[#F3E5E0] group">
          <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏷️</p>
          <h2 className="font-bold text-gray-800 text-sm">Categorías</h2>
          <p className="text-xs text-gray-400 mt-1">Organizar productos por categoría</p>
        </Link>

        <Link to="/admin/sales" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition border border-[#F3E5E0] group">
          <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">💰</p>
          <h2 className="font-bold text-gray-800 text-sm">Ventas</h2>
          <p className="text-xs text-gray-400 mt-1">Registrar ventas y ver estadísticas</p>
        </Link>

        <Link to="/admin/finances" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition border border-[#F3E5E0] group">
          <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">📈</p>
          <h2 className="font-bold text-gray-800 text-sm">Finanzas</h2>
          <p className="text-xs text-gray-400 mt-1">Ingresos, gastos y ganancias</p>
        </Link>

        <Link to="/admin/config" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition border border-[#F3E5E0] group">
          <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚙️</p>
          <h2 className="font-bold text-gray-800 text-sm">Configuración</h2>
          <p className="text-xs text-gray-400 mt-1">WhatsApp, envío y pago</p>
        </Link>

        <Link to="/" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition border border-[#F3E5E0] group">
          <p className="text-4xl mb-3 group-hover:scale-110 transition-transform">👁️</p>
          <h2 className="font-bold text-gray-800 text-sm">Ver Catálogo</h2>
          <p className="text-xs text-gray-400 mt-1">Ver cómo lo ven los clientes</p>
        </Link>
      </div>

      {/* Cerrar sesión abajo */}
      <div className="mt-10 text-center">
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-600 text-sm font-medium transition"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );
}
