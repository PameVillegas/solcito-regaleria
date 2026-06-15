import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { authRoutes } from './routes/auth.routes';
import { productPublicRoutes } from './routes/product.routes';
import { adminProductRoutes } from './routes/admin/product.routes';
import { adminPromotionRoutes } from './routes/admin/promotion.routes';
import { shippingPublicRoutes } from './routes/shipping.routes';
import { adminShippingRoutes } from './routes/admin/shipping.routes';
import { paymentPublicRoutes } from './routes/payment.routes';
import { adminPaymentRoutes } from './routes/admin/payment.routes';
import { configPublicRoutes } from './routes/config.routes';
import { adminConfigRoutes } from './routes/admin/config.routes';
import { categoryPublicRoutes } from './routes/category.routes';
import { adminCategoryRoutes } from './routes/admin/category.routes';
import { adminSalesRoutes } from './routes/admin/sales.routes';
import { adminFinancesRoutes } from './routes/admin/finances.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/products', productPublicRoutes);
app.use('/api/categories', categoryPublicRoutes);
app.use('/api/shipping-options', shippingPublicRoutes);
app.use('/api/payment-options', paymentPublicRoutes);
app.use('/api/config', configPublicRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes (protected)
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/promotions', adminPromotionRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/shipping-options', adminShippingRoutes);
app.use('/api/admin/payment-options', adminPaymentRoutes);
app.use('/api/admin/config', adminConfigRoutes);
app.use('/api/admin/sales', adminSalesRoutes);
app.use('/api/admin/finances', adminFinancesRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🌻 Solcito Regalería API running on port ${PORT}`);
});

export default app;
