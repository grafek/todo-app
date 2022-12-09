import type { Todo } from "@prisma/client";
import { trpc } from "../utils/trpc";

function useToggleCheckedTodo() {
  const utils = trpc.useContext();

  return trpc.todo.toggleChecked.useMutation({
    async onMutate({ id, isChecked }) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData((old): Todo[] => {
        const selectedTodo = old?.find((todo: Todo) => todo.id === id);
        selectedTodo ? (selectedTodo.isChecked = isChecked) : null;
        return old ? old : [];
      });

      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
  });
}

export default useToggleCheckedTodo