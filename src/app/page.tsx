"use client";

import { useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Banner from "@/components/banner";
import Section2 from "@/components/philosophy";
import Section3 from "@/components/section3";
import Partners from "@/components/partners";
import Founders from "@/components/founders";
import Cta from "@/components/cta";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )} */}
      <Banner />
      <Section2 />
      <Section3 />
      <Partners />
      <Founders />
      <Cta />
    </>
  );
}