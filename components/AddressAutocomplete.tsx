"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { searchAddress, AddressSuggestion } from "@/lib/geocode";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
}) {
  const { lang } = useLang();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      searchAddress(value).then((results) => {
        setSuggestions(results);
        setOpen(results.length > 0);
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">{t("address", lang)}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={t("addressPlaceholder", lang)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-accent focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-900">
          {suggestions.map((suggestion, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  onChange(suggestion.label);
                  onSelect(suggestion);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" strokeWidth={1.5} />
                <span className="truncate">{suggestion.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
