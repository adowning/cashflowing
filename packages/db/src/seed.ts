import { PrismaClient } from '../prisma/client'
import { seed } from '../scripts/seed.js'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // // Example: Create a default operator if it doesn't exist
  // const operator = await prisma.operator.upsert({
  //   where: { slug: 'default-operator' },
  //   update: {},
  //   create: {
  //     name: 'Default Operator',
  //     slug: 'default-operator',
  //     owner: {
  //       connectOrCreate: {
  //         where: { email: 'admin@example.com' },
  //         create: {
  //           email: 'admin@example.com',
  //           username: 'admin',
  //           role: 'ADMIN',
  //           // passwordHash: await Bun.password.hash('password123') // If using Bun.password
  //         },
  //       },
  //     },
  //   },
  // });
  // console.log({ operator });

  // Example: Create some game categories
  // const gameCategories = ['SLOTS', 'TABLE', 'FISH', 'POKER', 'OTHER']; // GameCategory enum is used in schema
  // for (const category of gameCategories) {
  //   // This part needs adjustment if GameCategory is an enum and not a separate model
  //   // For now, assuming GameCategory is an enum on the Game model directly.
  //   // If GameCategory were a separate model, you'd seed it like this:
  //   // await prisma.gameCategory.upsert({
  //   //     where: { name: category },
  //   //     update: {},
  //   //     create: { name: category }
  //   // });
  // }
  // console.log('Seeded game categories (if GameCategory is a model)');
  await seed()
  seed

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
