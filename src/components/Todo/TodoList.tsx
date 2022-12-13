import { useSession } from "next-auth/react";
import TodoItem from "./TodoItem";
import { LoadingDots } from "../UI";
import { AnimatePresence } from "framer-motion";
import type { Todo } from "@prisma/client";
import { useInfiniteTodos } from "../../hooks";
import { useEffect } from "react";

type TodoListProps = {
  filterFavorites: boolean;
  filterChecked: boolean;
};

function TodoList({ filterFavorites, filterChecked }: TodoListProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, error } =
    useInfiniteTodos();

  const todos = data?.pages.flatMap((page) => page.todos) ?? [];

  const { data: sessionData } = useSession();

  useEffect(() => {
    let fetching = false;
    if (!hasNextPage) return;
    const handleScroll = async () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);

  const favoriteTodos = todos?.filter((todo) => {
    return todo.isFavorite;
  });

  const checkedTodos = todos?.filter((todo) => {
    return todo.isChecked;
  });

  const checkedAndFavoriteTodos = todos?.filter((todo) => {
    if (todo.isChecked && todo.isFavorite) {
      return todo;
    }
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

  if (todos.length < 1) {
    return (todosContent = (
      <p className="p-12 text-center">
        No TODOS found! <br /> Add some by clicking {"+"} sign in top right
        corner 🙂
      </p>
    ));
  }

  if (filterFavorites && favoriteTodos && !filterChecked) {
    todosContent = favoriteTodos.map((todo: Todo) => {
      return (
        <TodoItem
          key={`${todo.userId}/${todo.content.slice(0, 10)}/${
            sessionData.expires
          }`}
          // clientside key data to not refetch after obtaining id from server when...
          // ... setting todo.id as key with optimistic update
          todo={todo}
        />
      );
    });
  } else if (filterChecked && filterFavorites && checkedAndFavoriteTodos) {
    todosContent = checkedAndFavoriteTodos.map((todo: Todo) => {
      return (
        <TodoItem
          key={`${todo.userId}/${todo.content.slice(0, 10)}/${
            sessionData.expires
          }`}
          todo={todo}
        />
      );
    });
  } else if (filterChecked && checkedTodos) {
    todosContent = checkedTodos.map((todo: Todo) => {
      return (
        <TodoItem
          key={`${todo.userId}/${todo.content.slice(0, 10)}/${
            sessionData.expires
          }`}
          todo={todo}
        />
      );
    });
  } else
    todosContent = todos.map((todo: Todo) => {

      return (
        <TodoItem
          key={`${todo.userId}/${todo.content.slice(0, 10)}/${
            sessionData.expires
          }`}
          todo={todo}
        />
      );
    });
  //TODO: MOVE FILTER LOGIC TO BACKEND

  return (
    <div className="p-2">
      <ul className="flex flex-col gap-2">
        <AnimatePresence mode="sync">{todosContent}</AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;
