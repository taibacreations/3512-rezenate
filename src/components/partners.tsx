// Partners.tsx — Sanity CMS powered (no cache)
// npm install @portabletext/react  ← ek baar run karo
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortableText } from "@portabletext/react";
import type { PartnersData, PartnerItem, PortableTextBlock } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// ── Hardcoded gaps per index ───────────────────────────────────────────────
const CARD_GAPS = [
  "2xl:gap-[15vw] xl:gap-[18vw] gap-[22vw]",
  "2xl:gap-[17.2vw] xl:gap-[21vw] lg:gap-[25.5vw] gap-[26vw]",
  "2xl:gap-[7vw] xl:gap-[7.4vw] lg:gap-[9.5vw] gap-[7vw]",
  "2xl:gap-[9.6vw] xl:gap-[10.8vw] lg:gap-[13.4vw] gap-[12vw]",
  "xl:gap-[6vw] lg:gap-[7.7vw] gap-[5vw]",
];

// ── Portable Text components — paragraph gap styling ──────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-outfit font-normal xl:text-[20px] lg:text-[18px] text-[16px] leading-[150%] text-black/70 mt-3 first:mt-0">
        {children}
      </p>
    ),
  },
};

// ── Description renderer — handles both PortableText array and plain string ──
const Description = ({
  description,
}: {
  description: PortableTextBlock[] | string | undefined;
}) => {
  if (!description) return null;

  // Plain string fallback (old data / FALLBACK_ITEMS)
  if (typeof description === "string") {
    return (
      <p className="font-outfit font-normal xl:text-[20px] lg:text-[18px] text-[16px] leading-[150%] text-black/70">
        {description}
      </p>
    );
  }

  // Portable Text array from Sanity
  return <PortableText value={description} components={ptComponents} />;
};

// ── Fallback data — description as plain string ────────────────────────────
const FALLBACK_ITEMS = [
  { num: "01", title: "Attract",       subtitle: "We make your story magnetic.",                      description: "We craft a compelling narrative around your organisation that draws the right leaders in. From positioning to outreach, we ensure your opportunity stands out in a crowded market and resonates with candidates who lead with both head and heart." },
  { num: "02", title: "Assess",        subtitle: "We reveal leadership truth",                        description: "Beyond credentials and confidence, we go deeper. Our assessment process uncovers how candidates think, lead under pressure, and shape the people around them — giving you a clear picture of who they truly are before any decision is made." },
  { num: "03", title: "Align",         subtitle: "We create mutual clarity before commitment",        description: "We facilitate honest conversations between candidates and your leadership team to ensure values, expectations, and vision are genuinely shared. Alignment here prevents misalignment later — saving culture, time, and trust." },
  { num: "04", title: "Anohor",        subtitle: "We enable new leaders to land and lead.",           description: "The first 90 days define everything. We stay present through onboarding, helping your new leader build relationships, read the room, and establish credibility — so momentum builds from day one rather than stalling." },
  { num: "05", title: "Ascend",        subtitle: "We extend the reach of exceptional leadership.",    description: "Great leaders grow. We provide ongoing support, coaching, and connection long after placement — because our commitment is to the leader's journey and your organisation's future, not just the transaction of filling a role." },
];

const FALLBACK = {
  headingPlain:  "How we",
  headingItalic: "partner",
  subParagraph:  "We partner with founders and boards to introduce leaders who strengthen culture and build momentum without losing what makes the company human.\n Every engagement moves through five deliberate stages.",
  items:         FALLBACK_ITEMS,
  accentColor:   "#9564F4",
};

// ── PartnerCard ────────────────────────────────────────────────────────────
const PartnerCard = ({
  item,
  index,
  isOpen,
  onClick,
  accentColor,
}: {
  item: PartnerItem | typeof FALLBACK_ITEMS[0];
  index: number;
  isOpen: boolean;
  onClick: () => void;
  accentColor: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.inOut" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: "power3.inOut" });
    }
  }, [isOpen]);

  return (
    <div className="partner-border-wrapper cursor-pointer" onClick={onClick}>
      <div className="partner-border lg:pl-12 pl-6 pr-4 !h-auto !flex-col !items-start py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center lg:gap-10 md:gap-6 gap-3">
            <h5
              className="font-readex font-light xl:text-[60px] lg:text-[50px] md:text-[40px] text-[30px] tracking-[-0.04em] leading-[113%]"
              style={{ color: accentColor }}
            >
              {item.num}
            </h5>
            <div className="border border-r xl:h-[58px] lg:h-[48px] md:h-[38px] h-[30px]" style={{ borderColor: accentColor }} />
            <h3 className="font-readex font-light xl:text-[32px] lg:text-[28px] text-[24px] leading-[90%] text-black">
              {item.title}
            </h3>
          </div>
          <div className={`flex items-center gap-6 ${CARD_GAPS[index] ?? ""}`}>
            <h4 className="font-outfit font-normal xl:text-[24px] lg:text-[20px] text-[18px] leading-[114%] text-black hidden md:block">
              {item.subtitle}
            </h4>
            <div className="partners-arrow-wrapper flex-shrink-0">
              <div
                className="partners-arrow transition-transform duration-500"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path d="M7.79492 13.5L0.000695455 -1.4682e-06L15.5892 -1.05412e-07L7.79492 13.5Z" fill={accentColor} />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <div ref={contentRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
          <div className="pt-4 pb-2 max-w-[820px]">
            <div className="border-t mb-4" style={{ borderColor: `${accentColor}55` }} />
            <Description description={item.description as PortableTextBlock[] | string} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Partners ───────────────────────────────────────────────────────────────
interface PartnersProps {
  data?: PartnersData | null;
}

const Partners = ({ data }: PartnersProps) => {
  const headingPlain  = data?.headingPlain  ?? FALLBACK.headingPlain;
  const headingItalic = data?.headingItalic ?? FALLBACK.headingItalic;
  const subParagraph  = data?.subParagraph  ?? FALLBACK.subParagraph;
  const items         = (data?.items?.length ? data.items : FALLBACK_ITEMS) as (PartnerItem | typeof FALLBACK_ITEMS[0])[];
  const accentColor   = data?.accentColor   ?? FALLBACK.accentColor;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  // ── Entrance ───────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 });
      const cardEls = cardsRef.current?.children ? Array.from(cardsRef.current.children) : [];
      gsap.set(cardEls, { autoAlpha: 0, y: 30 });

      const isMobile = window.innerWidth < 768;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: isMobile ? "top 180%" : "top 140%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl
            .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out" })
            .to(cardEls, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1 }, "-=0.6");
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-we-partner"
      className="bg-[url(/partners1.webp)] bg-cover bg-center xl:min-h-screen xl:py-[8vh] md:pt-[10vh] lg:pb-[6vh] relative px-4 md:px-6 xl:px-10"
    >
      <div>
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0 }} className="xl:max-w-[878px] max-w-[780px] mx-auto text-center">
          <h2 className="font-readex font-light 2xl:text-[60px] xl:text-[52px] lg:text-[46px] md:text-[40px] text-[32px] leading-[113%] tracking-[-0.04em] capitalize text-black">
            {headingPlain}{" "}
            <span className="tracking-[0em] italic font-tartuffo lowercase" style={{ color: accentColor }}>
              {headingItalic}
            </span>
          </h2>
          <p className="font-outfit 2xl:text-[24px] xl:text-[22px] md:text-[20px] text-[16px] leading-[130%] text-black mt-[1.5vh] whitespace-pre-line">
            {subParagraph}
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="max-w-[1070px] mx-auto flex flex-col gap-7 w-full mt-[3.5vh]">
          {items.map((item, i) => (
            <PartnerCard
              key={item.num}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex((prev) => (prev === i ? null : i))}
              accentColor={accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;