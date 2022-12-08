import { useSession } from "next-auth/react";
import { getFirstNameFromSession } from "../../utils/getFirstName";

type HeaderPorps = {
  children: React.ReactNode;
};

function Header({ children: Navigation }: HeaderPorps) {
  const { data: sessionData } = useSession();

  const firstName = getFirstNameFromSession(sessionData);
  const welcomeMessage = firstName ? (
    <p className="max-w-[160px] text-center sm:max-w-none">
      👋 Hi, {firstName} !
    </p>
  ) : null;

  return (
    <header className="mx-auto flex w-full items-center justify-center p-2 pb-5 md:justify-between">
      {welcomeMessage}
      {Navigation}
    </header>
  );
}

export default Header;
