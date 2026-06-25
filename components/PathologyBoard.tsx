"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EMPTY_GROUP_KEY, groupPathologies } from "@/lib/grouping";
import { PATHOLOGY_SUGGESTIONS } from "@/lib/pathology-suggestions";
import { CATEGORIES, GroupMode, Pathology } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PathologyCard from "./PathologyCard";

export interface AddPathologySpec {
  category: Pathology["category"];
  zone?: string;
  disorderType?: string;
  label?: string;
}

export default function PathologyBoard({
  surveyId,
  pathologies,
  locatedPathologyIds,
  onAdd,
  onUpdate,
  onDelete,
}: {
  surveyId: string;
  pathologies: Pathology[];
  locatedPathologyIds: Set<string>;
  onAdd: (spec: AddPathologySpec) => void;
  onUpdate: (id: string, patch: Partial<Pathology>) => void;
  onDelete: (id: string) => void;
}) {
  const { lang } = useLang();
  const [mode, setMode] = useState<GroupMode>("lot");
  const [newGroupName, setNewGroupName] = useState("");
  const [addingGroup, setAddingGroup] = useState(false);

  const groups = groupPathologies(pathologies, mode, lang);

  function handleAddToGroup(group: (typeof groups)[number]) {
    if (mode === "lot") {
      onAdd({ category: group.category! });
    } else if (mode === "zone") {
      onAdd({ category: CATEGORIES[0], zone: group.key === EMPTY_GROUP_KEY ? "" : group.key });
    } else {
      onAdd({ category: CATEGORIES[0], disorderType: group.key === EMPTY_GROUP_KEY ? "" : group.key });
    }
  }

  function handleCreateGroup() {
    const name = newGroupName.trim();
    if (!name) return;
    if (mode === "zone") onAdd({ category: CATEGORIES[0], zone: name });
    else if (mode === "disorderType") onAdd({ category: CATEGORIES[0], disorderType: name });
    setNewGroupName("");
    setAddingGroup(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full bg-stone-100 p-1 text-xs">
        {(["lot", "zone", "disorderType"] as GroupMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full px-3 py-1.5 font-medium transition-colors ${
              mode === m ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {m === "lot" ? t("groupByLot", lang) : m === "zone" ? t("groupByZone", lang) : t("groupByType", lang)}
          </button>
        ))}
      </div>

      {mode !== "lot" && (
        <div className="flex items-center gap-2">
          {addingGroup ? (
            <>
              <input
                autoFocus
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                placeholder={mode === "zone" ? t("zonePlaceholder", lang) : t("disorderTypePlaceholder", lang)}
                className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none"
              />
              <button onClick={handleCreateGroup} className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
                {t("create", lang)}
              </button>
            </>
          ) : (
            <button
              onClick={() => setAddingGroup(true)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-xs font-medium text-stone-500 hover:border-stone-400 hover:text-stone-900"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              {t("newGroup", lang)}
            </button>
          )}
        </div>
      )}

      {groups.map((group) => {
        if (mode !== "lot" && group.key === EMPTY_GROUP_KEY && group.items.length === 0) return null;
        const groupLabel = group.label || (mode === "zone" ? t("unzoned", lang) : t("untyped", lang));
        return (
          <section key={group.key} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900">{groupLabel}</h2>
              <span className="text-xs text-stone-400">{group.items.length}</span>
            </div>

            {group.items.length > 0 && (
              <div className="mt-3 space-y-4">
                {group.items.map((pathology) => (
                  <PathologyCard
                    key={pathology.id}
                    surveyId={surveyId}
                    pathology={pathology}
                    groupMode={mode}
                    locatedOnPlan={locatedPathologyIds.has(pathology.id)}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}

            {mode === "lot" && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PATHOLOGY_SUGGESTIONS[group.category!].map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onAdd({ category: group.category!, label: suggestion[lang] })}
                    className="rounded-full border border-stone-200 px-2.5 py-1 text-[11px] text-stone-500 hover:border-stone-400 hover:text-stone-900"
                  >
                    + {suggestion[lang]}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleAddToGroup(group)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 py-2 text-xs font-medium text-stone-500 hover:border-stone-400 hover:text-stone-900"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              {t("addPathology", lang)}
            </button>
          </section>
        );
      })}
    </div>
  );
}
