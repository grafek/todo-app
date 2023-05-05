import { type NextPage } from "next";
import { useState } from "react";
import TodoList from "../components/Todo/TodoList";
import Header from "../components/Header";

const Home: NextPage = () => {
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterChecked, setFilterChecked] = useState(false);

  return (
    <>
      <Header
        filterChecked={filterChecked}
        filterFavorites={filterFavorites}
        setFilterChecked={setFilterChecked}
        setFilterFavorites={setFilterFavorites}
      />
      <TodoList
        filterFavorites={filterFavorites}
        filterChecked={filterChecked}
      />
    </>
  );
};

export default Home;
