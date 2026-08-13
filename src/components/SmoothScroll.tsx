"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Expose globally — header.tsx, banner.tsx and cta.tsx look for this
    // to route their scrollTo calls through Lenis instead of native scroll
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    // Start paused — loading screen is still active
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Resume only after loading is fully done
    const onLoadingDone = () => {
      lenis.start();
      // Give browser one frame to repaint before refreshing triggers
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    };

    if ((window as any).__loadingDone) {
      // Loading already finished before this mounted
      lenis.start();
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    } else {
      window.addEventListener("loading-done", onLoadingDone, { once: true });
    }

    return () => {
      window.removeEventListener("loading-done", onLoadingDone);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).__lenis === lenis) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}