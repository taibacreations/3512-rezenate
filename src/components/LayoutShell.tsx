// src/components/LayoutShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/ui/LoadingScreen";
import type { HeaderData } from "@/sanity/lib/queries";
import type { LoadingData } from "@/sanity/lib/queries";

interface LayoutWrapperProps {
  children: React.ReactNode;
  headerData?: HeaderData | null;
  loadingData?: LoadingData | null;
}

export default function LayoutWrapper({ children, headerData, loadingData }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <LoadingScreen data={loadingData} />
      <Header data={headerData} />
      {children}
    </SmoothScroll>
  );
}