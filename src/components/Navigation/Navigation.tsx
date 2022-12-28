import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import { AiFillStar, AiOutlinePlus, AiOutlineStar } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import AddTodo from "../Todo/AddTodo";
import { Modal } from "../UI";
import { useModal } from "../../hooks";

type NavigationProps = {
  setFilterFavorites: Dispatch<SetStateAction<boolean>>;
  filterFavorites: boolean;
  setFilterChecked: Dispatch<SetStateAction<boolean>>;
  filterChecked: boolean;
};

function Navigation({
  setFilterFavorites,
  filterFavorites,
  filterChecked,
  setFilterChecked,
}: NavigationProps) {
  const { hideModal, isModalOpen, showModal: showAddTodoModal } = useModal();

  const {
    showModal: showLogoutModal,
    isModalOpen: isLogoutModalOpen,
    hideModal: hideLogoutModal,
  } = useModal();

  const { data: sessionData } = useSession();

  const handleAdd = useCallback(() => {
    showAddTodoModal();
  }, [showAddTodoModal]);

  const handleLogout = useCallback(() => {
    showLogoutModal();
  }, [showLogoutModal]);

  return (
    <div className="fixed left-0 bottom-0 z-10 flex w-full justify-around gap-4 bg-[#142570]/80 px-10 py-2 md:static md:w-fit md:gap-4 md:bg-transparent md:py-0 md:px-0">
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
              onClick={handleAdd}
            />
          </button>
          <Modal
            isOpen={isModalOpen}
            actionTitle="Add TODO"
            hideModal={hideModal}
          >
            <AddTodo hideModal={hideModal} />
          </Modal>
          <button className={`border-l border-gray-700 pl-6`}>
            {sessionData ? (
              <>
                <BiLogOut
                  title="Logout"
                  className="text-3xl md:text-2xl"
                  onClick={handleLogout}
                />
                <Modal
                  isOpen={isLogoutModalOpen}
                  actionTitle="Sign out"
                  hideModal={hideLogoutModal}
                >
                  <h1>Are you sure you want to sign out?</h1>
                  <button
                    className="m-auto w-1/3 min-w-[100px] rounded-md bg-red-600 px-4 py-2 text-white"
                    title="Logout"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
                </Modal>
              </>
            ) : (
              <BiLogIn
                title="Login"
                className="text-3xl md:text-2xl"
                onClick={() => signIn()}
              />
            )}
          </button>
        </>
      ) : (
        <span className="py-2">
          👋 Hi,{" "}
          <button
            className="cursor-pointer font-semibold italic underline"
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
export default Navigation;
