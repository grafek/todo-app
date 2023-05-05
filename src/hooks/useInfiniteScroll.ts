import type { Todo } from "@prisma/client";
import type { InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect } from "react";

type useInfiniteScrollProps = {
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<{ todos: Todo[]; nextCursor: unknown }>
  >;
  hasNextPage: boolean | undefined;
};

const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
}: useInfiniteScrollProps) => {
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (hasNextPage) fetchNextPage();
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage]);
};

export default useInfiniteScroll;
