import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const categoryPublicRoutes = Router();

categoryPublicRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
