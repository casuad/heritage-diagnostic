"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { getPlansForSurvey } from "@/lib/db";
import { PlanRecord } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function PlansSection({ surveyId }: { surveyId: string }) {
  const { lang } = useLang();
  const [plans, setPlans] = useState<PlanRecord[]>([]);

  useEffect(() => {
    getPlansForSurvey(surveyId).then(setPlans);
  }, [surveyId]);

  return (
    <section className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4 dark:border-accent/40 dark:bg-accent/10">
      <div className="flex items-center gap-2">
        <MapIcon className="h-4 w-4 text-accent" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-50">{t("plans", lang)}</h2>
      </div>
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{t("plansHint", lang)}</p>

      {plans.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {plans.map((plan) => (
            // eslint-disable-next-line @next/next/no-img-element -- in-memory blob URL
            <img
              key={plan.id}
              src={URL.createObjectURL(plan.blob)}
              alt={plan.name}
              className="h-14 w-14 rounded-lg border border-stone-200 object-cover dark:border-stone-700"
            />
          ))}
        </div>
      )}

      <Link
        href={`/survey/${surveyId}/plans`}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-dark"
      >
        {plans.length === 0 ? t("addFirstPlan", lang) : t("managePlans", lang)}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </Link>
    </section>
  );
}
