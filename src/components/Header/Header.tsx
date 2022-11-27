import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import type { Todo } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { getFirstNameFromSession } from "../../utils/getFirstName";
import { Modal } from "../UI";
import AddTodo from "../Todo/AddTodo";

type TodoListProps = {
  setFavoriteTodosList: Dispatch<SetStateAction<Todo[]>>;
  setTodoList: Dispatch<SetStateAction<Todo[]>>;
  setToggleFavorites: Dispatch<SetStateAction<boolean>>;
  toggleFavorites: boolean;
};

function Header({
  setTodoList,
  setFavoriteTodosList,
  setToggleFavorites: setToggleFavorites,
  toggleFavorites,
}: TodoListProps) {
  const { data: sessionData } = useSession();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const firstName = getFirstNameFromSession(sessionData);
  const welcomeMessage = firstName ? (
    "👋 Hi, " + firstName + "!"
  ) : (
    <span>
      👋 Hi,{" "}
      <a
        className="font-semibold italic underline cursor-pointer
        "
        onClick={() => {
          signIn();
        }}
      >
        sign in
      </a>{" "}
      to add some todos!
    </span>
  );

  const loggedInContent = sessionData ? (
    <div className="flex gap-4">
      <button
        onClick={() => {
          setToggleFavorites((prev) => !prev);
        }}
      >
        {toggleFavorites ? (
          <AiFillStar className="text-xl text-yellow-300 md:text-2xl" />
        ) : (
          <AiOutlineStar className="text-xl md:text-2xl" />
        )}
      </button>

      <button>
        <AiOutlinePlus
          className="text-2xl"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </button>
      <Modal
        isOpen={isModalOpen}
        actionTitle="Add TODO"
        setIsOpen={setIsModalOpen}
      >
        <AddTodo
          setTodoList={setTodoList}
          setIsModalOpen={setIsModalOpen}
          setFavoriteTodosList={setFavoriteTodosList}
        />
      </Modal>
    </div>
  ) : null;
  return (
    <header className="mx-auto flex w-full justify-between pb-5 p-2">
      <button>Logo</button>
      <p className="max-w-[160px] text-center sm:max-w-none">
        {welcomeMessage}
      </p>
      {loggedInContent}
    </header>
  );
}

export default Header;
