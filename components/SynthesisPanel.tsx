"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Pathology, SEVERITY_LABELS, Severity } from "@/lib/types";
import { computeSeverityCounts, overallPriorityLabel } from "@/lib/synthesis";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function SynthesisPanel({ surveyId, pathologies }: { surveyId: string; pathologies: Pathology[] }) {
  const { lang } = useLang();
  const counts = computeSeverityCounts(pathologies);
  const priority = overallPriorityLabel(counts);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900/60">
      <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-50">{t("synthesis", lang)}</h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
        {counts.total} {t("pathologiesRecorded", lang)} — {priority[lang]}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {([0, 1, 2, 3] as Severity[]).map((severity) => (
          <div key={severity} className="rounded-lg p-2 text-center" style={{ backgroundColor: `${SEVERITY_LABELS[severity].color}15` }}>
            <p className="text-lg font-semibold" style={{ color: SEVERITY_LABELS[severity].color }}>
              {counts[severity]}
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">{SEVERITY_LABELS[severity][lang]}</p>
          </div>
        ))}
      </div>
      <Link
        href={`/survey/${surveyId}/report`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark active:scale-[0.99]"
      >
        <FileText className="h-4 w-4" strokeWidth={1.5} />
        {t("generateReport", lang)}
      </Link>
    </section>
  );
}
