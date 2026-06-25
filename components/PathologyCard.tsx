"use client";

import Link from "next/link";
import { Map as MapIcon, Trash2 } from "lucide-react";
import { GroupMode, Lot, Pathology, PlanMarker } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import SeverityPicker from "./SeverityPicker";
import PhotoCapture from "./PhotoCapture";

export default function PathologyCard({
  surveyId,
  pathology,
  lots,
  groupMode,
  marker,
  onUpdate,
  onDelete,
}: {
  surveyId: string;
  pathology: Pathology;
  lots: Lot[];
  groupMode: GroupMode;
  marker: PlanMarker | null;
  onUpdate: (id: string, patch: Partial<Pathology>) => void;
  onDelete: (id: string) => void;
}) {
  const { lang } = useLang();

  return (
    <div id={`pathology-${pathology.id}`} className="scroll-mt-24 border-t border-stone-100 pt-3 first:border-t-0 first:pt-0 dark:border-stone-800">
      <div className="flex items-start gap-2">
        <span className="mt-2 shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
          {pathology.code}
        </span>
        <input
          type="text"
          value={pathology.label}
          onChange={(e) => onUpdate(pathology.id, { label: e.target.value })}
          placeholder={t("pathologyLabel", lang)}
          className="flex-1 rounded-lg border border-stone-200 px-2 py-1.5 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
        />
        {marker && (
          <Link
            href={`/survey/${surveyId}/plans?plan=${marker.planId}&marker=${marker.id}`}
            title={t("locatedOnPlan", lang)}
            className="mt-2 shrink-0 text-stone-400 hover:text-accent dark:text-stone-500"
          >
            <MapIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        )}
        <button
          type="button"
          onClick={() => onDelete(pathology.id)}
          className="mt-1 shrink-0 rounded-full p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:text-stone-500"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
        {groupMode !== "lot" && (
          <select
            value={pathology.lotId}
            onChange={(e) => onUpdate(pathology.id, { lotId: e.target.value })}
            className="rounded-md border border-stone-200 px-1.5 py-1 text-[11px] text-stone-600 focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.name}
              </option>
            ))}
          </select>
        )}
        {groupMode !== "zone" && (
          <input
            type="text"
            value={pathology.zone}
            onChange={(e) => onUpdate(pathology.id, { zone: e.target.value })}
            placeholder={t("zonePlaceholder", lang)}
            className="w-36 rounded-md border border-stone-200 px-1.5 py-1 text-[11px] text-stone-600 focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          />
        )}
      </div>

      <div className="mt-2 pl-7">
        <SeverityPicker value={pathology.severity} onChange={(severity) => onUpdate(pathology.id, { severity })} />
        <textarea
          value={pathology.comment}
          onChange={(e) => onUpdate(pathology.id, { comment: e.target.value })}
          placeholder={t("comment", lang)}
          rows={1}
          className="mt-2 w-full resize-none rounded-lg border border-stone-200 px-2 py-1.5 text-xs focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
        />
        <PhotoCapture surveyId={surveyId} pathologyId={pathology.id} />
      </div>
    </div>
  );
}
