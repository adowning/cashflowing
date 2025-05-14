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

export interface SignUpPayload {
  // Or RegisterDto, ClientRegisterPayload etc.
  email: string;
  password: string; // Ensure this field name matches server Zod schema for registration
  username: string;
  // ... other fields
}
export interface ApiErrorData {
  message: string;
  code?: number | string;
  errors?: Array<{ field: string; message: string }>; // For validation errors
}
export interface ClientRegisterPayload {
  email: string;
  password_hash: string;
  username: string;
}
