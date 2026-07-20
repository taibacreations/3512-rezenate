// src/app/page.tsx
import { Suspense } from "react";
import { client } from "../sanity/lib/client";

import { BANNER_QUERY,PHILOSOPHY_QUERY,VALUES_QUERY,PARTNERS_QUERY,FOUNDERS_QUERY,CTA_QUERY,FOOTER_QUERY,LOADING_QUERY } from "@/sanity/lib/queries";

import Banner     from "@/components/banner";
import Philosophy from "@/components/philosophy";
import Values     from "@/components/values";
import Partners   from "@/components/partners";
import Founders   from "@/components/founders";
import Cta        from "@/components/cta";
import Footer     from "@/components/footer";

const FETCH_OPTS = { cache: "no-store" } as const;

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
    client.fetch(BANNER_QUERY,     {}, FETCH_OPTS),
    client.fetch(PHILOSOPHY_QUERY, {}, FETCH_OPTS),
    client.fetch(VALUES_QUERY,     {}, FETCH_OPTS),
    client.fetch(PARTNERS_QUERY,   {}, FETCH_OPTS),
    client.fetch(FOUNDERS_QUERY,   {}, FETCH_OPTS),
    client.fetch(CTA_QUERY,        {}, FETCH_OPTS),
    client.fetch(FOOTER_QUERY,     {}, FETCH_OPTS),
  ]);

  return (
    <>
      <Banner     data={bannerData}     />
      <Philosophy data={philosophyData} />
      <Values     data={valuesData}     />
      <Partners   data={partnersData}   />
      <Founders   data={foundersData}   />
      <Cta        data={ctaData}        />
      <Footer     data={footerData}     />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}