import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../lib/prisma';

export const adminConfigRoutes = Router();
adminConfigRoutes.use(authMiddleware);

adminConfigRoutes.get('/whatsapp', async (_req: AuthRequest, res: Response) => {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'whatsapp_number' } });
    res.json({ phoneNumber: config?.value || '' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

adminConfigRoutes.put('/whatsapp', async (req: AuthRequest, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) { res.status(400).json({ error: 'El número de WhatsApp es obligatorio' }); return; }

    // Validate: 10-15 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      res.status(400).json({ error: 'El número debe contener entre 10 y 15 dígitos con código de país' });
      return;
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'whatsapp_number' },
      update: { value: digitsOnly },
      create: { key: 'whatsapp_number', value: digitsOnly },
    });
    res.json({ phoneNumber: config.value });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
