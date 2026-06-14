import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user if not exists
  const existingAdmin = await prisma.adminUser.findUnique({ where: { username: 'admin' } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.create({
      data: { username: 'admin', passwordHash },
    });
    console.log('✅ Admin user created (username: admin, password: admin123)');
  } else {
    console.log('✅ Admin user already exists');
  }

  // Create default shipping options
  const shippingCount = await prisma.shippingOption.count();
  if (shippingCount === 0) {
    await prisma.shippingOption.create({ data: { name: 'Retiro en local', description: 'Retirá tu pedido en nuestro local' } });
    await prisma.shippingOption.create({ data: { name: 'Envío a domicilio', description: 'Te lo enviamos a tu dirección' } });
    console.log('✅ Shipping options created');
  }

  // Create default payment options
  const paymentCount = await prisma.paymentOption.count();
  if (paymentCount === 0) {
    await prisma.paymentOption.create({ data: { name: 'Efectivo', description: 'Pago en efectivo al retirar o recibir' } });
    await prisma.paymentOption.create({ data: { name: 'Transferencia', description: 'Transferencia bancaria o Mercado Pago' } });
    console.log('✅ Payment options created');
  }

  // Create default categories
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    const defaultCategories = [
      'Labiales',
      'Gloss y Bálsamos',
      'Esponjas',
      'Bases',
      'Mascarillas',
    ];
    for (const name of defaultCategories) {
      await prisma.category.create({ data: { name } });
    }
    console.log('✅ Categories created');
  } else {
    console.log('✅ Categories already exist');
  }

  // Set default WhatsApp number
  const whatsappConfig = await prisma.systemConfig.findUnique({ where: { key: 'whatsapp_number' } });
  if (!whatsappConfig) {
    await prisma.systemConfig.create({ data: { key: 'whatsapp_number', value: '' } });
  }
  console.log('✅ System config initialized');
  console.log('\n🌻 Seed completed! SOLCITO REGALERIA is ready.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
