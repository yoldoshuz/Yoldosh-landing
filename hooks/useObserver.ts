import { useEffect, useRef } from "react";

export const useObserver = (callback: () => void, enabled: boolean) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!ref.current) return;

    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      {
        rootMargin: "400px",
      }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [enabled, callback]);

  return ref;
};
