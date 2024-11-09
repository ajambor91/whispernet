import React, {useEffect, useRef, useState} from "react";
import styles from './ScrollbarContainer.module.scss';

interface IScrollbarContainerProps {
    children: React.ReactNode;
    messageInputHeight: number;
}

export const ScrollbarContainer: React.FC<IScrollbarContainerProps> = ({ children, messageInputHeight }) => {
    const scrollbar = useRef<HTMLDivElement>(null);
    const scrollableContent = useRef<HTMLDivElement>(null);
    const isDraggedRef = useRef<boolean>(false); // Ref dla isDragged
    const [startY, setStartY] = useState<number | null>(null);
    const [scrollTopStart, setScrollTopStart] = useState<number>(0);
    useEffect(() => {
        scrollableContent.current?.scrollTo({
            top: scrollableContent.current.scrollHeight,
            behavior: "smooth", // lub "auto", jeśli nie chcesz płynnego przewijania
        });
        const containerHeight: number = scrollableContent.current.clientHeight;
        scrollbar.current.style.transform = `translateY(${containerHeight - 15}px)`
    }, [children,messageInputHeight]);
    // Funkcja inicjalizująca przeciąganie
    const startDrag = (e: React.MouseEvent) => {
        isDraggedRef.current = true; // Zmieniamy isDraggedRef zamiast stanu
        setStartY(e.clientY);
        setScrollTopStart(scrollableContent.current?.scrollTop || 0);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
        document.body.style.userSelect = 'none';
    };

    // Funkcja zatrzymująca przeciąganie
    const stopDrag = () => {
        isDraggedRef.current = false; // Zmieniamy isDraggedRef zamiast stanu
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
        document.body.style.userSelect = '';
    };

    // Funkcja do przeciągania
    const drag = (e: MouseEvent) => {
        console.log("STOP DRAG")

        if (isDraggedRef.current && startY !== null && scrollableContent.current && scrollbar.current) {
            const deltaY = e.clientY - startY; // Odległość przesunięcia myszy od punktu początkowego
            const contentHeight = scrollableContent.current.scrollHeight; // Pełna wysokość przewijalnej treści
            const visibleHeight = scrollableContent.current.clientHeight; // Wysokość widocznego obszaru
            const scrollbarHeight = scrollbar.current.parentNode.clientHeight; // Wysokość kontenera dla kulki

            // Przeliczenie proporcjonalnego przesunięcia przewijalnej treści
            const scrollAmount = (deltaY / scrollbarHeight) * (contentHeight - visibleHeight);

            // Aktualizacja pozycji przewijalnej treści
            scrollableContent.current.scrollTop = scrollTopStart + scrollAmount;

            // Obliczenie i ustawienie pozycji kulki (skala przewiniętego obszaru)
            const scrollRatio = scrollableContent.current.scrollTop / (contentHeight - visibleHeight);
            scrollbar.current.style.transform = `translateY(${scrollRatio * (scrollbarHeight - scrollbar.current.clientHeight)}px)`;
        }
    };

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
