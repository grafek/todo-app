import type { Todo } from "@prisma/client";
import { AiOutlineClose, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { motion } from "framer-motion";
import { Modal } from "../UI";
import {
  useDeleteTodo,
  useModal,
  useToggleCheckedTodo,
  useToggleFavoriteTodo,
} from "../../hooks/";
import { getTime, getDate } from "../../utils";

type TodoItemProps = {
  todo: Todo;
};

function TodoItem({ todo }: TodoItemProps) {
  const { id, content, createdAt, isChecked, isFavorite } = todo;

  const { isModalOpen, hideModal, showModal } = useModal();

  const { mutate: deleteTodo } = useDeleteTodo();
  const { mutate: toggleFavorite } = useToggleFavoriteTodo();
  const { mutate: toggleChecked } = useToggleCheckedTodo();

  const isToggledCheck = isChecked ? false : true;
  const isToggledFavorite = isFavorite ? false : true;

  const timestampContent = (
    <span className="absolute bottom-[1px] right-2 text-[13px] font-thin italic text-black ">
      created at: {getTime(createdAt) + " | " + getDate(createdAt)}
    </span>
  );

  const hasServerId = id.length > 10;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -30 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ scale: 0.7, opacity: 0 }}
      className={`${
        isModalOpen ? "bg-red-400 " : "bg-blue-400 odd:bg-blue-500"
      } ${
        isChecked
          ? "italic line-through decoration-red-600/50 decoration-2"
          : ""
      } relative flex items-center justify-between rounded-md p-4 transition-colors duration-300 md:py-6`}
    >
      <span className="relative">{content}</span>
      <span className="flex gap-2">
        <button
          className="text-2xl"
          onClick={() => {
            toggleChecked({ id, isChecked: isToggledCheck });
          }}
        >
          {isChecked ? (
            <MdDone className="text-green-400" title="Mark as unfinished" />
          ) : (
            <MdDone title="Mark as done" />
          )}
        </button>
        <button
          className="text-2xl"
          onClick={() => {
            toggleFavorite({ id, isFavorite: isToggledFavorite });
          }}
        >
          {isFavorite ? (
            <AiFillStar
              className="text-yellow-300"
              title="Remove from favorites"
            />
          ) : (
            <AiOutlineStar title="Add to favorites" />
          )}
        </button>
        <button
          className={`${
            hasServerId ? "text-red-600" : "text-white"
          } text-2xl transition-colors`}
          title="Remove TODO"
          onClick={() => {
            if (hasServerId) {
              showModal();
            }
          }}
        >
          <AiOutlineClose />
        </button>
      </span>
      {timestampContent}

      <Modal
        isOpen={isModalOpen}
        actionTitle="Remove TODO"
        hideModal={hideModal}
      >
        <>
          <p>Are you sure you want to remove this TODO?</p>
          <button
            className="m-auto w-1/3 min-w-[100px] rounded-md bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              hideModal();
              deleteTodo({ id });
            }}
          >
            Confirm
          </button>
        </>
      </Modal>
    </motion.li>
  );
}

export default TodoItem;
