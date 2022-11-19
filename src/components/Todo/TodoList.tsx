import { trpc } from "../../utils/trpc";
import TodoItem from "./TodoItem";

function Todos() {
  const { data: todos, isFetching } = trpc.todo.getAll.useQuery(undefined);

  let todosContent;
  if (isFetching) {
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

export default Todos;
