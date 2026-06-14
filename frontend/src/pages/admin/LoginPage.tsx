import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.login(username, password);
      localStorage.setItem('admin_token', token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logosol.png" alt="SOLCITO REGALERIA" className="h-24 w-auto" />
        </div>

        <h1 className="text-xl font-bold text-center text-amber-700 mb-1">SOLCITO REGALERIA</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Panel de Administración</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-2 rounded font-medium hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar como Administradora'}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Client access button */}
        <Link
          to="/"
          className="block w-full text-center bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition"
        >
          🛒 Ingresar como Cliente al Catálogo
        </Link>
      </div>
    </div>
  );
}
