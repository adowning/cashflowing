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

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  roomId?: string | null;
  channel: ChatChannel;
  createdAt: Date;
  user?: Partial<User>; // Optional: include user details
}

// Specific interface from shared/interface/chat.ts
export interface ChatMessagePayload {
  type?: string; // 'new_message', 'user_join', 'user_leave', etc.
  content: string;
  roomId?: string;
  userId?: string;
  username?: string;
  timestamp?: string;
}

// Add other interfaces from your 'shared/interface/*.ts' files as needed
// Example:
// export interface GetUserData {
//   id: string;
//   avatar: string;
//   name: string;
//   grade_level: string;
//   grade: string;
//   wallet: number | string;
//   currency: string;
// }

// Placeholder for other types you might have
export type GenericApiResponse<T = any> = {
  code: number;
  data: T;
  message: string;
};
