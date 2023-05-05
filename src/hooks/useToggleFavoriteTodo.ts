import { TRPCError } from "@trpc/server";
import { TODOS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

function useToggleFavoriteTodo() {
  const utils = trpc.useContext();

  return trpc.todo.toggleFavorite.useMutation({
    async onMutate({ id, isFavorite }) {
      await utils.todo.getInfiniteTodos.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getInfiniteTodos.setInfiniteData(
        { limit: TODOS_LIMIT },
        (data) => {
          if (!data) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const updatedTodos = data.pages.map((page) => ({
            todos: page.todos.map((todo) =>
              todo.id === id ? { ...todo, isFavorite } : todo
            ),
            nextCursor: page.nextCursor,
          }));

          return {
            ...data,
            pages: updatedTodos,
          };
        }
      );
      return { prevData };
    },
    onSettled() {
      utils.todo.getInfiniteTodos.invalidate();
    },
    onError(err, _, ctx) {
      utils.todo.getAll.setData(undefined, () => ctx?.prevData);
      throw new TRPCError({
        message: JSON.stringify(err),
        code: "INTERNAL_SERVER_ERROR",
      });
    },
  });
}

export default useToggleFavoriteTodo;
