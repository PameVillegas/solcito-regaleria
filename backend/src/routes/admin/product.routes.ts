import { Router, Response } from 'express';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductById,
  validateProductData,
} from '../../services/product.service';
import { uploadImage, deleteImage } from '../../services/image.service';
import { addColor, removeColor } from '../../services/color.service';

export const adminProductRoutes = Router();
adminProductRoutes.use(authMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes JPG, PNG o WebP'));
  },
});

// List all products (admin view)
adminProductRoutes.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const products = await getAllProductsAdmin();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get single product
adminProductRoutes.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const product = await getProductById(req.params.id as string);
    if (!product) { res.status(404).json({ error: 'Artículo no encontrado' }); return; }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Create product
adminProductRoutes.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validationError = validateProductData(req.body);
    if (validationError) { res.status(400).json({ error: validationError }); return; }
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update product
adminProductRoutes.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const product = await updateProduct(req.params.id as string, req.body);
    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Artículo no encontrado' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete product
adminProductRoutes.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await deleteProduct(req.params.id as string);
    res.json({ message: 'Artículo eliminado' });
  } catch (error: any) {
    if (error.code === 'P2025') { res.status(404).json({ error: 'Artículo no encontrado' }); return; }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Upload images
adminProductRoutes.post('/:id/images', upload.array('images', 10), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) { res.status(400).json({ error: 'Debe subir al menos una imagen' }); return; }
    const results: any[] = [];
    for (const file of files) {
      const image = await uploadImage(req.params.id as string, file);
      results.push(image);
    }
    res.status(201).json(results);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al subir imagen' });
  }
});

// Delete image
adminProductRoutes.delete('/:id/images/:imageId', async (req: AuthRequest, res: Response) => {
  try {
    await deleteImage(req.params.imageId as string);
    res.json({ message: 'Imagen eliminada' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al eliminar imagen' });
  }
});

// Add color
adminProductRoutes.post('/:id/colors', async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) { res.status(400).json({ error: 'El nombre del color es obligatorio' }); return; }
    const color = await addColor(req.params.id as string, name);
    res.status(201).json(color);
  } catch (error: any) {
    res.status(409).json({ error: error.message || 'Error al agregar color' });
  }
});

// Remove color
adminProductRoutes.delete('/:id/colors/:colorId', async (req: AuthRequest, res: Response) => {
  try {
    await removeColor(req.params.colorId as string);
    res.json({ message: 'Color eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
