"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const valuesData = [
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

const Values = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const gradientRef = useRef<HTMLImageElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayCardRef = useRef<HTMLDivElement>(null);
  const overlayNumRef = useRef<HTMLSpanElement>(null);
  const overlayTitleRef = useRef<HTMLHeadingElement>(null);
  const overlayLineRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLParagraphElement>(null);
  const overlayBackRef = useRef<HTMLButtonElement>(null);

  const [active, setActive] = useState<(typeof valuesData)[0] | null>(null);
  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref];

  // ── Entrance ──────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.map((r) => r.current);

      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(ballRef.current, { autoAlpha: 0, scale: 0.9, rotate: -8 });
      gsap.set(gradientRef.current, { autoAlpha: 0, x: -20 });

      // Cards: start 120px off to the right, invisible
      gsap.set(cards, { autoAlpha: 0, x: 120 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to(gradientRef.current, {
            autoAlpha: 1,
            x: 0,
            duration: 2.6,
            ease: "expo.out",
          })
            .to(
              headingRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: 2.4,
                ease: "expo.out",
              },
              "-=1.8",
            )
            .to(
              ballRef.current,
              {
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                duration: 3.2,
                ease: "expo.out",
              },
              "-=2.0",
            )
            .to(
              cards,
              {
                autoAlpha: 1,
                x: 0,
                duration: 1.8,
                ease: "expo.out",
                stagger: 0.22,
              },
              "-=2.4",
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Overlay open ──────────────────────────────────────────────────────
  const openOverlay = (value: (typeof valuesData)[0]) => {
    setActive(value);
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

  // ── Overlay close ─────────────────────────────────────────────────────
  const closeOverlay = () => {
    const tl = gsap.timeline({ onComplete: () => setActive(null) });
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cardPositions = [
    "right-[-.6%]",
    "right-[5%] xl:top-[13vh] top-[12vh]",
    "right-[-.6%] xl:top-[25.8vh] top-[24vh]",
    "right-[5%] xl:top-[38.5vh] top-[36vh]",
    "left-[5%] xl:top-[57vh] top-[50vh]",
  ];
  const cardPadding = [
    "md:pl-5 px-4",
    "md:pl-5 px-4",
    "md:pl-5 px-4",
    "md:pl-5 px-4",
    "md:pl-5 px-4",
  ];

  return (
    <>
      <section
        ref={sectionRef}
        className="xl:min-h-[127vh] min-h-screen relative"
      >
        <img
          ref={gradientRef}
          src="/value-gradient.webp"
          alt="gradient"
          style={{ opacity: 0 }}
          className="absolute left-0 bottom-0 will-change-transform"
        />
        <div className="md:pt-[12vh] pt-[8vh] max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4">
          <div
            ref={headingRef}
            style={{ opacity: 0 }}
            className="text-center 2xl:max-w-[819px] xl:max-w-[720px] max-w-[620px] mx-auto will-change-transform"
          >
            <h2 className="font-boldonse font-normal 2xl:text-[38px] xl:text-[34px] md:text-[30px] text-[22px] text-black leading-[151%]">
              The way we work should reflect the way we live.
            </h2>
          </div>
          <div>
            <div className="absolute 2xl:left-[4.5%] left-[-5%] xl:top-[4vh] md:top-[8vh]">
              <img
                ref={ballRef}
                src="/value-ball.webp"
                alt="value-ball"
                style={{ opacity: 0 }}
                className="2xl:w-[1140px] 2xl:h-[1140px] xl:w-[1000px] xl:h-[1000px] md:w-[800px] md:h-[800px] w-full h-auto will-change-transform"
              />
            </div>

            <div className="relative xl:mt-[14vh] mt-[8vh] flex flex-col gap-[2vh] md:block pb-[15vh] md:pb-0">
              {valuesData.map((v, i) => (
                <div
                  key={v.id}
                  ref={cardRefs[i]}
                  onClick={() => openOverlay(v)}
                  style={{ opacity: 0 }}
                  className={`bg-white border border-[#DEE6E9] xl:rounded-[22px] rounded-[18px] xl:w-[680px] md:w-[550px] w-full xl:h-[110px] md:h-[95px] py-[2vh] flex items-center md:absolute cursor-pointer
                    transition-colors duration-300 hover:border-[#9564F4] hover:shadow-[0_4px_28px_rgba(149,100,244,0.12)]
                    will-change-transform ${cardPositions[i]}`}
                >
                  <h6 className="font-bold text-[16px] text-[#9564F4] font-jakarta absolute right-3.5 top-3.5">
                    {v.id}
                  </h6>
                  <div className={`flex xl:gap-6 gap-4 ${cardPadding[i]}`}>
                    <div className="xl:w-[60px] xl:h-[60px] w-[40px] h-[40px] xl:rounded-[22px] rounded-[12px] flex justify-center items-center bg-[#9564F41F] shrink-0">
                      <img
                        src="/value-icon.webp"
                        alt="icon"
                        className="xl:w-[32px] xl:h-[32px] w-[24px] h-[24px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-boldonse font-normal 2xl:text-[22px] xl:text-[20px] text-[18px] text-black leading-[151%]">
                        {v.title}
                      </h4>
                      <p className="font-mulish font-normal xl:text-[16px] text-[15px] text-black mt-[.4vh] leading-[115%]">
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

      {/* ── Light Theme Overlay ── */}
      {active && (
        <div
          ref={overlayRef}
          style={{ opacity: 0 }}
          onClick={closeOverlay}
          className="fixed inset-0 z-[999] flex items-center justify-center"
        >
          {/* Light backdrop */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[8px]" />

          {/* Soft purple radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[700px] rounded-full bg-[#9564F4]/8 blur-[100px]" />
          </div>

          {/* Close */}
          <button
            onClick={closeOverlay}
            className="absolute top-7 right-9 z-20 w-9 h-9 flex items-center justify-center rounded-full border border-[#DEE6E9] text-black/40 hover:text-[#9564F4] hover:border-[#9564F4] transition-all duration-200 text-[15px] bg-white/80"
          >
            ✕
          </button>

          {/* Card — light theme */}
          <div
            ref={overlayCardRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: 0,
              background:
                "linear-gradient(160deg, #ffffff 0%, #f7f4ff 60%, #f0ebff 100%)",
              border: "1px solid rgba(149,100,244,0.18)",
              boxShadow:
                "0 8px 48px rgba(149,100,244,0.12), 0 2px 0 rgba(255,255,255,0.9) inset",
            }}
            className="relative z-10 w-[90%] max-w-[740px] text-center px-12 py-14 rounded-[24px]"
          >
            {/* Number */}
            <span
              ref={overlayNumRef}
              style={{ opacity: 0 }}
              className="font-jakarta font-bold text-[12px] tracking-[0.28em] text-[#9564F4] block mb-5"
            >
              {active.id}
            </span>

            {/* Title */}
            <h3
              ref={overlayTitleRef}
              style={{ opacity: 0 }}
              className="font-boldonse font-normal 2xl:text-[50px] xl:text-[40px] md:text-[36px] text-[22px] text-black leading-[110%] tracking-[0.03em]"
            >
              {active.title.toUpperCase()}
            </h3>

            {/* Divider */}
            <div
              ref={overlayLineRef}
              style={{ opacity: 0 }}
              className="mx-auto mt-5 mb-8"
            >
              <div
                className="w-[48px] h-[2px] mx-auto rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #9564F4, transparent)",
                }}
              />
            </div>

            {/* Expanded text */}
            <p
              ref={overlayTextRef}
              style={{ opacity: 0 }}
              className="font-mulish font-normal text-[17px] text-black/65 xl:leading-[185%] leading-[151%] max-w-[560px] mx-auto"
            >
              {active.expanded}
            </p>

            {/* Back link */}
            <button
              ref={overlayBackRef}
              onClick={closeOverlay}
              style={{ opacity: 0 }}
              className="mt-10 inline-block font-jakarta font-semibold text-[11px] tracking-[0.22em] uppercase text-black/35 hover:text-[#9564F4] transition-colors duration-300 relative group"
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
