const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing Prisma connection...');
    const users = await prisma.user.findMany();
    console.log('✅ Prisma works! Found', users.length, 'users');
    console.log('Users:', users.map(u => ({ email: u.email, name: u.name })));
  } catch (error) {
    console.error('❌ Prisma error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
