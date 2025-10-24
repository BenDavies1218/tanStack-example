import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Mocked DB for todos
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const todos: Todo[] = [
  {
    id: 1,
    title: "Learn TanStack Query",
    completed: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    title: "Build demo app",
    completed: false,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: 3,
    title: "Master useQuery",
    completed: false,
    createdAt: new Date("2024-01-03"),
  },
];

export const todoRouter = createTRPCRouter({
  // Get all todos
  getAll: publicProcedure.query(() => {
    return todos;
  }),

  // Get a single todo by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const todo = todos.find((t) => t.id === input.id);
      if (!todo) throw new Error("Todo not found");
      return todo;
    }),

  // Create a new todo
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ input }) => {
      const newTodo: Todo = {
        id: Math.max(...todos.map((t) => t.id), 0) + 1,
        title: input.title,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);
      return newTodo;
    }),

  // Update a todo
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        completed: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => {
      const todo = todos.find((t) => t.id === input.id);
      if (!todo) throw new Error("Todo not found");

      if (input.title !== undefined) todo.title = input.title;
      if (input.completed !== undefined) todo.completed = input.completed;

      return todo;
    }),

  // Delete a todo
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const index = todos.findIndex((t) => t.id === input.id);
      if (index === -1) throw new Error("Todo not found");

      const deleted = todos[index];
      todos.splice(index, 1);
      return deleted;
    }),

  // Get paginated todos
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
      const paginated = todos.slice(start, end);

      return {
        todos: paginated,
        hasMore: end < todos.length,
        total: todos.length,
        page: input.page,
      };
    }),

  // Get infinite todos (cursor-based)
  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(({ input }) => {
      const cursor = input.cursor ?? 0;
      const items = todos.slice(cursor, cursor + input.limit);

      return {
        items,
        nextCursor:
          cursor + items.length < todos.length
            ? cursor + items.length
            : undefined,
      };
    }),
});
