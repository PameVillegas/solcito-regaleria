import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatPrice } from '../utils/price';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = query.length >= 2
      ? api.searchProducts(query, page)
      : api.getProducts(page);

    fetchData.then(res => {
      setProducts(res.data);
      setPagination(res.pagination);
    }).catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, page]);

  if (loading) {
    return <div className="text-center py-12 text-amber-700">Cargando artículos...</div>;
  }

  return (
    <div>
      {query && (
        <p className="mb-4 text-gray-600">
          Resultados para: <strong>"{query}"</strong> ({pagination?.totalItems || 0} encontrados)
        </p>
      )}

      {products.length === 0 ? (
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
    </div>
  );
}
