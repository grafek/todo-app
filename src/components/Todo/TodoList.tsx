import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import TodoItem from "./TodoItem";

function TodoList() {
  const { data: todos, isFetching } = trpc.todo.getAll.useQuery(undefined);
  const { data: sessionData } = useSession();

  if (!sessionData) return null;

  let todosContent;
  if (isFetching) {
    // add loading spinner
    todosContent = <p>Fetching todos...</p>;
  }

  if (todos && todos.length > 0) {
    todosContent = todos.map((todo, i) => {
      return <TodoItem key={i}>{todo.content}</TodoItem>;
    });
  }

  return (
    <div className="p-2">
      <ul className="flex flex-col gap-2">{todosContent}</ul>
    </div>
  );
}

export default TodoList;
