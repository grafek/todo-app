import { TRPCError } from "@trpc/server";
import { TODOS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

function useDeleteTodo() {
  const utils = trpc.useContext();

  return trpc.todo.delete.useMutation({
    async onMutate({ id }) {
      await utils.todo.getInfiniteTodos.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getInfiniteTodos.setInfiniteData(
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          const newTodos = data.pages.map((page) => {
            return {
              todos: page.todos.filter((todo) => todo.id !== id),
              nextCursor: page.nextCursor,
            };
          });
          return {
            ...data,
            pages: newTodos,
          };
        },
        { limit: TODOS_LIMIT }
      );
      return { prevData };
    },
    onSettled() {
      utils.todo.getInfiniteTodos.invalidate();
    },
    onError(err, _, ctx) {
      utils.todo.getAll.setData(ctx?.prevData);
      throw new TRPCError({
        message: JSON.stringify(err),
        code: "INTERNAL_SERVER_ERROR",
      });
    },
  });
}

export default useDeleteTodo;
