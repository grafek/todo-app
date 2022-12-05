import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import TodoItem from "./TodoItem";
import { LoadingDots } from "../UI";
import { AnimatePresence } from "framer-motion";
import type { Todo } from "@prisma/client";

type TodoListProps = {
  filterFavorites: boolean;
};

function TodoList({ filterFavorites }: TodoListProps) {
  const { isLoading, isError, error, data } = trpc.todo.getAll.useQuery();

  const { data: sessionData } = useSession();

  const favoriteTodos = data?.filter((todo) => {
    return todo.isFavorite;
  });

  if (!sessionData?.user?.id) return null;

  let todosContent;

  if (isLoading) {
    return <LoadingDots />;
  }

  if (isError) {
    return (todosContent = (
      <span className="text-center">Error: {error?.message}</span>
    ));
  }

  if (data.length < 1) {
    return (todosContent = (
      <p className="p-12 text-center">
        No TODOS found! <br /> Add some by clicking {"+"} sign in top right
        corner 🙂
      </p>
    ));
  }

  if (filterFavorites && favoriteTodos) {
    todosContent = favoriteTodos.map((todo: Todo) => {
      return (
        <TodoItem
          key={`${todo.userId}/${todo.content.slice(0, 10)}/${
            sessionData.expires
          }`}
          // clientside key data to not refetch after obtaining id from server when...
          // ... setting todo.id as key with optimistic update
          id={todo.id}
          todo={todo}
        />
      );
    });
  } else
    todosContent = data.map((todo: Todo) => {
      return (
        <TodoItem
          key={`${todo.userId}/${todo.content.slice(0, 10)}/${
            sessionData.expires
          }`}
          id={todo.id}
          todo={todo}
        />
      );
    });

  return (
    <div className="p-2">
      <ul className="flex flex-col gap-2">
        <AnimatePresence mode="sync">{todosContent}</AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;
