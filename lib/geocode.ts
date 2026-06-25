export interface AddressSuggestion {
  label: string;
  lat: number;
  lng: number;
}

interface BanFeature {
  properties: { label: string };
  geometry: { coordinates: [number, number] };
}

// API officielle française (data.gouv.fr) — gratuite, sans clé, sans limite.
export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (query.trim().length < 3) return [];
  const res = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features as BanFeature[]).map((feature) => ({
    label: feature.properties.label,
    lng: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
  }));
}
