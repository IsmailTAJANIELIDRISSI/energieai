import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// PDF Document Component
const ReportDocument = ({
  recommendations,
  implementations,
  currentLanguage,
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Helvetica",
      fontSize: 12,
      color: "#333333",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      borderBottom: "1px solid #E5E7EB",
      paddingBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1F2937",
    },
    timestamp: {
      fontSize: 10,
      color: "#6B7280",
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1F2937",
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      color: "#4B5563",
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginBottom: 20,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
    },
    tableHeader: {
      backgroundColor: "#F3F4F6",
      fontWeight: "bold",
      padding: 8,
    },
    tableCell: {
      padding: 8,
      fontSize: 10,
      color: "#4B5563",
    },
    tableCol: {
      width: "25%",
      borderRightWidth: 1,
      borderRightColor: "#E5E7EB",
    },
    tableColWide: {
      width: "50%",
      borderRightWidth: 1,
      borderRightColor: "#E5E7EB",
    },
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rapport d'Optimisation Énergétique</Text>
          <Text style={styles.timestamp}>
            Généré le {formatDate(new Date())}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <Text style={styles.text}>
            Nombre de recommandations actives : {recommendations.length}
          </Text>
          <Text style={styles.text}>
            Économies potentielles totales :{" "}
            {recommendations
              .reduce((sum, rec) => sum + rec.potential_savings, 0)
              .toLocaleString("fr-MA")}{" "}
            MAD/mois
          </Text>
          <Text style={styles.text}>
            Nombre d'implémentations : {implementations.length}
          </Text>
          <Text style={styles.text}>
            Implémentations terminées :{" "}
            {
              implementations.filter((impl) => impl.status === "Implémenté")
                .length
            }
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommandations Actives</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>Titre</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Machine</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Priorité</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Économies (MAD)</Text>
              </View>
            </View>
            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.tableRow}>
                <View style={styles.tableColWide}>
                  <Text style={styles.tableCell}>{rec.title}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{rec.machine_id}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{rec.priority}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {rec.potential_savings.toLocaleString("fr-MA")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implémentations en Cours</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>Titre</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Machine</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Statut</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Économies Réelles (MAD)</Text>
              </View>
            </View>
            {implementations.map((impl) => (
              <View key={impl.id} style={styles.tableRow}>
                <View style={styles.tableColWide}>
                  <Text style={styles.tableCell}>{impl.title}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{impl.machine_id}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{impl.status}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {impl.actual_savings.toLocaleString("fr-MA")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;
