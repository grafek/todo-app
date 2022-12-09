import { TRPCError } from "@trpc/server";
import { trpc } from "../utils/trpc";

function useDeleteTodo() {
  const utils = trpc.useContext();

  return trpc.todo.delete.useMutation({
    async onMutate({ id }) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData((old) => old?.filter((todo) => todo.id !== id));

      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
    onError(err, deletedTodo, ctx) {
      utils.todo.getAll.setData(ctx?.prevData);
      throw new TRPCError({
        message: JSON.stringify(err),
        code: "INTERNAL_SERVER_ERROR",
      });
    },
  });
}

export default useDeleteTodo;
