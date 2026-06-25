"use client";

import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { isStorageAvailable } from "@/lib/db";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function StorageWarning() {
  const { lang } = useLang();
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // Checked on mount only (client-only API, would mismatch SSR if read
    // during render) — not a derived-state loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvailable(isStorageAvailable());
  }, []);

  if (available) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="mx-auto flex max-w-3xl items-start gap-2">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
        <div>
          <p className="font-medium">{t("storageUnavailable", lang)}</p>
          <p className="mt-0.5 text-xs text-amber-800">{t("storageUnavailableHint", lang)}</p>
        </div>
      </div>
    </div>
  );
}
