import { useSession } from "next-auth/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { todoSchema } from "../../schemas/todo.schema";
import { z } from "zod";

function AddTodo({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [todoContent, setTodoContent] = useState<string>("");
  const [isTodoFavorite, setIsTodoFavorite] = useState<boolean>(false);
  const [error, setError] = useState("");

  const { data: sessionData } = useSession();

  const utils = trpc.useContext();

  if (!sessionData?.user) return null;

  let tempIds = 1;

  const { mutateAsync: addTodo, isLoading } = trpc.todo.add.useMutation({
    async onMutate(newTodo) {
      setIsOpen(false);
      await utils.todo.getAll.cancel();

      utils.todo.getAll.setData(
        (old) =>
          old && sessionData.user
            ? [
                {
                  ...newTodo,
                  createdAt: new Date(),
                  id: (tempIds++).toString(),
                  userId: sessionData.user.id,
                  isChecked: false,
                  updatedAt: new Date(),
                },
                ...old,
              ]
            : []
        //optimistic update with temporary clientside id
      );
    },
    onSuccess() {
      utils.todo.getAll.invalidate();
    },
  });

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
    addTodo({ content: todoContent, isFavorite: isTodoFavorite });
  };

  return (
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
