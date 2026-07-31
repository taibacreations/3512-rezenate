// Values.tsx — Sanity CMS powered (no cache)
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ValuesData, ValueItem } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Hardcoded fallback SVG icons — used when Sanity has neither image nor svg ──
const FALLBACK_ICONS: Record<number, (color: string) => React.ReactNode> = {
  0: (c) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px]"
    >
      <path
        d="M16 27.5S3.5 20 3.5 11.5A6.5 6.5 0 0 1 16 8.257 6.5 6.5 0 0 1 28.5 11.5C28.5 20 16 27.5 16 27.5Z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  1: (c) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px]"
    >
      <path
        d="M16 4a8 8 0 0 1 5 14.2V21a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2.8A8 8 0 0 1 16 4Z"
        stroke={c}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M13 25h6M14 28h4"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  2: (c) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px]"
    >
      <path
        d="M18 4L8 18h8l-2 10 14-16h-8L18 4Z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  3: (c) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px]"
    >
      <path
        d="M16 5v22M10 27h12"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 7L6 12l-2 4a6 6 0 0 0 12 0L14 12 16 7Z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 7l10 5 2 4a6 6 0 0 1-12 0l2-4 10-5Z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  4: (c) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px]"
    >
      <path
        d="M2 16h4M6 16c0-4 2-8 4-8s4 8 4 8 2 8 4 8 4-8 4-8M26 16h4"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ── Icon renderer — priority: image > svgCode > hardcoded fallback ─────────
const CardIcon = ({
  item,
  index,
  accentColor,
}: {
  item: ValueItem;
  index: number;
  accentColor: string;
}) => {
  const imageUrl = item.iconImage?.asset?.url;
  const svgCode = item.iconSvg;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={item.title}
        className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px] object-contain"
      />
    );
  }

  if (svgCode) {
    return (
      <span
        className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    );
  }

  return <>{FALLBACK_ICONS[index]?.(accentColor)}</>;
};

// ── Fallback data ──────────────────────────────────────────────────────────
const FALLBACK_ITEMS: ValueItem[] = [
  {
    id: "01",
    title: "Meraki",
    desc: "We bring heart to everything we do",
    expanded:
      "From the Greek for 'putting your soul into your work,' Meraki means pouring soul, care, and creativity into what we do, leaving a piece of ourselves in everything we touch. That spirit runs through every detail we craft, every leader we introduce, and every relationship we nurture.",
  },
  {
    id: "02",
    title: "Wisdom",
    desc: "We make thoughtful decisions.",
    expanded:
      "Wisdom is not just knowledge — it is knowing when to act, when to listen, and when to step back. We draw on deep experience and careful discernment to guide our clients and partners toward decisions that stand the test of time.",
  },
  {
    id: "03",
    title: "Rezolutionary",
    desc: "We believe everyone has the power to shape what happens next.",
    expanded:
      "Being Rezolutionary means refusing to accept the status quo as the ceiling. We challenge assumptions, champion bold thinking, and stand beside leaders who are courageous enough to reimagine what is possible — and then make it real.",
  },
  {
    id: "04",
    title: "UPEKKHA",
    desc: "We meet every moment with balance.",
    expanded:
      "Upekkha is a Pali word for equanimity — the ability to remain steady and open-hearted in the face of uncertainty. We bring that calm, balanced presence to every engagement, ensuring clarity never gets lost in the noise.",
  },
  {
    id: "05",
    title: "CADENCE",
    desc: "We move with rhythm and intention.",
    expanded:
      "Great leadership is not a sprint — it is a rhythm sustained over time. Cadence is our commitment to consistent, intentional momentum: showing up with the same energy, rigour, and care whether it is day one or year five of a partnership.",
  },
];

const FALLBACK = {
  headingPlain: "The way we work should reflect the way we live.",
  items: FALLBACK_ITEMS,
};

interface ValuesProps {
  data?: ValuesData | null;
}

const Values = ({ data }: ValuesProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const items = data?.items?.length ? data.items : FALLBACK.items;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const gradientRef = useRef<HTMLImageElement>(null);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref];

  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayCardRef = useRef<HTMLDivElement>(null);
  const overlayNumRef = useRef<HTMLSpanElement>(null);
  const overlayTitleRef = useRef<HTMLHeadingElement>(null);
  const overlayLineRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLParagraphElement>(null);
  const overlayBackRef = useRef<HTMLButtonElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isTransitioning = useRef(false);
  const active = activeIndex !== null ? items[activeIndex] : null;

  // ── Entrance ───────────────────────────────────────────────────────────
  useEffect(() => {
    let st: ScrollTrigger | null = null;
    let onLoadingDone: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const cards = cardRefs.map((r) => r.current);

      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(ballRef.current, { autoAlpha: 0, scale: 0.9, rotate: -8 });
      gsap.set(gradientRef.current, { autoAlpha: 0, x: -20 });
      gsap.set(cards, { autoAlpha: 0, x: 80 });

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
            tl.to(gradientRef.current, {
              autoAlpha: 1,
              x: 0,
              duration: 1.8,
              ease: "expo.out",
            })
              .to(
                headingRef.current,
                { autoAlpha: 1, y: 0, duration: 1.4, ease: "expo.out" },
                "-=1.4",
              )
              .to(
                ballRef.current,
                {
                  autoAlpha: 1,
                  scale: 1,
                  rotate: 0,
                  duration: 2.0,
                  ease: "expo.out",
                },
                "-=1.2",
              )
              .to(
                cards,
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 1.2,
                  ease: "expo.out",
                  stagger: 0.14,
                },
                "-=1.6",
              )
              .call(() => {
                gsap.to(ballRef.current, {
                  y: 18,
                  duration: 5.0,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                });
                gsap.to(ballRef.current, {
                  rotate: 5,
                  duration: 9.0,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                });
              });
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

  // ── Overlay open ───────────────────────────────────────────────────────
  const openOverlay = (index: number) => {
    setActiveIndex(index);
    requestAnimationFrame(() => {
      const els = [
        overlayNumRef.current,
        overlayTitleRef.current,
        overlayLineRef.current,
        overlayTextRef.current,
        overlayBackRef.current,
      ];
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set(overlayCardRef.current, { autoAlpha: 0, y: 30, scale: 0.97 });
      gsap.set(els, { autoAlpha: 0, y: 14 });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.35,
        ease: "power2.out",
      })
        .to(
          overlayCardRef.current,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: "expo.out" },
          "-=0.1",
        )
        .to(
          els,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.35",
        );
    });
  };

  // ── Overlay close ──────────────────────────────────────────────────────
  const closeOverlay = () => {
    const tl = gsap.timeline({ onComplete: () => setActiveIndex(null) });
    tl.to(overlayCardRef.current, {
      autoAlpha: 0,
      y: 16,
      scale: 0.97,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      { autoAlpha: 0, duration: 0.25, ease: "power2.in" },
      "-=0.1",
    );
  };

  // ── Carousel navigation ──────────────────────────────────────────────────
  const goToIndex = (newIndex: number, direction: 1 | -1) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const els = [
      overlayNumRef.current,
      overlayTitleRef.current,
      overlayLineRef.current,
      overlayTextRef.current,
    ];

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning.current = false;
      },
    });

    tl.to(els, {
      autoAlpha: 0,
      x: direction * -28,
      duration: 0.25,
      ease: "power2.in",
    })
      .call(() => setActiveIndex(newIndex))
      .set(els, { x: direction * 28 })
      .to(els, {
        autoAlpha: 1,
        x: 0,
        duration: 0.45,
        ease: "expo.out",
      });
  };

  const goToPrev = () => {
    if (activeIndex === null) return;
    const newIndex = (activeIndex - 1 + items.length) % items.length;
    goToIndex(newIndex, -1);
  };

  const goToNext = () => {
    if (activeIndex === null) return;
    const newIndex = (activeIndex + 1) % items.length;
    goToIndex(newIndex, 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") closeOverlay();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items.length]);

  const cardPositions = [
    "right-[3.7%]",
    "right-[-1%] xl:top-[15vh] 2xl:top-[17vh] top-[14vh]",
    "right-[3.5%] xl:top-[30vh] 2xl:top-[34vh] top-[28vh]",
    "right-[-1%] xl:top-[46vh] 2xl:top-[51vh] top-[42vh]",
    "right-[4%] 2xl:top-[68vh] xl:top-[63vh] top-[58vh]",
  ];

  return (
    <>
      <section
        ref={sectionRef}
        className="xl:min-h-[127vh] min-h-screen relative z-20"
      >
        <div className="2xl:pt-[8.3vh] xl:pt-[13vh] pt-[5vh] max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4">
          {/* Heading */}
          <div
            ref={headingRef}
            style={{ opacity: 0 }}
            className="text-center 2xl:max-w-[874px] xl:max-w-[800px] lg:max-w-[720px] max-w-[600px] mx-auto will-change-transform"
          >
            <h2 className="font-toruspro font-normal 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-[#0B0730]">
              {headingPlain}
            </h2>
          </div>

          <div>
            {/* Ball — hardcoded */}
            <div className="md:absolute 2xl:left-[13.8%] xl:left-[8%] lg:left-[6%] md:left-[3%] top-[3%]">
              <img
                ref={ballRef}
                src="/value-ball1.webp"
                alt="value-ball"
                style={{ opacity: 0 }}
                className="2xl:w-[938px] 2xl:h-[1081px] xl:w-[850px] md:w-[750px] w-full xl:h-[1000px] md:h-[850px] h-auto will-change-transform"
              />
            </div>

            {/* Cards */}
            <div className="relative xl:mt-[8.2vh] mt-[5vh] flex flex-col gap-[2vh] md:block pb-[15vh] md:pb-0">
              {items.map((v, i) => (
                <div
                  key={v.id}
                  ref={cardRefs[i]}
                  onClick={() => openOverlay(i)}
                  style={{ opacity: 0 }}
                  className={`value-card bg-[#FAFAFC] border border-[#DEE6E9] xl:rounded-[22px] rounded-[18px] xl:w-[680px] md:w-[550px] w-full 2xl:h-[130px] xl:h-[110px] h-[100px] flex items-center md:absolute cursor-pointer
                    transition-colors duration-300 hover:border-[#9564F4] hover:shadow-[0_4px_28px_rgba(149,100,244,0.12)]
                    will-change-transform ${cardPositions[i] ?? ""}`}
                >
                  <h6 className="font-bold xl:text-[18px] text-[16px] font-mulish absolute right-4.5 top-2">
                    {v.id}
                  </h6>
                  <div className="flex pl-6 pr-15 xl:gap-6 gap-3">
                    <div
                      className="2xl:w-[76px] 2xl:h-[76px] md:w-[60px] w-[45px] md:h-[50px] h-[50px] 2xl:rounded-[29px] md:rounded-[20px] rounded-[15px] flex justify-center items-center shrink-0"
                      style={{ backgroundColor: `#9564F41F` }}
                    >
                      <CardIcon item={v} index={i} accentColor={"#9564F4"} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-toruspro font-normal 2xl:text-[32px] xl:text-[28px] md:text-[24px] text-[20px] text-[#0B0730] leading-[151%]">
                        {v.title}
                      </h4>
                      <p className="font-mulish font-normal 2xl:text-[18px] md:text-[16px] text-[14px] text-[#0B0730] leading-[115%] xl:leading-[25px]">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Overlay carousel ── */}
      {active && (
        <div
          ref={overlayRef}
          style={{ opacity: 0 }}
          onClick={closeOverlay}
          className="fixed inset-0 z-[999] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[8px]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[700px] h-[700px] rounded-full blur-[100px]"
              style={{ backgroundColor: `#9564F414` }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={closeOverlay}
            aria-label="Close"
            className="absolute top-7 right-9 z-20 w-9 h-9 flex items-center justify-center rounded-full border border-[#DEE6E9] text-[#0B0730] hover:text-[#9564F4] hover:border-[#9564F4] transition-all duration-200 text-[15px] bg-white/80 backdrop-blur-sm"
          >
            ✕
          </button>

          {/* ── Premium Navigation Arrows ── */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous value"
            className="absolute left-4 md:left-10 xl:left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-[#DEE6E9] text-[#0B0730] hover:bg-[#9564F4] hover:text-white hover:border-[#9564F4] transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next value"
            className="absolute right-4 md:right-10 xl:right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-[#DEE6E9] text-[#0B0730] hover:bg-[#9564F4] hover:text-white hover:border-[#9564F4] transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Overlay Card Content */}
          <div
            ref={overlayCardRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: 0,
              background:
                "linear-gradient(160deg, #ffffff 0%, #f7f4ff 60%, #f0ebff 100%)",
              border: `1px solid #9564F42E`,
              boxShadow: `0 8px 48px #9564F41F, 0 2px 0 rgba(255,255,255,0.9) inset`,
            }}
            className="relative z-10 w-[90%] max-w-[740px] text-center px-12 py-14 rounded-[24px]"
          >
            <span
              ref={overlayNumRef}
              style={{ opacity: 0, color: "#9564F4" }}
              className="font-mulish font-bold text-[15px] tracking-[0.28em] block mb-5"
            >
              {active.id} / {String(items.length).padStart(2, "0")}
            </span>
            <h3
              ref={overlayTitleRef}
              style={{ opacity: 0 }}
              className="font-toruspro font-normal 2xl:text-[50px] xl:text-[40px] md:text-[36px] text-[22px] text-[#0B0730] leading-[110%] tracking-[0.03em]"
            >
              {active.title.toUpperCase()}
            </h3>
            <div
              ref={overlayLineRef}
              style={{ opacity: 0 }}
              className="mx-auto mt-5 mb-8"
            >
              <div
                className="w-[48px] h-[2px] mx-auto rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, #9564F4, transparent)`,
                }}
              />
            </div>
            <p
              ref={overlayTextRef}
              style={{ opacity: 0 }}
              className="font-mulish font-normal text-[17px] text-[#0B0730] xl:leading-[185%] leading-[151%] max-w-[560px] mx-auto"
            >
              {active.expanded}
            </p>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-9">
              {items.map((v, i) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (i === activeIndex) return;
                    goToIndex(i, i > (activeIndex ?? 0) ? 1 : -1);
                  }}
                  aria-label={`Go to ${v.title}`}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i === activeIndex ? "#9564F4" : "#9564F433",
                    transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            <button
              ref={overlayBackRef}
              onClick={closeOverlay}
              style={{ opacity: 0 }}
              className="mt-8 inline-block font-mulish font-semibold text-[13px] tracking-[0.22em] uppercase text-[#0B0730] hover:text-[#9564F4] transition-colors duration-300 relative group"
            >
              Back to Values
              <span className="absolute -bottom-[3px] left-0 w-full h-[1px] bg-black/15 group-hover:bg-[#9564F4] transition-colors duration-300" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Values;
