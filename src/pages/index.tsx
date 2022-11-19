import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fullstack TODO app</title>
        <meta
          name="description"
          content="Fullstack todo app with favorites, editing, adding and removing individual items"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-[#1c0936] to-[#1f2257] text-white">
        <div className="mx-auto min-h-screen max-w-3xl "></div>
      </div>
    </>
  );
};

export default Home;
