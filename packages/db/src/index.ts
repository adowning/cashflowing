// This file exports the Prisma client instance and potentially other db-related utilities.
import { PrismaClient as OriginalPrismaClient } from "../prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";
import { enhance } from "@zenstackhq/runtime";

// Export all individual types from @prisma/client if needed elsewhere
export * from "../prisma/client";

// Export a pre-configured client instance
// This helps in managing extensions or logging in one place
// export const prisma = new OriginalPrismaClient({
//   // log: ['query', 'info', 'warn', 'error'], // Optional: configure logging
// })
const apiKey = process.env.OPTIMIZE_API_KEY || "";

const prisma = new OriginalPrismaClient().$extends(withAccelerate());
//   .$extends(withOptimize({ apiKey }));

export default prisma; // enhance(prisma);
