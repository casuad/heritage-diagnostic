"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import {
  addMarker,
  addPlan,
  deleteMarker,
  deletePlan,
  getMarkersForPlan,
  getPathologiesForSurvey,
  getPlansForSurvey,
} from "@/lib/db";
import { newId } from "@/lib/id";
import { Pathology, PlanMarker, PlanRecord } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PlanCanvas from "@/components/PlanCanvas";

export default function PlansPage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const surveyId = params.id;

  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [markers, setMarkers] = useState<PlanMarker[]>([]);
  const [selectedPathologyId, setSelectedPathologyId] = useState<string>("");
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    getPlansForSurvey(surveyId).then((p) => {
      setPlans(p);
      if (p.length > 0) setActivePlanId(p[0].id);
    });
    getPathologiesForSurvey(surveyId).then((p) => {
      setPathologies(p);
      if (p.length > 0) setSelectedPathologyId(p[0].id);
    });
  }, [surveyId]);

  useEffect(() => {
    (activePlanId ? getMarkersForPlan(activePlanId) : Promise.resolve([])).then(setMarkers);
  }, [activePlanId]);

  const activePlan = plans.find((p) => p.id === activePlanId) ?? null;
  const activeImageUrl = useMemo(() => (activePlan ? URL.createObjectURL(activePlan.blob) : null), [activePlan]);

  const pathologyById = useMemo(() => {
    const map: Record<string, Pathology> = {};
    for (const p of pathologies) map[p.id] = p;
    return map;
  }, [pathologies]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const plan: PlanRecord = {
      id: newId(),
      surveyId,
      name: planName || file.name,
      blob: file,
      createdAt: new Date().toISOString(),
    };
    await addPlan(plan);
    setPlans((prev) => [...prev, plan]);
    setActivePlanId(plan.id);
    setPlanName("");
  }

  async function handleDeletePlan(id: string) {
    await deletePlan(id);
    const remaining = plans.filter((p) => p.id !== id);
    setPlans(remaining);
    setActivePlanId(remaining[0]?.id ?? null);
  }

  async function handlePlace(x: number, y: number) {
    if (!activePlanId || !selectedPathologyId) return;
    const marker: PlanMarker = { id: newId(), planId: activePlanId, pathologyId: selectedPathologyId, x, y };
    await addMarker(marker);
    setMarkers((prev) => [...prev, marker]);
  }

  async function handleDeleteMarker(id: string) {
    await deleteMarker(id);
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  }

  const markerViews = markers
    .filter((m) => pathologyById[m.pathologyId])
    .map((m) => ({ id: m.id, x: m.x, y: m.y, code: pathologyById[m.pathologyId].code }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/survey/${surveyId}`} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        {t("backToSurvey", lang)}
      </Link>

      <h1 className="mt-4 text-lg font-semibold text-stone-900">{t("plans", lang)}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActivePlanId(plan.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              activePlanId === plan.id ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {plan.name}
          </button>
        ))}
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder={t("planName", lang)}
          className="w-32 rounded-full border border-stone-200 px-3 py-1.5 text-xs focus:border-stone-900 focus:outline-none"
        />
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:border-stone-400 hover:text-stone-900">
          <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("uploadPlan", lang)}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {plans.length === 0 && <p className="mt-8 text-center text-sm text-stone-400">{t("noPlans", lang)}</p>}

      {activePlan && activeImageUrl && (
        <div className="mt-4">
          {pathologies.length === 0 ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{t("noPathologiesYet", lang)}</p>
          ) : (
            <>
              <p className="mb-2 text-xs text-stone-500">{t("placeMarkerHint", lang)}</p>
              <select
                value={selectedPathologyId}
                onChange={(e) => setSelectedPathologyId(e.target.value)}
                className="mb-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-900 focus:outline-none"
              >
                {pathologies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.label || t("pathologyLabel", lang)}
                  </option>
                ))}
              </select>
            </>
          )}
          <PlanCanvas
            imageUrl={activeImageUrl}
            markers={markerViews}
            onPlace={handlePlace}
            onDeleteMarker={handleDeleteMarker}
            placementEnabled={pathologies.length > 0}
          />
          <button
            onClick={() => handleDeletePlan(activePlan.id)}
            className="mt-3 text-xs text-stone-400 hover:text-red-600"
          >
            {t("delete", lang)} « {activePlan.name} »
          </button>
        </div>
      )}
    </div>
  );
}
