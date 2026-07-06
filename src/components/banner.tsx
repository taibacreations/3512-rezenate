// components/banner.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
// @ts-ignore
import DotField from "./DotField";

interface BannerData {
  heading?: string;
  subtitle?: string;
  bannerWaveImage?: { asset: { _ref: string } };
}

interface Props {
  data: BannerData;
}

const Banner = ({ data }: Props) => {
  const sectionRef         = useRef<HTMLElement>(null);
  const gradientRef        = useRef<HTMLDivElement>(null);
  const headingRef         = useRef<HTMLHeadingElement>(null);
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const bannerTrackRef     = useRef<HTMLDivElement>(null);
  const dotFieldRef        = useRef<HTMLDivElement>(null);
  const subtitleRef        = useRef<HTMLParagraphElement>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current,  { opacity: 0, y: 30, filter: "blur(6px)" });
      gsap.set(gradientRef.current, { opacity: 0 });
      gsap.set(dotFieldRef.current, { opacity: 0 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({ paused: true });
      tl.to(gradientRef.current, { opacity: 1, duration: 2.4, ease: "power2.out" })
        .to(dotFieldRef.current, { opacity: 1, duration: 3.0, ease: "power2.out" }, "-=2.0")
        .to(headingRef.current,  { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "power3.out" }, "-=2.0")
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, "-=0.8");

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

  // Subtle gradient breathing
  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(gradient, { backgroundPosition: "51% 49%", duration: 16 }, 0);
    return () => { tl.kill(); };
  }, []);

  // Wave float
  useEffect(() => {
    const track = bannerTrackRef.current;
    if (!track) return;
    const img = track.querySelector<HTMLImageElement>(".banner-image");
    if (!img) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(img, { y: "+=8", duration: 6 }, 0);
    return () => { tl.kill(); };
  }, []);

  // Static wave image — never from Sanity
  const waveSrc = "/banner.webp";
  const heading  = data?.heading
  const subtitle = data?.subtitle

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative bg-black px-4 md:min-h-[93.5vh] h-[900px]"
    >
      {/* Background gradient */}
      <div
        ref={gradientRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 28%, rgba(149,100,244,0.20) 0%, rgba(149,100,244,0.05) 40%, rgba(0,0,0,0) 65%),
            linear-gradient(180deg, #000000 0%, #080510 50%, #000000 100%)
          `,
          backgroundSize: "140% 140%, 100% 100%",
          backgroundPosition: "50% 50%, 50% 50%",
        }}
      />

      {/* Dot field */}
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

      {/* Static wave/ripple image — bottom */}
      <div
        ref={bannerContainerRef}
        className="absolute bottom-0 w-full z-10"
        style={{ height: "55vh", overflow: "visible" }}
      >
        <div ref={bannerTrackRef} className="w-full h-full">
          <img
            src={waveSrc}
            alt="Rezenate ripple"
            className="banner-image w-full h-full object-cover object-top"
            style={{ willChange: "transform", transformOrigin: "center top" }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[80vh]">
        <h1
          ref={headingRef}
          className="font-boldonse font-normal 2xl:text-[110px] xl:text-[90px] md:text-[72px] text-[11vw] md:leading-[1.1] uppercase text-white text-center px-4"
        >
          {heading}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-white/40 text-sm md:text-base tracking-[0.25em] uppercase font-outfit text-center"
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default Banner;