// import { PrismaClient } from "@prisma/client";
// import * as dotenv from "dotenv";
// import { env } from "~/env.mjs";
// dotenv.config(); // Load the environment variables

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log:
//       env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
