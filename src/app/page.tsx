// src/app/page.tsx
import { Suspense } from "react";
import { client } from "../sanity/lib/client";
import {
  bannerQuery,
  philosophyQuery,
  valuesQuery,
  partnersQuery,
  foundersQuery,
  ctaQuery,
  footerQuery,
} from "@/sanity/lib/queries";

import Banner    from "@/components/banner";
import Section2  from "@/components/philosophy";
import Section3  from "@/components/values";
import Partners  from "@/components/partners";
import Founders  from "@/components/founders";
import Cta       from "@/components/cta";
import Footer    from "@/components/footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Values from "@/components/values";

export const revalidate = 60;

async function PageContent() {
  const [
    bannerData,
    philosophyData,
    valuesData,
    partnersData,
    foundersData,
    ctaData,
    footerData,
  ] = await Promise.all([
    client.fetch(bannerQuery),
    client.fetch(philosophyQuery),
    client.fetch(valuesQuery),
    client.fetch(partnersQuery),
    client.fetch(foundersQuery),
    client.fetch(ctaQuery),
    client.fetch(footerQuery),
  ]);

  return (
    <>
      <Banner />
      {/* <Section2 data={philosophyData} /> */}
      <Values />
      {/* <Partners data={partnersData}   /> */}
      {/* <Founders data={foundersData}   /> */}
      <Cta      data={ctaData}        />
      {/* <Footer   data={footerData}     /> */}
    </>
  );
}

// Home is NOT async — it renders the shell (LoadingScreen) immediately.
// PageContent is async inside Suspense — it streams in as Sanity fetches resolve.
// This means the browser paints the LoadingScreen before any data arrives.
export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Suspense fallback={null}>
        <PageContent />
      </Suspense>
    </>
  );
}