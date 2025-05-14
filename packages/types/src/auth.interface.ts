// packages/types/src/auth.interface.ts

// Assuming UserType will be defined in './interface/user.ts' and represents the
// primary user object structure returned by the backend upon authentication.
import type { UserType } from "./interface/user";

// --- Core DTOs for Hono JWT Authentication ---

/**
 * Credentials for password-based login and registration.
 * The 'password' field should contain the plain text password sent from the client.
 */
export interface AuthCredentials {
  email: string;
  password_hash: string; // Ensure this matches the field name expected by your server's Zod schema
}

/**
 * Payload for user registration.
 * Ensure field names match server's Zod schema for registration.
 */
export interface RegisterPayload extends AuthCredentials {
  username: string;
  // Add any other fields required for registration (e.g., referral_code_optional?: string)
}

/**
 * Response DTO after successful authentication (login or register).
 */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string; // Optional: string | undefined
  user: UserType; // The primary, comprehensive user object
}

/**
 * DTO for refreshing an access token.
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * DTO for signing in with a Google ID Token.
 */
export interface GoogleSignInDto {
  idToken: string;
}

// --- Optional: WebSocket Related Auth Types (Keep if actively used) ---

/**
 * Simple state for UI flags.
 */
export interface AuthenticatedState {
  loggedIn: boolean;
}

/**
 * Defines the structure of WebSocket messages related to authentication events.
 * These events would typically push updated user or session information.
 */
export type AuthWebSocketEventType =
  | "AUTH_STATE_CHANGE" // Could push a new AuthResponseDto.user or a simplified session object
  | "USER_UPDATED" // Could push an updated UserType or specific changed fields
  | "PROFILE_UPDATED"; // Could push an updated ProfileType or specific changed fields

/**
 * A generic structure for WebSocket messages related to authentication.
 * The payload type should be more specific based on the AuthWebSocketEventType.
 */
export interface AuthWebSocketMessage {
  type: AuthWebSocketEventType;
  // Example: payload could be `UserType | Partial<UserType> | { error: string }`
  // Be more specific based on what each event type actually sends.
  payload: any;
}

// --- To Be Reviewed & Potentially Removed (If Legacy/Unused with Hono Backend) ---
// The following types (ClientAuthUser, ClientSession, ApiAuthError) seem related to
// a previous auth system (e.g., Supabase direct or better-auth).
// If your Hono backend has a different error structure or session concept,
// define those new types instead and remove these.

/*
export interface ClientAuthUser {
  id: string;
  email: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  activeProfileId?: string | null;
}

export interface ClientSession {
  code: number;
  user: ClientAuthUser | null;
  token: string | null;
  expiresAt?: number;
}

// If your Hono API has a standard error response, define it here.
// For example:
// export interface HonoApiError {
//   statusCode: number;
//   error: string; // e.g., "Bad Request", "Unauthorized"
//   message: string; // Detailed error message
//   validationErrors?: { field: string, message: string }[];
// }
// Then, the ApiError class in apiClient.ts can use this for its 'data' property.
export interface ApiAuthError { // This is the old one. Replace or remove.
  message: string;
  code?: string | number;
  details?: any;
}
*/

// // packages/types/src/auth.interfaces.ts (or similar)

// import { UserType } from "./interface/user";
// import { Profile } from "./prisma/interfaces";

// export interface AuthenticatedState {
//   loggedIn: boolean;
// }

// /**
//  * Defines the structure of WebSocket messages related to authentication.
//  */
// export type AuthWebSocketEventType =
//   | "AUTH_STATE_CHANGE" // Generic event that pushes the new session state
//   | "USER_UPDATED"
//   | "PROFILE_UPDATED"; // Add more as needed

// // You'll also continue to use UserData and ProfileData from your stores/types
// // import type { UserData, ProfileData } from './user.interfaces'; // or wherever they are defined
// // packages/types/src/auth.interfaces.ts (or similar)

// // import { Profile } from "./prisma/interfaces";

// export interface AuthenticatedState {
//   loggedIn: boolean;
// }

// // Credentials for password-based login
// export interface AuthCredentials {
//   email: string;
//   password: string; // Password might be optional if using passwordless or social
// }

// export interface AuthResponseDto {
//   accessToken: string;
//   refreshToken?: string; // This '?' makes it string | undefined
//   user: UserType; // This should be your UserType
// }

// export interface RefreshTokenDto {
//   refreshToken: string;
// }

// export interface GoogleSignInDto {
//   idToken: string;
// }
// export interface SignUpPayload {
//   // Or RegisterDto, ClientRegisterPayload etc.
//   email: string;
//   password: string; // Ensure this field name matches server Zod schema for registration
//   username: string;
//   // ... other fields
// }
