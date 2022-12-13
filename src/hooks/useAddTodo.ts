import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { TODOS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

function useAddTodo() {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  let tempIds = 1;

  return trpc.todo.add.useMutation({
    async onMutate(newTodo) {
      await utils.todo.getInfiniteTodos.cancel();

      utils.todo.getInfiniteTodos.setInfiniteData(
        (data) => {
          if (!data || !sessionData?.user || !data.pages[0]) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          const firstPage = data.pages[0];

          const restPages = data.pages.slice(1).map((page) => {
            return {
              todos: page.todos,
              nextCursor: tempIds++,
            };
          });

          firstPage?.todos.unshift({
            ...newTodo,
            createdAt: new Date(),
            id: (tempIds++).toString(),
            userId: sessionData.user.id,
            isChecked: false,
            updatedAt: new Date(),
          });

          // optimistically add to first page newly created todo

          return {
            ...data,
            pages: [firstPage, ...restPages],
          };
        },
        { limit: TODOS_LIMIT }
      );

      const prevData = utils.todo.getAll.getData();
      return { prevData };
    },
    onSuccess() {
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

export default useAddTodo;
