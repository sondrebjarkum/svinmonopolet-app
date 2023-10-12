import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import mockData from "./mockData";

export const beersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return mockData.beers;
  }),
});
