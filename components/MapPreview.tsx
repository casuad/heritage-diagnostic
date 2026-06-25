"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { GeoPoint } from "@/lib/types";

export default function MapPreview({ geo, label }: { geo: GeoPoint; label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      L.marker([geo.lat, geo.lng], { icon }).addTo(map).bindPopup(label ?? "").openPopup();
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [geo.lat, geo.lng, label]);

  return <div ref={containerRef} className="h-48 w-full overflow-hidden rounded-lg border border-stone-200" />;
}
