import { useState } from "react";
import { trpc } from "../../utils/trpc";
import type { Todo } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { LoadingDots } from "../UI";
type TodoListProps = {
  setTodoList: Dispatch<SetStateAction<Todo[]>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setFavoriteTodosList: Dispatch<SetStateAction<Todo[]>>;
};

function AddTodo({ setTodoList, setFavoriteTodosList }: TodoListProps) {
  const [todoContent, setTodoContent] = useState<string>("");
  const [isTodoFavorite, setIsTodoFavorite] = useState<boolean>(false);

  const { mutate, isLoading, isSuccess, error } = trpc.todo.add.useMutation({
    onSuccess(todo) {
      console.log(todo);
      setTodoList((prev) => [todo, ...prev]);
      if (todo.isFavorite) {
        setFavoriteTodosList((prev) => [todo, ...prev]);
      }
    },
  });

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ todoContent, isTodoFavorite });
    mutate({ content: todoContent, isFavorite: isTodoFavorite });
  };

  let feedbackContent;

  if (error?.data?.zodError) {
    feedbackContent = (
      <p className="text-center text-red-600">
        {error.data.zodError.fieldErrors.content}
      </p>
    );
  }
  
  if (isSuccess) {
    feedbackContent = <p className="text-center text-green-600">TODO added!</p>;
  }

  return isLoading ? (
    <LoadingDots />
  ) : (
    <form onSubmit={onSubmitHandler} className="flex flex-1 flex-col gap-4 ">
      <textarea
        placeholder="Todo"
        className="rounded-md bg-gray-300 p-2"
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
