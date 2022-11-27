import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const todoRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, { message: "TODO must be 1 or more characters long" }),
        isFavorite: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
          isFavorite: input.isFavorite,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string(), isFavorite: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          isFavorite: input.isFavorite,
        },
      });
    }),
  toggleChecked: protectedProcedure
    .input(z.object({ id: z.string(), isChecked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          isChecked: input.isChecked,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
