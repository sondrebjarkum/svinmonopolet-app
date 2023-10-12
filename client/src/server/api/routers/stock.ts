/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import mockData, { type Beverage } from "./mockData";
import { z } from "zod";
import { prisma } from "~/server/db";

export const stockRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return mockData.stock;
  }),
  get: publicProcedure
    .input(z.object({ storeId: z.string() }))
    .query(async ({ input }) => {
      const stocks = await prisma.stock.findMany({
        where: {
          storeId: input.storeId,
        },
        include: {
          beer: true,
        },
      });

      console.log("stocks:", stocks.length);
      const beverages = stocks.map((stock) => {
        return {
          ...stock,
          beer: {
            ...stock.beer,
            price: stock.beer.price ? stock.beer.price.toFixed(0) : "0",
            untappd_rating: stock.beer.untappd_rating
              ? stock.beer.untappd_rating.slice(0, 4)
              : "0",
            abv: stock.beer.abv ? stock.beer.abv.toFixed(1).toString() : "0",
            volume: stock.beer.volume ? stock.beer.volume.toFixed(1) : 0,
          },
        };
      });

      const sorted = beverages.sort((a, b) =>
        (a ? a.beer.untappd_rating : 0) < (b ? b.beer.untappd_rating : 0)
          ? 1
          : (a ? a.beer.untappd_rating : 0) > (b ? b.beer.untappd_rating : 0)
          ? -1
          : 0
      );
      return sorted.slice(0, 100);
    }),
});

// mock data backup
// get: publicProcedure
//     .input(z.object({ storeId: z.number() }))
//     .query(({ input }) => {
//       const storeStock = mockData.stock.filter(
//         (stock) => stock.storeId === input.storeId
//       );
//       const drinks = storeStock.map((stock) =>
//         mockData.beers.find((beer) => beer.id === stock.beerId)
//       );
//       const sorted = drinks.sort((a, b) =>
//         (a ? a.rating : 0) < (b ? b.rating : 0)
//           ? 1
//           : (a ? a.rating : 0) > (b ? b.rating : 0)
//           ? -1
//           : 0
//       ) as Beverage[];
//       return sorted;
//     }),
