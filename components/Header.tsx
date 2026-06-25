"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang } = useLang();

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-stone-900">
          <Building2 className="h-5 w-5" strokeWidth={1.5} />
          <span className="font-semibold tracking-tight">{t("appName", lang)}</span>
        </Link>
        <div className="flex gap-1 rounded-full bg-stone-100 p-1 text-sm">
          {(["fr", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 transition-colors ${
                lang === l ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
