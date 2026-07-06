// components/footer.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);

interface FooterData {
  heading?: string;
  bodyText?: string;
  copyrightText?: string;
  backgroundImage?: { asset: { _ref: string } };
}

const Footer = ({ data }: { data: FooterData }) => {
  const footerRef = useRef<HTMLElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  const heading = data?.heading ?? "Lead The Way.";
  const bodyText =
    data?.bodyText ??
    "10% of every retainer supports a cause our clients care about. We also make a matching donation to a charity chosen by their new leader, because good business should always leave the world better than it found it.";
  const copyright =
    data?.copyrightText ?? "© Rezenate 2026. All rights reserved.";
  const bgStyle = data?.backgroundImage
    ? { backgroundImage: `url(${urlFor(data.backgroundImage).url()})` }
    : {};

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.6,
      delay: 0.3,
    });

    tl.set(paths, { opacity: 0, y: 12 })
      .to(paths[2], { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(
        paths[1],
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.55",
      )
      .to(
        paths[0],
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.55",
      )
      .to(
        paths,
        { opacity: 0, y: -12, duration: 0.6, ease: "power2.in" },
        "+=0.8",
      );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(bgOverlayRef.current, { opacity: 0.6 });
      gsap.set(headingRef.current, { opacity: 0, y: 20, filter: "blur(6px)" });
      gsap.set(paraRef.current, { opacity: 0, y: 16 });
      gsap.set(copyrightRef.current, { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });
      tl.to(bgOverlayRef.current, {
        opacity: 0,
        duration: 2.2,
        ease: "power2.out",
      })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power2.out",
          },
          "-=1.6",
        )
        .to(
          paraRef.current,
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.7",
        )
        .to(
          copyrightRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.5",
        );
    }, footerRef);

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
    <footer
      ref={footerRef}
      id="footer"
      className="bg-[url(/footers.webp)] bg-cover bg-center min-h-screen text-white pt-[11vh] relative overflow-hidden"
      style={bgStyle}
    >
      <div
        ref={bgOverlayRef}
        className="absolute inset-0 bg-black pointer-events-none z-10"
      />

      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="144"
        height="145"
        viewBox="0 0 144 145"
        fill="none"
        className="absolute md:top-[41.5vh] top-[48vh] left-1/2 -translate-x-1/2 z-20 [&_path]:opacity-0 md:w-[145px] md:h-[145px] w-[100px] h-[100px]"
      >
        <path
          d="M143.934 0H0L24.4609 24.6053C32.1567 32.3465 42.6217 36.6994 53.5374 36.6994H106.337V89.5543C106.337 100.43 110.658 110.859 118.349 118.548L143.934 144.128V0Z"
          fill="white"
        />
        <path
          d="M92.099 51.6011H0.22168L25.5057 76.8803C32.8194 84.1926 42.7381 88.3004 53.0802 88.3004H55.1701V90.8272C55.1701 101.172 59.28 111.093 66.5956 118.407L92.099 143.906V51.6011Z"
          fill="white"
        />
        <path d="M40.7108 143.906V103.203H0L40.7108 143.906Z" fill="white" />
      </svg>

      <div className="text-center relative z-20 lg:px-0 px-4 md:px-6">
        <h2
          ref={headingRef}
          className="font-boldonse font-normal 2xl:text-[34px] xl:text-[32px] md:text-[28px] text-[24px] leading-[151%] text-[#F6F6F6]"
        >
          {heading}
        </h2>
        <p
          ref={paraRef}
          className="font-outfit 2xl:text-[24px] xl:text-[22px] text-[20px] text-[#F6F6F6] leading-[115%] 2xl:max-w-[1036px] xl:max-w-[960px] max-w-[870px] mx-auto mt-[2vh]"
        >
          {bodyText}
        </p>
      </div>

      <div
        ref={copyrightRef}
        className="text-center absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <h5 className="font-outfit font-normal text-[#F6F6F6] 2xl:text-[28px] lg:text-[24px] md:text-[22px] text-[18px] leading-[115%]">
          {copyright}
        </h5>
      </div>
    </footer>
  );
};

export default Footer;
