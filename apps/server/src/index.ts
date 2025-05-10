// import { z } from 'zod'
// import { WebSocketRouter } from './sockets'
// import { chatRouter } from './sockets/chat.wsroute'
// import createApp from './rest/create-app'
// import { registerRoutes } from './routes'
// import { auth } from './rest/auth'
// import { BunRequest } from 'bun'

// interface MyWebSocketData {
//   userId?: string
//   roomId?: string
//   username?: string
// }

// // --- WebSocket Setup ---
// const port = parseInt(process.env.PORT || '3001') // Ensure server port is different if client runs on 3000

// const ws = new WebSocketRouter<Record<string, unknown>>()
// ws.addRoutes(chatRouter)
// const app = createApp()
// registerRoutes(app)

// const server = Bun.serve<MyWebSocketData, {}>({
//   port: port,
//   // fetch: app.fetch,
//   routes: {
//     '/ws': async (req: BunRequest) => {
//       // const cookies = new Bun.CookieMap(req.headers.get('cookie')!)
//       // const token = cookies.get('token')
//       // console.log(req.headers)
//       // const email = 'xxx@asdfasdf.com'
//       // const password = 'asdfasdf'
//       // const signUpResponse = (await auth.api.signUpEmail({
//       //   body: {
//       //     id: "",
//       //     email,
//       //     password,
//       //     name: "Test User",
//       //     emailVerified: true,
//       //     createdAt: new Date(),
//       //     updatedAt: new Date(),
//       //     username: "testuser",
//       //     totalXp: 0,
//       //     balance: 0,
//       //     isVerified: false,
//       //     active: true,
//       //     lastLogin: new Date(),
//       //     verificationToken: "",
//       //     avatar: "",
//       //     activeProfileId: "",
//       //     gender: "BOY",
//       //     status: "ACTIVE",
//       //     cashtag: "",
//       //     phpId: 0,
//       //     accessToken: "",
//       //     twoFactorEnabled: false,
//       //     banned: false,
//       //     banReason: "",
//       //     banExpires: new Date(),
//       //     lastDailySpin: new Date(),
//       //     image: "",
//       //   },
//       // })) as { token: string; user: User };
//       // const signInWithEmail = await auth.api.signInEmail({ body: { email, password } });
//       // console.log(signInWithEmail);
//       // signUpResponse.token;
//       // req.headers.token = token;
//       // console.log(req.headers);
//       //
//       const session = await auth.api.getSession({
//         headers: req.headers,
//       })
//       console.log(' ses ', session)
//       console.log(' ses ', session?.user)
//       // const wsContextData: AdditionalWsData = {
//       //   userId: session?.user.id,
//       //   roomId: session?.user.id,
//       //   clientId: session?.user.id,
//       // };

//       // Attempt to upgrade using Bun's native server.upgrade
//       // Pass the prepared context data. Bun combines this with a generated clientId
//       // and makes the combined object available as ws.data in the WebSocketHandler.
//       // const success = server.upgrade(req, {
//       //   data: wsContextData,
//       //   // headers: new Headers({ 'X-WebSocket-Server': 'Bun-Native-With-Router' }) // Optional headers
//       // });
//       return ws.upgrade(req, {
//         server,
//         data: {
//           userId: session?.user.id,
//           roomId: session?.user.id,
//           clientId: session?.user.id as string,
//         },
//       }) // Return the WebSocketHandler
//       // return Response.json(session);
//     },
//   },
//   // websocket: {
//   // open(ws) {
//   //   const userId =
//   //     ws.data.userId || `guest-${Math.random().toString(36).substring(2, 9)}`
//   //   ws.data.userId = userId
//   //   ws.data.username = ws.data.username || 'Anonymous' // Set a default username

//   //   connectedClients.set(userId, ws)
//   //   console.log(
//   //     `WebSocket connection opened for user: ${userId} (username: ${ws.data.username})`,
//   //   )
//   //   ws.send(
//   //     JSON.stringify({
//   //       type: 'connection_ack',
//   //       message: 'Connected to WebSocket server!',
//   //       userId,
//   //     }),
//   //   )

//   //   // Subscribe to a default room or based on ws.data.roomId
//   //   const roomId = ws.data.roomId || 'general'
//   //   ws.subscribe(roomId)
//   //   console.log(`User ${userId} subscribed to room: ${roomId}`)

//   //   // Announce new user to the room
//   //   server.publish(
//   //     roomId,
//   //     JSON.stringify({
//   //       type: 'user_join',
//   //       username: ws.data.username,
//   //       userId: ws.data.userId,
//   //       timestamp: new Date().toISOString(),
//   //     }),
//   //   )
//   // },
//   // async message(ws, message) {
//   //   try {
//   //     const parsedMessage: ChatMessagePayload = JSON.parse(
//   //       message.toString(),
//   //     ) as ChatMessagePayload
//   //     const { content, roomId = 'general' } = parsedMessage // Default to 'general' if no roomId

//   //     // Validate message content (basic example)
//   //     if (!content || typeof content !== 'string' || content.trim() === '') {
//   //       ws.send(
//   //         JSON.stringify({
//   //           type: 'error',
//   //           message: 'Invalid message content.',
//   //         }),
//   //       )
//   //       return
//   //     }

//   //     console.log(
//   //       `Message from user ${ws.data.userId} in room ${roomId}: ${content}`,
//   //     )

//   //     // Construct message payload
//   //     const outgoingMessage = {
//   //       type: 'new_message',
//   //       userId: ws.data.userId,
//   //       username: ws.data.username,
//   //       content: content.trim(),
//   //       roomId: roomId,
//   //       timestamp: new Date().toISOString(),
//   //     }

//   //     // Publish message to the specific room
//   //     server.publish(roomId, JSON.stringify(outgoingMessage))

//   //     // Optionally, save message to DB
//   //     await prisma.chatmessage.create({
//   //       data: {
//   //         content: content.trim(),
//   //         userId: ws.data.userId!, // Assume userId is always present after open
//   //         roomId: roomId, // Ensure your schema has roomId
//   //         channel: 'LOBBY', // Or determine channel based on roomId
//   //       },
//   //     })
//   //   } catch (error) {
//   //     console.error('Error processing WebSocket message:', error)
//   //     ws.send(
//   //       JSON.stringify({
//   //         type: 'error',
//   //         message: 'Failed to process message.',
//   //       }),
//   //     )
//   //   }
//   // },
//   // close(ws, code, reason) {
//   //   connectedClients.delete(ws.data.userId!)
//   //   console.log(
//   //     `WebSocket connection closed for user: ${ws.data.userId}, code: ${code}, reason: ${reason}`,
//   //   )
//   //   const roomId = ws.data.roomId || 'general'
//   //   // Announce user leaving to the room
//   //   server.publish(
//   //     roomId,
//   //     JSON.stringify({
//   //       type: 'user_leave',
//   //       username: ws.data.username,
//   //       userId: ws.data.userId,
//   //       timestamp: new Date().toISOString(),
//   //     }),
//   //   )
//   // },
//   // // error(ws, error) {
//   // //   console.error(`WebSocket error for user ${ws.data.userId}:`, error)
//   // // },
//   // // Bun specific: Handle backpressure
//   // drain(ws) {
//   //   console.log(`WebSocket backpressure drained for user: ${ws.data.userId}`)
//   // },
//   // },
// })

// console.log(
//   `Server with Hono and Bun WebSocket running on http://localhost:${server.port}`,
// )

// export default server
import type { Server, ErrorLike } from 'bun' // Import Bun's Server type and Errorlike
import { auth } from './rest/auth'
import createApp from './rest/create-app'
import { registerRoutes } from './routes'
import { WebSocketRouter } from './sockets'
import { chatRouter } from './sockets/chat.wsroute'
import { swaggerUI } from '@hono/swagger-ui'
// const ws = new WebSocketRouter<Record<string, unknown>>()
export const app = createApp()
// registerRoutes(app)
interface MyWebSocketData {
  userId?: string
  roomId?: string
  username?: string
}
type AdditionalWsData = Omit<MyWebSocketData, 'clientId'>
const wsRouter = new WebSocketRouter<AdditionalWsData>()
wsRouter.addRoutes(chatRouter)
app.doc('/openapi.json', {
  openapi: '3.1.0', // Specify OpenAPI version
  info: {
    version: '1.0.0',
    title: 'Cashflow API',
    description:
      'API for the Cashflow application, managing users, games, transactions, and more.',
    // contact: {
    //   name: 'API Support',
    //   url: 'http://www.example.com/support',
    //   email: 'support@example.com',
    // },
    // license: {
    //   name: 'Apache 2.0',
    //   url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    // },
  },
  // servers: [ // Optional: Define your API servers
  //   { url: 'http://localhost:3001', description: 'Local development server' },
  //   { url: 'https://api.cashflow.com', description: 'Production server' },
  // ],
  // externalDocs: { // Optional
  //   description: 'Find more info here',
  //   url: 'https://docs.cashflow.com',
  // },
  // components: { // Optional: Define shared components like securitySchemes
  //   securitySchemes: {
  //     bearerAuth: {
  //       type: 'http',
  //       scheme: 'bearer',
  //       bearerFormat: 'JWT',
  //     },
  //   },
  // },
})

// This route serves the Swagger UI, which visualizes your OpenAPI document
app.get('/doc', swaggerUI({ url: '/openapi.json' }))
// --- Define Open/Close Handlers ---
// wsRouter.onOpen(({ ws, send }) => {
//   console.log(
//     `[WS Router] Client connected: ${ws.data.clientId}, User: ${ws.data.userId}`,
//   )
//   // Example: Send a welcome message
//   // import { WelcomeMessageSchema } from './schema';
//   // send(WelcomeMessageSchema, { message: `Welcome ${ws.data.userId || 'guest'}!` });
// })

// wsRouter.onClose(({ ws, code, reason }) => {
//   console.log(
//     `[WS Router] Client disconnected: ${ws.data.clientId}, User: ${ws.data.userId}, Code: ${code}, Reason: ${reason}`,
//   )
//   // Perform any necessary cleanup based on ws.data
// })

// --- Bun Server Setup ---
const PORT = 6589

console.log(`Attempting to start server on port ${PORT}...`)

// Pass the type for the *additional* data (excluding clientId) as the first generic argument.
// Pass an empty object type `{}` as the second generic argument to satisfy the type signature.
const server = Bun.serve<AdditionalWsData, {}>({
  // Corrected: Added second type argument {}
  port: PORT,
  hostname: '0.0.0.0', // Listen on all interfaces

  routes: {
    '/ws': async (req: Request) => {
      // const cookies = new Bun.CookieMap(req.headers.get('cookie')!)
      // const token = cookies.get('token')
      console.log('asdf')

      // console.log(req.headers)
      // const email = 'xxx@asdfasdf.com'
      // const password = 'asdfasdf'
      // const signUpResponse = (await auth.api.signUpEmail({
      //   body: {
      //     id: "",
      //     email,
      //     password,
      //     name: "Test User",
      //     emailVerified: true,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //     username: "testuser",
      //     totalXp: 0,
      //     balance: 0,
      //     isVerified: false,
      //     active: true,
      //     lastLogin: new Date(),
      //     verificationToken: "",
      //     avatar: "",
      //     activeProfileId: "",
      //     gender: "BOY",
      //     status: "ACTIVE",
      //     cashtag: "",
      //     phpId: 0,
      //     accessToken: "",
      //     twoFactorEnabled: false,
      //     banned: false,
      //     banReason: "",
      //     banExpires: new Date(),
      //     lastDailySpin: new Date(),
      //     image: "",
      //   },
      // })) as { token: string; user: User };
      // const signInWithEmail = await auth.api.signInEmail({ body: { email, password } });
      // console.log(signInWithEmail);
      // signUpResponse.token;
      // req.headers.token = token;
      console.log(req.headers)
      //
      const session = await auth.api.getSession({
        headers: req.headers,
      })
      console.log(' ses ', session)
      console.log(' ses ', session?.user)
      // const wsContextData: AdditionalWsData = {
      //   userId: session?.user.id,
      //   roomId: session?.user.id,
      //   clientId: session?.user.id,
      // };

      // Attempt to upgrade using Bun's native server.upgrade
      // Pass the prepared context data. Bun combines this with a generated clientId
      // and makes the combined object available as ws.data in the WebSocketHandler.
      // const success = server.upgrade(req, {
      //   data: wsContextData,
      //   // headers: new Headers({ 'X-WebSocket-Server': 'Bun-Native-With-Router' }) // Optional headers
      // });

      if (!session?.user || !session?.user.id) {
        console.log(
          '[Bun Fetch] WebSocket upgrade denied: Missing userId query param.',
        )
        return new Response(
          'userId query parameter is required for WebSocket connection',
          { status: 401 },
        )
      }
      return wsRouter.upgrade(req, {
        server,
        data: {
          userId: session?.user.id,
          roomId: session?.user.id,
          clientId: session?.user.id as string,
        },
      }) // Return the WebSocketHandler
      // // return Response.json(session);
    },
  },
  fetch(
    req: Request,
    server: Server,
  ): Response | Promise<Response> | undefined {
    const url = new URL(req.url)
    console.log('x')
    //   // --- WebSocket Upgrade Logic ---
    //   if (url.pathname === "/wsx") {
    //     console.log(`[Bun Fetch] Received request for WebSocket upgrade at ${url.pathname}`);
    //     // const tags = c.req.queries("tags");
    //     const cookies = new Bun.CookieMap(req.headers.get("cookie")!);
    //     const token = cookies.get("token");
    //     // console.log(token);
    //     // const session = await auth.api.getSession({
    //     //   headers: req.headers,
    //     // });
    //     // --- Authentication/Context Preparation ---
    //     const userId = url.searchParams.get("userId");
    //     const roomId = url.searchParams.get("roomId") || "default_room";
    //     // TODO: Implement proper authentication (e.g., check Authorization header, cookies)

    //     if (!userId) {
    //       console.log("[Bun Fetch] WebSocket upgrade denied: Missing userId query param.");
    //       return new Response("userId query parameter is required for WebSocket connection", { status: 400 });
    //     }
    //     // --- End Authentication/Context ---

    //     // Prepare the *additional* context data (the part defined by AdditionalWsData)
    //     const wsContextData: AdditionalWsData = {
    //       userId: userId,
    //       roomId: roomId,
    //     };

    //     // Attempt to upgrade using Bun's native server.upgrade
    //     // Pass the prepared context data. Bun combines this with a generated clientId
    //     // and makes the combined object available as ws.data in the WebSocketHandler.
    //     const success = server.upgrade(req, {
    //       data: wsContextData,
    //       // headers: new Headers({ 'X-WebSocket-Server': 'Bun-Native-With-Router' }) // Optional headers
    //     });

    //     if (success) {
    //       console.log(`[Bun Fetch] WebSocket upgrade successful for userId: ${userId}`);
    //       return undefined; // Signal Bun to handle the 101 response
    //     } else {
    //       console.error("[Bun Fetch] WebSocket upgrade failed (server.upgrade returned false).");
    //       return new Response("WebSocket upgrade failed", { status: 400 });
    //     }
    //   }
    //   // --- End WebSocket Upgrade Logic ---

    //   // --- HTTP Request Handling via Hono ---
    //   console.log(`[Bun Fetch] Passing request to Hono: ${req.method} ${url.pathname}`);
    //   // Pass the server instance in the environment object for Hono context
    const honoEnv = { serverInstance: server }
    return app.fetch(req, honoEnv)
    //   // --- End HTTP Request Handling ---
  },

  /**
   * Assign the WebSocket handlers generated by our custom router instance.
   */
  websocket: wsRouter.websocket,

  /**
   * Error handling for the Bun server itself.
   * Corrected return type to satisfy Bun's expected signature.
   */
  error(error: ErrorLike): void | Response | Promise<void> | Promise<Response> {
    console.error('[Bun Server Error]', error)
    // Returning a Response:
    return Promise.resolve(
      new Response(`Server error: ${error.message || 'Unknown error'}`, {
        status: 500,
      }),
    )
  },
})

console.log(`🚀 Server listening on http://${server.hostname}:${server.port}`)

// Optional: Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Shutting down server...')
  server.stop(true) // true = close existing connections gracefully
  console.log('Server stopped.')
  process.exit(0)
})

export type CashflowServerAppType = typeof app
