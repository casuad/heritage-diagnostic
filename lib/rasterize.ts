import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

// react-pdf's <Image> only reliably decodes PNG/JPEG data URLs — uploaded
// plans (PDF page, HEIC photo, huge camera capture...) are rasterized to a
// capped-size JPEG once at upload time so both the on-screen canvas and the
// generated report always embed the same safe, lightweight image.
const MAX_DIMENSION = 1800;

function scaleDown(width: number, height: number) {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  return { width: Math.round(width * scale) || 1, height: Math.round(height * scale) || 1 };
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("canvas.toBlob failed"))), "image/jpeg", 0.92);
  });
}

async function rasterizePdf(file: File): Promise<Blob> {
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const { width, height } = scaleDown(baseViewport.width, baseViewport.height);
  const viewport = page.getViewport({ scale: width / baseViewport.width });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas context unavailable");
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return canvasToBlob(canvas);
}

export async function rasterizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = scaleDown(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas context unavailable");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvasToBlob(canvas);
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export async function rasterizePlanFile(file: File): Promise<Blob> {
  return isPdfFile(file) ? rasterizePdf(file) : rasterizeImage(file);
}
