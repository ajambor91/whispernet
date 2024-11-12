import React, {useEffect, useRef, useState, useCallback, useLayoutEffect} from "react";
import styles from './ScrollContainer.module.scss';

interface IScrollContainerProps {
    children: React.ReactNode;
    resize?: number;
    wheelOnId?: string;
    trigger?: any;
}

const ScrollContainer: React.FC<IScrollContainerProps> = ({ children, resize, wheelOnId, trigger }) => {
    let wheelOn = useRef<HTMLDivElement>(null);
    const scrollbar = useRef<HTMLDivElement>(null);
    const scrollableContent = useRef<HTMLDivElement>(null);
    const isDraggedRef = useRef<boolean>(false);
    const [startY, setStartY] = useState<number | null>(null);
    const [scrollTopStart, setScrollTopStart] = useState<number>(0);
    const [showScrollbar, setShowScrollbar] = useState<boolean>(false);



    // Funkcja aktualizująca widoczność scrollbara
    const updateScrollbarVisibility = useCallback(() => {
        const contentHeight = scrollableContent.current?.scrollHeight || 0;
        const visibleHeight = scrollableContent.current?.clientHeight || 0;

        setShowScrollbar(contentHeight > visibleHeight);
    }, []);

    useEffect(() => {
        updateScrollbarVisibility();
    }, [trigger]);

    useLayoutEffect(() => {
        console.log("EFFECT")
        updateScrollbarVisibility();
        wheelOn.current = document.getElementById(wheelOnId || "scrollable") as HTMLDivElement;

        // Dodanie listenera dla kółka myszy
        if (wheelOn.current) {
            wheelOn.current.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                wheelOn.current?.removeEventListener('wheel', handleWheel);
            };
        }
    }, [trigger, resize, children]); // Dependencies zapewniają aktualizację przy zmianie

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
            const scrollbarHeight = scrollbar.current.parentNode?.clientHeight;
            const scrollAmount = (deltaY / scrollbarHeight) * (contentHeight - visibleHeight);
            scrollableContent.current.scrollTop = scrollTopStart + scrollAmount;
            const scrollRatio = scrollableContent.current.scrollTop / (contentHeight - visibleHeight);
            scrollbar.current.style.transform = `translateY(${scrollRatio * (scrollbarHeight - scrollbar.current.clientHeight)}px)`;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        updateScrollbarVisibility();
        if (scrollbar.current) {
            const contentHeight = scrollableContent.current.scrollHeight;
            const visibleHeight = scrollableContent.current.clientHeight;
            const maxScrollableHeight = contentHeight - visibleHeight;
            const scrollRatio = maxScrollableHeight / 1000;
            const scrollAmount = event.deltaY * scrollRatio;
            scrollableContent.current.scrollTop += scrollAmount;

            const scrollbarHeight = scrollbar.current.parentNode?.clientHeight;
            const thumbPosition = (scrollableContent.current.scrollTop / maxScrollableHeight) * (scrollbarHeight - scrollbar.current.clientHeight);
            scrollbar.current.style.transform = `translateY(${thumbPosition}px)`;
        }

    };

    return (
        <div id="scrollable" className={styles.scrollableContainer}>
            <div className={styles.scrollableContainerContentWrapper}>
                <div ref={scrollableContent} className={styles.scrollableContainerContentWrapper__content}>
                    {children}
                </div>
            </div>
            {showScrollbar && (
                <div className={styles.scrollableContainerScrollbarWrapper}>
                    <div
                        ref={scrollbar}
                        onMouseDown={startDrag}
                        className={styles.scrollableContainerScrollbarWrapper__scrollbar}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default ScrollContainer;
