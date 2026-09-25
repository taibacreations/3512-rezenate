// components/GlobalGlow.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LOADING_Z = "9999"; // loading screen ke upar
const NORMAL_Z = "40";    // normal site par (header z-50 ke neeche)

const GlobalGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const accentColor = "#9564F4";

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Start: loading screen ke upar
    glow.style.zIndex = LOADING_Z;

    const quickX = gsap.quickTo(glow, "x", { duration: 1, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 1, ease: "power3.out" });

    let activated = false;

    const handleMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);
      // Loading screen par mouseenter fire nahi hota, is liye first move par full opacity
      if (!activated) {
        activated = true;
        gsap.to(glow, { opacity: 1, duration: 0.8 });
      }
    };

    const handleEnter = () => {
      activated = true;
      gsap.to(glow, { opacity: 1, duration: 0.8 });
    };
    const handleLeave = () => {
      activated = false;
      gsap.to(glow, { opacity: 0.4, duration: 0.8 });
    };

    // Loading khatam → glow wapas normal layer par
    let resetCall: gsap.core.Tween | null = null;
    const toNormalLayer = () => {
      glow.style.zIndex = NORMAL_Z;
    };
    const handleLoadingDone = () => {
      // Loading screen ke fade-out tak glow upar rahe
      resetCall = gsap.delayedCall(1.2, toNormalLayer);
    };

    // Set initial position to center
    quickX(window.innerWidth / 2);
    quickY(window.innerHeight / 2);

    // Set initial opacity
    gsap.set(glow, { opacity: 0.4 });

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("loading-done", handleLoadingDone, { once: true });
    window.addEventListener("header-done", toNormalLayer, { once: true });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("loading-done", handleLoadingDone);
      window.removeEventListener("header-done", toNormalLayer);
      resetCall?.kill();
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
      style={{
        zIndex: LOADING_Z,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${accentColor}99 0%, ${accentColor}66 40%, ${accentColor}00 70%)`,
        filter: "blur(100px)",
      }}
    />
  );
};

export default GlobalGlow;