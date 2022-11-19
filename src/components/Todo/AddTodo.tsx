import { useState } from "react";
import { trpc } from "../../utils/trpc";

function AddTodo() {
  const [todoContent, setTodoContent] = useState<string>("");
  const [isTodoFavorite, setIsTodoFavorite] = useState<boolean>(false);

  const { mutate, isLoading } = trpc.todo.add.useMutation();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ todoContent, isTodoFavorite });
    mutate({ content: todoContent, isFavorite: isTodoFavorite });
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <input
        type={"text"}
        placeholder="Todo"
        className="bg-gray-800"
        onChange={(e) => {
          setTodoContent(e.target.value);
        }}
        value={todoContent}
      />
      <label htmlFor="isFavorite">
        Set as favorite
        <input
          title="isFavorite"
          type={"checkbox"}
          onChange={(e) => {
            e.target.checked
              ? setIsTodoFavorite(true)
              : setIsTodoFavorite(false);
          }}
        />
      </label>
      <button type="submit" disabled={isLoading} className="bg-gray-700 p-4">
        Add todo
      </button>
    </form>
  );
}

export default AddTodo;
