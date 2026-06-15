import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatPrice } from '../utils/price';
import { useWishlist } from '../context/WishlistContext';

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs text-red-500 font-medium">Agotado</span>;
  if (stock <= 3) return <span className="text-xs text-orange-500 font-medium">Últimas unidades</span>;
  return <span className="text-xs text-green-600 font-medium">Disponible</span>;
}

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
  const [showCatalog, setShowCatalog] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!showCatalog && !query) return;
    setLoading(true);
    const fetchData = query.length >= 2
      ? api.searchProducts(query, page)
      : api.getProducts(page, selectedCategory || undefined, sortBy || undefined);

    fetchData.then(res => {
      setProducts(res.data);
      setPagination(res.pagination);
    }).catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, page, selectedCategory, sortBy, showCatalog]);

  // If there's a search query, show catalog directly
  useEffect(() => {
    if (query) setShowCatalog(true);
  }, [query]);

  return (
    <div>
      {/* Hero Banner - Landing */}
      {!showCatalog && !query && (
        <div>
          {/* Main Hero */}
          <div className="bg-gradient-to-r from-[--color-terracota] via-[--color-rosa-viejo] to-[--color-terracota-light] text-white px-6 py-10 md:py-16 md:rounded-b-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
              <div className="max-w-lg">
                <h1 className="text-3xl md:text-5xl font-[--font-playfair] font-bold mb-3">Encontrá el regalo perfecto</h1>
                <p className="text-base md:text-lg opacity-90 mb-2 font-light">
                  🎂 Cumpleaños · 💝 Aniversarios · 👨 Día del Padre · 🎁 Regalos personalizados
                </p>
                <p className="text-sm opacity-80 mb-5">Detalles únicos, para momentos especiales.</p>
                <button
                  onClick={() => setShowCatalog(true)}
                  className="inline-block bg-white text-[--color-terracota] px-6 py-3 rounded-full font-bold hover:bg-[--color-crema] transition text-sm md:text-base shadow-lg"
                >
                  🛍️ Ver catálogo
                </button>
              </div>
              <img src="/banner.png" alt="Regalos" className="w-32 sm:w-40 md:w-56 lg:w-72 rounded-2xl shadow-2xl object-cover" />
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 md:gap-12 py-5 border-b border-[--color-rosa-suave] bg-white text-xs md:text-sm text-[--color-rosa-viejo] px-4 overflow-x-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg">🚚</span> Envíos a todo el país
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg">✨</span> Productos de calidad
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg">💬</span> Atención personalizada
            </div>
          </div>

          {/* Featured sections */}
          <div className="px-4 py-6 max-w-7xl mx-auto">
            {/* Quick access buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <button
                onClick={() => { setSortBy('newest'); setShowCatalog(true); }}
                className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition border border-[--color-rosa-suave]"
              >
                <span className="text-2xl block mb-1">🆕</span>
                <span className="text-sm font-medium text-[--color-terracota]">Nuevos ingresos</span>
              </button>
              <button
                onClick={() => { setSortBy('price_asc'); setShowCatalog(true); }}
                className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition border border-[--color-rosa-suave]"
              >
                <span className="text-2xl block mb-1">🏷️</span>
                <span className="text-sm font-medium text-[--color-terracota]">Ofertas de la semana</span>
              </button>
              <button
                onClick={() => { setSortBy(''); setShowCatalog(true); }}
                className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition border border-[--color-rosa-suave]"
              >
                <span className="text-2xl block mb-1">⭐</span>
                <span className="text-sm font-medium text-[--color-terracota]">Más vendidos</span>
              </button>
              <button
                onClick={() => { setShowCatalog(true); }}
                className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition border border-[--color-rosa-suave]"
              >
                <span className="text-2xl block mb-1">📂</span>
                <span className="text-sm font-medium text-[--color-terracota]">Categorías</span>
              </button>
            </div>

            {/* Categories preview */}
            {categories.length > 0 && (
              <div className="mb-8">
                <h2 className="font-[--font-playfair] font-bold text-[--color-terracota] text-lg mb-3">Categorías</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {categories.map((cat, i) => {
                    const emojis = ['🎂', '💝', '🌸', '💄', '✨', '🎁', '🧸', '💐'];
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setShowCatalog(true); }}
                        className="flex flex-col items-center gap-1 min-w-[80px]"
                      >
                        <div className="w-16 h-16 rounded-full bg-[--color-rosa-suave] flex items-center justify-center text-2xl border-2 border-[--color-rosa-viejo] hover:border-[--color-terracota] transition">
                          {emojis[i % emojis.length]}
                        </div>
                        <span className="text-xs text-gray-700 truncate max-w-[80px]">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info section */}
            <div className="bg-[--color-rosa-suave] rounded-xl p-6 text-center">
              <h2 className="font-[--font-playfair] font-bold text-[--color-terracota] text-lg mb-2">📍 Visitanos</h2>
              <p className="text-[--color-terracota]">Bolivia N° 592, Ciudad Junín, Buenos Aires</p>
              <p className="text-[--color-rosa-viejo] text-sm mt-1">Vendedora: Sol Fernandez</p>
              <a
                href="https://www.instagram.com/solcito.regaleria?igsh=YzFndTRlMDI4Z2V5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[--color-terracota] hover:underline font-medium text-sm"
              >
                📸 @solcito.regaleria
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Catalog view */}
      {(showCatalog || query) && (
        <div className="px-4 py-4" id="productos">
          {/* Back to landing */}
          {!query && (
            <button onClick={() => { setShowCatalog(false); setSelectedCategory(''); setSortBy(''); }} className="text-orange-500 text-sm mb-4 hover:underline">
              ← Volver al inicio
            </button>
          )}

          {/* Categories */}
          {categories.length > 0 && !query && (
            <div className="mb-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${!selectedCategory ? 'bg-[--color-terracota] text-white' : 'bg-white text-gray-600 border border-[--color-rosa-suave] hover:border-[--color-terracota]'}`}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat.id ? 'bg-[--color-terracota] text-white' : 'bg-white text-gray-600 border border-[--color-rosa-suave] hover:border-[--color-terracota]'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort + title */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">
              {query ? `Resultados para "${query}"` : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Productos' : '🔥 Nuestros productos'}
            </h2>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="text-xs border rounded-lg px-2 py-1.5 bg-white text-gray-600"
            >
              <option value="">Ordenar</option>
              <option value="name_asc">A → Z</option>
              <option value="name_desc">Z → A</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
              <option value="newest">Más nuevos</option>
            </select>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Cargando...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay artículos disponibles</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                    {/* Wishlist button */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                    >
                      {isInWishlist(product.id) ? '❤️' : '🤍'}
                    </button>

                    <Link to={`/product/${product.id}`}>
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
                        <StockBadge stock={product.stock} />
                        <div className="mt-1">
                          {product.discountedPrice ? (
                            <div>
                              <span className="text-gray-400 line-through text-xs">{formatPrice(product.price)}</span>
                              <span className="text-[--color-terracota] font-bold text-sm ml-1">{formatPrice(product.discountedPrice)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-800 font-bold text-sm">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 bg-[--color-terracota] text-white rounded-full text-sm disabled:opacity-50">←</button>
                  <span className="px-3 py-1.5 text-gray-600 text-sm">{page} / {pagination.totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                    className="px-3 py-1.5 bg-[--color-terracota] text-white rounded-full text-sm disabled:opacity-50">→</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
