"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { LoadingData } from "@/sanity/lib/queries";

const FALLBACK = {
  headingPlain: "lead the way",
  tagline: "Leadership that resonates. Impact that lasts.",
};

interface LoadingScreenProps {
  data?: LoadingData | null;
}

const LoadingScreen = ({ data }: LoadingScreenProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const tagline = data?.tagline ?? FALLBACK.tagline;

  const wrapRef = useRef<HTMLElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bubbleCenterRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const bubbleImageRef = useRef<HTMLImageElement | null>(null);

  const [done, setDone] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    document.body.style.position = "fixed";
    document.body.style.top = "0px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");

    // ---------------------------------------------------------
    // INITIAL STATE
    // ---------------------------------------------------------
    gsap.set(paths[2], {
      scale: 0.25,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set([paths[0], paths[1]], {
      opacity: 0,
      scale: 1,
      transformOrigin: "center center",
    });
    gsap.set(contentRef.current, { opacity: 0, y: 20 });
    gsap.set(logoWrapRef.current, { opacity: 0 });
    gsap.set(groupRef.current, {
      scale: 1,
      opacity: 1,
      transformOrigin: "center center",
    });
    gsap.set(bubbleRef.current, {
      scaleX: 0.92,
      scaleY: 0.96,
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: "center center",
    });
    gsap.set(bubbleImageRef.current, { xPercent: -50, yPercent: -50 });

    // ---------------------------------------------------------
    // BUBBLE FLOAT — grouped, gentle
    // ---------------------------------------------------------
    const bubbleFloat = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "sine.inOut" },
    });

    bubbleFloat
      .to(
        bubbleRef.current,
        {
          x: 18,
          y: -14,
          rotation: 1.5,
          scaleX: 1.02,
          scaleY: 0.99,
          duration: 3.8,
        },
        0,
      )
      .to(
        bubbleRef.current,
        {
          x: -14,
          y: 12,
          rotation: -1.5,
          scaleX: 0.99,
          scaleY: 1.02,
          duration: 4.2,
        },
        3.8,
      )
      .to(
        bubbleRef.current,
        {
          x: 10,
          y: 16,
          rotation: 1.0,
          scaleX: 1.01,
          scaleY: 0.99,
          duration: 3.6,
        },
        8.0,
      )
      .to(
        bubbleRef.current,
        {
          x: -10,
          y: -10,
          rotation: -1.0,
          scaleX: 0.99,
          scaleY: 1.01,
          duration: 4.0,
        },
        11.6,
      );

    const bubbleImageFloat = gsap.to(bubbleImageRef.current, {
      x: -8,
      y: 6,
      rotation: -1.5,
      duration: 5.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // ---------------------------------------------------------
    // LOGO ASSEMBLY
    // ---------------------------------------------------------
    const assembleTl = gsap.timeline();

    assembleTl
      .to(
        contentRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0,
      )
      .to(
        logoWrapRef.current,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        0.3,
      )
      .fromTo(
        paths[2],
        { x: 30, y: -30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        0.5,
      )
      .to(paths[2], { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 1.0)
      .fromTo(
        paths[1],
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        1.4,
      )
      .fromTo(
        paths[0],
        { x: 70, y: -70, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        2.3,
      );

    // ---------------------------------------------------------
    // EXIT SEQUENCE
    // ---------------------------------------------------------
    const exitTimer = setTimeout(() => {
      bubbleFloat.kill();
      bubbleImageFloat.kill();

      const exitTl = gsap.timeline();

      // Step 1: Snap bubble to neutral
      exitTl.to(bubbleRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.25,
        ease: "power2.out",
      });

      // Step 2: Gently fade out bubble + text + logo (~1s total)
      exitTl.to(groupRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });

      // Step 3: Hide loading section — reveals Banner section underneath.
      // Same bg image (/banner.webp) on both, so this is a seamless swap, no flash.
      exitTl.set(wrapRef.current, { display: "none" });

      // Step 4: Fire event — Banner's purple shape rises from bottom into
      // position; once it lands, Banner itself fires the heading/para entrance.
      exitTl.call(() => {
        window.dispatchEvent(new Event("loading-image-landed"));
      });

      // Step 5: Cleanup
      exitTl.call(() => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        (window as any).__loadingDone = true;
        window.dispatchEvent(new Event("loading-done"));
        setDone(true);
      });
    }, 5000);

    return () => {
      clearTimeout(exitTimer);
      assembleTl.kill();
      bubbleFloat.kill();
      bubbleImageFloat.kill();
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <section
      ref={wrapRef}
      className="fixed inset-0 z-[100] flex min-h-screen w-full items-center justify-center overflow-hidden bg-[url('/banner.webp')] bg-cover bg-center bg-no-repeat"
    >
      <div
        ref={groupRef}
        className="relative flex h-full w-full items-center justify-center will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        {/* BUBBLE */}
        <div
          ref={bubbleCenterRef}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <div
            ref={bubbleRef}
            className="absolute overflow-hidden rounded-full will-change-transform"
            style={{
              inset: 0,
              margin: "auto",
              width: "min(110vw, 90vh, 850px)",
              height: "min(110vw, 90vh, 850px)",
              transformOrigin: "center center",
            }}
          >
            <img
              ref={bubbleImageRef}
              src="/test.png"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover will-change-transform"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-20 flex w-full h-full flex-col items-center justify-center px-4 text-center">
          <div ref={contentRef}>
            <h2 className="font-toruspro text-[40px] font-normal leading-[101%] tracking-[-0.04em] text-black md:text-[60px] lg:text-[72px]">
              {headingPlain}
            </h2>
            <p className="mt-[1.5vh] font-outfit text-[20px] leading-[115%] text-black md:text-[22px] lg:text-[24px]">
              {tagline}
            </p>
          </div>

          <div
            ref={logoWrapRef}
            className="mt-[4vh] flex flex-col items-center"
          >
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="51"
              viewBox="0 0 51 51"
              fill="none"
              className="h-[45px] w-[45px] md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]"
            >
              <path
                d="M50.1239 1.90735e-06H0L2.49058 2.50577C9.0288 9.08386 17.9205 12.7828 27.1952 12.7828H37.0313V22.6809C37.0313 31.9189 40.701 40.7785 47.2333 47.3107L50.1239 50.2014V1.90735e-06Z"
                fill="#9564F4"
              />
              <path
                d="M32.0737 17.9733H0.078125L8.36888 26.2641C11.2451 29.1403 15.146 30.7561 19.2135 30.7561C19.2135 34.9228 20.8687 38.9189 23.8151 41.8652L32.0737 50.1239V17.9733Z"
                fill="#9564F4"
              />
              <path
                d="M14.1772 50.1239V35.9467H0L14.1772 50.1239Z"
                fill="#9564F4"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingScreen;
