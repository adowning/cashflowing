import prisma, {
  User,
  Operator,
  Achievement,
  Profile,
  Game,
  Organization,
  Tournament,
  GameSession,
  ChatRoom,
  RainHistory,
  Prisma, // Import Prisma namespace for types like JsonValue
  Account,
  Gender,
  UserStatus,
  FriendshipStatus,
  ChatChannel,
  NotificationType,
  TransactionType,
  TransactionStatus,
  RainType,
  MemberRole,
  InvitationStatus,
} from "../src"; // Standard import path for Prisma Client
import { faker } from "@faker-js/faker";
// import bcrypt from 'bcryptjs'; // Bun.password is used, bcrypt might not be needed unless for other purposes
import { loadGames } from "./loadgames"; // Assuming this will be loadgames.ts
import { addVipInfo } from "./addVipInfo"; // Assuming this will be addVipInfo.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { seedProducts } from "./seedProducts"; // Assuming this will be seedProducts.ts
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";

// --- Type Aliases for Prisma Enums (if not directly using Prisma.EnumType) ---
// These are often inferred correctly by Prisma, but explicit types can be clearer.
// Example: type Gender = 'BOY' | 'GIRL' | 'ALIEN' | 'UNSURE' | 'ROBOT' | 'COMPLICATED';
// However, Prisma generates these, so direct import is better:
// import { Gender, UserStatus, FriendshipStatus, Channel, NotificationType, TransactionType, TransactionStatus, RainType } from '@prisma/client';

// It's good practice to load these from environment variables
const supabaseUrl: string = "https://pykjixfuargqkjkgxsyc.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5a2ppeGZ1YXJncWtqa2d4c3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMDEyMjIsImV4cCI6MjAyMjg3NzIyMn0.t2ayCugyEAii4KHDG0rWRZcvQcILYtF_-UApm0XGlKg";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
// const prisma = new PrismaClient()
//   .$extends(withAccelerate())
//   .$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY as string }));

console.log(faker.string.uuid); // Corrected from faker.uuid to faker.string.uuid() for v8+

// Helper function to get a random element from an array
const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Helper function to get a random number within a range
const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export async function seed(): Promise<void> {
  console.log("Start seeding...");

  // --- Clear existing data (optional, uncomment if needed) ---
  // Order is important due to foreign key constraints
  await prisma.rainWinner.deleteMany();
  await prisma.vipInfo.deleteMany();
  await prisma.rainTip.deleteMany();
  await prisma.rainBet.deleteMany();
  await prisma.rainHistory.deleteMany();
  await prisma.userachievement.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.tournamentgame.deleteMany();
  await prisma.tournamententry.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.chatmessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.twoFactor.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.operatorgame.deleteMany(); // OperatorGame might depend on Game and Operator
  await prisma.game.deleteMany();
  await prisma.account.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.operator.deleteMany(); // Operator depends on User (ownerId)
  // await prisma.platformSession.deleteMany();
  await prisma.message.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing data.");

  // --- Create the specific 'ash' user ---
  const ashPassword = "asdfasdf";
  const ashPasswordHash: string = await Bun.password.hash(ashPassword);
  const aemail = faker.internet.email().toLowerCase();
  let ashUser: User;
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        password: ashPassword,
        email: aemail,
        // options: {
        //   emailRedirectTo: 'https://example.com/welcome',
        // },
      }
    );

    if (signUpError) {
      console.error("Error signing up Ash user to Supabase:", signUpError);
      // Decide how to handle this: throw error, or try to find existing user?
      // For seeding, often we might want to fail hard or skip.
      // Let's try to fetch if sign up failed due to existing user
      if (signUpError.message.includes("User already registered")) {
        console.log("Ash user already exists in Supabase, fetching...");
        const {
          data: { user: existingSupabaseUser },
          error: getUserError,
        } = await supabase.auth.admin.getUserById(signUpData.user!.id!);
        if (getUserError || !existingSupabaseUser) {
          console.error(
            "Failed to fetch existing Supabase user for Ash:",
            getUserError
          );
          throw new Error("Could not create or find Ash user in Supabase.");
        }
        console.log(
          "Found existing Supabase user for Ash:",
          existingSupabaseUser.id
        );
        // Check if user exists in Prisma DB
        const existingPrismaUser = await prisma.user.findUnique({
          where: { email: "ash@cashflowcasino.com" },
        });
        if (existingPrismaUser) {
          ashUser = existingPrismaUser;
        } else if (existingSupabaseUser) {
          ashUser = await prisma.user.create({
            data: {
              sbId: existingSupabaseUser.id,
              email: "ash@cashflowcasino.com",
              username: "ash",

              passwordHash: ashPasswordHash,
              name: "ash",
              emailVerified: true,
              image: null,
              twoFactorEnabled: false,
              role: "ADMIN", // Ensure role is UserRole enum if defined
              banned: false,
              banReason: null,
              banExpires: null,
              totalXp: 0,
              balance: 10000,
              isVerified: true,
              active: true,
              lastLogin: null,
              verificationToken: null,
              avatar: "avatar-10.webp",
              gender: null, // Prisma.Gender or string based on your schema
              status: UserStatus.ACTIVE, // Prisma.UserStatus or string
              cashtag: "fuxtex",
              phpId: 9,
              accessToken: faker.string.uuid(),
            },
          });
        } else {
          throw new Error(
            "Could not create or find Ash user in Supabase or Prisma."
          );
        }
      } else {
        throw signUpError;
      }
    } else if (!signUpData.user) {
      throw new Error("Supabase signUp did not return a user for Ash.");
    } else {
      ashUser = await prisma.user.create({
        data: {
          sbId: signUpData.user.id,
          email: "ash@cashflowcasino.com",
          username: "ash",
          passwordHash: ashPasswordHash,
          name: "ash",
          emailVerified: true,
          image: null,
          twoFactorEnabled: false,
          role: "MEMBER", // Ensure role is UserRole enum if defined
          banned: false,
          banReason: null,
          banExpires: null,
          totalXp: 0,
          balance: 10000,
          isVerified: true,
          active: true,
          lastLogin: null,
          verificationToken: null,
          avatar: "avatar-10.webp",
          gender: null, // Prisma.Gender or string based on your schema
          status: UserStatus.ACTIVE, // Prisma.UserStatus or string
          cashtag: "fuxtex",
          phpId: 9,
          accessToken: faker.string.uuid(),
        },
      });
    }
  } catch (e: any) {
    console.error('Failed to create specific user "ash":', e);
    // Depending on the desired behavior, you might want to re-throw or exit
    // For now, we'll try to proceed if ashUser might have been found/created despite sub-errors
    const existingUser = await prisma.user.findUnique({
      where: { email: "ash@cashflowcasino.com" },
    });
    if (!existingUser) {
      console.error(
        "Ash user definitely not created in Prisma DB. Exiting seed."
      );
      process.exit(1);
    }
    ashUser = existingUser; // Assign if found
  }
  // @ts-ignore
  console.log(
    `Created specific user: ${ashUser.username} with id: ${ashUser.id}`
  );

  // --- Create 10 Users (1 Operator) ---
  const users: User[] = [];
  const generalPassword = "asdfasdf";
  const passwordHash: string = await Bun.password.hash(generalPassword);

  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email().toLowerCase();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password: generalPassword,
      }
    );

    if (signUpError) {
      console.error(
        `Error signing up user ${email} to Supabase:`,
        signUpError.message
      );
      // Skip this user or handle error as needed
      continue;
    }
    if (!signUpData.user) {
      console.error(`Supabase signUp did not return a user for ${email}.`);
      continue;
    }

    const isOperator = i === 0; // Make the first user the operator
    try {
      const user: User = await prisma.user.create({
        data: {
          sbId: signUpData.user.id,
          email: email,
          username: faker.internet.userName().toLowerCase() + i, // Ensure unique username
          passwordHash: passwordHash,
          name: faker.person.fullName(),
          emailVerified: faker.datatype.boolean(),
          image: faker.image.avatar(),
          twoFactorEnabled: faker.datatype.boolean(),
          role: isOperator ? "ADMIN" : "MEMBER",
          banned: faker.datatype.boolean({ probability: 0.1 }),
          banReason: faker.datatype.boolean({ probability: 0.1 })
            ? faker.lorem.sentence()
            : null,
          banExpires: faker.datatype.boolean({ probability: 0.1 })
            ? faker.date.future()
            : null,
          totalXp: getRandomInt(0, 10000),
          balance: getRandomInt(0, 100000),
          isVerified: faker.datatype.boolean(),
          active: faker.datatype.boolean(),
          lastLogin: faker.datatype.boolean() ? faker.date.past() : null,
          verificationToken: faker.datatype.boolean()
            ? faker.string.uuid()
            : null,
          avatar: faker.image.avatar(),
          gender: getRandomElement<Gender>([
            Gender.BOY,
            Gender.GIRL,
            Gender.ALIEN,
            Gender.UNSURE,
            Gender.ROBOT,
            Gender.COMPLICATED,
          ]),
          status: getRandomElement<UserStatus>([
            "ACTIVE",
            "INACTIVE",
            "ONLINE",
            "OFFLINE",
          ]),
          cashtag: faker.finance.accountName().replace(/ /g, "_").toLowerCase(),
          phpId: getRandomInt(1000, 99999),
          accessToken: faker.string.uuid(),
        },
      });
      users.push(user);
      console.log(`Created user with id: ${user.id} and role: ${user.role}`);
    } catch (dbError) {
      console.error(`Error creating user ${email} in Prisma DB:`, dbError);
    }
  }

  if (users.length === 0 && !ashUser) {
    console.error(
      "No users were created, operator seeding cannot proceed. Exiting."
    );
    process.exit(1);
  }
  // Use ashUser if it's the only one, otherwise use the first generated user.
  const operatorUser: User = users.length > 0 ? users[0] : ashUser!;

  // --- Create 1 Operator ---
  const operator: Operator = await prisma.operator.create({
    data: {
      name: faker.company.name() + " Operator",
      slug: faker.lorem.slug(),
      logo: faker.image.urlLoremFlickr({ category: "business" }), // More specific image
      description: faker.lorem.paragraph(),
      isActive: true,
      ownerId: operatorUser.id,
      balance: getRandomInt(100000, 10000000),
    },
  });
  await addVipInfo(operator.id); // Assuming addVipInfo is typed in its own file

  const ashProfile: Profile = await prisma.profile.create({
    data: {
      balance: getRandomInt(0, 50000),
      xpEarned: getRandomInt(0, 8000),
      isActive: true,
      lastPlayed: faker.datatype.boolean() ? faker.date.recent() : null,
      phpId: 9,
      userId: ashUser.id,
      shopId: operator.id,
      currency: "USD", // Make sure this matches your Currency enum if you have one
    },
  });

  // Create Account for ashUser
  await prisma.account.create({
    data: {
      userId: ashUser.id as string,
      accountId: ashUser.id as string,
      password: ashUser.passwordHash as string,
      // type: "credentials",
      providerId: "credentials", // Custom provider name for your email/password
      // providerAccountId: ashUser.email, // Using email as the unique account ID for this provider
    } as Partial<Prisma.AccountCreateInput>, // Using 'as' for complex cases or if fields differ slightly from typical
  });
  console.log(`Created operator with id: ${operator.id}`);

  // --- Create Achievements ---
  const achievementsCount = getRandomInt(5, 20);
  const achievements: Achievement[] = [];
  for (let i = 0; i < achievementsCount; i++) {
    const achievement: Achievement = await prisma.achievement.create({
      data: {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        targetXp: getRandomInt(100, 5000),
        reward: getRandomInt(10, 500),
        isActive: faker.datatype.boolean(),
      },
    });
    achievements.push(achievement);
    console.log(`Created achievement with id: ${achievement.id}`);
  }

  // --- Create Sessions ---
  // if (users.length > 0) {
  //   // Ensure users array is not empty
  //   const sessionsCount = getRandomInt(10, 50);
  //   for (let i = 0; i < sessionsCount; i++) {
  //     const randomUser = getRandomElement(users);
  //     await prisma.platformSession.create({
  //       data: {
  //         userId: randomUser.id,
  //         activeGameId: faker.datatype.boolean() ? faker.string.uuid() : null,
  //         ipAddress: faker.internet.ip(),
  //         userAgent: faker.internet.userAgent(),
  //         expiresAt: faker.date.future(),
  //         refreshToken: faker.string.uuid(),
  //         active: faker.datatype.boolean(),
  //         token: faker.string.uuid(),
  //       },
  //     });
  //     console.log(`Created session for user: ${randomUser.id}`);
  //   }
  // }

  // --- Create Messages (Assuming Message model has authorId as String, not a direct relation) ---
  const messagesCount = getRandomInt(10, 100);
  for (let i = 0; i < messagesCount; i++) {
    await prisma.message.create({
      data: {
        content: faker.lorem.sentence(),
        authorId: faker.string.uuid(), // If this should be a user, it needs relation
      },
    });
    console.log(`Created message ${i + 1}`);
  }

  // --- Create Profiles ---
  const createdProfiles: Profile[] = [];
  const allSeedUsers = ashUser ? [ashUser, ...users] : [...users]; // Combine ashUser with other users

  for (const user of allSeedUsers) {
    // Check if a profile already exists for this user with this shop
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId_shopId: {
          userId: user.id,
          shopId: operator.id,
        },
      },
    });

    if (existingProfile) {
      console.log(
        `Profile already exists for user: ${user.id} and shop: ${operator.id}, skipping.`
      );
      if (!createdProfiles.find((p) => p.id === existingProfile.id)) {
        // ensure it's in our local array
        createdProfiles.push(existingProfile);
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { activeProfileId: existingProfile.id },
      });
      continue;
    }

    try {
      const profile: Profile = await prisma.profile.create({
        data: {
          balance: getRandomInt(0, 50000),
          xpEarned: getRandomInt(0, 8000),
          isActive: faker.datatype.boolean(),
          lastPlayed: faker.datatype.boolean() ? faker.date.recent() : null,
          phpId: getRandomInt(1000, 99999),
          userId: user.id,
          shopId: operator.id,
          currency: getRandomElement(["USD", "EUR", "GBP"]), // Ensure these match Currency enum
        },
      });
      createdProfiles.push(profile);
      console.log(
        `Created profile with id: ${profile.id} for user: ${user.id}`
      );
      await prisma.user.update({
        where: { id: user.id },
        data: { activeProfileId: profile.id },
      });
    } catch (profileError: any) {
      if (
        profileError instanceof Prisma.PrismaClientKnownRequestError &&
        profileError.code === "P2002"
      ) {
        console.log(
          `Profile unique constraint failed for user: ${user.id} and shop: ${operator.id}, skipping.`
        );
      } else {
        console.error(
          `Failed to create profile for user ${user.id}:`,
          profileError
        );
      }
    }
  }

  // --- Create Games ---
  const games: Game[] = await loadGames(); // Pass prisma and operator.id if needed by loadGames
  console.log(`Loaded ${games.length} games.`);

  // --- Create Accounts for all users ---
  for (const user of allSeedUsers) {
    // Check if account exists
    const existingAccount = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credentials" }, // providerId might be 'credentials'
    });
    if (existingAccount) {
      console.log(`Account already exists for user: ${user.id}, skipping.`);
      continue;
    }
    await prisma.account.create({
      data: {
        // accountId: user.id, // Again, accountId might be different from userId
        // providerId: 'credential', // This should match the provider name
        // userId: user.id,
        // password: user.id === ashUser?.id ? ashPasswordHash : passwordHash, // Not typically stored here
        // Based on common Prisma patterns for Account (e.g., NextAuth.js adapter):
        userId: user.id,
        accountId: user.id,
        password: user.passwordHash,
        // type: "credentials",
        providerId: "credentials", // Custom provider name for your email/password
        // providerId: user.id, // Custom provider name for your email/password
        // providerAccountId: user.email, // Using email as the unique account ID for this provider
      } as unknown as Prisma.AccountCreateInput,
    });
    console.log(`Created account for user: ${user.id}`);
  }

  // --- Create Operator Games ---
  // This section was commented out, assuming loadGames now handles this or it's not needed.
  // If you need to create OperatorGame entries separately:
  if (games.length > 0) {
    for (const game of games) {
      // Assuming OperatorGame model exists and links Game to Operator with specific settings
      // Example:
      // await prisma.operatorGame.create({
      //   data: {
      //     gameId: game.id,
      //     operatorId: operator.id,
      //     name: game.name, // or a custom name for the operator
      //     slug: faker.lorem.slug(),
      //     // ... other OperatorGame specific fields
      //   }
      // });
    }
  }

  // --- Create Verifications ---
  const verificationsCount = getRandomInt(5, 20);
  for (let i = 0; i < verificationsCount; i++) {
    await prisma.verification.create({
      data: {
        identifier: faker.internet.email(),
        value: faker.string.uuid(),
        expiresAt: faker.date.future(),
        // createdAt: faker.date.past(), // Prisma typically handles createdAt automatically
      },
    });
    console.log(`Created verification ${i + 1}`);
  }

  // --- Create Organizations ---
  const organizationsCount = getRandomInt(3, 10);
  const organizations: Organization[] = [];
  for (let i = 0; i < organizationsCount; i++) {
    const organization: Organization = await prisma.organization.create({
      data: {
        name: faker.company.name() + " Org",
        slug: faker.lorem.slug() + "-org" + i, // Ensure slug is unique
        logo: faker.image.urlLoremFlickr({ category: "business" }),
        // metadata: {} as Prisma.JsonValue, // Explicitly type empty JSON
      },
    });
    organizations.push(organization);
    console.log(`Created organization with id: ${organization.id}`);
  }

  // --- Create Members ---
  if (organizations.length > 0 && allSeedUsers.length > 0) {
    const membersCount = getRandomInt(10, 30);
    for (let i = 0; i < membersCount; i++) {
      const randomOrganization = getRandomElement(organizations);
      const randomUser = getRandomElement(allSeedUsers);
      // Avoid duplicate members
      const existingMember = await prisma.member.findUnique({
        where: {
          userId_organizationId: {
            userId: randomUser.id,
            organizationId: randomOrganization.id,
          },
        },
      });
      if (existingMember) continue;

      await prisma.member.create({
        data: {
          organizationId: randomOrganization.id,
          userId: randomUser.id,
          role: getRandomElement<MemberRole>(["ADMIN", "MEMBER", "GUEST"]), // Use Prisma enum MemberRole if available
        },
      });
      console.log(
        `Created member for user ${randomUser.id} in organization ${randomOrganization.id}`
      );
    }
  }

  // --- Create Invitations ---
  if (organizations.length > 0 && allSeedUsers.length > 0) {
    const invitationsCount = getRandomInt(5, 20);
    for (let i = 0; i < invitationsCount; i++) {
      const randomOrganization = getRandomElement(organizations);
      const randomUser = getRandomElement(allSeedUsers); // The inviter
      await prisma.invitation.create({
        data: {
          organizationId: randomOrganization.id,
          email: faker.internet.email(),
          role: getRandomElement<MemberRole>(["MEMBER", "GUEST"]), // Use MemberRole
          status: getRandomElement<InvitationStatus>(["PENDING", "ACCEPTED"]), // Use InvitationStatus
          expiresAt: faker.date.future(),
          inviterId: randomUser.id,
        },
      });
      console.log(
        `Created invitation for organization ${randomOrganization.id}`
      );
    }
  }

  // --- Create TwoFactors ---
  // const twoFactorsCount = getRandomInt(5, 15); // This was unused
  for (const user of allSeedUsers) {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      // 30% chance to have 2FA
      // Check if 2FA already exists
      const existingTwoFactor = await prisma.twoFactor.findUnique({
        where: { userId: user.id },
      });
      if (existingTwoFactor) continue;

      await prisma.twoFactor.create({
        data: {
          secret: faker.string.uuid(), // In reality, this would be a base32 encoded secret
          backupCodes: JSON.stringify([
            faker.string.alphanumeric(10), // More realistic backup codes
            faker.string.alphanumeric(10),
            faker.string.alphanumeric(10),
          ]), // Type assertion for JSON
          userId: user.id,
        },
      });
      console.log(`Created two-factor for user: ${user.id}`);
    }
  }

  // --- Create Tournaments ---
  const tournamentsCount = getRandomInt(5, 15);
  const tournaments: Tournament[] = [];
  for (let i = 0; i < tournamentsCount; i++) {
    const startTime = faker.date.past();
    const endTime = faker.date.future({ refDate: startTime }); // Ensure endTime is after startTime
    const tournament: Tournament = await prisma.tournament.create({
      data: {
        name: faker.lorem.words(3) + " Tournament " + i, // Add index for uniqueness
        description: faker.lorem.sentence(),
        startTime: startTime,
        endTime: endTime,
        entryFee: getRandomInt(0, 100),
        prizePool: getRandomInt(1000, 50000),
        isActive: faker.datatype.boolean(),
        operatorId: operator.id,
        leaderboard: {} as Prisma.InputJsonValue,
      },
    });
    tournaments.push(tournament);
    console.log(`Created tournament with id: ${tournament.id}`);
  }

  // --- Create Game Sessions ---
  const gameSessionsCount = getRandomInt(20, 100);
  const gameSessions: GameSession[] = [];
  if (createdProfiles.length > 0 && games.length > 0) {
    // Check if profiles and games exist
    for (let i = 0; i < gameSessionsCount; i++) {
      const randomProfile = getRandomElement(createdProfiles);
      const randomGame = getRandomElement(games); // Changed from randomOperatorGame

      const tournamentId =
        tournaments.length > 0 && faker.datatype.boolean({ probability: 0.6 })
          ? getRandomElement(tournaments).id
          : null;

      const gameSession: GameSession = await prisma.gameSession.create({
        data: {
          startTime: faker.date.past(),
          endTime: faker.datatype.boolean({ probability: 0.8 })
            ? faker.date.recent()
            : null,
          betAmount: getRandomInt(10, 1000),
          winAmount: getRandomInt(0, 2000),
          xpEarned: getRandomInt(0, 500),
          metadata: {} as Prisma.InputJsonValue,
          gameId: randomGame.id,
          tournamentId: tournamentId,
          active: faker.datatype.boolean(),
          profileId: randomProfile.id,
        },
      });
      gameSessions.push(gameSession);
      console.log(`Created game session with id: ${gameSession.id}`);
    }
  }

  // --- Create Chat Rooms ---
  const chatRoomsCount = getRandomInt(5, 15);
  const chatRooms: ChatRoom[] = [];
  for (let i = 0; i < chatRoomsCount; i++) {
    const isGameRoom = faker.datatype.boolean();
    const gameSessionId =
      isGameRoom && gameSessions.length > 0
        ? getRandomElement(gameSessions).id
        : null;

    const chatRoom: ChatRoom = await prisma.chatRoom.create({
      data: {
        name: faker.lorem.words(2) + " Chat Room " + i, // Add index for uniqueness
        isGameRoom: isGameRoom,
        gameSessionId: gameSessionId,
      },
    });
    chatRooms.push(chatRoom);
    console.log(`Created chat room with id: ${chatRoom.id}`);
  }

  // --- Create Friendships ---
  if (allSeedUsers.length >= 2) {
    // Need at least 2 users for friendships
    const friendshipsCount = getRandomInt(10, 30);
    for (let i = 0; i < friendshipsCount; i++) {
      const user1 = getRandomElement(allSeedUsers);
      let user2 = getRandomElement(allSeedUsers);
      while (user1.id === user2.id) {
        // Ensure user1 and user2 are different
        user2 = getRandomElement(allSeedUsers);
      }
      try {
        // Check if friendship or its inverse already exists
        const existingFriendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { userId: user1.id, friendId: user2.id },
              { userId: user2.id, friendId: user1.id },
            ],
          },
        });
        if (existingFriendship) {
          console.log(
            `Friendship relation already exists between ${user1.id} and ${user2.id}, skipping.`
          );
          continue;
        }

        await prisma.friendship.create({
          data: {
            userId: user1.id,
            friendId: user2.id,
            status: getRandomElement<FriendshipStatus>([
              "PENDING",
              "ACCEPTED",
              "BLOCKED",
            ]), // Use Prisma enum
          },
        });
        console.log(`Created friendship between ${user1.id} and ${user2.id}`);
      } catch (error: any) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          console.log(
            `Friendship unique constraint failed (likely reverse) between ${user1.id} and ${user2.id}, skipping.`
          );
        } else {
          throw error;
        }
      }
    }
  }

  // --- Create Chat Messages ---
  if (allSeedUsers.length > 0 && chatRooms.length > 0) {
    const chatMessagesCount = getRandomInt(50, 200);
    for (let i = 0; i < chatMessagesCount; i++) {
      const randomUser = getRandomElement(allSeedUsers);
      const randomChatRoom = getRandomElement(chatRooms);
      await prisma.chatmessage.create({
        data: {
          content: faker.lorem.sentence(),
          channel: getRandomElement<ChatChannel>([
            "LOBBY",
            "GAME",
            "TOURNAMENT",
            "PRIVATE",
          ]), // Use Prisma enum
          // metadata: {} as Prisma.JsonValue,
          userId: randomUser.id,
          // userName: randomUser.username, // This should be fetched/joined, not stored denormalized unless specific reason
          roomId: randomChatRoom.id,
        },
      });
      console.log(`Created chat message ${i + 1}`);
    }
  }

  // --- Create Products ---
  await seedProducts(prisma); // Pass prisma if seedProducts needs it

  // --- Create Notifications ---
  if (allSeedUsers.length > 0) {
    const notificationsCount = getRandomInt(20, 100);
    for (let i = 0; i < notificationsCount; i++) {
      const randomUser = getRandomElement(allSeedUsers);
      const isRead = faker.datatype.boolean({ probability: 0.7 });
      await prisma.notification.create({
        data: {
          notficationType: getRandomElement<NotificationType>([
            // Use Prisma enum
            "SYSTEM",
            "FRIEND_REQUEST",
            "ACHIEVEMENT",
            "BALANCE_UPDATE",
            "PROMOTIONAL",
            "TOURNAMENT",
          ]),
          title: faker.lorem.words(3),
          message: faker.lorem.sentence(),
          isRead: isRead,
          readAt: isRead ? faker.date.recent() : null,
          metadata: {} as Prisma.InputJsonValue,
          userId: randomUser.id,
        },
      });
      console.log(`Created notification for user: ${randomUser.id}`);
    }
  }

  // --- Create Tournament Entries ---
  if (
    tournaments.length > 0 &&
    allSeedUsers.length > 0 &&
    createdProfiles.length > 0
  ) {
    for (const tournament of tournaments) {
      const usersForTournament = faker.helpers
        .shuffle(allSeedUsers)
        .slice(0, getRandomInt(1, allSeedUsers.length));

      for (const user of usersForTournament) {
        const userProfile = createdProfiles.find(
          (p) => p.userId === user.id && p.shopId === operator.id
        );
        if (!userProfile) continue;

        try {
          // Check if entry exists
          const existingEntry = await prisma.tournamententry.findUnique({
            where: {
              userId_tournamentId: {
                userId: user.id,
                tournamentId: tournament.id,
              },
            },
          });
          if (existingEntry) {
            console.log(
              `Tournament entry already exists for user ${user.id} and tournament ${tournament.id}, skipping.`
            );
            continue;
          }

          await prisma.tournamententry.create({
            data: {
              score: getRandomInt(0, 10000),
              wagered: getRandomInt(0, 5000),
              won: getRandomInt(0, 8000),
              joinedAt: faker.date.recent(),
              userId: user.id,
              tournamentId: tournament.id,
              profileId: userProfile.id,
            },
          });
          console.log(
            `Created tournament entry for user ${user.id} in tournament ${tournament.id}`
          );
        } catch (error: any) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            console.log(
              `Tournament entry unique constraint failed for user ${user.id} and tournament ${tournament.id}, skipping.`
            );
          } else {
            throw error;
          }
        }
      }
    }
  }

  // --- Create Tournament Games ---
  if (tournaments.length > 0 && games.length > 0) {
    const tournamentGamesCount = getRandomInt(10, 30);
    for (let i = 0; i < tournamentGamesCount; i++) {
      const randomTournament = getRandomElement(tournaments);
      const randomGame = getRandomElement(games);
      try {
        // Check if tournament game exists
        const existingTg = await prisma.tournamentgame.findUnique({
          where: {
            tournamentId_gameId: {
              tournamentId: randomTournament.id,
              gameId: randomGame.id,
            },
          },
        });
        if (existingTg) {
          console.log(
            `Tournament game already exists for tournament ${randomTournament.id} and game ${randomGame.id}, skipping.`
          );
          continue;
        }
        await prisma.tournamentgame.create({
          data: {
            multiplier: parseFloat(
              faker.number
                .float({ min: 1.0, max: 5.0, fractionDigits: 2 })
                .toFixed(1)
            ),
            tournamentId: randomTournament.id,
            gameId: randomGame.id,
          },
        });
        console.log(
          `Created tournament game for tournament ${randomTournament.id} and game ${randomGame.id}`
        );
      } catch (error: any) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          console.log(
            `Tournament game unique constraint failed for tournament ${randomTournament.id} and game ${randomGame.id}, skipping.`
          );
        } else {
          throw error;
        }
      }
    }
  }

  // --- Create Transactions ---
  if (createdProfiles.length > 0) {
    const transactionsCount = getRandomInt(50, 200);
    for (let i = 0; i < transactionsCount; i++) {
      const randomProfile = getRandomElement(createdProfiles);
      const type = getRandomElement<TransactionType>([
        // Use Prisma enum
        "DEPOSIT",
        "WITHDRAWAL",
        "BET",
        "WIN",
        "BONUS",
        "DONATION",
        "ADJUSTMENT",
        "TOURNAMENT_BUYIN",
        "TOURNAMENT_PRIZE",
      ]);
      const isRealMoney = type === "DEPOSIT" || type === "WITHDRAWAL";
      const status = getRandomElement<TransactionStatus>([
        // Use Prisma enum
        "PENDING",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
      ]);

      let gameSessionId: string | null = null;
      if (
        faker.datatype.boolean({ probability: 0.6 }) &&
        gameSessions.length > 0
      ) {
        gameSessionId = getRandomElement(gameSessions).id;
      }

      await prisma.transaction.create({
        data: {
          transactionType: type,
          amount: getRandomInt(1, 10000),
          reference: faker.string.uuid(),
          status: status,
          metadata: {} as Prisma.InputJsonValue,
          isRealMoney: isRealMoney,
          paymentMethod: isRealMoney ? faker.finance.transactionType() : null,
          paymentDetails: isRealMoney
            ? ({} as Prisma.InputJsonValue)
            : undefined,
          processedAt: status === "COMPLETED" ? faker.date.recent() : null,
          gameSessionId: gameSessionId,
          profileId: randomProfile.id,
        },
      });
      console.log(`Created transaction ${i + 1}`);
    }
  }

  // --- Create User Achievements ---
  if (allSeedUsers.length > 0 && achievements.length > 0) {
    const userAchievementsCount = getRandomInt(20, 50);
    for (let i = 0; i < userAchievementsCount; i++) {
      const randomUser = getRandomElement(allSeedUsers);
      const randomAchievement = getRandomElement(achievements);
      const isUnlocked = faker.datatype.boolean({ probability: 0.3 });

      try {
        // Check if user achievement exists
        const existingUserAchievement = await prisma.userachievement.findUnique(
          {
            where: {
              userId_achievementId: {
                userId: randomUser.id,
                achievementId: randomAchievement.id,
              },
            },
          }
        );
        if (existingUserAchievement) {
          console.log(
            `User achievement already exists for user ${randomUser.id} and achievement ${randomAchievement.id}, skipping.`
          );
          continue;
        }

        await prisma.userachievement.create({
          data: {
            progress: isUnlocked
              ? randomAchievement.targetXp
              : getRandomInt(
                  0,
                  randomAchievement.targetXp - 1 < 0
                    ? 0
                    : randomAchievement.targetXp - 1
                ), // Ensure progress is not negative
            isUnlocked: isUnlocked,
            unlockedAt: isUnlocked ? faker.date.recent() : null,
            userId: randomUser.id,
            achievementId: randomAchievement.id,
          },
        });
        console.log(
          `Created user achievement for user ${randomUser.id} and achievement ${randomAchievement.id}`
        );
      } catch (error: any) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          console.log(
            `User achievement unique constraint failed for user ${randomUser.id} and achievement ${randomAchievement.id}, skipping.`
          );
        } else {
          throw error;
        }
      }
    }
  }

  // --- Create Rain History ---
  if (allSeedUsers.length > 0) {
    const rainHistoryCount = getRandomInt(10, 30);
    const rainHistories: RainHistory[] = [];
    for (let i = 0; i < rainHistoryCount; i++) {
      const randomUser = getRandomElement(allSeedUsers);
      const rainHistory: RainHistory = await prisma.rainHistory.create({
        data: {
          userId: randomUser.id,
          amount: getRandomInt(100, 5000),
          rainType: getRandomElement<RainType>(["CHAT", "GAME", "MANUAL"]), // Use Prisma enum
        },
      });
      rainHistories.push(rainHistory);
      console.log(`Created rain history with id: ${rainHistory.id}`);
    }

    // --- Create Rain Bets ---
    if (rainHistories.length > 0) {
      const rainBetsCount = getRandomInt(20, 50);
      for (let i = 0; i < rainBetsCount; i++) {
        const randomRainHistory = getRandomElement(rainHistories);
        const randomUser = getRandomElement(allSeedUsers);
        await prisma.rainBet.create({
          data: {
            rainHistoryId: randomRainHistory.id,
            userId: randomUser.id,
            betAmount: getRandomInt(10, 500),
            odds: getRandomInt(1, 10),
            outcome: faker.datatype.boolean({ probability: 0.7 })
              ? getRandomElement(["win", "lose"])
              : null,
            settledAt: faker.datatype.boolean({ probability: 0.7 })
              ? faker.date.recent()
              : null,
          },
        });
        console.log(`Created rain bet ${i + 1}`);
      }
    }

    // --- Create Rain Tips ---
    if (rainHistories.length > 0) {
      const rainTipsCount = getRandomInt(10, 30);
      for (let i = 0; i < rainTipsCount; i++) {
        const randomRainHistory = getRandomElement(rainHistories);
        const randomUser = getRandomElement(allSeedUsers);
        await prisma.rainTip.create({
          data: {
            rainHistoryId: randomRainHistory.id,
            userId: randomUser.id,
            tipAmount: getRandomInt(10, 500),
          },
        });
        console.log(`Created rain tip ${i + 1}`);
      }
    }

    // --- Create Rain Winners ---
    if (rainHistories.length > 0) {
      const rainWinnersCount = getRandomInt(5, 20);
      for (let i = 0; i < rainWinnersCount; i++) {
        const randomRainHistory = getRandomElement(rainHistories);
        const randomUser = getRandomElement(allSeedUsers);
        // Ensure a user doesn't win multiple times for the same rain event (if that's a rule)
        // For simplicity, this check is omitted here but might be needed for strictness.
        await prisma.rainWinner.create({
          data: {
            rainHistoryId: randomRainHistory.id,
            userId: randomUser.id,
            wonAmount: getRandomInt(100, 2000),
          },
        });
        console.log(`Created rain winner ${i + 1}`);
      }
    }
  }

  console.log("Seeding finished.");
}

// Call the seed function and handle potential errors
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
