"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortableText } from "@portabletext/react";
import type {
  PartnersData,
  PartnerItem,
  PortableTextBlock,
} from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

const getPartnerIcon = (index: number, accentColor: string) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: accentColor,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (index) {
    case 0: // Attract — magnet
      return (
        <svg {...common}>
          <path d="M4 4h4v7a4 4 0 0 0 8 0V4h4v7a8 8 0 0 1-16 0V4z" />
          <path d="M4 4v4M8 4v4M16 4v4M20 4v4" />
          <path d="M1.5 3.5l1.2 1.2M22.5 3.5l-1.2 1.2" />
        </svg>
      );
    case 1: // Assess — lightbulb
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
        </svg>
      );
    case 2: // Align — target / crosshair
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="0.6" fill={accentColor} />
          <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
        </svg>
      );
    case 3: // Anchor
      return (
        <svg {...common}>
          <circle cx="12" cy="4" r="2" />
          <path d="M12 6v14" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      );
    case 4: // Ascend — custom mark (4 curved blades with star center)
  return (
    <div
      aria-hidden="true"
      style={{
        width: 22,
        height: 22,
        backgroundColor: accentColor,
        WebkitMaskImage: "url(/ascend.svg)",
        maskImage: "url(/ascend.svg)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
    default:
      return null;
  }
};

// Small expand/collapse chevron — the only element that animates on toggle
const ChevronIcon = ({ accentColor }: { accentColor: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={accentColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-outfit font-normal xl:text-[18px] text-[16px] leading-[150%] text-[#0B0730] mt-3 first:mt-0">
        {children}
      </p>
    ),
  },
};

const Description = ({
  description,
}: {
  description: PortableTextBlock[] | string | undefined;
}) => {
  if (!description) return null;
  if (typeof description === "string") {
    return (
      <p className="font-outfit font-normal xl:text-[18px] lg:text-[16px] leading-[150%] text-[#0B0730]">
        {description}
      </p>
    );
  }
  return <PortableText value={description} components={ptComponents} />;
};

const FALLBACK_ITEMS = [
  {
    num: "01",
    title: "Attract",
    subtitle: "We make your story magnetic.",
    description:
      "We craft a compelling narrative around your organisation that draws the right leaders in. From positioning to outreach, we ensure your opportunity stands out in a crowded market and resonates with candidates who lead with both head and heart.",
  },
  {
    num: "02",
    title: "Assess",
    subtitle: "We reveal leadership truth",
    description:
      "Beyond credentials and confidence, we go deeper. Our assessment process uncovers how candidates think, lead under pressure, and shape the people around them — giving you a clear picture of who they truly are before any decision is made.",
  },
  {
    num: "03",
    title: "Align",
    subtitle: "We create mutual clarity before commitment",
    description:
      "We facilitate honest conversations between candidates and your leadership team to ensure values, expectations, and vision are genuinely shared. Alignment here prevents misalignment later — saving culture, time, and trust.",
  },
  {
    num: "04",
    title: "Anchor",
    subtitle: "We enable new leaders to land and lead.",
    description:
      "The first 90 days define everything. We stay present through onboarding, helping your new leader build relationships, read the room, and establish credibility — so momentum builds from day one rather than stalling.",
  },
  {
    num: "05",
    title: "Ascend",
    subtitle: "We extend the reach of exceptional leadership.",
    description:
      "Great leaders grow. We provide ongoing support, coaching, and connection long after placement — because our commitment is to the leader's journey and your organisation's future, not just the transaction of filling a role.",
  },
];

const FALLBACK = {
  headingPlain: "How we partner",
  subParagraph:
    "We partner with founders and boards to introduce leaders who strengthen culture and build momentum without losing what makes the company human.\n Every engagement moves through five deliberate stages.",
  items: FALLBACK_ITEMS,
};

const PartnerCard = ({
  item,
  index,
  isOpen,
  onClick,
  accentColor,
}: {
  item: PartnerItem | (typeof FALLBACK_ITEMS)[0];
  index: number;
  isOpen: boolean;
  onClick: () => void;
  accentColor: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Content expand/collapse — measures actual scrollHeight for a smooth,
  // jank-free animation instead of animating straight to "auto"
  useEffect(() => {
    const el = contentRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    tweenRef.current?.kill();

    if (isOpen) {
      const targetHeight = inner.offsetHeight;
      gsap.set(el, { height: 0, opacity: 0 });
      tweenRef.current = gsap.to(el, {
        height: targetHeight,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(el, { height: "auto" });
        },
      });
    } else {
      gsap.set(el, { height: el.offsetHeight });
      tweenRef.current = gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  // Icon — rotates 90deg anticlockwise when active, chevron stays fixed
  useEffect(() => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      rotate: isOpen ? 90 : 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  return (
    <div
      className={`transition-all duration-300 rounded-2xl cursor-pointer ${
        isOpen
          ? "bg-[#EFEBF5] border-l-[3px] border-l-[#9564F4] pl-4 md:pl-6 -ml-[3px] -mt-3 pt-3"
          : "border-b border-[#DEE6E9] pl-4 md:pl-6 -ml-[3px] -mt-3 pt-3"
      }`}
      onClick={onClick}
    >
      <div className="flex md:grid items-center justify-between md:justify-normal md:grid-cols-[260px_1fr_80px] xl:grid-cols-[260px_1fr_80px] lg:grid-cols-[140px_1fr_100px] w-full py-5 pr-4 md:pr-6 gap-4">
        <div className="flex items-center gap-3 md:gap-12 xl:gap-12 lg:gap-4 min-w-0">
          <h5
            className="font-outfit font-normal xl:text-[38px] md:text-[30px] text-[24px] tracking-[-0.04em] leading-[113%] whitespace-nowrap"
            style={{ color: accentColor }}
          >
            {item.num}
          </h5>
          <h3 className="font-toruspro font-normal xl:text-[26px] text-[19px] leading-[90%] text-[#0B0730] whitespace-nowrap">
            {item.title}
          </h3>
        </div>

        <h4 className="font-outfit font-normal xl:text-[19px] text-[15px] leading-[130%] text-[#0B0730] hidden md:block whitespace-nowrap">
          {item.subtitle}
        </h4>

        <div className="flex flex-col items-center gap-1.5 justify-self-end shrink-0">
          <div
            ref={iconRef}
            className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-full border flex items-center justify-center"
            style={{ borderColor: `${accentColor}55` }}
          >
            {getPartnerIcon(index, accentColor)}
          </div>
          <div className="flex items-center justify-center">
            <ChevronIcon accentColor={accentColor} />
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{ height: 0, overflow: "hidden", opacity: 0 }}
      >
        <div ref={innerRef} className="pb-6 pr-4 md:pr-6 max-w-[720px]">
          <div
            className="border-t mb-4"
            style={{ borderColor: `${accentColor}33` }}
          />
          <Description
            description={item.description as PortableTextBlock[] | string}
          />
        </div>
      </div>
    </div>
  );
};

interface PartnersProps {
  data?: PartnersData | null;
}

const Partners = ({ data }: PartnersProps) => {
  const headingPlain = data?.headingPlain ?? FALLBACK.headingPlain;
  const subParagraph = data?.subParagraph ?? FALLBACK.subParagraph;
  const items = (data?.items?.length ? data.items : FALLBACK_ITEMS) as (
    PartnerItem | (typeof FALLBACK_ITEMS)[0]
  )[];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 });
      const cardEls = cardsRef.current?.children
        ? Array.from(cardsRef.current.children)
        : [];
      gsap.set(cardEls, { autoAlpha: 0, y: 30 });

      const isMobile = window.innerWidth < 768;

      const createTrigger = () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: isMobile ? "top 90%" : "top 80%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(headingRef.current, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "expo.out",
            }).to(
              cardEls,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: "expo.out",
                stagger: 0.1,
              },
              "-=0.6",
            );
          },
        });
      };

      const onLoadingDone = () => {
        ScrollTrigger.refresh(true);
        setTimeout(() => {
          ScrollTrigger.refresh(true);
          createTrigger();
        }, 100);
      };

      if (document.body.style.position !== "fixed") {
        createTrigger();
      } else {
        window.addEventListener("loading-done", onLoadingDone, { once: true });
      }

      return () => {
        window.removeEventListener("loading-done", onLoadingDone);
      };
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      <svg className="relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F7F6F9" fill-opacity="1" d="M0,192L48,165.3C96,139,192,85,288,101.3C384,117,480,203,576,218.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
      <section
        ref={sectionRef}
        id="how-we-partner"
        className="bg-[#FAFAFC] 3xl:min-h-[80vh] 2xl:pb-[8vh] lg:mt-[-10vh] md:mt-[-10vh] md:pt-[10vh] lg:pb-[6vh] relative px-4 md:px-6 xl:px-10 overflow-hidden"
      >
        <div className="border border-gray-300 rounded-full 2xl:w-[900px] 2xl:h-[900px] xl:w-[650px] xl:h-[650px] lg:w-[800px] lg:h-[800px] w-[500px] h-[500px] absolute xl:left-[-38%] md:left-[-45%] left-[-70%] lg:top-[-10vh] md:top-0 top-[25vh]" />

        <div className="max-w-[1360px] mx-auto grid lg:grid-cols-[0.8fr_1.5fr] xl:gap-x-14 gap-y-10 items-start relative">
          <div
            ref={headingRef}
            style={{ opacity: 0 }}
            className="lg:sticky lg:top-[15vh] lg:text-start text-center"
          >
            <h2 className="font-toruspro font-normal 2xl:text-[52px] xl:text-[46px] lg:text-[38px] md:text-[34px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-[#0B0730]">
              {headingPlain}
            </h2>
            <div className="w-18 lg:mx-0 mx-auto h-[2px] bg-[#0B0730] mt-4 mb-5" />
            <p className="font-outfit 2xl:text-[20px] xl:text-[18px] md:text-[17px] text-[15px] leading-[150%] text-[#0B0730] whitespace-pre-line">
              {subParagraph}
            </p>
          </div>

          <div ref={cardsRef} className="flex flex-col w-full relative z-30">
            {items.map((item, i) => (
              <PartnerCard
                key={item.num}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex((prev) => (prev === i ? null : i))}
                accentColor={"#9564F4"}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
