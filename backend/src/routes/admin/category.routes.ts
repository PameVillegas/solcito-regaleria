import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../lib/prisma';

export const adminCategoryRoutes = Router();
adminCategoryRoutes.use(authMiddleware);

adminCategoryRoutes.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminCategoryRoutes.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) { res.status(400).json({ error: 'El nombre es obligatorio' }); return; }
    if (name.length > 50) { res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres' }); return; }
    const category = await prisma.category.create({ data: { name: name.trim() } });
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 'P2002') { res.status(409).json({ error: 'La categoría ya existe' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminCategoryRoutes.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(category);
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Categoría no encontrada' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminCategoryRoutes.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Categoría eliminada' });
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Categoría no encontrada' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
