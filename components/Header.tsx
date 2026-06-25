"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur-sm dark:border-stone-800 dark:bg-[#0c0c0b]/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-stone-900 dark:text-stone-50">
          <Logo className="h-6 w-6 text-accent" />
          <span className="font-display text-[15px] tracking-tight">{t("appName", lang)}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex gap-1 rounded-full bg-stone-100 p-1 text-sm dark:bg-stone-900">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  lang === l
                    ? "bg-accent text-white"
                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
