"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "./ui/logo";
import { client } from "../sanity/lib/client";
import { headerQuery } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

type HeaderTheme = "light" | "dark";

const SECTION_THEMES: { id: string; theme: HeaderTheme; prevOf?: string }[] = [
  { id: "home",           theme: "dark"  },
  { id: "philosophy",     theme: "light", prevOf: "home"           },
  { id: "section3",       theme: "dark",  prevOf: "philosophy"     },
  { id: "how-we-partner", theme: "light", prevOf: "section3"       },
  { id: "founders",       theme: "dark",  prevOf: "how-we-partner" },
  { id: "cta",            theme: "light", prevOf: "founders"       },
  { id: "footer",         theme: "dark",  prevOf: "cta"            },
];

const THEME_MAP = Object.fromEntries(
  SECTION_THEMES.map(({ id, theme }) => [id, theme])
) as Record<string, HeaderTheme>;

const FALLBACK_NAV = [
  { label: "Home",           href: "#home"           },
  { label: "Philosophy",     href: "#philosophy"     },
  { label: "How We Partner", href: "#how-we-partner" },
  { label: "Founders",       href: "#founders"       },
  { label: "Contact",        href: "#footer"         },
];

interface HeaderData {
  logoImage?: { asset: { _ref: string } };
  contactButtonText?: string;
  navLinks?: { label: string; href: string }[];
}

const Header = () => {
  const headerRef    = useRef<HTMLElement>(null);
  const menuRef      = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLAnchorElement[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme]           = useState<HeaderTheme>("dark");
  const [headerData, setHeaderData] = useState<HeaderData>({});
  const [loaded, setLoaded]         = useState(false);

  // Fetch header content from Sanity
  useEffect(() => {
    client
      .fetch(headerQuery, {}, { cache: "no-store" })
      .then((data: HeaderData) => {
        console.log("[Header] Sanity data:", data); // ← check browser console
        if (data) setHeaderData(data);
        setLoaded(true);
      })
      .catch((err) => {
        console.error("[Header] Sanity fetch error:", err);
        setLoaded(true);
      });
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 1.4, delay: 1.0, ease: "power2.out" },
    );
  }, []);

  // Per-section theme switching
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    SECTION_THEMES.forEach(({ id, theme: sectionTheme, prevOf }) => {
      const el = document.querySelector(`#${id}`);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 10%",
        end: "bottom 10%",
        onEnter:     () => setTheme(sectionTheme),
        onEnterBack: () => setTheme(sectionTheme),
      });
      triggers.push(st);

      if (prevOf) {
        const prevTheme = THEME_MAP[prevOf];
        if (prevTheme !== undefined) {
          const stBack = ScrollTrigger.create({
            trigger: el,
            start: "top 10%",
            onLeaveBack: () => setTheme(prevTheme),
          });
          triggers.push(stBack);
        }
      }
    });

    return () => triggers.forEach((st) => st.kill());
  }, []);

  // Menu open/close
  useEffect(() => {
    if (!menuRef.current) return;
    if (isMenuOpen) {
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(menuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" });
      gsap.fromTo(menuLinksRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.2, ease: "power2.out" },
      );
    } else {
      gsap.to(menuRef.current, {
        opacity: 0, duration: 0.5, ease: "power2.in",
        onComplete: () => { gsap.set(menuRef.current, { display: "none" }); },
      });
    }
  }, [isMenuOpen]);

  const isDark = theme === "dark";
  const contactButtonText = headerData.contactButtonText ?? "Contact us";
  const navLinks          = headerData.navLinks?.length ? headerData.navLinks : FALLBACK_NAV;

  return (
    <div>
      <div className="fixed w-full z-50">
        <header
          ref={headerRef}
          className="flex justify-between items-center max-w-[1435px] mx-auto xl:px-10 md:px-6 px-4 md:mt-[20px] mt-[1.5vh] relative opacity-0"
        >
          <div className="flex-1 justify-start hidden md:flex">
            <button
              className={`font-boldonse font-normal lg:text-[14.66px] text-[12px] leading-[100%]
                lg:w-[159px] lg:h-[45px] w-[120px] h-[38px] flex justify-center items-center
                rounded-full border-[1px] transition-colors duration-500
                ${isDark
                  ? "text-white border-white/60 hover:bg-white hover:text-black hover:border-white"
                  : "text-black border-black/30 hover:bg-black hover:text-white hover:border-black"
                }`}
            >
              {contactButtonText}
            </button>
          </div>

          <div className="flex flex-1 justify-start md:justify-center scale-[0.7] sm:scale-90 md:scale-100">
            <Logo logoImage={headerData.logoImage} isDark={isDark} />
          </div>

          <div className="flex flex-1 justify-end">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`menu rounded-full w-[38px] h-[38px] sm:w-[45px] sm:h-[45px]
                flex justify-center items-center border-[1.5px] transition-all duration-500
                hover:scale-105 ${isDark
                  ? "border-white/60 hover:bg-white/10"
                  : "border-black/30 hover:bg-black/10"
                }`}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <img
                src="/menu.webp"
                alt="toggle"
                className={`w-[20px] sm:w-[26.52px] h-auto transition-all duration-500 ${isMenuOpen ? "rotate-90" : ""} ${isDark ? "" : "invert"}`}
              />
            </button>
          </div>
        </header>

        <div
          ref={menuRef}
          className="hidden fixed inset-0 z-40 bg-black/95 flex-col items-center justify-center gap-6 sm:gap-10"
          style={{ opacity: 0 }}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-[20px] right-4 sm:right-6 md:right-10
              w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] rounded-full
              flex justify-center items-center
              transition-all duration-500 hover:bg-white/10 hover:rotate-90"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 1L19 19M19 1L1 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              ref={(el) => { if (el) menuLinksRef.current[i] = el; }}
              onClick={() => setIsMenuOpen(false)}
              className="font-boldonse text-white text-2xl sm:text-4xl lg:text-5xl uppercase tracking-wide hover:text-[#a685e6] transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;