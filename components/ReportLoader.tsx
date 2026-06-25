"use client";

import dynamic from "next/dynamic";

// @react-pdf/renderer's usePDF is browser-only. Next.js still renders
// "use client" components once on the server, which crashes usePDF —
// ssr:false is required to keep this off the server render path entirely.
const ReportContent = dynamic(() => import("./ReportContent"), { ssr: false });

export default function ReportLoader({ id }: { id: string }) {
  return <ReportContent id={id} />;
}
