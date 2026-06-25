"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveLot, saveSurvey } from "@/lib/db";
import { newId } from "@/lib/id";
import { defaultLotsFor } from "@/lib/lots";
import { GeoPoint, Survey } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import MapPreview from "@/components/MapPreview";

export default function NewSurveyPage() {
  const { lang } = useLang();
  const router = useRouter();
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");
  const [geo, setGeo] = useState<GeoPoint | null>(null);
  const [buildingType, setBuildingType] = useState("");
  const [surveyor, setSurveyor] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [diagnosticContext, setDiagnosticContext] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const now = new Date().toISOString();
    const survey: Survey = {
      id: newId(),
      buildingName,
      address,
      buildingType,
      surveyor,
      date,
      geo,
      notes,
      diagnosticContext,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await saveSurvey(survey);
      await Promise.all(defaultLotsFor(survey.id, lang).map(saveLot));
      router.push(`/survey/${survey.id}`);
    } catch {
      setError(t("saveError", lang));
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{t("newSurvey", lang)}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label={t("buildingName", lang)} value={buildingName} onChange={setBuildingName} required />

        <AddressAutocomplete
          value={address}
          onChange={(v) => {
            setAddress(v);
            setGeo(null);
          }}
          onSelect={(suggestion) => setGeo({ lat: suggestion.lat, lng: suggestion.lng })}
        />
        {geo && (
          <div>
            <p className="mb-1 text-xs text-stone-500 dark:text-stone-400">{t("verifyBuilding", lang)}</p>
            <MapPreview geo={geo} label={buildingName || address} />
          </div>
        )}

        <Field
          label={t("buildingType", lang)}
          value={buildingType}
          onChange={setBuildingType}
          placeholder={t("buildingTypePlaceholder", lang)}
        />
        <Field label={t("surveyor", lang)} value={surveyor} onChange={setSurveyor} />
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">{t("date", lang)}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
          />
        </div>

        <TextAreaField
          label={t("notes", lang)}
          value={notes}
          onChange={setNotes}
          placeholder={t("notesPlaceholder", lang)}
        />
        <TextAreaField
          label={t("diagnosticContext", lang)}
          value={diagnosticContext}
          onChange={setDiagnosticContext}
          placeholder={t("diagnosticContextPlaceholder", lang)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-accent px-4 py-3 font-medium text-white transition-colors hover:bg-accent-dark active:scale-[0.99]"
        >
          {t("create", lang)}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">{label}</label>
      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
      />
    </div>
  );
}
