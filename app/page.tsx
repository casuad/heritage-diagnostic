"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Download, Upload } from "lucide-react";
import { getAllSurveys, saveSurvey } from "@/lib/db";
import { Survey } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import SurveyCard from "@/components/SurveyCard";

export default function HomePage() {
  const { lang } = useLang();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllSurveys().then((s) => {
      setSurveys(s);
      setLoaded(true);
    });
  }, []);

  function exportJson() {
    const blob = new Blob([JSON.stringify(surveys, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `releves-patrimoine-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const imported = JSON.parse(text) as Survey[];
    for (const survey of imported) {
      await saveSurvey(survey);
    }
    setSurveys(await getAllSurveys());
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-stone-500">{t("tagline", lang)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={exportJson}
            title={t("exportJson", lang)}
            className="rounded-full border border-stone-200 p-2 text-stone-500 hover:bg-stone-100"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <label
            title={t("importJson", lang)}
            className="cursor-pointer rounded-full border border-stone-200 p-2 text-stone-500 hover:bg-stone-100"
          >
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            <input type="file" accept="application/json" className="hidden" onChange={importJson} />
          </label>
        </div>
      </div>

      <Link
        href="/survey/new"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 font-medium text-white transition-colors hover:bg-stone-800"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        {t("newSurvey", lang)}
      </Link>

      <div className="mt-6 space-y-3">
        {loaded && surveys.length === 0 && (
          <p className="py-12 text-center text-sm text-stone-400">{t("noSurveys", lang)}</p>
        )}
        {surveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </div>
    </div>
  );
}
