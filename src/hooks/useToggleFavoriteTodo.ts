import type { Todo } from "@prisma/client";
import { trpc } from "../utils/trpc";

function useToggleFavoriteTodo() {
  const utils = trpc.useContext();

  return trpc.todo.toggleFavorite.useMutation({
    async onMutate({ id, isFavorite }) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData((old): Todo[] => {
        const selectedTodo = old?.find((todo: Todo) => todo.id === id);
        selectedTodo ? (selectedTodo.isFavorite = isFavorite) : null;
        return old ? old : [];
      });

      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
  });
}

export default useToggleFavoriteTodo;
