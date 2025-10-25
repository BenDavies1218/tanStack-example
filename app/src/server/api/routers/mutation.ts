import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const mutationRouter = createTRPCRouter({
  createData: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        symbol: z.string().min(2).max(10),
        currentPrice: z.number().min(0),
        marketCap: z.number().min(0),
        marketCapRank: z.number().min(0),
      }),
    )
    .mutation(async ({ input }) => {
      return null;
    }),

  updateData: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(2).max(100).optional(),
        symbol: z.string().min(2).max(10).optional(),
        currentPrice: z.number().min(0).optional(),
        marketCap: z.number().min(0).optional(),
        marketCapRank: z.number().min(0).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return null;
    }),

  deleteData: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      return null;
    }),
});

export type MutationRouter = typeof mutationRouter;
