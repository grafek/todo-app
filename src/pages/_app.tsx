import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
      <SessionProvider session={session}>
        <div id="overlays" />
        <div className="bg-gradient-to-b from-[#224b7c] to-[#08183b] text-white">
          <div className="mx-auto min-h-screen max-w-5xl px-2">
            <Component {...pageProps} />
          </div>
        </div>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
