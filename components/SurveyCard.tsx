"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Survey, Pathology } from "@/lib/types";
import { computeSeverityCounts, overallPriorityLabel } from "@/lib/synthesis";
import { getPathologiesForSurvey } from "@/lib/db";
import { useLang } from "@/lib/lang-context";

export default function SurveyCard({ survey }: { survey: Survey }) {
  const { lang } = useLang();
  const [pathologies, setPathologies] = useState<Pathology[]>([]);

  useEffect(() => {
    getPathologiesForSurvey(survey.id).then(setPathologies);
  }, [survey.id]);

  const counts = computeSeverityCounts(pathologies);
  const priority = overallPriorityLabel(counts);

  return (
    <Link
      href={`/survey/${survey.id}`}
      className="block rounded-xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-stone-900">{survey.buildingName || "—"}</p>
          <p className="text-sm text-stone-500">{survey.address || "—"}</p>
        </div>
        <span className="whitespace-nowrap text-xs text-stone-400">{survey.date}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-stone-600">{counts.total}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            counts[3] > 0
              ? "bg-red-100 text-red-700"
              : counts[2] > 0
              ? "bg-orange-100 text-orange-700"
              : counts[1] > 0
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {priority[lang]}
        </span>
      </div>
    </Link>
  );
}
