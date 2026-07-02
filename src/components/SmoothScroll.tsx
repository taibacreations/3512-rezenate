// src/components/SmoothScroll.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialise Lenis
    const lenis = new Lenis({
      duration: 1.4,          // scroll travel time — higher = slower/smoother
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Plug Lenis into GSAP's ticker so ScrollTrigger stays in sync
    // Using gsap.ticker instead of requestAnimationFrame avoids double-RAF
    // and ensures ScrollTrigger.update() fires at exactly the right moment
    const onTick = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker gives seconds, lenis wants ms
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // prevent GSAP compensating for tab blur lag

    // Tell ScrollTrigger to use Lenis for scroll position
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}