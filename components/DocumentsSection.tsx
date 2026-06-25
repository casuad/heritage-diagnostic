"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, Trash2, Upload } from "lucide-react";
import { addDocument, deleteDocument, getDocumentsForSurvey } from "@/lib/db";
import { newId } from "@/lib/id";
import { DocumentRecord } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function DocumentsSection({ surveyId }: { surveyId: string }) {
  const { lang } = useLang();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    getDocumentsForSurvey(surveyId).then(setDocuments);
  }, [surveyId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const document: DocumentRecord = {
      id: newId(),
      surveyId,
      name: file.name,
      blob: file,
      createdAt: new Date().toISOString(),
    };
    await addDocument(document);
    setDocuments((prev) => [...prev, document]);
  }

  async function handleDelete(id: string) {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <section className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-4 dark:border-stone-700 dark:bg-stone-900/30">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-50">{t("documents", lang)}</h2>
        <span className="flex items-center gap-1 rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
          <Sparkles className="h-3 w-3" strokeWidth={1.5} />
          {t("aiAnalysisComingSoon", lang)}
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{t("documentsHint", lang)}</p>

      {documents.length === 0 ? (
        <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">{t("noDocuments", lang)}</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-900"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-stone-500" strokeWidth={1.5} />
              <a
                href={URL.createObjectURL(doc.blob)}
                download={doc.name}
                className="flex-1 truncate text-stone-700 hover:underline dark:text-stone-200"
              >
                {doc.name}
              </a>
              <button
                type="button"
                onClick={() => handleDelete(doc.id)}
                className="shrink-0 rounded-full p-1 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:text-stone-500"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="mt-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 py-2 text-xs font-medium text-stone-500 hover:border-accent hover:text-accent dark:border-stone-600 dark:text-stone-400">
        <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t("uploadDocument", lang)}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </section>
  );
}
