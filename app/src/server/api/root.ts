import { tableRouter } from "@/server/api/routers/table";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { carouselRouter } from "@/server/api/routers/carousel";
import { infiniteQueryRouter } from "@/server/api/routers/infiniteQuery";
import { mutationRouter } from "@/server/api/routers/mutation";
import { queryRouter } from "@/server/api/routers/query";

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
  carousel: carouselRouter,
  table: tableRouter,
  infinite: infiniteQueryRouter,
  mutation: mutationRouter,
  query: queryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
