import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import TodoItem from "./TodoItem";
import { LoadingDots } from "../UI";
import { AnimatePresence } from "framer-motion";
import type { Todo } from "@prisma/client";

type TodoListProps = {
  filterFavorites: boolean;
  filterChecked: boolean;
};

function TodoList({ filterFavorites, filterChecked }: TodoListProps) {
  const { isLoading, isError, error, data } = trpc.todo.getAll.useQuery();

  const { data: sessionData } = useSession();

  const favoriteTodos = data?.filter((todo) => {
    return todo.isFavorite;
  });

  const checkedTodos = data?.filter((todo) => {
    return todo.isChecked;
  });

  const checkedAndFavoriteTodos = data?.filter((todo, i) => {
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

  if (data.length < 1) {
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
          id={todo.id}
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
          id={todo.id}
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
