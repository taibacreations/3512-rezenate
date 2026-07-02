// LoadingScreen.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const wrapRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ---- scroll lock that does NOT change layout width ----
    // overflow:hidden removes the scrollbar, which shrinks the viewport's
    // available width for the duration of loading. Every section mounted
    // underneath computes its widths/positions (and any ScrollTrigger
    // start values) against that temporarily-wrong width. The moment
    // loading ends and overflow is restored, the scrollbar reappears and
    // the page snaps back to its real width — everything measured during
    // loading is now stale. position:fixed on body locks scroll without
    // ever touching the scrollbar or layout width, so nothing underneath
    // is measuring against incorrect dimensions in the first place.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");

    gsap.set(paths[2], { scale: 0.25, opacity: 0, transformOrigin: "center center" });
    gsap.set([paths[0], paths[1]], { opacity: 0, scale: 1, transformOrigin: "center center" });

    const assembleTl = gsap.timeline();
    assembleTl
      .fromTo(
        paths[2],
        { x: 30, y: -30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        0
      )
      .to(paths[2], { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.5)
      .fromTo(
        paths[1],
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        0.9
      )
      .fromTo(
        paths[0],
        { x: 70, y: -70, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        1.8
      );

    const counter = { value: 0 };
    gsap.to(counter, {
      value: 100,
      duration: 2.6,
      delay: 0.2,
      ease: "power1.inOut",
      onUpdate: () => setProgress(Math.floor(counter.value)),
      onComplete: () => {
        const exitTl = gsap.timeline({
          onComplete: () => {
            // ---- unlock scroll and restore exact prior position ----
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollY);

            onComplete();

            // ---- let layout settle for one frame, then force every
            // ScrollTrigger on the page to recalculate from scratch,
            // now that real layout dimensions are finally in effect ----
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                ScrollTrigger.refresh();
              });
            });
          },
        });

        exitTl
          .to([svgRef.current, counterWrapRef.current], {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power2.in",
          })
          .to(
            wrapRef.current,
            {
              clipPath: "circle(0% at 50% 50%)",
              duration: 1.2,
              ease: "power3.inOut",
            },
            "-=0.1"
          )
          .fromTo(
            flashRef.current,
            { clipPath: "circle(0% at 50% 50%)" },
            {
              clipPath: "circle(150% at 50% 50%)",
              duration: 0.6,
              ease: "power2.out",
            },
            ">-0.05"
          )
          .to(flashRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power1.inOut",
          });
      },
    });

    return () => {
      assembleTl.kill();
      // safety net in case the component unmounts early (e.g. fast refresh
      // during dev) — never leave the body permanently locked
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [onComplete]);

  return (
    <>
      <section
        ref={wrapRef}
        style={{ clipPath: "circle(150% at 50% 50%)" }}
        className="bg-[url(/loading-screen.webp)] bg-cover bg-center w-full min-h-screen flex justify-center items-center relative fixed inset-0 z-[100]"
      >
        <svg
          ref={svgRef}
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
          width="192"
          height="192"
          viewBox="0 0 192 192"
          fill="none"
          className="md:w-[191px] md:h-[191px] w-[150px] h-[150px]"
        >
          <path
            d="M191.704 0H0L36.569 36.792C44.2651 44.535 54.7313 48.8889 65.6484 48.8889H141.63V124.943C141.63 135.817 145.949 146.246 153.638 153.935L191.704 192V0Z"
            fill="#9564F4"
          />
          <path
            d="M122.666 68.7407H0.295898L37.762 106.207C45.0759 113.521 54.9957 117.63 65.3391 117.63H73.4811V126.364C73.4811 136.708 77.59 146.627 84.9039 153.941L122.666 191.704V68.7407Z"
            fill="#9564F4"
          />
          <path d="M54.2222 191.704V137.481H0L54.2222 191.704Z" fill="#9564F4" />
        </svg>

        <div ref={counterWrapRef} className="absolute md:bottom-9 bottom-[10%] md:left-21 left-[10%]">
          <h4 className="font-normal md:text-[96px] text-[40px] leading-[100%] text-black font-bartie">
            {progress}%
          </h4>
        </div>
      </section>

      <div
        ref={flashRef}
        style={{ clipPath: "circle(0% at 50% 50%)" }}
        className="fixed inset-0 z-[99] bg-[#9564F4] pointer-events-none"
      />
    </>
  );
};

export default LoadingScreen;