import { z } from "zod";
import { todoSchema } from "../../../schemas/todo.schema";
import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  add: protectedProcedure.input(todoSchema).mutation(async ({ ctx, input }) => {
    const { session, prisma } = ctx;
    const { content, isFavorite } = input;

    const addedTodo = await prisma.todo.create({
      data: {
        content,
        isFavorite,
        userId: session.user.id,
      },
    });

    return addedTodo;
  }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      const deletedTodo = await prisma.todo.delete({
        where: {
          id,
        },
      });

      return deletedTodo;
    }),
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string(), isFavorite: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id, isFavorite } = input;

      const toggledFavorite = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          isFavorite,
        },
      });

      return toggledFavorite;
    }),
  toggleChecked: protectedProcedure
    .input(z.object({ id: z.string(), isChecked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id, isChecked } = input;

      const toggledChecked = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          isChecked,
        },
      });

      return toggledChecked;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const todos = await prisma.todo.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return todos;
  }),
});
