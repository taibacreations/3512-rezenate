// Philosophy.tsx — Sanity CMS powered (no cache)
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PhilosophyData } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Fallback content ───────────────────────────────────────────────────────
const FALLBACK = {
  headingPlain:  "Every leader influences a culture long before they",
  headingItalic: "change a strategy.",
  para1:         "Some support people to become more of themselves.",
  para2:         "Others slowly ask them to become less.",
  para3:         "Rezenate exists because leadership resonates.",
  quoteText:     "People buy into the leader before they buy into the vision.",
  quoteAuthor:   "JOHN C MAXWELL",
  accentColor:   "#9564F4",
};

interface PhilosophyProps {
  data?: PhilosophyData | null;
}

const Philosophy = ({ data }: PhilosophyProps) => {
  const headingPlain  = data?.headingPlain  ?? FALLBACK.headingPlain;
  const headingItalic = data?.headingItalic ?? FALLBACK.headingItalic;
  const para1         = data?.para1         ?? FALLBACK.para1;
  const para2         = data?.para2         ?? FALLBACK.para2;
  const para3         = data?.para3         ?? FALLBACK.para3;
  const quoteText     = data?.quoteText     ?? FALLBACK.quoteText;
  const quoteAuthor   = data?.quoteAuthor   ?? FALLBACK.quoteAuthor;
  const accentColor   = data?.accentColor   ?? FALLBACK.accentColor;

  const sectionRef  = useRef<HTMLElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const para1Ref    = useRef<HTMLParagraphElement>(null);
  const para2Ref    = useRef<HTMLParagraphElement>(null);
  const para3Ref    = useRef<HTMLParagraphElement>(null);
  const quoteBoxRef = useRef<HTMLDivElement>(null);

  // ── Logo assembly loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");

    gsap.set(paths[2], { scale: 0.25, opacity: 0, transformOrigin: "center center" });
    gsap.set(paths[1], { opacity: 0, transformOrigin: "center center" });
    gsap.set(paths[0], { opacity: 0, transformOrigin: "center center" });

    const assembleTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 170%",
      },
    });

    assembleTl
      .fromTo(paths[2], { x: 30, y: -30, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
      .to(paths[2], { scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 0.8)
      .fromTo(paths[1], { x: 50, y: -50, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }, 1.8)
      .fromTo(paths[0], { x: 70, y: -70, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }, 3.2);

    return () => { assembleTl.kill(); };
  }, []);

  // ── Entrance animations ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, para1Ref.current, para2Ref.current, para3Ref.current, quoteBoxRef.current], {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 140%",
          once: true,
        },
      });

      tl
        .fromTo(headingRef.current,  { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out" })
        .fromTo(para1Ref.current,    { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" }, "-=0.7")
        .fromTo(para2Ref.current,    { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" }, "-=0.6")
        .fromTo(para3Ref.current,    { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" }, "-=0.6")
        .fromTo(quoteBoxRef.current, { autoAlpha: 0, x: 50, y: 10 }, { autoAlpha: 1, x: 0, y: 0, duration: 1.1, ease: "expo.out" }, "-=0.8");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-[url(/philosophy1.webp)] bg-cover bg-bottom relative"
    >
      {/* Logo mark — hardcoded white fill */}
      <div className="absolute right-[18%] top-[45%]">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="51"
          height="51"
          viewBox="0 0 51 51"
          fill="none"
          className="w-[112px] h-[112px] hidden md:block"
        >
          <path d="M50.1239 1.90735e-06H0L2.49058 2.50577C9.0288 9.08386 17.9205 12.7828 27.1952 12.7828H37.0313V22.6809C37.0313 31.9189 40.701 40.7785 47.2333 47.3107L50.1239 50.2014V1.90735e-06Z" fill="white" />
          <path d="M32.0737 17.9733H0.078125L8.36888 26.2641C11.2451 29.1403 15.146 30.7561 19.2135 30.7561C19.2135 34.9228 20.8687 38.9189 23.8151 41.8652L32.0737 50.1239V17.9733Z" fill="white" />
          <path d="M14.1772 50.1239V35.9467H0L14.1772 50.1239Z" fill="white" />
        </svg>
      </div>

      {/* Quote box — bg hardcoded from /public */}
      <div
        ref={quoteBoxRef}
        style={{ opacity: 0 }}
        className="bg-[url(/philosophy-box.webp)] md:bg-cover bg-contain bg-no-repeat bg-center xl:w-[500px] xl:h-[214px] lg:w-[400px] lg:h-[180px] md:w-[370px] w-full h-[160px] rounded-[36px] absolute bottom-[12%] md:right-[18.3%] md:left-auto flex justify-center"
      >
        <div className="max-w-[368px] 2xl:pt-[3.3vh] xl:pt-[3.8vh] md:pt-[3vh] pt-[2vh] xl:ml-4 lg:ml-[5vw] md:ml-[8vw] px-14 md:px-0 lg:mr-0">
          <h5 className="font-outfit 2xl:text-[27px] xl:text-[24px] lg:text-[22px] text-[20px] leading-[114%] font-normal text-white">
            {quoteText}
          </h5>
          <h4 className="font-outfit font-semibold 2xl:text-[27px] xl:text-[24px] lg:text-[22px] text-[20px] leading-[114%] text-white mt-[1vh]">
            — {quoteAuthor}
          </h4>
        </div>
      </div>

      {/* Text content */}
      <div className="max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4 md:pt-[27vh] pt-[10vh]">
        <div className="xl:max-w-[714px] lg:max-w-[620px] max-w-[550px] relative z-20">
          <h2
            ref={headingRef}
            style={{ opacity: 0 }}
            className="font-readex font-light 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-black"
          >
            {headingPlain}{" "}
            <span
              className="tracking-[0em] italic font-tartuffo lowercase"
              style={{ color: accentColor }}
            >
              {headingItalic}
            </span>
          </h2>
          <div className="max-w-[434px]">
            <p ref={para1Ref} style={{ opacity: 0 }} className="font-outfit font-normal 2xl:text-[30px] xl:text-[26px] text-[22px] leading-[114%] text-black mt-[3vh]">
              {para1}
            </p>
            <p ref={para2Ref} style={{ opacity: 0 }} className="font-outfit font-normal 2xl:text-[30px] xl:text-[26px] text-[22px] leading-[114%] text-black mt-[3.5vh]">
              {para2}
            </p>
            <p ref={para3Ref} style={{ opacity: 0 }} className="font-outfit font-normal 2xl:text-[30px] xl:text-[26px] text-[22px] leading-[114%] text-black mt-[3.5vh]">
              {para3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;