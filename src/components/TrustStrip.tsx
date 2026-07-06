// components/TrustStrip.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_COLOR = "#9564F4";

const TRUST_SIGNALS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Replacement Guarantee",
    detail: "If it doesn't work out, we make it right.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Transparent Fees",
    detail: "No hidden costs. No surprises. Ever.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Values-Aligned Process",
    detail: "Every leader shares your core principles.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Founder-Led",
    detail: "You work directly with us — not a junior team.",
  },
];

const TrustStrip = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs   = useRef<HTMLDivElement[]>([]);
  const wrapRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(wrapRef.current, { opacity: 0, y: 16 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      }).to(wrapRef.current, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(() => requestAnimationFrame(refresh));
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 800);

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative xl:px-10 md:px-6 px-4 py-[5vh]"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f3fa 100%)",
        borderTop: "1px solid #E7E7EE",
        borderBottom: "1px solid #E7E7EE",
      }}
    >
      <div ref={wrapRef} className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0">
          {TRUST_SIGNALS.map((signal, i) => (
            <div
              key={i}
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
              className={`flex items-start gap-4 py-6 px-6 ${
                i < TRUST_SIGNALS.length - 1
                  ? "xl:border-r xl:border-b-0 border-b border-[#E7E7EE]"
                  : ""
              }`}
            >
              {/* Icon circle */}
              <div
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                style={{
                  color: BRAND_COLOR,
                  background: "rgba(149,100,244,0.08)",
                }}
              >
                {signal.icon}
              </div>

              {/* Text */}
              <div>
                <h4 className="font-boldonse text-[#0B0730] text-[14px] leading-[130%] mb-1">
                  {signal.label}
                </h4>
                <p className="font-outfit text-[#8A84A6] text-[13px] leading-[155%]">
                  {signal.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;