import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Mocked DB for users
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Developer" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Designer" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Manager" },
  { id: 5, name: "Ethan Hunt", email: "ethan@example.com", role: "Developer" },
];

export const userRouter = createTRPCRouter({
  // Get a single user by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) throw new Error("User not found");
      return user;
    }),

  // Get all users
  getAll: publicProcedure.query(() => {
    return users;
  }),

  // Get multiple users by IDs (for useQueries example)
  getByIds: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(({ input }) => {
      return users.filter((u) => input.ids.includes(u.id));
    }),
});
