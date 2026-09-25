"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollOptions {
  /** `hasNextPage` from the TanStack infinite query. */
  hasNextPage?: boolean;
  /** `isFetchingNextPage` — guards against firing while one page is in flight. */
  isFetching?: boolean;
  onLoadMore: () => void;
  /** How far ahead of the sentinel to start loading. */
  rootMargin?: string;
}

/**
 * Loads the next page when a sentinel element nears the viewport.
 *
 * Returns the ref to put on an empty element after the last item. The
 * observer is rebuilt whenever the guards change, which is what stops a
 * stale closure from requesting page 2 forever: once `hasNextPage` is false
 * no observer is attached at all.
 */
export const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>({
  hasNextPage,
  isFetching,
  onLoadMore,
  rootMargin = "600px",
}: InfiniteScrollOptions) => {
  const sentinelRef = useRef<T>(null);

  // Kept in a ref so the callback identity never re-creates the observer.
  const loadMore = useRef(onLoadMore);
  loadMore.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage || isFetching) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore.current();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, rootMargin]);

  return sentinelRef;
};
