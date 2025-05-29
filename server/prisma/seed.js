const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fruteria.com' },
    update: {},
    create: {
      email: 'admin@fruteria.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario administrador creado:', admin.email);

  // Crear categorías
  const categories = [
    { name: 'Frutas', description: 'Frutas frescas y de temporada' },
    { name: 'Verduras', description: 'Verduras y hortalizas' },
    { name: 'Lácteos', description: 'Productos lácteos' },
    { name: 'Carnes', description: 'Carnes y embutidos' },
    { name: 'Bebidas', description: 'Bebidas y refrescos' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categorías creadas');

  // Crear proveedores
  const suppliers = [
    {
      name: 'Frutas del Valle',
      email: 'contacto@frutasdelvalle.com',
      phone: '+1234567890',
      address: 'Av. Principal 123',
      taxId: '12345678901',
    },
    {
      name: 'Verduras Frescas SA',
      email: 'ventas@verdurasfrescas.com',
      phone: '+1234567891',
      address: 'Calle Comercio 456',
      taxId: '12345678902',
    },
    {
      name: 'Lácteos La Granja',
      email: 'info@lacteoslagranja.com',
      phone: '+1234567892',
      address: 'Zona Industrial 789',
      taxId: '12345678903',
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supplier.name },
      update: {},
      create: supplier,
    });
  }

  console.log('✅ Proveedores creados');

  // Obtener categorías y proveedores creados
  const frutasCategory = await prisma.category.findUnique({ where: { name: 'Frutas' } });
  const verdurasCategory = await prisma.category.findUnique({ where: { name: 'Verduras' } });
  const lacteosCategory = await prisma.category.findUnique({ where: { name: 'Lácteos' } });

  const frutasSupplier = await prisma.supplier.findUnique({ where: { name: 'Frutas del Valle' } });
  const verdurasSupplier = await prisma.supplier.findUnique({ where: { name: 'Verduras Frescas SA' } });
  const lacteosSupplier = await prisma.supplier.findUnique({ where: { name: 'Lácteos La Granja' } });

  // Crear productos de ejemplo
  const products = [
    {
      name: 'Manzana Roja',
      description: 'Manzanas rojas frescas',
      barcode: '7501234567890',
      unit: 'kg',
      costPrice: 2.50,
      salePrice: 4.00,
      stock: 50,
      minStock: 10,
      categoryId: frutasCategory.id,
      supplierId: frutasSupplier.id,
    },
    {
      name: 'Plátano',
      description: 'Plátanos maduros',
      barcode: '7501234567891',
      unit: 'kg',
      costPrice: 1.80,
      salePrice: 3.00,
      stock: 30,
      minStock: 5,
      categoryId: frutasCategory.id,
      supplierId: frutasSupplier.id,
    },
    {
      name: 'Tomate',
      description: 'Tomates frescos',
      barcode: '7501234567892',
      unit: 'kg',
      costPrice: 3.00,
      salePrice: 5.00,
      stock: 25,
      minStock: 8,
      categoryId: verdurasCategory.id,
      supplierId: verdurasSupplier.id,
    },
    {
      name: 'Lechuga',
      description: 'Lechuga fresca',
      barcode: '7501234567893',
      unit: 'unidad',
      costPrice: 1.50,
      salePrice: 2.50,
      stock: 20,
      minStock: 5,
      categoryId: verdurasCategory.id,
      supplierId: verdurasSupplier.id,
    },
    {
      name: 'Leche Entera',
      description: 'Leche entera 1L',
      barcode: '7501234567894',
      unit: 'litro',
      costPrice: 1.20,
      salePrice: 2.00,
      stock: 40,
      minStock: 10,
      categoryId: lacteosCategory.id,
      supplierId: lacteosSupplier.id,
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { barcode: product.barcode },
      update: {},
      create: product,
    });

    // Crear movimiento de inventario inicial
    await prisma.inventoryMovement.create({
      data: {
        productId: createdProduct.id,
        type: 'IN',
        quantity: product.stock,
        previousStock: 0,
        newStock: product.stock,
        reason: 'Stock inicial',
      },
    });
  }

  console.log('✅ Productos creados');

  // Crear clientes de ejemplo
  const clients = [
    {
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+1234567890',
      address: 'Calle 123, Ciudad',
      taxId: '12345678',
    },
    {
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+1234567891',
      address: 'Avenida 456, Ciudad',
      taxId: '87654321',
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: client,
    });
  }

  console.log('✅ Clientes creados');

  // Crear configuraciones iniciales
  const settings = [
    { key: 'business_name', value: 'Frutería El Paraíso' },
    { key: 'business_address', value: 'Av. Principal 123, Ciudad' },
    { key: 'business_phone', value: '+1234567890' },
    { key: 'business_email', value: 'info@fruteriaparaiso.com' },
    { key: 'tax_rate', value: '0.16' },
    { key: 'currency', value: 'USD' },
    { key: 'low_stock_threshold', value: '10' },
    { key: 'expiry_warning_days', value: '7' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Configuraciones creadas');

  // Crear notificaciones de ejemplo
  const notifications = [
    {
      title: 'Bienvenido al Sistema',
      message: 'El sistema ha sido configurado correctamente',
      type: 'SUCCESS',
    },
    {
      title: 'Stock Bajo',
      message: 'Algunos productos tienen stock bajo',
      type: 'WARNING',
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification,
    });
  }

  console.log('✅ Notificaciones creadas');

  console.log('🎉 Seed completado exitosamente!');
  console.log('📧 Email: admin@fruteria.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });