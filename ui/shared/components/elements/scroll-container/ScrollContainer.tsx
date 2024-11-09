import React, {useEffect, useRef, useState} from "react";
import styles from './ScrollContainer.module.scss';

interface IScrollContainerProps {
    children: React.ReactNode;
    messageInputHeight: number;
}

const ScrollContainer: React.FC<IScrollContainerProps> = ({ children, messageInputHeight }) => {
    const scrollbar = useRef<HTMLDivElement>(null);
    const scrollableContent = useRef<HTMLDivElement>(null);
    const isDraggedRef = useRef<boolean>(false);
    const [startY, setStartY] = useState<number | null>(null);
    const [scrollTopStart, setScrollTopStart] = useState<number>(0);
    useEffect(() => {
        scrollableContent.current?.scrollTo({
            top: scrollableContent.current.scrollHeight,
            behavior: "smooth",
        });
        const containerHeight: number = scrollableContent.current.clientHeight;
        scrollbar.current.style.transform = `translateY(${containerHeight - 15}px)`
    }, [children,messageInputHeight]);
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
            const scrollbarHeight = scrollbar.current.parentNode.clientHeight;
            const scrollAmount = (deltaY / scrollbarHeight) * (contentHeight - visibleHeight);
            scrollableContent.current.scrollTop = scrollTopStart + scrollAmount;
            const scrollRatio = scrollableContent.current.scrollTop / (contentHeight - visibleHeight);
            scrollbar.current.style.transform = `translateY(${scrollRatio * (scrollbarHeight - scrollbar.current.clientHeight)}px)`;
        }
    };
    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const contentHeight = scrollableContent.current.scrollHeight;
        const visibleHeight = scrollableContent.current.clientHeight;
        const maxScrollableHeight = contentHeight - visibleHeight;
        const scrollRatio = maxScrollableHeight / 1000;
        const scrollAmount = event.deltaY * scrollRatio;
        scrollableContent.current.scrollTop += scrollAmount;
        const scrollbarHeight = scrollbar.current.parentNode.clientHeight;
        const thumbPosition = (scrollableContent.current.scrollTop / maxScrollableHeight) * (scrollbarHeight - scrollbar.current.clientHeight);
        scrollbar.current.style.transform = `translateY(${thumbPosition}px)`;
    };


    useEffect(() => {
        const scrollableElement = scrollableContent.current;
        if (scrollableElement) {
            window.addEventListener('wheel', handleWheel, { passive: false });
            return () => window.removeEventListener('wheel', handleWheel);
        }
    }, []);

    return (
        <div className={styles.scrollbarContainer}>
            <div ref={scrollableContent} className={styles.scrollbarContainer__content}>
                {children}
            </div>
            <div
                ref={scrollbar}
                onMouseDown={startDrag}
                className={styles.scrollbarContainer__scrollbar}
            ></div>
        </div>
    );
};
export default ScrollContainer