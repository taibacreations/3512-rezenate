"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const PARTNERS_DATA = [
  {
    num: "01",
    title: "Attract",
    subtitle: "We make your story magnetic.",
    description: "We craft a compelling narrative around your organisation that draws the right leaders in. From positioning to outreach, we ensure your opportunity stands out in a crowded market and resonates with candidates who lead with both head and heart.",
  },
  {
    num: "02",
    title: "Assess",
    subtitle: "We reveal leadership truth",
    description: "Beyond credentials and confidence, we go deeper. Our assessment process uncovers how candidates think, lead under pressure, and shape the people around them — giving you a clear picture of who they truly are before any decision is made.",
  },
  {
    num: "03",
    title: "Align",
    subtitle: "We create mutual clarity before commitment",
    description: "We facilitate honest conversations between candidates and your leadership team to ensure values, expectations, and vision are genuinely shared. Alignment here prevents misalignment later — saving culture, time, and trust.",
  },
  {
    num: "04",
    title: "Anohor",
    subtitle: "We enable new leaders to land and lead.",
    description: "The first 90 days define everything. We stay present through onboarding, helping your new leader build relationships, read the room, and establish credibility — so momentum builds from day one rather than stalling.",
  },
  {
    num: "05",
    title: "Ascend",
    subtitle: "We extend the reach of exceptional leadership.",
    description: "Great leaders grow. We provide ongoing support, coaching, and connection long after placement — because our commitment is to the leader's journey and your organisation's future, not just the transaction of filling a role.",
  },
];

const PartnerCard = ({
  item,
  isOpen,
  onClick,
}: {
  item: (typeof PARTNERS_DATA)[0];
  isOpen: boolean;
  onClick: () => void;
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
      {/* exact original partner-border — flex + justify-between from CSS */}
      <div className="partner-border pl-12 pr-4 !h-auto !flex-col !items-start py-4">
        {/* Original two divs — left and right — exactly as original */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-10">
            <h5 className="font-readex font-light text-[60px] text-[#9564F4] tracking-[-0.04em] leading-[113%]">
              {item.num}
            </h5>
            <div className="border border-r border-[#9564F4] h-[58px]" />
            <h3 className="font-readex font-light text-[32px] leading-[90%] text-black">
              {item.title}
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <h4 className="font-outfit font-normal text-[24px] leading-[114%] text-black">
              {item.subtitle}
            </h4>
            <div className="partners-arrow-wrapper flex-shrink-0">
              <div
                className="partners-arrow transition-transform duration-500"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                >
                  <path
                    d="M7.79492 13.5L0.000695455 -1.4682e-06L15.5892 -1.05412e-07L7.79492 13.5Z"
                    fill="#9564F4"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable content */}
        <div ref={contentRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
          <div className="pt-4 pb-2 max-w-[820px]">
            <div className="border-t border-[#dec7ff] mb-4" />
            <p className="font-outfit font-normal text-[20px] leading-[150%] text-black/70">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Partners = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[url(/partners1.webp)] bg-cover bg-center min-h-screen mt-[-9vh] relative">
      <div>
        <div className="max-w-[878px] mx-auto text-center">
          <h2 className="font-readex font-light text-[60px] leading-[113%] tracking-[-0.04em] capitalize text-black">
            How we{" "}
            <span className="text-[#9564F4] tracking-[0em] italic font-tartuffo lowercase">
              partner
            </span>
          </h2>
          <p className="font-outfit text-[24px] leading-[130%] text-black mt-[1.5vh]">
            We partner with founders and boards to introduce leaders who
            strengthen culture and build momentum without losing what makes the
            company human.
            <br /> Every engagement moves through five deliberate stages.
          </p>
        </div>
        <div className="max-w-[1070px] mx-auto flex flex-col gap-7 w-full mt-[3.5vh]">
          {PARTNERS_DATA.map((item, i) => (
            <PartnerCard
              key={item.num}
              item={item}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;