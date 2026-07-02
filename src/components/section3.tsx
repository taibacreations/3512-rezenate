// Section3.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const values = [
  {
    id: "meraki",
    name: "Meraki",
    short: "We bring heart to everything we do.",
    long: "From the Greek for 'putting your soul into your work,' Meraki means pouring soul, care, and creativity into what we do, leaving a piece of ourselves in everything we touch. That spirit runs through every detail we craft, every leader we introduce, and every relationship we nurture.",
    image: "/card1.webp",
  },
  {
    id: "wisdom",
    name: "Wisdom",
    short: "We make thoughtful decisions.",
    long: "Every choice we make is guided by experience, reflection, and long-term thinking, not quick wins or surface impressions. Wisdom means seeing the whole board before making a move. It's how we honour both people and outcomes.",
    image: "/card2.webp",
  },
  {
    id: "rezolutionary",
    name: "Rezolutionary",
    short: "We believe everyone has the power to shape what happens next.",
    long: "To be Rezolutionary means acting with purpose and commitment. It's about taking ownership, creating meaningful change, and being intentional in how we show up. Even small steps, when taken deliberately, can create big waves.",
    image: "/card1.webp",
  },
  {
    id: "upekkha",
    name: "Upekkha",
    short: "We meet every moment with balance.",
    long: "From the Pali word for equanimity, Upekkha is the discipline of staying calm and clear in the face of uncertainty. It means holding perspective, choosing response over reaction, and staying grounded when others spiral. This is how we lead under pressure: with grace, clarity, and composure.",
    image: "/card2.webp",
  },
  {
    id: "cadence",
    name: "Cadence",
    short: "We move with rhythm and intention.",
    long: "We believe progress comes from having the insight and discipline to know exactly when to push forward, when to pause, and when to let things unfold. Cadence is how we stay purposeful without forcing and patient without drifting.",
    image: "/card1.webp",
  },
];

const OVERLAP_BUFFER_PX = 80;

const computeStart =
  (getEl: () => HTMLElement | null, viewportFraction: number) => () => {
    const el = getEl();
    if (!el) return 0;

    const vh = window.innerHeight;
    const elementTopAbsolute = el.getBoundingClientRect().top + window.scrollY;
    const naturalPx = elementTopAbsolute - vh * viewportFraction;

    const pin = ScrollTrigger.getById("section2Pin");
    const earliestAllowed = pin ? pin.end - OVERLAP_BUFFER_PX : 0;

    return Math.max(naturalPx, earliestAllowed);
  };

const Section3 = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeValue = values.find((v) => v.id === activeId);

  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingTextRef = useRef<HTMLHeadingElement>(null);
  const desktopCardRefs = useRef<HTMLButtonElement[]>([]);
  const mobileCardRefs = useRef<HTMLButtonElement[]>([]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);

  // entrance reveals
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(headingTextRef.current, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        y: 16, // reduced from 20
        filter: "blur(6px)", // reduced from 10px
      });

      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: computeStart(() => headingRef.current, 0.85),
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      headingTl
        .to(lineRef.current, { scaleX: 1, duration: 0.7, ease: "power3.out" }) // slowed from 0.5
        .to(
          headingTextRef.current,
          { opacity: 1, y: 0, duration: 0.3 },
          "<0.1"
        )
        .to(
          headingTextRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            filter: "blur(0px)",
            letterSpacing: "0em",
            duration: 1.2, // slowed from 1.0
            ease: "power3.inOut",
          },
          "<"
        );

      // Desktop cards — gentler entrance, less dramatic 3D
      desktopCardRefs.current.forEach((el, i) => {
        if (!el) return;

        const image = el.querySelector(".card-image");
        const reveal = el.querySelector(".card-reveal");
        const textBits = el.querySelectorAll(".card-text-in");

        gsap.set(el, {
          opacity: 0,
          y: 50, // reduced from 90
          rotateX: -12, // reduced from -35 — much calmer
          scale: 0.94, // reduced from 0.82
          transformPerspective: 900,
          transformOrigin: "center bottom",
        });
        gsap.set(image, { scale: 1.12 }); // reduced from 1.28
        gsap.set(reveal, { scaleX: 1, transformOrigin: "right center" });
        gsap.set(textBits, { opacity: 0, y: 10 }); // reduced from 16

        const cardTl = gsap.timeline({
          delay: i * 0.12,
          scrollTrigger: {
            trigger: el,
            start: computeStart(() => desktopCardRefs.current[i], 0.9),
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });

        cardTl
          .to(el, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.0, // slowed from 0.85
            ease: "power2.out", // changed from power3 — less aggressive
          })
          .to(
            image,
            { scale: 1, duration: 1.6, ease: "power2.out" }, // slowed from 1.3
            "<"
          )
          .to(
            reveal,
            { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, // slowed from 0.65, easing softened
            "-=0.6"
          )
          .to(
            textBits,
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, // slowed from 0.45/0.07
            "-=0.3"
          );
      });

      // Mobile cards
      mobileCardRefs.current.forEach((el, i) => {
        if (!el) return;

        const image = el.querySelector(".card-image");
        const reveal = el.querySelector(".card-reveal");
        const textBits = el.querySelectorAll(".card-text-in");

        gsap.set(el, { opacity: 0, y: 30, scale: 0.96 }); // reduced from y:50, scale:0.92
        gsap.set(image, { scale: 1.1 }); // reduced from 1.2
        gsap.set(reveal, { scaleX: 1, transformOrigin: "right center" });
        gsap.set(textBits, { opacity: 0, y: 8 }); // reduced from 12

        const cardTl = gsap.timeline({
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: computeStart(() => mobileCardRefs.current[i], 0.92),
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });

        cardTl
          .to(el, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }) // slowed from 0.6
          .to(image, { scale: 1, duration: 1.2, ease: "power2.out" }, "<") // slowed from 1.0
          .to(reveal, { scaleX: 0, duration: 0.65, ease: "power2.inOut" }, "-=0.5") // slowed from 0.5
          .to(
            textBits,
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, // slowed from 0.35/0.06
            "-=0.25"
          );
      });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();

    requestAnimationFrame(() => requestAnimationFrame(refresh));

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

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

  // Overlay open/close — simplified, no particles, no pulsing glow
  useEffect(() => {
    if (!activeId) return;

    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { opacity: 0, display: "flex" });
      gsap.set(overlayContentRef.current, { opacity: 0, y: 16 });

      gsap.timeline()
        .to(overlayRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(
          overlayContentRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, [activeId]);

  const closeOverlay = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power1.in",
      onComplete: () => setActiveId(null),
    });
  };

  return (
    <section id="section3" ref={sectionRef} className="2xl:px-16 xl:px-10 md:px-6 px-4 relative mt-[-47vh]">
      <div>
        <div ref={headingRef} className="text-center 2xl:max-w-[819px] xl:max-w-[780px] max-w-[680px] mx-auto">
          <div
            ref={lineRef}
            className="h-[2px] w-12 mx-auto mb-6" // thinned from 3px, narrowed from w-16
            style={{ backgroundColor: BRAND_COLOR }}
          />
          <h2
            ref={headingTextRef}
            className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] text-white leading-[151%] text-center"
          >
            The way we work should reflect the way we live.
          </h2>
        </div>

        {/* DESKTOP — pillar grid */}
        <div
          className="hidden md:flex justify-between mt-[7vh] gap-4 flex-wrap"
          style={{ perspective: "1200px" }}
        >
          {values.map((value, i) => (
            <button
              key={value.id}
              ref={(el) => {
                if (el) desktopCardRefs.current[i] = el;
              }}
              onClick={() => setActiveId(value.id)}
              style={{ transformStyle: "preserve-3d" }}
              className={`group relative 2xl:w-[19%] xl:w-[24%] lg:w-[31%] w-[45%] h-[473px] text-white rounded-[26px] overflow-hidden ${
                i % 2 === 1 ? "mt-[7vh]" : ""
              }`}
            >
              <img
                src={value.image}
                alt={value.name}
                className="card-image absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Overlay darkened slightly on hover — transition slowed */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-700 z-10" />

              <div
                className="card-reveal absolute inset-0 z-30"
                style={{ backgroundColor: BRAND_COLOR }}
              />

              <div className="absolute bottom-10 w-full text-center flex justify-center items-center flex-col z-20">
                <h3 className="card-text-in font-bartie font-normal xl:text-[18px] text-[16px] uppercase">
                  {value.name}
                </h3>
                {/* Underline transition slowed from 500ms → 700ms */}
                <span className="card-text-in block h-[1px] bg-white/60 w-0 group-hover:w-[48px] transition-all duration-700 my-2" />
                <h5 className="card-text-in font-boldonse font-normal xl:text-[16px] text-[15px] leading-[164%] max-w-[230px] w-full">
                  {value.short}
                </h5>
              </div>
            </button>
          ))}
        </div>

        {/* MOBILE — stacked cards */}
        <div className="flex md:hidden flex-col gap-5 mt-[5vh]">
          {values.map((value, i) => (
            <button
              key={value.id}
              ref={(el) => {
                if (el) mobileCardRefs.current[i] = el;
              }}
              onClick={() => setActiveId(value.id)}
              className="relative w-full h-[260px] text-white rounded-[20px] overflow-hidden"
            >
              <img
                src={value.image}
                alt={value.name}
                className="card-image absolute inset-0 w-full h-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-black/35 z-10" />

              <div
                className="card-reveal absolute inset-0 z-30"
                style={{ backgroundColor: BRAND_COLOR }}
              />

              <div className="absolute bottom-6 w-full text-center px-4 z-20">
                <h3 className="card-text-in font-bartie font-normal text-[18px] uppercase">
                  {value.name}
                </h3>
                <h5 className="card-text-in font-boldonse font-normal text-[14px] leading-[150%] mt-1 break-words">
                  {value.short}
                </h5>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* EXPANDED OVERLAY — clean dark backdrop, no particles, no pulsing glow */}
      {activeValue && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 hidden items-center justify-center px-6 overflow-hidden"
          style={{ backgroundColor: "rgba(8, 5, 16, 0.97)" }}
        >
          {/* Subtle static gradient — no animation, no drift */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(149,100,244,0.12) 0%, rgba(0,0,0,0) 65%)",
            }}
          />

          <button
            onClick={closeOverlay}
            aria-label="Back to values"
            className="absolute top-8 right-8 z-10 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/8 transition-colors duration-500"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path
                d="M1 1L17 17M17 1L1 17"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div
            ref={overlayContentRef}
            className="relative z-10 max-w-[620px] text-center text-white"
          >
            {/* Thin accent line above the name */}
            <div
              className="h-[1px] w-10 mx-auto mb-8"
              style={{ backgroundColor: BRAND_COLOR }}
            />
            <h3 className="font-bartie font-normal lg:text-[40px] md:text-[30px] text-[22px] mb-8 uppercase tracking-widest">
              {activeValue.name}
            </h3>
            <p className="font-boldonse font-normal md:text-[17px] text-[14px] leading-[190%] text-white/80">
              {activeValue.long}
            </p>

            <button
              onClick={closeOverlay}
              className="mt-12 text-xs uppercase tracking-[0.2em] border-b border-white/25 pb-1 text-white/60 hover:text-white hover:border-white/60 transition-colors duration-500"
            >
              Back to Values
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section3;