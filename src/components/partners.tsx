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

const CARD_GAPS = [
  "2xl:gap-[15vw] xl:gap-[18vw] gap-[22vw]",
  "2xl:gap-[17.2vw] xl:gap-[21vw] lg:gap-[25.5vw] gap-[26vw]",
  "2xl:gap-[7vw] xl:gap-[7.4vw] lg:gap-[9.5vw] gap-[7vw]",
  "2xl:gap-[9.6vw] xl:gap-[10.8vw] lg:gap-[13.4vw] gap-[12vw]",
  "xl:gap-[6vw] lg:gap-[7.7vw] gap-[5vw]",
];

const getPartnerIcon = (index: number, accentColor: string) => {
  const common = {
    width: 30,
    height: 30,
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
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v13" />
          <path d="M7 13a5 5 0 0 0 10 0" />
          <path d="M5 13H2l1.5 2M22 13h-3l-1.5 2" />
        </svg>
      );
    case 4: // Ascend — rising trend arrow
      return (
        <svg {...common}>
          <path d="M3 17c3-1 5-6 8-6s4 5 7 2" />
          <path d="M14.5 12.5l4-1.5 1 4" />
        </svg>
      );
    default:
      return null;
  }
};

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-outfit font-normal xl:text-[20px] lg:text-[18px] text-[16px] leading-[150%] text-[#0B0730] mt-3 first:mt-0">
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
      <p className="font-outfit font-normal xl:text-[20px] lg:text-[18px] text-[16px] leading-[150%] text-[#0B0730]">
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
  const arrowRef = useRef<HTMLDivElement>(null); // New ref for the arrow

  // Content expand/collapse animation
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "power3.inOut" },
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  // Arrow upward extension animation (replaces the 180deg flip)
  useEffect(() => {
    if (!arrowRef.current) return;

    if (isOpen) {
      // Lifts the icon upwards and scales it slightly to feel like it's "extending up"
      gsap.to(arrowRef.current, {
        y: -6,
        scale: 1.15,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      // Returns to original position smoothly
      gsap.to(arrowRef.current, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div
      className="border border-[#DEE6E9] rounded-[20px] cursor-pointer"
      onClick={onClick}
    >
      <div className="partner-border lg:pl-12 pl-6 pr-4 !h-auto !flex-col !items-start py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center lg:gap-10 md:gap-6 gap-3">
            <h5
              className="font-outfit font-normal xl:text-[60px] lg:text-[50px] md:text-[40px] text-[30px] tracking-[-0.04em] leading-[113%] whitespace-nowrap"
              style={{ color: accentColor }}
            >
              {item.num}
            </h5>
            <div
              className="border border-r xl:h-[58px] lg:h-[48px] md:h-[38px] h-[30px]"
              style={{ borderColor: accentColor }}
            />
            <h3 className="font-toruspro font-normal xl:text-[32px] lg:text-[28px] text-[24px] leading-[90%] text-[#0B0730]">
              {item.title}
            </h3>
          </div>
          <div className={`flex items-center gap-6 ${CARD_GAPS[index] ?? ""}`}>
            <h4 className="font-outfit font-normal xl:text-[24px] lg:text-[20px] text-[18px] leading-[114%] text-[#0B0730] hidden md:block">
              {item.subtitle}
            </h4>
            <div className="partners-arrow-wrapper flex-shrink-0">
              <div
                ref={arrowRef}
                className="partners-arrow"
                // Removed the rotate transform entirely to prevent upside-down icons
              >
                {getPartnerIcon(index, accentColor)}
              </div>
            </div>
          </div>
        </div>
        <div
          ref={contentRef}
          style={{ height: 0, overflow: "hidden", opacity: 0 }}
        >
          <div className="pt-4 pb-2 max-w-[820px]">
            <div
              className="border-t mb-4"
              style={{ borderColor: `${accentColor}55` }}
            />
            <Description
              description={item.description as PortableTextBlock[] | string}
            />
          </div>
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
    <section
      ref={sectionRef}
      id="how-we-partner"
      className="xl:min-h-screen xl:py-[8vh] md:pt-[10vh] lg:pb-[6vh] relative px-4 md:px-6 xl:px-10"
    >
      <div className="border border-gray-300 rounded-full 2xl:w-[1000px] 2xl:h-[1000px] lg:w-[800px] lg:h-[800px] w-[500px] h-[500px] absolute xl:left-[-33%] md:left-[-45%] left-[-70%] lg:top-[-10vh] md:top-0 top-[25vh]" />
      <div>
        <div
          ref={headingRef}
          style={{ opacity: 0 }}
          className="xl:max-w-[878px] max-w-[780px] mx-auto text-center"
        >
          <h2 className="font-toruspro font-normal 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-[#0B0730]">
            {headingPlain}
          </h2>
          <p className="font-outfit 2xl:text-[24px] xl:text-[22px] md:text-[20px] text-[16px] leading-[130%] text-[#0B0730] mt-[1.5vh] whitespace-pre-line">
            {subParagraph}
          </p>
        </div>
        <div
          ref={cardsRef}
          className="max-w-[1070px] mx-auto flex flex-col gap-7 w-full mt-[3.5vh]"
        >
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
  );
};

export default Partners;
