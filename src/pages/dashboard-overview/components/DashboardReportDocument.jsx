// Create a new file: DashboardReportDocument.jsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e293b",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  metricCard: {
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    width: "48%",
  },
  metricTitle: {
    fontSize: 10,
    color: "white",
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: "center",
    color: "#64748b",
  },
});

const DashboardReportDocument = ({ machines, energyData, alerts, metrics }) => {
  const currentDate = format(new Date(), "PPPP", { locale: fr });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rapport Énergétique</Text>
          <Text style={styles.subtitle}>
            Usine Intelligente - Analyse de Performance
          </Text>
          <Text style={styles.subtitle}>Généré le {currentDate}</Text>
        </View>

        {/* Metrics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Résumé Exécutif</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Consommation Actuelle</Text>
              <Text style={styles.metricValue}>
                {metrics.currentConsumption?.toFixed(1) || 0} kWh
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: "#22c55e" }]}>
              <Text style={styles.metricTitle}>Coût Journalier</Text>
              <Text style={styles.metricValue}>
                {metrics.dailyCost?.toFixed(2) || 0} MAD
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: "#f97316" }]}>
              <Text style={styles.metricTitle}>Efficacité Globale</Text>
              <Text style={styles.metricValue}>
                {metrics.efficiency?.toFixed(1) || 0}%
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: "#22c55e" }]}>
              <Text style={styles.metricTitle}>Empreinte CO₂</Text>
              <Text style={styles.metricValue}>
                {metrics.co2Footprint?.toFixed(1) || 0} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Machines Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏭 État des Machines</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, { backgroundColor: "#3b82f6" }]}>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Machine
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Statut
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Puissance
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Efficacité
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Température
                </Text>
              </View>
            </View>

            {/* Table Body */}
            {machines.map((machine, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{machine.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {getStatusInFrench(machine.status)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {machine.currentPower || 0} kW
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {machine.efficiency || 0}%
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {machine.temperature || 0}°C
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Alerts Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Alertes Récentes</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, { backgroundColor: "#f97316" }]}>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Priorité
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Titre
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Machine
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Date
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={[
                    styles.tableCell,
                    { color: "white", fontWeight: "bold" },
                  ]}
                >
                  Action
                </Text>
              </View>
            </View>

            {/* Table Body */}
            {alerts.slice(0, 10).map((alert, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {getSeverityInFrench(alert.severity)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {alert.title || "Sans titre"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {machines.find((m) => m.id === alert.machine_id)?.name ||
                      alert.machine_id}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {format(new Date(alert.timestamp), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {alert.action || "Aucune action"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Rapport généré automatiquement par le système de surveillance
            énergétique
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

// Helper functions
function getStatusInFrench(status) {
  const statusMap = {
    operational: "Opérationnel",
    optimal: "Optimal",
    alert: "En Alerte",
    maintenance: "Maintenance",
    inactive: "Inactif",
  };
  return statusMap[status] || "Inconnu";
}

function getSeverityInFrench(severity) {
  const severityMap = {
    critical: "Critique",
    warning: "Avertissement",
    info: "Information",
  };
  return severityMap[severity] || "Normal";
}

export default DashboardReportDocument;
