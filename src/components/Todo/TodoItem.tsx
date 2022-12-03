import type { Todo } from "@prisma/client";
import { useState } from "react";
import { AiOutlineClose, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { motion } from "framer-motion";
import { trpc } from "../../utils/trpc";
import { LoadingDots, Modal } from "../UI";
import { TRPCError } from "@trpc/server";

type TodoItemProps = {
  todo: Todo;
  content: string;
  id: string;
  isFavorite: boolean;
  createdAt: Date;
};

function TodoItem({ todo, content, createdAt, id }: TodoItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const utils = trpc.useContext();

  const { mutateAsync: deleteTodo, isLoading } = trpc.todo.delete.useMutation({
    async onMutate({ id }) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData((old) => old?.filter((todo) => todo.id !== id));

      setIsModalOpen(false);
      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
    onError(err, deletedTodo, ctx) {
      utils.todo.getAll.setData(ctx?.prevData);
      throw new TRPCError({
        message: JSON.stringify(err),
        code: "INTERNAL_SERVER_ERROR",
      });
    },
  });

  const { mutate: toggleChecked } = trpc.todo.toggleChecked.useMutation({
    async onMutate({ id, isChecked }) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData((old): Todo[] => {
        const selectedTodo = old?.find((todo: Todo) => todo.id === id);
        selectedTodo ? (selectedTodo.isChecked = isChecked) : null;
        return old ? old : [];
      });

      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
  });

  const { mutate: toggleFavorite } = trpc.todo.toggleFavorite.useMutation({
    async onMutate({ id, isFavorite }) {
      await utils.todo.getAll.cancel();

      const prevData = utils.todo.getAll.getData();

      utils.todo.getAll.setData((old): Todo[] => {
        const selectedTodo = old?.find((todo: Todo) => todo.id === id);
        selectedTodo ? (selectedTodo.isFavorite = isFavorite) : null;
        return old ? old : [];
      });

      return { prevData };
    },
    onSettled() {
      utils.todo.getAll.invalidate();
    },
  });

  const isChecked = todo.isChecked ? false : true;
  const isFavorite = todo.isFavorite ? false : true;

  const timestampContent = (
    <span className="absolute bottom-[2px] right-2  text-[13px] font-thin italic text-black ">
      created at: {createdAt.getHours()}:
      {createdAt.getUTCMinutes() < 10
        ? "0" + createdAt.getUTCMinutes()
        : createdAt.getUTCMinutes()}{" "}
      | {createdAt.getDate()}-{createdAt.getMonth() + 1}-
      {createdAt.getFullYear()}
    </span>
  );

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
      } md:overflow-none relative flex items-center justify-between overflow-auto rounded-md p-4 transition-colors duration-300 md:py-6`}
    >
      <span className="relative">
        {content}
        <div className="pointer-events-none absolute inset-0 flex origin-left items-center ">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: !isChecked ? "100%" : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-[3px] w-full translate-y-px  bg-red-500"
          />
        </div>
      </span>
      <span className="flex gap-2">
        <button
          onClick={() => {
            toggleChecked({ id, isChecked });
          }}
        >
          {!isChecked ? (
            <MdDone
              className="text-xl  text-green-400 md:text-2xl"
              title="Mark as unfinished"
            />
          ) : (
            <MdDone className="text-xl md:text-2xl" title="Mark as done" />
          )}
        </button>
        <button
          onClick={() => {
            toggleFavorite({ id, isFavorite });
          }}
        >
          {isFavorite ? (
            <AiOutlineStar
              className="text-xl md:text-2xl"
              title="Add to favorites"
            />
          ) : (
            <AiFillStar
              className="text-xl text-yellow-300 md:text-2xl"
              title="Remove from favorites"
            />
          )}
        </button>
        <button>
          <AiOutlineClose
            className="text-xl text-red-600 md:text-2xl"
            title="Remove TODO"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
        </button>
      </span>
      {timestampContent}
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
