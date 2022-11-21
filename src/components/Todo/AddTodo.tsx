import { useState } from "react";
import { trpc } from "../../utils/trpc";

function AddTodo() {
  const [todoContent, setTodoContent] = useState<string>("");
  const [isTodoFavorite, setIsTodoFavorite] = useState<boolean>(false);

  const { mutate, isLoading } = trpc.todo.add.useMutation();

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ todoContent, isTodoFavorite });
    mutate({ content: todoContent, isFavorite: isTodoFavorite });
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-1 flex-col gap-4 "
    >
      <textarea
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
      <button
        type="submit"
        disabled={isLoading}
        className="m-auto w-1/3 bg-gray-700 px-4 py-2 min-w-[100px]"
      >
        Add todo
      </button>
    </form>
  );
}

export default AddTodo;
