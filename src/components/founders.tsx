// components/founders.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

interface Founder {
  name: string;
  role: string;
  bio: string;
  quote: string;
  cardStyle?: "dark" | "light";
}

interface FoundersData {
  heading?: string;
  subheading?: string;
  founders?: Founder[];
  backgroundImage?: { asset: { _ref: string } } | null;
  ringImage?: { asset: { _ref: string } } | null;
  blurImage?: { asset: { _ref: string } } | null;
}

const FALLBACK_FOUNDERS: Founder[] = [
  {
    name: "Zak — The Alchemist",
    role: "Shapes vision and voice.",
    bio: "Zak brings clarity to who companies are, what they stand for, and who should lead them next.",
    quote: "Leadership begins with honesty and not hierarchy.",
    cardStyle: "dark",
  },
  {
    name: "Chloe — The Architect",
    role: "Keeps everything moving with care and clarity",
    bio: "Chloe brings structure, psychology, and emotional intelligence to every engagement, ensuring great partnerships are built to last.",
    quote: "We built Rezenate to make leadership feel human again.",
    cardStyle: "light",
  },
];

const Founders = ({ data }: { data: FoundersData }) => {
  const heading = data?.heading ?? "THE FOUNDERS";
  const subheading =
    data?.subheading ??
    "Rezenate is founder-led. We believe that leadership can be both strong and kind.";
  const founders: Founder[] = data?.founders?.length
    ? data.founders
    : FALLBACK_FOUNDERS;

  const bgSrc = data?.backgroundImage
    ? urlFor(data.backgroundImage).url()
    : "/founder-bg.webp";
  const ringSrc = data?.ringImage
    ? urlFor(data.ringImage).url()
    : "/founder-ring.webp";
  const blurSrc = data?.blurImage
    ? urlFor(data.blurImage).url()
    : "/founder-blur.webp";

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Purple-entry overlay refs
  const purpleOverlayRef = useRef<HTMLDivElement>(null);
  const entryLineRef = useRef<HTMLDivElement>(null);

  const card1WrapRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const mark1Ref = useRef<HTMLDivElement>(null);
  const card2WrapRef = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const mark2Ref = useRef<HTMLDivElement>(null);

  // Spinning ring loop
  useEffect(() => {
    if (!ringRef.current) return;
    const spin = gsap.to(ringRef.current, {
      rotate: 360,
      duration: 60,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
    return () => {
      spin.kill();
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      // ── Purple entry overlay: fades out as section enters ──────────────
      gsap.set(purpleOverlayRef.current, { opacity: 1 });
      gsap.set(entryLineRef.current, { scaleX: 0, opacity: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",   // starts the moment section enters viewport
          end: "top 30%",        // fully dissolved by the time top hits 30%
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
        .to(purpleOverlayRef.current, {
          opacity: 0,
          ease: "power1.inOut",
        });

      // Brief silver thread that traces across as the purple fades — feels
      // like the Chapter 4 dot "expanding" into the new space
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      })
        .to(entryLineRef.current, {
          scaleX: 1,
          opacity: 0.35,
          duration: 1.0,
          ease: "power2.out",
        })
        .to(entryLineRef.current, {
          opacity: 0,
          duration: 0.9,
          ease: "power2.in",
          delay: 0.15,
        });

      // ── Original entrance animations ────────────────────────────────────
      gsap.set(bgRef.current, { opacity: 0, scale: 1.06, x: 20 });
      gsap.set(ringRef.current, { opacity: 0, scale: 0.88 });
      gsap.set(headingRef.current, { opacity: 0, y: 24, filter: "blur(6px)" });
      gsap.set(subRef.current, { opacity: 0, y: 14 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.set(card1WrapRef.current, { opacity: 0 });
      gsap.set(card1Ref.current, {
        x: -60,
        y: 30,
        rotateY: 10,
        rotate: -2,
        scale: 0.96,
      });
      gsap.set(card2WrapRef.current, { opacity: 0 });
      gsap.set(card2Ref.current, {
        x: 60,
        y: 30,
        rotateY: -10,
        rotate: 2,
        scale: 0.96,
      });
      gsap.set([mark1Ref.current, mark2Ref.current], {
        opacity: 0,
        scale: 0.85,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        })
        .to(bgRef.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 2.0,
          ease: "power2.out",
        })
        .to(
          ringRef.current,
          { opacity: 0.7, scale: 1, duration: 1.8, ease: "power2.out" },
          "<0.1",
        )
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power2.out",
          },
          "-=1.4",
        )
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.7",
        )
        .to(card1WrapRef.current, { opacity: 1, duration: 0.05 }, "-=0.3")
        .to(card2WrapRef.current, { opacity: 1, duration: 0.05 }, "<")
        .to(
          card1Ref.current,
          {
            x: 0,
            y: 0,
            rotateY: 12,
            rotate: 0,
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          card2Ref.current,
          {
            x: 0,
            y: 0,
            rotateY: -12,
            rotate: 0,
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          "<0.1",
        )
        .to(
          mark1Ref.current,
          { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
          "-=0.9",
        )
        .to(
          mark2Ref.current,
          { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
          "<0.15",
        )
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.5",
        );
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
  }, [founders]);

  const founder1 = founders[0];
  const founder2 = founders[1];

  // Logo mark used in place of a founder photo.
  // "onPurpleCard": white circle, purple icon (sits on the purple card).
  // "onLightCard": purple circle (matches the purple card's bg), white icon
  //                (sits on the white card).
  const BrandMark = ({
    innerRef,
    variant,
  }: {
    innerRef: React.Ref<HTMLDivElement>;
    variant: "onPurpleCard" | "onLightCard";
  }) => {
    const circleBg = variant === "onLightCard" ? "#9564F4" : "#FAFAFC";
    const iconFill = variant === "onLightCard" ? "#FFFFFF" : "#9564F4";

    return (
      <div
        ref={innerRef}
        className="2xl:w-[111px] 2xl:h-[111px] md:w-[100px] md:h-[100px] w-[80px] h-[80px] rounded-full absolute top-[-5.5vh] left-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{
          backgroundColor: circleBg,
          boxShadow: "0 8px 20px rgba(11,7,48,0.35)",
        }}
      >
        <svg width="38%" height="38%" viewBox="0 0 144 145" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M143.934 0H0L24.4609 24.6053C32.1567 32.3465 42.6217 36.6994 53.5374 36.6994H106.337V89.5543C106.337 100.43 110.658 110.859 118.349 118.548L143.934 144.128V0Z" fill={iconFill} />
          <path d="M92.099 51.6011H0.22168L25.5057 76.8803C32.8194 84.1926 42.7381 88.3004 53.0802 88.3004H55.1701V90.8272C55.1701 101.172 59.28 111.093 66.5956 118.407L92.099 143.906V51.6011Z" fill={iconFill} />
          <path d="M40.7108 143.906V103.203H0L40.7108 143.906Z" fill={iconFill} />
        </svg>
      </div>
    );
  };

  return (
    <section
      id="founders"
      ref={sectionRef}
      className="bg-black min-h-[100vh] md:mt-[16.5vh] mt-[10vh] relative overflow-hidden px-4"
    >
      {/* ── Purple-entry overlay: bridges from Chapter 4 transition ── */}
      {/* Covers the very top of the section with the brand purple,   */}
      {/* then scrubs to transparent as you scroll in.                */}
      <div
        ref={purpleOverlayRef}
        className="absolute top-0 left-0 w-full pointer-events-none z-30"
        style={{
          height: "45vh",
          background:
            "linear-gradient(to bottom, #6B3FA0 0%, #6B3FA0 30%, rgba(107,63,160,0.55) 65%, transparent 100%)",
        }}
      />

      {/* Silver thread — traces in briefly as section enters, then fades */}
      <div
        ref={entryLineRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-31"
        style={{
          width: "clamp(80px, 16vw, 220px)",
          height: "1px",
          backgroundColor: "#C0C0C0",
          transformOrigin: "center center",
          top: "2px",
        }}
      />

      <img
        ref={bgRef}
        src={bgSrc}
        alt=""
        className="absolute top-0 right-0 z-10 h-full"
      />
      <img
        ref={ringRef}
        src={ringSrc}
        alt=""
        className="absolute lg:top-0 top-1/7 right-0 2xl:w-auto w-[800px]"
      />
      <img
        src={blurSrc}
        alt="blur"
        className="absolute bottom-[-25vh] w-full left-0 z-20"
      />

      <div className="md:pt-[14vh] pt-[10vh] relative z-20">
        <div className="text-center">
          <h2
            ref={headingRef}
            className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] leading-[150%] text-white"
          >
            {heading}
          </h2>
          <p
            ref={subRef}
            className="font-outfit font-normal leading-[115%] text-white md:text-[18px] text-[14px] mt-[2vh]"
          >
            {subheading}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between justify-center items-center max-w-[1400px] mx-auto xl:px-10 md:px-6 px-4 mt-[10vh] pb-[10vh] lg:pb-0 lg:gap-0 gap-15">
          {/* Card 1 */}
          {founder1 && (
            <div ref={card1WrapRef} style={{ perspective: "1200px" }}>
              <div
                ref={card1Ref}
                className={`2xl:w-[638px] 2xl:h-[367px] xl:w-[600px] xl:h-[320px] lg:w-[470px] w-full md:h-[320px] md:min-h-0 min-h-[320px] xl:px-0 px-6 rounded-[36px] pt-[7vh] md:pb-0 pb-[2vh] relative ${founder1.cardStyle === "light" ? "bg-white" : "bg-[#9564F4]"}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`text-center flex flex-col justify-center items-center max-w-[503px] mx-auto ${founder1.cardStyle === "light" ? "text-black" : "text-white"}`}
                >
                  <p className="font-outfit font-normal 2xl:text-[18px] text-[16px] leading-[115%]">
                    {founder1.bio}
                  </p>
                  <h5 className="font-outfit font-normal 2xl:text-[24px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                    "{founder1.quote}"
                  </h5>
                  <h3 className="font-boldonse font-normal 2xl:text-[28px] md:text-[24px] text-[18px] leading-[151%] mt-[2.5vh]">
                    {founder1.name}
                  </h3>
                  <h6 className="font-outfit font-normal 2xl:text-[22px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                    {founder1.role}
                  </h6>
                </div>
                <BrandMark
                  innerRef={mark1Ref}
                  variant={founder1.cardStyle === "light" ? "onLightCard" : "onPurpleCard"}
                />
              </div>
            </div>
          )}

          {/* Card 2 */}
          {founder2 && (
            <div ref={card2WrapRef} style={{ perspective: "1200px" }}>
              <div
                ref={card2Ref}
                className={`2xl:w-[638px] 2xl:h-[367px] xl:w-[600px] xl:h-[320px] lg:w-[470px] w-full md:h-[320px] md:min-h-0 min-h-[320px] xl:px-0 px-6 rounded-[36px] pt-[7vh] md:pb-0 pb-[2vh] relative ${founder2.cardStyle === "light" ? "bg-white" : "bg-[#9564F4]"}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`text-center flex flex-col justify-center items-center max-w-[503px] mx-auto ${founder2.cardStyle === "light" ? "text-black" : "text-white"}`}
                >
                  <p className="font-outfit font-normal 2xl:text-[18px] text-[16px] leading-[115%]">
                    {founder2.bio}
                  </p>
                  <h5 className="font-outfit font-normal 2xl:text-[24px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                    "{founder2.quote}"
                  </h5>
                  <h3 className="font-boldonse font-normal 2xl:text-[28px] md:text-[24px] text-[18px] leading-[151%] mt-[2.5vh]">
                    {founder2.name}
                  </h3>
                  <h6 className="font-outfit font-normal 2xl:text-[22px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                    {founder2.role}
                  </h6>
                </div>
                <BrandMark
                  innerRef={mark2Ref}
                  variant={founder2.cardStyle === "light" ? "onLightCard" : "onPurpleCard"}
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="text-center lg:mt-[10vh] lg:pb-0 pb-[10vh] relative z-40">
          <a href="#footer">
            <button className="font-boldonse font-normal text-[13px] md:text-[14px] px-10 h-[48px] md:h-[52px] rounded-full border-2 border-white/30 hover:bg-white hover:text-black transition-colors duration-500 text-white">
              Start a Conversation
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Founders;