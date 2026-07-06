// components/cta.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

interface CtaData {
  heading?: string;
  paragraph?: string;
  buttonText?: string;
  buttonLink?: string;
  gradientImage?: { asset: { _ref: string } } | null;
  bgImage?: { asset: { _ref: string } } | null;
}

const Cta = ({ data }: { data: CtaData }) => {
  const heading     = data?.heading     ?? "Leadership shapes the way people experience work and therefore life.";
  const paragraph   = data?.paragraph   ?? "If this resonates, let's have a conversation. We reply within a day — always personally.";
  const buttonText  = data?.buttonText  ?? "Start a Private Conversation";
  const buttonLink  = data?.buttonLink  ?? "#footer";
  const gradSrc     = data?.gradientImage ? urlFor(data.gradientImage).url() : "/cta-grad.webp";
  const bgSrc       = data?.bgImage       ? urlFor(data.bgImage).url()       : "/cta-bg.svg";

  const sectionRef    = useRef<HTMLElement>(null);
  const gradRef       = useRef<HTMLImageElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const bgWrapRef     = useRef<HTMLDivElement>(null);
  const bgRef         = useRef<HTMLImageElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const paraRef       = useRef<HTMLParagraphElement>(null);
  const buttonRef     = useRef<HTMLButtonElement>(null);
  const buttonFillRef = useRef<HTMLSpanElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(gradRef.current,    { opacity: 0, scale: 1.06 });
      gsap.set(bgWrapRef.current,  { opacity: 0, x: 30, scale: 0.95, rotate: -3 });
      gsap.set(headingRef.current, { opacity: 0, y: 20, filter: "blur(6px)" });
      gsap.set(paraRef.current,    { opacity: 0, y: 14 });
      gsap.set(buttonRef.current,  { opacity: 0, y: 16, scale: 0.92 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      tl.to(gradRef.current,    { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" })
        .to(bgWrapRef.current,  { opacity: 1, x: 0, scale: 1, rotate: 0, duration: 1.5, ease: "power2.out" }, "<0.1")
        .to(headingRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" }, "-=1.1")
        .to(paraRef.current,    { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.5")
        .to(buttonRef.current,  { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power2.out" }, "-=0.4");
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(() => requestAnimationFrame(refresh));
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 800);
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(refresh, 200); };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Mouse-follow glow — subtle, not futuristic
  useEffect(() => {
    const section = sectionRef.current;
    const glow    = glowRef.current;
    if (!section || !glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 1, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 1, ease: "power3.out" });

    const handleMove  = (e: MouseEvent) => { const r = section.getBoundingClientRect(); quickX(e.clientX - r.left); quickY(e.clientY - r.top); };
    const handleEnter = () => gsap.to(glow, { opacity: 0.7, duration: 0.8 });
    const handleLeave = () => gsap.to(glow, { opacity: 0,   duration: 0.8 });

    section.addEventListener("mousemove",  handleMove);
    section.addEventListener("mouseenter", handleEnter);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove",  handleMove);
      section.removeEventListener("mouseenter", handleEnter);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Button hover — fill wipe + subtle magnetic pull
  useEffect(() => {
    const btn  = buttonRef.current;
    const fill = buttonFillRef.current;
    const text = buttonTextRef.current;
    if (!btn || !fill || !text) return;

    const quickX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

    let hoverTl: gsap.core.Timeline | null = null;

    const handleEnter = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline();
      hoverTl
        .to(fill, { scaleY: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(text, { color: "#ffffff", duration: 0.4, ease: "power2.out" }, 0)
        .to(btn,  { scale: 1.02, duration: 0.4, ease: "power2.out" }, 0);
    };

    const handleLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline();
      hoverTl
        .to(fill, { scaleY: 0, duration: 0.45, ease: "power2.inOut" }, 0)
        .to(text, { color: "#000000", duration: 0.4, ease: "power2.out" }, 0)
        .to(btn,  { scale: 1, x: 0, y: 0, duration: 0.45, ease: "power2.out" }, 0);
    };

    const handleMove  = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      quickX((e.clientX - (rect.left + rect.width  / 2)) * 0.15);
      quickY((e.clientY - (rect.top  + rect.height / 2)) * 0.25);
    };
    const handleDown = () => gsap.to(btn, { scale: 0.97, duration: 0.15, ease: "power2.out" });
    const handleUp   = () => gsap.to(btn, { scale: 1.02, duration: 0.2,  ease: "power2.out" });

    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);
    btn.addEventListener("mousemove",  handleMove);
    btn.addEventListener("mousedown",  handleDown);
    btn.addEventListener("mouseup",    handleUp);

    return () => {
      hoverTl?.kill();
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
      btn.removeEventListener("mousemove",  handleMove);
      btn.removeEventListener("mousedown",  handleDown);
      btn.removeEventListener("mouseup",    handleUp);
    };
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="bg-white md:min-h-[81.5vh] min-h-[70vh] relative flex justify-center items-center"
    >
      <img ref={gradRef} src={gradSrc} alt="" className="absolute bottom-0 left-0 pointer-events-none" />

      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-0"
        style={{
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(149,100,244,0.35) 0%, rgba(149,100,244,0) 70%)",
          filter: "blur(12px)",
        }}
      />

      <div ref={bgWrapRef} className="absolute top-0 right-0 h-full">
        <img ref={bgRef} src={bgSrc} alt="" className="pointer-events-none h-full" />
      </div>

      <div className="2xl:max-w-[916px] xl:max-w-[880px] max-w-[750px] mx-auto text-center flex justify-center items-center flex-col relative px-4">
        <h3
          ref={headingRef}
          className="2xl:text-[34px] xl:text-[32px] md:text-[28px] text-[24px] font-boldonse font-normal leading-[151%] text-black"
        >
          {heading}
        </h3>
        <p
          ref={paraRef}
          className="font-outfit font-normal leading-[115%] 2xl:text-[24px] xl:text-[22px] text-[20px] 2xl:max-w-[451px] xl:max-w-[430px] max-w-[400px] mx-auto mt-[2vh]"
        >
          {paragraph}
        </p>

        <button
          ref={buttonRef}
          onClick={() => { if (buttonLink) window.location.href = buttonLink; }}
          className="relative font-boldonse font-normal xl:text-[14.66px] text-[12px] xl:w-[322px] w-[280px] xl:h-[55px] h-[45px] rounded-full flex justify-center items-center border-2 border-black mt-[3vh] overflow-hidden"
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