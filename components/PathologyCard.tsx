"use client";

import { Map as MapIcon, Trash2 } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, GroupMode, Pathology } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import SeverityPicker from "./SeverityPicker";
import PhotoCapture from "./PhotoCapture";

export default function PathologyCard({
  surveyId,
  pathology,
  groupMode,
  locatedOnPlan,
  onUpdate,
  onDelete,
}: {
  surveyId: string;
  pathology: Pathology;
  groupMode: GroupMode;
  locatedOnPlan: boolean;
  onUpdate: (id: string, patch: Partial<Pathology>) => void;
  onDelete: (id: string) => void;
}) {
  const { lang } = useLang();

  return (
    <div className="border-t border-stone-100 pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-2">
        <span className="mt-2 shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-medium text-stone-500">
          {pathology.code}
        </span>
        <input
          type="text"
          value={pathology.label}
          onChange={(e) => onUpdate(pathology.id, { label: e.target.value })}
          placeholder={t("pathologyLabel", lang)}
          className="flex-1 rounded-lg border border-stone-200 px-2 py-1.5 text-sm focus:border-stone-900 focus:outline-none"
        />
        {locatedOnPlan && (
          <span title={t("locatedOnPlan", lang)} className="mt-2 shrink-0 text-stone-400">
            <MapIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
          </span>
        )}
        <button
          type="button"
          onClick={() => onDelete(pathology.id)}
          className="mt-1 shrink-0 rounded-full p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 pl-7">
        {groupMode !== "lot" && (
          <select
            value={pathology.category}
            onChange={(e) => onUpdate(pathology.id, { category: e.target.value as Pathology["category"] })}
            className="rounded-md border border-stone-200 px-1.5 py-1 text-[11px] text-stone-600 focus:border-stone-900 focus:outline-none"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category][lang]}
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
            className="w-36 rounded-md border border-stone-200 px-1.5 py-1 text-[11px] text-stone-600 focus:border-stone-900 focus:outline-none"
          />
        )}
        {groupMode !== "disorderType" && (
          <input
            type="text"
            value={pathology.disorderType}
            onChange={(e) => onUpdate(pathology.id, { disorderType: e.target.value })}
            placeholder={t("disorderTypePlaceholder", lang)}
            className="w-36 rounded-md border border-stone-200 px-1.5 py-1 text-[11px] text-stone-600 focus:border-stone-900 focus:outline-none"
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
          className="mt-2 w-full resize-none rounded-lg border border-stone-200 px-2 py-1.5 text-xs focus:border-stone-900 focus:outline-none"
        />
        <PhotoCapture surveyId={surveyId} pathologyId={pathology.id} />
      </div>
    </div>
  );
}
