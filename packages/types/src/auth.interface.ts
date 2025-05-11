// packages/types/src/auth.interfaces.ts (or similar)

import { Profile } from "./prisma/interfaces";

/**
 * Represents the authenticated user object as seen by the client.
 * This should align with what your Hono API returns and what Prisma defines,
 * but only include fields necessary for the client.
 */
export interface ClientAuthUser {
  id: string;
  email: string | null; // Supabase allowed null emails, check if your system does
  username?: string | null;
  avatarUrl?: string | null; // Or whatever field name you use
  // Add other relevant user properties exposed to the client
  // e.g., roles, permissions, etc.
  activeProfileId?: string | null; // From your existing UserData
}

/**
 * Represents the client-side session.
 */
export interface ClientSession {
  code: number;
  user: ClientAuthUser | null;
  token: string | null; // JWT or session token if used
  expiresAt?: number; // Optional: for token expiration handling
  // any other session-specific data
}

/**
 * Structure for API errors from your "better-auth" Hono endpoints.
 */
export interface ApiAuthError {
  message: string;
  code?: string | number; // e.g., 'INVALID_CREDENTIALS', 'EMAIL_EXISTS'
  details?: any;
}
export interface AuthenticatedState {
  loggedIn: boolean;
}

/**
 * Defines the structure of WebSocket messages related to authentication.
 */
export type AuthWebSocketEventType =
  | "AUTH_STATE_CHANGE" // Generic event that pushes the new session state
  | "USER_UPDATED"
  | "PROFILE_UPDATED"; // Add more as needed

export interface AuthWebSocketMessage {
  type: AuthWebSocketEventType;
  payload: ClientSession | ClientAuthUser | Partial<Profile> | null; // Adjust payload based on type
}

// Credentials for password-based login
export interface AuthCredentials {
  email: string;
  password: string; // Password might be optional if using passwordless or social
}

// Payload for user registration
export interface SignUpPayload extends AuthCredentials {
  username: string;
  // any other signup fields
}

// You'll also continue to use UserData and ProfileData from your stores/types
// import type { UserData, ProfileData } from './user.interfaces'; // or wherever they are defined
