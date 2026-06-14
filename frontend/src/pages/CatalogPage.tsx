import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatPrice } from '../utils/price';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = query.length >= 2
      ? api.searchProducts(query, page)
      : api.getProducts(page, selectedCategory || undefined);

    fetchData.then(res => {
      setProducts(res.data);
      setPagination(res.pagination);
    }).catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, page, selectedCategory]);

  return (
    <div>
      {/* Welcome message */}
      {!query && (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-700">¡Bienvenidos! 🌻</h1>
          <p className="text-gray-600 mt-1">Encontrá el regalo perfecto para cada ocasión</p>
        </div>
      )}

      {/* Category filters */}
      {categories.length > 0 && !query && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => { setSelectedCategory(''); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              !selectedCategory ? 'bg-amber-500 text-white' : 'bg-white text-gray-700 hover:bg-amber-100 border'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.id ? 'bg-amber-500 text-white' : 'bg-white text-gray-700 hover:bg-amber-100 border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {query && (
        <p className="mb-4 text-gray-600">
          Resultados para: <strong>"{query}"</strong> ({pagination?.totalItems || 0} encontrados)
        </p>
      )}

      {loading ? (
        <div className="text-center py-12 text-amber-700">Cargando artículos...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {query ? `No se encontraron resultados para "${query}"` : 'No hay artículos disponibles'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="aspect-square bg-gray-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📷</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                  <div className="mt-1">
                    {product.discountedPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">{formatPrice(product.discountedPrice)}</span>
                        <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      <span className="text-amber-700 font-bold">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  {product.promotion && (
                    <span className="inline-block mt-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                      -{product.promotion.discountPercentage}%
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-amber-500 text-white rounded disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="px-4 py-2 text-gray-600">
                Página {page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-amber-500 text-white rounded disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {/* Store info section */}
      <div className="mt-12 bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-lg font-bold text-amber-700 mb-3">📍 Información del local</h2>
        <p className="text-gray-700 font-medium">Vendedora: Sol Fernandez</p>
        <p className="text-gray-600 mt-2">📍 Calle Bolivia, Ciudad Junín, Provincia de Buenos Aires, Argentina</p>
        <a
          href="https://www.instagram.com/solcito.regaleria?igsh=YzFndTRlMDI4Z2V5"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-pink-600 hover:text-pink-700 font-medium"
        >
          📸 @solcito.regaleria en Instagram
        </a>
      </div>
    </div>
  );
}
