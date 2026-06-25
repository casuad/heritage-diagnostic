import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { Lang, Lot, Pathology, SEVERITY_LABELS, Survey } from "@/lib/types";
import { computeSeverityCounts, overallPriorityLabel } from "@/lib/synthesis";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#1c1917" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#78716c", marginBottom: 24 },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  infoLabel: { width: 110, color: "#78716c" },
  infoValue: { flex: 1, fontWeight: 700 },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginTop: 20, marginBottom: 8, borderBottom: "1pt solid #e7e5e4", paddingBottom: 4 },
  countsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  countBox: { flex: 1, padding: 8, borderRadius: 4 },
  countValue: { fontSize: 16, fontWeight: 700 },
  countLabel: { fontSize: 8, color: "#57534e" },
  categoryTitle: { fontSize: 12, fontWeight: 700, marginTop: 16, marginBottom: 6 },
  item: { marginBottom: 10, paddingBottom: 10, borderBottom: "0.5pt solid #f1f0ef" },
  introParagraph: { fontSize: 9.5, lineHeight: 1.5, color: "#44403c", marginBottom: 8 },
  introLabel: { fontSize: 8, fontWeight: 700, color: "#78716c", marginBottom: 2, textTransform: "uppercase" },
  itemHeader: { flexDirection: "row", alignItems: "center" },
  itemCode: { fontSize: 8, fontFamily: "Helvetica-Bold", backgroundColor: "#f1f0ef", color: "#57534e", padding: "2 5", borderRadius: 3, marginRight: 6 },
  itemLabel: { fontSize: 10, fontWeight: 700, flex: 1, marginRight: 8 },
  severityBadge: { fontSize: 8, fontWeight: 700, padding: "2 6", borderRadius: 3, color: "#fff" },
  comment: { fontSize: 9, color: "#57534e", marginTop: 3 },
  photoRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  photo: { width: 70, height: 70, borderRadius: 4, objectFit: "cover" },
  planBlock: { marginBottom: 18 },
  planName: { fontSize: 10, fontWeight: 700, marginBottom: 6 },
  planFrame: { position: "relative", width: "100%" },
  planImage: { width: "100%", borderRadius: 4 },
  markerBadge: {
    position: "absolute",
    width: 14,
    height: 14,
    marginLeft: -7,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: "#1c1917",
    alignItems: "center",
    justifyContent: "center",
  },
  markerText: { fontSize: 6, color: "#fff", fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, fontSize: 8, color: "#a8a29e", textAlign: "center" },
});

export interface PdfPlanData {
  id: string;
  name: string;
  imageDataUrl: string;
  markers: { id: string; x: number; y: number; code: string }[];
}

export default function PdfDocument({
  survey,
  pathologies,
  lots,
  photosByPathology,
  plans,
  lang,
}: {
  survey: Survey;
  pathologies: Pathology[];
  lots: Lot[];
  photosByPathology: Record<string, string[]>;
  plans: PdfPlanData[];
  lang: Lang;
}) {
  const counts = computeSeverityCounts(pathologies);
  const priority = overallPriorityLabel(counts);
  const title = lang === "fr" ? "Relevé de diagnostic patrimonial" : "Heritage diagnostic survey";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{survey.buildingName || "—"}</Text>

        {(survey.diagnosticContext || survey.notes) && (
          <View>
            <Text style={styles.sectionTitle}>{lang === "fr" ? "Introduction" : "Introduction"}</Text>
            {survey.diagnosticContext && (
              <View>
                <Text style={styles.introLabel}>
                  {lang === "fr" ? "Contexte & raisons du diagnostic" : "Context & reasons for the survey"}
                </Text>
                <Text style={styles.introParagraph}>{survey.diagnosticContext}</Text>
              </View>
            )}
            {survey.notes && (
              <View>
                <Text style={styles.introLabel}>
                  {lang === "fr" ? "Description visuelle & principes constructifs" : "Visual description & construction principles"}
                </Text>
                <Text style={styles.introParagraph}>{survey.notes}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{lang === "fr" ? "Adresse" : "Address"}</Text>
          <Text style={styles.infoValue}>{survey.address || "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{lang === "fr" ? "Type de bâtiment" : "Building type"}</Text>
          <Text style={styles.infoValue}>{survey.buildingType || "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{lang === "fr" ? "Date du relevé" : "Survey date"}</Text>
          <Text style={styles.infoValue}>{survey.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{lang === "fr" ? "Diagnostiqueur" : "Surveyor"}</Text>
          <Text style={styles.infoValue}>{survey.surveyor || "—"}</Text>
        </View>

        <Text style={styles.sectionTitle}>{lang === "fr" ? "Synthèse" : "Summary"}</Text>
        <Text>{priority[lang]}</Text>
        <View style={styles.countsRow}>
          {([0, 1, 2, 3] as const).map((severity) => (
            <View key={severity} style={[styles.countBox, { backgroundColor: `${SEVERITY_LABELS[severity].color}15` }]}>
              <Text style={[styles.countValue, { color: SEVERITY_LABELS[severity].color }]}>{counts[severity]}</Text>
              <Text style={styles.countLabel}>{SEVERITY_LABELS[severity][lang]}</Text>
            </View>
          ))}
        </View>

        {lots.map((lot) => {
          const items = pathologies.filter((p) => p.lotId === lot.id);
          if (items.length === 0) return null;
          return (
            <View key={lot.id}>
              <Text style={styles.categoryTitle}>{lot.name}</Text>
              {items.map((pathology) => {
                const photos = photosByPathology[pathology.id] ?? [];
                return (
                  <View key={pathology.id} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemCode}>{pathology.code}</Text>
                      <Text style={styles.itemLabel}>{pathology.label || "—"}</Text>
                      {pathology.severity !== null && (
                        <Text style={[styles.severityBadge, { backgroundColor: SEVERITY_LABELS[pathology.severity].color }]}>
                          {SEVERITY_LABELS[pathology.severity][lang]}
                        </Text>
                      )}
                    </View>
                    {pathology.comment && <Text style={styles.comment}>{pathology.comment}</Text>}
                    {photos.length > 0 && (
                      <View style={styles.photoRow}>
                        {photos.map((src, i) => (
                          // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML/next img
                          <Image key={i} src={src} style={styles.photo} />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        {plans.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{lang === "fr" ? "Plans" : "Plans"}</Text>
            {plans.map((plan) => (
              <View key={plan.id} style={styles.planBlock} wrap={false}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planFrame}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML/next img */}
                  <Image src={plan.imageDataUrl} style={styles.planImage} />
                  {plan.markers.map((marker) => (
                    <View key={marker.id} style={[styles.markerBadge, { left: `${marker.x}%`, top: `${marker.y}%` }]}>
                      <Text style={styles.markerText}>{marker.code.split("-")[1] ?? marker.code}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          {lang === "fr" ? "Généré avec Relevé Patrimoine — outil open source" : "Generated with Heritage Survey — open source tool"}
        </Text>
      </Page>
    </Document>
  );
}
