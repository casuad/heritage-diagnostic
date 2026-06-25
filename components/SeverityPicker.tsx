"use client";

import { Severity, SEVERITY_LABELS } from "@/lib/types";
import { useLang } from "@/lib/lang-context";

export default function SeverityPicker({
  value,
  onChange,
}: {
  value: Severity | null;
  onChange: (s: Severity) => void;
}) {
  const { lang } = useLang();

  return (
    <div className="flex gap-1.5">
      {([0, 1, 2, 3] as Severity[]).map((severity) => {
        const def = SEVERITY_LABELS[severity];
        const selected = value === severity;
        return (
          <button
            key={severity}
            type="button"
            onClick={() => onChange(severity)}
            title={def[lang]}
            className="h-7 flex-1 rounded-md text-[11px] font-medium transition-all"
            style={{
              backgroundColor: selected ? def.color : `${def.color}22`,
              color: selected ? "#fff" : def.color,
            }}
          >
            {def[lang]}
          </button>
        );
      })}
    </div>
  );
}
