# cashflow Monorepo

This project is a monorepo managed with Bun workspaces.

## Structure

-   `apps/`: Contains individual applications.
    -   `client/`: Frontend application (Vue/React/Svelte - placeholder).
    -   `server/`: Backend Hono server with WebSocket support.
-   `packages/`: Contains shared packages.
    -   `db/`: Prisma schema, client, and database utilities.
    -   `types/`: Shared TypeScript types and interfaces.
-   `docker/`: Docker-related files.
    -   `Dockerfile`: For building the server application.
    -   `docker-compose.yml`: For local development environment (Postgres + Server).
-   `fly.toml`: Configuration for Fly.io deployment.

## Prerequisites

-   [Bun](https://bun.sh/) (v1.x or later)
-   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (for local development with Postgres)
-   [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) (for deployment to Fly.io)

## Getting Started

1.  **Clone the repository (if applicable):**
    ```bash
    # git clone ...
    # cd cashflow
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Setup Database:**
    * Ensure you have PostgreSQL running. You can use the provided Docker Compose setup:
        ```bash
        bun run docker:dev # This will start Postgres and the server
        # In a separate terminal, once Postgres is up:
        bun run db:migrate:dev
        ```
    * Alternatively, if you have a local PostgreSQL instance, update `packages/db/.env` with your connection string and then run:
        ```bash
        bun run db:migrate:dev
        ```

4.  **Seed the database (optional):**
    ```bash
    bun run db:seed
    ```

## Development

-   **Start the server (with hot-reloading):**
    ```bash
    bun run dev:server
    ```
    The server will be available at `http://localhost:3001`.
    WebSocket endpoint: `ws://localhost:3001/ws`.

-   **Start the client (placeholder):**
    ```bash
    bun run dev:client
    ```
    (You'll need to implement the client application and its dev script).

-   **Run Prisma Studio:**
    ```bash
    bun run db:studio
    ```

## Deployment (Fly.io)

1.  **Login to Fly.io:**
    ```bash
    fly auth login
    ```

2.  **Create a Fly app (if you haven't already):**
    ```bash
    fly apps create my-monorepo-server # Or your desired app name, ensure it matches fly.toml
    ```

3.  **Provision a PostgreSQL database on Fly.io (if needed):**
    ```bash
    fly pg create
    fly pg attach <your-fly-pg-app-name> -a my-monorepo-server
    ```
    This will set the `DATABASE_URL` secret.

4.  **Set any other required secrets:**
    ```bash
    # fly secrets set MY_SECRET=my_value
    ```

5.  **Deploy the application:**
    ```bash
    bun run deploy:fly
    ```

## Available Scripts

-   `bun run dev:server`: Starts the server in development mode.
-   `bun run dev:client`: Starts the client in development mode (placeholder).
-   `bun run build:server`: Builds the server application.
-   `bun run start:server`: Starts the production build of the server.
-   `bun run db:generate`: Generates Prisma Client.
-   `bun run db:migrate:dev`: Runs Prisma migrations for development.
-   `bun run db:studio`: Opens Prisma Studio.
-   `bun run db:seed`: Seeds the database.
-   `bun run typecheck`: Runs TypeScript type checking for all relevant workspaces.
-   `bun run docker:dev`: Starts the local development environment using Docker Compose.
-   `bun run deploy:fly`: Deploys the server to Fly.io.

