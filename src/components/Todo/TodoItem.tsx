import { useState } from "react";
import { AiOutlineClose, AiFillStar, AiOutlineStar } from "react-icons/ai";
import Modal from "../Modal";

type TodoItemProps = {
  children: React.ReactNode;
};

function TodoItem({ children }: TodoItemProps) {
  const [favorite, setFavorite] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <li
      className={`${
        isModalOpen ? "bg-red-400 " : "bg-indigo-400 "
      } flex items-center justify-between rounded-md  p-2 transition-colors duration-300 md:p-3`}
    >
      <span>{children}</span>
      <span className="flex gap-2">
        <button
          onClick={() => {
            setFavorite((prev) => !prev);
          }}
        >
          {favorite ? (
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
        <Modal
          isOpen={isModalOpen}
          actionTitle="Remove TODO"
          setIsOpen={setIsModalOpen}
        >
          {/* ---- CONFIRM BTN */}
        </Modal>
      </span>
    </li>
  );
}

export default TodoItem;
