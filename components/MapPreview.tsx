"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { GeoPoint } from "@/lib/types";

export default function MapPreview({ geo, label }: { geo: GeoPoint; label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    import("leaflet").then((L) => {
      // The dynamic import resolves asynchronously — if this effect was
      // already cleaned up (React Strict Mode double-invoke, fast nav),
      // bail out instead of initializing Leaflet on a stale/reused container.
      if (cancelled || !containerRef.current) return;
      map = L.map(containerRef.current, { attributionControl: false }).setView([geo.lat, geo.lng], 18);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#1c1917;border:2px solid white;box-shadow:0 0 0 2px rgba(28,25,23,0.3)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      markerRef.current = L.marker([geo.lat, geo.lng], { icon }).addTo(map).bindPopup(label ?? "").openPopup();
    });

    return () => {
      cancelled = true;
      markerRef.current = null;
      map?.remove();
    };
    // Re-init only when the coordinates actually change — not on every
    // keystroke of `label` (e.g. typing the building name live-updates the
    // popup text below, without tearing down and recreating the map).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.lat, geo.lng]);

  useEffect(() => {
    markerRef.current?.setPopupContent(label ?? "");
  }, [label]);

  return (
    <div
      ref={containerRef}
      className="h-48 w-full overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 dark:[&_.leaflet-tile-pane]:brightness-[0.6] dark:[&_.leaflet-tile-pane]:contrast-[0.9] dark:[&_.leaflet-tile-pane]:hue-rotate-180 dark:[&_.leaflet-tile-pane]:invert"
    />
  );
}
