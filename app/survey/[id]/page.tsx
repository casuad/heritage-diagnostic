"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Map as MapIcon } from "lucide-react";
import {
  deleteSurvey,
  deletePathology,
  getMarkersForSurvey,
  getPathologiesForSurvey,
  getSurvey,
  savePathology,
  saveSurvey,
} from "@/lib/db";
import { newId } from "@/lib/id";
import { nextCode } from "@/lib/numbering";
import { Pathology, Survey } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PathologyBoard, { AddPathologySpec } from "@/components/PathologyBoard";
import SynthesisPanel from "@/components/SynthesisPanel";
import DocumentsSection from "@/components/DocumentsSection";

export default function SurveyDetailPage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [locatedPathologyIds, setLocatedPathologyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getSurvey(params.id).then((s) => setSurvey(s ?? null));
    getPathologiesForSurvey(params.id).then(setPathologies);
    getMarkersForSurvey(params.id).then((markers) => setLocatedPathologyIds(new Set(markers.map((m) => m.pathologyId))));
  }, [params.id]);

  async function handleAdd(spec: AddPathologySpec) {
    if (!survey) return;
    const pathology: Pathology = {
      id: newId(),
      surveyId: survey.id,
      category: spec.category,
      code: nextCode(spec.category, pathologies),
      label: spec.label ?? "",
      zone: spec.zone ?? "",
      disorderType: spec.disorderType ?? "",
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
    if (patch.category && patch.category !== current.category) {
      updated = { ...updated, code: nextCode(patch.category, pathologies.filter((p) => p.id !== id)) };
    }
    setPathologies((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await savePathology(updated);
  }

  async function handleDelete(id: string) {
    setPathologies((prev) => prev.filter((p) => p.id !== id));
    await deletePathology(id);
  }

  async function handleSurveyFieldChange(patch: Partial<Survey>) {
    if (!survey) return;
    const updated = { ...survey, ...patch, updatedAt: new Date().toISOString() };
    setSurvey(updated);
    await saveSurvey(updated);
  }

  async function handleDeleteSurvey() {
    if (!survey) return;
    await deleteSurvey(survey.id);
    router.push("/");
  }

  if (!survey) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">{survey.buildingName || "—"}</h1>
          <p className="text-sm text-stone-500">
            {survey.address} {survey.address && "·"} {survey.date}
          </p>
          {survey.surveyor && <p className="text-xs text-stone-400">{survey.surveyor}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={`/survey/${survey.id}/plans`}
            title={t("plans", lang)}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900"
          >
            <MapIcon className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <button
            onClick={handleDeleteSurvey}
            title={t("delete", lang)}
            className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <label className="mb-1 block text-sm font-medium text-stone-700">{t("notes", lang)}</label>
          <textarea
            value={survey.notes}
            onChange={(e) => handleSurveyFieldChange({ notes: e.target.value })}
            placeholder={t("notesPlaceholder", lang)}
            rows={2}
            className="w-full resize-none rounded-lg border border-stone-200 px-2 py-1.5 text-sm focus:border-stone-900 focus:outline-none"
          />
          <label className="mb-1 mt-3 block text-sm font-medium text-stone-700">{t("diagnosticContext", lang)}</label>
          <textarea
            value={survey.diagnosticContext}
            onChange={(e) => handleSurveyFieldChange({ diagnosticContext: e.target.value })}
            placeholder={t("diagnosticContextPlaceholder", lang)}
            rows={2}
            className="w-full resize-none rounded-lg border border-stone-200 px-2 py-1.5 text-sm focus:border-stone-900 focus:outline-none"
          />
        </section>

        <PathologyBoard
          surveyId={survey.id}
          pathologies={pathologies}
          locatedPathologyIds={locatedPathologyIds}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        <DocumentsSection surveyId={survey.id} />

        <SynthesisPanel surveyId={survey.id} pathologies={pathologies} />
      </div>
    </div>
  );
}
