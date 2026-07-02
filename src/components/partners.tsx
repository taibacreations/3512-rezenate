// Partners.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";
const CONTENT_LEFT = "27%";

const getContentMaxWidth = () => {
  if (typeof window === "undefined") return "607px";
  return window.innerWidth < 768 ? "200px" : "607px";
};

const stages = [
  {
    id: "attract",
    number: "01",
    title: "Attract",
    heading: "We make your story magnetic.",
    text: "We extend the reach of exceptional leadership. After your new leader joins, new opportunities for influence, contribution, and meaningful impact continue to emerge. Through shared experiences, carefully curated introductions, and initiatives designed to give something back, aligned leaders and founders become part of something larger than the original search itself. We don't believe our work ends once the right leader is found. In many ways, that's where the real impact begins.",
    image: "/partner1.webp",
  },
  {
    id: "assess",
    number: "02",
    title: "Assess",
    heading: "We reveal leadership truth",
    text: "We go beyond the resume — structured interviews, reference deep-dives, and behavioural insight surface how a leader actually operates under pressure, not just how they present in a room.",
    image: "/partner1.webp",
  },
  {
    id: "align",
    number: "03",
    title: "Align",
    heading: "We create mutual clarity before commitment",
    text: "Before any offer is made, we make sure founder and leader are aligned on vision, pace, and what success actually looks like — so commitment starts from clarity, not assumption.",
    image: "/partner1.webp",
  },
  {
    id: "anchor",
    number: "04",
    title: "Anchor",
    heading: "We enable new leaders to land and lead.",
    text: "The first 100 days shape everything that follows. We support onboarding, stakeholder mapping, and early wins so new leaders land with confidence and lead with credibility from day one.",
    image: "/partner1.webp",
  },
  {
    id: "ascend",
    number: "05",
    title: "Ascend",
    heading: "We extend the reach of exceptional leadership.",
    text: "Our work doesn't end once the right leader is found. Through curated introductions and shared experiences, aligned leaders and founders become part of something larger than the original search itself.",
    image: "/partner1.webp",
  },
];

const Partners = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [contentMaxWidth, setContentMaxWidth] = useState("607px");
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const rowsWrapRef = useRef<HTMLDivElement>(null);
  const rowOuterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const floatImgRef = useRef<HTMLImageElement>(null);

  const textRefs = useRef<Record<string, HTMLParagraphElement | null>>({});

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const prevX = useRef(0);
  const currentRotation = useRef(0);
  const isHoveringRef = useRef(false);
  const rafRunning = useRef(false);

  useEffect(() => {
    setMounted(true);
    setContentMaxWidth(getContentMaxWidth());
    const handleResize = () => setContentMaxWidth(getContentMaxWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop entrance — slowed, less overlap between rows
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = rowOuterRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(introWrapRef.current, { opacity: 0, y: 20, filter: "blur(6px)" });
      rows.forEach((row) => {
        const titleEl = row.querySelector(".p-title");
        const contentEl = row.querySelector(".p-content-visible");
        const numberEl = row.querySelector(".p-number");
        const borderEl = row.querySelector(".p-border");

        gsap.set(row, { opacity: 0, y: 30 }); // reduced from y:50
        gsap.set(titleEl, { opacity: 0, x: -12 }); // reduced from x:-20
        gsap.set(contentEl, { opacity: 0, y: 10 }); // reduced from y:14
        gsap.set(numberEl, { opacity: 0, x: 12 }); // reduced from x:20
        gsap.set(borderEl, { scaleX: 0, transformOrigin: "left center" });
      });

      let introPlayed = false;
      const playIntro = () => {
        if (introPlayed) return;
        introPlayed = true;
        gsap.to(introWrapRef.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2, // slowed from 0.9
          ease: "power2.out", // gentler than power3
        });
      };

      if (introWrapRef.current) {
        const introObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              playIntro();
              introObserver.disconnect();
            }
          },
          { threshold: 0.1 }
        );
        introObserver.observe(introWrapRef.current);
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
          const titleEl = row.querySelector(".p-title");
          const contentEl = row.querySelector(".p-content-visible");
          const numberEl = row.querySelector(".p-number");
          const borderEl = row.querySelector(".p-border");

          tl.to(
            row,
            { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, // slowed from 0.7/power3
            i === 0 ? 0 : "-=0.65" // less overlap — was -=0.55
          )
            .to(titleEl, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "<") // slowed from 0.55
            .to(contentEl, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "<0.1")
            .to(numberEl, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "<0.06")
            .to(borderEl, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.4"); // slowed from 0.6/power3
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

  // Mobile entrance
  useEffect(() => {
    const cards = mobileCardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const mm = gsap.matchMedia();
    let triggers: ScrollTrigger[] = [];

    mm.add("(max-width: 767px)", () => {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 24 }); // reduced from y:40

        const st = ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.85, // slowed from 0.65
              ease: "power2.out", // gentler than power3
            });
          },
          once: true,
        });

        triggers.push(st);
      });

      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  // Magnetic panel tracking loop
  const runLoop = () => {
    if (!isHoveringRef.current) {
      rafRunning.current = false;
      return;
    }

    const ease = 0.12; // slightly reduced from 0.18 — follows cursor more lazily
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

    const deltaX = targetPos.current.x - prevX.current;
    prevX.current = targetPos.current.x;
    const targetRotation = gsap.utils.clamp(-8, 8, deltaX * 0.4); // reduced from ±14, 0.6
    currentRotation.current += (targetRotation - currentRotation.current) * 0.15; // reduced from 0.2

    if (floatRef.current) {
      floatRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%) rotate(${currentRotation.current}deg)`;
    }

    requestAnimationFrame(runLoop);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (isHoveringRef.current && !rafRunning.current) {
        rafRunning.current = true;
        requestAnimationFrame(runLoop);
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleEnter = (id: string, image: string, e: React.MouseEvent) => {
    setHoveredId(id);
    isHoveringRef.current = true;
    if (floatImgRef.current) floatImgRef.current.src = image;

    currentPos.current = { x: e.clientX, y: e.clientY };
    targetPos.current = { x: e.clientX, y: e.clientY };
    prevX.current = e.clientX;
    currentRotation.current = 0;

    if (floatRef.current) {
      floatRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) rotate(0deg)`;
    }

    if (!rafRunning.current) {
      rafRunning.current = true;
      requestAnimationFrame(runLoop);
    }

    gsap.killTweensOf(floatRef.current, "opacity,scale");
    gsap.to(floatRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.7, // slowed from 0.55
      ease: "power2.out", // removed back.out bounce
    });
  };

  const handleLeave = () => {
    setHoveredId(null);
    isHoveringRef.current = false;

    gsap.killTweensOf(floatRef.current, "opacity,scale");
    gsap.to(floatRef.current, {
      opacity: 0,
      scale: 0.85, // less dramatic collapse — was 0.6
      duration: 0.5, // slowed from 0.35
      ease: "power2.in",
    });
  };

  useEffect(() => {
    const forceHide = () => {
      setHoveredId(null);
      isHoveringRef.current = false;
      gsap.killTweensOf(floatRef.current, "opacity,scale");
      gsap.set(floatRef.current, { opacity: 0, scale: 0.85 });
    };

    const handleDocMouseLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) forceHide();
    };

    document.addEventListener("mouseleave", handleDocMouseLeave);
    window.addEventListener("blur", forceHide);

    return () => {
      document.removeEventListener("mouseleave", handleDocMouseLeave);
      window.removeEventListener("blur", forceHide);
    };
  }, []);

  // Hover text expand/collapse — slowed
  useEffect(() => {
    stages.forEach((s) => {
      const el = textRefs.current[s.id];
      if (!el) return;

      gsap.killTweensOf(el);

      if (hoveredId === s.id) {
        gsap.to(el, {
          height: "auto",
          opacity: 1,
          marginTop: "1.2vh",
          duration: 0.7, // slowed from 0.55
          ease: "power2.out",
        });
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          marginTop: 0,
          duration: 0.55, // slowed from 0.4
          ease: "power2.inOut",
        });
      }
    });
  }, [hoveredId]);

  const floatingPanel = (
    <div
      ref={floatRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] w-[240px] h-[240px] rounded-[16px] overflow-hidden opacity-0"
      style={{
        // softened shadow — less purple, more neutral
        boxShadow:
          "0 20px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(149,100,244,0.1)",
        willChange: "transform",
      }}
    >
      <img ref={floatImgRef} alt="" className="w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <span className="absolute bottom-4 left-4 text-white font-outfit text-[12px] uppercase tracking-widest opacity-80">
        {hoveredId ? stages.find((s) => s.id === hoveredId)?.title : ""}
      </span>
    </div>
  );

  return (
    <section id="how-we-partner" ref={sectionRef}>
      <div className="max-w-[1420px] mx-auto xl:px-10 md:px-6 px-4">
        <div
          ref={introWrapRef}
          className="text-center max-w-[728px] mx-auto md:my-[13.5vh] mt-[13vh] mb-[8vh]"
        >
          <h2 className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] leading-[151%] text-black">
            HOW WE PARTNER
          </h2>
          <p className="font-outfit font-normal md:text-[18px] text-[16px] leading-[115%] text-black mt-[1.5vh]">
            We partner with founders and boards to introduce leaders who
            strengthen culture and build momentum without losing what makes
            the company human. Every engagement moves through five deliberate
            stages
          </p>
        </div>

        {/* DESKTOP */}
        <div
          ref={containerRef}
          onMouseLeave={handleLeave}
          className="relative hidden md:block"
        >
          {mounted && createPortal(floatingPanel, document.body)}

          <div ref={rowsWrapRef}>
            {stages.map((s, i) => {
              const isActive = hoveredId === s.id;

              return (
                <div
                  key={s.id}
                  ref={(el) => { rowOuterRefs.current[i] = el; }}
                >
                  <div
                    onMouseEnter={(e) => handleEnter(s.id, s.image, e)}
                    className="flex justify-between items-center relative py-[3.2vh] cursor-pointer transition-transform duration-500" // slowed from 300
                    style={{
                      transform: isActive ? "translateX(6px)" : "translateX(0)", // reduced from 8px
                    }}
                  >
                    <h4
                      className="p-title font-boldonse font-normal lg:text-[28px] md:text-[22px] leading-[151%] transition-colors duration-500" // slowed from 300
                      style={{ color: isActive ? BRAND_COLOR : "#000" }}
                    >
                      {s.title}
                    </h4>

                    <div
                      aria-hidden="true"
                      className="invisible"
                      style={{ marginLeft: CONTENT_LEFT, maxWidth: contentMaxWidth }}
                    >
                      <h6 className="font-outfit font-normal lg:text-[24px] md:text-[20px] leading-[115%]">
                        {s.heading}
                      </h6>
                      <div
                        className="grid transition-[grid-template-rows] duration-700 ease-out" // slowed from 500
                        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="font-outfit font-normal lg:text-[18px] md:text-[16px] leading-[150%] pt-[1.2vh]">
                            {s.text}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-content-visible absolute"
                      style={{ left: CONTENT_LEFT, maxWidth: contentMaxWidth }}
                    >
                      <h6 className="font-outfit font-normal lg:text-[24px] md:text-[20px] leading-[115%] text-black">
                        {s.heading}
                      </h6>
                      <p
                        ref={(el) => { textRefs.current[s.id] = el; }}
                        className="font-outfit font-normal lg:text-[18px] md:text-[16px] leading-[150%] text-black/70 overflow-hidden"
                        style={{ height: 0, opacity: 0, marginTop: 0 }}
                      >
                        {s.text}
                      </p>
                    </div>

                    <h4
                      className="p-number font-boldonse font-normal lg:text-[28px] md:text-[22px] leading-[151%] text-black shrink-0 transition-all duration-500" // slowed from 300
                      style={{
                        opacity: isActive ? 0 : 1,
                        transform: isActive ? "translateX(8px)" : "translateX(0)",
                      }}
                    >
                      {s.number}
                    </h4>
                  </div>

                  <div
                    className="p-border border w-full transition-opacity duration-700" // slowed from 300
                    style={{ opacity: isActive ? 1 : 0.4 }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden flex-col gap-4 pb-[6vh]">
          {stages.map((s, i) => {
            const isExpanded = expandedMobileId === s.id;

            return (
              <div
                key={s.id}
                ref={(el) => { mobileCardRefs.current[i] = el; }}
                onClick={() =>
                  setExpandedMobileId((prev) => (prev === s.id ? null : s.id))
                }
                className="rounded-[20px] border border-black/10 bg-white active:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-start gap-4 p-5">
                  <span
                    className="font-boldonse font-normal text-[22px] leading-none shrink-0 pt-0.5 transition-colors duration-500"
                    style={{ color: isExpanded ? BRAND_COLOR : "rgba(0,0,0,0.3)" }}
                  >
                    {s.number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h4
                        className="font-boldonse font-normal text-[19px] leading-[130%] transition-colors duration-500"
                        style={{ color: isExpanded ? BRAND_COLOR : "#000" }}
                      >
                        {s.title}
                      </h4>

                      <span
                        className="shrink-0 w-7 h-7 rounded-full border border-black/15 flex items-center justify-center transition-transform duration-500"
                        style={{
                          transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M6 1V11M1 6H11"
                            stroke="#000"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <h6 className="font-outfit font-normal text-[15px] leading-[130%] text-black mt-[0.6vh]">
                      {s.heading}
                    </h6>

                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-out"
                      style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="font-outfit font-normal text-[14px] leading-[150%] text-black/65 pt-[1.4vh]">
                          {s.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;