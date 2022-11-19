import { useState } from "react";
import { AiOutlineClose, AiFillStar, AiOutlineStar } from "react-icons/ai";

type TodoItemProps = {
  children: React.ReactNode;
};

function TodoItem({ children }: TodoItemProps) {
  const [favorite, setFavorite] = useState<boolean>(false);

  return (
    <li className="flex items-center justify-between rounded-md bg-indigo-400 p-2 md:p-3">
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
          <AiOutlineClose className="text-xl text-red-600 md:text-2xl" />
        </button>
      </span>
    </li>
  );
}

export default TodoItem;
