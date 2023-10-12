import { createTRPCRouter } from "~/server/api/trpc";
import { beersRouter } from "./routers/beers";
import { exampleRouter } from "./routers/example";
import { stockRouter } from "./routers/stock";
import { storesRouter } from "./routers/stores";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  stores: storesRouter,
  beers: beersRouter,
  stock: stockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
