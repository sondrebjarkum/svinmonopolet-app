import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import mockData from "./mockData";
import { prisma } from "~/server/db";
import { type Stores } from "@prisma/client";

export const storesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }): Promise<Stores[]> => {
    // return mockData.stores;
    const all = await prisma.stores.findMany();
    return all;
  }),
});
