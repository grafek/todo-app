import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { todoSchema, TODO_CONTENT_MAX_CHARS } from "../../schemas/todo.schema";
import { z } from "zod";
import { useAddTodo } from "../../hooks";

function AddTodo({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [todoContent, setTodoContent] = useState<string>("");
  const [todoCharacters, setTodoCharacters] = useState<number>(0);
  const [isTodoFavorite, setIsTodoFavorite] = useState<boolean>(false);
  const [error, setError] = useState("");

  const { mutate: addTodo, isLoading } = useAddTodo();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      todoSchema.parse({
        content: todoContent,
        isFavorite: isTodoFavorite,
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        if (e.formErrors.fieldErrors.content) {
          setError(e.formErrors.fieldErrors.content.toString());
        }
      }
      return;
    }
    setIsOpen(false);
    addTodo({ content: todoContent, isFavorite: isTodoFavorite });
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-1 flex-col gap-4 ">
      <textarea
        placeholder="Todo"
        className="rounded-md bg-gray-100 p-2 outline-none"
        maxLength={TODO_CONTENT_MAX_CHARS}
        onChange={(e) => {
          setTodoContent(e.target.value);
          setTodoCharacters(e.target.value.length);
        }}
        value={todoContent}
      />
      <span className="px-2 text-sm font-light">
        {todoCharacters}/{TODO_CONTENT_MAX_CHARS}
      </span>
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
      {error && <p className="text-center text-red-600">{error}</p>}
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
