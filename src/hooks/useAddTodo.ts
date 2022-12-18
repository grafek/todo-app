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
        (old) => {
          if (!old || !sessionData?.user) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          const pages = [...old.pages];

          const firstPage = pages[0];

          if (!firstPage) return;

          firstPage?.todos.unshift({
            ...newTodo,
            createdAt: new Date(),
            id: (tempIds++).toString(),
            userId: sessionData.user.id,
            isChecked: false,
          });

          const restPages = pages.slice(1).map((page) => {
            return {
              todos: page.todos,
              nextCursor: (tempIds++).toString(),
            };
          });

          if (pages.length === 1) {
            return {
              ...old,
              pages: [
                { todos: firstPage.todos, nextCursor: (tempIds++).toString() },
              ],
            };
          }
          // optimistically add to first page newly created todo
          return {
            ...old,
            pages: [firstPage, ...restPages],
          };
        },
        { limit: TODOS_LIMIT }
      );
    },
    onSettled() {
      utils.todo.getInfiniteTodos.invalidate();
    },
  });
}

export default useAddTodo;
