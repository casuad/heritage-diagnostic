"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { usePDF } from "@react-pdf/renderer";
import {
  getMarkersForPlan,
  getPathologiesForSurvey,
  getPhotosForSurvey,
  getPlansForSurvey,
  getSurvey,
} from "@/lib/db";
import { Pathology, Survey } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import PdfDocument, { PdfPlanData } from "@/components/PdfDocument";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ReportContent({ id }: { id: string }) {
  const { lang } = useLang();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [photosByPathology, setPhotosByPathology] = useState<Record<string, string[]>>({});
  const [plans, setPlans] = useState<PdfPlanData[]>([]);
  const [ready, setReady] = useState(false);
  const [instance, updateInstance] = usePDF();

  useEffect(() => {
    (async () => {
      const s = await getSurvey(id);
      if (!s) return;
      const [items, photos, planRecords] = await Promise.all([
        getPathologiesForSurvey(id),
        getPhotosForSurvey(id),
        getPlansForSurvey(id),
      ]);

      const photoGroups: Record<string, string[]> = {};
      for (const photo of photos) {
        const dataUrl = await blobToDataUrl(photo.blob);
        photoGroups[photo.pathologyId] = [...(photoGroups[photo.pathologyId] ?? []), dataUrl];
      }

      const pathologyById: Record<string, Pathology> = {};
      for (const p of items) pathologyById[p.id] = p;

      const planData: PdfPlanData[] = [];
      for (const plan of planRecords) {
        const imageDataUrl = await blobToDataUrl(plan.blob);
        const markers = await getMarkersForPlan(plan.id);
        planData.push({
          id: plan.id,
          name: plan.name,
          imageDataUrl,
          markers: markers
            .filter((m) => pathologyById[m.pathologyId])
            .map((m) => ({ id: m.id, x: m.x, y: m.y, code: pathologyById[m.pathologyId].code })),
        });
      }

      setSurvey(s);
      setPathologies(items);
      setPhotosByPathology(photoGroups);
      setPlans(planData);
      setReady(true);
    })();
  }, [id]);

  useEffect(() => {
    if (survey && ready) {
      updateInstance(
        <PdfDocument survey={survey} pathologies={pathologies} photosByPathology={photosByPathology} plans={plans} lang={lang} />
      );
    }
  }, [survey, pathologies, photosByPathology, plans, lang, ready, updateInstance]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Link href={survey ? `/survey/${survey.id}` : "/"} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          {t("backToSurvey", lang)}
        </Link>
        {instance.url && (
          <a
            href={instance.url}
            download={`releve-${survey?.buildingName || "patrimoine"}.pdf`}
            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            {t("downloadReport", lang)}
          </a>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
        {instance.loading || !instance.url ? (
          <p className="py-24 text-center text-sm text-stone-400">…</p>
        ) : (
          <iframe src={instance.url} className="h-[80vh] w-full" />
        )}
      </div>
    </div>
  );
}
