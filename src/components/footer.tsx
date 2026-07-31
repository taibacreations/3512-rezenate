// Footer.tsx — Sanity CMS powered (no cache)
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FooterData } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Fallback ───────────────────────────────────────────────────────────────
const FALLBACK = {
  headingPlain: "Lead The",
  headingItalic: "Way",
  paragraph:
    "10% of every retainer supports a cause our clients care about. We also make a matching donation to a charity chosen by their new leader, because good business should always leave the world better than it found it.",
  copyrightText: "© Rezenate 2026. All rights reserved.",
  accentColor: "#9564F4",
};

interface FooterProps {
  data?: FooterData | null;
}

const Footer = ({ data }: FooterProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const headingItalic = data?.headingItalic ?? FALLBACK.headingItalic;
  const paragraph = data?.paragraph ?? FALLBACK.paragraph;
  const copyrightText = data?.copyrightText ?? FALLBACK.copyrightText;
  const accentColor = data?.accentColor ?? FALLBACK.accentColor;

  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  // ── Entrance Animation ───────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Set initial hidden states
      gsap.set([leftContentRef.current, rightContentRef.current, dividerRef.current], { 
        autoAlpha: 0, 
        y: 30 
      });
      gsap.set(headingRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(copyrightRef.current, { autoAlpha: 0, y: 15 });
      gsap.set(paraRef.current, { autoAlpha: 0, y: 15 });

      // 2. Create timeline with ScrollTrigger attached directly
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 210%", // Triggers when top of footer is 90% down the viewport
          once: true,
        },
      });

      // 3. Define the animation sequence
      tl.to(leftContentRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.0,
        ease: "expo.out",
      })
        .to(
          dividerRef.current,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.6"
        )
        .to(
          rightContentRef.current,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "-=0.4"
        )
        .to(
          headingRef.current,
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=0.8"
        )
        .to(
          copyrightRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          paraRef.current,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "-=0.6"
        );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#9564F4] z-50"
    >
      <div className="max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between xl:py-[6vh] lg:py-[5vh] md:py-[4vh] py-[3vh] gap-8 md:gap-0">
          
          {/* Left side - Heading & Copyright */}
          <div ref={leftContentRef} className="w-full md:w-auto">
            <h2 
              ref={headingRef}
              className="font-toruspro font-normal 2xl:text-[56px] xl:text-[48px] lg:text-[42px] md:text-[36px] text-[32px] leading-[113%] tracking-[-0.04em] text-white"
            >
              {headingPlain} {headingItalic}
            </h2>
            <p 
              ref={copyrightRef}
              className="font-outfit font-normal xl:text-[18px] lg:text-[16px] text-[15px] leading-[150%] text-white/80 mt-3"
            >
              {copyrightText}
            </p>
          </div>

          {/* Vertical Divider - hidden on mobile */}
          <div 
            ref={dividerRef}
            className="hidden md:block w-px h-[120px] bg-white/30 self-center"
          />

          {/* Right side - Paragraph */}
          <div 
            ref={rightContentRef}
            className="w-full md:w-[55%] lg:w-[50%]"
          >
            <p 
              ref={paraRef}
              className="font-outfit font-normal xl:text-[20px] lg:text-[18px] text-[16px] leading-[160%] text-white/90"
            >
              {paragraph}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;