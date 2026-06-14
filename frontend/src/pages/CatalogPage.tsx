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
  const [sortBy, setSortBy] = useState<string>('');
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
      : api.getProducts(page, selectedCategory || undefined, sortBy || undefined);

    fetchData.then(res => {
      setProducts(res.data);
      setPagination(res.pagination);
    }).catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, page, selectedCategory, sortBy]);

  return (
    <div>
      {/* Hero Banner */}
      {!query && !selectedCategory && (
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-8 md:py-12 md:rounded-b-2xl">
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Regalos</h1>
            <p className="text-lg md:text-xl font-light mb-1">para toda ocasión</p>
            <p className="text-sm opacity-90 mb-4">Sorprendé a esa persona especial con el detalle perfecto.</p>
            <a href="#productos" className="inline-block bg-green-500 text-white px-5 py-2 rounded-full font-medium hover:bg-green-600 transition text-sm">
              Ver productos
            </a>
          </div>
        </div>
      )}

      {/* Trust badges */}
      {!query && !selectedCategory && (
        <div className="flex justify-center gap-6 md:gap-12 py-4 border-b bg-white text-xs text-gray-600 px-4 overflow-x-auto">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>🚚</span> Envíos a todo el país
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>✨</span> Productos de calidad
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>💬</span> Atención personalizada
          </div>
        </div>
      )}

      <div className="px-4 py-4" id="productos">
        {/* Categories section */}
        {categories.length > 0 && !query && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800">Categorías</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => { setSelectedCategory(''); setPage(1); }}
                className={`flex flex-col items-center gap-1 min-w-[70px] ${!selectedCategory ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${!selectedCategory ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-gray-100'}`}>
                  🛍️
                </div>
                <span className="text-xs text-gray-700">Todos</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                  className={`flex flex-col items-center gap-1 min-w-[70px] ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${selectedCategory === cat.id ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-gray-100'}`}>
                    🎁
                  </div>
                  <span className="text-xs text-gray-700 truncate max-w-[70px]">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results info */}
        {query && (
          <p className="mb-4 text-gray-600">
            Resultados para: <strong>"{query}"</strong> ({pagination?.totalItems || 0})
          </p>
        )}
        {selectedCategory && !query && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-gray-600 font-medium">
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
            <button onClick={() => setSelectedCategory('')} className="text-xs text-orange-500 hover:underline">✕ Limpiar filtro</button>
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {query ? `No se encontraron resultados para "${query}"` : 'No hay artículos disponibles'}
            </p>
          </div>
        ) : (
          <>
            {/* Section title + Sort */}
            {!query && (
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-800">🔥 Nuestros productos</h2>
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setPage(1); }}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="">Ordenar por</option>
                  <option value="name_asc">A → Z</option>
                  <option value="name_desc">Z → A</option>
                  <option value="price_asc">Menor precio</option>
                  <option value="price_desc">Mayor precio</option>
                  <option value="newest">Más nuevos</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gray-50 relative">
                    {product.images?.[0] ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📷</div>
                    )}
                    {product.promotion && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        -{product.promotion.discountPercentage}%
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-700 truncate">{product.name}</h3>
                    <div className="mt-1">
                      {product.discountedPrice ? (
                        <div>
                          <span className="text-gray-400 line-through text-xs">{formatPrice(product.price)}</span>
                          <span className="text-orange-600 font-bold text-sm ml-1">{formatPrice(product.discountedPrice)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-800 font-bold text-sm">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm disabled:opacity-50"
                >
                  ←
                </button>
                <span className="px-3 py-1.5 text-gray-600 text-sm">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
