import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🌻 Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <p className="text-3xl mb-2">📦</p>
          <h2 className="font-bold text-lg">Artículos</h2>
          <p className="text-gray-500 text-sm">Agregar, editar y gestionar productos</p>
        </Link>
        <Link to="/admin/config" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <p className="text-3xl mb-2">⚙️</p>
          <h2 className="font-bold text-lg">Configuración</h2>
          <p className="text-gray-500 text-sm">Envío, pago y WhatsApp</p>
        </Link>
        <Link to="/" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <p className="text-3xl mb-2">👁️</p>
          <h2 className="font-bold text-lg">Ver Catálogo</h2>
          <p className="text-gray-500 text-sm">Ver cómo ven los clientes tu tienda</p>
        </Link>
      </div>
    </div>
  );
}
