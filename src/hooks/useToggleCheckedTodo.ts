import { TRPCError } from "@trpc/server";
import { TODOS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

function useToggleCheckedTodo() {
  const utils = trpc.useContext();

  return trpc.todo.toggleChecked.useMutation({
    async onMutate({ id, isChecked }) {
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

          const updatedTodos = data.pages.map((page) => ({
            todos: page.todos.map((todo) =>
              todo.id === id ? { ...todo, isChecked } : todo
            ),
            nextCursor: page.nextCursor,
          }));

          return {
            ...data,
            pages: updatedTodos,
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

export default useToggleCheckedTodo;
