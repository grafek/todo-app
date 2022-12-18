import { TODOS_LIMIT } from "../utils/globals";
import { trpc } from "../utils/trpc";

function useInfiniteTodos() {
  console.log();
  return trpc.todo.getInfiniteTodos.useInfiniteQuery(
    {
      limit: TODOS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
}

export default useInfiniteTodos;
