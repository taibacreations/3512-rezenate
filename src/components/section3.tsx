// components/section3.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const FALLBACK_VALUES = [
  {
    name: "Meraki",
    shortDescription: "We bring heart to everything we do.",
    longDescription: "From the Greek for 'putting your soul into your work,' Meraki means pouring soul, care, and creativity into what we do, leaving a piece of ourselves in everything we touch. That spirit runs through every detail we craft, every leader we introduce, and every relationship we nurture.",
    image: null,
    _fallbackImg: "/card1.webp",
  },
  {
    name: "Wisdom",
    shortDescription: "We make thoughtful decisions.",
    longDescription: "Every choice we make is guided by experience, reflection, and long-term thinking, not quick wins or surface impressions. Wisdom means seeing the whole board before making a move. It's how we honour both people and outcomes.",
    image: null,
    _fallbackImg: "/card2.webp",
  },
  {
    name: "Rezolutionary",
    shortDescription: "We believe everyone has the power to shape what happens next.",
    longDescription: "To be Rezolutionary means acting with purpose and commitment. It's about taking ownership, creating meaningful change, and being intentional in how we show up. Even small steps, when taken deliberately, can create big waves.",
    image: null,
    _fallbackImg: "/card1.webp",
  },
  {
    name: "Upekkha",
    shortDescription: "We meet every moment with balance.",
    longDescription: "From the Pali word for equanimity, Upekkha is the discipline of staying calm and clear in the face of uncertainty. It means holding perspective, choosing response over reaction, and staying grounded when others spiral.",
    image: null,
    _fallbackImg: "/card2.webp",
  },
  {
    name: "Cadence",
    shortDescription: "We move with rhythm and intention.",
    longDescription: "We believe progress comes from having the insight and discipline to know exactly when to push forward, when to pause, and when to let things unfold. Cadence is how we stay purposeful without forcing and patient without drifting.",
    image: null,
    _fallbackImg: "/card1.webp",
  },
];

interface ValueItem {
  name: string;
  shortDescription: string;
  longDescription: string;
  image?: { asset: { _ref: string } } | null;
  _fallbackImg?: string;
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

  const sectionRef       = useRef<HTMLElement>(null);
  const lineRef          = useRef<HTMLDivElement>(null);
  const headingRef       = useRef<HTMLDivElement>(null);
  const headingTextRef   = useRef<HTMLHeadingElement>(null);
  const desktopCardRefs  = useRef<HTMLButtonElement[]>([]);
  const mobileCardRefs   = useRef<HTMLButtonElement[]>([]);
  const overlayRef       = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const overlayLineRef   = useRef<HTMLSpanElement>(null);

  const getImgSrc = (value: ValueItem) =>
    value.image ? urlFor(value.image).width(800).url() : (value._fallbackImg ?? "/card1.webp");

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
        .to(headingTextRef.current, { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", duration: 1.2, ease: "power3.inOut" }, "<");

      desktopCardRefs.current.forEach((el, i) => {
        if (!el) return;
        const image   = el.querySelector(".card-image");
        const reveal  = el.querySelector(".card-reveal");
        const textBits = el.querySelectorAll(".card-text-in");

        gsap.set(el, { opacity: 0, y: 50, rotateX: -12, scale: 0.94, transformPerspective: 900, transformOrigin: "center bottom" });
        gsap.set(image,    { scale: 1.12 });
        gsap.set(reveal,   { scaleX: 1, transformOrigin: "right center" });
        gsap.set(textBits, { opacity: 0, y: 10 });

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
          .to(image,    { scale: 1, duration: 1.6, ease: "power2.out" }, "<")
          .to(reveal,   { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.6")
          .to(textBits, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.3");
      });

      mobileCardRefs.current.forEach((el, i) => {
        if (!el) return;
        const image   = el.querySelector(".card-image");
        const reveal  = el.querySelector(".card-reveal");
        const textBits = el.querySelectorAll(".card-text-in");

        gsap.set(el,       { opacity: 0, y: 30, scale: 0.96 });
        gsap.set(image,    { scale: 1.1 });
        gsap.set(reveal,   { scaleX: 1, transformOrigin: "right center" });
        gsap.set(textBits, { opacity: 0, y: 8 });

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
          .to(image,    { scale: 1, duration: 1.2, ease: "power2.out" }, "<")
          .to(reveal,   { scaleX: 0, duration: 0.65, ease: "power2.inOut" }, "-=0.5")
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
      // Reset line to zero before animating so it always draws from scratch
      gsap.set(overlayLineRef.current,    { scaleX: 0, transformOrigin: "left center" });

      gsap.timeline()
        .to(overlayRef.current,        { opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(overlayContentRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
        // Line draws left → right after the content fades in
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

  return (
    <section id="section3" ref={sectionRef} className="2xl:px-16 xl:px-10 md:px-6 px-4 relative mt-[-47vh]">
      <div>
        <div ref={headingRef} className="text-center 2xl:max-w-[819px] xl:max-w-[780px] max-w-[680px] mx-auto">
          <div ref={lineRef} className="h-[2px] w-12 mx-auto mb-6" style={{ backgroundColor: BRAND_COLOR }} />
          <h2 ref={headingTextRef} className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] text-white leading-[151%] text-center">
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
              <img src={getImgSrc(value)} alt={value.name} className="card-image absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-700 z-10" />
              <div className="card-reveal absolute inset-0 z-30" style={{ backgroundColor: BRAND_COLOR }} />
              <div className="absolute bottom-10 w-full text-center flex justify-center items-center flex-col z-20 px-4">
                <h3 className="card-text-in font-bartie font-normal xl:text-[18px] text-[16px] uppercase mb-2">{value.name}</h3>

                {/* Animated line — draws in from center on hover, retracts on leave */}
                <div className="card-text-in relative w-[48px] h-[1px] my-1 overflow-hidden">
                  {/* Base line — always visible at low opacity */}
                  <span className="absolute inset-0 bg-white/20" />
                  {/* Active line — slides in from left on hover */}
                  <span className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                </div>

                <h5 className="card-text-in font-boldonse font-normal xl:text-[16px] text-[15px] leading-[164%] max-w-[230px] w-full">{value.shortDescription}</h5>
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
              <img src={getImgSrc(value)} alt={value.name} className="card-image absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 bg-black/35 z-10" />
              <div className="card-reveal absolute inset-0 z-30" style={{ backgroundColor: BRAND_COLOR }} />
              <div className="absolute bottom-6 w-full text-center px-4 z-20">
                <h3 className="card-text-in font-bartie font-normal text-[18px] uppercase">{value.name}</h3>
                <h5 className="card-text-in font-boldonse font-normal text-[14px] leading-[150%] mt-1 break-words">{value.shortDescription}</h5>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* OVERLAY */}
      {activeValue && (
        <div ref={overlayRef} className="fixed inset-0 z-50 hidden items-center justify-center px-6 overflow-hidden" style={{ backgroundColor: "rgba(8, 5, 16, 0.97)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 40%, rgba(149,100,244,0.12) 0%, rgba(0,0,0,0) 65%)" }} />
          <button onClick={closeOverlay} aria-label="Close" className="absolute top-8 right-8 z-10 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-500">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <div ref={overlayContentRef} className="relative z-10 max-w-[620px] text-center text-white px-4">
            <h3 className="font-bartie font-normal lg:text-[40px] md:text-[30px] text-[18px] uppercase tracking-widest mb-4">{activeValue.name}</h3>

            {/* Animated underline — driven by GSAP when overlay opens, ref set below */}
            <div className="overflow-hidden mx-auto mb-8" style={{ width: "48px", height: "1px" }}>
              <span
                ref={overlayLineRef}
                className="block w-full h-full"
                style={{ backgroundColor: BRAND_COLOR, transform: "scaleX(0)", transformOrigin: "left center" }}
              />
            </div>

            <p className="font-boldonse font-normal md:text-[17px] text-[14px] leading-[190%] text-white/80">{activeValue.longDescription}</p>
            <button onClick={closeOverlay} className="mt-12 text-xs uppercase tracking-[0.2em] border-b border-white/25 pb-1 text-white/60 hover:text-white hover:border-white/60 transition-colors duration-500">
              Back to Values
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section3;