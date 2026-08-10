"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { BannerData } from "@/sanity/lib/queries";

const scrollToSection = (href: string) => {
  const id = href.startsWith("#") ? href.slice(1) : href;
  const el = document.getElementById(id);

  if (!el) return;

  const headerHeight = document.querySelector("header")?.offsetHeight ?? 80;

  const top =
    el.getBoundingClientRect().top + window.scrollY - headerHeight - 32;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).__lenis;

  if (lenis) {
    lenis.scrollTo(top, {
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
};

// Mouse interactions (parallax + glow) are lg-and-up only.
const isLgUp = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 1200px)").matches;

const FALLBACK = {
  headingPlain: "Leadership changes everything",

  paragraph:
    "We partner with organisations and leaders to attract, assess and support exceptional leadership that creates lasting impact.",
};

interface BannerProps {
  data?: BannerData | null;
}

const Banner = ({ data }: BannerProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;

  const paragraph = data?.paragraph ?? FALLBACK.paragraph;

  const sectionRef = useRef<HTMLElement>(null);

  // Separate refs for all three images
  const banner1Ref = useRef<HTMLImageElement>(null);
  const banner1MobRef = useRef<HTMLImageElement>(null);
  const banner2MobRef = useRef<HTMLImageElement>(null);

  const scrollBgRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // While loader is active, lock parallax
  const parallaxLockRef = useRef(true);

  /*
  |--------------------------------------------------------------------------
  | Initial GSAP setup
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    gsap.set([headingRef.current, paraRef.current], {
      autoAlpha: 0,
      y: 50,
    });

    // Set ALL THREE hero images invisible initially
    gsap.set(
      [banner1Ref.current, banner1MobRef.current, banner2MobRef.current],
      {
        autoAlpha: 0,
      },
    );

    gsap.set(scrollBgRef.current, {
      autoAlpha: 0,
      scale: 0.88,
      y: 24,
    });

    const runEntrance = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          delay: 0.05,
        });

        tl.to(headingRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 1.4,
          ease: "expo.out",
        })
          .to(
            paraRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
            },
            "-=0.85",
          )
          .to(
            scrollBgRef.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: "back.out(1.3)",
            },
            "-=0.6",
          )
          .call(() => {
            gsap.to(arrowRef.current, {
              y: 8,
              duration: 1.4,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });

            gsap.to(scrollBgRef.current, {
              scale: 1.04,
              duration: 3,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });
      });

      return () => ctx.revert();
    };

    window.addEventListener("header-done", runEntrance, { once: true });

    return () => {
      window.removeEventListener("header-done", runEntrance);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reveal ALL hero images after loader
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const revealHeroShape = () => {
      gsap.to(
        [banner1Ref.current, banner1MobRef.current, banner2MobRef.current],
        {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
      );
    };

    window.addEventListener("loading-image-landed", revealHeroShape, {
      once: true,
    });

    // Fallback in case loading-image-landed doesn't fire
    const fallbackTimer = setTimeout(revealHeroShape, 6000);

    return () => {
      window.removeEventListener("loading-image-landed", revealHeroShape);

      clearTimeout(fallbackTimer);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Unlock parallax when loading is complete
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const unlockParallax = () => {
      parallaxLockRef.current = false;
    };

    window.addEventListener("loading-done", unlockParallax, { once: true });

    return () => {
      window.removeEventListener("loading-done", unlockParallax);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Glow follow effect
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;

    if (!section || !glow) return;

    const quickX = gsap.quickTo(glow, "x", {
      duration: 1,
      ease: "power3.out",
    });

    const quickY = gsap.quickTo(glow, "y", {
      duration: 1,
      ease: "power3.out",
    });

    const handleMove = (e: MouseEvent) => {
      if (!isLgUp()) return;

      const r = section.getBoundingClientRect();

      quickX(e.clientX - r.left);
      quickY(e.clientY - r.top);
    };

    const handleEnter = () => {
      if (!isLgUp()) return;

      gsap.to(glow, {
        opacity: 0.7,
        duration: 0.8,
      });
    };

    const handleLeave = () => {
      if (!isLgUp()) return;

      gsap.to(glow, {
        opacity: 0,
        duration: 0.8,
      });
    };

    section.addEventListener("mousemove", handleMove);

    section.addEventListener("mouseenter", handleEnter);

    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);

      section.removeEventListener("mouseenter", handleEnter);

      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Mouse parallax
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const onMove = (e: MouseEvent) => {
      if (!isLgUp()) return;

      if (parallaxLockRef.current) return;

      const nx = (e.clientX / window.innerWidth - 0.5) * 2;

      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      // All three images
      gsap.to(
        [banner1Ref.current, banner1MobRef.current, banner2MobRef.current],
        {
          x: nx * 22,
          y: ny * 12,
          duration: 2.2,
          ease: "power2.out",
        },
      );

      gsap.to(headingRef.current, {
        x: nx * -5,
        y: ny * -3,
        duration: 2.8,
        ease: "power2.out",
      });

      gsap.to(paraRef.current, {
        x: nx * -3,
        y: ny * -2,
        duration: 2.8,
        ease: "power2.out",
      });

      gsap.to(scrollBgRef.current, {
        x: nx * 8,
        y: ny * 5,
        duration: 2.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      if (!isLgUp()) return;

      if (parallaxLockRef.current) return;

      gsap.to(
        [
          banner1Ref.current,
          banner1MobRef.current,
          banner2MobRef.current,
          headingRef.current,
          paraRef.current,
          scrollBgRef.current,
        ],
        {
          x: 0,
          y: 0,
          duration: 2,
          ease: "power2.out",
        },
      );
    };

    section.addEventListener("mousemove", onMove);

    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);

      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */
  return (
    <section
      ref={sectionRef}
      id="home"
      className="
        md:min-h-[110vh]
        h-[100vh]
        bg-[url(/banner.webp)]
        bg-cover
        bg-center
        relative
        overflow-visible
      "
    >
      {/* =====================================================
          DESKTOP IMAGE
          1200px and above
      ====================================================== */}
      <img
        id="hero-shape-desktop"
        ref={banner1Ref}
        src="/banner1.webp"
        alt="banner"
        style={{ opacity: 0 }}
        className="
          hidden
          lg:block
          lg:absolute
          w-full
          2xl:bottom-[-73vh]
          xl:bottom-[-60vh]
          lg:bottom-[-25vh]
          will-change-transform
        "
      />

      {/* =====================================================
          TABLET IMAGE
          md -> below lg
      ====================================================== */}
      <img
        id="hero-shape-tablet"
        ref={banner1MobRef}
        src="/banner1-mob.png"
        alt="banner"
        style={{ opacity: 0 }}
        className="
          hidden
          md:block
          lg:hidden
          absolute
          bottom-0
          will-change-transform
        "
      />

      {/* =====================================================
          MOBILE IMAGE
          below md
      ====================================================== */}
      <img
        id="hero-shape-mobile"
        ref={banner2MobRef}
        src="/banner2-mob.png"
        alt="banner"
        style={{ opacity: 0 }}
        className="
          block
          md:hidden
          absolute
          bottom-0
          will-change-transform
        "
      />

      {/* =====================================================
          SCROLL BUTTON
      ====================================================== */}
      {/* <a
        ref={scrollBgRef}
        href="#philosophy"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("#philosophy");
        }}
        style={{ opacity: 0 }}
        className="
          bg-[url(/scroll-bg1.png)]
          md:bg-cover
          bg-contain
          bg-center

          2xl:w-[160px]
          2xl:h-[166px]

          md:w-[130px]
          md:h-[140px]

          w-[110px]
          h-[110px]

          flex
          flex-col
          justify-center
          items-center

          absolute
          left-1/2
          -translate-x-1/2
          z-30

          md:bottom-[0vh]
          bottom-[-3vh]

          will-change-transform
        "
      >
        <svg
          ref={arrowRef}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="43"
          viewBox="0 0 18 43"
          fill="none"
          className="
            2xl:mt-[0vh]
            md:mt-[2vh]

            2xl:h-[43px]
            md:h-[30px]
            h-[25px]
          "
        >
          <path
            d="M8.66016 42.5L17.3204 27.5L-9.75728e-05 27.5L8.66016 42.5ZM10.1602 1.5C10.1602 0.671574 9.48859 3.62117e-08 8.66016 0C7.83173 -3.62117e-08 7.16016 0.671574 7.16016 1.5L8.66016 1.5L10.1602 1.5ZM8.66016 29L10.1602 29L10.1602 1.5L8.66016 1.5L7.16016 1.5L7.16016 29L8.66016 29Z"
            fill="#9564F4"
          />
        </svg>
      </a> */}

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}
      <div
        className="
          pt-[30vh]

          relative
          z-30
        "
      >
        <div
          className="
            text-center
            2xl:max-w-[1050px]
            lg:max-w-[900px]
            max-w-[700px]
            mx-auto
            px-4
          "
        >
          <h1
            ref={headingRef}
            style={{ opacity: 0 }}
            className="
              font-toruspro
              font-normal

              2xl:text-[100px]
              lg:text-[80px]
              md:text-[60px]
              text-[40px]

              text-[#0B0730]

              leading-[101%]

              will-change-transform

              tracking-[-0.04em]
            "
          >
            {headingPlain}
          </h1>

          <p
            ref={paraRef}
            style={{ opacity: 0 }}
            className="
              font-outfit
              font-normal

              text-[15px]
              sm:text-[17px]
              md:text-[20px]
              lg:text-[22px]
              xl:text-[24px]

              text-[#0B0730]

              leading-[115%]

              w-full
              max-w-[578px]

              mx-auto

              mt-[2.5vh]

              will-change-transform
            "
          >
            {paragraph}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
