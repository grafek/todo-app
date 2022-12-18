import { useSession } from "next-auth/react";
import { getFirstName } from "../../utils/";

type HeaderPorps = {
  children: React.ReactNode;
};

function Header({ children: Navigation }: HeaderPorps) {
  const { data: sessionData } = useSession();

  const firstName = getFirstName(sessionData);
  const welcomeMessage = firstName ? (
    <p className="text-center sm:max-w-none">👋 Hi, {firstName} !</p>
  ) : null;

  return (
    <header className="mx-auto flex w-full items-center justify-center p-2 pb-5 md:justify-between">
      {welcomeMessage}
      {Navigation}
    </header>
  );
}

export default Header;
