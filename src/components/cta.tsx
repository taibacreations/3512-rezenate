// Cta.tsx — Sanity CMS powered (no cache)
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CtaData } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Fallback ───────────────────────────────────────────────────────────────
const FALLBACK = {
  headingPlain: "Leadership shapes the way people experience work and therefore life",
  paragraph:
    "If this resonates, let's have a conversation. We reply within a day — always personally.",
  buttonText: "Start a Private Conversation",
  buttonLink: "#footer",
};

interface CtaProps {
  data?: CtaData | null;
}

const Cta = ({ data }: CtaProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const paragraph = data?.paragraph ?? FALLBACK.paragraph;
  const buttonText = data?.buttonText ?? FALLBACK.buttonText;
  const buttonLink = data?.buttonLink ?? FALLBACK.buttonLink;

  const sectionRef = useRef<HTMLElement>(null);
  const gradRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonFillRef = useRef<HTMLSpanElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);

  // ── Scroll-to-top refs ───────────────────────────────────────────────────
  const scrollTopRef = useRef<HTMLButtonElement>(null);
  const scrollArrowRef = useRef<SVGSVGElement>(null);
  const progressRingRef = useRef<SVGCircleElement>(null);
  const RING_RADIUS = 27;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  // ── Entrance ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;

    let st: ScrollTrigger | null = null;
    let onLoadingDone: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // Set initial states immediately
      gsap.set(gradRef.current, { opacity: 0, scale: 1.06 });
      gsap.set(bgWrapRef.current, {
        opacity: 0,
        x: 30,
        scale: 0.95,
        rotate: -3,
      });
      gsap.set(headingRef.current, { opacity: 0, y: 20, filter: "blur(6px)" });
      gsap.set(paraRef.current, { opacity: 0, y: 14 });
      gsap.set(buttonRef.current, { opacity: 0, y: 16, scale: 0.92 });

      const isMobile = window.innerWidth < 768;

      const createTrigger = () => {
        st = ScrollTrigger.create({
          trigger: sectionRef.current,
          // ✅ CHANGED: "top 70%" / "top 80%" triggers when the section is nicely in "perfect view"
          // Previously "top 140%" / "180%" misfired due to layout shifts from the loading screen's fixed body
          start: isMobile ? "top 80%" : "top 70%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(gradRef.current, {
              opacity: 1,
              scale: 1,
              duration: 1.6,
              ease: "power2.out",
            })
              .to(
                bgWrapRef.current,
                {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  rotate: 0,
                  duration: 1.4,
                  ease: "power2.out",
                },
                "<0.1",
              )
              .to(
                headingRef.current,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 1.0,
                  ease: "expo.out",
                },
                "-=1.0",
              )
              .to(
                paraRef.current,
                { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
                "-=0.5",
              )
              .to(
                buttonRef.current,
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" },
                "-=0.4",
              );
          },
        });
      };

      // ✅ CHANGED: Use the reliable global flag instead of creating trigger immediately
      if ((window as any).__loadingDone) {
        createTrigger();
      } else {
        onLoadingDone = () => {
          // Small delay ensures the browser has fully recalculated layout after body unlock
          setTimeout(() => {
            ScrollTrigger.refresh(true);
            createTrigger();
          }, 150);
        };

        window.addEventListener("loading-done", onLoadingDone, { once: true });

        // Fallback: in case the event fired a millisecond before this component mounted
        if ((window as any).__loadingDone) {
          window.removeEventListener("loading-done", onLoadingDone);
          createTrigger();
        }
      }
    }, sectionRef);

    return () => {
      if (st) st.kill();
      if (onLoadingDone) {
        window.removeEventListener("loading-done", onLoadingDone);
      }
      ctx.revert();
    };
  }, []);

  // ── Mouse-follow glow ──────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 1, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 1, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      quickX(e.clientX - r.left);
      quickY(e.clientY - r.top);
    };
    const handleEnter = () => gsap.to(glow, { opacity: 0.7, duration: 0.8 });
    const handleLeave = () => gsap.to(glow, { opacity: 0, duration: 0.8 });

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseenter", handleEnter);
    section.addEventListener("mouseleave", handleLeave);
    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseenter", handleEnter);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // ── Button hover ───────────────────────────────────────────────────────────
  useEffect(() => {
    const btn = buttonRef.current;
    const fill = buttonFillRef.current;
    const text = buttonTextRef.current;
    if (!btn || !fill || !text) return;

    const quickX = gsap.quickTo(btn, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const quickY = gsap.quickTo(btn, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
    let hoverTl: gsap.core.Timeline | null = null;

    const handleEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline();
      hoverTl
        .to(fill, { scaleY: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(text, { color: "#ffffff", duration: 0.4, ease: "power2.out" }, 0)
        .to(btn, { scale: 1.02, duration: 0.4, ease: "power2.out" }, 0);
    };
    const handleLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline();
      hoverTl
        .to(fill, { scaleY: 0, duration: 0.45, ease: "power2.inOut" }, 0)
        .to(text, { color: "#000000", duration: 0.4, ease: "power2.out" }, 0)
        .to(
          btn,
          { scale: 1, x: 0, y: 0, duration: 0.45, ease: "power2.out" },
          0,
        );
    };
    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      quickX((e.clientX - (rect.left + rect.width / 2)) * 0.15);
      quickY((e.clientY - (rect.top + rect.height / 2)) * 0.25);
    };
    const handleDown = () =>
      gsap.to(btn, { scale: 0.97, duration: 0.15, ease: "power2.out" });
    const handleUp = () =>
      gsap.to(btn, { scale: 1.02, duration: 0.2, ease: "power2.out" });

    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);
    btn.addEventListener("mousemove", handleMove);
    btn.addEventListener("mousedown", handleDown);
    btn.addEventListener("mouseup", handleUp);
    return () => {
      hoverTl?.kill();
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
      btn.removeEventListener("mousemove", handleMove);
      btn.removeEventListener("mousedown", handleDown);
      btn.removeEventListener("mouseup", handleUp);
    };
  }, []);

  // ── Scroll-to-top button (float + hover) ───────────────────────────────────
  useEffect(() => {
    const btn = scrollTopRef.current;
    const arrow = scrollArrowRef.current;
    if (!btn || !arrow) return;

    const floatTl = gsap.to(arrow, {
      y: -4,
      duration: 1.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const handleEnter = () =>
      gsap.to(btn, { scale: 1.06, duration: 0.3, ease: "power2.out" });
    const handleLeave = () =>
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });

    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);
    return () => {
      floatTl.kill();
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // ── Scroll-progress ring ─────────────────────────────────────────────────
  useEffect(() => {
    const ring = progressRingRef.current;
    if (!ring) return;

    ring.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
    ring.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      const offset = RING_CIRCUMFERENCE * (1 - progress);
      gsap.to(ring, { strokeDashoffset: offset, duration: 0.15, ease: "none", overwrite: true });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="xl:py-[15vh] lg:py-[18vh] py-[15vh] relative flex justify-center items-center overflow-hidden"
    >
      {/* Decorative images — all hardcoded from /public */}
      <img
        src="/footer-blur.webp"
        alt=""
        className="absolute w-full md:bottom-[-50%] bottom-[-10%] left-0 z-40 lg:h-[700px] h-[550px] hidden md:block"
      />
      <img
        ref={gradRef}
        src="/cta-grad.webp"
        alt=""
        className="absolute bottom-0 left-0 pointer-events-none z-30"
      />
      <div
        ref={bgWrapRef}
        className="absolute top-[-42%] 2xl:right-0 xl:right-[-10%] lg:right-[-25%] md:right-[-20%] right-0 h-[1284px] w-[831px] z-30"
      >
        <img
          ref={bgRef}
          src="/cta.webp"
          alt=""
          className="pointer-events-none h-full w-full hidden md:block"
        />
      </div>

      {/* Content */}
      <div className="2xl:max-w-[916px] xl:max-w-[880px] max-w-[750px] mx-auto text-center flex justify-center items-center flex-col relative px-4 z-40">
        <h2
          ref={headingRef}
          className="font-toruspro font-normal 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-[#0B0730]"
        >
          {headingPlain}
        </h2>
        <p
          ref={paraRef}
          className="font-outfit font-normal leading-[115%] 2xl:text-[24px] xl:text-[22px] text-[20px] 2xl:max-w-[451px] xl:max-w-[430px] max-w-[400px] mx-auto mt-[2vh]"
        >
          {paragraph}
        </p>

        <button
          ref={buttonRef}
          onClick={() => {
            if (buttonLink) window.location.href = buttonLink;
          }}
          className="relative font-outfit font-normal lg:text-[20px] text-[18px] xl:w-[322px] w-[310px] xl:h-[55px] h-[45px] rounded-full flex justify-center items-center border-2 border-black mt-[3.5vh] overflow-hidden"
        >
          <span
            ref={buttonFillRef}
            className="absolute inset-0 bg-black rounded-full pointer-events-none"
            style={{ transform: "scaleY(0)", transformOrigin: "bottom center" }}
          />
          <span ref={buttonTextRef} className="relative z-10 text-[#0B0730]">
            {buttonText}
          </span>
        </button>
      </div>

      {/* Scroll to top */}
      {/* <div className="absolute md:bottom-[5vh] bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
        <svg
          width="176"
          height="46"
          viewBox="0 0 176 46"
          className="pointer-events-none"
        >
          <path id="scrollTopCurve" d="M 8,44 A 80,80 0 0 1 168,44" fill="none" />
          <text
            className="fill-[#6D5BD0] font-outfit uppercase"
            fontSize="10.5"
            fontWeight={500}
            letterSpacing="2.5"
          >
            <textPath href="#scrollTopCurve" startOffset="50%" textAnchor="middle">
              Scroll To Top
            </textPath>
          </text>
        </svg>

        <button
          ref={scrollTopRef}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="group relative -mt-1 w-[60px] h-[60px] rounded-full flex items-center justify-center"
        >
          <span className="absolute inset-[3px] rounded-full border border-[#0B0730]/15 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(11,7,48,0.06)] transition-shadow duration-300 group-hover:shadow-[0_6px_26px_rgba(109,91,208,0.18)]" />


          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className="absolute inset-0 -rotate-90 pointer-events-none"
          >
            <circle
              cx="30"
              cy="30"
              r={RING_RADIUS}
              fill="none"
              stroke="#0B0730"
              strokeOpacity="0.08"
              strokeWidth="1.5"
            />
            <circle
              ref={progressRingRef}
              cx="30"
              cy="30"
              r={RING_RADIUS}
              fill="none"
              stroke="#6D5BD0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <svg
            ref={scrollArrowRef}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6D5BD0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        <span className="mt-3 font-outfit text-[12px] tracking-[0.02em] text-[#0B0730]/50">
          Back to top
        </span>
      </div> */}
    </section>
  );
};

export default Cta;