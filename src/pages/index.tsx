import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import TodoList from "../components/Todo/TodoList";
import Header from "../components/Header/Header";
import { Navigation } from "../components/Navigation/Navigation";

const Home: NextPage = () => {
  const [filterFavorites, setFilterFavorites] = useState<boolean>(false);
  const [filterChecked, setFilterChecked] = useState<boolean>(false);

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
      <div className="bg-gradient-to-b from-[#224b7c] to-[#08183b] pb-20 text-white">
        <div className="mx-auto min-h-screen max-w-5xl">
          <Header>
            <Navigation
              setFilterFavorites={setFilterFavorites}
              filterFavorites={filterFavorites}
              filterChecked={filterChecked}
              setFilterChecked={setFilterChecked}
            />
          </Header>
          <TodoList
            filterFavorites={filterFavorites}
            filterChecked={filterChecked}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
