"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");

    gsap.set(paths[2], { scale: 0.25, opacity: 0, transformOrigin: "center center" });
    gsap.set([paths[0], paths[1]], { opacity: 0, scale: 1, transformOrigin: "center center" });

    const assembleTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 80%",
      },
    });

    assembleTl
      .fromTo(paths[2], { x: 30, y: -30, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
      .to(paths[2], { scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 0.8)
      .fromTo(paths[1], { x: 50, y: -50, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }, 1.8)
      .fromTo(paths[0], { x: 70, y: -70, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.7)" }, 3.2);

    return () => {
      assembleTl.kill();
    };
  }, []);

  return (
    <section className="bg-[url(/footer.webp)] bg-cover bg-[50%_100%] relative">
      <div className="absolute top-[11vh] left-1/2 -translate-x-1/2">
        <svg
          ref={svgRef}
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
          width="589"
          height="589"
          viewBox="0 0 589 589"
          fill="none"
        >
          <path
            d="M588.052 0H0L138.843 139.69C145.382 146.268 154.273 149.967 163.548 149.967H434.45V420.931C434.45 430.169 438.12 439.029 444.652 445.561L588.052 588.961V0Z"
            fill="#9564F4"
          ></path>
          <path
            d="M376.303 210.863H0.931641L141.194 351.126C147.408 357.34 155.835 360.83 164.623 360.83H225.428V423.453C225.428 432.24 228.918 440.668 235.132 446.881L376.303 588.053V210.863Z"
            fill="#9564F4"
          ></path>
          <path
            d="M166.327 588.054V421.727H0L166.327 588.054Z"
            fill="#9564F4"
          ></path>
        </svg>
      </div>
      <div className="flex justify-center items-center pt-[24vh] pb-[23.5vh] relative">
        <div className="bg-[url(/footers.png)] bg-cover bg-center w-[1083px] h-[344px] rounded-[20px]">
          <div className="max-w-[678px] mx-auto text-center mt-[7.5vh]">
            <h2 className="font-readex font-light text-[60px] leading-[114%] tracking-[-0.04em] capitalize text-white">
              Lead The{" "}
              <span className="tracking-[0em] italic font-tartuffo lowercase">
                way
              </span>
            </h2>
            <p className="font-outfit text-[24px] leading-[115%] text-[#F6F6F6] mt-[1.5vh]">
              10% of every retainer supports a cause our clients care about. We
              also make a matching donation to a charity chosen by their new
              leader, because good business should always leave the world better
              than it found it.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#9564F4] h-[80px] flex justify-center items-center">
        <p className="font-outfit text-[28px] leading-[115%] font-normal text-[#F6F6F6]">
          © Rezenate 2025. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;