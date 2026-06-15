const API_URL = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && path.includes('/admin')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && path.includes('/admin')) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    throw new Error('No autorizado');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(data.error || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Public
  getProducts: (page = 1, categoryId?: string, sort?: string) => {
    let url = `/api/products?page=${page}`;
    if (categoryId) url += `&category=${categoryId}`;
    if (sort) url += `&sort=${sort}`;
    return request<any>(url);
  },
  searchProducts: (q: string, page = 1) => request<any>(`/api/products/search?q=${encodeURIComponent(q)}&page=${page}`),
  getProduct: (id: string) => request<any>(`/api/products/${id}`),
  getShippingOptions: () => request<any[]>('/api/shipping-options'),
  getPaymentOptions: () => request<any[]>('/api/payment-options'),
  getWhatsAppConfig: () => request<{ phoneNumber: string }>('/api/config/whatsapp'),
  getCategories: () => request<any[]>('/api/categories'),

  // Auth
  login: (username: string, password: string) =>
    request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Admin Products
  getAdminProducts: () => request<any[]>('/api/admin/products'),
  getAdminProduct: (id: string) => request<any>(`/api/admin/products/${id}`),
  createProduct: (data: any) =>
    request<any>('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) =>
    request<any>(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    request<any>(`/api/admin/products/${id}`, { method: 'DELETE' }),

  // Admin Images (special handling for FormData)
  uploadImages: async (productId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    const token = getToken();
    const res = await fetch(`${API_URL}/api/admin/products/${productId}/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
    return res.json();
  },
  deleteImage: (productId: string, imageId: string) =>
    request<any>(`/api/admin/products/${productId}/images/${imageId}`, { method: 'DELETE' }),

  // Admin Colors
  addColor: (productId: string, name: string) =>
    request<any>(`/api/admin/products/${productId}/colors`, { method: 'POST', body: JSON.stringify({ name }) }),
  removeColor: (productId: string, colorId: string) =>
    request<any>(`/api/admin/products/${productId}/colors/${colorId}`, { method: 'DELETE' }),

  // Admin Promotions
  createPromotion: (productId: string, data: any) =>
    request<any>(`/api/admin/promotions/${productId}`, { method: 'POST', body: JSON.stringify(data) }),
  cancelPromotion: (promotionId: string) =>
    request<any>(`/api/admin/promotions/${promotionId}`, { method: 'DELETE' }),

  // Admin Config
  getAdminShipping: () => request<any[]>('/api/admin/shipping-options'),
  createShipping: (data: any) => request<any>('/api/admin/shipping-options', { method: 'POST', body: JSON.stringify(data) }),
  updateShipping: (id: string, data: any) => request<any>(`/api/admin/shipping-options/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteShipping: (id: string) => request<any>(`/api/admin/shipping-options/${id}`, { method: 'DELETE' }),

  getAdminPayment: () => request<any[]>('/api/admin/payment-options'),
  createPayment: (data: any) => request<any>('/api/admin/payment-options', { method: 'POST', body: JSON.stringify(data) }),
  updatePayment: (id: string, data: any) => request<any>(`/api/admin/payment-options/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePayment: (id: string) => request<any>(`/api/admin/payment-options/${id}`, { method: 'DELETE' }),

  getAdminWhatsApp: () => request<{ phoneNumber: string }>('/api/admin/config/whatsapp'),
  updateWhatsApp: (phoneNumber: string) =>
    request<any>('/api/admin/config/whatsapp', { method: 'PUT', body: JSON.stringify({ phoneNumber }) }),

  // Admin Categories
  getAdminCategories: () => request<any[]>('/api/admin/categories'),
  createCategory: (name: string) => request<any>('/api/admin/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  deleteCategory: (id: string) => request<any>(`/api/admin/categories/${id}`, { method: 'DELETE' }),

  // Admin Sales
  getAdminSales: (month?: string) => request<any[]>(`/api/admin/sales${month ? `?month=${month}` : ''}`),
  getSalesStats: () => request<any>('/api/admin/sales/stats'),
  createSale: (data: any) => request<any>('/api/admin/sales', { method: 'POST', body: JSON.stringify(data) }),
  deleteSale: (id: string) => request<any>(`/api/admin/sales/${id}`, { method: 'DELETE' }),

  // Admin Finances
  getFinances: (month?: string) => request<any[]>(`/api/admin/finances${month ? `?month=${month}` : ''}`),
  getFinanceSummary: (month?: string) => request<any>(`/api/admin/finances/summary${month ? `?month=${month}` : ''}`),
  createFinance: (data: any) => request<any>('/api/admin/finances', { method: 'POST', body: JSON.stringify(data) }),
  deleteFinance: (id: string) => request<any>(`/api/admin/finances/${id}`, { method: 'DELETE' }),
};
