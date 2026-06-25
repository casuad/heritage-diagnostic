"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { EMPTY_GROUP_KEY, groupPathologies } from "@/lib/grouping";
import { PATHOLOGY_SUGGESTIONS } from "@/lib/pathology-suggestions";
import { GroupMode, Lot, Pathology, PlanMarker } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PathologyCard from "./PathologyCard";

export interface AddPathologySpec {
  lotId: string;
  zone?: string;
  label?: string;
}

export default function PathologyBoard({
  surveyId,
  pathologies,
  lots,
  markersByPathology,
  onAdd,
  onUpdate,
  onDelete,
  onAddLot,
  onRenameLot,
  onDeleteLot,
}: {
  surveyId: string;
  pathologies: Pathology[];
  lots: Lot[];
  markersByPathology: Record<string, PlanMarker>;
  onAdd: (spec: AddPathologySpec) => void;
  onUpdate: (id: string, patch: Partial<Pathology>) => void;
  onDelete: (id: string) => void;
  onAddLot: (name: string) => void;
  onRenameLot: (id: string, name: string) => void;
  onDeleteLot: (id: string) => void;
}) {
  const { lang } = useLang();
  const [mode, setMode] = useState<GroupMode>("lot");
  const [newGroupName, setNewGroupName] = useState("");
  const [addingGroup, setAddingGroup] = useState(false);

  const groups = groupPathologies(pathologies, mode, lots);
  const defaultLotId = lots[0]?.id;

  function handleAddToGroup(group: (typeof groups)[number]) {
    if (mode === "lot") {
      onAdd({ lotId: group.lot!.id });
    } else if (defaultLotId) {
      onAdd({ lotId: defaultLotId, zone: group.key === EMPTY_GROUP_KEY ? "" : group.key });
    }
  }

  function handleCreateGroup() {
    const name = newGroupName.trim();
    if (!name) return;
    if (mode === "lot") {
      onAddLot(name);
    } else if (defaultLotId) {
      onAdd({ lotId: defaultLotId, zone: name });
    }
    setNewGroupName("");
    setAddingGroup(false);
  }

  const newGroupLabel = mode === "lot" ? t("newLot", lang) : t("newZone", lang);
  const newGroupPlaceholder = mode === "lot" ? t("lotNamePlaceholder", lang) : t("zonePlaceholder", lang);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full bg-stone-100 p-1 text-xs dark:bg-stone-900">
        {(["lot", "zone"] as GroupMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full px-3 py-1.5 font-medium transition-colors ${
              mode === m
                ? "bg-accent text-white"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
            }`}
          >
            {m === "lot" ? t("groupByLot", lang) : t("groupByZone", lang)}
          </button>
        ))}
      </div>

      {mode !== "lot" && lots.length === 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          {t("noLotsYet", lang)}
        </p>
      )}

      {(mode !== "lot" ? lots.length > 0 : true) && (
        <div className="flex items-center gap-2">
          {addingGroup ? (
            <>
              <input
                autoFocus
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                placeholder={newGroupPlaceholder}
                className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
              />
              <button onClick={handleCreateGroup} className="rounded-lg bg-accent px-3 py-2 text-sm text-white hover:bg-accent-dark">
                {t("create", lang)}
              </button>
            </>
          ) : (
            <button
              onClick={() => setAddingGroup(true)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-xs font-medium text-stone-500 hover:border-accent hover:text-accent dark:border-stone-700 dark:text-stone-400"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              {newGroupLabel}
            </button>
          )}
        </div>
      )}

      {groups.map((group) => {
        if (mode !== "lot" && group.key === EMPTY_GROUP_KEY && group.items.length === 0) return null;
        const groupLabel = group.label || t("unzoned", lang);
        return (
          <section
            key={group.key}
            className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900/60"
          >
            <div className="flex items-center justify-between gap-2">
              {mode === "lot" ? (
                <LotHeading lot={group.lot!} onRename={onRenameLot} onDelete={onDeleteLot} disabled={group.items.length > 0} />
              ) : (
                <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-50">{groupLabel}</h2>
              )}
              <span className="shrink-0 text-xs text-stone-400 dark:text-stone-500">{group.items.length}</span>
            </div>

            {group.items.length > 0 && (
              <div className="mt-3 space-y-4">
                {group.items.map((pathology) => (
                  <PathologyCard
                    key={pathology.id}
                    surveyId={surveyId}
                    pathology={pathology}
                    lots={lots}
                    groupMode={mode}
                    marker={markersByPathology[pathology.id] ?? null}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}

            {mode === "lot" && PATHOLOGY_SUGGESTIONS[group.lot?.templateSlug ?? ""] && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PATHOLOGY_SUGGESTIONS[group.lot!.templateSlug!].map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onAdd({ lotId: group.lot!.id, label: suggestion[lang] })}
                    className="rounded-full border border-stone-200 px-2.5 py-1 text-[11px] text-stone-500 hover:border-accent hover:text-accent dark:border-stone-700 dark:text-stone-400"
                  >
                    + {suggestion[lang]}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleAddToGroup(group)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 py-2 text-xs font-medium text-stone-500 hover:border-accent hover:text-accent dark:border-stone-700 dark:text-stone-400"
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

function LotHeading({
  lot,
  onRename,
  onDelete,
  disabled,
}: {
  lot: Lot;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}) {
  const { lang } = useLang();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(lot.name);

  function commit() {
    const trimmed = name.trim();
    if (trimmed && trimmed !== lot.name) onRename(lot.id, trimmed);
    else setName(lot.name);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="flex-1 rounded-md border border-accent bg-transparent px-1.5 py-0.5 text-sm font-semibold text-stone-900 focus:outline-none dark:text-stone-50"
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <h2 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-50">{lot.name}</h2>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 rounded-full p-1 text-stone-300 hover:bg-stone-100 hover:text-stone-600 dark:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
      >
        <Pencil className="h-3 w-3" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onDelete(lot.id)}
        title={disabled ? t("deleteLotBlocked", lang) : t("delete", lang)}
        className="shrink-0 rounded-full p-1 text-stone-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-stone-300 dark:text-stone-600"
      >
        <Trash2 className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </div>
  );
}
