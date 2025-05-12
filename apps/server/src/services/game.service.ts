// import { db } from ""; // Assuming Prisma client path
import {
  GameBigWinData,
  GameBigWinItem,
  GameCategory,
  GameEnterBody,
  GameEnterResponse,
  GameHistoryItem,
  GameHistoryResponse,
  GameListResponse,
  GameSearchResponse,
  GameUserBody,
  GetGameBigWinResponse,
  GetGameCategoriesResponse,
  GetGameEnterResponse,
  GetGameFavoriteListResponse,
  GetGameHistoryResponse,
  GetGameSearchResponse,
  Search,
  User,
} from "@cashflow/types";
import { HonoRequest } from "hono";
// Helper function to get a random element from an array
// const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
import db from "@cashflow/db";
import { faker } from "@faker-js/faker";

// Helper function to get a random number within a range
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export async function getGameList(req: HonoRequest) {
  const games = await db.game.findMany({
    where: { isActive: true },
  });

  // const list: Game = {
  //   id: "",
  //   name: "",
  //   title: "",
  //   temperature: null,
  //   developer: null,
  //   vipLevel: null,
  //   isActive: null,
  //   device: null,
  //   featured: null,
  //   gamebank: null,
  //   bet: null,
  //   denomination: null,
  //   categoryTemp: null,
  //   originalId: null,
  //   bids: null,
  //   statIn: null,
  //   statOut: null,
  //   currentRtp: null,
  //   rtpStatIn: null,
  //   rtpStatOut: null,
  //   standardRtp: null,
  //   popularity: null,
  //   chanceFirepot1: null,
  //   chanceFirepot2: null,
  //   chanceFirepot3: null,
  //   fireCount1: null,
  //   fireCount2: null,
  //   fireCount3: null,
  //   linesPercentConfigSpin: null,
  //   linesPercentConfigSpinBonus: null,
  //   linesPercentConfigBonus: null,
  //   linesPercentConfigBonusBonus: null,
  //   rezerv: null,
  //   cask: null,
  //   advanced: null,
  //   scaleMode: "",
  //   slotViewState: "",
  //   view: null,
  //   categoryId: null,
  //   operatorId: null,
  //   developerId: null,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   jackpotGroupId: null,
  //   active: false,
  //   password: null,
  //   operator: null
  // };

  const response: GameListResponse = {
    code: 200,
    list: games,
    total: games.length,
  };

  return new Response(JSON.stringify(response));
}

/**
 * Handles fetching game categories.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameGameCategory(req: HonoRequest): Promise<Response> {
  try {
    // Extract query parameters if needed (e.g., type=developers)
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    let categories: GameCategory[] = [];

    if (type === "developers") {
      // Fetch operators (acting as developers in this context based on schema)
      const operators = await db.operator.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      });

      // categories = operators.map((operator) => ({
      //   image: operator.logo || '',
      //   pictures: operator.logo || '', // Using logo for pictures as well
      //   game_count: 0, // We don't have game count per operator easily here
      //   name: operator.name,
      //   slug: operator.slug,
      //   games: [], // Games are not included in this category list
      //   page_no: 1, // Assuming a single page for developers
      // }))
    } else {
      // Fetch distinct game banks or categories from the Game model
      // This is a simplified approach; a dedicated GameCategory model would be better
      const distinctGameBanks = await db.game.findMany({
        select: { gamebank: true },
        distinct: ["gamebank"],
        where: { active: true },
      });

      const banks = distinctGameBanks.map((game) => ({
        image: "", // No specific image for these categories
        pictures: "",
        game_count: 0, // Need to implement logic to count games per bank
        name: game.gamebank || "Unknown",
        slug: game.gamebank || "unknown",
        games: [], // Games are not included in this category list
        page_no: 1, // Assuming a single page
      }));
    }

    const response: GetGameCategoriesResponse = {
      code: 200,
      data: categories,
      messsage: "Game categories retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching game categories:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles searching for games.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameSearch(req: HonoRequest): Promise<Response> {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("q") || ""; // Get search term from query params
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    // Search for games by name or title
    const gamesessions = await db.gameSession.findMany();

    const games = await db.game.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { title: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        // Assuming 'image' field exists or can be derived
        // For now, using a placeholder
        // image: true,
        developer: true, // Using developer as developer for now
        denomination: true, // Assuming is_demo can be derived from denomination or a specific field
      },
      take: limit,
      skip: offset,
    });
    const totalGames = await db.game.count({
      where: {
        active: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { title: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    });

    const searchResults: Search[] = games.map((game) => ({
      id: game.id, // Using game.id as the ID
      name: game.name,
      image: `/images/${game.developer}/${game.name}.webp`, // Placeholder for image
      developer: game.developer || "Unknown", // Using developer as developer
      is_demo: game.denomination === 0, // Assuming 0 denomination means demo
    }));

    const responseData: GameSearchResponse = {
      list: searchResults,
      total: totalGames,
    };

    const response: GetGameSearchResponse = {
      code: 200,
      data: responseData,
      message: "Game search results retrieved successfully",
    };
    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error searching games:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles entering a game.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameEnter(
  req: HonoRequest,
  user: Partial<User>
): Promise<Response> {
  try {
    const body: GameEnterBody = await req.json();
    const gameId = Array.isArray(body.id) ? body.id[0] : body.id; // Handle single ID or array
    const isDemo = body.demo || false;

    // Fetch game details
    const game = await db.game.findUnique({
      where: { id: gameId },
      select: {
        id: true,
        name: true,
        operatorId: true,
        // Add other fields needed for game entry if available in schema
      },
    });

    if (!game) {
      return new Response(
        JSON.stringify({ message: "Game not found", code: 404 }),
        { status: 404 }
      );
    }

    // Here you would typically interact with a game developer's API
    // to get the actual game entry URL and parameters.
    // This is a placeholder implementation.

    const gameEnterData: GameEnterResponse = {
      method: "GET", // Or POST, depending on the developer
      parames: "", // Parameters for the game launch
      developer: game.operatorId || "unknown", // Using operatorId as developer identifier
      reserve: faker.string.uuid(), // Placeholder for a session token or similar
      weburl: `https://example.com/launchgame?gameId=${game.id}&demo=${isDemo}&userId=${user.id}`, // Placeholder URL
    };

    const response: GetGameEnterResponse = {
      code: 200,
      data: gameEnterData,
      message: "Game entry data retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error entering game:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles fetching user's games (potentially based on category or filters).
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameUserGame(req: HonoRequest): Promise<Response> {
  try {
    const body: GameUserBody = await req.json();
    const categorySlug = body.game_categories_slug;
    const page = body.page || 1;
    const limit = body.limit || 20;
    const offset = (page - 1) * limit;

    // Fetch games based on category slug (assuming category slug maps to gamebank or operator slug)
    // This logic might need refinement based on how categories are structured
    const games = await db.game.findMany({
      where: {
        active: true,
        OR: [{ gamebank: categorySlug }, { operator: { slug: categorySlug } }],
      },
      select: {
        id: true,
        name: true,
        // image: true, // Placeholder
        developer: true, // Using developer as developer
        denomination: true, // Assuming is_demo can be derived
      },
      take: limit,
      skip: offset,
    });

    const totalGames = await db.game.count({
      where: {
        active: true,
        OR: [{ gamebank: categorySlug }, { operator: { slug: categorySlug } }],
      },
    });

    const userGames: Search[] = games.map((game) => ({
      id: game.id, // Using game.id as the ID
      name: game.name,
      image: "", // Placeholder for image
      developer: game.developer || "Unknown", // Using developer as developer
      is_demo: game.denomination === 0, // Assuming 0 denomination means demo
    }));

    const responseData: GameSearchResponse = {
      list: userGames as Array<Search>,
      total: totalGames,
    };

    const response: GetGameSearchResponse = {
      code: 200,
      data: responseData,
      message: "User games retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching user games:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles favoriting/unfavoriting a game.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameFavoriteGame(
  req: HonoRequest,
  user: Partial<User>
): Promise<Response> {
  try {
    const body = await req.json();
    const gameId = body.gameId; // Assuming gameId is provided in the body
    const isFavorite = body.isFavorite; // Assuming isFavorite (boolean) is provided

    // You would typically have a many-to-many relationship between User and Game
    // for favorites, or a dedicated UserFavoriteGame model.
    // Since that's not explicitly in the provided schema, this is a placeholder.
    // You might need to adjust this based on your actual favorite game implementation.

    // Placeholder logic: Just acknowledge the request
    console.log(
      `User ${user.id} is trying to set game ${gameId} as favorite: ${isFavorite}`
    );

    // Assuming a simple success response is sufficient based on store action
    const response = {
      code: 200,
      message: "Favorite game status updated",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error updating favorite game status:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles fetching a user's favorite game list.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameFavoriteGameList(
  req: HonoRequest
): Promise<Response> {
  try {
    // Fetch the user's favorite games.
    // This requires a mechanism to store user favorites, which is not explicit
    // in the provided schema. Assuming a relationship or a separate model exists.
    // Placeholder: Returning an empty list or some dummy data

    const favoriteGameIds: (number | string)[] = []; // Placeholder for favorite game IDs
    // Example: Fetching favorite game IDs if a relation existed:
    // const userWithFavorites = await db.user.findUnique({
    //   where: { id: user.id },
    //   include: { favoriteGames: { select: { gameId: true } } },
    // });
    // if (userWithFavorites?.favoriteGames) {
    //   favoriteGameIds = userWithFavorites.favoriteGames.map(fav => fav.gameId);
    // }

    const response: GetGameFavoriteListResponse = {
      code: 200,
      data: favoriteGameIds,
      message: "Favorite game list retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching favorite game list:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles fetching game history for a user.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameHistory(
  req: HonoRequest,
  user: Partial<User>
): Promise<Response> {
  try {
    const body = await req.json();
    const page = body.page || 1;
    const limit = body.limit || 20;
    const offset = (page - 1) * limit;

    // Fetch game sessions for the user's active profile
    const gameSessions = await db.gamesession.findMany({
      where: { profileId: user.activeProfile?.id },
      include: {
        game: {
          select: { name: true }, // Include game name from operatorgame
        },
      },
      orderBy: { startTime: "desc" }, // Order by most recent
      take: limit,
      skip: offset,
    });

    const totalGameSessions = await db.gamesession.count({
      where: { profileId: user.activeProfile?.id },
    });

    const gameHistoryRecords: GameHistoryItem[] = gameSessions.map(
      (session: any) => ({
        name: session.game?.name || "Unknown Game", // Use game name
        created_at: session.startTime.getTime(), // Convert Date to timestamp
        amount: session.betAmount?.toString() || "0", // Bet amount
        multiplier:
          session.winAmount && session.betAmount
            ? (session.winAmount / session.betAmount).toFixed(2)
            : "0", // Calculate multiplier
        bet_id: session.id, // Using game session ID as bet ID
        status: session.endTime ? "Completed" : "In Progress", // Simple status
        profit: session.winAmount || 0 - (session.betAmount || 0), // Calculate profit
      })
    );

    const responseData: GameHistoryResponse = {
      total_pages: Math.ceil(totalGameSessions / limit),
      record: gameHistoryRecords,
    };

    const response: GetGameHistoryResponse = {
      code: 200,
      data: responseData,
      message: "Game history retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching game history:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles fetching big win data (high rollers and lucky bets).
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameBigWin(req: HonoRequest): Promise<Response> {
  try {
    // Fetch game sessions with significant wins.
    // This is a simplified implementation. "Big Win" logic might be more complex.

    // Fetch some recent game sessions with high win amounts relative to bet
    const bigWinSessions = await db.gameSession.findMany({
      where: {
        winAmount: { gt: 0 }, // Only sessions with wins
        betAmount: { gt: 0 }, // Avoid division by zero
        // Add conditions for "big" wins, e.g., winAmount > threshold or multiplier > threshold
      },
      include: {
        game: {
          select: { name: true },
        },
        profile: {
          include: {
            userProfileUseridtouser: {
              // Assuming this is the relation back to User
              select: { username: true },
            },
          },
        },
      },
      orderBy: { winAmount: "desc" }, // Order by win amount (simplified)
      take: 20, // Get top 20 for example
    });

    const bigWinItems: GameBigWinItem[] = bigWinSessions.map((session) => {
      const _developer = session.game.name.substring(
        session.game.name.toLocaleLowerCase().length,
        session.game.name.toLowerCase().length - 3
      );
      // if (_developer.toLowerCase() !== "rtg") console.log(_developer.toLowerCase());
      let developer;
      // switch (_developer.toLowerCase()) {
      //   case "net":
      //     developer = "netent";
      //   case "nlc":
      //     developer = "nolimit";
      //   case "rtg":
      //     developer = "redtiger";
      // }
      if (_developer.toLowerCase().includes("ng")) developer = "netgame";
      if (_developer.toLowerCase().includes("net")) developer = "netent";
      if (_developer.toLowerCase().includes("rtg")) developer = "redtiger";
      if (_developer.toLowerCase().includes("nlc")) developer = "nolimit";
      if (_developer.toLowerCase().includes("bfg")) developer = "bigfish";
      // if (developer !== "redtiger") console.log(developer);
      let username = session.profile?.userProfileUseridtouser?.username;
      if (username.length > 6) username = username.substring(0, 6) + "..";

      return {
        game_id: session.gameId,
        game_name: session.game?.name || "Unknown Game",
        game_icon: `/images/games/${developer}/${session.game.name.toLowerCase()}.avif`, // Placeholder for game icon
        user_name: username || "Anonymous",
        user_vip_group: 0, // Placeholder
        user_vip_level: 0, // Placeholder
        bet_amount: session.betAmount?.toString() || "0",
        multiplier:
          session.winAmount && session.betAmount
            ? (session.winAmount / session.betAmount).toFixed(2)
            : "0",
        win_amount: session.winAmount?.toString() || "0",
        time: session.startTime.getTime(), // Timestamp
      };
    });

    const responseData: GameBigWinData = {
      high_rollers: bigWinItems, // Using the same list for simplicity
      lucky_bets: bigWinItems, // Using the same list for simplicity
    };

    const response: GetGameBigWinResponse = {
      code: 200,
      data: responseData,
      message: "Big win data retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching big win data:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles fetching data for a user's spin page.
 * This is a placeholder and needs implementation based on actual "spin page" logic.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameSpinPage(req: HonoRequest): Promise<Response> {
  try {
    // Placeholder logic for spin page data
    const spinPageData = {
      // Add data relevant to a spin page, e.g., spin count, rewards, etc.
      spinCount: getRandomInt(0, 10),
      lastSpinTime: faker.date.recent().getTime(),
      availableRewards: ["Bonus Cash", "Free Spins", "XP Boost"],
    };

    const response = {
      code: 200,
      data: spinPageData,
      message: "Spin page data retrieved successfully",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error fetching spin page data:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

/**
 * Handles a user performing a spin action.
 * This is a placeholder and needs implementation based on actual "spin" logic.
 * @param req HonoRequest
 * @returns Response
 */
export async function getGameSpin(req: HonoRequest): Promise<Response> {
  try {
    // Placeholder logic for performing a spin
    // Deduct spin cost from user balance/spin count, determine reward, update user record, etc.

    const spinResult = {
      // Add data representing the result of the spin, e.g., win amount, reward type, etc.
      winAmount: faker.datatype.boolean(0.3) ? getRandomInt(100, 1000) : 0, // 30% chance of winning
      rewardType: faker.datatype.boolean(0.5) ? "Bonus Cash" : "Nothing",
      message: "You spun the wheel!",
    };

    const response = {
      code: 200,
      data: spinResult,
      message: "Spin action completed",
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error performing spin action:", error);
    return new Response(
      JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }),
      {
        status: 500,
      }
    );
  }
}

// export async function gameRoutes(req: HonoRequest, route: string, params: string) {
//   try {
//     const user = await getUserFromHeader(req);
//     if (route === NETWORK_CONFIG.WEB_SOCKET.SOCKET_CONNECT) return false;

//     if (!user || !user.activeProfile) {
//       return new Response(
//         JSON.stringify({
//           code: 401,
//           message: "Unauthorized",
//           data: { total_pages: 0, record: [] },
//         }),
//         { status: 401 }
//       );
//     }
//     switch (route) {
//       case NETWORK_CONFIG.GAME_INFO.GAME_LIST:
//         return await getGameList(req);
//       case NETWORK_CONFIG.GAME_INFO.GAME_CATEGORY:
//         return await getGameGameCategory(req);
//       case NETWORK_CONFIG.GAME_INFO.GAME_SEARCH:
//         return await getGameSearch(req);
//       case NETWORK_CONFIG.GAME_INFO.GAME_ENTER:
//         return await getGameEnter(req, Partial<User>);
//       case NETWORK_CONFIG.GAME_INFO.USER_GAME:
//         return await getGameUserGame(req);
//       case NETWORK_CONFIG.GAME_INFO.FAVORITE_GAME:
//         return await getGameFavoriteGame(req, Partial<User>);
//       case NETWORK_CONFIG.GAME_INFO.FAVORITE_GAME_LIST:
//         return await getGameFavoriteGameList(req);
//       case NETWORK_CONFIG.GAME_INFO.GAME_HISTORY:
//         return await getGameHistory(req, Partial<User>);
//       case NETWORK_CONFIG.GAME_INFO.GAME_BIGWIN:
//         return await getGameBigWin(req);
//       case NETWORK_CONFIG.GAME_INFO.SPIN:
//         return await getGameSpin(req);
//       case NETWORK_CONFIG.GAME_INFO.SPINPAGE:
//         return await getGameSpinPage(req);
//       default:
//         return false;
//     }
//   } catch (error) {
//     console.error("Error in gameRoutes:", error);
//     return new Response(JSON.stringify({ message: `Internal server error: ${error}`, code: 500 }), {
//       status: 500,
//     });
//   }
// }
