"use client";

import { useRef } from "react";

export interface PlanMarkerView {
  id: string;
  x: number;
  y: number;
  code: string;
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

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
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
      <img ref={imgRef} src={imageUrl} alt="" className="w-full rounded-lg border border-stone-200" />
      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          title={marker.code}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteMarker(marker.id);
          }}
          className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stone-900 text-[9px] font-bold text-white shadow-md ring-2 ring-white hover:bg-red-600"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {marker.code.split("-")[1] ?? marker.code}
        </button>
      ))}
    </div>
  );
}
