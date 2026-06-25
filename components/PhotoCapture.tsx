"use client";

import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import { addPhoto, deletePhoto, getPhotosForPathology } from "@/lib/db";
import { newId } from "@/lib/id";
import { rasterizeImage } from "@/lib/rasterize";
import { PhotoRecord } from "@/lib/types";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

function getGeo(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

export default function PhotoCapture({ surveyId, pathologyId }: { surveyId: string; pathologyId: string }) {
  const { lang } = useLang();
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [locating, setLocating] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getPhotosForPathology(pathologyId).then(setPhotos);
  }, [pathologyId]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLocating(true);
    const geo = await getGeo();
    setLocating(false);
    setProcessing(true);
    try {
      const blob = await rasterizeImage(file);
      const photo: PhotoRecord = {
        id: newId(),
        surveyId,
        pathologyId,
        blob,
        takenAt: new Date().toISOString(),
        geo,
      };
      await addPhoto(photo);
      setPhotos((prev) => [...prev, photo]);
    } finally {
      setProcessing(false);
    }
  }

  async function handleDelete(id: string) {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700">
          {/* eslint-disable-next-line @next/next/no-img-element -- in-memory blob URL, not a static asset next/image can optimize */}
          <img src={URL.createObjectURL(photo.blob)} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => handleDelete(photo.id)}
            className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <label
        className={`flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-stone-300 text-stone-400 hover:border-accent hover:text-accent dark:border-stone-700 dark:text-stone-500 ${
          processing ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <Camera className="h-4 w-4" strokeWidth={1.5} />
        <span className="text-[9px]">{locating ? t("locating", lang) : processing ? t("processing", lang) : t("addPhoto", lang)}</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
          disabled={processing}
        />
      </label>
    </div>
  );
}
