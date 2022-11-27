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
  toggleFavorites: boolean;
  todoList: Todo[];
  checkedTodosList: Todo[];
  favoriteTodosList: Todo[];
};

function TodoList({
  setTodoList,
  todoList,
  setCheckedTodosList,
  setFavoriteTodosList,
  toggleFavorites,
  checkedTodosList,
  favoriteTodosList,
}: TodoListProps) {
  const todosCtx = trpc.useContext();

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

  if (isLoading) {
    return <LoadingDots />;
  }

  if (isError) {
    return (todosContent = (
      <span className="text-center">Error: {error?.message}</span>
    ));
  }
  if (todoList.length < 1 && !toggleFavorites) {
    return (todosContent = (
      <p className="p-12 text-center">
        No TODOS found! <br /> Add some by clicking {"+"} sign in top right
        corner 🙂
      </p>
    ));
  }

  if (toggleFavorites && todoList.length < 1) {
    return (todosContent = (
      <p className="p-12 text-center">
        No favorites found!
        <br /> Add some by un-checking favorites filter and click on the star
        button next to a TODO 🙂
      </p>
    ));
  }

  const cancelFetching = todosCtx.todo.getAll.cancel();

  if (todoList && todoList.length > 0) {
    todosContent = todoList.map((todo) => {
      return (
        <TodoItem
          setTodoList={setTodoList}
          cancelFetching={cancelFetching}
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
      <ul className="flex flex-col gap-2">
        <AnimatePresence mode="sync">{todosContent}</AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;
