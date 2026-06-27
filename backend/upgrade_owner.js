import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Upgrading owner to SUPER_ADMIN...');
  
  const admin = await prisma.user.update({
    where: { email: 'admin@lic.com' },
    data: { role: 'SUPER_ADMIN' }
  });

  console.log('Owner upgraded successfully! Email:', admin.email, 'Role:', admin.role);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
