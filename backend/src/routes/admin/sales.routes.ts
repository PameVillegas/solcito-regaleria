import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../lib/prisma';

export const adminSalesRoutes = Router();
adminSalesRoutes.use(authMiddleware);

// Get all sales with filters
adminSalesRoutes.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const month = req.query.month as string;
    const where: any = {};
    if (month) {
      const start = new Date(month + '-01');
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      where.createdAt = { gte: start, lt: end };
    }
    const sales = await prisma.sale.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get sales stats
adminSalesRoutes.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalSales, monthlySales, dailySales, allItems] = await Promise.all([
      prisma.sale.aggregate({ _sum: { total: true }, _count: true }),
      prisma.sale.aggregate({ _sum: { total: true }, _count: true, where: { createdAt: { gte: startOfMonth } } }),
      prisma.sale.aggregate({ _sum: { total: true }, _count: true, where: { createdAt: { gte: startOfDay } } }),
      prisma.saleItem.groupBy({
        by: ['productName'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
    ]);

    res.json({
      total: { sales: totalSales._count, revenue: totalSales._sum.total || 0 },
      monthly: { sales: monthlySales._count, revenue: monthlySales._sum.total || 0 },
      daily: { sales: dailySales._count, revenue: dailySales._sum.total || 0 },
      topProducts: allItems.map(i => ({ name: i.productName, quantity: i._sum.quantity })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Create a sale
adminSalesRoutes.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, total, paymentMethod, notes, items } = req.body;
    if (!items || items.length === 0) { res.status(400).json({ error: 'Debe incluir al menos un artículo' }); return; }
    if (!paymentMethod) { res.status(400).json({ error: 'El método de pago es obligatorio' }); return; }

    const sale = await prisma.sale.create({
      data: {
        customerName: customerName || '',
        total: total || items.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0),
        paymentMethod,
        notes: notes || '',
        items: {
          create: items.map((i: any) => ({
            productName: i.productName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            color: i.color || '',
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete a sale
adminSalesRoutes.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.sale.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Venta eliminada' });
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Venta no encontrada' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
