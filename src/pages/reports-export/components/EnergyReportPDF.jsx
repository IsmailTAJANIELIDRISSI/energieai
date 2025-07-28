// components/EnergyReportPDF.jsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Enregistrez les polices si nécessaire
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf" },
    {
      src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    borderBottomStyle: "solid",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 5,
  },
  headerInfo: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e293b",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    borderBottomStyle: "solid",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#3b82f6",
    padding: 5,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableColWide: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 9,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 9,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metricCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    width: "30%",
    minWidth: "150px",
  },
  metricTitle: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 3,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  metricSubtitle: {
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 2,
  },
  recommendationItem: {
    marginBottom: 12,
    paddingLeft: 15,
  },
  recommendationBullet: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 8,
    height: 8,
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  recommendationText: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 3,
    paddingRight: 10,
  },
  recommendationSavings: {
    fontSize: 8,
    color: "#059669",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  chartPlaceholder: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: "center",
    color: "#64748b",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  pageBreak: {
    marginTop: 20,
  },
});

const EnergyReportPDF = ({ reportConfig, data }) => {
  const currentDate = format(new Date(), "PPPP", { locale: fr });

  // Provide default values to prevent undefined errors
  const config = {
    title: "Rapport personnalisé",
    sections: ["summary", "machines", "alerts", "energy"],
    template: "daily",
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    includeSummary: true,
    includeCharts: true,
    ...reportConfig,
  };

  const safeData = {
    machines: [],
    energy: [],
    alerts: [],
    ...data,
  };

  const getReportTitle = (template) =>
    ({
      daily: "Rapport Énergétique Quotidien",
      weekly: "Rapport Énergétique Hebdomadaire",
      monthly: "Rapport Énergétique Mensuel",
      compliance: "Rapport de Conformité Réglementaire",
      "cost-analysis": "Analyse des Coûts Énergétiques",
    }[template] || "Rapport Énergétique Personnalisé");

  // Generate enhanced data similar to ReportPreview
  const generateEnhancedData = () => {
    if (!safeData.energy || !safeData.machines) return null;

    const filteredEnergy = safeData.energy.filter(
      (e) =>
        new Date(e.timestamp) >= new Date(config.dateRange?.startDate) &&
        new Date(e.timestamp) <= new Date(config.dateRange?.endDate)
    );

    const machineData = safeData.machines
      .map((m) => {
        const energy = filteredEnergy.find((e) => e.machine_id === m.id) || {};
        return {
          name: m.name,
          value: energy.power_usage_kW || m.currentPower || 0,
          efficiency: m.efficiency || 0,
          status: m.status || "unknown",
        };
      })
      .filter((m) => m.value > 0);

    const totalConsumption = filteredEnergy.reduce(
      (sum, e) => sum + (e.power_usage_kW || 0),
      0
    );
    const totalCost = filteredEnergy.reduce(
      (sum, e) => sum + (e.cost_mad || 0),
      0
    );
    const averageEfficiency =
      safeData.machines.length > 0
        ? safeData.machines.reduce((sum, m) => sum + (m.efficiency || 0), 0) /
          safeData.machines.length
        : 0;
    const co2Footprint =
      filteredEnergy.reduce((sum, e) => sum + (e.co2 || 0), 0) / 1000;
    const peakDemand = Math.max(
      ...filteredEnergy.map((e) => e.power_usage_kW || 0),
      0
    );
    const criticalAlerts = safeData.alerts.filter(
      (a) => a.severity === "critical"
    ).length;

    const summaryStats = {
      totalConsumption: `${totalConsumption.toFixed(1)} kWh`,
      totalCost: `${totalCost.toFixed(1)} MAD`,
      averageEfficiency: `${averageEfficiency.toFixed(1)}%`,
      co2Footprint: `${co2Footprint.toFixed(2)} tonnes`,
      potentialSavings: `${criticalAlerts * 500} MAD`,
      peakDemand: `${peakDemand.toFixed(1)} kW`,
      activeMachines: safeData.machines.filter(
        (m) => m.status === "operational"
      ).length,
      alertsCount: safeData.alerts.length,
    };

    return {
      summaryStats,
      recommendations: data.recommendations,
      machineData,
      energyData: filteredEnergy,
      reportTitle: getReportTitle(config.template),
      dateRange: `${config.dateRange?.startDate} - ${config.dateRange?.endDate}`,
      generatedAt: new Date().toLocaleString("fr-FR"),
    };
  };

  const enhancedData = generateEnhancedData();

  // Utility functions
  const getStatusInFrench = (status) => {
    const statusMap = {
      operational: "Opérationnel",
      alert: "En Alerte",
      maintenance: "Maintenance",
      inactive: "Inactif",
      optimal: "Optimal",
      unknown: "Inconnu",
    };
    return statusMap[status] || status;
  };

  const getSeverityInFrench = (severity) => {
    const severityMap = {
      critical: "Critique",
      warning: "Avertissement",
      info: "Information",
    };
    return severityMap[severity] || severity;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête du rapport */}
        <View style={styles.header}>
          <Text style={styles.title}>EnergieAI</Text>
          <Text style={styles.subtitle}>
            {enhancedData?.reportTitle || config.title}
          </Text>
          <Text style={styles.headerInfo}>
            Période: {enhancedData?.dateRange}
          </Text>
          <Text style={styles.headerInfo}>Généré le {currentDate}</Text>
          <Text style={styles.headerInfo}>
            Audit Énergétique Intelligent - Système de Surveillance Automatisé
          </Text>
        </View>

        {/* Résumé exécutif amélioré */}
        {config.includeSummary && enhancedData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RÉSUMÉ EXÉCUTIF</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Consommation Totale</Text>
                <Text style={styles.metricValue}>
                  {enhancedData.summaryStats.totalConsumption}
                </Text>
                <Text style={styles.metricSubtitle}>Période analysée</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Coût Total</Text>
                <Text style={styles.metricValue}>
                  {enhancedData.summaryStats.totalCost}
                </Text>
                <Text style={styles.metricSubtitle}>Facture énergétique</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Efficacité Moyenne</Text>
                <Text style={styles.metricValue}>
                  {enhancedData.summaryStats.averageEfficiency}
                </Text>
                <Text style={styles.metricSubtitle}>Performance globale</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Empreinte CO2</Text>
                <Text style={styles.metricValue}>
                  {enhancedData.summaryStats.co2Footprint}
                </Text>
                <Text style={styles.metricSubtitle}>
                  Impact environnemental
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Demande de Pointe</Text>
                <Text style={styles.metricValue}>
                  {enhancedData.summaryStats.peakDemand}
                </Text>
                <Text style={styles.metricSubtitle}>Pic de consommation</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Économies Potentielles</Text>
                <Text style={styles.metricValue}>
                  {enhancedData.summaryStats.potentialSavings}
                </Text>
                <Text style={styles.metricSubtitle}>Optimisation possible</Text>
              </View>
            </View>
          </View>
        )}

        {/* État des machines amélioré */}
        {config.sections.includes("machines") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ANALYSE DES ÉQUIPEMENTS</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Machine</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Statut</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Puissance (kW)</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Efficacité (%)</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Température (°C)</Text>
                </View>
              </View>
              {safeData.machines.map((machine, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {machine.name || `Machine-${index + 1}`}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {getStatusInFrench(machine.status)}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {machine.currentPower || 0}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {machine.efficiency || 0}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {machine.temperature || "N/A"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Résumé des machines */}
            <View
              style={{ marginTop: 10, padding: 8, backgroundColor: "#f8fafc" }}
            >
              <Text style={{ fontSize: 9, marginBottom: 3 }}>
                <Text style={{ fontWeight: "bold" }}>Résumé:</Text>{" "}
                {safeData.machines.length} équipements surveillés
              </Text>
              <Text style={{ fontSize: 9, marginBottom: 3 }}>
                • Opérationnels:{" "}
                {
                  safeData.machines.filter((m) => m.status === "operational")
                    .length
                }
              </Text>
              <Text style={{ fontSize: 9 }}>
                • En maintenance:{" "}
                {
                  safeData.machines.filter((m) => m.status === "maintenance")
                    .length
                }
              </Text>
            </View>
          </View>
        )}

        {/* Alertes améliorées */}
        {config.sections.includes("alerts") && safeData.alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ALERTES ET INCIDENTS</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Priorité</Text>
                </View>
                <View style={[styles.tableColHeader, styles.tableColWide]}>
                  <Text style={styles.tableCellHeader}>Description</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Machine</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Date</Text>
                </View>
              </View>
              {safeData.alerts.slice(0, 10).map((alert, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {getSeverityInFrench(alert.severity)}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, styles.tableColWide]}>
                    <Text style={styles.tableCell}>
                      {alert.title || alert.message || "Alerte système"}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {safeData.machines.find((m) => m.id === alert.machine_id)
                        ?.name || alert.machine_id}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {format(new Date(alert.timestamp), "dd/MM", {
                        locale: fr,
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recommandations IA */}
        {enhancedData && enhancedData.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              RECOMMANDATIONS INTELLIGENTES
            </Text>
            <View
              style={{
                padding: 12,
                backgroundColor: "#f0f9ff",
                borderRadius: 4,
                border: "1px solid #bae6fd",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  marginBottom: 10,
                  fontWeight: "bold",
                  color: "#0369a1",
                }}
              >
                Analyse IA - Optimisations suggérées basées sur les données
                collectées:
              </Text>
              {enhancedData.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationBullet} />
                  <Text style={styles.recommendationText}>{rec.text}</Text>
                  <Text style={styles.recommendationSavings}>
                    Économies estimées: {rec.savings}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Analyse énergétique détaillée */}
        {config.sections.includes("energy") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ANALYSE ÉNERGÉTIQUE DÉTAILLÉE
            </Text>

            {config.includeCharts && (
              <View style={styles.chartPlaceholder}>
                <Text
                  style={{ fontSize: 10, color: "#64748b", marginBottom: 5 }}
                >
                  Graphique de Consommation Énergétique
                </Text>
                <Text style={{ fontSize: 8, color: "#94a3b8" }}>
                  [Visualisation des données de consommation sur la période
                  analysée]
                </Text>
                <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 5 }}>
                  Tendance: {enhancedData?.summaryStats.totalConsumption} sur{" "}
                  {enhancedData?.dateRange}
                </Text>
              </View>
            )}

            <View style={{ marginTop: 10 }}>
              <Text
                style={{ fontSize: 10, marginBottom: 5, fontWeight: "bold" }}
              >
                Analyse de Performance:
              </Text>
              <Text style={{ fontSize: 9, marginBottom: 3 }}>
                • Consommation totale:{" "}
                {enhancedData?.summaryStats.totalConsumption || "0 kWh"}
              </Text>
              <Text style={{ fontSize: 9, marginBottom: 3 }}>
                • Coût énergétique:{" "}
                {enhancedData?.summaryStats.totalCost || "0 MAD"}
              </Text>
              <Text style={{ fontSize: 9, marginBottom: 3 }}>
                • Efficacité moyenne du parc:{" "}
                {enhancedData?.summaryStats.averageEfficiency || "0%"}
              </Text>
              <Text style={{ fontSize: 9 }}>
                • Impact environnemental:{" "}
                {enhancedData?.summaryStats.co2Footprint || "0 tonnes"} CO2
              </Text>
            </View>
          </View>
        )}

        {/* Pied de page amélioré */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 3 }}>
            Rapport généré automatiquement par EnergieAI - Système de
            Surveillance Énergétique Intelligent
          </Text>
          <Text style={{ marginBottom: 3 }}>
            Données collectées et analysées le {enhancedData?.generatedAt}
          </Text>
          <Text style={{ fontSize: 7, color: "#94a3b8" }}>
            Pour assistance technique: support@energieai.ma | Version{" "}
            {new Date().getFullYear()}.1
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} sur ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>
    </Document>
  );
};

export default EnergyReportPDF;
