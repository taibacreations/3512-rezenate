"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { urlFor } from "../../sanity/lib/image";

interface Props {
  logoImage?: { asset: { _ref: string } }; // from Sanity siteSettings
  isDark?: boolean; // true = dark section (white logo), false = light section (purple icon + black wordmark)
}

const Logo = ({ logoImage, isDark = true }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Entrance animation — runs once, only handles opacity/position.
  // Color is handled separately below so it can update live as the
  // header's theme changes without re-triggering the entrance.
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");
    gsap.set(paths, { opacity: 0, y: 10 });
    const tl = gsap.timeline({ delay: 1.0 });
    tl.to(paths[2], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
      .to(paths[1], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .to(paths[0], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4");
    return () => { tl.kill(); };
  }, []);

  // Smoothly animate the icon's fill color whenever the theme flips,
  // instead of snapping instantly.
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");
    gsap.to(paths, {
      fill: isDark ? "#FFFFFF" : "#9564F4",
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isDark]);

  const wordmarkSrc = logoImage ? urlFor(logoImage).width(480).url() : "/logo.webp";

  return (
    <section>
      <Link href="#home" className="flex flex-col justify-center items-center gap-1.5">
        <div>
          <svg
            ref={svgRef}
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            width="51"
            height="51"
            viewBox="0 0 51 51"
            fill="none"
            className="w-[34px] h-[34px]"
          >
            <path
              d="M50.1239 1.90735e-06H0L2.49058 2.50577C9.0288 9.08386 17.9205 12.7828 27.1952 12.7828H37.0313V22.6809C37.0313 31.9189 40.701 40.7785 47.2333 47.3107L50.1239 50.2014V1.90735e-06Z"
              fill="#9564F4"
            />
            <path
              d="M32.0737 17.9733H0.078125L8.36888 26.2641C11.2451 29.1403 15.146 30.7561 19.2135 30.7561C19.2135 34.9228 20.8687 38.9189 23.8151 41.8652L32.0737 50.1239V17.9733Z"
              fill="#9564F4"
            />
            <path
              d="M14.1772 50.1239V35.9467H0L14.1772 50.1239Z"
              fill="#9564F4"
            />
          </svg>
        </div>
        <div>
          <img
            src="/logo.webp"
            alt="Rezenate"
            className="w-[58px] transition-[filter] duration-250"
          />
        </div>
      </Link>
    </section>
  );
};

export default Logo;