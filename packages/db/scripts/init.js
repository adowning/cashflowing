const { PrismaClient } = require("../../server/src/prisma/client");
const prisma = new PrismaClient();
import { seedUsers } from "./loadusers.js";
import { loadGames } from "./loadgames.js";
import { seedProducts } from "./seedProducts.js";
async function main() {
  console.log("starting ...");
  await prisma.$executeRaw`TRUNCATE TABLE "user" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Operator" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Profile" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "operatorgame" CASCADE;`;
  //   await prisma.$executeRaw`TRUNCATE TABLE "Transaction" CASCADE;`;
  // await prisma.$executeRaw`TRUNCATE TABLE "product" CASCADE;`;
  //   await prisma.$executeRaw`TRUNCATE TABLE "JackpotGroup" CASCADE;`;
  //   await prisma.$executeRaw`TRUNCATE TABLE "SpinData" CASCADE;`;
  await prisma.operator.create({
    data: {
      id: "house",
      slug: "house",
      name: "house",
      owner: {
        create: {
          username: "system",
          email: "system",
        },
      },

      // Add other shop fields as needed
    },
  });
  // await seedProducts();
  await seedUsers(5);
  await loadGames();
}

await main();
