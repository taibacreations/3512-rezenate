"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LoadingPage = () => {
  const wrapRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rotatingImgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
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
    gsap.set(contentRef.current, { opacity: 0, y: 20 });
    gsap.set(spinnerRef.current, { opacity: 0 });

    gsap.to(rotatingImgRef.current, {
      rotation: 360,
      duration: 25,
      ease: "none",
      repeat: -1,
      transformOrigin: "center center",
    });

    const assembleTl = gsap.timeline();
    assembleTl
      .fromTo(paths[2], { x: 30, y: -30, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
      .to(paths[2], { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.5)
      .fromTo(paths[1], { x: 50, y: -50, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 0.9)
      .fromTo(paths[0], { x: 70, y: -70, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 1.8)
      .to(contentRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 2.0)
      .to(spinnerRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, 2.3);

    const exitTimer = setTimeout(() => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.left = "";
          document.body.style.right = "";
          document.body.style.width = "";
          window.scrollTo(0, scrollY);
          setDone(true);
          window.dispatchEvent(new Event("loading-done"));
        },
      });

      exitTl
        .to([svgRef.current, logoRef.current, contentRef.current, spinnerRef.current, rotatingImgRef.current], {
          opacity: 0, y: -20, duration: 0.5, ease: "power2.in",
        })
        .to(wrapRef.current, {
          clipPath: "circle(0% at 50% 50%)", duration: 1.2, ease: "power3.inOut",
        }, "-=0.1")
        .fromTo(flashRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(150% at 50% 50%)", duration: 0.6, ease: "power2.out" },
          ">-0.05"
        )
        .to(flashRef.current, { opacity: 0, duration: 0.5, ease: "power1.inOut" });
    }, 3200);

    return () => {
      clearTimeout(exitTimer);
      assembleTl.kill();
      gsap.killTweensOf(rotatingImgRef.current);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, []);

  if (done) return null;

  return (
    <>
      <section
        ref={wrapRef}
        style={{ clipPath: "circle(150% at 50% 50%)" }}
        className="bg-[url(/loading-bg.webp)] bg-cover bg-center w-full min-h-screen flex justify-center items-center relative fixed inset-0 z-[100]"
      >
        <div
          ref={rotatingImgRef}
          className="bg-[url(/loading.webp)] bg-cover bg-center w-[1254px] h-[940px] absolute"
        />
        <div className="w-[1254px] h-[940px] flex flex-col pt-[23.5vh] items-center text-center relative z-20">
          {/* Logo SVG */}
          <div className="flex flex-col justify-center items-center gap-1.5">
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="51"
              viewBox="0 0 51 51"
              fill="none"
              className="w-[44px] h-[44px]"
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
              className="w-[203px] h-auto"
            />
          </div>

          {/* Heading + subtext */}
          <div ref={contentRef} className="mt-[6vh]">
            <h2 className="font-reddit font-light text-[72px] leading-[101%] tracking-[-0.04em] capitalize text-black">
              lead the{" "}
              <span className="text-[#9564F4] tracking-[0em] italic font-tartuffo lowercase">
                way
              </span>
            </h2>
            <p className="font-outfit text-[24px] leading-[115%] text-black mt-[1.5vh]">
              Leadership that resonates. Impact that lasts.
            </p>
          </div>

          {/* Spinner */}
          <div ref={spinnerRef} className="mt-[4vh] flex flex-col items-center gap-3">
            <svg
              className="animate-spin"
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
            <p className="font-outfit text-[24px] text-black leading-[115%]">Loading</p>
          </div>
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

export default LoadingPage;