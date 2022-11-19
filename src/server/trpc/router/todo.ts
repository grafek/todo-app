import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        isFavorite: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          content: input.content,
          userId: ctx.session.user.id,
          isFavorite: input.isFavorite,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany();
  }),
});
