'use client'
import { useEffect, useState } from "react"

export default function BackToTop({ target }) {
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
        // Ce code ne s'exécute que dans le navigateur
        if (typeof window !== "undefined") {
            const onScroll = () => {
                setHasScrolled(window.scrollY > 100);
            };

            window.addEventListener("scroll", onScroll);
            return () => window.removeEventListener("scroll", onScroll);
        }
    }, []);

    const handleClick = () => {
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            const targetElement = document.querySelector(target);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <>
            {hasScrolled && (
                <button className="btn btn-primary"  onClick={handleClick}>
                    Back to top
                </button>

            )}
        </>
    )
}
