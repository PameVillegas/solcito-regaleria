import prisma from '../lib/prisma';

export interface CreatePromotionData {
  productId: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export function validatePromotionData(data: CreatePromotionData): string | null {
  if (data.discountPercentage < 1 || data.discountPercentage > 99) {
    return 'El porcentaje de descuento debe estar entre 1% y 99%';
  }
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Las fechas no son válidas';
  }
  if (end <= start) {
    return 'La fecha de fin debe ser posterior a la fecha de inicio';
  }
  return null;
}

export async function createPromotion(data: CreatePromotionData) {
  // Check if product already has an active promotion
  const now = new Date();
  const existing = await prisma.promotion.findFirst({
    where: {
      productId: data.productId,
      isActive: true,
      endDate: { gt: now },
    },
  });

  if (existing) {
    throw new Error('El artículo ya posee una promoción vigente');
  }

  return prisma.promotion.create({
    data: {
      productId: data.productId,
      discountPercentage: data.discountPercentage,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: true,
    },
  });
}

export async function cancelPromotion(promotionId: string) {
  return prisma.promotion.update({
    where: { id: promotionId },
    data: { isActive: false },
  });
}

export async function getActivePromotion(productId: string) {
  const now = new Date();
  return prisma.promotion.findFirst({
    where: {
      productId,
      isActive: true,
      startDate: { lte: now },
      endDate: { gt: now },
    },
  });
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return Math.round(price * (1 - discountPercentage / 100));
}
