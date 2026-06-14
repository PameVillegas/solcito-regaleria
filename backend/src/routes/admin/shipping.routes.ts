import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../lib/prisma';

export const adminShippingRoutes = Router();
adminShippingRoutes.use(authMiddleware);

adminShippingRoutes.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const options = await prisma.shippingOption.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminShippingRoutes.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) { res.status(400).json({ error: 'Nombre y descripción son obligatorios' }); return; }
    if (name.length > 50) { res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres' }); return; }
    if (description.length > 200) { res.status(400).json({ error: 'La descripción no puede exceder 200 caracteres' }); return; }
    const option = await prisma.shippingOption.create({ data: { name, description } });
    res.status(201).json(option);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminShippingRoutes.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const option = await prisma.shippingOption.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(option);
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Opción no encontrada' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminShippingRoutes.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.shippingOption.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Opción de envío eliminada' });
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Opción no encontrada' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
