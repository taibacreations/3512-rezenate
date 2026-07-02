// Section2.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const items = [
  {
    heading: "Every leader influences a culture long before they change a strategy",
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
    heading: "People buy into the leader before they buy into the vision. — John C Maxwell",
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

// Fraction of each step's scroll distance used for entrance and exit.
// The remaining (1 - ENTER_FRAC - EXIT_FRAC) is the hold window where
// content sits fully visible with nothing animating.
const ENTER_FRAC = 0.30;
const EXIT_FRAC  = 0.22; // longer exit so it fades out gently, not abruptly

const Section2 = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const cueRef = useRef<HTMLDivElement>(null);

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
          scrub: 2.5,  // heavier scrub = animations lag behind scroll = feel slower/smoother
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(bgRef.current, { backgroundPositionY: "100%", ease: "none" }, 0);

      itemRefs.current.forEach((el, i) => {
        const paths   = el.querySelectorAll("path");
        const heading = el.querySelector(".s2-heading");
        const line    = el.querySelector(".s2-line");
        const glow    = el.querySelector(".s2-glow");

        // All items are visible in the DOM at all times (no autoAlpha toggle).
        // Opacity of individual elements controls visibility.
        // This removes the "pop" caused by the instant autoAlpha wrapper switch.
        gsap.set(el, { visibility: "visible" });

        if (i === 0) {
          gsap.set(paths,   { scale: 1, opacity: 1, transformOrigin: "center center" });
          gsap.set(heading, { y: 0, opacity: 1 });
          gsap.set(line,    { scaleX: 1, transformOrigin: "left center" });
          gsap.set(glow,    { scale: 1, opacity: 0.25 });
        } else {
          // Start fully invisible — opacity 0, no scale/rotation tricks
          // so the transition is a pure opacity crossfade, nothing snapping
          gsap.set(paths,   { scale: 1, opacity: 0, transformOrigin: "center center" });
          gsap.set(heading, { y: 0, opacity: 0 }); // no y offset — pure fade, no movement snap
          gsap.set(line,    { scaleX: 0, transformOrigin: "left center" });
          gsap.set(glow,    { scale: 1, opacity: 0 });
        }

        const stepStart = i / totalSteps;
        const stepEnd   = (i + 1) / totalSteps;
        const stepSize  = stepEnd - stepStart;
        const enterEnd  = stepStart + stepSize * ENTER_FRAC;
        const exitStart = stepEnd   - stepSize * EXIT_FRAC;

        if (i > 0) {
          const win = enterEnd - stepStart;

          // -- ENTRANCE --
          // "none" easing = linear relative to scrub position.
          // Combined with scrub:2.5 this makes the fade feel tied
          // directly to how fast the user scrolls — no sudden snap.

          // Glow fades in first, very gently
          tl.to(glow, {
            opacity: 0.25,
            duration: win,
            ease: "none",
          }, stepStart)

          // Logo paths fade in sequentially — pure opacity, no scale snap
          .to(paths[0], {
            opacity: 1,
            duration: win * 0.75,
            ease: "none",
          }, stepStart + win * 0.00)

          .to(paths[1], {
            opacity: 1,
            duration: win * 0.70,
            ease: "none",
          }, stepStart + win * 0.10)

          .to(paths[2], {
            opacity: 1,
            duration: win * 0.65,
            ease: "none",
          }, stepStart + win * 0.20)

          // Accent line draws in
          .to(line, {
            scaleX: 1,
            duration: win * 0.60,
            ease: "none",
          }, stepStart + win * 0.18)

          // Heading fades in last — no y movement, just opacity
          .to(heading, {
            opacity: 1,
            duration: win * 0.65,
            ease: "none",
          }, stepStart + win * 0.25);
        }

        // -- HOLD: nothing animates between enterEnd and exitStart --

        // -- EXIT --
        // Fade everything out together as one unit — prevents individual
        // elements popping out at different times which reads as "sudden"
        if (i < totalSteps - 1) {
          const exitWin = stepSize * EXIT_FRAC;

          tl.to([paths[0], paths[1], paths[2], heading, glow], {
            opacity: 0,
            duration: exitWin,
            ease: "none",
          }, exitStart)

          .to(line, {
            scaleX: 0,
            duration: exitWin * 0.8,
            ease: "none",
          }, exitStart);
        }
      });

      // Scroll cue
      gsap.set(cueRef.current, { opacity: 0 });
      const lastEnterEnd = ((totalSteps - 1) / totalSteps) + (1 / totalSteps) * ENTER_FRAC;
      tl.to(cueRef.current, { opacity: 1, duration: (1 / totalSteps) * 0.05, ease: "none" }, lastEnterEnd);

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
        onEnter:      () => cuePulse.play(),
        onEnterBack:  () => cuePulse.play(),
        onLeave:      () => { cuePulse.pause(); gsap.set(cueRef.current, { opacity: 0 }); },
        onLeaveBack:  () => { cuePulse.pause(); gsap.set(cueRef.current, { opacity: 0 }); },
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
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
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