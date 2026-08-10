"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { LoadingData } from "@/sanity/lib/queries";

const FALLBACK = {
  headingPlain: "lead the way",
  tagline: "Leadership that resonates. Impact that lasts.",
  loadingLabel: "Loading",
};

interface LoadingScreenProps {
  data?: LoadingData | null;
}

const LoadingScreen = ({ data }: LoadingScreenProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const tagline = data?.tagline ?? FALLBACK.tagline;
  const loadingLabel = data?.loadingLabel ?? FALLBACK.loadingLabel;

  const wrapRef = useRef<HTMLElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const spinnerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bubbleCenterRef = useRef<HTMLDivElement | null>(null); // ← pure CSS centering wrapper
  const bubbleRef = useRef<HTMLDivElement | null>(null);       // ← GSAP animates only this
  const bubbleImageRef = useRef<HTMLImageElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

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

    /*
     * ---------------------------------------------------------
     * INITIAL STATE
     * ---------------------------------------------------------
     */

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

    gsap.set(contentRef.current, {
      opacity: 0,
      y: 20,
    });

    gsap.set(spinnerRef.current, {
      opacity: 0,
    });

    /*
     * bubbleCenterRef is a pure CSS centering wrapper.
     * GSAP never touches it — so Tailwind's
     * -translate-x-1/2 / -translate-y-1/2 on that div
     * are never overwritten and centering is always correct.
     *
     * bubbleRef is what GSAP animates (x, y, scale, rotation).
     * It starts at 0,0 which is the center of bubbleCenterRef.
     */
    gsap.set(bubbleRef.current, {
      scaleX: 0.92,
      scaleY: 0.96,
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: "center center",
    });

    /*
     * Image — GSAP takes full ownership of its transform via
     * xPercent/yPercent so subsequent x/y/rotation tweens
     * don't lose the -50% centering.
     */
    gsap.set(bubbleImageRef.current, {
      xPercent: -50,
      yPercent: -50,
    });

    /*
     * ---------------------------------------------------------
     * BUBBLE MOVEMENT
     * ---------------------------------------------------------
     */

    const bubbleFloat = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: {
        ease: "sine.inOut",
      },
    });

    bubbleFloat
      .to(
        bubbleRef.current,
        {
          x: 42,
          y: -30,
          rotation: 4.5,
          scaleX: 1.07,
          scaleY: 0.95,
          duration: 4.2,
        },
        0,
      )
      .to(
        bubbleRef.current,
        {
          x: -36,
          y: 24,
          rotation: -4,
          scaleX: 0.94,
          scaleY: 1.06,
          duration: 4.8,
        },
        4.2,
      )
      .to(
        bubbleRef.current,
        {
          x: 22,
          y: 34,
          rotation: 3,
          scaleX: 1.05,
          scaleY: 0.96,
          duration: 4.0,
        },
        9.0,
      )
      .to(
        bubbleRef.current,
        {
          x: -20,
          y: -22,
          rotation: -2.5,
          scaleX: 0.97,
          scaleY: 1.04,
          duration: 4.5,
        },
        13.0,
      );

    const bubbleImageFloat = gsap.to(bubbleImageRef.current, {
      x: -20,
      y: 14,
      rotation: -4.5,
      duration: 6.0,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    /*
     * ---------------------------------------------------------
     * LOGO ASSEMBLY
     * ---------------------------------------------------------
     */

    const assembleTl = gsap.timeline();

    assembleTl
      .fromTo(
        paths[2],
        { x: 30, y: -30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        0,
      )
      .to(paths[2], { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.5)
      .fromTo(
        paths[1],
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        0.9,
      )
      .fromTo(
        paths[0],
        { x: 70, y: -70, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        1.8,
      )
      .to(
        contentRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        2,
      )
      .to(
        spinnerRef.current,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        2.3,
      );

    /*
     * ---------------------------------------------------------
     * EXIT
     * ---------------------------------------------------------
     */

    const exitTimer = setTimeout(() => {
      bubbleFloat.kill();
      bubbleImageFloat.kill();

      const exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.left = "";
          document.body.style.right = "";
          document.body.style.width = "";
          document.body.style.overflow = "";

          window.scrollTo(0, 0);
          setDone(true);
          (window as any).__loadingDone = true;
          window.dispatchEvent(new Event("loading-done"));
        },
      });

      exitTl.to(
        [logoRef.current, svgRef.current, contentRef.current, spinnerRef.current],
        { opacity: 0, duration: 0.25, ease: "power2.inOut" },
      );

      const bubble = bubbleRef.current;

      if (bubble) {
        const rect = bubble.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const distanceToCorner = Math.sqrt(
          Math.pow(vw / 2, 2) + Math.pow(vh / 2, 2),
        );

        const bubbleRadius = Math.max(rect.width, rect.height) / 2;
        const scaleNeeded = (distanceToCorner / bubbleRadius) * 1.25;

        /*
         * x:0, y:0 snaps bubble back to the center of its CSS
         * wrapper before it expands — guarantees it covers
         * the screen from the middle regardless of where the
         * float animation left it.
         */
        exitTl.to(
          bubble,
          {
            scale: Math.max(scaleNeeded, 4),
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.5,
            ease: "power2.in",
            transformOrigin: "center center",
          },
          "-=0.05",
        );

        exitTl.call(() => {
          window.dispatchEvent(new Event("loading-image-landed"));
        });

        exitTl.set(wrapRef.current, { display: "none" });
      } else {
        exitTl.set(wrapRef.current, { display: "none" });
      }
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
      {/*
       * =====================================================
       * BUBBLE
       *
       * Two-div pattern — the only reliable way to mix
       * CSS centering with GSAP transforms:
       *
       *   bubbleCenterRef  → absolute left-1/2 top-1/2
       *                      -translate-x-1/2 -translate-y-1/2
       *                      GSAP never touches this div.
       *
       *   bubbleRef        → h/w, clip, rounded-full
       *                      GSAP animates ONLY this div.
       *                      No Tailwind translate classes here.
       *
       * This eliminates the conflict where GSAP's inline
       * transform overwrites Tailwind's translate classes
       * and the bubble ends up off-center.
       * =====================================================
       */}
      <div
        ref={bubbleCenterRef}
        className="
          absolute
          left-1/2
          top-1/2
          z-10
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <div
          ref={bubbleRef}
          className="
            h-[105vh]
            w-[105vh]
            overflow-hidden
            rounded-full
            will-change-transform
          "
          style={{ transformOrigin: "center center" }}
        >
          <img
            ref={bubbleImageRef}
            src="/test.png"
            alt=""
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-1/2
              h-full
              w-full
              max-w-none
              -translate-x-1/2
              -translate-y-1/2
              object-cover
              will-change-transform
            "
          />
        </div>
      </div>

      {/*
       * =====================================================
       * CONTENT
       * =====================================================
       */}
      <div
        className="
          relative
          z-20
          flex
          h-[940px]
          w-[1254px]
          flex-col
          items-center
          justify-center
          px-4
          text-center
          md:justify-start
          md:pt-[30vh]
          xl:pt-[23.5vh]
        "
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          {/* Exact SVG logo code preserved */}
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width="51"
            height="51"
            viewBox="0 0 51 51"
            fill="none"
            className="h-[44px] w-[44px]"
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

          <img
            ref={logoRef}
            src="/logos.webp"
            alt="Rezenate"
            className="h-auto w-[140px] md:w-[170px] lg:w-[203px]"
          />
        </div>

        <div ref={contentRef} className="mt-[3vh] md:mt-[6vh]">
          <h2
            className="
              font-toruspro
              text-[40px]
              font-normal
              leading-[101%]
              tracking-[-0.04em]
              text-black
              md:text-[60px]
              lg:text-[72px]
            "
          >
            {headingPlain}
          </h2>

          <p
            className="
              mt-[1.5vh]
              font-outfit
              text-[20px]
              leading-[115%]
              text-black
              md:text-[22px]
              lg:text-[24px]
            "
          >
            {tagline}
          </p>
        </div>

        <div
          ref={spinnerRef}
          className="
            mt-[4vh]
            flex
            flex-col
            items-center
            md:gap-3
          "
        >
          <svg
            className="
              h-[45px]
              w-[45px]
              animate-spin
              md:h-[60px]
              md:w-[60px]
              lg:h-[83px]
              lg:w-[83px]
            "
            width="83"
            height="83"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="20" stroke="#dec7ff" strokeWidth="3" />

            <path
              d="M44 24C44 13 35 4 24 4"
              stroke="#9564F4"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <p
            className="
              font-outfit
              text-[18px]
              leading-[115%]
              text-black
              md:text-[20px]
              lg:text-[24px]
            "
          >
            {loadingLabel}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoadingScreen;