import type { Todo } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import TodoItem from "./TodoItem";
import { LoadingDots } from "../UI";
import { AnimatePresence } from "framer-motion";

type TodoListProps = {
  setTodoList: Dispatch<SetStateAction<Todo[]>>;
  setCheckedTodosList: Dispatch<SetStateAction<Todo[]>>;
  setFavoriteTodosList: Dispatch<SetStateAction<Todo[]>>;
  todoList: Todo[];
  checkedTodosList: Todo[];
  favoriteTodosList: Todo[];
};

function TodoList({
  setTodoList,
  todoList,
  setCheckedTodosList,
  setFavoriteTodosList,
  checkedTodosList,
  favoriteTodosList,
}: TodoListProps) {
  const { isLoading, isError, error } = trpc.todo.getAll.useQuery(undefined, {
    onSuccess(todos) {
      setTodoList(todos);
      const checked = todos.filter((item) => item.isChecked);
      setCheckedTodosList(checked);
      const favorite = todos.filter((item) => item.isFavorite);
      setFavoriteTodosList(favorite);
    },
  });

  const { data: sessionData } = useSession();

  if (!sessionData) return null;

  let todosContent;
  if (isError) {
    return (todosContent = <span>Error: {error?.message}</span>);
  }

  if (todoList && todoList.length > 0) {
    todosContent = todoList.map((todo) => {
      return (
        <TodoItem
          setTodoList={setTodoList}
          todo={todo}
          key={todo.id}
          id={todo.id}
          content={todo.content}
          createdAt={todo.createdAt}
          isFavorite={todo.isFavorite}
          todoList={todoList}
          setFavoriteTodosList={setFavoriteTodosList}
          setCheckedTodosList={setCheckedTodosList}
          checkedTodosList={checkedTodosList}
          favoriteTodosList={favoriteTodosList}
        />
      );
    });
  }

  return (
    <div className="p-2">
      {isLoading ? (
        <LoadingDots />
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence mode="sync">{todosContent}</AnimatePresence>
        </ul>
      )}
    </div>
  );
}

export default TodoList;
