# Use the official Bun image as a parent image
FROM oven/bun:1 AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# --- Dependencies ---
FROM base AS deps
# Install OS-level dependencies if any (e.g., for Prisma's Rust engine if not using musl)
# RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates

# Copy root package.json and bun.lockb to leverage Docker cache
COPY package.json bun.lockb ./

# Copy package.json and bun.lockb for each workspace
# This helps Docker cache layers better if only one workspace changes
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/server/package.json ./apps/server/

# Install all dependencies including workspace dependencies
RUN bun install --frozen-lockfile

# --- Prisma Client Generation ---
# This step ensures Prisma Client is generated within the Docker image
# It copies the prisma schema and then generates the client
COPY packages/db/prisma ./packages/db/prisma
RUN bun --cwd packages/db run prisma:generate

# --- Build ---
FROM base AS build
WORKDIR /usr/src/app

# Copy all dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/packages ./packages
COPY --from=deps /usr/src/app/apps ./apps
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=deps /usr/src/app/bun.lockb ./bun.lockb
COPY tsconfig.json ./ # Root tsconfig if any, for build context
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json

# Copy the server application source code
COPY apps/server/src ./apps/server/src

# Build the server application
RUN bun --cwd apps/server run build


# --- Release ---
FROM oven/bun:1-slim AS release
WORKDIR /usr/src/app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built server application from the 'build' stage
COPY --from=build /usr/src/app/apps/server/dist ./apps/server/dist

# Copy production dependencies (node_modules might be needed if build output doesn't bundle everything)
# Bun's build often bundles, but Prisma Client might need its generated files.
# Ensure Prisma Client generated files are available.
COPY --from=deps /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# If your server's package.json has dependencies not bundled by `bun build`, copy them too.
# COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY apps/server/package.json ./apps/server/package.json
# If you have a separate production install step, do it here.
# Otherwise, ensure necessary node_modules are copied.

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
# It assumes your server's start script in package.json points to the built output
# Or you can directly run the built file: CMD ["bun", "apps/server/dist/index.js"]
ENTRYPOINT [ "bun", "apps/server/dist/index.js" ]
