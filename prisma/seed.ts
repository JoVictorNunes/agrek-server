import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';
const prisma = new PrismaClient();
async function main() {
  const hash = createHash('sha256');
  hash.update('adminadmin');
  const hashedPassword = hash.digest('hex');
  await prisma.user.create({
    data: {
      email: 'admin@agrek.com',
      password: hashedPassword,
      name: 'admin',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
