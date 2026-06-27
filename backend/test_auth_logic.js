import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'admin@lic.com' } });
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('User found:', user);
    
    console.log('Comparing passwords...');
    const validPassword = await bcrypt.compare('admin123', user.password);
    console.log('Valid password:', validPassword);
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
