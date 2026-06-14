import { Router, Request, Response } from 'express';
import { getAvailableProducts, searchProducts, getProductById } from '../services/product.service';

export const productPublicRoutes = Router();

productPublicRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const result = await getAvailableProducts(page, Math.min(pageSize, 50));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

productPublicRoutes.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string || '').trim();
    if (query.length < 2) {
      res.status(400).json({ error: 'El término de búsqueda debe tener al menos 2 caracteres' });
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const result = await searchProducts(query, page);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

productPublicRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id as string);
    if (!product) {
      res.status(404).json({ error: 'Artículo no encontrado' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
