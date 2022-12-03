import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { LoadingDots } from "../UI";

function AddTodo() {
  const [todoContent, setTodoContent] = useState<string>("");
  const [isTodoFavorite, setIsTodoFavorite] = useState<boolean>(false);

  const utils = trpc.useContext();

  const {
    mutate: addTodo,
    isLoading,
    isSuccess,
    error,
  } = trpc.todo.add.useMutation({
    onSuccess() {
      setTodoContent("");
      setIsTodoFavorite(false);
      utils.todo.getAll.invalidate();
    },
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo({ content: todoContent, isFavorite: isTodoFavorite });
  };

  let feedbackContent;

  if (error?.data?.zodError) {
    feedbackContent = (
      <p className="text-center font-semibold text-red-600">
        {error.data.zodError.fieldErrors.content}
      </p>
    );
  }

  if (isSuccess) {
    feedbackContent = (
      <p className="text-center font-semibold text-green-600">TODO added!</p>
    );
  }

  return isLoading ? (
    <LoadingDots />
  ) : (
    <form onSubmit={submitHandler} className="flex flex-1 flex-col gap-4 ">
      <textarea
        placeholder="Todo"
        className="rounded-md bg-gray-100 p-2 outline-none"
        onChange={(e) => {
          setTodoContent(e.target.value);
        }}
        value={todoContent}
      />
      <label htmlFor="isFavorite" className="flex justify-between">
        Set as favorite?
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
      {feedbackContent}
      <button
        type="submit"
        disabled={isLoading}
        className="m-auto w-1/3 min-w-[100px] rounded-md bg-indigo-700 px-4 py-2 text-white"
      >
        Add todo
      </button>
    </form>
  );
}

export default AddTodo;
