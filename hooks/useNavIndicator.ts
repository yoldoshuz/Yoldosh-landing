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
            const matchingHrefs = Object.keys(linkRefs.current).filter((href) => {
                if (href === "/") return pathname === "/";
                return pathname === href || pathname.startsWith(href + "/");
            });

            if (matchingHrefs.length === 0) {
                setIndicator({ x: 0, y: 0, width: 0, height: 0 });
                return;
            }

            // Find the longest matching href (deepest nested if present)
            const activeHref = matchingHrefs.reduce((a, b) => (a.length > b.length ? a : b));
            const activeLink = linkRefs.current[activeHref];

            if (!activeLink || !containerRef.current) {
                setIndicator({ x: 0, y: 0, width: 0, height: 0 });
                return;
            }

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