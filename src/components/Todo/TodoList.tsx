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

  if (todos.length < 1) {
    return (
      <div className="text-center">
        No TODOS found! <br />
        Add some by clicking {"+"} sign🙂
      </div>
    );
  }
  const todosContent = todos
    .filter((todo) => (filterChecked ? todo.isChecked : todo))
    .filter((todo) => (filterFavorites ? todo.isFavorite : todo))
    .map((todo: Todo) => {
      return (
        <TodoItem
          key={`${todo.userId}/${todo.content}/${sessionData.expires}`}
          todo={todo}
        />
      );
    });

  return (
    <div className="p-2">
      <ul className="flex flex-col gap-2">
        <AnimatePresence mode="sync">
          {todosContent}
          {isFetchingNextPage ? <LoadingDots /> : null}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;
