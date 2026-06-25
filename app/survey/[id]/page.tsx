"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Map as MapIcon } from "lucide-react";
import {
  deleteSurvey,
  deletePathology,
  deleteLot,
  getLotsForSurvey,
  getMarkersForSurvey,
  getPathologiesForSurvey,
  getSurvey,
  savePathology,
  saveLot,
  saveSurvey,
} from "@/lib/db";
import { newId } from "@/lib/id";
import { defaultLotsFor, makeLotPrefix } from "@/lib/lots";
import { nextCode } from "@/lib/numbering";
import { Lot, Pathology, PlanMarker, Survey } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PathologyBoard, { AddPathologySpec } from "@/components/PathologyBoard";
import SynthesisPanel from "@/components/SynthesisPanel";
import DocumentsSection from "@/components/DocumentsSection";
import PlansSection from "@/components/PlansSection";

export default function SurveyDetailPage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [markersByPathology, setMarkersByPathology] = useState<Record<string, PlanMarker>>({});

  useEffect(() => {
    getSurvey(params.id).then((s) => setSurvey(s ?? null));
    getPathologiesForSurvey(params.id).then(setPathologies);
    getMarkersForSurvey(params.id).then((markers) => {
      const byPathology: Record<string, PlanMarker> = {};
      for (const marker of markers) byPathology[marker.pathologyId] ??= marker;
      setMarkersByPathology(byPathology);
    });
    getLotsForSurvey(params.id).then(async (existing) => {
      if (existing.length > 0) {
        setLots(existing);
        return;
      }
      // Surveys created before lots existed as an entity have none yet —
      // seed the defaults now instead of leaving the board empty.
      const seeded = defaultLotsFor(params.id, lang);
      await Promise.all(seeded.map(saveLot));
      setLots(seeded);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (pathologies.length === 0) return;
    const hash = window.location.hash;
    if (!hash.startsWith("#pathology-")) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-accent");
    const timeout = setTimeout(() => el.classList.remove("ring-2", "ring-accent"), 2000);
    return () => clearTimeout(timeout);
  }, [pathologies]);

  async function handleAdd(spec: AddPathologySpec) {
    if (!survey) return;
    const lot = lots.find((l) => l.id === spec.lotId);
    if (!lot) return;
    const pathology: Pathology = {
      id: newId(),
      surveyId: survey.id,
      lotId: spec.lotId,
      code: nextCode(lot, pathologies),
      label: spec.label ?? "",
      zone: spec.zone ?? "",
      severity: null,
      comment: "",
      createdAt: new Date().toISOString(),
    };
    setPathologies((prev) => [...prev, pathology]);
    await savePathology(pathology);
  }

  async function handleUpdate(id: string, patch: Partial<Pathology>) {
    const current = pathologies.find((p) => p.id === id);
    if (!current) return;
    let updated = { ...current, ...patch };
    if (patch.lotId && patch.lotId !== current.lotId) {
      const lot = lots.find((l) => l.id === patch.lotId);
      if (lot) updated = { ...updated, code: nextCode(lot, pathologies.filter((p) => p.id !== id)) };
    }
    setPathologies((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await savePathology(updated);
  }

  async function handleDelete(id: string) {
    setPathologies((prev) => prev.filter((p) => p.id !== id));
    await deletePathology(id);
  }

  async function handleAddLot(name: string) {
    if (!survey) return;
    const lot: Lot = {
      id: newId(),
      surveyId: survey.id,
      name,
      prefix: makeLotPrefix(name, lots.map((l) => l.prefix)),
      order: lots.length,
    };
    setLots((prev) => [...prev, lot]);
    await saveLot(lot);
  }

  async function handleRenameLot(id: string, name: string) {
    const lot = lots.find((l) => l.id === id);
    if (!lot) return;
    const updated = { ...lot, name };
    setLots((prev) => prev.map((l) => (l.id === id ? updated : l)));
    await saveLot(updated);
  }

  async function handleDeleteLot(id: string) {
    setLots((prev) => prev.filter((l) => l.id !== id));
    await deleteLot(id);
  }

  async function handleSurveyFieldChange(patch: Partial<Survey>) {
    if (!survey) return;
    const updated = { ...survey, ...patch, updatedAt: new Date().toISOString() };
    setSurvey(updated);
    await saveSurvey(updated);
  }

  async function handleDeleteSurvey() {
    if (!survey) return;
    if (!window.confirm(t("confirmDeleteSurvey", lang))) return;
    await deleteSurvey(survey.id);
    router.push("/");
  }

  if (!survey) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{survey.buildingName || "—"}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {survey.address} {survey.address && "·"} {survey.date}
          </p>
          {survey.surveyor && <p className="text-xs text-stone-400 dark:text-stone-500">{survey.surveyor}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={`/survey/${survey.id}/plans`}
            title={t("plans", lang)}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-50"
          >
            <MapIcon className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <button
            onClick={handleDeleteSurvey}
            title={t("delete", lang)}
            className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:text-stone-500"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <section className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900/60">
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">{t("notes", lang)}</label>
          <textarea
            value={survey.notes}
            onChange={(e) => handleSurveyFieldChange({ notes: e.target.value })}
            placeholder={t("notesPlaceholder", lang)}
            rows={2}
            className="w-full resize-none rounded-lg border border-stone-200 px-2 py-1.5 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
          />
          <label className="mb-1 mt-3 block text-sm font-medium text-stone-700 dark:text-stone-300">{t("diagnosticContext", lang)}</label>
          <textarea
            value={survey.diagnosticContext}
            onChange={(e) => handleSurveyFieldChange({ diagnosticContext: e.target.value })}
            placeholder={t("diagnosticContextPlaceholder", lang)}
            rows={2}
            className="w-full resize-none rounded-lg border border-stone-200 px-2 py-1.5 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
          />
        </section>

        <PathologyBoard
          surveyId={survey.id}
          pathologies={pathologies}
          lots={lots}
          markersByPathology={markersByPathology}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAddLot={handleAddLot}
          onRenameLot={handleRenameLot}
          onDeleteLot={handleDeleteLot}
        />

        <PlansSection surveyId={survey.id} />

        <DocumentsSection surveyId={survey.id} />

        <SynthesisPanel surveyId={survey.id} pathologies={pathologies} />
      </div>
    </div>
  );
}
