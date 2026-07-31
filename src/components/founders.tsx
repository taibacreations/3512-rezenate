// Founders.tsx — Sanity CMS powered (no cache)
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FoundersData, FounderItem } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Fallback photo paths (from /public) ───────────────────────────────────
const FALLBACK_PHOTOS = ["/founder-1.webp", "/founder-2.webp"];

// ── Fallback data ──────────────────────────────────────────────────────────
const FALLBACK_FOUNDERS: FounderItem[] = [
  {
    name: "Zak — The Alchemist",
    quote: "Leadership begins with honesty and not hierarchy.",
    bio: "Zak brings clarity to who companies are, what they stand for, and who should lead them next.",
  },
  {
    name: "Chloe — The Architect",
    quote: "We built Rezenate to make leadership feel human again.",
    bio: "Chloe brings structure, psychology, and emotional intelligence to every engagement, ensuring great partnerships are built to last.",
  },
];

const FALLBACK = {
  headingPlain: "THE",
  headingItalic: "founders",
  subParagraph:
    "Rezenate is founder-led. We believe that leadership can be both strong and kind.",
  founders: FALLBACK_FOUNDERS,
  accentColor: "#9564F4",
};

// ── Props ─────────────────────────────────────────────────────────────────
interface FoundersProps {
  data?: FoundersData | null;
}

const Founders = ({ data }: FoundersProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const headingItalic = data?.headingItalic ?? FALLBACK.headingItalic;
  const subParagraph = data?.subParagraph ?? FALLBACK.subParagraph;
  const founders = data?.founders?.length ? data.founders : FALLBACK.founders;
  const accentColor = data?.accentColor ?? FALLBACK.accentColor;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card1Ref, card2Ref];
  const mergeGradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(card1Ref.current, { autoAlpha: 0, x: -60 });
      gsap.set(card2Ref.current, { autoAlpha: 0, x: 60 });
      gsap.set(mergeGradientRef.current, { opacity: 0 });

      const isMobile = window.innerWidth < 768;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: isMobile ? "top 180%" : "top 140%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(headingRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
          })
            .to(
              card1Ref.current,
              { autoAlpha: 1, x: 0, duration: 1.3, ease: "expo.out" },
              "-=0.6",
            )
            .to(
              card2Ref.current,
              { autoAlpha: 1, x: 0, duration: 1.3, ease: "expo.out" },
              "-=1.0",
            )
            .to(
              mergeGradientRef.current,
              { opacity: 1, duration: 1.5, ease: "power2.out" },
              "-=0.8",
            );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="founders"
      ref={sectionRef}
      className="pb-[8vh] px-2 md:px-6 xl:px-10 pt-[12.5vh] bg-[url(/founder1.png)] bg-cover bg-bottom bg-no-repeat relative overflow-hidden"
    >
      <img
        src="/founder-blur.png"
        alt="blur"
        className="absolute w-full left-0 top-[-11vh] h-[300px]"
      />
      <img
        src="/founder-blur.png"
        alt="blur"
        className="absolute w-full left-0 2xl:bottom-[-19vh] md:bottom-[-15vh] bottom-[-9vh] md:h-[300px] z-30 h-[180px]"
      />
      
      {/* Merging Gradient Layer at Bottom */}
      <div
        ref={mergeGradientRef}
        className="absolute bottom-0 left-0 right-0 h-[250px] md:h-[350px] xl:h-[450px] pointer-events-none z-0"
        style={{
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            ${accentColor}05 20%, 
            ${accentColor}10 40%, 
            ${accentColor}20 60%, 
            ${accentColor}30 80%, 
            ${accentColor}40 100%)`,
        }}
      />

      {/* Additional soft blur layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] md:h-[300px] xl:h-[400px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at center bottom, 
            ${accentColor}25 0%, 
            ${accentColor}15 40%, 
            transparent 100%)`,
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10">
        {/* Heading */}
        <div
          ref={headingRef}
          style={{ opacity: 0 }}
          className="max-w-[878px] mx-auto text-center"
        >
          <h2 className="font-toruspro font-normal 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-[#0B0730]">
            {headingPlain} {headingItalic}
          </h2>
          <p className="font-outfit 2xl:text-[24px] xl:text-[22px] md:lg:text-[20px] text-[18px] leading-[130%] text-[#0B0730] mt-[1.5vh]">
            {subParagraph}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row justify-center md:gap-8 gap-[1vh] mt-[4vh]">
          {founders.map((founder, i) => {
            // Sanity photo → fallback to /public
            const photoUrl =
              founder.photo?.asset?.url ??
              FALLBACK_PHOTOS[i] ??
              "/founder-1.webp";

            return (
              <div
                key={i}
                ref={cardRefs[i]}
                style={{ opacity: 0 }}
                // Card bg — hardcoded from /public
                className="bg-white border border-[#DEE6E9] rounded-[29px] md:w-[566px] w-full py-[5vh] flex flex-col items-center text-center shadow-lg"
              >
                {/* Founder photo — from Sanity */}
                <img
                  src={photoUrl}
                  alt={founder.name}
                  className="xl:w-[177px] xl:h-[177px] lg:w-[140px] lg:h-[140px] w-[100px] h-[100px] rounded-full"
                />
                <div className="md:max-w-[394px] mx-auto lg:px-5 md:px-8 px-8">
                  <h3 className="font-toruspro font-semibold 2xl:text-[32px] xl:text-[30px] lg:text-[26px] text-[22px] leading-[90%] text-[#0B0730] mt-[3vh]">
                    {founder.name}
                  </h3>
                  <h4 className="font-outfit font-[500] 2xl:text-[24px] xl:text-[22px] lg:text-[20px] text-[18px] leading-[115%] text-[#0B0730] mt-[4vh] max-w-[350px] mx-auto">
                    "{founder.quote}"
                  </h4>
                  <hr
                    className="mt-[2vh] w-[70%] mx-auto"
                    style={{ borderColor: accentColor }}
                  />
                  <p className="font-outfit font-normal 2xl:text-[24px] xl:text-[22px] lg:text-[20px] text-[18px] leading-[130%] text-[#0B0730] mt-[1.5vh]">
                    {founder.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Founders;