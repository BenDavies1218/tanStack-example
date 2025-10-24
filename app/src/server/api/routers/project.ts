import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Mocked DB for projects
interface Project {
  id: number;
  name: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
}

const projects: Project[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  status: ["active", "completed", "on-hold"][i % 3] as Project["status"],
  progress: Math.floor(Math.random() * 100),
}));

export const projectRouter = createTRPCRouter({
  // Get all projects
  getAll: publicProcedure.query(() => {
    return projects;
  }),

  // Get paginated projects
  getPaginated: publicProcedure
    .input(
      z.object({
        page: z.number().min(0).default(0),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(({ input }) => {
      const start = input.page * input.limit;
      const end = start + input.limit;
      const paginated = projects.slice(start, end);

      return {
        projects: paginated,
        hasMore: end < projects.length,
        total: projects.length,
        page: input.page,
      };
    }),
});
