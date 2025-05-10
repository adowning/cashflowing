import { PrismaClient } from '../prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import { loadGames } from './loadgames.js'
import { addVipInfo } from './addVipInfo.js'
import { createClient } from '@supabase/supabase-js'
import { seedProducts } from './seedProducts.js'
// import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
// const supabase = createClient(
//   'https://localhost:8000',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q',
// )
const supabaseUrl = 'https://pykjixfuargqkjkgxsyc.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5a2ppeGZ1YXJncWtqa2d4c3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMDEyMjIsImV4cCI6MjAyMjg3NzIyMn0.t2ayCugyEAii4KHDG0rWRZcvQcILYtF_-UApm0XGlKg'
const supabase = createClient(supabaseUrl, supabaseKey)
const prisma = new PrismaClient()
console.log(faker.uuid)
// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Helper function to get a random number within a range
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export async function seed() {
  console.log('Start seeding...')

  // --- Clear existing data (optional, uncomment if needed) ---
  await prisma.rainWinner.deleteMany()
  await prisma.vipInfo.deleteMany()
  await prisma.rainTip.deleteMany()
  await prisma.rainBet.deleteMany()
  await prisma.rainHistory.deleteMany()
  await prisma.userachievement.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.tournamentgame.deleteMany()
  await prisma.tournamententry.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.product.deleteMany()
  await prisma.gamesession.deleteMany()
  await prisma.friendship.deleteMany()
  await prisma.chatmessage.deleteMany()
  await prisma.chatroom.deleteMany()
  await prisma.twoFactor.deleteMany()
  await prisma.invitation.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.operatorgame.deleteMany()
  await prisma.game.deleteMany()
  await prisma.account.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.operator.deleteMany()
  await prisma.platformSession.deleteMany()
  await prisma.message.deleteMany() // Assuming Message is not related to User directly based on schema
  await prisma.achievement.deleteMany()
  await prisma.user.deleteMany()
  console.log('Cleared existing data.')

  // --- Create the specific 'ash' user ---
  const ashPasswordHash = await Bun.password.hash('asdfasdf')

  let ashUser
  try {
    let { data, error } = await supabase.auth.signUp({
      password: 'asdfasdf',
      email: 'ash@cashflowcasino.com',
      // options: {
      //   emailRedirectTo: 'https://example.com/welcome',
      // },
    })
    console.log(error)
    console.log(data)
    ashUser = await prisma.user.create({
      data: {
        sbId: data.user.id,
        email: 'ash@cashflowcasino.com',
        username: 'ash',
        passwordHash: ashPasswordHash,
        name: 'ash',
        emailVerified: true,
        image: null, // Assuming no specific image provided, can add if needed
        twoFactorEnabled: false, // Assuming default
        role: 'user',
        banned: false, // Assuming not banned
        banReason: null,
        banExpires: null,
        totalXp: 0, // Assuming default
        balance: 10000,
        isVerified: true,
        active: true,
        lastLogin: null, // Assuming no last login yet
        verificationToken: null, // Assuming no verification token needed
        avatar: 'avatar-10.webp',
        gender: null, // Assuming not specified
        status: 'ACTIVE', // Assuming active status
        cashtag: 'fuxtex',
        phpId: 9,
        accessToken: faker.string.uuid(), // Generate a random access token
      },
    })
  } catch (e) {
    console.log(e)
  }
  console.log(
    `Created specific user: ${ashUser.username} with id: ${ashUser.id}`,
  )

  // --- Create 10 Users (1 Operator) ---
  const users = []
  const passwordHash = await Bun.password.hash('asdfasdf')

  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email().toLowerCase()
    // async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'asdfasdf',
      // options: {
      //   emailRedirectTo: 'https://example.com/welcome',
      // },
    })
    console.log(data)
    if (data === null) throw new Error('shit')
    // }
    const isOperator = i === 0 // Make the first user the operator
    const user = await prisma.user.create({
      data: {
        sbId: data.user.id,
        email: email,
        username: faker.internet.userName().toLowerCase() + i, // Ensure unique username
        passwordHash: passwordHash,
        name: faker.person.fullName(),
        emailVerified: faker.datatype.boolean(),
        image: faker.image.avatar(),
        twoFactorEnabled: faker.datatype.boolean(),
        role: isOperator ? 'operator' : 'user',
        banned: faker.datatype.boolean(0.1), // 10% chance of being banned
        banReason: faker.datatype.boolean(0.1) ? faker.lorem.sentence() : null,
        banExpires: faker.datatype.boolean(0.1) ? faker.date.future() : null,
        totalXp: getRandomInt(0, 10000),
        balance: getRandomInt(0, 100000),
        isVerified: faker.datatype.boolean(),
        active: faker.datatype.boolean(),
        lastLogin: faker.datatype.boolean() ? faker.date.past() : null,
        verificationToken: faker.datatype.boolean()
          ? faker.string.uuid()
          : null,
        avatar: faker.image.avatar(),
        gender: getRandomElement([
          'BOY',
          'GIRL',
          'ALIEN',
          'UNSURE',
          'ROBOT',
          'COMPLICATED',
        ]),
        status: getRandomElement(['ACTIVE', 'INACTIVE', 'ONLINE', 'OFFLINE']),
        cashtag: faker.finance.accountName().replace(/ /g, '_').toLowerCase(),
        phpId: getRandomInt(1000, 99999),
        accessToken: faker.string.uuid(),
      },
    })
    users.push(user)
    console.log(`Created user with id: ${user.id} and role: ${user.role}`)
  }

  const operatorUser = users[0] // The first user is the operator

  // --- Create 1 Operator ---
  const operator = await prisma.operator.create({
    data: {
      name: faker.company.name() + ' Operator',
      slug: faker.lorem.slug(),
      logo: faker.image.url(),
      description: faker.lorem.paragraph(),
      isActive: true,
      ownerId: operatorUser.id,
      balance: getRandomInt(100000, 10000000),
    },
  })
  await addVipInfo(operator.id)

  const ashProfile = await prisma.profile.create({
    data: {
      balance: getRandomInt(0, 50000),
      xpEarned: getRandomInt(0, 8000),
      isActive: true,
      lastPlayed: faker.datatype.boolean() ? faker.date.recent() : null,
      phpId: 9,
      userId: ashUser.id, // Link to the current user
      shopId: operator.id, // Link to the created operator
      currency: 'USD',
    },
  })
  await prisma.account.create({
    data: {
      accountId: ashUser.id,
      providerId: 'credential',
      userId: ashUser.id,
      password: passwordHash,
    },
  })
  console.log(`Created operator with id: ${operator.id}`)

  // --- Create Achievements ---
  const achievementsCount = getRandomInt(5, 20)
  const achievements = []
  for (let i = 0; i < achievementsCount; i++) {
    const achievement = await prisma.achievement.create({
      data: {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        targetXp: getRandomInt(100, 5000),
        reward: getRandomInt(10, 500),
        isActive: faker.datatype.boolean(),
      },
    })
    achievements.push(achievement)
    console.log(`Created achievement with id: ${achievement.id}`)
  }

  // --- Create Sessions ---
  const sessionsCount = getRandomInt(10, 50)
  for (let i = 0; i < sessionsCount; i++) {
    const randomUser = getRandomElement(users)
    await prisma.platformSession.create({
      data: {
        userId: randomUser.id,
        activeGameId: faker.datatype.boolean() ? faker.string.uuid() : null, // Assuming activeGameId is not a foreign key to Game based on schema
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        expiresAt: faker.date.future(),
        refreshToken: faker.string.uuid(),
        active: faker.datatype.boolean(),
        token: faker.string.uuid(),
      },
    })
    console.log(`Created session for user: ${randomUser.id}`)
  }

  // --- Create Messages (Assuming no direct relation to User based on schema) ---
  const messagesCount = getRandomInt(10, 100)
  for (let i = 0; i < messagesCount; i++) {
    await prisma.message.create({
      data: {
        content: faker.lorem.sentence(),
        authorId: faker.string.uuid(), // Assuming authorId is not a foreign key to User based on schema
      },
    })
    console.log(`Created message ${i + 1}`)
  }

  // --- Create Profiles (Modified to ensure unique userId, shopId combination) ---
  const profiles = []
  for (const user of users) {
    // Iterate through each user
    const profile = await prisma.profile.create({
      data: {
        balance: getRandomInt(0, 50000),
        xpEarned: getRandomInt(0, 8000),
        isActive: faker.datatype.boolean(),
        lastPlayed: faker.datatype.boolean() ? faker.date.recent() : null,
        phpId: getRandomInt(1000, 99999),
        userId: user.id, // Link to the current user
        shopId: operator.id, // Link to the created operator
        currency: getRandomElement(['USD', 'EUR', 'GBP']),
      },
    })
    profiles.push(profile)
    console.log(`Created profile with id: ${profile.id} for user: ${user.id}`)
  }

  // --- Create Games ---
  // const gamesCount = getRandomInt(10, 50);
  // const games = [];
  const games = await loadGames()
  // for (let i = 0; i < gamesCount; i++) {
  //   const game = await prisma.game.create({
  //     data: {
  //       name: faker.lorem.words(2),
  //       title: faker.commerce.productName() + " Game",
  //       temperature: faker.number.float({ min: 0, max: 1 }).toFixed(2),
  //       developer: faker.company.name(),
  //       vipLevel: getRandomInt(0, 5),
  //       isActive: faker.datatype.boolean(),
  //       device: getRandomInt(0, 2), // Assuming device is an int representing type
  //       featured: faker.datatype.boolean(),
  //       gamebank: getRandomElement(["slots", "table", "live"]),
  //       // Corrected: Removed .toFixed(2) to provide a Float
  //       bet: faker.number.float({ min: 0.1, max: 10 }),
  //       denomination: faker.number.float({ min: 0.01, max: 1 }),
  //       categoryTemp: null, //faker.number.float({ min: 0, max: 1 }).toFixed(2),
  //       originalId: getRandomInt(1000, 99999),
  //       bids: getRandomInt(0, 1000),
  //       statIn: parseFloat(faker.number.float({ min: 0, max: 10000 }).toFixed(2)),
  //       statOut: parseFloat(faker.number.float({ min: 0, max: 9000 }).toFixed(2)),
  //       currentRtp: parseFloat(faker.number.float({ min: 0.8, max: 0.99 }).toFixed(2)),
  //       rtpStatIn: parseFloat(faker.number.float({ min: 0, max: 10000 }).toFixed(2)),
  //       rtpStatOut: parseFloat(faker.number.float({ min: 0, max: 9000 }).toFixed(2)),
  //       standardRtp: parseFloat(faker.number.float({ min: 0.85, max: 0.98 }).toFixed(2)),
  //       popularity: parseFloat(faker.number.float({ min: 0, max: 100 }).toFixed(2)),
  //       chanceFirepot1: parseFloat(faker.number.float({ min: 0, max: 1 }).toFixed(2)),
  //       chanceFirepot2: parseFloat(faker.number.float({ min: 0, max: 1 }).toFixed(2)),
  //       chanceFirepot3: parseFloat(faker.number.float({ min: 0, max: 1 }).toFixed(2)),
  //       fireCount1: parseFloat(faker.number.float({ min: 0, max: 100 }).toFixed(2)),
  //       fireCount2: parseFloat(faker.number.float({ min: 0, max: 100 }).toFixed(2)),
  //       fireCount3: parseFloat(faker.number.float({ min: 0, max: 100 }).toFixed(2)),
  //       linesPercentConfigSpin: JSON.stringify({}), // Placeholder
  //       linesPercentConfigSpinBonus: JSON.stringify({}), // Placeholder
  //       linesPercentConfigBonus: JSON.stringify({}), // Placeholder
  //       linesPercentConfigBonusBonus: JSON.stringify({}), // Placeholder
  //       rezerv: parseFloat(faker.number.float({ min: 0, max: 1000 }).toFixed(2)),
  //       cask: parseFloat(faker.number.float({ min: 0, max: 1000 }).toFixed(2)),
  //       advanced: JSON.stringify({}), // Placeholder
  //       scaleMode: getRandomElement(["fit", "stretch"]),
  //       slotViewState: getRandomElement(["default", "expanded"]),
  //       view: getRandomInt(0, 100000),
  //       categoryId: faker.datatype.boolean() ? faker.string.uuid() : null, // Assuming categoryId is not a foreign key
  //       operatorId: operator.id, // Link to the created operator
  //       providerId: faker.datatype.boolean() ? faker.string.uuid() : null, // Assuming providerId is not a foreign key
  //       active: faker.datatype.boolean(),
  //       password: faker.datatype.boolean(0.1) ? faker.internet.password() : null, // 10% chance of having a password
  //     },
  //   });
  //   games.push(game);
  //   console.log(`Created game with id: ${game.id}`);
  // }

  // --- Create Accounts ---
  for (let user of users) {
    await prisma.account.create({
      data: {
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: passwordHash,
      },
    })
    console.log(`Created account for user: ${user.id}`)
  }

  // --- Create Operator Games ---
  // const operatorGamesCount = getRandomInt(10, 50);
  // const operatorGames = games;
  // for (let i = 0; i < operatorGamesCount; i++) {
  //   const operatorGame = await prisma.operatorgame.create({
  //     data: {
  //       name: faker.lorem.words(3) + " Operator Game",
  //       slug: faker.lorem.slug(),
  //       description: faker.lorem.sentence(),
  //       thumbnail: faker.image.url(),
  //       minBet: getRandomInt(1, 100),
  //       maxBet: getRandomInt(100, 10000),
  //       xpMultiplier: parseFloat(faker.number.float({ min: 0.5, max: 2.0 }).toFixed(1)),
  //       isActive: faker.datatype.boolean(),
  //       isPromoted: faker.datatype.boolean(0.2), // 20% chance of being promoted
  //       operatorId: operator.id, // Link to the created operator
  //     },
  //   });
  //   operatorGames.push(operatorGame);
  //   console.log(`Created operator game with id: ${operatorGame.id}`);
  // }

  // --- Create Verifications ---
  const verificationsCount = getRandomInt(5, 20)
  for (let i = 0; i < verificationsCount; i++) {
    await prisma.verification.create({
      data: {
        identifier: faker.internet.email(),
        value: faker.string.uuid(),
        expiresAt: faker.date.future(),
        createdAt: faker.date.past(),
      },
    })
    console.log(`Created verification ${i + 1}`)
  }

  // --- Create Organizations ---
  const organizationsCount = getRandomInt(3, 10)
  const organizations = []
  for (let i = 0; i < organizationsCount; i++) {
    const organization = await prisma.organization.create({
      data: {
        name: faker.company.name() + ' Org',
        slug: faker.lorem.slug() + '-org',
        logo: faker.image.url(),
        createdAt: faker.date.past(),
        // metadata: {}, // Empty JSON
      },
    })
    organizations.push(organization)
    console.log(`Created organization with id: ${organization.id}`)
  }

  // --- Create Members ---
  const membersCount = getRandomInt(10, 30)
  for (let i = 0; i < membersCount; i++) {
    const randomOrganization = getRandomElement(organizations)
    const randomUser = getRandomElement(users)
    await prisma.member.create({
      data: {
        organizationId: randomOrganization.id,
        userId: randomUser.id,
        role: getRandomElement(['admin', 'member', 'guest']),
        createdAt: faker.date.past(),
      },
    })
    console.log(
      `Created member for user ${randomUser.id} in organization ${randomOrganization.id}`,
    )
  }

  // --- Create Invitations ---
  const invitationsCount = getRandomInt(5, 20)
  for (let i = 0; i < invitationsCount; i++) {
    const randomOrganization = getRandomElement(organizations)
    const randomUser = getRandomElement(users) // The inviter
    await prisma.invitation.create({
      data: {
        organizationId: randomOrganization.id,
        email: faker.internet.email(),
        role: getRandomElement(['member', 'guest']),
        status: getRandomElement(['PENDING', 'ACCEPTED']),
        expiresAt: faker.date.future(),
        inviterId: randomUser.id,
      },
    })
    console.log(`Created invitation for organization ${randomOrganization.id}`)
  }

  // --- Create TwoFactors ---
  const twoFactorsCount = getRandomInt(5, 15)
  for (let i = 0; i < twoFactorsCount.length; i++) {
    for (const user of users) {
      const randomUser = getRandomElement(users)
      await prisma.twoFactor.create({
        data: {
          secret: faker.string.uuid(),
          backupCodes: JSON.stringify([
            faker.string.uuid(),
            faker.string.uuid(),
          ]),
          userId: user.id,
        },
      })
      console.log(`Created two-factor for user: ${randomUser.id}`)
    }
  }

  // --- Create Tournaments ---
  const tournamentsCount = getRandomInt(5, 15)
  const tournaments = []
  for (let i = 0; i < tournamentsCount; i++) {
    const startTime = faker.date.past()
    const endTime = faker.date.future({ refDate: startTime })
    const tournament = await prisma.tournament.create({
      data: {
        name: faker.lorem.words(3) + ' Tournament',
        description: faker.lorem.sentence(),
        startTime: startTime,
        endTime: endTime,
        entryFee: getRandomInt(0, 100),
        prizePool: getRandomInt(1000, 50000),
        isActive: faker.datatype.boolean(),
        operatorId: operator.id, // Link to the created operator
        leaderboard: {}, // Empty JSON
      },
    })
    tournaments.push(tournament)
    console.log(`Created tournament with id: ${tournament.id}`)
  }

  // --- Create Game Sessions ---
  const gameSessionsCount = getRandomInt(20, 100)
  const gameSessions = []
  for (let i = 0; i < gameSessionsCount; i++) {
    const randomProfile = getRandomElement(profiles)
    const randomOperatorGame = getRandomElement(games)
    console.log(randomOperatorGame)
    // Link to a random tournament if tournaments exist and randomly selected
    const tournamentId =
      tournaments.length > 0 && faker.datatype.boolean(0.6)
        ? getRandomElement(tournaments).id
        : null

    const gameSession = await prisma.gamesession.create({
      data: {
        startTime: faker.date.past(),
        endTime: faker.datatype.boolean(0.8) ? faker.date.recent() : null, // 80% chance of having an end time
        betAmount: getRandomInt(10, 1000),
        winAmount: getRandomInt(0, 2000),
        xpEarned: getRandomInt(0, 500),
        metadata: {}, // Empty JSON
        gameId: randomOperatorGame.id, // Link to an operator game
        tournamentId: tournamentId, // Link to an existing tournament or null
        active: faker.datatype.boolean(),
        profileId: randomProfile.id, // Link to a profile
      },
    })
    gameSessions.push(gameSession)
    console.log(`Created game session with id: ${gameSession.id}`)
  }

  // --- Create Chat Rooms (Modified to link to existing Game Sessions) ---
  const chatRoomsCount = getRandomInt(5, 15)
  const chatRooms = []
  for (let i = 0; i < chatRoomsCount; i++) {
    const isGameRoom = faker.datatype.boolean()
    const gameSessionId =
      isGameRoom && gameSessions.length > 0
        ? getRandomElement(gameSessions).id
        : null

    const chatRoom = await prisma.chatroom.create({
      data: {
        name: faker.lorem.words(2) + ' Chat Room',
        isGameRoom: isGameRoom,
        gameSessionId: gameSessionId, // Link to an existing game session or null
      },
    })
    chatRooms.push(chatRoom)
    console.log(`Created chat room with id: ${chatRoom.id}`)
  }

  // --- Create Friendships ---
  const friendshipsCount = getRandomInt(10, 30)
  for (let i = 0; i < friendshipsCount; i++) {
    const user1 = getRandomElement(users)
    let user2 = getRandomElement(users)
    // Ensure user1 and user2 are different
    while (user1.id === user2.id) {
      user2 = getRandomElement(users)
    }
    try {
      await prisma.friendship.create({
        data: {
          userId: user1.id,
          friendId: user2.id,
          status: getRandomElement(['PENDING', 'ACCEPTED', 'BLOCKED']),
        },
      })
      console.log(`Created friendship between ${user1.id} and ${user2.id}`)
    } catch (error) {
      // Handle unique constraint violation if friendship already exists in reverse
      if (error.code === 'P2002') {
        console.log(
          `Friendship already exists between ${user1.id} and ${user2.id}, skipping.`,
        )
      } else {
        throw error
      }
    }
  }

  // --- Create Chat Messages ---
  const chatMessagesCount = getRandomInt(50, 200)
  for (let i = 0; i < chatMessagesCount; i++) {
    const randomUser = getRandomElement(users)
    const randomChatRoom = getRandomElement(chatRooms)
    await prisma.chatmessage.create({
      data: {
        content: faker.lorem.sentence(),
        channel: getRandomElement(['LOBBY', 'GAME', 'TOURNAMENT', 'PRIVATE']),
        metadata: {}, // Empty JSON
        userId: randomUser.id, // Link to a user
        // userName: randomUser.username, // Link to a user
        roomId: randomChatRoom.id, // Link to a chat room
      },
    })
    console.log(`Created chat message ${i + 1}`)
  }

  // --- Create Products ---
  // const productsCount = getRandomInt(10, 30);
  // // for (let i = 0; i < productsCount; i++) {
  //   const name = faker.commerce.productName();
  //   await prisma.product.create({
  //     data: {
  //       name,
  //       tite: name,
  //       // Corrected: Using faker.commerce.product() instead of productAdjective and productNoun
  //       productId: faker.commerce.product() + "-" + i,
  //       price: faker.commerce.price(),
  //     },
  //   });
  //   console.log(`Created product ${i + 1}`);
  // }
  await seedProducts()

  // --- Create Notifications ---
  const notificationsCount = getRandomInt(20, 100)
  for (let i = 0; i < notificationsCount; i++) {
    const randomUser = getRandomElement(users)
    const isRead = faker.datatype.boolean(0.7) // 70% chance of being read
    await prisma.notification.create({
      data: {
        type: getRandomElement([
          'SYSTEM',
          'FRIEND_REQUEST',
          'ACHIEVEMENT',
          'BALANCE_UPDATE',
          'PROMOTIONAL',
          'TOURNAMENT',
        ]),
        title: faker.lorem.words(3),
        message: faker.lorem.sentence(),
        isRead: isRead,
        readAt: isRead ? faker.date.recent() : null,
        metadata: {}, // Empty JSON
        userId: randomUser.id, // Link to a user
      },
    })
    console.log(`Created notification for user: ${randomUser.id}`)
  }

  // --- Create Tournament Entries (Modified to prevent unique constraint violation) ---
  // Iterate through each tournament and add a random subset of users as entries
  for (const tournament of tournaments) {
    const usersForTournament = faker.helpers
      .shuffle(users)
      .slice(0, getRandomInt(1, users.length)) // Select a random subset of users

    for (const user of usersForTournament) {
      const randomProfile = getRandomElement(
        profiles.filter((p) => p.userId === user.id),
      ) // Get a profile for this user
      if (!randomProfile) continue // Skip if user has no profile

      try {
        await prisma.tournamententry.create({
          data: {
            score: getRandomInt(0, 10000),
            wagered: getRandomInt(0, 5000),
            won: getRandomInt(0, 8000),
            joinedAt: faker.date.recent(),
            userId: user.id, // Link to the user
            tournamentId: tournament.id, // Link to the current tournament
            profileId: randomProfile.id, // Link to a profile
          },
        })
        console.log(
          `Created tournament entry for user ${user.id} in tournament ${tournament.id}`,
        )
      } catch (error) {
        // Handle unique constraint violation (should be less likely with this approach)
        if (error.code === 'P2002') {
          console.log(
            `Tournament entry already exists for user ${user.id} and tournament ${tournament.id}, skipping.`,
          )
        } else {
          throw error
        }
      }
    }
  }

  // --- Create Tournament Games ---
  const tournamentGamesCount = getRandomInt(10, 30)
  for (let i = 0; i < tournamentGamesCount; i++) {
    const randomTournament = getRandomElement(tournaments)
    const randomOperatorGame = getRandomElement(games)
    try {
      await prisma.tournamentgame.create({
        data: {
          multiplier: parseFloat(
            faker.number.float({ min: 1.0, max: 5.0 }).toFixed(1),
          ),
          tournamentId: randomTournament.id, // Link to a tournament
          gameId: randomOperatorGame.id, // Link to an operator game
        },
      })
      console.log(
        `Created tournament game for tournament ${randomTournament.id} and game ${randomOperatorGame.id}`,
      )
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        console.log(
          `Tournament game already exists for tournament ${randomTournament.id} and game ${randomOperatorGame.id}, skipping.`,
        )
      } else {
        throw error
      }
    }
  }

  // --- Create Transactions ---
  const transactionsCount = getRandomInt(50, 200)
  for (let i = 0; i < transactionsCount; i++) {
    const randomProfile = getRandomElement(profiles)
    const type = getRandomElement([
      'DEPOSIT',
      'WITHDRAWAL',
      'BET',
      'WIN',
      'BONUS',
      'DONATION',
      'ADJUSTMENT',
      'TOURNAMENT_BUYIN',
      'TOURNAMENT_PRIZE',
    ])
    const isRealMoney = type === 'DEPOSIT' || type === 'WITHDRAWAL'
    const status = getRandomElement([
      'PENDING',
      'COMPLETED',
      'FAILED',
      'CANCELLED',
      'REFUNDED',
    ])

    // Find a game session that is part of a tournament if linking to a tournament
    let gameSessionId = null
    if (faker.datatype.boolean(0.6)) {
      // 60% chance of linking to a game session
      const gameSessionsInTournaments = gameSessions.filter(
        (gs) => gs.tournamentId !== null,
      )
      if (gameSessionsInTournaments.length > 0) {
        gameSessionId = getRandomElement(gameSessionsInTournaments).id
      } else {
        // If no game sessions are in tournaments, just pick a random one
        gameSessionId = getRandomElement(gameSessions).id
      }
    }

    await prisma.transaction.create({
      data: {
        type: type,
        amount: getRandomInt(1, 10000),
        reference: faker.string.uuid(),
        status: status,
        metadata: {}, // Empty JSON
        isRealMoney: isRealMoney,
        paymentMethod: isRealMoney ? faker.finance.transactionType() : null,
        paymentDetails: isRealMoney ? {} : null, // Empty JSON if real money
        processedAt: status === 'COMPLETED' ? faker.date.recent() : null,
        gameSessionId: gameSessionId, // Link to an existing game session or null
        profileId: randomProfile.id, // Link to a profile
      },
    })
    console.log(`Created transaction with id: ${i + 1}`)
  }

  // --- Create User Achievements ---
  const userAchievementsCount = getRandomInt(20, 50)
  for (let i = 0; i < userAchievementsCount; i++) {
    const randomUser = getRandomElement(users)
    const randomAchievement = getRandomElement(achievements)
    const isUnlocked = faker.datatype.boolean(0.3) // 30% chance of being unlocked

    try {
      await prisma.userachievement.create({
        data: {
          progress: isUnlocked
            ? randomAchievement.targetXp
            : getRandomInt(0, randomAchievement.targetXp - 1),
          isUnlocked: isUnlocked,
          unlockedAt: isUnlocked ? faker.date.recent() : null,
          userId: randomUser.id, // Link to a user
          achievementId: randomAchievement.id, // Link to an achievement
        },
      })
      console.log(
        `Created user achievement for user ${randomUser.id} and achievement ${randomAchievement.id}`,
      )
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        console.log(
          `User achievement already exists for user ${randomUser.id} and achievement ${randomAchievement.id}, skipping.`,
        )
      } else {
        throw error
      }
    }
  }

  // --- Create Rain History ---
  const rainHistoryCount = getRandomInt(10, 30)
  const rainHistories = []
  for (let i = 0; i < rainHistoryCount; i++) {
    const randomUser = getRandomElement(users)
    const rainHistory = await prisma.rainHistory.create({
      data: {
        userId: randomUser.id, // Link to a user
        amount: getRandomInt(100, 5000),
        rainType: getRandomElement(['chat', 'game', 'manual']),
      },
    })
    rainHistories.push(rainHistory)
    console.log(`Created rain history with id: ${rainHistory.id}`)
  }

  // --- Create Rain Bets ---
  const rainBetsCount = getRandomInt(20, 50)
  for (let i = 0; i < rainBetsCount; i++) {
    const randomRainHistory = getRandomElement(rainHistories)
    const randomUser = getRandomElement(users)
    await prisma.rainBet.create({
      data: {
        rainHistoryId: randomRainHistory.id, // Link to rain history
        userId: randomUser.id, // Link to a user
        betAmount: getRandomInt(10, 500),
        odds: getRandomInt(1, 10),
        outcome: faker.datatype.boolean(0.7)
          ? getRandomElement(['win', 'lose'])
          : null, // 70% chance of having an outcome
        settledAt: faker.datatype.boolean(0.7) ? faker.date.recent() : null, // 70% chance of being settled
      },
    })
    console.log(`Created rain bet ${i + 1}`)
  }

  // --- Create Rain Tips ---
  const rainTipsCount = getRandomInt(10, 30)
  for (let i = 0; i < rainTipsCount; i++) {
    const randomRainHistory = getRandomElement(rainHistories)
    const randomUser = getRandomElement(users)
    await prisma.rainTip.create({
      data: {
        rainHistoryId: randomRainHistory.id, // Link to rain history
        userId: randomUser.id, // Link to a user
        tipAmount: getRandomInt(10, 500),
      },
    })
    console.log(`Created rain tip ${i + 1}`)
  }

  // --- Create Rain Winners ---
  const rainWinnersCount = getRandomInt(5, 20)
  for (let i = 0; i < rainWinnersCount; i++) {
    const randomRainHistory = getRandomElement(rainHistories)
    const randomUser = getRandomElement(users)
    await prisma.rainWinner.create({
      data: {
        rainHistoryId: randomRainHistory.id, // Link to rain history
        userId: randomUser.id, // Link to a user
        wonAmount: getRandomInt(100, 2000),
      },
    })
    console.log(`Created rain winner ${i + 1}`)
  }

  console.log('Seeding finished.')
}

// module.exports = [main]
