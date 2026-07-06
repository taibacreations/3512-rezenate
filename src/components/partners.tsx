// components/partners.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";
const CONTENT_LEFT = "27%";

const getContentMaxWidth = () => {
  if (typeof window === "undefined") return "607px";
  return window.innerWidth < 768 ? "200px" : "607px";
};

interface Stage {
  number: string;
  title: string;
  heading: string;
  text: string;
}

interface PartnersData {
  heading?: string;
  subheading?: string;
  stages?: Stage[];
}

const FALLBACK_STAGES: Stage[] = [
  {
    number: "01",
    title: "Attract",
    heading: "We make your story magnetic.",
    text: "We extend the reach of exceptional leadership. After your new leader joins, new opportunities for influence, contribution, and meaningful impact continue to emerge.",
  },
  {
    number: "02",
    title: "Assess",
    heading: "We reveal leadership truth.",
    text: "We go beyond the resume — structured interviews, reference deep-dives, and behavioural insight surface how a leader actually operates under pressure.",
  },
  {
    number: "03",
    title: "Align",
    heading: "We create mutual clarity before commitment.",
    text: "Before any offer is made, we make sure founder and leader are aligned on vision, pace, and what success actually looks like.",
  },
  {
    number: "04",
    title: "Anchor",
    heading: "We enable new leaders to land and lead.",
    text: "The first 100 days shape everything that follows. We support onboarding, stakeholder mapping, and early wins.",
  },
  {
    number: "05",
    title: "Ascend",
    heading: "We extend the reach of exceptional leadership.",
    text: "Our work doesn't end once the right leader is found. Through curated introductions and shared experiences, aligned leaders and founders become part of something larger.",
  },
];

const Partners = ({ data }: { data: PartnersData }) => {
  const heading    = data?.heading    ?? "HOW WE PARTNER";
  const subheading = data?.subheading ?? "We partner with founders and boards to introduce leaders who strengthen culture and build momentum without losing what makes the company human. Every engagement moves through five deliberate stages";
  const stages: Stage[] = data?.stages?.length ? data.stages : FALLBACK_STAGES;

  const [hoveredId, setHoveredId]           = useState<string | null>(null);
  const [contentMaxWidth, setContentMaxWidth] = useState("607px");
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  const sectionRef    = useRef<HTMLElement>(null);
  const introWrapRef  = useRef<HTMLDivElement>(null);
  const rowsWrapRef   = useRef<HTMLDivElement>(null);
  const rowOuterRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs      = useRef<Record<string, HTMLParagraphElement | null>>({});

  useEffect(() => {
    setContentMaxWidth(getContentMaxWidth());
    const handleResize = () => setContentMaxWidth(getContentMaxWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const rows = rowOuterRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(introWrapRef.current, { opacity: 0, y: 20, filter: "blur(6px)" });
      rows.forEach((row) => {
        gsap.set(row, { opacity: 0, y: 30 });
        gsap.set(row.querySelector(".p-title"),           { opacity: 0, x: -12 });
        gsap.set(row.querySelector(".p-content-visible"), { opacity: 0, y: 10 });
        gsap.set(row.querySelector(".p-number"),          { opacity: 0, x: 12 });
        gsap.set(row.querySelector(".p-border"),          { scaleX: 0, transformOrigin: "left center" });
      });

      let introPlayed = false;
      const playIntro = () => {
        if (introPlayed) return;
        introPlayed = true;
        gsap.to(introWrapRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" });
      };
      if (introWrapRef.current) {
        const obs = new IntersectionObserver(
          (entries) => { if (entries[0].isIntersecting) { playIntro(); obs.disconnect(); } },
          { threshold: 0.1 }
        );
        obs.observe(introWrapRef.current);
        setTimeout(playIntro, 1200);
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });
        rows.forEach((row, i) => {
          tl.to(row,                                    { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, i === 0 ? 0 : "-=0.65")
            .to(row.querySelector(".p-title"),           { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "<")
            .to(row.querySelector(".p-content-visible"), { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "<0.1")
            .to(row.querySelector(".p-number"),          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "<0.06")
            .to(row.querySelector(".p-border"),          { scaleX: 1, duration: 0.8, ease: "power2.inOut" },      "-=0.4");
        });
        return () => tl.kill();
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
  }, [stages]);

  useEffect(() => {
    const cards = mobileCardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;
    const mm = gsap.matchMedia();
    const triggers: ScrollTrigger[] = [];
    mm.add("(max-width: 767px)", () => {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 24 });
        triggers.push(
          ScrollTrigger.create({
            trigger: card,
            start: "top 88%",
            onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" }),
            once: true,
          })
        );
      });
      return () => triggers.forEach((t) => t.kill());
    });
    return () => mm.revert();
  }, []);

  // Text expand/collapse on hover — desktop
  useEffect(() => {
    stages.forEach((s) => {
      const el = textRefs.current[s.title];
      if (!el) return;
      gsap.killTweensOf(el);
      if (hoveredId === s.title) {
        gsap.to(el, { height: "auto", opacity: 1, marginTop: "1.2vh", duration: 0.7, ease: "power2.out" });
      } else {
        gsap.to(el, { height: 0, opacity: 0, marginTop: 0, duration: 0.55, ease: "power2.inOut" });
      }
    });
  }, [hoveredId, stages]);

  return (
    <section id="how-we-partner" ref={sectionRef}>
      <div className="max-w-[1420px] mx-auto xl:px-10 md:px-6 px-4">

        {/* Intro */}
        <div
          ref={introWrapRef}
          className="text-center max-w-[728px] mx-auto md:my-[13.5vh] mt-[13vh] mb-[8vh]"
        >
          <h2 className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] leading-[151%] text-black">
            {heading}
          </h2>
          <p className="font-outfit font-normal md:text-[18px] text-[16px] leading-[115%] text-black mt-[1.5vh]">
            {subheading}
          </p>
        </div>

        {/* DESKTOP — hover accordion rows, no floating image */}
        <div
          ref={rowsWrapRef}
          onMouseLeave={() => setHoveredId(null)}
          className="relative hidden md:block"
        >
          {stages.map((s, i) => {
            const isActive = hoveredId === s.title;
            return (
              <div
                key={i}
                ref={(el) => { rowOuterRefs.current[i] = el; }}
              >
                <div
                  onMouseEnter={() => setHoveredId(s.title)}
                  className="flex justify-between items-center relative py-[3.2vh] cursor-pointer"
                >
                  {/* Stage title */}
                  <h4
                    className="p-title font-boldonse font-normal lg:text-[28px] md:text-[22px] leading-[151%] transition-colors duration-500"
                    style={{ color: isActive ? BRAND_COLOR : "#000" }}
                  >
                    {s.title}
                  </h4>

                  {/* Invisible spacer — keeps layout stable */}
                  <div
                    aria-hidden="true"
                    className="invisible"
                    style={{ marginLeft: CONTENT_LEFT, maxWidth: contentMaxWidth }}
                  >
                    <h6 className="font-outfit font-normal lg:text-[24px] md:text-[20px] leading-[115%]">{s.heading}</h6>
                    <div
                      className="grid transition-[grid-template-rows] duration-700 ease-out"
                      style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="font-outfit font-normal lg:text-[18px] md:text-[16px] leading-[150%] pt-[1.2vh]">{s.text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Visible content */}
                  <div
                    className="p-content-visible absolute"
                    style={{ left: CONTENT_LEFT, maxWidth: contentMaxWidth }}
                  >
                    <h6 className="font-outfit font-normal lg:text-[24px] md:text-[20px] leading-[115%] text-black">{s.heading}</h6>
                    <p
                      ref={(el) => { textRefs.current[s.title] = el; }}
                      className="font-outfit font-normal lg:text-[18px] md:text-[16px] leading-[150%] text-black/70 overflow-hidden"
                      style={{ height: 0, opacity: 0, marginTop: 0 }}
                    >
                      {s.text}
                    </p>
                  </div>

                  {/* Stage number — fades on hover */}
                  <h4
                    className="p-number font-boldonse font-normal lg:text-[28px] md:text-[22px] leading-[151%] text-black shrink-0 transition-all duration-500"
                    style={{
                      opacity: isActive ? 0 : 1,
                      transform: isActive ? "translateX(8px)" : "translateX(0)",
                    }}
                  >
                    {s.number}
                  </h4>
                </div>

                {/* Row divider */}
                <div
                  className="p-border border w-full transition-opacity duration-700"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                />
              </div>
            );
          })}
        </div>

        {/* MOBILE — vertical spine + expand cards */}
        <div className="flex md:hidden flex-col pb-[6vh]">
          <div
            className="overflow-y-auto snap-y snap-mandatory"
            style={{ maxHeight: "80vh", scrollbarWidth: "none" }}
          >
            <div className="relative pl-10" style={{ msOverflowStyle: "none" }}>
              {/* Vertical spine */}
              <div
                className="absolute left-4 top-0 bottom-0 w-[1px] pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent 0%, #c0c0c0 5%, #c0c0c0 95%, transparent 100%)" }}
              />

              {stages.map((s, i) => {
                const isExpanded = expandedMobileId === s.title;
                const isLast = i === stages.length - 1;
                return (
                  <div
                    key={i}
                    ref={(el) => { mobileCardRefs.current[i] = el; }}
                    className={`snap-start relative ${isLast ? "pb-2" : "mb-5"}`}
                  >
                    {/* Spine dot */}
                    <div
                      className="absolute left-[-26px] top-[18px] w-[6px] h-[6px] rounded-full border transition-all duration-500"
                      style={{
                        backgroundColor: isExpanded ? BRAND_COLOR : "#fff",
                        borderColor: isExpanded ? BRAND_COLOR : "#c0c0c0",
                        boxShadow: isExpanded ? `0 0 6px ${BRAND_COLOR}` : "none",
                      }}
                    />

                    {/* Accordion card */}
                    <div
                      onClick={() => setExpandedMobileId((prev) => prev === s.title ? null : s.title)}
                      className="bg-white rounded-[16px] border border-black/8 active:bg-black/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3 p-4">
                        <span
                          className="font-boldonse font-normal text-[18px] leading-none shrink-0 pt-0.5 transition-colors duration-500 w-8"
                          style={{ color: isExpanded ? BRAND_COLOR : "rgba(0,0,0,0.25)" }}
                        >
                          {s.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <h4
                              className="font-boldonse font-normal text-[17px] leading-[130%] transition-colors duration-500"
                              style={{ color: isExpanded ? BRAND_COLOR : "#000" }}
                            >
                              {s.title}
                            </h4>
                            <span
                              className="shrink-0 w-6 h-6 rounded-full border border-black/15 flex items-center justify-center transition-transform duration-500"
                              style={{ transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)" }}
                            >
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <path d="M6 1V11M1 6H11" stroke="#000" strokeWidth="1.4" strokeLinecap="round" />
                              </svg>
                            </span>
                          </div>
                          <h6 className="font-outfit font-normal text-[14px] leading-[130%] text-black/60 mt-1">{s.heading}</h6>
                          <div
                            className="grid transition-[grid-template-rows] duration-500 ease-out"
                            style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                          >
                            <div className="overflow-hidden">
                              <p className="font-outfit font-normal text-[13px] leading-[150%] text-black/60 pt-3">{s.text}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;