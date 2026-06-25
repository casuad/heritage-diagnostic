"use client";

import { Plus, Trash2 } from "lucide-react";
import { CATEGORY_LABELS, Category, Pathology } from "@/lib/types";
import { PATHOLOGY_SUGGESTIONS } from "@/lib/pathology-suggestions";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import SeverityPicker from "./SeverityPicker";
import PhotoCapture from "./PhotoCapture";

export default function PathologySection({
  category,
  surveyId,
  pathologies,
  onAdd,
  onUpdate,
  onDelete,
}: {
  category: Category;
  surveyId: string;
  pathologies: Pathology[];
  onAdd: (category: Category, label: string) => void;
  onUpdate: (id: string, patch: Partial<Pathology>) => void;
  onDelete: (id: string) => void;
}) {
  const { lang } = useLang();
  const items = pathologies.filter((p) => p.category === category);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-900">{CATEGORY_LABELS[category][lang]}</h2>
        <span className="text-xs text-stone-400">{items.length}</span>
      </div>

      {items.length > 0 && (
        <div className="mt-3 space-y-4">
          {items.map((pathology) => (
            <div key={pathology.id} className="border-t border-stone-100 pt-3 first:border-t-0 first:pt-0">
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
                <button
                  type="button"
                  onClick={() => onDelete(pathology.id)}
                  className="mt-1 shrink-0 rounded-full p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-2 pl-7">
                <SeverityPicker
                  value={pathology.severity}
                  onChange={(severity) => onUpdate(pathology.id, { severity })}
                />
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
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PATHOLOGY_SUGGESTIONS[category].map((suggestion, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onAdd(category, suggestion[lang])}
            className="rounded-full border border-stone-200 px-2.5 py-1 text-[11px] text-stone-500 hover:border-stone-400 hover:text-stone-900"
          >
            + {suggestion[lang]}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAdd(category, "")}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 py-2 text-xs font-medium text-stone-500 hover:border-stone-400 hover:text-stone-900"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        {t("addPathology", lang)}
      </button>
    </section>
  );
}
