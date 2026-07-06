"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR  = "#9564F4";
const CONTENT_LEFT = "27%";

const getContentMaxWidth = () => {
  if (typeof window === "undefined") return "607px";
  return window.innerWidth < 768 ? "200px" : "607px";
};

const ICONS: Record<string, React.ReactNode> = {
  "shield-check": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "dollar": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "shield": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "person": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

interface Stage {
  number: string;
  title: string;
  heading: string;
  text: string;
  image?: { asset: { _ref: string } } | null;
}

interface TrustSignal {
  label: string;
  detail: string;
  icon: string;
}

interface PartnersData {
  heading?: string;
  subheading?: string;
  stages?: Stage[];
  trustSignals?: TrustSignal[];
}

const FALLBACK_STAGES: Stage[] = [
  { number: "01", title: "Attract", heading: "We make your story magnetic.",               text: "We extend the reach of exceptional leadership. After your new leader joins, new opportunities for influence, contribution, and meaningful impact continue to emerge." },
  { number: "02", title: "Assess",  heading: "We reveal leadership truth.",                text: "We go beyond the resume — structured interviews, reference deep-dives, and behavioural insight surface how a leader actually operates under pressure." },
  { number: "03", title: "Align",   heading: "We create mutual clarity before commitment.", text: "Before any offer is made, we make sure founder and leader are aligned on vision, pace, and what success actually looks like." },
  { number: "04", title: "Anchor",  heading: "We enable new leaders to land and lead.",    text: "The first 100 days shape everything that follows. We support onboarding, stakeholder mapping, and early wins." },
  { number: "05", title: "Ascend",  heading: "We extend the reach of exceptional leadership.", text: "Our work doesn't end once the right leader is found. Through curated introductions and shared experiences, aligned leaders and founders become part of something larger." },
];

const FALLBACK_TRUST: TrustSignal[] = [
  { label: "Replacement Guarantee",  detail: "If it doesn't work out, we make it right.",      icon: "shield-check" },
  { label: "Transparent Fees",       detail: "No hidden costs. No surprises. Ever.",            icon: "dollar"       },
  { label: "Values-Aligned Process", detail: "Every leader shares your core principles.",       icon: "shield"       },
  { label: "Founder-Led",            detail: "You work directly with us — not a junior team.", icon: "person"       },
];

const Partners = ({ data }: { data: PartnersData }) => {
  const heading      = data?.heading      ?? "HOW WE PARTNER";
  const subheading   = data?.subheading   ?? "We partner with founders and boards to introduce leaders who strengthen culture and build momentum without losing what makes the company human. Every engagement moves through five deliberate stages";
  const stages       = data?.stages?.length      ? data.stages       : FALLBACK_STAGES;
  const trustSignals = data?.trustSignals?.length ? data.trustSignals : FALLBACK_TRUST;

  const [hoveredId,        setHoveredId]        = useState<string | null>(null);
  const [contentMaxWidth,  setContentMaxWidth]  = useState("607px");
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  const sectionRef     = useRef<HTMLElement>(null);
  const introWrapRef   = useRef<HTMLDivElement>(null);
  const rowsWrapRef    = useRef<HTMLDivElement>(null);
  const rowOuterRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs       = useRef<Record<string, HTMLParagraphElement | null>>({});
  const trustRef       = useRef<HTMLDivElement>(null);

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
        gsap.set(row,                                    { opacity: 0, y: 30 });
        gsap.set(row.querySelector(".p-title"),           { opacity: 0, x: -12 });
        gsap.set(row.querySelector(".p-content-visible"), { opacity: 0, y: 10  });
        gsap.set(row.querySelector(".p-number"),          { opacity: 0, x: 12  });
        gsap.set(row.querySelector(".p-border"),          { scaleX: 0, transformOrigin: "left center" });
      });

      // Intro
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

      // Trust strip — premium staggered entrance
      if (trustRef.current) {
        const items   = trustRef.current.querySelectorAll(".trust-item");
        const icons   = trustRef.current.querySelectorAll(".trust-icon");
        const labels  = trustRef.current.querySelectorAll(".trust-label");
        const details = trustRef.current.querySelectorAll(".trust-detail");
        const dividers = trustRef.current.querySelectorAll(".trust-divider");

        gsap.set(trustRef.current, { opacity: 0 });
        gsap.set(items,    { opacity: 0, y: 28, filter: "blur(4px)" });
        gsap.set(icons,    { scale: 0.6, opacity: 0 });
        gsap.set(labels,   { opacity: 0, x: -8 });
        gsap.set(details,  { opacity: 0, y: 6  });
        gsap.set(dividers, { scaleY: 0, transformOrigin: "top center" });

        ScrollTrigger.create({
          trigger: trustRef.current,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.timeline()
              .to(trustRef.current, { opacity: 1, duration: 0.4, ease: "none" })
              .to(items,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.13, ease: "power3.out"   }, "<0.1")
              .to(icons,   { scale: 1,  opacity: 1,                 duration: 0.7, stagger: 0.13, ease: "back.out(1.6)" }, "<0.15")
              .to(labels,  { opacity: 1, x: 0,                      duration: 0.6, stagger: 0.13, ease: "power2.out"   }, "<0.1")
              .to(details, { opacity: 1, y: 0,                      duration: 0.6, stagger: 0.13, ease: "power2.out"   }, "<0.08")
              .to(dividers,{ scaleY: 1,                              duration: 0.8, stagger: 0.1,  ease: "power2.inOut" }, "<0.2");
          },
        });
      }

      // Desktop rows
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
            .to(row.querySelector(".p-border"),          { scaleX: 1,  duration: 0.8, ease: "power2.inOut"    }, "-=0.4");
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
  }, [stages, trustSignals]);

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
        <div ref={introWrapRef} className="text-center max-w-[728px] mx-auto md:my-[13.5vh] md:mt-[13vh] my-[13vh] mb-[8vh]">
          <h2 className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] leading-[151%] text-black">
            {heading}
          </h2>
          <p className="font-outfit font-normal md:text-[18px] text-[16px] leading-[115%] text-black mt-[1.5vh]">
            {subheading}
          </p>
        </div>

        {/* DESKTOP rows */}
        <div ref={rowsWrapRef} onMouseLeave={() => setHoveredId(null)} className="relative hidden md:block">
          {stages.map((s, i) => {
            const isActive = hoveredId === s.title;
            return (
              <div key={i} ref={(el) => { rowOuterRefs.current[i] = el; }}>
                <div onMouseEnter={() => setHoveredId(s.title)} className="flex justify-between items-center relative py-[3.2vh] cursor-pointer">
                  <h4 className="p-title font-boldonse font-normal lg:text-[28px] md:text-[22px] leading-[151%] transition-colors duration-250" style={{ color: isActive ? BRAND_COLOR : "#000" }}>
                    {s.title}
                  </h4>
                  <div aria-hidden="true" className="invisible" style={{ marginLeft: CONTENT_LEFT, maxWidth: contentMaxWidth }}>
                    <h6 className="font-outfit font-normal lg:text-[24px] md:text-[20px] leading-[115%]">{s.heading}</h6>
                    <div className="grid transition-[grid-template-rows] duration-700 ease-out" style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}>
                      <div className="overflow-hidden">
                        <p className="font-outfit font-normal lg:text-[18px] md:text-[16px] leading-[150%] pt-[1.2vh]">{s.text}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-content-visible absolute" style={{ left: CONTENT_LEFT, maxWidth: contentMaxWidth }}>
                    <h6 className="font-outfit font-normal lg:text-[24px] md:text-[20px] leading-[115%] text-black">{s.heading}</h6>
                    <p ref={(el) => { textRefs.current[s.title] = el; }} className="font-outfit font-normal lg:text-[18px] md:text-[16px] leading-[150%] text-black/70 overflow-hidden" style={{ height: 0, opacity: 0, marginTop: 0 }}>
                      {s.text}
                    </p>
                  </div>
                  <h4 className="p-number font-boldonse font-normal lg:text-[28px] md:text-[22px] leading-[151%] text-black shrink-0 transition-all duration-250" style={{ opacity: isActive ? 0 : 1, transform: isActive ? "translateX(8px)" : "translateX(0)" }}>
                    {s.number}
                  </h4>
                </div>
                <div className="p-border border w-full transition-opacity duration-700" style={{ opacity: isActive ? 1 : 0.4 }} />
              </div>
            );
          })}
        </div>

        {/* MOBILE cards */}
        <div className="flex md:hidden flex-col pb-[6vh]">
          <div className="overflow-y-auto snap-y snap-mandatory" style={{ maxHeight: "80vh", scrollbarWidth: "none" }}>
            <div className="relative pl-10" style={{ msOverflowStyle: "none" }}>
              <div className="absolute left-4 top-0 bottom-0 w-[1px] pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, #c0c0c0 5%, #c0c0c0 95%, transparent 100%)" }} />
              {stages.map((s, i) => {
                const isExpanded = expandedMobileId === s.title;
                const isLast     = i === stages.length - 1;
                return (
                  <div key={i} ref={(el) => { mobileCardRefs.current[i] = el; }} className={`snap-start relative ${isLast ? "pb-2" : "mb-5"}`}>
                    <div className="absolute left-[-26px] top-[18px] w-[6px] h-[6px] rounded-full border transition-all duration-250" style={{ backgroundColor: isExpanded ? BRAND_COLOR : "#fff", borderColor: isExpanded ? BRAND_COLOR : "#c0c0c0", boxShadow: isExpanded ? `0 0 6px ${BRAND_COLOR}` : "none" }} />
                    <div onClick={() => setExpandedMobileId((prev) => prev === s.title ? null : s.title)} className="bg-white rounded-[16px] border border-black/8 active:bg-black/[0.02] transition-colors cursor-pointer">
                      <div className="flex items-start gap-3 p-4">
                        <span className="font-boldonse font-normal text-[18px] leading-none shrink-0 pt-0.5 transition-colors duration-250 w-8" style={{ color: isExpanded ? BRAND_COLOR : "rgba(0,0,0,0.25)" }}>{s.number}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-boldonse font-normal text-[17px] leading-[130%] transition-colors duration-250" style={{ color: isExpanded ? BRAND_COLOR : "#000" }}>{s.title}</h4>
                            <span className="shrink-0 w-6 h-6 rounded-full border border-black/15 flex items-center justify-center transition-transform duration-250" style={{ transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)" }}>
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="#000" strokeWidth="1.4" strokeLinecap="round" /></svg>
                            </span>
                          </div>
                          <h6 className="font-outfit font-normal text-[14px] leading-[130%] text-black/60 mt-1">{s.heading}</h6>
                          <div className="grid transition-[grid-template-rows] duration-250 ease-out" style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}>
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

      {/* ── Trust Strip ── */}
      <div
        ref={trustRef}
        className="mt-[6vh] relative xl:px-10 md:px-6 px-4 py-[5vh]"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f4f3fa 100%)",
          borderTop: "1px solid #E7E7EE",
          borderBottom: "1px solid #E7E7EE",
        }}
      >
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 relative">
            {trustSignals.map((signal, i) => (
              <div key={i} className="trust-item flex items-start gap-4 py-6 px-6 relative">

                {/* Vertical divider — desktop */}
                {i < trustSignals.length - 1 && (
                  <div
                    className="trust-divider hidden xl:block absolute right-0 top-[15%] w-[1px] h-[70%]"
                    style={{ backgroundColor: "#E7E7EE" }}
                  />
                )}
                {/* Horizontal divider — mobile/tablet */}
                {i < trustSignals.length - 1 && (
                  <div
                    className="trust-divider xl:hidden absolute bottom-0 left-6 right-6 h-[1px]"
                    style={{ backgroundColor: "#E7E7EE" }}
                  />
                )}

                <div
                  className="trust-icon shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                  style={{ color: BRAND_COLOR, background: "rgba(149,100,244,0.08)" }}
                >
                  {ICONS[signal.icon] ?? ICONS["shield-check"]}
                </div>
                <div>
                  <h4 className="trust-label font-boldonse text-[#0B0730] text-[14px] leading-[130%] mb-1">
                    {signal.label}
                  </h4>
                  <p className="trust-detail font-outfit text-[#8A84A6] text-[13px] leading-[155%]">
                    {signal.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;