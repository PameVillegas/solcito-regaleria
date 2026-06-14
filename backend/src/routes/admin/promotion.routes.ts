import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import { createPromotion, cancelPromotion, validatePromotionData } from '../../services/promotion.service';

export const adminPromotionRoutes = Router();
adminPromotionRoutes.use(authMiddleware);

// Create promotion for a product
adminPromotionRoutes.post('/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, productId: req.params.productId as string };
    const validationError = validatePromotionData(data);
    if (validationError) { res.status(400).json({ error: validationError }); return; }
    const promotion = await createPromotion(data);
    res.status(201).json(promotion);
  } catch (error: any) {
    res.status(409).json({ error: error.message || 'Error al crear promoción' });
  }
});

// Cancel promotion
adminPromotionRoutes.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const promotion = await cancelPromotion(req.params.id as string);
    res.json(promotion);
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Promoción no encontrada' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
