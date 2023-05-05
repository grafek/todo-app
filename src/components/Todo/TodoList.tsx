import { useSession } from "next-auth/react";
import TodoItem from "./TodoItem";
import { LoadingDots } from "../UI";
import { AnimatePresence } from "framer-motion";
import type { Todo } from "@prisma/client";
import { useInfiniteTodos, useInfiniteScroll } from "../../hooks";

type TodoListProps = {
  filterFavorites: boolean;
  filterChecked: boolean;
};

function TodoList({ filterFavorites, filterChecked }: TodoListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useInfiniteTodos();

  useInfiniteScroll({ fetchNextPage, hasNextPage });

  const todos = data?.pages.flatMap((page) => page.todos) ?? [];

  const { data: sessionData, status } = useSession();

  if (!sessionData?.user?.id) return null;

  if (status === "authenticated" && isLoading) {
    return (
      <div className="text-center">
        <LoadingDots />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center">Error: {error?.message}</div>;
  }

  const filteredTodos = todos
    .filter((todo) => (filterChecked ? todo.isChecked : todo))
    .filter((todo) => (filterFavorites ? todo.isFavorite : todo));

  if (filteredTodos.length < 1) {
    return (
      <div className="text-center">
        No TODOS found! <br />
        Add some by clicking {"+"} sign or check filtering
      </div>
    );
  }

  const todosContent = filteredTodos.map((todo: Todo) => {
    return (
      <TodoItem
        key={`${todo.userId}/${todo.content}/${sessionData.expires}`}
        todo={todo}
      />
    );
  });

  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence mode="sync">
        {todosContent}
        {isFetchingNextPage ? <LoadingDots /> : null}
      </AnimatePresence>
    </ul>
  );
}

export default TodoList;
