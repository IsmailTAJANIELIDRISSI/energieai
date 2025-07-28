import React, { useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Définir la police pour le PDF (optionnel, ici on utilise une police de base)
Font.register({
  family: "OpenSans",
  src: "https://fonts.gstatic.com/s/opensans/v27/mem8YaGs126MiZpBA-UFVZ0b.ttf",
});

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "OpenSans",
    fontSize: 12,
    lineHeight: 1.6,
    color: "#333",
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#007ACC",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#003E73",
  },
  text: {
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#007ACC",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  col1: {
    width: "35%",
    fontWeight: "bold",
  },
  col2: {
    width: "25%",
  },
  col3: {
    width: "15%",
  },
  col4: {
    width: "25%",
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
});

// Document PDF React-pdf
const RapportPDF = ({ recommendations, implementations, stats }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Rapport d'Optimisation Énergétique</Text>
        <Text>Généré le : {new Date().toLocaleDateString("fr-FR")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Résumé des statistiques clés</Text>
        <Text style={styles.text}>
          Nombre de recommandations actives : {stats.totalRecommendations}
        </Text>
        <Text style={styles.text}>
          Économies potentielles totales (MAD/mois) :{" "}
          {stats.totalSavings.toLocaleString("fr-FR")}
        </Text>
        <Text style={styles.text}>
          Recommandations en implémentation : {stats.implementations.length}
        </Text>
        <Text style={styles.text}>
          Recommandations implémentées : {stats.implementedCount}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Recommandations Détail</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Titre</Text>
          <Text style={styles.col2}>Machine</Text>
          <Text style={styles.col3}>Priorité</Text>
          <Text style={styles.col4}>Économies Potentielles (MAD/mois)</Text>
        </View>
        {recommendations.map((rec) => (
          <View key={rec.id} style={styles.tableRow}>
            <Text style={styles.col1}>{rec.title}</Text>
            <Text style={styles.col2}>{rec.machine_id}</Text>
            <Text style={styles.col3}>{rec.priority}</Text>
            <Text style={styles.col4}>
              {Number(rec.potential_savings).toLocaleString("fr-FR")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Implémentations Suivi</Text>
        {implementations.length === 0 && (
          <Text style={styles.text}>Aucune implémentation en cours.</Text>
        )}
        {implementations.map((impl) => (
          <View key={impl.id} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>{impl.title}</Text>
            <Text>Machine : {impl.machine_id}</Text>
            <Text>État : {impl.status}</Text>
            <Text>
              Économies attendues :{" "}
              {Number(impl.expected_savings).toLocaleString("fr-FR")} MAD/mois
            </Text>
            <Text>
              Coût d’implémentation :{" "}
              {Number(impl.implementation_cost).toLocaleString("fr-FR")} MAD
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} Usine Intelligente - Système de
        Recommandations
      </Text>
    </Page>
  </Document>
);

// Composant exportateur avec bouton
const ExportPdfButton = ({ recommendations, implementations }) => {
  // Statistiques calculées
  const stats = {
    totalRecommendations: recommendations.length,
    totalSavings: recommendations.reduce(
      (sum, rec) => sum + Number(rec.potential_savings || 0),
      0
    ),
    implementations,
    implementedCount: implementations.filter(
      (impl) => impl.status === "Implémenté"
    ).length,
  };

  return (
    <PDFDownloadLink
      document={
        <RapportPDF
          recommendations={recommendations}
          implementations={implementations}
          stats={stats}
        />
      }
      fileName={`Rapport_Optimisation_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`}
      style={{
        textDecoration: "none",
        padding: "8px 16px",
        color: "white",
        backgroundColor: "#007ACC",
        borderRadius: 4,
        fontWeight: "bold",
      }}
    >
      {({ loading }) => (loading ? "Génération PDF..." : "Exporter Rapport")}
    </PDFDownloadLink>
  );
};

export default ExportPdfButton;
