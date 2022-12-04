import type { Dispatch, SetStateAction } from "react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { getFirstNameFromSession } from "../../utils/getFirstName";
import { Modal } from "../UI";
import AddTodo from "../Todo/AddTodo";

type HeaderPorps = {
  setFilterFavorites: Dispatch<SetStateAction<boolean>>;
  filterFavorites: boolean;
};

function Header({ setFilterFavorites, filterFavorites }: HeaderPorps) {
  const { data: sessionData } = useSession();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const firstName = getFirstNameFromSession(sessionData);
  const welcomeMessage = firstName ? (
    "👋 Hi, " + firstName + "!"
  ) : (
    <span>
      👋 Hi,{" "}
      <a
        className="cursor-pointer font-semibold italic underline
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
    <div className="hidden gap-4 md:flex">
      <button
        onClick={() => {
          setFilterFavorites((prev) => !prev);
        }}
      >
        {filterFavorites ? (
          <AiFillStar
            className="text-xl text-yellow-300 md:text-2xl"
            title="Show all todos"
          />
        ) : (
          <AiOutlineStar
            className="text-xl md:text-2xl"
            title="Filter favorite todos"
          />
        )}
      </button>

      <button>
        <AiOutlinePlus
          className="text-xl md:text-3xl"
          title="Add a TODO"
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
        <AddTodo setIsOpen={setIsModalOpen} />
      </Modal>
    </div>
  ) : null;
  return (
    <header className="mx-auto flex w-full justify-between p-2 pb-5">
      <button>Logo</button>
      <p className="max-w-[160px] text-center sm:max-w-none">
        {welcomeMessage}
      </p>
      {loggedInContent}
    </header>
  );
}

export default Header;
