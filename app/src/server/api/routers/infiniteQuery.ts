import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const infiniteQueryRouter = createTRPCRouter({
  getInfiniteDataMongoDB: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      return null;
    }),
  getInfiniteDataPostgres: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      return null;
    }),
});

export type InfiniteQueryRouter = typeof infiniteQueryRouter;
