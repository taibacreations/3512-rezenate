// components/section3.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const CARD_GRADIENTS = [
  "linear-gradient(145deg, #0B0730 0%, #1a0f4a 40%, #9564F4 100%)",
  "linear-gradient(145deg, #0d0826 0%, #2a1060 45%, #7b4fd4 100%)",
  "linear-gradient(145deg, #080510 0%, #1a0a3d 40%, #a57df5 100%)",
  "linear-gradient(145deg, #0B0730 0%, #251060 50%, #9564F4 100%)",
  "linear-gradient(145deg, #0a0620 0%, #1c0d50 45%, #8b68e8 100%)",
];

const CARD_LETTERS = ["M", "W", "R", "U", "C"];

const FALLBACK_VALUES = [
  {
    name: "Meraki",
    shortDescription: "We bring heart to everything we do.",
    longDescription:
      "From the Greek for 'putting your soul into your work,' Meraki means pouring soul, care, and creativity into what we do, leaving a piece of ourselves in everything we touch. That spirit runs through every detail we craft, every leader we introduce, and every relationship we nurture.",
    image: null,
  },
  {
    name: "Wisdom",
    shortDescription: "We make thoughtful decisions.",
    longDescription:
      "Every choice we make is guided by experience, reflection, and long-term thinking, not quick wins or surface impressions. Wisdom means seeing the whole board before making a move. It's how we honour both people and outcomes.",
    image: null,
  },
  {
    name: "Rezolutionary",
    shortDescription: "We believe everyone has the power to shape what happens next.",
    longDescription:
      "To be Rezolutionary means acting with purpose and commitment. It's about taking ownership, creating meaningful change, and being intentional in how we show up. Even small steps, when taken deliberately, can create big waves.",
    image: null,
  },
  {
    name: "Upekkha",
    shortDescription: "We meet every moment with balance.",
    longDescription:
      "From the Pali word for equanimity, Upekkha is the discipline of staying calm and clear in the face of uncertainty. It means holding perspective, choosing response over reaction, and staying grounded when others spiral.",
    image: null,
  },
  {
    name: "Cadence",
    shortDescription: "We move with rhythm and intention.",
    longDescription:
      "We believe progress comes from having the insight and discipline to know exactly when to push forward, when to pause, and when to let things unfold. Cadence is how we stay purposeful without forcing and patient without drifting.",
    image: null,
  },
];

interface ValueItem {
  name: string;
  shortDescription: string;
  longDescription: string;
  image?: { asset: { _ref: string } } | null;
}

interface ValuesData {
  heading?: string;
  items?: ValueItem[];
}

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

const Section3 = ({ data }: { data: ValuesData }) => {
  const heading = data?.heading ?? "The way we work should reflect the way we live.";
  const values: ValueItem[] = data?.items?.length ? data.items : FALLBACK_VALUES;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeValue = activeIndex !== null ? values[activeIndex] : null;

  const sectionRef        = useRef<HTMLElement>(null);
  const lineRef           = useRef<HTMLDivElement>(null);
  const headingRef        = useRef<HTMLDivElement>(null);
  const headingTextRef    = useRef<HTMLHeadingElement>(null);
  const desktopCardRefs   = useRef<HTMLButtonElement[]>([]);
  const mobileCardRefs    = useRef<HTMLButtonElement[]>([]);
  const overlayRef        = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const overlayLineRef    = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(headingTextRef.current, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        y: 16,
        filter: "blur(6px)",
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
        .to(lineRef.current, { scaleX: 1, duration: 0.7, ease: "power3.out" })
        .to(headingTextRef.current, { opacity: 1, y: 0, duration: 0.3 }, "<0.1")
        .to(
          headingTextRef.current,
          { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", duration: 1.2, ease: "power3.inOut" },
          "<",
        );

      desktopCardRefs.current.forEach((el, i) => {
        if (!el) return;
        const textBits = el.querySelectorAll(".card-text-in");
        const letter   = el.querySelector(".card-letter");

        gsap.set(el,       { opacity: 0, y: 50, rotateX: -12, scale: 0.94, transformPerspective: 900, transformOrigin: "center bottom" });
        gsap.set(textBits, { opacity: 0, y: 10 });
        gsap.set(letter,   { opacity: 0, scale: 0.85 });

        gsap.timeline({
          delay: i * 0.12,
          scrollTrigger: {
            trigger: el,
            start: computeStart(() => desktopCardRefs.current[i], 0.9),
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        })
          .to(el,       { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.0, ease: "power2.out" })
          .to(letter,   { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "<0.2")
          .to(textBits, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.3");
      });

      mobileCardRefs.current.forEach((el, i) => {
        if (!el) return;
        const textBits = el.querySelectorAll(".card-text-in");
        const letter   = el.querySelector(".card-letter");

        gsap.set(el,       { opacity: 0, y: 30, scale: 0.96 });
        gsap.set(textBits, { opacity: 0, y: 8 });
        gsap.set(letter,   { opacity: 0, scale: 0.85 });

        gsap.timeline({
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: computeStart(() => mobileCardRefs.current[i], 0.92),
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        })
          .to(el,       { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" })
          .to(letter,   { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }, "<0.15")
          .to(textBits, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.25");
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
  }, [values]);

  useEffect(() => {
    if (activeIndex === null) return;
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current,        { opacity: 0, display: "flex" });
      gsap.set(overlayContentRef.current, { opacity: 0, y: 16 });
      gsap.set(overlayLineRef.current,    { scaleX: 0, transformOrigin: "left center" });

      gsap.timeline()
        .to(overlayRef.current,        { opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(overlayContentRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
        .to(overlayLineRef.current,    { scaleX: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");
    });
    return () => ctx.revert();
  }, [activeIndex]);

  const closeOverlay = () => {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.4, ease: "power1.in",
      onComplete: () => setActiveIndex(null),
    });
  };

  // Card background — image if available, else gradient + letter
  const CardBackground = ({ index, image }: { index: number; image?: { asset: { _ref: string } } | null }) => {
    const hasImage = !!image?.asset?._ref;
    const imgUrl   = hasImage ? urlFor(image!).width(600).url() : null;

    return (
      <>
        {hasImage ? (
          // Sanity image as background
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imgUrl})` }}
          />
        ) : (
          // Fallback: gradient + letter overlay
          <>
            <div
              className="absolute inset-0 z-0"
              style={{ background: CARD_GRADIENTS[index % CARD_GRADIENTS.length] }}
            />
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: "radial-gradient(circle at 60% 30%, rgba(149,100,244,0.35) 0%, rgba(149,100,244,0.0) 65%)",
              }}
            />
            <div
              className="card-letter absolute inset-0 flex items-center justify-center z-[2] select-none pointer-events-none"
              style={{ opacity: 0 }}
            >
              <span
                className="font-boldonse text-white"
                style={{ fontSize: "clamp(120px, 18vw, 220px)", opacity: 0.06, lineHeight: 1, letterSpacing: "-0.02em" }}
              >
                {CARD_LETTERS[index % CARD_LETTERS.length]}
              </span>
            </div>
          </>
        )}

        {/* Noise texture — always on top */}
        <div
          className="absolute inset-0 z-[3]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </>
    );
  };

  return (
    <section id="section3" ref={sectionRef} className="2xl:px-16 xl:px-10 md:px-6 px-4 relative mt-[-47vh]">
      <div>
        <div ref={headingRef} className="text-center 2xl:max-w-[819px] xl:max-w-[780px] max-w-[680px] mx-auto">
          <div
            ref={lineRef}
            className="h-[2px] w-12 mx-auto mb-6"
            style={{ backgroundColor: BRAND_COLOR }}
          />
          <h2
            ref={headingTextRef}
            className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] text-white leading-[151%] text-center"
          >
            {heading}
          </h2>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex justify-between mt-[7vh] gap-4 flex-wrap" style={{ perspective: "1200px" }}>
          {values.map((value, i) => (
            <button
              key={i}
              ref={(el) => { if (el) desktopCardRefs.current[i] = el; }}
              onClick={() => setActiveIndex(i)}
              style={{ transformStyle: "preserve-3d" }}
              className={`group relative 2xl:w-[19%] xl:w-[24%] lg:w-[31%] w-[45%] h-[473px] text-white rounded-[26px] overflow-hidden ${i % 2 === 1 ? "mt-[7vh]" : ""}`}
            >
              <CardBackground index={i} image={value.image} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-700 z-10" />
              <div className="absolute bottom-10 w-full text-center flex justify-center items-center flex-col z-20 px-4">
                <h3 className="card-text-in font-bartie font-normal xl:text-[18px] text-[16px] uppercase mb-2">
                  {value.name}
                </h3>
                <div className="card-text-in relative w-full h-[1px] mt-1 mb-3.5">
                  <span className="absolute inset-0 w-[48px] mx-auto bg-white/20" />
                  <span className="absolute inset-0 bg-white origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out" />
                </div>
                <h5 className="card-text-in font-boldonse font-normal xl:text-[16px] text-[15px] leading-[164%] max-w-[230px] w-full">
                  {value.shortDescription}
                </h5>
              </div>
            </button>
          ))}
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden flex-col gap-5 mt-[5vh]">
          {values.map((value, i) => (
            <button
              key={i}
              ref={(el) => { if (el) mobileCardRefs.current[i] = el; }}
              onClick={() => setActiveIndex(i)}
              className="relative w-full h-[260px] text-white rounded-[20px] overflow-hidden"
            >
              <CardBackground index={i} image={value.image} />
              <div className="absolute inset-0 bg-black/20 z-10" />
              <div className="absolute bottom-6 w-full text-center px-4 z-20">
                <h3 className="card-text-in font-bartie font-normal text-[18px] uppercase">
                  {value.name}
                </h3>
                <h5 className="card-text-in font-boldonse font-normal text-[14px] leading-[150%] mt-1 break-words">
                  {value.shortDescription}
                </h5>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* OVERLAY */}
      {activeValue && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 hidden items-center justify-center px-6 overflow-hidden"
          style={{ backgroundColor: "rgba(8, 5, 16, 0.97)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 40%, rgba(149,100,244,0.12) 0%, rgba(0,0,0,0) 65%)" }}
          />
          <button
            onClick={closeOverlay}
            aria-label="Close"
            className="absolute top-8 right-8 z-10 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-250"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <div ref={overlayContentRef} className="relative z-10 max-w-[620px] text-center text-white px-4">
            <h3 className="font-bartie font-normal lg:text-[40px] md:text-[30px] text-[18px] uppercase tracking-widest mb-4">
              {activeValue.name}
            </h3>
            <div className="overflow-hidden mx-auto mb-8" style={{ width: "48px", height: "1px" }}>
              <span
                ref={overlayLineRef}
                className="block w-full h-full"
                style={{ backgroundColor: BRAND_COLOR, transform: "scaleX(0)", transformOrigin: "left center" }}
              />
            </div>
            <p className="font-boldonse font-normal md:text-[17px] text-[14px] leading-[190%] text-white/80">
              {activeValue.longDescription}
            </p>
            <button
              onClick={closeOverlay}
              className="mt-12 text-xs uppercase tracking-[0.2em] border-b border-white/25 pb-1 text-white/60 hover:text-white hover:border-white/60 transition-colors duration-250"
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