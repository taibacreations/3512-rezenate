// Cta.tsx — Sanity CMS powered (no cache)
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CtaData } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Fallback ───────────────────────────────────────────────────────────────
const FALLBACK = {
  headingPlain: "Leadership shapes the way people experience work and",
  headingItalic: "therefore life",
  paragraph:
    "If this resonates, let's have a conversation. We reply within a day — always personally.",
  buttonText: "Start a Private Conversation",
  buttonLink: "#footer",
  accentColor: "#9564F4",
};

interface CtaProps {
  data?: CtaData | null;
}

const Cta = ({ data }: CtaProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const headingItalic = data?.headingItalic ?? FALLBACK.headingItalic;
  const paragraph = data?.paragraph ?? FALLBACK.paragraph;
  const buttonText = data?.buttonText ?? FALLBACK.buttonText;
  const buttonLink = data?.buttonLink ?? FALLBACK.buttonLink;
  const accentColor = data?.accentColor ?? FALLBACK.accentColor;

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

  // ── Entrance ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 180%" : "top 140%",
          once: true,
        },
      });

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
    }, sectionRef);
    return () => ctx.revert();
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

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="md:min-h-[81.5vh] min-h-[70vh] relative flex justify-center items-center"
    >
      {/* Decorative images — all hardcoded from /public */}
      <img
        src="/footer-blur.webp"
        alt=""
        className="absolute w-full md:bottom-[-50%] bottom-[-10%] left-0 z-40 md:h-[700px] h-[100px]"
      />
      <img
        ref={gradRef}
        src="/cta-grad.webp"
        alt=""
        className="absolute bottom-0 left-0 pointer-events-none z-30"
      />
      <div
        ref={bgWrapRef}
        className="absolute top-[-42%] 2xl:right-0 xl:right-[-10%] lg:right-[-25%] md:right-[-40%] right-0 h-[1284px] w-[831px]"
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
          className="font-toruspro font-light 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-black"
        >
          {headingPlain}{" "}
          <span
            className="tracking-[0em] italic font-tartuffo lowercase"
            style={{ color: accentColor }}
          >
            {headingItalic}
          </span>
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
          <span ref={buttonTextRef} className="relative z-10 text-black">
            {buttonText}
          </span>
        </button>
      </div>
    </section>
  );
};

export default Cta;
