"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
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
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-stone-900">{t("documents", lang)}</h2>

      {documents.length === 0 ? (
        <p className="mt-2 text-xs text-stone-400">{t("noDocuments", lang)}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-2 rounded-lg border border-stone-100 px-2.5 py-1.5 text-sm">
              <FileText className="h-3.5 w-3.5 shrink-0 text-stone-400" strokeWidth={1.5} />
              <a
                href={URL.createObjectURL(doc.blob)}
                download={doc.name}
                className="flex-1 truncate text-stone-700 hover:underline"
              >
                {doc.name}
              </a>
              <button
                type="button"
                onClick={() => handleDelete(doc.id)}
                className="shrink-0 rounded-full p-1 text-stone-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="mt-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 py-2 text-xs font-medium text-stone-500 hover:border-stone-400 hover:text-stone-900">
        <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t("uploadDocument", lang)}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </section>
  );
}
