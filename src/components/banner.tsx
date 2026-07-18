"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const banner1Ref = useRef<HTMLImageElement>(null);
  const banner1MobRef = useRef<HTMLImageElement>(null);
  const scrollBgRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // ── Entrance — waits for loading-done event ───────────────────────────────
  useEffect(() => {
    gsap.set([headingRef.current, paraRef.current], { autoAlpha: 0, y: 40 });
    gsap.set([banner1Ref.current, banner1MobRef.current], {
      autoAlpha: 0,
      y: 60,
    });
    gsap.set(scrollBgRef.current, { autoAlpha: 0, scale: 0.92, y: 20 });

    const runEntrance = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline(); // no delay needed, header already done

        tl.to(headingRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 1.8,
          ease: "expo.out",
        })
          .to(
            paraRef.current,
            { autoAlpha: 1, y: 0, duration: 1.6, ease: "expo.out" },
            "-=0.9",
          )
          .to(
            [banner1Ref.current, banner1MobRef.current],
            { autoAlpha: 1, y: 0, duration: 2.2, ease: "expo.out" },
            "-=1.2",
          )
          .to(
            scrollBgRef.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.4,
              ease: "back.out(1.2)",
            },
            "-=0.8",
          )
          .call(() => {
            gsap.to(arrowRef.current, {
              y: 8,
              duration: 1.4,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            gsap.to(scrollBgRef.current, {
              scale: 1.04,
              duration: 3.0,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });
      });

      return () => ctx.revert();
    };

    window.addEventListener("header-done", runEntrance, { once: true });
    return () => window.removeEventListener("header-done", runEntrance);
  }, []);

  // ── Mouse-follow glow ─────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 1, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 1, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      quickX(e.clientX - r.left);
      quickY(e.clientY - r.top);
    };
    const handleEnter = () => gsap.to(glow, { opacity: 0.7, duration: 0.8 });
    const handleLeave = () => gsap.to(glow, { opacity: 0, duration: 0.8 });

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseenter", handleEnter);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseenter", handleEnter);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // ── Parallax ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to([banner1Ref.current, banner1MobRef.current], {
        x: nx * 22,
        y: ny * 12,
        duration: 2.2,
        ease: "power2.out",
      });
      gsap.to(headingRef.current, {
        x: nx * -5,
        y: ny * -3,
        duration: 2.8,
        ease: "power2.out",
      });
      gsap.to(paraRef.current, {
        x: nx * -3,
        y: ny * -2,
        duration: 2.8,
        ease: "power2.out",
      });
      gsap.to(scrollBgRef.current, {
        x: nx * 8,
        y: ny * 5,
        duration: 2.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(
        [
          banner1Ref.current,
          banner1MobRef.current,
          headingRef.current,
          paraRef.current,
          scrollBgRef.current,
        ],
        { x: 0, y: 0, duration: 2.0, ease: "power2.out" },
      );
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="2xl:min-h-[110vh] md:min-h-screen h-[80vh] bg-[url(/banner.webp)] bg-cover bg-center relative"
    >
      {/* <img src="/blur.webp" alt="blur" className="absolute w-full left-0 2xl:bottom-0 bottom-[-3%] 2xl:h-[50px] h-[200px] z-30" /> */}
      {/* <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-0 z-10"
        style={{
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(149,100,244,0.35) 0%, rgba(149,100,244,0) 70%)",
          filter: "blur(12px)",
        }}
      /> */}

      {/* Desktop image — lg and above */}
      <img
        ref={banner1Ref}
        src="/banner1.webp"
        alt="banner"
        style={{ opacity: 0 }}
        className="lg:absolute hidden lg:block 2xl:bottom-[-59.5vh] xl:bottom-[-50vh] lg:bottom-[-30vh] will-change-transform"
      />

      {/* Mobile/tablet image — below lg */}
      <img
        ref={banner1MobRef}
        src="/banner1-mob.webp"
        alt="banner"
        style={{ opacity: 0 }}
        className="absolute lg:hidden md:bottom-[-20vh] bottom-[-10vh] lg:h-auto md:h-[600px] h-[330px] will-change-transform"
      />

      <div
        ref={scrollBgRef}
        style={{ opacity: 0 }}
        className="bg-[url(/scroll-bg.webp)] bg-cover 2xl:w-[160px] 2xl:h-[113px] w-[130px] h-[100px] md:flex hidden flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 z-30 2xl:bottom-[5vh] bottom-0 will-change-transform"
      >
        <svg
          ref={arrowRef}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="43"
          viewBox="0 0 18 43"
          fill="none"
          className="2xl:mt-[5vh] mt-[2vh] 2xl:h-[43px] h-[30px]"
        >
          <path
            d="M8.66016 42.5L17.3204 27.5L-9.75728e-05 27.5L8.66016 42.5ZM10.1602 1.5C10.1602 0.671574 9.48859 3.62117e-08 8.66016 0C7.83173 -3.62117e-08 7.16016 0.671574 7.16016 1.5L8.66016 1.5L10.1602 1.5ZM8.66016 29L10.1602 29L10.1602 1.5L8.66016 1.5L7.16016 1.5L7.16016 29L8.66016 29Z"
            fill="#9564F4"
          />
        </svg>
      </div>

      <div className="2xl:pt-[17vh] xl:pt-[20vh] lg:pt-[22vh] pt-[25vh] relative z-30">
        <div className="text-center 2xl:max-w-[1050px] lg:max-w-[900px] max-w-[700px] mx-auto px-4">
          <h1
            ref={headingRef}
            style={{ opacity: 0 }}
            className="font-reddit font-light 2xl:text-[100px] lg:text-[80px] md:text-[60px] text-[40px] text-black leading-[101%] will-change-transform tracking-[-0.04em]"
          >
            Leadership changes
            <span className="font-tartuffo font-light text-[#9564F4] italic md:ml-[1vw] ml-[2vw] tracking-normal">
              everything
            </span>
          </h1>
          <p
            ref={paraRef}
            style={{ opacity: 0 }}
            className="font-outfit font-normal text-[15px] sm:text-[17px] md:text-[20px] lg:text-[22px] xl:text-[24px] leading-[115%] w-full max-w-[578px] mx-auto mt-[2.5vh] will-change-transform"
          >
            We partner with organisations and leaders to attract, assess and
            support exceptional leadership that creates lasting impact.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
