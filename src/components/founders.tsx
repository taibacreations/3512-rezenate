// Founders.tsx — Sanity CMS powered (no cache)
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FoundersData, FounderItem } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Fallback photo paths (from /public) ───────────────────────────────────
const FALLBACK_PHOTOS = ["/founder-1.png", "/founder-2.png"];

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
  headingPlain: "THE Founders",
  subParagraph:
    "Rezenate is founder-led. We believe that leadership can be both strong and kind.",
  founders: FALLBACK_FOUNDERS,
};

// ── Props ─────────────────────────────────────────────────────────────────
interface FoundersProps {
  data?: FoundersData | null;
}

const Founders = ({ data }: FoundersProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const subParagraph = data?.subParagraph ?? FALLBACK.subParagraph;
  const founders = data?.founders?.length ? data.founders : FALLBACK.founders;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card1Ref, card2Ref];
  const mergeGradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let st: ScrollTrigger | null = null;
    let onLoadingDone: (() => void) | null = null;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(card1Ref.current, { autoAlpha: 0, x: -60 });
      gsap.set(card2Ref.current, { autoAlpha: 0, x: 60 });
      gsap.set(mergeGradientRef.current, { opacity: 0 });

      const isMobile = window.innerWidth < 768;

      const createTrigger = () => {
        st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: isMobile ? "top 80%" : "top 70%",
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
      };

      if ((window as any).__loadingDone) {
        createTrigger();
      } else {
        onLoadingDone = () => {
          setTimeout(() => {
            ScrollTrigger.refresh(true);
            createTrigger();
          }, 150);
        };

        window.addEventListener("loading-done", onLoadingDone, { once: true });

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

  return (
    <div>
      <svg className="relative" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F7F6F9" fill-opacity="1" d="M0,192L48,165.3C96,139,192,85,288,101.3C384,117,480,203,576,218.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      <section
        id="founders"
        ref={sectionRef}
        className="pb-[8vh] px-4 md:px-6 xl:px-10 pt-[8vh] md:pt-0 md:pb-0 bg-[#F7F6F9] relative"
      >
        <img
          src="/founderss.png"
          alt="vector"
          className="absolute md:min-w-[1200px] w-[1400px] left-1/2 -translate-x-1/2 z-40"
        />

        <div className="relative z-40">
          {/* Heading */}
          <div
            ref={headingRef}
            style={{ opacity: 0 }}
            className="max-w-[878px] mx-auto text-center"
          >
            <h2 className="font-toruspro font-normal 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-[#0B0730]">
              {headingPlain}
            </h2>
            <p className="font-outfit 2xl:text-[24px] xl:text-[22px] md:lg:text-[20px] text-[18px] leading-[130%] text-[#0B0730] mt-[1.5vh]">
              {subParagraph}
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col md:flex-row justify-center md:gap-8 gap-[3vh] mt-[5vh]">
            {founders.map((founder, i) => {
              const photoUrl =
                founder.photo?.asset?.url ??
                FALLBACK_PHOTOS[i] ??
                "/founder-1.png";

              return (
                <div
                  key={i}
                  ref={cardRefs[i]}
                  style={{ opacity: 0 }}
                  className="bg-[#FAFAFC] border border-[#DEE6E9] rounded-[22px] md:w-[566px] w-full overflow-hidden shadow-lg"
                >
                  {/* Founder photo — inset, rounded, full-width */}
                  <div className="p-3 md:p-4">
                    <img
                      src={photoUrl}
                      alt={founder.name}
                      className="w-full h-[260px] md:h-[320px] xl:h-[360px] object-cover rounded-[12px]"
                    />
                  </div>

                  {/* Text — left aligned */}
                  <div className="px-6 md:px-10 pb-8 md:pb-10 text-left">
                    <h3 className="font-toruspro font-semibold 2xl:text-[30px] xl:text-[28px] lg:text-[24px] text-[22px] leading-[100%] text-[#0B0730] mt-[2vh]">
                      {founder.name}
                    </h3>
                    <h4 className="font-outfit italic font-[500] 2xl:text-[22px] xl:text-[20px] lg:text-[19px] text-[17px] leading-[130%] text-[#0B0730] mt-[2vh]">
                      "{founder.quote}"
                    </h4>
                    <hr
                      className="mt-[2.5vh] w-16 border-t"
                      style={{ borderColor: "#9564F4" }}
                    />
                    <p className="font-outfit font-normal 2xl:text-[19px] xl:text-[18px] lg:text-[17px] text-[16px] leading-[150%] text-[#0B0730] mt-[2.5vh]">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <svg className="relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F7F6F9" fill-opacity="1" d="M0,192L48,165.3C96,139,192,85,288,101.3C384,117,480,203,576,218.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
    </div>
  );
};

export default Founders;
