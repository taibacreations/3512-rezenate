// components/philosophy.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const logoPaths = [
  "M0 0L451 0L348.705 102.919C341.009 110.662 330.543 115.015 319.626 115.015L117.804 115.015V316.911C117.804 327.784 113.484 338.213 105.795 345.902L0 451.697V0Z",
  "M162.417 161.719L450.304 161.719L346.711 265.311C339.397 272.625 329.477 276.734 319.134 276.734H278.129V319.133C278.129 329.477 274.02 339.396 266.706 346.71L162.417 451V161.719Z",
  "M323.437 451V323.437H451L323.437 451Z",
];

const ENTER_FRAC  = 0.5;
const EXIT_FRAC   = 0.5;
const HOLD_DRIFT_Y  = -28;
const HOLD_DRIFT_X  =  12;
const HEADING_DRIFT = -14;

const FALLBACK_QUOTES = [
  { text: "Every leader influences a culture long before they change a strategy", align: "left" },
  { text: "Some support people to become more of themselves", align: "right" },
  { text: "Others slowly ask them to become less", align: "left" },
  { text: "Rezenate exists because leadership resonates", align: "right" },
  { text: "People buy into the leader before they buy into the vision. — John C Maxwell", align: "left" },
  { text: "What begins with a leader rarely ends with them", align: "right" },
];

interface Quote { text: string; align: "left" | "right"; }
interface PhilosophyData {
  backgroundImage?: { asset: { _ref: string } };
  quotes?: Quote[];
}

function renderText(text: string): React.ReactNode {
  const match = text.match(/^(.+?)\s*([\u2013\u2014-]\s*[A-Z].*)$/);
  if (!match) return text;
  return <>{match[1]} <span className="whitespace-nowrap">{match[2]}</span></>;
}

const Section2 = ({ data }: { data: PhilosophyData }) => {
  const items = (data?.quotes?.length ? data.quotes : FALLBACK_QUOTES) as Quote[];
  const bgSrc = data?.backgroundImage ? urlFor(data.backgroundImage).url() : "/section2-bg.webp";

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const itemRefs   = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      const totalSteps = items.length;
      const PIN_END = `+=${totalSteps * 150}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "section2Pin",
          refreshPriority: 1,
          trigger: sectionRef.current,
          start: "top top",
          end: PIN_END,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Background parallax
      tl.to(bgRef.current, { backgroundPositionY: "100%", ease: "none" }, 0);

      itemRefs.current.forEach((el, i) => {
        if (!el) return;

        const paths   = el.querySelectorAll("path");
        const heading = el.querySelector(".s2-heading");
        const line    = el.querySelector(".s2-line");
        const glow    = el.querySelector(".s2-glow");
        const logoEl  = el.querySelector("svg");

        gsap.set(el, { visibility: "visible" });

        if (i === 0) {
          gsap.set(paths,   { scale: 1, opacity: 1, transformOrigin: "center center" });
          gsap.set(heading, { y: 0, opacity: 1 });
          gsap.set(line,    { scaleX: 1, transformOrigin: "left center" });
          gsap.set(glow,    { scale: 1, opacity: 0.25 });
          gsap.set(logoEl,  { y: 0, x: 0 });
        } else {
          gsap.set(paths,   { scale: 1, opacity: 0, transformOrigin: "center center" });
          gsap.set(heading, { y: 0, opacity: 0 });
          gsap.set(line,    { scaleX: 0, transformOrigin: "left center" });
          gsap.set(glow,    { scale: 1, opacity: 0 });
          gsap.set(logoEl,  { y: 0, x: 0 });
        }

        const stepStart  = i / totalSteps;
        const stepEnd    = (i + 1) / totalSteps;
        const stepSize   = stepEnd - stepStart;
        const enterEnd   = stepStart + stepSize * ENTER_FRAC;
        const exitStart  = stepEnd   - stepSize * EXIT_FRAC;
        const holdStart  = enterEnd;
        const holdEnd    = exitStart;
        const holdSize   = holdEnd - holdStart;

        // ── ENTRANCE ──────────────────────────────────────────────────
        if (i > 0) {
          const win = enterEnd - stepStart;

          tl.to(glow,     { opacity: 0.25, duration: win,        ease: "none" }, stepStart)
            .to(paths[0], { opacity: 1,    duration: win * 0.75, ease: "none" }, stepStart + win * 0.00)
            .to(paths[1], { opacity: 1,    duration: win * 0.70, ease: "none" }, stepStart + win * 0.10)
            .to(paths[2], { opacity: 1,    duration: win * 0.65, ease: "none" }, stepStart + win * 0.20)
            .to(line,     { scaleX: 1,     duration: win * 0.60, ease: "none" }, stepStart + win * 0.18)
            .to(heading,  { opacity: 1,    duration: win * 0.65, ease: "none" }, stepStart + win * 0.25);

          tl.set(logoEl,  { y: 0, x: 0 }, stepStart)
            .set(heading, { y: 0 },        stepStart);
        }

        // ── HOLD — continuous parallax drift ──────────────────────────
        if (holdSize > 0) {
          tl.to(logoEl, {
            y: HOLD_DRIFT_Y,
            x: HOLD_DRIFT_X,
            duration: holdSize,
            ease: "none",
          }, holdStart)
            .to(heading, {
              y: HEADING_DRIFT,
              duration: holdSize,
              ease: "none",
            }, holdStart)
            .to(glow, {
              scale: 1.15,
              opacity: 0.35,
              duration: holdSize * 0.5,
              ease: "none",
            }, holdStart)
            .to(glow, {
              scale: 1,
              opacity: 0.25,
              duration: holdSize * 0.5,
              ease: "none",
            }, holdStart + holdSize * 0.5);
        }

        // ── EXIT ──────────────────────────────────────────────────────
        if (i < totalSteps - 1) {
          const exitWin = stepSize * EXIT_FRAC;

          tl.to([paths[0], paths[1], paths[2], heading, glow],
            { opacity: 0, duration: exitWin, ease: "none" }, exitStart)
            .to(line, { scaleX: 0, duration: exitWin * 0.8, ease: "none" }, exitStart)
            .to(logoEl, {
              y: HOLD_DRIFT_Y * 1.4,
              x: HOLD_DRIFT_X * 1.2,
              duration: exitWin,
              ease: "none",
            }, exitStart)
            .to(heading, {
              y: HEADING_DRIFT * 1.5,
              duration: exitWin,
              ease: "none",
            }, exitStart);
        }
      });
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
  }, [items]);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative min-h-[140vh] text-black xl:px-10 md:px-6 px-4"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 bg-cover bg-top"
        style={{ backgroundImage: `url(${bgSrc})`, backgroundPositionY: "0%" }}
      />

      <div className="max-w-[1435px] mx-auto xl:px-10 md:px-6 px-4 mt-[4vh] relative h-full">
        {items.map((item, i) => {
          const logoFirst = item.align === "right";
          return (
            <div
              key={i}
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
              className={`absolute inset-0 flex gap-10 flex-col items-center pt-[12vh] md:pt-[18vh] md:items-start md:justify-between ${logoFirst ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="relative flex justify-center shrink-0">
                <div
                  className="s2-glow absolute inset-0 m-auto w-[300px] h-[300px] rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(149,100,244,0.18) 0%, rgba(149,100,244,0) 70%)`,
                    filter: "blur(24px)",
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="192" height="192"
                  viewBox="0 0 451 452"
                  fill="none"
                  className="relative 2xl:w-[452px] 2xl:h-[452px] xl:w-[380px] xl:h-[380px] lg:w-[340px] lg:h-[340px] md:w-[270px] md:h-[270px] w-[220px] h-[220px]"
                  style={{ willChange: "transform" }}
                >
                  {logoPaths.map((d, idx) => <path key={idx} d={d} fill={BRAND_COLOR} />)}
                </svg>
              </div>

              <div className={`xl:max-w-[517px] max-w-[480px] text-center ${item.align === "left" ? "md:text-left" : "md:text-right"}`}>
                <div
                  className="s2-line h-[2px] w-12 mb-6 mx-auto md:mx-0"
                  style={{
                    backgroundColor: BRAND_COLOR,
                    marginLeft: item.align === "right" ? "auto" : undefined,
                  }}
                />
                <h3
                  className="s2-heading font-boldonse font-normal 2xl:text-[34px] xl:text-[30px] lg:text-[26px] text-[24px] text-black leading-[140%]"
                  style={{ willChange: "transform" }}
                >
                  {renderText(item.text)}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Section2;