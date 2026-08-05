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

  const wrapRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rotatingImgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  // The decorative loading shape (the "bubble") — test.png
  const loadingShapeRef = useRef<HTMLImageElement>(null);

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
    gsap.set(spinnerRef.current, { opacity: 0 });
    gsap.set(loadingShapeRef.current, { opacity: 1 });

    gsap.set(rotatingImgRef.current, {
      "--mask-stop": "100%",
    } as gsap.TweenVars);

    const rotationTween = gsap.to(rotatingImgRef.current, {
      rotation: 360,
      duration: 25,
      ease: "none",
      repeat: -1,
      transformOrigin: "center center",
    });

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
        2.0,
      )
      .to(
        spinnerRef.current,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        2.3,
      );

    const exitTimer = setTimeout(() => {
      // Stop rotation before zooming so the motion reads as one continuous push-in
      rotationTween.kill();
      gsap.set(rotatingImgRef.current, { rotation: 0 });

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

      // 1. Fade out logo/svg/text/spinner, leaving just the bubble on screen
      exitTl.to(
        [
          logoRef.current,
          svgRef.current,
          contentRef.current,
          spinnerRef.current,
        ],
        { opacity: 0, duration: 0.35, ease: "power2.inOut" },
      );

      const imgEl = rotatingImgRef.current;

      if (imgEl) {
        const rect = imgEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Scale enough that the bubble fully swallows the viewport,
        // with a little overshoot so no edge is visible during the crossfade
        const scaleNeeded =
          Math.max(vw / rect.width, vh / rect.height) * 1.4;

        const zoomDuration = 1.4;

        exitTl
          // 2. Punch the bubble up from its own center — the "zooming in" feel
          .to(
            imgEl,
            {
              scale: scaleNeeded,
              transformOrigin: "center center",
              duration: zoomDuration,
              ease: "power2.in", // starts slow, accelerates like a dive
            },
            "-=0.1",
          )
          .call(() => window.dispatchEvent(new Event("loading-image-landed")))
          // 3. Once it's filled the screen, dissolve the whole overlay to reveal the homepage
          .to(
            wrapRef.current,
            { opacity: 0, duration: 0.5, ease: "power2.inOut" },
            "-=0.3",
          );
      } else {
        exitTl.to(wrapRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    }, 3200);

    return () => {
      clearTimeout(exitTimer);
      assembleTl.kill();
      rotationTween.kill();
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, []);

  if (done) return null;

  return (
    <section
      ref={wrapRef}
      style={{ clipPath: "circle(150% at 50% 50%)" }}
      className="w-full min-h-screen flex justify-center items-center fixed inset-0 z-[100] bg-[url-[/banner.webp]] bg-cover bg-center bg-no-repeat"
    >
      <div
        ref={rotatingImgRef}
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black var(--mask-stop, 100%), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black var(--mask-stop, 100%), transparent 100%)",
        }}
        className="lg:w-[1554px] lg:h-[1100px] w-[1200px] h-[1000px] absolute"
      >
        {/* The bubble */}
        <img
          ref={loadingShapeRef}
          src="/test.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain md:scale-100 scale-70"
        />
      </div>

      <div className="w-[1254px] h-[940px] flex flex-col xl:pt-[23.5vh] md:pt-[30vh] items-center text-center relative z-20 px-4 justify-center md:justify-start">
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
            className="lg:w-[203px] md:w-[170px] w-[140px] h-auto"
          />
        </div>

        <div ref={contentRef} className="md:mt-[6vh] mt-[3vh]">
          <h2 className="font-toruspro font-normal lg:text-[72px] md:text-[60px] text-[40px] leading-[101%] tracking-[-0.04em] capitalize text-black">
            {headingPlain}
          </h2>
          <p className="font-outfit lg:text-[24px] md:text-[22px] text-[20px] leading-[115%] text-black mt-[1.5vh]">
            {tagline}
          </p>
        </div>

        <div
          ref={spinnerRef}
          className="md:mt-[4vh] flex flex-col items-center md:gap-3"
        >
          <svg
            className="animate-spin lg:w-[83px] h-[83px] md:w-[60px] md:h-[60px] w-[45px] h-[45px]"
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
          <p className="font-outfit lg:text-[24px] md:text-[20px] text-[18px] text-black leading-[115%]">
            {loadingLabel}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoadingScreen;