const { PrismaClient } = require("../../server/src/prisma/client");
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";
import { addVipInfo } from "./addVipInfo.js";

async function updateActiveProfileIDs() {
  const profiles = await prisma.profile.findMany();
  const users = await prisma.user.findMany();
  for await (var user of users) {
    const activeProfile = profiles.find((profile) => profile.ownerId === user.id);
    if (activeProfile) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          activeProfileId: activeProfile.id,
          // userId: user.id,
          // ownerId: user.id,
        },
      });
    }

    if (user.avatar == null) {
      const avanum = faker.datatype.number({ min: 1, max: 30 });

      await prisma.user.update({
        where: { id: user.id },
        data: { avatar: `avatar-${avanum}.webp` },
      });
    }
  }
}

export async function seedUsers(count) {
  // Create a shop

  // await prisma.user.deleteMany();
  // await prisma.profile.deleteMany();
  // Create 10 users and their profiles
  for (let i = 0; i < count; i++) {
    console.log("creating user ", i);
    const id = faker.string.uuid();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const avanum = faker.datatype.number({ min: 1, max: 30 });
    const user = {
      id,
      username: faker.internet.userName(firstname, lastname),
      email: faker.internet.email(firstname, lastname),
      passwordHash: faker.internet.password(),
      // vipRank: {
      //   color: "RED",
      //   image: "lorem",
      //   title: "VIP I",
      //   rankLevel: 1,
      //   description: "lorem ipsum",
      //   avatar: `avatar-${avanum}.webp`,
      // },
      // profiles: {
      //   create: {
      //     shop: { connect: { id: "house" } },
      //     balance: parseInt(faker.random.numeric()) * 100,
      //     //   vipPoints: faker.random.numeric(),
      //     countBalance: parseInt(faker.random.numeric()) * 100,
      //     currency: "USD",
      //     isExcluded: false, //faker.random.boolean(),
      //     isActive: false, //faker.random.boolean(),
      //     faceVerificationTime: faker.date.past().toISOString(),
      //     //   address: faker.random.numeric(),
      //     totalCashOut: parseInt(faker.random.numeric()) * 100,
      //     totalSpins: parseInt(faker.random.numeric()) * 100,
      //     totalCashIn: parseInt(faker.random.numeric()) * 100,
      //     totalWon: parseInt(faker.random.numeric()) * 100,
      //     totalBet: parseInt(faker.random.numeric()) * 100,
      //     totalBonusWon: parseInt(faker.random.numeric()) * 100,
      //     rtp: parseInt(faker.random.numeric()) * 100,
      //     profileType: "PLAYER", // faker.random.arrayElement(["PLAYER", "ADMIN"]),
      //     //   limits: JSON.stringify({
      //     //     // Assuming limits is a JSON field
      //     //     dailyLimit: faker.random.numeric(),
      //     //     weeklyLimit: faker.random.numeric(),
      //     //     monthlyLimit: faker.random.numeric(),
      //     //   }),
      //     //   xp: faker.random.numeric(),
      //     stats: JSON.stringify({
      //       // Assuming stats is a JSON field
      //       totalGamesPlayed: faker.random.numeric(),
      //       totalWins: faker.random.numeric(),
      //       totalLosses: faker.random.numeric(),
      //     }),
      //     rakeback: JSON.stringify({
      //       // Assuming rakeback is a JSON field
      //       totalRakeback: faker.random.numeric(),
      //       averageRakeback: faker.random.numeric(),
      //     }),
      //     mute: false, //faker.random.boolean(),
      //     ban: false, // faker.random.boolean(),
      //     verifiedAt: faker.date.past().toISOString(),
      //     //   userId: faker.datatype.uuid(),
      //     cashtag: faker.random.word(),
      //     email: faker.internet.email(),
      //     //   shopId: 'house',
      //     ownerId: id,
      //     activeUserId: id,
      //     // Add other profile fields as needed
      //   },
      // },
      activeProfile: {
        create: {
          operator: { connect: { id: "house" } },
          balance: parseInt(faker.random.numeric()) * 100,
          //   vipPoints: faker.random.numeric(),
          // countBalance: parseInt(faker.random.numeric()) * 100,
          currency: "USD",
          // isExcluded: false, //faker.random.boolean(),
          isActive: false, //faker.random.boolean(),
          // faceVerificationTime: faker.date.past().toISOString(),
          //   address: faker.random.numeric(),
          // totalCashOut: parseInt(faker.random.numeric()) * 100,
          // totalSpins: parseInt(faker.random.numeric()) * 100,
          // totalCashIn: parseInt(faker.random.numeric()) * 100,
          // totalWon: parseInt(faker.random.numeric()) * 100,
          // totalBet: parseInt(faker.random.numeric()) * 100,
          // totalBonusWon: parseInt(faker.random.numeric()) * 100,
          // rtp: parseInt(faker.random.numeric()) * 100,
          // profileType: "PLAYER", // faker.random.arrayElement(["PLAYER", "ADMIN"]),
          //   limits: JSON.stringify({
          //     // Assuming limits is a JSON field
          //     dailyLimit: faker.random.numeric(),
          //     weeklyLimit: faker.random.numeric(),
          //     monthlyLimit: faker.random.numeric(),
          //   }),
          //   xp: faker.random.numeric(),
          xpEarned: 0,
          // stats: JSON.stringify({
          //   // Assuming stats is a JSON field
          //   totalGamesPlayed: faker.random.numeric(),
          //   totalWins: faker.random.numeric(),
          //   totalLosses: faker.random.numeric(),
          // }),
          // rakeback: JSON.stringify({
          //   // Assuming rakeback is a JSON field
          //   totalRakeback: faker.random.numeric(),
          //   averageRakeback: faker.random.numeric(),
          // }),

          // mute: false, //faker.random.boolean(),
          // ban: false, // faker.random.boolean(),
          // verifiedAt: faker.date.past().toISOString(),
          //   userId: faker.datatype.uuid(),
          // cashtag: faker.random.word(),
          // email: faker.internet.email(),
          //   shopId: 'house',
          // userId: id,
          // activeUserId: id,
          // Add other profile fields as needed
        },
      },
    };

    await prisma.user.create({
      data: user,
    });

    console.log("Database seeded successfully");
  }
  await updateActiveProfileIDs();
  // await addVipInfo();
}

// export default seedUsers(5)
//   .catch((error) => {
//     console.error(error);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
// // await updateActiveProfileIDs();
