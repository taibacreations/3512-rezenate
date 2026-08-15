// components/GlobalGlow.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const GlobalGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const accentColor = "#9564F4";

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 1, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 1, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);
    };

    const handleEnter = () => gsap.to(glow, { opacity: 1, duration: 0.8 });
    const handleLeave = () => gsap.to(glow, { opacity: 0.4, duration: 0.8 });

    // Set initial position to center
    quickX(window.innerWidth / 2);
    quickY(window.innerHeight / 2);

    // Set initial opacity
    gsap.set(glow, { opacity: 0.4 });

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-40"
      style={{
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${accentColor}99 0%, ${accentColor}66 40%, ${accentColor}00 70%)`,
        filter: "blur(100px)",
      }}
    />
  );
};

export default GlobalGlow;