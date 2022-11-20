import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { AiOutlinePlus, AiFillStar } from "react-icons/ai";
import { getFirstNameFromSession } from "../../utils/getFirstName";
import Modal from "../Modal";
import AddTodo from "../Todo/AddTodo";

function Header() {
  const { data: sessionData } = useSession();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const firstName = getFirstNameFromSession(sessionData);
  const welcomeMessage = firstName ? (
    "👋 Hi, " + firstName + "!"
  ) : (
    <span>
      👋 Hi,{" "}
      <a
        className="font-semibold italic underline
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
      <button>
        {/* TODO: FILTER ITEMS WITH ONLY FAVORITES*/}
        <AiFillStar className="text-2xl text-yellow-300" />
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
        <AddTodo />
      </Modal>
    </div>
  ) : null;
  return (
    <header className="mx-auto flex w-full max-w-3xl justify-between pb-5">
      <button>Logo</button>
      <p className="max-w-[160px] text-center sm:max-w-none">
        {welcomeMessage}
      </p>
      {loggedInContent}
    </header>
  );
}

export default Header;
