import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

function useAddTodo() {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  let tempIds = 1;

  return trpc.todo.add.useMutation({
    async onMutate(newTodo) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData(
        (old) =>
          old && sessionData?.user
            ? [
                {
                  ...newTodo,
                  createdAt: new Date(),
                  id: (tempIds++).toString(),
                  userId: sessionData.user.id,
                  isChecked: false,
                  updatedAt: new Date(),
                },
                ...old,
              ]
            : []

        //optimistic update with temporary clientside id
      );
      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
    onError(err, newTodo, ctx) {
      utils.todo.getAll.setData(ctx?.prevData);
      throw new TRPCError({
        message: JSON.stringify(err),
        code: "INTERNAL_SERVER_ERROR",
      });
    },
  });
}

export default useAddTodo;
