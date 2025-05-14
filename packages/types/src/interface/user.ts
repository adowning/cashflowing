// packages/types/src/interface/user.ts

// Assuming '../index' correctly re-exports these Prisma model types
// and your custom CurrencyType if it's not directly the Prisma model.
import type {
  User as PrismaUser,
  Profile as PrismaProfile,
  VipBenefit as PrismaVipBenefit,
  Currency as PrismaCurrency,
  // BalanceType as PrismaBalance,
} from "../index"; // Adjust path if needed, e.g., to "../prisma/interfaces"

// --- Type Aliases for Readability or Branding ---
export type Email = string;
export type Username = string;

// --- Canonical UserType ---
/**
 * Represents the primary, comprehensive User object structure returned by the backend
 * upon authentication and used throughout the client (e.g., authStore.currentUser).
 * This is based on the Prisma 'User' model, potentially augmented with essential related data.
 */
export type UserType = PrismaUser & {
  // Optional: Augment with frequently needed relations if they are EAGERLY loaded
  // or if you want a consistent shape that includes them.
  // If these are loaded on-demand, they might not be part of the base UserType.
  Profile?: PrismaProfile | null; // User's profile details
  // Balances might be fetched separately or be a simplified summary here.
  // For detailed balances, use the Balance type below or GetUserBalance DTO.
  // Example: primary_balance_currency_id?: string; primary_balance_amount?: number;
};

// --- Specific DTOs for User-Related Operations ---

/**
 * DTO for client to send updates for their user profile.
 * Contains only the fields a user is allowed to modify directly.
 */
export interface UpdateUserInput {
  username?: Username;
  avatar_url?: string; // URL to the new avatar image
  first_name?: string;
  last_name?: string;
  date_of_birth?: string; // Expects ISO Date string format (YYYY-MM-DD)
  // language?: string; // Example: 'en', 'es'
  // locale?: string;   // Example: 'en-US', 'es-ES'
  // Add other fields like notification preferences, etc.
}

/**
 * DTO for client to update their email address.
 * Requires current password for verification.
 */
export interface UpdateEmailDto {
  new_email: Email;
  password_hash: string; // Current password for verification (ensure server expects 'password')
}

/**
 * DTO for client to update their cashtag (or similar payment identifier).
 * Requires current password for verification.
 */
export interface UpdateCashtagDto {
  new_cashtag: string; // The new cashtag value
  password_hash: string; // Current password for verification (ensure server expects 'password')
}

/**
 * DTO for client to change their password.
 */
export interface UpdatePasswordDto {
  current_password: string; // User's current plain text password
  new_password: string; // User's new plain text password
}

/**
 * DTO for client to set their referrer.
 */
export interface SetReferrerDto {
  referrerCode: string;
}

/**
 * DTO for client to tip another user.
 */
export interface TipUserDto {
  recipientUsername: Username;
  amount: number; // Positive value
  currency_id: string; // ID of the currency (e.g., from PrismaCurrency.id)
}

// --- DTOs for Specific User Data Retrieval Responses ---

/**
 * Detailed user profile information, potentially from a dedicated profile endpoint.
 * This might differ from the primary UserType if it includes more specific or formatted data.
 * Review and align with your actual API response for fetching detailed user profiles.
 */
export interface DetailedUserProfile {
  uid: string; // Usually matches UserType.id
  username: Username;
  avatar_url?: string | null; // Standard field name for avatar
  first_name?: string | null;
  last_name?: string | null;
  // id?: number | string; // If this is a different ID system, clarify. User.id should be the primary.
  // id_number?: string | null; // Example: National ID, if collected
  email: Email;
  is_email_confirmed: boolean; // Corrected typo, standard boolean
  phone?: string | null;
  is_phone_confirmed: boolean; // Corrected typo, standard boolean
  date_of_birth?: string | null; // ISO Date string (YYYY-MM-DD)
  country?: string | null; // Corrected from 'county'
  state?: string | null;
  city?: string | null;
  address?: string | null;
  postal_code?: string | null;
  language?: string | null; // e.g., 'en'
  locale?: string | null; // e.g., 'en-US'
  is_initial_profile_complete: boolean;
  is_suspended: boolean; // Standard boolean
  // sys_communications?: boolean; // Notification preferences might be part of UpdateUserInput
  // locked_personal_info_fields?: string[]; // Fields that user cannot change
  created_at: string; // ISO Date string
  // Include fields from PrismaProfile if they are part of this detailed view
}

/**
 * Response structure when fetching detailed user information.
 */
export interface GetDetailedUserProfileResponse {
  // Consider if 'code' and 'message' are standard for all your API responses.
  // If so, a generic wrapper type might be useful.
  // code: number;
  // message?: string;
  user_profile: DetailedUserProfile; // The detailed profile data
}

/**
 * Represents a User's Balance for a specific currency.
 * Based on the Prisma 'Balance' model.
 */
export interface BalanceType {
  // You can augment PrismaBalance if needed, e.g., with the Currency object
  Currency?: PrismaCurrency;
}
// Or if you need a more specific structure for client display:
export interface UserBalanceDetails {
  currency_id: string; // e.g., "USD", "BTC"
  currency_name: string;
  currency_symbol: string;
  total_amount: string; // Using string for precision (e.g., from Decimal.js)
  available_balance: string; // Using string for precision
  real_balance: string; // Using string for precision
  bonus_balance: string; // Using string for precision
}

// --- VIP Related User Types ---
/**
 * DTO representing the user's detailed VIP status and benefits.
 */
export interface UserVipStatus {
  level: number;
  currentLevelName: string;
  currentPoints: number; // Current VIP XP or points
  pointsToNextLevel?: number; // Points required to enter the next VIP level (total for that level)
  // Or could be 'pointsRemainingForNextLevel'
  nextLevel?: number; // The number of the next VIP level (if one exists)
  nextLevelName?: string;
  progressPercentage?: number; // Percentage towards the next level (0-100)
  benefits: PrismaVipBenefit[]; // List of VipBenefit objects for the current level
}

// --- Real-time Update Types (Keep if used for WebSockets) ---
export interface ProfileStatsUpdateData {
  balance: string; // Use string for currency precision
  createdAt: string; // ISO Date string
  currency_id: string; // e.g., "USD"
  id: string; // Profile ID?
  isActive: boolean;
  lastPlayed: string; // ISO Date string
  // phpId?: number; // If legacy, consider phasing out
  // shopId?: string; // If relevant
  updatedAt?: string | null; // ISO Date string
  user_id: string;
  xpEarned: number;
}

export interface UserStatsUpdateData {
  // This seems general. Consider if it should be tied to a specific currency
  // or if it's an aggregate value.
  balance_cash_change?: string; // Change in real balance (string for precision)
  balance_bonus_change?: string; // Change in bonus balance (string for precision)
  total_xp_change?: number; // Change in XP
  // Include currency_id if balance changes are per currency
}

export interface StatsUpdate {
  table: "User" | "Profile" | "Balance" | string; // Be more specific with table names if possible
  row_id: string; // ID of the affected row
  operation: "UPDATE" | "INSERT" | "DELETE";
  // Use a more specific type for 'data' based on the 'table' and 'operation'
  // This helps in type-safe handling of the data on the client.
  // Example:
  // data:
  //   | ({ table: "User" } & Partial<UserType>)
  //   | ({ table: "Profile" } & Partial<PrismaProfile>)
  //   | ({ table: "Balance" } & Partial<BalanceType>);
  data: Partial<
    | UserStatsUpdateData
    | ProfileStatsUpdateData
    | UserType
    | PrismaProfile
    | BalanceType
  >;
  event_id?: string; // Unique event identifier
}
// import { CurrencyType, Profile, User, VipBenefit } from "../index";

// export interface GetUserInfo {
//   uid: string;
//   username: string;
//   avatar: string;
//   first_name: string;
//   last_name: string;
//   id: number | string;
//   id_number: string;
//   email: string;
//   email_confirmd: boolean;
//   phone: string;
//   phone_confirmd: boolean;
//   date_of_birth: string;
//   county: string;
//   state: string;
//   city: string;
//   address: string;
//   postal_code: string;
//   language: string;
//   locale: string;
//   initial_profile_complete: boolean;
//   is_supended: number;
//   sys_communications: boolean;
//   locked_personal_info_fields: Array<string>;
//   create_at: number;
// }
// export interface GetUserAmount {
//   amount: number;
//   currency: {
//     fiat: true;
//     name: string;
//     symbol: string;
//     type: string;
//   };
//   withdraw: number;
//   rate: number;
// }
// export interface UpdateEmail {
//   email: string;
//   password: string;
// }
// export interface UpdateCashtag {
//   cashtag: string;
//   password: string;
// }
// export interface UpdatePassword {
//   now_password: string;
//   new_password: string;
// }
// export interface GetUserBalance {
//   amount: number;
//   currency: string;
//   availabe_balance: number;
//   real: number | string;
//   bonus: number | string;
// }
// export interface UpdateSuspendUser {
//   time: number;
// }
// export type GetUserInfoResponseData = {
//   code: number;
//   user: Partial<User>;
//   profile: Partial<Profile>;
//   // message: string;
// };
// export type GetUserBalanceResponseData = {
//   code: number;
//   data: GetUserBalance;
//   message: string;
// };
// export type GetUserEmailVerifyResponseData = {
//   code: number;
//   time: number;
//   message: string;
// };
// export type GetUserAmountResponseData = {
//   code: number;
//   data: GetUserAmount;
//   message: string;
// };

// export type ProfileStatsUpdateData = {
//   balance: number;
//   createdAt: Date;
//   currency: "USD";
//   id: string;
//   isActive: boolean;
//   lastPlayed: Date;
//   phpId: number;
//   shopId: string;
//   updatedAt: string | null;
//   userId: string;
//   xpEarned: number;
// };

// export type UserStatsUpdateData = {
//   balance: number;
//   totalXp: number;
// };

// export type StatsUpdate = {
//   table: string;
//   table_name: string;
//   row_id: string;
//   operation: "UPDATE" | "INSERT" | "DELETE";
//   data: UserStatsUpdateData | ProfileStatsUpdateData;
//   event_id: number;
// };
// // You would typically place these in relevant files within your @cashflow/types package
// // e.g., auth.interface.ts, user.interface.ts, vip.interface.ts, etc.
// // Ensure that types like 'User', 'Currency', 'Game' (Prisma models) are properly exported
// // from your @cashflow/types package, potentially aliased (e.g., User as UserType).

// // For example, you might have in your main types export (e.g., packages/types/src/index.ts):
// // export type { User as UserType, Currency as CurrencyType, Game as GameType } from './prisma/interfaces';
// // Assuming 'Email' and 'Username' are branded string types or simple strings:
// type Email = string;
// type Username = string;

// // --- Prisma Model Based Types (Illustrative Structures) ---
// // These interfaces are representative of what your Prisma models might look like.
// // You would typically import these directly from your Prisma client generation or your re-export file.

// /**
//  * Represents a User. Based on the Prisma 'User' model.
//  */
// export interface UserType {
//   id: string;
//   email: Email;
//   username?: Username | null;
//   password_hash?: string | null; // Usually not sent to client
//   is_email_verified: boolean;
//   email_verified_at?: Date | null;
//   avatar_url?: string | null;
//   referral_code: string;
//   referred_by_id?: string | null;
//   balance_cash: number; // Consider using a Decimal library for precision if needed
//   balance_bonus: number; // Consider using a Decimal library for precision if needed
//   total_deposited: number;
//   total_withdrawn: number;
//   total_wagered: number;
//   total_won: number;
//   vip_level: number;
//   vip_progress: number; // This could be XP points
//   last_login_at?: Date | null;
//   is_banned: boolean;
//   ban_reason?: string | null;
//   banned_at?: Date | null;
//   roles: string[]; // e.g., ['USER', 'ADMIN']
//   created_at: Date;
//   updated_at: Date;
//   // Include any other relevant fields from your User model
// }

// /**
//  * Represents a User's Balance for a specific currency.
//  * Based on the Prisma 'Balance' model.
//  */
// export interface Balance {
//   id: string;
//   user_id: string;
//   currency_id: string;
//   balance_cash: number; // Consider using a Decimal library for precision
//   balance_bonus: number; // Consider using a Decimal library for precision
//   created_at: Date;
//   updated_at: Date;
//   user?: UserType; // Optional relation
//   currency?: CurrencyType; // Optional relation
// }

// /**
//  * DTO for updating user information.
//  * This should contain only the fields a user is allowed to modify.
//  * Based on your `packages/types/src/interface/user.ts` `UpdateUserInput`
//  * and server's `updateUserSchema`.
//  */
// export interface UpdateUserInput {
//   username?: Username;
//   avatar_url?: string; // If user can set avatar via URL
//   // Add other fields that are updatable by the user,
//   // e.g., profile settings, notification preferences.
//   // Make sure these align with what your server endpoint accepts.
// }

// /**
//  * DTO for setting a referrer for a user.
//  */
// export interface SetReferrerDto {
//   referrerCode: string;
// }

// /**
//  * DTO for tipping another user.
//  */
// export interface TipUserDto {
//   recipientUsername: Username;
//   amount: number; // Should be positive
//   currency_id: string; // ID of the currency being tipped
// }

// /**
//  * DTO representing the user's VIP status.
//  * Based on `packages/types/src/interface/vip.ts`.
//  */
// export interface UserVipStatus {
//   level: number;
//   currentPoints: number; // Current VIP XP or points
//   pointsToNextLevel: number; // Points needed to reach the next level from 0 (or from start of current level)
//   // Or, this could be 'pointsRemainingToNextLevel'
//   nextLevel?: number; // The number of the next level
//   progressPercentage: number; // Percentage towards the next level (0-100)
//   currentLevelName: string;
//   nextLevelName?: string;
//   benefits: VipBenefit[]; // A list of currently unlocked and active benefits for the user.
//   // Or could be string descriptions as per your original type.
//   // Using VipBenefit[] is more structured.
//   // Consider adding:
//   // xpForCurrentLevelStart?: number; // XP required to enter the current level
//   // xpForNextLevelStart?: number; // XP required to enter the next level
// }
