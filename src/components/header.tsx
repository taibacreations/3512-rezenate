// Header.tsx — Sanity CMS powered (no cache)
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { HeaderData } from "@/sanity/lib/queries";

// ── Fallback content ───────────────────────────────────────────────────────
const FALLBACK = {
  logoMark: "#9564F4",
  wordmarkImage: { asset: { url: "/logo.webp" } },
  wordmarkAlt: "Rezenate",
  navLinks: [
    { label: "Philosophy", href: "#philosophy" },
    { label: "How We Partner", href: "#how-we-partner" },
    { label: "Founders", href: "#founders" },
    { label: "Contact", href: "#contact" },
  ],
  ctaLabel: "Contact us",
  ctaHref: "#contact",
};

// ── Scroll offset helper ───────────────────────────────────────────────────
const scrollToSection = (href: string) => {
  if (!href.startsWith("#")) {
    window.location.href = href;
    return;
  }

  const id = href.slice(1);
  const el = document.getElementById(id);
  if (!el) return;

  const headerHeight = document.querySelector("header")?.offsetHeight ?? 80;
  const EXTRA_OFFSET = 32;
  const top =
    el.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    EXTRA_OFFSET;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(top, {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
};

interface HeaderProps {
  data?: HeaderData | null;
}

const Header = ({ data }: HeaderProps) => {
  const logoColor = data?.logoMark ?? FALLBACK.logoMark;
  const wordmarkUrl =
    data?.wordmarkImage?.asset?.url ?? FALLBACK.wordmarkImage.asset!.url!;
  const wordmarkAlt = data?.wordmarkAlt ?? FALLBACK.wordmarkAlt;
  const rawNavLinks = (
    data?.navLinks?.length ? data.navLinks : FALLBACK.navLinks
  ).filter((l) => l.label.toLowerCase() !== "home");
  const ctaLabel = data?.ctaLabel ?? FALLBACK.ctaLabel;
  const ctaHref = data?.ctaHref ?? FALLBACK.ctaHref;

  const ALL_NAV = [{ label: "Home", href: "#home" }, ...rawNavLinks];

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  const headerRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLAnchorElement[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const bar1Ref = useRef<HTMLSpanElement>(null);
  const bar2Ref = useRef<HTMLSpanElement>(null);
  const bar3Ref = useRef<HTMLSpanElement>(null);

  // ── Entrance ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const svg = svgRef.current;
    const wordmark = wordmarkRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll("path");

    gsap.set(paths, { opacity: 0, y: 10 });
    gsap.set([wordmark, ctaRef.current, hamburgerRef.current], {
      autoAlpha: 0,
    });

    const runEntrance = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to(paths[2], {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        })
          .to(
            paths[1],
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
            "-=0.35",
          )
          .to(
            paths[0],
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
            "-=0.35",
          )
          .to(
            wordmark,
            { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
            "-=0.2",
          )
          .call(
            () => {
              window.dispatchEvent(new Event("header-done"));
            },
            [],
            "-=0.1",
          )
          .fromTo(
            ctaRef.current,
            { autoAlpha: 0, scale: 0.93 },
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" },
            "<",
          )
          .to(
            hamburgerRef.current,
            { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
            "<",
          )
          .call(() => {
            gsap.set(paths[2], {
              scale: 0.25,
              opacity: 0,
              transformOrigin: "center center",
            });
            gsap.set([paths[0], paths[1]], {
              opacity: 0,
              scale: 1,
              transformOrigin: "center center",
            });
            const assembleTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
            assembleTl
              .fromTo(
                paths[2],
                { x: 30, y: -30, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                0,
              )
              .to(
                paths[2],
                { scale: 1, duration: 0.6, ease: "back.out(1.7)" },
                0.8,
              )
              .fromTo(
                paths[1],
                { x: 50, y: -50, opacity: 0 },
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "back.out(1.7)",
                },
                1.8,
              )
              .fromTo(
                paths[0],
                { x: 70, y: -70, opacity: 0 },
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "back.out(1.7)",
                },
                3.2,
              );
          });
      });
      return () => ctx.revert();
    };

    window.addEventListener("loading-done", runEntrance, { once: true });
    return () => window.removeEventListener("loading-done", runEntrance);
  }, []);

  // ── Nav menu animations ────────────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const menu = navMenuRef.current;
    const links = navLinksRef.current.filter(Boolean);
    const closeBtn = closeBtnRef.current;
    if (!overlay || !menu) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();

      const tl = gsap.timeline();
      tl.to(overlay, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      tl.to(menu, { x: 0, duration: 0.6, ease: "expo.out" }, "-=0.3");
      tl.fromTo(
        closeBtn,
        { opacity: 0, rotate: -90 },
        { opacity: 1, rotate: 0, duration: 0.4, ease: "power2.out" },
        "-=0.3",
      );
      tl.fromTo(
        links,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05,
        },
        "-=0.3",
      );

      // Hamburger → X
      gsap.to(bar1Ref.current, {
        rotation: 45,
        y: 7,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(bar2Ref.current, {
        autoAlpha: 0,
        duration: 0.15,
        ease: "power2.in",
      });
      gsap.to(bar3Ref.current, {
        rotation: -45,
        y: -7,
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      document.body.style.overflow = "";
      lenis?.start();

      const tl = gsap.timeline();
      tl.to(links, {
        opacity: 0,
        x: 10,
        duration: 0.2,
        ease: "power2.in",
        stagger: 0.02,
      });
      tl.to(
        closeBtn,
        { opacity: 0, rotate: 90, duration: 0.2, ease: "power2.in" },
        "<",
      );
      tl.to(menu, { x: "100%", duration: 0.45, ease: "expo.in" }, "-=0.1");
      tl.to(overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "-=0.3");

      gsap.to(bar1Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(bar2Ref.current, {
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.to(bar3Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [menuOpen]);

  // ── Outside click ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        menuOpen &&
        navMenuRef.current &&
        !navMenuRef.current.contains(e.target as Node)
      )
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  // ── Scroll spy ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const ids = ALL_NAV.map((l) => l.href.slice(1)).filter(Boolean);
    const sectionEls = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          const matched = ALL_NAV.find((l) => l.href === `#${id}`);
          if (matched) setActiveLink(matched.label);
        }
      },
      {
        threshold: 0.4,
        rootMargin: "-80px 0px -20% 0px",
      },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavClick = (e: React.MouseEvent, label: string, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  };

  const handleLinkClick = (e: React.MouseEvent, label: string, href: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis?.start();
    setMenuOpen(false);
    handleNavClick(e, label, href);
  };

  return (
    <>
      <header
        ref={headerRef}
        style={{ paddingTop: "16px", paddingBottom: "16px" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="flex items-center justify-between max-w-[1480px] mx-auto xl:px-10 md:px-6 px-4">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "Home", "#home")}
            className="flex flex-col justify-center items-center gap-1.5"
          >
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="51"
              viewBox="0 0 51 51"
              fill="none"
              className="w-[28px] h-[28px] md:w-[34px] md:h-[34px]"
            >
              <path
                d="M50.1239 1.90735e-06H0L2.49058 2.50577C9.0288 9.08386 17.9205 12.7828 27.1952 12.7828H37.0313V22.6809C37.0313 31.9189 40.701 40.7785 47.2333 47.3107L50.1239 50.2014V1.90735e-06Z"
                fill={logoColor}
              />
              <path
                d="M32.0737 17.9733H0.078125L8.36888 26.2641C11.2451 29.1403 15.146 30.7561 19.2135 30.7561C19.2135 34.9228 20.8687 38.9189 23.8151 41.8652L32.0737 50.1239V17.9733Z"
                fill={logoColor}
              />
              <path
                d="M14.1772 50.1239V35.9467H0L14.1772 50.1239Z"
                fill={logoColor}
              />
            </svg>
            <img
              ref={wordmarkRef}
              src={wordmarkUrl}
              alt={wordmarkAlt}
              style={{ visibility: "visible", opacity: 0 }}
              className="w-[120px] md:w-[158px]"
            />
          </a>

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ opacity: 0 }}
            className="flex flex-col justify-center items-center w-11 h-11 gap-[5px] relative z-[60]"
            aria-label="Toggle menu"
          >
            <span
              ref={bar1Ref}
              className="block w-6 h-[2px] bg-black rounded-full origin-center"
            />
            <span
              ref={bar2Ref}
              className="block w-6 h-[2px] bg-black rounded-full"
            />
            <span
              ref={bar3Ref}
              className="block w-6 h-[2px] bg-black rounded-full origin-center"
            />
          </button>
        </div>
      </header>

      {/* Overlay — frosted purple blur */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] bg-[#9564F4]/25 pointer-events-none"
        style={{ visibility: "hidden", opacity: 0 }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Side panel (Desktop) / Full-width (Mobile) ────────────────────── */}
      <div
        ref={navMenuRef}
        className="fixed top-0 right-0 z-[56] h-full md:w-[380px] md:max-w-full max-w-[280px] w-[75vw] bg-white shadow-2xl flex flex-col"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={() => setMenuOpen(false)}
          style={{ opacity: 0 }}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-black/10 text-black/60 hover:text-black hover:border-black/40 transition-colors"
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col px-6 md:px-9 py-14">
          {ALL_NAV.map(({ label, href }, i) => {
            const isActive = activeLink === label;
            return (
              <a
                key={label}
                href={href}
                ref={(el) => {
                  if (el) navLinksRef.current[i] = el;
                }}
                onClick={(e) => handleLinkClick(e, label, href)}
                style={{ opacity: 0 }}
                className={`group relative py-3 md:py-3.5 border-b border-black/5 transition-colors duration-300
                  ${isActive ? "text-[#9564F4]" : "text-black hover:text-[#9564F4]"}`}
              >
                <span className="font-outfit font-light text-[17px] md:text-[24px] lg:text-[28px] leading-tight tracking-tight">
                  {label}
                </span>
                {/* Subtle underline on hover */}
                <span className="absolute bottom-3 md:bottom-3.5 left-0 right-0 h-[1px] bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </a>
            );
          })}
        </nav>

        {/* Footer CTA */}
        <div className="px-6 md:px-9 pb-8 md:pb-10">
          <div className="border-t border-black/10 pt-5 md:pt-6">
            <a
              href={ctaHref}
              onClick={(e) => handleLinkClick(e, ctaLabel, ctaHref)}
              className="block"
            >
              <button className="w-full font-outfit text-[15px] md:text-[16px] h-[46px] rounded-full bg-black text-white hover:bg-[#9564F4] transition-colors duration-300">
                {ctaLabel}
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;