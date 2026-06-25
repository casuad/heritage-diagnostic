"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Map as MapIcon } from "lucide-react";
import { deleteSurvey, deletePathology, getPathologiesForSurvey, getSurvey, savePathology } from "@/lib/db";
import { newId } from "@/lib/id";
import { nextCode } from "@/lib/numbering";
import { CATEGORIES, Category, Pathology, Survey } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PathologySection from "@/components/PathologySection";
import SynthesisPanel from "@/components/SynthesisPanel";

export default function SurveyDetailPage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);

  useEffect(() => {
    getSurvey(params.id).then((s) => setSurvey(s ?? null));
    getPathologiesForSurvey(params.id).then(setPathologies);
  }, [params.id]);

  async function handleAdd(category: Category, label: string) {
    if (!survey) return;
    const pathology: Pathology = {
      id: newId(),
      surveyId: survey.id,
      category,
      code: nextCode(category, pathologies),
      label,
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
    const updated = { ...current, ...patch };
    setPathologies((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await savePathology(updated);
  }

  async function handleDelete(id: string) {
    setPathologies((prev) => prev.filter((p) => p.id !== id));
    await deletePathology(id);
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
        {CATEGORIES.map((category) => (
          <PathologySection
            key={category}
            category={category}
            surveyId={survey.id}
            pathologies={pathologies}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
        <SynthesisPanel surveyId={survey.id} pathologies={pathologies} />
      </div>
    </div>
  );
}
