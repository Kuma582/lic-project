import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting Admin User...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lic.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin'
    },
    create: {
      name: 'Super Admin',
      email: 'admin@lic.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin user forcefully updated! Email:', admin.email, 'Role:', admin.role);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
