"use client";

import dynamic from "next/dynamic";

// The workspace reads today's date from the browser clock, so it renders client-only
// to avoid a server/browser hydration mismatch.
const NdaWorkspace = dynamic(
  () => import("@/components/nda-workspace").then((m) => m.NdaWorkspace),
  { ssr: false },
);

export default function Home() {
  return <NdaWorkspace />;
}
