"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { getPhotosForPathology } from "@/lib/db";
import { PhotoRecord } from "@/lib/types";

export interface PlanMarkerView {
  id: string;
  x: number;
  y: number;
  code: string;
  label: string;
  pathologyId: string;
}

export default function PlanCanvas({
  imageUrl,
  markers,
  onPlace,
  onDeleteMarker,
  placementEnabled,
}: {
  imageUrl: string;
  markers: PlanMarkerView[];
  onPlace: (x: number, y: number) => void;
  onDeleteMarker: (id: string) => void;
  placementEnabled: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);

  const activeMarker = markers.find((m) => m.id === activeMarkerId) ?? null;
  const activePathologyId = activeMarker?.pathologyId ?? null;

  useEffect(() => {
    (activePathologyId ? getPhotosForPathology(activePathologyId) : Promise.resolve([])).then(setPhotos);
  }, [activePathologyId]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (activeMarkerId) {
      setActiveMarkerId(null);
      return;
    }
    if (!placementEnabled || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPlace(x, y);
  }

  return (
    <div
      className={`relative inline-block w-full select-none ${placementEnabled ? "cursor-crosshair" : ""}`}
      onClick={handleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- in-memory blob URL */}
      <img ref={imgRef} src={imageUrl} alt="" className="w-full rounded-lg border border-stone-200 dark:border-stone-700" />
      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          title={marker.code}
          onClick={(e) => {
            e.stopPropagation();
            setActiveMarkerId(marker.id === activeMarkerId ? null : marker.id);
          }}
          className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-md ring-2 ring-white hover:bg-accent-dark dark:ring-stone-900"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {marker.code.split("-")[1] ?? marker.code}
        </button>
      ))}

      {activeMarker && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 w-48 -translate-x-1/2 rounded-lg border border-stone-200 bg-white p-2.5 shadow-lg dark:border-stone-700 dark:bg-stone-900"
          style={{
            left: `${activeMarker.x}%`,
            top: `${activeMarker.y}%`,
            marginTop: "16px",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10px] font-medium text-stone-500 dark:text-stone-400">{activeMarker.code}</p>
              <p className="text-xs text-stone-800 dark:text-stone-200">{activeMarker.label || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onDeleteMarker(activeMarker.id);
                setActiveMarkerId(null);
              }}
              className="shrink-0 rounded-full p-1 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:text-stone-500"
            >
              <Trash2 className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {photos.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element -- in-memory blob URL
                <img
                  key={photo.id}
                  src={URL.createObjectURL(photo.blob)}
                  alt=""
                  className="h-10 w-10 rounded object-cover"
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
