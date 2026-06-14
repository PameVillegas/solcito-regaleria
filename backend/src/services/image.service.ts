import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_IMAGES_PER_PRODUCT = 10;

export async function uploadImage(productId: string, file: Express.Multer.File) {
  // Check current image count
  const imageCount = await prisma.productImage.count({ where: { productId } });
  if (imageCount >= MAX_IMAGES_PER_PRODUCT) {
    throw new Error(`Se alcanzó el máximo de ${MAX_IMAGES_PER_PRODUCT} imágenes`);
  }

  // Upload to Cloudinary
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'solcito-regaleria',
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'webp' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

  // Save to database
  return prisma.productImage.create({
    data: {
      productId,
      url: result.secure_url,
      publicId: result.public_id,
      sortOrder: imageCount,
    },
  });
}

export async function deleteImage(imageId: string) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) throw new Error('Imagen no encontrada');

  // Delete from Cloudinary if has publicId
  if (image.publicId) {
    await cloudinary.uploader.destroy(image.publicId).catch(() => {});
  }

  return prisma.productImage.delete({ where: { id: imageId } });
}

export async function getImageCount(productId: string) {
  return prisma.productImage.count({ where: { productId } });
}
