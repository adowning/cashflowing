// This file will export types and interfaces shared between client and server.
// Based on your provided repo-shared.xml and repo-server.xml (prisma/schema.prisma)
export * from "./prisma/interfaces";
export * from "./interface/index";
export * from "./auth.interface";
export * from "./auth.socket-interface";
export * from "./routes";
import {
  User as IUser,
  Operator,
  GameSession,
  Tournamententry,
  VipInfo,
} from "./prisma/interfaces";

export type User = Partial<IUser> & {
  id: string;
  content: string;
  userId: string;
  balance: number;
  roomId?: string | null;
  currentProfile: Partial<IProfile>;
  channel: ChatChannel;
  createdAt: Date;
  user?: Partial<User>; // Optional: include user details
  vipInfo: VipInfo;
};

export const BASE_PATH = "/api";
// Enums from Prisma
export type ChatChannel = "LOBBY" | "GAME" | "TOURNAMENT" | "PRIVATE";
export type FriendshipStatus = "PENDING" | "ACCEPTED" | "BLOCKED";
export type Gender =
  | "BOY"
  | "GIRL"
  | "ALIEN"
  | "UNSURE"
  | "ROBOT"
  | "COMPLICATED";
export type NotificationType =
  | "SYSTEM"
  | "FRIEND_REQUEST"
  | "ACHIEVEMENT"
  | "BALANCE_UPDATE"
  | "PROMOTIONAL"
  | "TOURNAMENT";
export type TransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "EXPIRED"
  | "REJECTED";
export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "BET"
  | "WIN"
  | "BONUS"
  | "DONATION"
  | "ADJUSTMENT"
  | "TOURNAMENT_BUYIN"
  | "TOURNAMENT_PRIZE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "ONLINE" | "OFFLINE";
export type GameCategory = "TABLE" | "FISH" | "POKER" | "SLOTS" | "OTHER";

// Interfaces based on Prisma models (simplified for brevity, expand as needed)

export interface IProfile {
  id: string;
  userId: string;
  balance: number; // Consider Decimal
  xpEarned: number;
  currency: string;
  shopId: string;
  operator?: Operator | null;
  userProfileUseridtouser?: User | null;
  phpId: string;
  gamesession: GameSession[];
  tournamententry: Tournamententry[];
  transactions: Transaction[];
  // Add other relevant fields
}

export interface Game {
  id: string;
  name: string;
  title: string;
  developer?: string | null;
  category?: GameCategory;
  // Add other relevant fields
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // Consider Decimal
  status: TransactionStatus;
  profileId: string;
  // Add other relevant fields
}

// Suggested location: packages/types/src/index.ts or a common types file like common.interface.ts
/**
 * Generic interface for paginated API responses.
 * @template T The type of the items in the paginated list.
 */
export interface PaginatedResponse<T> {
  /**
   * Array of items for the current page.
   */
  items: T[];

  /**
   * Total number of items available across all pages.
   */
  total: number;

  /**
   * The current page number (usually 1-indexed).
   * Optional, but highly recommended for pagination controls.
   */
  page?: number;

  /**
   * The number of items per page.
   * Optional, but highly recommended.
   */
  limit?: number;

  /**
   * Total number of pages.
   * Optional, can be calculated if 'total' and 'limit' are present.
   */
  totalPages?: number;

  /**
   * Indicates if there is a next page.
   * Optional, can be calculated.
   */
  hasNextPage?: boolean;

  /**
   * Indicates if there is a previous page.
   * Optional, can be calculated.
   */
  hasPrevPage?: boolean;
}
// Placeholder for other types you might have
export type GenericApiResponse<T = any> = {
  code: number;
  data: T;
  message: string;
};
// export interface ClientLoginPayload {
//   email: string;
//   password_hash: string;
// } // If server route expects 'password_hash' and you send plain text in this field.
// // OR, more likely and correctly:
// export interface ClientLoginPayload {
//   email: string;
//   password_hash: string;
// } // Field name 'password_hash' in DTO, but it carries the plain password.
