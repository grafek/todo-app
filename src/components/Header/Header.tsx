import { useSession } from "next-auth/react";
import { AiOutlinePlus, AiFillStar } from "react-icons/ai";
import { getFirstNameFromSession } from "../../utils/getFirstName";

function Header() {
  const { data: sessionData } = useSession();

  const firstName = getFirstNameFromSession(sessionData);
  const welcomeMessage = firstName
    ? "👋 Hi, " + firstName + "!"
    : "👋 Hi, sign in to add some todos!";

  return (
    <header className="mx-auto flex max-w-3xl justify-between p-2">
      <button>Logo</button>

      <p className="max-w-[140px] text-center sm:max-w-none">
        {welcomeMessage}
      </p>
      
      <div className="flex gap-4">
        <button>
          {/* TODO: FILTER ITEMS WITH ONLY FAVORITES*/}
          <AiFillStar className="text-2xl text-yellow-300" />
        </button>

        <button>
          {/* TODO: MODAL WITH ADD TODO ITEM FORM */}
          <AiOutlinePlus className="text-2xl" />
        </button>
      </div>
    </header>
  );
}

export default Header;
