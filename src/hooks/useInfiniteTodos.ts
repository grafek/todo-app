import { TODOS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

function useInfiniteTodos() {
  return trpc.todo.getInfiniteTodos.useInfiniteQuery(
    {
      limit: TODOS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}

export default useInfiniteTodos;
