// src/components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import SmoothScroll from "@/components/SmoothScroll";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    // Sanity Studio — render bare, no header, no smooth scroll
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Header />
      {children}
    </SmoothScroll>
  );
}