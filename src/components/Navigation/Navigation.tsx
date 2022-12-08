import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { AiFillStar, AiOutlinePlus, AiOutlineStar } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import AddTodo from "../Todo/AddTodo";
import { Modal } from "../UI";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiLogIn, BiLogOut } from "react-icons/bi";

type NavigationProps = {
  setFilterFavorites: Dispatch<SetStateAction<boolean>>;
  filterFavorites: boolean;
  setFilterChecked: Dispatch<SetStateAction<boolean>>;
  filterChecked: boolean;
};

export function Navigation({
  setFilterFavorites,
  filterFavorites,
  filterChecked,
  setFilterChecked,
}: NavigationProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: sessionData } = useSession();

  return (
    <div
      className="fixed left-0 bottom-0 z-10 flex w-full justify-around gap-4 bg-[#142570]/80 py-2 md:static md:w-fit md:gap-4 md:bg-transparent
  md:py-0"
    >
      {sessionData ? (
        <>
          <button
            onClick={() => {
              setFilterFavorites((prev) => !prev);
            }}
          >
            {filterFavorites ? (
              <AiFillStar
                className="text-4xl text-yellow-300  md:text-2xl"
                title="Show all todos"
              />
            ) : (
              <AiOutlineStar
                className="text-4xl md:text-2xl"
                title="Filter favorite todos"
              />
            )}
          </button>
          <button
            onClick={() => {
              setFilterChecked((prev) => !prev);
            }}
          >
            {filterChecked ? (
              <MdDone
                className="text-4xl text-green-500 md:text-2xl"
                title="Filter checked todos"
              />
            ) : (
              <MdDone className="text-4xl md:text-2xl" title="Show all todos" />
            )}
          </button>

          <button>
            <AiOutlinePlus
              className="text-4xl md:text-2xl"
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
          <button className={`border-l border-gray-700 pl-6`}>
            {sessionData ? (
              <BiLogOut className="text-2xl" onClick={() => signOut()} />
            ) : (
              <BiLogIn className="text-2xl" onClick={() => signIn()} />
            )}
          </button>
        </>
      ) : (
        <span className="py-2">
          👋 Hi,{" "}
          <button
            className="cursor-pointer font-semibold italic underline
        "
            onClick={() => {
              signIn();
            }}
          >
            sign in
          </button>{" "}
          to add some todos!
        </span>
      )}
    </div>
  );
}
