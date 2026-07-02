// Banner.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
// DotField is a plain JSX file — @ts-ignore suppresses the missing-types error.
// Place DotField.d.ts (provided separately) next to DotField.jsx to remove it.
// @ts-ignore
import DotField from "./DotField";

const Banner = () => {
  const sectionRef    = useRef<HTMLElement>(null);
  const gradientRef   = useRef<HTMLDivElement>(null);
  const logoWrapRef   = useRef<HTMLDivElement>(null);
  const logoRef       = useRef<HTMLImageElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const bannerTrackRef     = useRef<HTMLDivElement>(null);
  const dotFieldRef   = useRef<HTMLDivElement>(null);

  // ── entrance ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(logoRef.current,     { opacity: 0, scale: 0.85, filter: "blur(8px)" });
      gsap.set(glowRef.current,     { opacity: 0, scale: 0.8 });
      gsap.set(headingRef.current,  { opacity: 0, y: 20, filter: "blur(4px)" });
      gsap.set(gradientRef.current, { opacity: 0 });
      gsap.set(dotFieldRef.current, { opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(gradientRef.current,  { opacity: 1,   duration: 2.2, ease: "power2.out" })
        .to(dotFieldRef.current,  { opacity: 1,   duration: 3.0, ease: "power2.out" }, "-=2.0")
        .to(glowRef.current,      { opacity: 0.3, scale: 1, duration: 2, ease: "power2.out" }, "-=2.4")
        .to(logoRef.current,      { opacity: 1,   scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power2.out" }, "-=1.8")
        .to(headingRef.current,   { opacity: 1,   y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }, "-=0.8");

      const section = sectionRef.current;
      if (!section) return;
      const observer = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) { tl.play(); observer.disconnect(); } },
        { threshold: 0.1 }
      );
      observer.observe(section);
      return () => observer.disconnect();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── ambient gradient drift ─────────────────────────────────────────────────
  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(gradient, { backgroundPosition: "51% 49%", duration: 16 }, 0);
    return () => { tl.kill(); };
  }, []);

  // ── banner image breathe ───────────────────────────────────────────────────
  useEffect(() => {
    const track = bannerTrackRef.current;
    if (!track) return;
    const img = track.querySelector<HTMLImageElement>(".banner-image");
    if (!img) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(img, { y: "+=8", duration: 6 }, 0);
    return () => { tl.kill(); };
  }, []);

  // ── logo mouse tilt ────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const wrap    = logoWrapRef.current;
    const logo    = logoRef.current;
    const glow    = glowRef.current;
    if (!section || !wrap || !logo || !glow) return;

    const quickX     = gsap.quickTo(logo, "rotateY", { duration: 0.9, ease: "power3.out" });
    const quickY     = gsap.quickTo(logo, "rotateX", { duration: 0.9, ease: "power3.out" });
    const quickLogoX = gsap.quickTo(logo, "x",       { duration: 1.1, ease: "power3.out" });
    const quickLogoY = gsap.quickTo(logo, "y",       { duration: 1.1, ease: "power3.out" });
    const quickGlowX = gsap.quickTo(glow, "x",       { duration: 1.4, ease: "power3.out" });
    const quickGlowY = gsap.quickTo(glow, "y",       { duration: 1.4, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      const rect    = wrap.getBoundingClientRect();
      const relX    = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const relY    = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      const cx      = Math.max(-1, Math.min(1, relX));
      const cy      = Math.max(-1, Math.min(1, relY));
      quickX(cx * 6); quickY(cy * -6);
      quickLogoX(cx * 8); quickLogoY(cy * 8);
      quickGlowX(cx * 10); quickGlowY(cy * 10);
    };
    const handleLeave = () => {
      quickX(0); quickY(0);
      quickLogoX(0); quickLogoY(0);
      quickGlowX(0); quickGlowY(0);
    };

    section.addEventListener("mousemove",  handleMove);
    section.addEventListener("mouseleave", handleLeave);
    return () => {
      section.removeEventListener("mousemove",  handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    /*
      The section needs an explicit height so the absolutely-positioned
      DotField canvas has something to measure via getBoundingClientRect().
      100vh minimum covers the full viewport; content below pushes it taller.
    */
    <section
      id="banner"
      ref={sectionRef}
      className="relative overflow-hidden bg-black md:pb-[6vh]"
      style={{ perspective: "1000px" }}
    >
      {/* Background gradient */}
      <div
        ref={gradientRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 28%, rgba(149,100,244,0.22) 0%, rgba(149,100,244,0.06) 40%, rgba(0,0,0,0) 65%),
            linear-gradient(180deg, #000000 0%, #080510 50%, #000000 100%)
          `,
          backgroundSize: "140% 140%, 100% 100%",
          backgroundPosition: "50% 50%, 50% 50%",
        }}
      />

      {/*
        DotField wrapper — key rules:
        1. position:absolute + inset:0  →  fills the section completely
        2. width/height explicit px via JS after mount  →  canvas gets real numbers
        3. pointerEvents:none  →  mouse events fall through to logo tilt handler
        4. DotField.css sets .dot-field-container to position:relative; w/h 100%
           which is 100% of THIS div — so THIS div must have a real pixel height,
           which it gets from being absolute inset-0 inside a min-h-screen section.
      */}
      <div
        ref={dotFieldRef}
        className="absolute inset-0 z-[1]"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <DotField
          dotRadius={1.8}
          dotSpacing={20}
          cursorRadius={180}
          bulgeOnly={true}
          bulgeStrength={45}
          glowRadius={220}
          waveAmplitude={0}
          gradientFrom="rgba(149, 100, 244, 0.55)"
          gradientTo="rgba(149, 100, 244, 0.25)"
          glowColor="rgba(149, 100, 244, 0.15)"
          sparkle={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Logo + glow */}
      <div
        ref={logoWrapRef}
        className="flex justify-center absolute xl:top-20 lg:top-30 top-40 left-1/2 -translate-x-1/2 z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={glowRef}
          className="absolute inset-0 m-auto w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(149,100,244,0.3) 0%, rgba(149,100,244,0) 70%)",
            filter: "blur(40px)",
          }}
        />
        <img
          ref={logoRef}
          src="/banner-logo.webp"
          alt="logo"
          className="relative z-10 2xl:w-[729px] 2xl:h-[729px] xl:w-[600px] xl:h-[600px] lg:w-[500px] lg:h-[500px] md:w-[400px] md:h-[400px] w-[250px] h-[250px] will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        />
      </div>

      {/* Banner wave image */}
      <div
        ref={bannerContainerRef}
        className="absolute top-[46vh] w-full overflow-hidden z-10"
        style={{ height: "504px" }}
      >
        <div ref={bannerTrackRef} className="flex" style={{ willChange: "transform" }}>
          <img
            src="/banner.webp"
            alt="banner"
            className="banner-image w-full md:h-[504px] h-[180px] object-cover"
            style={{ willChange: "transform", transformOrigin: "center center" }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="flex justify-center items-center mt-[69.5vh] relative z-10">
        <h1
          ref={headingRef}
          className="font-boldonse font-normal 2xl:text-[125px] xl:text-[100px] md:text-[80px] text-[10vw] leading-[152%] uppercase text-white mt-[-10vh] md:mt-0"
        >
          Lead The Way
        </h1>
      </div>
    </section>
  );
};

export default Banner;