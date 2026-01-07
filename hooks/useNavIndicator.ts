import { useEffect } from "react";

export const useNavIndicator = ({
    pathname,
    containerRef,
    linkRefs,
    setIndicator,
}: any) => {
    useEffect(() => {
        if (!containerRef.current) return;

        const updateIndicator = () => {
            const activeLink = linkRefs.current[pathname];
            if (!activeLink || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();

            setIndicator({
                x: linkRect.left - containerRect.left,
                y: linkRect.top - containerRect.top,
                width: linkRect.width,
                height: linkRect.height,
            });
        };

        updateIndicator();

        const resizeObserver = new ResizeObserver(updateIndicator);
        resizeObserver.observe(containerRef.current);

        Object.values(linkRefs.current).forEach((el: any) => {
            if (el) resizeObserver.observe(el);
        });

        return () => resizeObserver.disconnect();
    }, [pathname]);
};