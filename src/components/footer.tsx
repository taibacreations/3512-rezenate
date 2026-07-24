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
  headingItalic: "way",
  paragraph:
    "10% of every retainer supports a cause our clients care about. We also make a matching donation to a charity chosen by their new leader, because good business should always leave the world better than it found it.",
  copyrightText: "© Rezenate 2025. All rights reserved.",
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
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  // ── Logo assembly ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");

    gsap.set(paths[2], {
      scale: 0.25,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set(paths[1], { opacity: 0, transformOrigin: "center center" });
    gsap.set(paths[0], { opacity: 0, transformOrigin: "center center" });

    const isMobile = window.innerWidth < 768;

    const assembleTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      scrollTrigger: {
        trigger: svgRef.current,
        start: isMobile ? "top 250%" : "top 140%",
      },
    });

    assembleTl
      .fromTo(
        paths[2],
        { x: 30, y: -30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0,
      )
      .to(paths[2], { scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 0.8)
      .fromTo(
        paths[1],
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" },
        1.8,
      )
      .fromTo(
        paths[0],
        { x: 70, y: -70, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" },
        3.2,
      );

    return () => {
      assembleTl.kill();
    };
  }, []);

  // ── Entrance ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(headingRef.current, { autoAlpha: 0, y: 25 });
      gsap.set(paraRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(copyrightRef.current, { autoAlpha: 0 });

      const isMobile = window.innerWidth < 768;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: isMobile ? "top 180%" : "top 140%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(cardRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
          })
            .to(
              headingRef.current,
              { autoAlpha: 1, y: 0, duration: 1.0, ease: "expo.out" },
              "-=0.7",
            )
            .to(
              paraRef.current,
              { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" },
              "-=0.6",
            )
            .to(
              copyrightRef.current,
              { autoAlpha: 1, duration: 0.7, ease: "power2.out" },
              "-=0.3",
            );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[url(/footer.webp)] bg-[50%_100%] relative"
    >
      {/* Logo SVG — color from accentColor */}
      <div className="absolute xl:top-[13vh] md:top-[12vh] top-[27vh] left-1/2 -translate-x-1/2">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="589"
          height="589"
          viewBox="0 0 589 589"
          fill="none"
          className="xl:w-[589px] xl:h-[589px] md:w-[480px] md:h-[480px] w-full h-auto md:scale-100 scale-150"
        >
          <path
            d="M588.052 0H0L138.843 139.69C145.382 146.268 154.273 149.967 163.548 149.967H434.45V420.931C434.45 430.169 438.12 439.029 444.652 445.561L588.052 588.961V0Z"
            fill={accentColor}
          />
          <path
            d="M376.303 210.863H0.931641L141.194 351.126C147.408 357.34 155.835 360.83 164.623 360.83H225.428V423.453C225.428 432.24 228.918 440.668 235.132 446.881L376.303 588.053V210.863Z"
            fill={accentColor}
          />
          <path
            d="M166.327 588.054V421.727H0L166.327 588.054Z"
            fill={accentColor}
          />
        </svg>
      </div>

      {/* Card — bg hardcoded from /public */}
      <div className="flex justify-center items-center xl:pt-[24vh] pt-[16vh] md:pb-[23.5vh] pb-[16vh] relative px-4 md:px-6 xl:px-10">
        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className="bg-[url(/footers.webp)] xl:bg-cover md:bg-contain bg-[length:100%_59%]  bg-no-repeat bg-center xl:w-[1150px] h-[426px] md:w-[700px] w-full xl:rounded-[20px] rounded-[30px]"
        >
          <div className="max-w-[678px] mx-auto text-center xl:mt-[10vh] lg:mt-[14vh] mt-[14.5vh] mt-[12vh] xl:px-0 md:px-12 px-4">
            <h2
              ref={headingRef}
              style={{ opacity: 0 }}
              className="font-toruspro font-light 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[114%] tracking-[-0.04em] capitalize text-black"
            >
              {headingPlain}{" "}
              <span className="tracking-[0em] italic font-tartuffo lowercase">
                {headingItalic}
              </span>
            </h2>
            <p
              ref={paraRef}
              style={{ opacity: 0 }}
              className="font-outfit xl:text-[24px] md:text-[20px] text-[16px] leading-[115%] text-black mt-[1.5vh]"
            >
              {paragraph}
            </p>
          </div>
        </div>
      </div>

      {/* Copyright bar — bg from accentColor */}
      <div
        ref={copyrightRef}
        style={{ opacity: 0, backgroundColor: "#9564F4" }}
        className="xl:h-[80px] md:h-[70px] py-[2vh] flex justify-center items-center"
      >
        <p className="font-outfit 2xl:text-[28px] xl:text-[26px] lg:text-[24px] md:text-[20px] text-[18px] leading-[115%] font-normal text-[#F6F6F6]">
          {copyrightText}
        </p>
      </div>
    </section>
  );
};

export default Footer;
