import { hc } from 'hono/client'
// This is the crucial type imported from your server.
// It should be `export type CashflowServerAppType = typeof app;` where `app` is your fully configured OpenAPIHono instance.
import type { CashflowServerAppType } from '@cashflow/server'

interface SDKOptions {
  baseUrl: string
  wsUrl?: string
  fetch?: typeof fetch
  /** Function to get the authentication token. Can be async. */
  getToken?: () =>
    | Promise<string | null | undefined>
    | string
    | null
    | undefined
}

type WebSocketMessage = {
  type: string
  [key: string]: any // Keep this generic for now, or define more specific message types
}

type WebSocketCallback = (message: WebSocketMessage) => void

// This is the type of the raw Hono client, inferred directly from your server's app type.
// It will have a structure like `client.api.users.$get`, `client.api.auth.login.$post`, etc.,
// assuming your server routes are defined under an `/api` group (e.g., app.route('/api', apiRouter)).
type InferredHonoClient = ReturnType<typeof hc<CashflowServerAppType>>

// Helper type to extract the type of the '/api' route group from the inferred client,
// if your server structures all routes under an 'api' base path.
// If your server routes are NOT all under an 'api' group (e.g. app.route('/users', userRoutes)),
// then you'd access client.users directly, and this ApiRoutesType might not be needed or would be different.
type ApiRoutesType = InferredHonoClient extends { api: infer A } ? A : never
export class CashflowSDK {
  // The client will now be typed with the directly inferred type from the server.
  public client: typeof hc
  private ws?: WebSocket
  private wsUrl: string
  private getToken?: () =>
    | Promise<string | null | undefined>
    | string
    | null
    | undefined

  constructor(options: SDKOptions) {
    if (!options.baseUrl) {
      throw new Error('baseUrl is required')
    }
    // Initialize the Hono client directly with CashflowServerAppType
    this.client = hc<CashflowServerAppType>(options.baseUrl, {
      fetch: options.fetch,
      // You can also configure headers for all requests here, e.g., for an API key
      // headers: {
      //   'X-API-KEY': 'your-api-key',
      // },
    })
    this.wsUrl = options.wsUrl || options.baseUrl.replace(/^http/, 'ws') + '/ws' // Handles http and https
    this.getToken = options.getToken

    // Initialize fetch with token injection if getToken is provided
    if (this.getToken) {
      this.setAuthTokenInterceptor()
    }
    this.client.routes.forEach((route) => {
      console.log(route)
    })
  }

  // --- Typed Getters for API Route Groups ---
  // The return types now use the inferred types from ApiRoutesType.
  // This assumes your server's CashflowServerAppType, when processed by hc,
  // results in a client structure like `client.api.users`, `client.api.games`, etc.
  // If your server routes are structured differently (e.g., no `/api` prefix in Hono grouping),
  // these getters would need to be `this.client.users`, `this.client.games`, etc.

  /**
   * Users API endpoints.
   * Provides access to user-related operations like $get, $post, etc.
   * Example: `sdk.users[':id'].$get({ param: { id: '123' } })`
   */
  get users(): ApiRoutesType extends { users: infer U } ? U : never {
    // @ts-expect-error If ApiRoutesType is 'never' initially, this might show an error.
    // This will resolve if CashflowServerAppType correctly leads to client.api.users.
    return this.client.api.router.users
  }

  /**
   * Games API endpoints.
   */
  get games(): ApiRoutesType extends { games: infer G } ? G : never {
    return this.client
  }

  /**
   * Authentication API endpoints.
   * Example: `await sdk.auth.login.$post({ json: { email, password } })`
   */
  get auth(): ApiRoutesType extends { auth: infer A } ? A : never {
    // @ts-expect-error
    return this.client.api.auth
  }

  /**
   * Deposit API endpoints.
   */
  get deposits(): ApiRoutesType extends { deposits: infer D } ? D : never {
    // @ts-expect-error
    return this.client.api.deposits
  }

  /**
   * Currency API endpoints.
   */
  get currency(): ApiRoutesType extends { currency: infer C } ? C : never {
    // @ts-expect-error
    return this.client.api.currency
  }

  /**
   * VIP API endpoints.
   */
  get vip(): ApiRoutesType extends { vip: infer V } ? V : never {
    // @ts-expect-error
    return this.client.api.vip
  }

  /**
   * Health check endpoint.
   * Example: `await sdk.health.$get()`
   */
  get health(): ApiRoutesType extends { health: infer H } ? H : never {
    // @ts-expect-error
    return this.client.api.health
  }

  // --- WebSocket Methods ---

  /**
   * Connects to the WebSocket server.
   * Authenticates using the token from `getToken` if provided.
   * @returns Promise that resolves with the WebSocket instance when connection is established.
   */
  async connectWebSocket(): Promise<WebSocket> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return this.ws // Already connected
    }

    const token = this.getToken ? await this.getToken() : undefined
    let url = this.wsUrl
    if (token) {
      // Ensure token is URL-encoded if it might contain special characters
      url = `${this.wsUrl}?token=${encodeURIComponent(token)}`
    }

    this.ws = new WebSocket(url)

    return new Promise<WebSocket>((resolve, reject) => {
      if (!this.ws) {
        // Should not happen if constructor ran
        return reject(new Error('WebSocket initialization failed unexpectedly'))
      }

      const wsInstance = this.ws // Capture instance for event handlers

      const openHandler = () => {
        wsInstance.removeEventListener('open', openHandler)
        wsInstance.removeEventListener('error', errorHandler)
        resolve(wsInstance)
      }

      const errorHandler = (event: Event) => {
        wsInstance.removeEventListener('open', openHandler)
        wsInstance.removeEventListener('error', errorHandler)
        reject(
          event instanceof ErrorEvent
            ? event.error
            : new Error('WebSocket connection error'),
        )
      }

      wsInstance.addEventListener('open', openHandler)
      wsInstance.addEventListener('error', errorHandler)
    })
  }

  /**
   * Registers a callback for all incoming WebSocket messages.
   * @param callback Function to call when a message is received.
   */
  onWebSocketMessage(callback: WebSocketCallback): void {
    if (!this.ws) {
      console.warn('WebSocket not connected. Call connectWebSocket() first.')
      return
    }
    this.ws.addEventListener('message', (event) => {
      try {
        if (typeof event.data === 'string') {
          callback(JSON.parse(event.data))
        } else {
          // Handle Blob or ArrayBuffer if your server sends binary data
          console.warn('Received non-string WebSocket message:', event.data)
        }
      } catch (error) {
        console.error(
          'Failed to parse WebSocket message:',
          error,
          'Raw data:',
          event.data,
        )
      }
    })
  }

  /**
   * Sends a message through the WebSocket connection.
   * @param data The message data to send.
   */
  sendWebSocketMessage(data: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected or not open. Cannot send message.')
      return
    }
    try {
      this.ws.send(JSON.stringify(data))
    } catch (error) {
      console.error('Failed to send WebSocket message:', error)
    }
  }

  /**
   * Closes the WebSocket connection.
   */
  closeWebSocket(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = undefined // Clear the instance
    }
  }

  // --- Auth Token Management for HTTP Client ---

  /**
   * Interceptor to automatically add Authorization header to Hono client requests.
   */
  private async setAuthTokenInterceptor() {
    const originalFetch = this.client._fetch || fetch // Use client's internal fetch or global fetch

    this.client._fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const token = this.getToken ? await this.getToken() : undefined
      const headers = new Headers(init?.headers)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return originalFetch(input, { ...init, headers })
    }
  }

  /**
   * Manually sets or updates the function used to retrieve the auth token for subsequent API requests.
   * This is useful if the token source changes or needs to be updated after SDK initialization.
   * @param getTokenFn - The new function to retrieve the token.
   */
  public setTokenProvider(
    getTokenFn: () =>
      | Promise<string | null | undefined>
      | string
      | null
      | undefined,
  ): void {
    this.getToken = getTokenFn
    // Re-apply the interceptor with the new token provider
    this.setAuthTokenInterceptor()
  }
}

/**
 * Factory function to create a new CashflowSDK instance.
 * @param options SDK configuration options.
 * @returns Initialized CashflowSDK instance.
 */
export const createCashflowSDK = (options: SDKOptions): CashflowSDK =>
  new CashflowSDK(options)

// Export relevant types for SDK users
export type {
  CashflowServerAppType, // The raw server app type, useful for advanced scenarios
  SDKOptions,
  WebSocketMessage,
  WebSocketCallback,
}
