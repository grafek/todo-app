import type { Todo } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { AiOutlineClose, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { motion } from "framer-motion";
import { trpc } from "../../utils/trpc";
import { LoadingDots, Modal } from "../UI";

type TodoItemProps = {
  todo: Todo;
  content: string;
  id: string;
  isFavorite: boolean;
  createdAt: Date;
  setTodoList: Dispatch<SetStateAction<Todo[]>>;
  setCheckedTodosList: Dispatch<SetStateAction<Todo[]>>;
  setFavoriteTodosList: Dispatch<SetStateAction<Todo[]>>;
  checkedTodosList: Todo[];
  favoriteTodosList: Todo[];
  todoList: Todo[];
  cancelFetching: Promise<void>;
};

function TodoItem({
  cancelFetching,
  todo,
  content,
  createdAt,
  id,
  setFavoriteTodosList,
  favoriteTodosList,
  setCheckedTodosList,
  checkedTodosList,
  setTodoList,
}: TodoItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { mutate: deleteTodo, isLoading } = trpc.todo.delete.useMutation({
    onSuccess(todo) {
      setTodoList((prev) => prev.filter((item) => item.id !== todo.id));
      setFavoriteTodosList((prev) =>
        prev.filter((item) => item.id !== todo.id)
      );
      setIsModalOpen(false);
    },
  });

  const { mutate: toggleChecked } = trpc.todo.toggleChecked.useMutation();
  const { mutate: toggleFavorites } = trpc.todo.toggleFavorite.useMutation();

  const optimisticCheckTodos = async () => {
    if (checkedTodosList.some((item) => item.id === todo.id)) {
      setCheckedTodosList((prev) => prev.filter((item) => item.id !== todo.id));
    } else {
      setCheckedTodosList((prev) => [...prev, todo]);
    }
    await cancelFetching;
    toggleChecked({
      id,
      isChecked: checkedTodosList.some((todo) => todo.id === id) ? false : true,
    });
  };

  const optimisticFavoriteTodos = async () => {
    if (favoriteTodosList.some((item) => item.id === todo.id)) {
      await cancelFetching;
      setFavoriteTodosList((prev) =>
        prev.filter((item) => item.id !== todo.id)
        );
    } else {
      await cancelFetching;
      setFavoriteTodosList((prev) =>
        [...prev, todo].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    }
    toggleFavorites({
      id,
      isFavorite: favoriteTodosList.some((todo) => todo.id === id)
        ? false
        : true,
    });
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -30 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ scale: 0.7, opacity: 0 }}
      id={id}
      className={`${
        isModalOpen ? "bg-red-400 " : "bg-indigo-400 "
      } relative flex items-center justify-between rounded-md p-4 transition-colors duration-300 md:py-6`}
    >
      <span className="relative">
        {content}
        <div className="pointer-events-none absolute inset-0 flex origin-left items-center">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: checkedTodosList.some((todo) => todo.id === id)
                ? "100%"
                : 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-[3px] w-full translate-y-px bg-red-500"
          />
        </div>
      </span>
      <span className="relative flex gap-2">
        <button onClick={optimisticCheckTodos}>
          <MdDone className="text-xl text-green-400 md:text-2xl" />
        </button>
        <button onClick={optimisticFavoriteTodos}>
          {favoriteTodosList.some((todo) => todo.id === id) ? (
            <AiFillStar className="text-xl text-yellow-300 md:text-2xl" />
          ) : (
            <AiOutlineStar className="text-xl md:text-2xl" />
          )}
        </button>
        <button>
          <AiOutlineClose
            className="text-xl text-red-600 md:text-2xl"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
        </button>
      </span>
      <span className="absolute bottom-[2px] right-2  text-[12px] font-thin italic text-gray-200/70 ">
        created at: {createdAt.getHours()}:
        {createdAt.getUTCMinutes() < 10
          ? "0" + createdAt.getUTCMinutes()
          : createdAt.getUTCMinutes()}{" "}
        | {createdAt.getDate()}-{createdAt.getMonth()}-{createdAt.getFullYear()}
      </span>
      <Modal
        isOpen={isModalOpen}
        actionTitle="Remove TODO"
        setIsOpen={setIsModalOpen}
      >
        {isLoading ? (
          <LoadingDots />
        ) : (
          <>
            <p>Are you sure you want to remove this TODO?</p>
            <button
              className="m-auto w-1/3 min-w-[100px] rounded-md bg-red-500 px-4 py-2 text-white"
              onClick={() => {
                deleteTodo({ id });
              }}
            >
              Confirm
            </button>
          </>
        )}
      </Modal>
    </motion.li>
  );
}

export default TodoItem;
