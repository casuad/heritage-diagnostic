import { openDB, type IDBPDatabase } from "idb";
import { DocumentRecord, PhotoRecord, PlanMarker, PlanRecord, Pathology, Survey } from "./types";

const DB_NAME = "heritage-diagnostic";
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function isStorageAvailable() {
  return typeof indexedDB !== "undefined";
}

function getDb() {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available in this environment");
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("surveys")) {
          db.createObjectStore("surveys", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("photos")) {
          const photos = db.createObjectStore("photos", { keyPath: "id" });
          photos.createIndex("by-survey", "surveyId");
          photos.createIndex("by-pathology", "pathologyId");
        }

        if (!db.objectStoreNames.contains("pathologies")) {
          const pathologies = db.createObjectStore("pathologies", { keyPath: "id" });
          pathologies.createIndex("by-survey", "surveyId");
        }
        if (!db.objectStoreNames.contains("plans")) {
          const plans = db.createObjectStore("plans", { keyPath: "id" });
          plans.createIndex("by-survey", "surveyId");
        }
        if (!db.objectStoreNames.contains("planMarkers")) {
          const markers = db.createObjectStore("planMarkers", { keyPath: "id" });
          markers.createIndex("by-plan", "planId");
          markers.createIndex("by-pathology", "pathologyId");
        }
        if (!db.objectStoreNames.contains("documents")) {
          const documents = db.createObjectStore("documents", { keyPath: "id" });
          documents.createIndex("by-survey", "surveyId");
        }
      },
    });
  }
  return dbPromise;
}

// Surveys

export async function saveSurvey(survey: Survey) {
  const db = await getDb();
  await db.put("surveys", survey);
}

export async function getSurvey(id: string) {
  const db = await getDb();
  return db.get("surveys", id) as Promise<Survey | undefined>;
}

export async function getAllSurveys() {
  const db = await getDb();
  const all = (await db.getAll("surveys")) as Survey[];
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteSurvey(id: string) {
  const db = await getDb();
  const [photos, pathologies, plans, documents] = await Promise.all([
    getPhotosForSurvey(id),
    getPathologiesForSurvey(id),
    getPlansForSurvey(id),
    getDocumentsForSurvey(id),
  ]);
  const markers = (
    await Promise.all(plans.map((plan) => getMarkersForPlan(plan.id)))
  ).flat();

  const tx = db.transaction(
    ["surveys", "photos", "pathologies", "plans", "planMarkers", "documents"],
    "readwrite"
  );
  await tx.objectStore("surveys").delete(id);
  for (const photo of photos) await tx.objectStore("photos").delete(photo.id);
  for (const pathology of pathologies) await tx.objectStore("pathologies").delete(pathology.id);
  for (const plan of plans) await tx.objectStore("plans").delete(plan.id);
  for (const marker of markers) await tx.objectStore("planMarkers").delete(marker.id);
  for (const document of documents) await tx.objectStore("documents").delete(document.id);
  await tx.done;
}

// Pathologies

export async function savePathology(pathology: Pathology) {
  const db = await getDb();
  await db.put("pathologies", pathology);
}

export async function getPathologiesForSurvey(surveyId: string) {
  const db = await getDb();
  const all = (await db.getAllFromIndex("pathologies", "by-survey", surveyId)) as Pathology[];
  return all.sort((a, b) => a.code.localeCompare(b.code));
}

export async function deletePathology(id: string) {
  const db = await getDb();
  const photos = await getPhotosForPathology(id);
  const markers = await getMarkersForPathology(id);
  const tx = db.transaction(["pathologies", "photos", "planMarkers"], "readwrite");
  await tx.objectStore("pathologies").delete(id);
  for (const photo of photos) await tx.objectStore("photos").delete(photo.id);
  for (const marker of markers) await tx.objectStore("planMarkers").delete(marker.id);
  await tx.done;
}

// Photos

export async function addPhoto(photo: PhotoRecord) {
  const db = await getDb();
  await db.put("photos", photo);
}

export async function deletePhoto(id: string) {
  const db = await getDb();
  await db.delete("photos", id);
}

export async function getPhotosForSurvey(surveyId: string) {
  const db = await getDb();
  return db.getAllFromIndex("photos", "by-survey", surveyId) as Promise<PhotoRecord[]>;
}

export async function getPhotosForPathology(pathologyId: string) {
  const db = await getDb();
  return db.getAllFromIndex("photos", "by-pathology", pathologyId) as Promise<PhotoRecord[]>;
}

// Plans

export async function addPlan(plan: PlanRecord) {
  const db = await getDb();
  await db.put("plans", plan);
}

export async function getPlansForSurvey(surveyId: string) {
  const db = await getDb();
  const all = (await db.getAllFromIndex("plans", "by-survey", surveyId)) as PlanRecord[];
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function deletePlan(id: string) {
  const db = await getDb();
  const markers = await getMarkersForPlan(id);
  const tx = db.transaction(["plans", "planMarkers"], "readwrite");
  await tx.objectStore("plans").delete(id);
  for (const marker of markers) await tx.objectStore("planMarkers").delete(marker.id);
  await tx.done;
}

// Plan markers

export async function addMarker(marker: PlanMarker) {
  const db = await getDb();
  await db.put("planMarkers", marker);
}

export async function getMarkersForPlan(planId: string) {
  const db = await getDb();
  return db.getAllFromIndex("planMarkers", "by-plan", planId) as Promise<PlanMarker[]>;
}

export async function getMarkersForPathology(pathologyId: string) {
  const db = await getDb();
  return db.getAllFromIndex("planMarkers", "by-pathology", pathologyId) as Promise<PlanMarker[]>;
}

export async function deleteMarker(id: string) {
  const db = await getDb();
  await db.delete("planMarkers", id);
}

export async function getMarkersForSurvey(surveyId: string) {
  const plans = await getPlansForSurvey(surveyId);
  const markers = await Promise.all(plans.map((plan) => getMarkersForPlan(plan.id)));
  return markers.flat();
}

// Documents

export async function addDocument(document: DocumentRecord) {
  const db = await getDb();
  await db.put("documents", document);
}

export async function getDocumentsForSurvey(surveyId: string) {
  const db = await getDb();
  const all = (await db.getAllFromIndex("documents", "by-survey", surveyId)) as DocumentRecord[];
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function deleteDocument(id: string) {
  const db = await getDb();
  await db.delete("documents", id);
}
