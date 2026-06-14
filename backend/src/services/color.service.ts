import prisma from '../lib/prisma';

const MAX_COLORS_PER_PRODUCT = 20;

export async function addColor(productId: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error('El nombre del color es obligatorio');
  if (trimmedName.length > 50) throw new Error('El nombre del color no puede exceder 50 caracteres');

  // Check limit
  const colorCount = await prisma.productColor.count({ where: { productId } });
  if (colorCount >= MAX_COLORS_PER_PRODUCT) {
    throw new Error(`Se alcanzó el máximo de ${MAX_COLORS_PER_PRODUCT} colores`);
  }

  // Check uniqueness (handled by DB constraint too)
  const existing = await prisma.productColor.findUnique({
    where: { productId_name: { productId, name: trimmedName } },
  });
  if (existing) throw new Error('El color ya está asignado a este artículo');

  return prisma.productColor.create({
    data: { productId, name: trimmedName },
  });
}

export async function removeColor(colorId: string) {
  return prisma.productColor.delete({ where: { id: colorId } });
}

export async function getColors(productId: string) {
  return prisma.productColor.findMany({ where: { productId }, orderBy: { name: 'asc' } });
}
