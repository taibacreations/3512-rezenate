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
// Lenis / SmoothScroll ne native scroll override kar diya hota hai,
// isliye scroll-padding-top kaam nahi karta.
// Yeh function manually header height ka offset le ke scroll karta hai.
const scrollToSection = (href: string) => {
  if (!href.startsWith("#")) {
    window.location.href = href;
    return;
  }

  const id = href.slice(1);
  const el = document.getElementById(id);
  if (!el) return;

  const headerHeight = document.querySelector("header")?.offsetHeight ?? 80;
  const EXTRA_OFFSET = 32; // extra breathing room
  const top =
    el.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    EXTRA_OFFSET;

  // Lenis global instance use karo agar available ho, warna native
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
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLAnchorElement[]>([]);
  const mobileCTARef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const bar1Ref = useRef<HTMLSpanElement>(null);
  const bar2Ref = useRef<HTMLSpanElement>(null);
  const bar3Ref = useRef<HTMLSpanElement>(null);
  const scrolledRef = useRef(false);

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
    gsap.set(navRef.current ? Array.from(navRef.current.children) : [], {
      autoAlpha: 0,
      y: -10,
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
          .to(
            navRef.current ? Array.from(navRef.current.children) : [],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "expo.out",
              stagger: 0.06,
            },
            "-=0.25",
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

  // ── Scroll glassmorphism ───────────────────────────────────────────────────
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled && !scrolledRef.current) {
        scrolledRef.current = true;
        gsap.to(header, {
          backgroundColor: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 2px 32px rgba(149,100,244,0.10)",
          paddingTop: "16px",
          paddingBottom: "16px",
          duration: 0.5,
          ease: "power2.out",
        });
      } else if (!isScrolled && scrolledRef.current) {
        scrolledRef.current = false;
        gsap.to(header, {
          backgroundColor: "rgba(255,255,255,0)",
          backdropFilter: "blur(0px)",
          boxShadow: "none",
          paddingTop: "16px",
          paddingBottom: "16px",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mobile menu ────────────────────────────────────────────────────────────
  useEffect(() => {
    const drawer = mobileMenuRef.current;
    const overlay = overlayRef.current;
    const links = mobileLinksRef.current.filter(Boolean);
    const cta = mobileCTARef.current;
    const closeBtn = closeBtnRef.current;
    if (!drawer || !overlay) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlay, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(drawer, { x: 0, duration: 0.55, ease: "expo.out" });
      gsap.fromTo(
        closeBtn,
        { autoAlpha: 0, rotate: -90 },
        {
          autoAlpha: 1,
          rotate: 0,
          duration: 0.4,
          ease: "expo.out",
          delay: 0.3,
        },
      );
      gsap.fromTo(
        links,
        { autoAlpha: 0, x: 24 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.2,
        },
      );
      gsap.fromTo(
        cta,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "expo.out", delay: 0.52 },
      );
      gsap.to(bar1Ref.current, {
        rotation: 45,
        y: 7,
        duration: 0.35,
        ease: "power2.inOut",
      });
      gsap.to(bar2Ref.current, {
        autoAlpha: 0,
        scaleX: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(bar3Ref.current, {
        rotation: -45,
        y: -7,
        duration: 0.35,
        ease: "power2.inOut",
      });
    } else {
      document.body.style.overflow = "";
      gsap.to(closeBtn, {
        autoAlpha: 0,
        rotate: -90,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(links, {
        autoAlpha: 0,
        x: 16,
        duration: 0.2,
        ease: "power2.in",
        stagger: 0.03,
      });
      gsap.to(cta, { autoAlpha: 0, duration: 0.15, ease: "power2.in" });
      gsap.to(drawer, {
        x: "100%",
        duration: 0.45,
        ease: "expo.in",
        delay: 0.05,
      });
      gsap.to(bar1Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
      gsap.to(bar2Ref.current, {
        autoAlpha: 1,
        scaleX: 1,
        duration: 0.25,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.to(bar3Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ── Outside click ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      )
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  const onNavEnter = (el: HTMLElement) =>
    gsap.to(el, { y: -2, duration: 0.25, ease: "power2.out" });
  const onNavLeave = (el: HTMLElement) =>
    gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
  const onCTAEnter = (el: HTMLElement) =>
    gsap.to(el, { scale: 1.04, duration: 0.3, ease: "power2.out" });
  const onCTALeave = (el: HTMLElement) =>
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
  const onCTAPress = (el: HTMLElement) =>
    gsap.to(el, { scale: 0.96, duration: 0.12, ease: "power2.in" });
  const onCTARelease = (el: HTMLElement) =>
    gsap.to(el, { scale: 1.04, duration: 0.2, ease: "power2.out" });

  // ── Scroll spy ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const ids = ALL_NAV.map((l) => l.href.slice(1)).filter(Boolean);
    const sectionEls = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Jo section screen pe 40%+ visible ho, usse active karo
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
        threshold: 0.4, // section ka 40% visible ho
        rootMargin: "-80px 0px -20% 0px", // header height ka offset
      },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nav click handler ──────────────────────────────────────────────────────
  const handleNavClick = (e: React.MouseEvent, label: string, href: string) => {
    e.preventDefault();
    scrollToSection(href);
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

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden lg:flex items-center">
            {ALL_NAV.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, label, href)}
                onMouseEnter={(e) => onNavEnter(e.currentTarget)}
                onMouseLeave={(e) => onNavLeave(e.currentTarget)}
                style={{ visibility: "visible", opacity: 0 }}
                className={`font-outfit font-normal text-[16px] xl:text-[18px] leading-[115%] py-1.5 rounded-full relative group
                  transition-[background-color,color,box-shadow] duration-300 px-4 xl:px-6
                  ${
                    activeLink === label
                      ? "text-[#FDFCFD] bg-[#9564F4] shadow-[0_4px_20px_rgba(149,100,244,0.35)]"
                      : "text-black hover:text-[#9564F4]"
                  }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div ref={ctaRef} className="hidden lg:flex" style={{ opacity: 0 }}>
            <a
              href={ctaHref}
              onClick={(e) => handleNavClick(e, ctaLabel, ctaHref)}
            >
              <button
                className="font-outfit font-normal text-[20px] leading-[114%] w-[140px] xl:w-[159px] h-[40px] xl:h-[45px] flex justify-center items-center rounded-full border border-black transition-[background-color,color,box-shadow] duration-300 hover:bg-black hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                onMouseEnter={(e) => onCTAEnter(e.currentTarget)}
                onMouseLeave={(e) => onCTALeave(e.currentTarget)}
                onMouseDown={(e) => onCTAPress(e.currentTarget)}
                onMouseUp={(e) => onCTARelease(e.currentTarget)}
              >
                {ctaLabel}
              </button>
            </a>
          </div>

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ opacity: 0 }}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] relative z-[60]"
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

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden pointer-events-none"
        style={{ visibility: "hidden", opacity: 0 }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 z-50 h-full w-[80vw] max-w-[320px] bg-white shadow-2xl flex flex-col pt-24 pb-10 px-8 lg:hidden"
        style={{ transform: "translateX(100%)" }}
      >
        <button
          ref={closeBtnRef}
          onClick={() => setMenuOpen(false)}
          style={{ opacity: 0 }}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-black/50 hover:text-[#9564F4] hover:border-[#9564F4] transition-all duration-200 text-[15px]"
          aria-label="Close menu"
        >
          ✕
        </button>

        <nav className="flex flex-col gap-2">
          {ALL_NAV.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              ref={(el) => {
                if (el) mobileLinksRef.current[i] = el;
              }}
              onClick={(e) => {
                handleNavClick(e, label, href);
                setMenuOpen(false);
              }}
              style={{ opacity: 0 }}
              className={`font-outfit text-[20px] font-medium py-3 border-b border-gray-100 transition-colors duration-200
                ${activeLink === label ? "text-[#9564F4]" : "text-black hover:text-[#9564F4]"}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto">
          <a
            href={ctaHref}
            onClick={(e) => {
              handleNavClick(e, ctaLabel, ctaHref);
              setMenuOpen(false);
            }}
          >
            <button
              ref={mobileCTARef}
              style={{ opacity: 0 }}
              className="w-full font-outfit text-[18px] h-[48px] rounded-full border border-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              {ctaLabel}
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
