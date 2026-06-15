import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../lib/prisma';

export const adminFinancesRoutes = Router();
adminFinancesRoutes.use(authMiddleware);

// Get all finance entries
adminFinancesRoutes.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const month = req.query.month as string;
    const where: any = {};
    if (month) {
      const start = new Date(month + '-01');
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      where.date = { gte: start, lt: end };
    }
    const entries = await prisma.finance.findMany({ where, orderBy: { date: 'desc' } });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get finance summary
adminFinancesRoutes.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const month = req.query.month as string;
    const where: any = {};
    if (month) {
      const start = new Date(month + '-01');
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      where.date = { gte: start, lt: end };
    }

    const [income, expenses] = await Promise.all([
      prisma.finance.aggregate({ _sum: { amount: true }, where: { ...where, type: 'ingreso' } }),
      prisma.finance.aggregate({ _sum: { amount: true }, where: { ...where, type: 'gasto' } }),
    ]);

    res.json({
      income: income._sum.amount || 0,
      expenses: expenses._sum.amount || 0,
      profit: (income._sum.amount || 0) - (expenses._sum.amount || 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Create finance entry
adminFinancesRoutes.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { type, description, amount, date } = req.body;
    if (!type || !description || !amount) { res.status(400).json({ error: 'Tipo, descripción y monto son obligatorios' }); return; }
    if (!['ingreso', 'gasto'].includes(type)) { res.status(400).json({ error: 'Tipo debe ser "ingreso" o "gasto"' }); return; }

    const entry = await prisma.finance.create({
      data: { type, description, amount: parseFloat(amount), date: date ? new Date(date) : new Date() },
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete finance entry
adminFinancesRoutes.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.finance.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Registro eliminado' });
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Registro no encontrado' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
