"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Survey, Pathology } from "@/lib/types";
import { computeSeverityCounts, overallPriorityLabel } from "@/lib/synthesis";
import { getPathologiesForSurvey } from "@/lib/db";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function SurveyCard({ survey, onDelete }: { survey: Survey; onDelete: (id: string) => void }) {
  const { lang } = useLang();
  const router = useRouter();
  const [pathologies, setPathologies] = useState<Pathology[]>([]);

  useEffect(() => {
    getPathologiesForSurvey(survey.id).then(setPathologies);
  }, [survey.id]);

  const counts = computeSeverityCounts(pathologies);
  const priority = overallPriorityLabel(counts);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm(t("confirmDeleteSurvey", lang))) onDelete(survey.id);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/survey/${survey.id}`)}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/survey/${survey.id}`)}
      className="group block cursor-pointer rounded-xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900/60 dark:hover:shadow-none dark:hover:border-stone-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-stone-900 dark:text-stone-50">{survey.buildingName || "—"}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">{survey.address || "—"}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="whitespace-nowrap text-xs text-stone-400 dark:text-stone-500">{survey.date}</span>
          <button
            type="button"
            onClick={handleDelete}
            title={t("delete", lang)}
            className="rounded-full p-1.5 text-stone-300 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-stone-600"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-stone-600 dark:text-stone-300">{counts.total}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            counts[3] > 0
              ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
              : counts[2] > 0
              ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
              : counts[1] > 0
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
              : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
          }`}
        >
          {priority[lang]}
        </span>
      </div>
    </div>
  );
}
