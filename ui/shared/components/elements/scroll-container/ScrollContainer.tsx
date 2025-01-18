import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from './ScrollContainer.module.scss';

interface IScrollContainerProps {
    children: React.ReactNode[];
    scroll?: boolean;
    resize?: number;
    wheelOnId?: string;
}

const ScrollContainer: React.FC<IScrollContainerProps> = ({ children, resize, scroll, wheelOnId }) => {
    const wheelOn = useRef<HTMLDivElement>(null);
    const scrollbar = useRef<HTMLDivElement>(null);
    const scrollableContent = useRef<HTMLDivElement>(null);
    const isDraggedRef = useRef(false);
    const [startY, setStartY] = useState<number | null>(null);
    const [scrollTopStart, setScrollTopStart] = useState(0);
    const [showScrollbar, setShowScrollbar] = useState(false);

    const updateScrollbarVisibility = useCallback(() => {
        const contentHeight = scrollableContent.current?.scrollHeight || 0;
        const visibleHeight = scrollableContent.current?.clientHeight || 0;
        setShowScrollbar(contentHeight > visibleHeight);
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(updateScrollbarVisibility);
        if (scrollableContent.current) {
            resizeObserver.observe(scrollableContent.current);
        }
        return () => resizeObserver.disconnect();
    }, [updateScrollbarVisibility]);

    useEffect(() => {
        updateScrollbarVisibility();
        scrollableContent.current.scrollTop += scrollableContent.current.children[scrollableContent.current.children.length - 1]?.clientHeight;

        wheelOn.current = document.getElementById(wheelOnId || "scrollable") as HTMLDivElement;
        if (wheelOn.current) {
            wheelOn.current.addEventListener('wheel', handleWheel, { passive: false });
            return () => wheelOn.current?.removeEventListener('wheel', handleWheel);
        }
    }, [updateScrollbarVisibility, children, wheelOnId]);

    const startDrag = (e: React.MouseEvent) => {
        isDraggedRef.current = true;
        setStartY(e.clientY);
        setScrollTopStart(scrollableContent.current?.scrollTop || 0);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
        document.body.style.userSelect = 'none';
    };

    const stopDrag = () => {
        isDraggedRef.current = false;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
        document.body.style.userSelect = '';
    };

    const drag = (e: MouseEvent) => {
        if (isDraggedRef.current && startY !== null && scrollableContent.current && scrollbar.current) {
            const deltaY = e.clientY - startY;
            const contentHeight = scrollableContent.current.scrollHeight;
            const visibleHeight = scrollableContent.current.clientHeight;
            const scrollbarHeight = scrollbar.current.parentNode?.clientHeight || 1;
            const scrollAmount = (deltaY / scrollbarHeight) * (contentHeight - visibleHeight);
            scrollableContent.current.scrollTop = scrollTopStart + scrollAmount;
            const scrollRatio = scrollableContent.current.scrollTop / (contentHeight - visibleHeight);
            scrollbar.current.style.transform = `translateY(${scrollRatio * (scrollbarHeight - scrollbar.current.clientHeight)}px)`;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        updateScrollbarVisibility();
        if (scrollbar.current && scrollableContent.current) {
            const contentHeight = scrollableContent.current.scrollHeight;
            const visibleHeight = scrollableContent.current.clientHeight;
            const maxScrollableHeight = contentHeight - visibleHeight;
            const scrollAmount = event.deltaY * (maxScrollableHeight / 1000);
            scrollableContent.current.scrollTop += scrollAmount;

            const scrollbarHeight = scrollbar.current.parentNode?.clientHeight || 1;
            const thumbPosition = (scrollableContent.current.scrollTop / maxScrollableHeight) * (scrollbarHeight - scrollbar.current.clientHeight);
            scrollbar.current.style.transform = `translateY(${thumbPosition}px)`;
        }
    };

    return (
        <div id="scrollable" className={styles["scrollable-container"]}>
            <div className={styles["scrollable-container-content-wrapper"]}>
                <div ref={scrollableContent} className={styles["scrollable-container-content-wrapper__content"]}>
                    {children}
                </div>
            </div>
            {showScrollbar && (
                <div className={styles["scrollable-container-scrollbar-wrapper"]}>
                    <div
                        ref={scrollbar}
                        onMouseDown={startDrag}
                        className={styles["scrollable-container-scrollbar-wrapper__scrollbar"]}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default ScrollContainer;
