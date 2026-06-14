import prisma from '../lib/prisma';

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isManuallyUnavailable?: boolean;
}

export function validateProductData(data: CreateProductData): string | null {
  if (!data.name || data.name.trim().length === 0) return 'El nombre es obligatorio';
  if (data.name.length > 100) return 'El nombre no puede exceder 100 caracteres';
  if (!data.description || data.description.trim().length === 0) return 'La descripción es obligatoria';
  if (data.description.length > 500) return 'La descripción no puede exceder 500 caracteres';
  if (data.price === undefined || data.price <= 0) return 'El precio debe ser un valor numérico mayor a cero';
  if (data.price > 999999.99) return 'El precio no puede exceder $999.999,99';
  if (data.stock !== undefined && (data.stock < 0 || !Number.isInteger(data.stock))) {
    return 'El stock debe ser un número entero mayor o igual a cero';
  }
  if (data.stock !== undefined && data.stock > 99999) return 'El stock no puede exceder 99.999 unidades';
  return null;
}

export async function createProduct(data: CreateProductData) {
  return prisma.product.create({
    data: {
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price,
      stock: data.stock || 0,
    },
    include: { images: true, colors: true, promotions: true },
  });
}

export async function updateProduct(id: string, data: UpdateProductData) {
  return prisma.product.update({
    where: { id },
    data,
    include: { images: true, colors: true, promotions: true },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: true, colors: true, promotions: { where: { isActive: true } } },
  });
}

export async function getAvailableProducts(page: number = 1, pageSize: number = 20, categoryId?: string, sort?: string) {
  const now = new Date();
  const skip = (page - 1) * pageSize;

  const where: any = {
    price: { gt: 0 },
    images: { some: {} },
    isManuallyUnavailable: false,
    stock: { gt: 0 },
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Determine sort order
  let orderBy: any = { name: 'asc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'name_asc') orderBy = { name: 'asc' };
  else if (sort === 'name_desc') orderBy = { name: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        colors: true,
        category: true,
        promotions: {
          where: { isActive: true, startDate: { lte: now }, endDate: { gt: now } },
        },
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map(formatProductPublic),
    pagination: {
      page,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function searchProducts(query: string, page: number = 1, pageSize: number = 20) {
  const now = new Date();
  const skip = (page - 1) * pageSize;

  const where = {
    price: { gt: 0 },
    images: { some: {} },
    isManuallyUnavailable: false,
    stock: { gt: 0 },
    OR: [
      { name: { contains: query } },
      { description: { contains: query } },
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        colors: true,
        promotions: {
          where: { isActive: true, startDate: { lte: now }, endDate: { gt: now } },
        },
      },
      orderBy: { name: 'asc' },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map(formatProductPublic),
    pagination: { page, pageSize, totalItems: total, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function getAllProductsAdmin() {
  return prisma.product.findMany({
    include: { images: true, colors: true, promotions: true },
    orderBy: { createdAt: 'desc' },
  });
}

function formatProductPublic(product: any) {
  const activePromotion = product.promotions?.[0] || null;
  const discountedPrice = activePromotion
    ? Math.round(product.price * (1 - activePromotion.discountPercentage / 100))
    : null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountedPrice,
    stock: product.stock,
    isAvailable: product.stock > 0 && !product.isManuallyUnavailable,
    images: product.images,
    colors: product.colors,
    promotion: activePromotion
      ? {
          id: activePromotion.id,
          discountPercentage: activePromotion.discountPercentage,
          startDate: activePromotion.startDate,
          endDate: activePromotion.endDate,
        }
      : null,
  };
}
