import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import TodoList from "../components/Todo/TodoList";
import Header from "../components/Header/Header";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const authContent = (
    <div className="flex flex-col items-center justify-center py-48 ">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Fullstack TODO app</title>
        <meta
          name="description"
          content="Fullstack todo list with favorites, editing, adding and removing individual items"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="overlays" />
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="mx-auto min-h-screen p-2 max-w-3xl ">
          <Header />
          <TodoList />
          {authContent}
        </div>
      </div>
    </>
  );
};

export default Home;
