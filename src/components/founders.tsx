// Founders.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Founders = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  const card1WrapRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const photo1Ref = useRef<HTMLImageElement>(null);

  const card2WrapRef = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLImageElement>(null);

  // Slow ambient ring rotation — Z-axis only, no 3D flip
  useEffect(() => {
    if (!ringRef.current) return;

    const spin = gsap.to(ringRef.current, {
      rotate: 360,       // plain 2D rotation — was rotateY (3D flip, very distracting)
      duration: 60,      // very slow — one full rotation per minute
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });

    return () => {spin.kill()};
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Starting states — much more restrained than before
      gsap.set(bgRef.current, { opacity: 0, scale: 1.06, x: 20 }); // reduced from scale:1.15, x:40
      gsap.set(ringRef.current, { opacity: 0, scale: 0.88 }); // reduced from 0.7
      gsap.set(headingRef.current, {
        opacity: 0,
        y: 24,           // reduced from 40
        filter: "blur(6px)", // reduced from 10px
      });
      gsap.set(subRef.current, { opacity: 0, y: 14 }); // reduced from 20

      // Cards — much calmer starting position
      gsap.set(card1WrapRef.current, { opacity: 0 });
      gsap.set(card1Ref.current, {
        x: -60,          // reduced from -160
        y: 30,           // reduced from 80
        rotateY: 10,     // reduced from 55 — subtle tilt instead of dramatic flip
        rotateX: 0,      // removed
        rotate: -2,      // reduced from -8
        scale: 0.96,     // reduced from 0.85
      });

      gsap.set(card2WrapRef.current, { opacity: 0 });
      gsap.set(card2Ref.current, {
        x: 60,           // reduced from 160
        y: 30,           // reduced from 80
        rotateY: -10,    // reduced from -55
        rotateX: 0,      // removed
        rotate: 2,       // reduced from 8
        scale: 0.96,     // reduced from 0.85
      });

      // Photos — simple fade in, no bounce, no rotation
      gsap.set([photo1Ref.current, photo2Ref.current], {
        opacity: 0,
        scale: 0.85,     // was scale:0, rotate:-30
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      tl
        // Background settles in
        .to(bgRef.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 2.0,   // slowed from 1.6
          ease: "power2.out", // gentler than power3
        })

        // Ring fades in with background
        .to(
          ringRef.current,
          { opacity: 0.7, scale: 1, duration: 1.8, ease: "power2.out" },
          "<0.1"
        )

        // Heading fades up — no letterSpacing animation (too stylized)
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,   // slowed from 0.9
            ease: "power2.out",
          },
          "-=1.4"
        )

        // Subheading follows
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, // slowed from 0.7
          "-=0.7"
        )

        // Both card wrappers become visible
        .to(card1WrapRef.current, { opacity: 1, duration: 0.05 }, "-=0.3")
        .to(card2WrapRef.current, { opacity: 1, duration: 0.05 }, "<")

        // Cards slide and settle — power2.out instead of power4.out (no sudden stop)
        .to(
          card1Ref.current,
          {
            x: 0,
            y: 0,
            rotateY: 12,
            rotateX: 0,
            rotate: 0,
            scale: 1,
            duration: 1.6,   // slowed from 1.3
            ease: "power2.out",
          },
          "<"
        )
        .to(
          card2Ref.current,
          {
            x: 0,
            y: 0,
            rotateY: -12,
            rotateX: 0,
            rotate: 0,
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          "<0.1"
        )

        // Photos fade in cleanly — no bounce, no rotation
        .to(
          photo1Ref.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.0,   // slowed from 0.7
            ease: "power2.out", // removed back.out(2.2) bounce
          },
          "-=0.9"
        )
        .to(
          photo2Ref.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.0,
            ease: "power2.out",
          },
          "<0.15"
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
  }, []);

  return (
    <section id="founders" ref={sectionRef} className="bg-black min-h-[93vh] md:mt-[16.5vh] mt-[10vh] relative overflow-hidden px-4">
      <img
        ref={bgRef}
        src="/founder-bg.webp"
        alt="bg"
        className="absolute top-0 right-0 z-10 h-full"
      />
      <img
        ref={ringRef}
        src="/founder-ring.webp"
        alt="bg"
        className="absolute lg:top-0 top-1/7 right-0 2xl:w-auto w-[800px]"
      />
      <img src="/founder-blur.webp" alt="blur" className="absolute bottom-[-25vh] w-full left-0 z-30" />

      <div className="md:pt-[16.8vh] pt-[10vh] relative z-20">
        <div className="text-center">
          <h2
            ref={headingRef}
            className="font-boldonse font-normal 2xl:text-[48px] xl:text-[42px] md:text-[36px] text-[30px] leading-[150%] text-white"
          >
            THE FOUNDERS
          </h2>
          <p
            ref={subRef}
            className="font-outfit font-normal leading-[115%] text-white md:text-[18px] text-[14px] mt-[2vh]"
          >
            Rezenate is founder-led. We believe that leadership can be both
            strong and kind.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between justify-center items-center max-w-[1400px] mx-auto xl:px-10 md:px-6 px-4 mt-[5vh] pb-[10vh] lg:pb-0 lg:gap-0 gap-15">
          <div ref={card1WrapRef} style={{ perspective: "1200px" }}>
            <div
              ref={card1Ref}
              className="2xl:w-[638px] 2xl:h-[367px] xl:w-[600px] xl:h-[320px] lg:w-[470px] w-full h-[320px] xl:px-0 px-6 border-box rounded-[36px] pt-[5.5vh] relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="text-center text-white flex flex-col justify-center items-center max-w-[503px] mx-auto">
                <p className="font-outfit font-normal 2xl:text-[18px] text-[16px] leading-[115%]">
                  Zak brings clarity to who companies are, what they stand for,
                  and who should lead them next.
                </p>
                <h5 className="font-outfit font-normal 2xl:text-[24px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                  "Leadership begins with honesty and not hierarchy."
                </h5>
                <h3 className="font-boldonse font-normal 2xl:text-[28px] md:text-[24px] text-[18px] leading-[151%] mt-[2.5vh]">
                  Zak — The Alchemist
                </h3>
                <h6 className="font-outfit font-normal 2xl:text-[22px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                  Shapes vision and voice.
                </h6>
              </div>
              <img
                ref={photo1Ref}
                src="/founder1.webp"
                alt="founder"
                className="2xl:w-[111px] 2xl:h-[111px] md:w-[100px] md:h-[100px] w-[80px] h-[80px] rounded-full absolute bottom-[-5.5vh] left-1/2 -translate-x-1/2"
              />
            </div>
          </div>

          <div ref={card2WrapRef} style={{ perspective: "1200px" }}>
            <div
              ref={card2Ref}
              className="2xl:w-[638px] 2xl:h-[367px] xl:w-[600px] xl:h-[320px] lg:w-[470px] w-full h-[320px] xl:px-0 px-6 bg-white rounded-[36px] pt-[5.5vh] relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="text-center text-black flex flex-col justify-center items-center max-w-[503px] mx-auto">
                <p className="font-outfit font-normal 2xl:text-[18px] text-[16px] leading-[115%]">
                  Chloe brings structure, psychology, and emotional
                  intelligence to every engagement, ensuring great
                  partnerships are built to last.
                </p>
                <h5 className="font-outfit font-normal 2xl:text-[24px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                  "We built Rezenate to make leadership feel human again."
                </h5>
                <h3 className="font-boldonse font-normal 2xl:text-[28px] md:text-[24px] text-[18px] leading-[151%] mt-[2.5vh]">
                  Chloe — The Architect
                </h3>
                <h6 className="font-outfit font-normal 2xl:text-[22px] md:text-[20px] text-[18px] leading-[115%] mt-[1vh]">
                  Keeps everything moving with care and clarity
                </h6>
              </div>
              <img
                ref={photo2Ref}
                src="/founder2.webp"
                alt="founder"
                className="2xl:w-[111px] 2xl:h-[111px] md:w-[100px] md:h-[100px] w-[80px] h-[80px] rounded-full absolute bottom-[-5.5vh] left-1/2 -translate-x-1/2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founders;