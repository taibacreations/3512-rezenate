"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { LoadingData } from "@/sanity/lib/queries";

const FALLBACK = {
  headingPlain: "lead the way",
  tagline: "Leadership that resonates. Impact that lasts.",
  loadingLabel: "Loading",
};

const HERO_TARGET_DESKTOP = "#hero-shape-desktop";
const HERO_TARGET_MOBILE = "#hero-shape-mobile";

function getHeroTarget(): HTMLElement | null {
  const candidates = [
    document.querySelector<HTMLElement>(HERO_TARGET_DESKTOP),
    document.querySelector<HTMLElement>(HERO_TARGET_MOBILE),
  ];
  return (
    candidates.find((el) => el && el.getBoundingClientRect().width > 0) ?? null
  );
}

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

  // The decorative loading shape, now a real <img> so we can fade it out
  // independently instead of leaving it stacked as a CSS background.
  const loadingShapeRef = useRef<HTMLImageElement>(null);

  // Refs for the inner banner images that will fade in during the glide
  const loaderBannerDesktopRef = useRef<HTMLImageElement>(null);
  const loaderBannerMobileRef = useRef<HTMLImageElement>(null);

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
      // Stop rotation before gliding so the fade-in looks stable
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

      exitTl.to(
        [
          logoRef.current,
          svgRef.current,
          contentRef.current,
          spinnerRef.current,
        ],
        { opacity: 0, duration: 0.35, ease: "power2.inOut" },
      );

      const targetEl = getHeroTarget();
      const imgEl = rotatingImgRef.current;

      if (targetEl && imgEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const currentRect = imgEl.getBoundingClientRect();

        const scaleTo = targetRect.width / currentRect.width;
        const deltaX =
          targetRect.left +
          targetRect.width / 2 -
          (currentRect.left + currentRect.width / 2);
        const deltaY =
          targetRect.top +
          targetRect.height / 2 -
          (currentRect.top + currentRect.height / 2);

        const glideDuration = 1.8;

        exitTl
          // 1. Glide the container down to the target
          .to(
            imgEl,
            {
              x: `+=${deltaX}`,
              y: `+=${deltaY}`,
              scale: scaleTo,
              transformOrigin: "center center",
              duration: glideDuration,
              ease: "power2.inOut",
            },
            "-=0.1",
          )
          // 2. SIMULTANEOUSLY crossfade INSIDE the container: the loading.png
          //    shape fades out while banner1.webp fades in. By the time the
          //    glide finishes, only the banner image is visible in the
          //    ghost — nothing left of loading.png to overlap with the real
          //    Banner image during the final crossfade below.
          .to(
            [loaderBannerDesktopRef.current, loaderBannerMobileRef.current],
            {
              opacity: 1,
              duration: glideDuration,
              ease: "power2.inOut",
            },
            "<",
          )
          .to(
            loadingShapeRef.current,
            {
              opacity: 0,
              duration: glideDuration,
              ease: "power2.inOut",
            },
            "<",
          )
          .call(() => window.dispatchEvent(new Event("loading-image-landed")))
          // 3. Crossfade the ENTIRE loader overlay out while Banner's real image fades in
          //    underneath on the same 0.5s window. Both sides now show the same
          //    banner artwork at the same rect, so this is a clean single-image
          //    crossfade instead of two different shapes overlapping.
          .to(wrapRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
      } else {
        exitTl
          .to(loadingShapeRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
          })
          .to(
            wrapRef.current,
            {
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut",
            },
            "<",
          );
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
        className="lg:w-[1254px] lg:h-[900px] md:w-[900px] md:h-[700px] w-[700px] h-[500px] absolute"
      >
        {/* Decorative loading shape — now animatable, fades out as the banners fade in */}
        <img
          ref={loadingShapeRef}
          src="/loadings.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* These inner images fade in during the glide, creating the smooth transition */}
        <img
          ref={loaderBannerDesktopRef}
          src="/banner1.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-0 hidden lg:block"
        />
        <img
          ref={loaderBannerMobileRef}
          src="/banner1-mob.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-0 lg:hidden"
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