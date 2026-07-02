// Section2.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const items = [
  {
    heading:
      "Every leader influences a culture long before they change a strategy",
    align: "text-left" as const,
  },
  {
    heading: "Some support people to become more of themselves",
    align: "text-right" as const,
  },
  {
    heading: "Others slowly ask them to become less",
    align: "text-left" as const,
  },
  {
    heading: "Rezenate exists because leadership resonates",
    align: "text-right" as const,
  },
  {
    heading:
      "People buy into the leader before they buy into the vision. — John C Maxwell",
    align: "text-left" as const,
  },
  {
    heading: "What begins with a leader rarely ends with them",
    align: "text-right" as const,
  },
];

const logoPaths = [
  "M0 0L451 0L348.705 102.919C341.009 110.662 330.543 115.015 319.626 115.015L117.804 115.015V316.911C117.804 327.784 113.484 338.213 105.795 345.902L0 451.697V0Z",
  "M162.417 161.719L450.304 161.719L346.711 265.311C339.397 272.625 329.477 276.734 319.134 276.734H278.129V319.133C278.129 329.477 274.02 339.396 266.706 346.71L162.417 451V161.719Z",
  "M323.437 451V323.437H451L323.437 451Z",
];

// How much of the timeline each item occupies.
// Entrance = first ENTER_FRAC of the step, hold = middle, exit = last EXIT_FRAC.
const ENTER_FRAC = 0.32; // wider entrance window — animations have room to breathe
const EXIT_FRAC  = 0.10; // quick clean exit
// Hold window = 1 - 0.32 - 0.10 = 0.58 — content sits fully visible for 58% of its step

const Section2 = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      const totalSteps = items.length;

      // More scroll distance per step so the user has time to read each quote
      // before the next one arrives. Was 100vh per step, now 150vh.
      const PIN_END = `+=${totalSteps * 150}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "section2Pin",
          refreshPriority: 1,
          trigger: sectionRef.current,
          start: "top top",
          end: PIN_END,
          scrub: 2,           // heavier scrub = slower, more intentional feel
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(bgRef.current, { backgroundPositionY: "100%", ease: "none" }, 0);

      itemRefs.current.forEach((el, i) => {
        const paths = el.querySelectorAll("path");
        const heading = el.querySelector(".s2-heading");
        const line = el.querySelector(".s2-line");
        const glow = el.querySelector(".s2-glow");

        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });

        if (i === 0) {
          gsap.set(paths, { scale: 1, opacity: 1, rotate: 0, transformOrigin: "center center" });
          gsap.set(heading, { y: 0, opacity: 1 });
          gsap.set(line, { scaleX: 1, transformOrigin: "left center" });
          gsap.set(glow, { scale: 1, opacity: 0.25 });
        } else {
          gsap.set(paths, { scale: 0, opacity: 0, rotate: 0, transformOrigin: "center center" });
          gsap.set(heading, { y: 20, opacity: 0 });
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(glow, { scale: 0.6, opacity: 0 });
        }

        const stepStart = i / totalSteps;
        const stepEnd   = (i + 1) / totalSteps;
        const enterEnd  = stepStart + (stepEnd - stepStart) * ENTER_FRAC;
        const exitStart = stepEnd   - (stepEnd - stepStart) * EXIT_FRAC;

        if (i > 0) {
          const win = enterEnd - stepStart; // total entrance window size

          // -- ENTRANCE --
          tl.to(el, { autoAlpha: 1, duration: 0.01 }, stepStart)

            // Glow — spreads slowly across the full entrance window
            .to(
              glow,
              { scale: 1, opacity: 0.25, duration: win, ease: "power1.out" },
              stepStart,
            )

            // Logo path 0 — starts early, takes 70% of the window
            .to(
              paths[0],
              { scale: 1, opacity: 1, duration: win * 0.70, ease: "power1.out" },
              stepStart + win * 0.00,
            )

            // Logo path 1 — starts slightly after path 0
            .to(
              paths[1],
              { scale: 1, opacity: 1, duration: win * 0.65, ease: "power1.out" },
              stepStart + win * 0.12,
            )

            // Logo path 2 — last path, gentle fade in
            .to(
              paths[2],
              { scale: 1, opacity: 1, duration: win * 0.60, ease: "power1.out" },
              stepStart + win * 0.24,
            )

            // Accent line draws in after logo starts appearing
            .to(
              line,
              { scaleX: 1, duration: win * 0.55, ease: "power2.out" },
              stepStart + win * 0.20,
            )

            // Heading rises last — feels like the logo arrives first, then the quote
            .to(
              heading,
              { y: 0, opacity: 1, duration: win * 0.60, ease: "power2.out" },
              stepStart + win * 0.28,
            );
        }

        // -- HOLD: nothing happens between enterEnd and exitStart --

        // -- EXIT: fade the whole item out before the next one arrives --
        if (i < totalSteps - 1) {
          tl.to(
            el,
            { autoAlpha: 0, duration: (stepEnd - stepStart) * EXIT_FRAC, ease: "power1.in" },
            exitStart,
          );
        }
      });

      // Scroll cue — appears once last item has fully entered, pulses until section unpins
      gsap.set(cueRef.current, { opacity: 0 });
      const lastEnterEnd = ((totalSteps - 1) / totalSteps) + (1 / totalSteps) * ENTER_FRAC;
      tl.to(cueRef.current, { opacity: 1, duration: 0.05 }, lastEnterEnd);

      const cuePulse = gsap.to(cueRef.current, {
        y: 8,
        opacity: 0.4,
        duration: 1.6,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: PIN_END,
        onEnter: () => cuePulse.play(),
        onEnterBack: () => cuePulse.play(),
        onLeave: () => {
          cuePulse.pause();
          gsap.set(cueRef.current, { opacity: 0 });
        },
        onLeaveBack: () => {
          cuePulse.pause();
          gsap.set(cueRef.current, { opacity: 0 });
        },
      });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(() => requestAnimationFrame(refresh));
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 800);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(refresh, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative min-h-[140vh] text-black overflow-hidden xl:px-10 md:px-6 px-4"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[url(/section2-bg.webp)] bg-cover bg-top -z-10"
        style={{ backgroundPositionY: "0%" }}
      />

      <div className="max-w-[1435px] mx-auto xl:px-10 md:px-6 px-4 mt-[4vh] relative h-full">
        {items.map((item, i) => {
          const logoFirst = item.align === "text-right";

          return (
            <div
              key={i}
              ref={(el) => {
                if (el) itemRefs.current[i] = el;
              }}
              className={`absolute inset-0 flex gap-10 
                flex-col items-center pt-[12vh]
                md:pt-[18vh] md:items-start md:justify-between
                ${logoFirst ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Logo */}
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
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="192"
                  height="192"
                  viewBox="0 0 451 452"
                  fill="none"
                  className="relative 2xl:w-[452px] 2xl:h-[452px] xl:w-[380px] xl:h-[380px] lg:w-[340px] lg:h-[340px] md:w-[270px] md:h-[270px] w-[220px] h-[220px]"
                >
                  {logoPaths.map((d, idx) => (
                    <path key={idx} d={d} fill={BRAND_COLOR} />
                  ))}
                </svg>
              </div>

              {/* Heading */}
              <div className={`xl:max-w-[517px] max-w-[480px] text-center ${item.align === "text-left" ? "md:text-left" : "md:text-right"}`}>
                <div
                  className="s2-line h-[2px] w-12 mb-6 mx-auto md:mx-0"
                  style={{
                    backgroundColor: BRAND_COLOR,
                    marginLeft: item.align === "text-right" ? "auto" : 0,
                  }}
                />
                <h3 className="s2-heading font-boldonse font-normal 2xl:text-[34px] xl:text-[30px] lg:text-[26px] text-[24px] text-black leading-[140%]">
                  {item.heading}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll cue */}
      <div
        ref={cueRef}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1"
      >
        <div className="w-[1px] h-8 rounded-full bg-gradient-to-b from-white/60 to-transparent" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4v14m0 0l-6-6m6 6l6-6"
            stroke="#D8B4FE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Section2;