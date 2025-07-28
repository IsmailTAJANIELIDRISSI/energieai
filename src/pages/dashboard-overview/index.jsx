import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Anthropic from "@anthropic-ai/sdk";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";
import MetricsCard from "./components/MetricsCard";
import EnergyChart from "./components/EnergyChart";
import AlertsPanel from "./components/AlertsPanel";
import MachineStatusGrid from "./components/MachineStatusGrid";
import QuickActions from "./components/QuickActions";
import CostAnalysis from "./components/CostAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateMetrics,
  calculateCostDistribution,
} from "../../utils/energyCalculations";
import Icon from "../../components/AppIcon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DashboardReportDocument from "./components/DashboardReportDocument";
import Button from "components/ui/Button";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Animation variants for sections sliding from sides
const sectionVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === "left" ? -50 : 50,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Animation variants for scale effect
const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Animation variants for summary stats
const statVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [energyData, setEnergyData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [machinesData, setMachinesData] = useState([]);
  const [costData, setCostData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize Anthropic client (put this outside your component)
        const anthropic = new Anthropic({
          apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
          dangerouslyAllowBrowser: true, // Required for browser usage
        });
        setIsLoading(true);
        const [energyRes, machinesRes, alertsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/alerts`),
        ]);

        const energyData = energyRes.data;
        const machines = machinesRes.data;

        // Generate AI alerts using Claude 4 Sonnet SDK
        const alertPrompt = `
        Vous êtes un agent intelligent dans une usine intelligente.
        Données énergétiques (dernières 5 entrées par machine) :
        \`\`\`json
        ${JSON.stringify(energyData.slice(-5 * machines.length), null, 2)}
        \`\`\`
        Machines :
        \`\`\`json
        ${JSON.stringify(machines, null, 2)}
        \`\`\`
        Analysez les données pour prédire des problèmes (ex. : surconsommation, surchauffe, maintenance nécessaire).
        Générez jusqu'à 3 alertes avec :
        - id: \`ALERT-AI-\${timestamp}-\${index}\`
        - severity: "critical", "warning", ou "info"
        - title: Titre court
        - description: 2-3 phrases décrivant le problème
        - machine_id: (ex. "COMP-001")
        - timestamp: ISO date
        - action: Action recommandée
        - generated_by: "Claude AI"
        Formattez en JSON uniquement, sans texte supplémentaire.
      `;

        const claudeAlertsResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: alertPrompt,
            },
          ],
        });

        const aiAlerts = JSON.parse(
          claudeAlertsResponse.content[0].text.replace(/```json|```/g, "")
        );

        const timestamp = Date.now();
        const formattedAiAlerts = aiAlerts.map((alert, index) => ({
          ...alert,
          id: `ALERT-AI-${timestamp}-${index}`,
          timestamp: new Date().toISOString(),
          generated_by: "Claude AI",
        }));

        // Save AI alerts to db.json
        await Promise.all(
          formattedAiAlerts.map((alert) =>
            axios.post(`${import.meta.env.VITE_JSON_SERVER_URL}/alerts`, alert)
          )
        );

        // Merge AI alerts with existing
        const allAlerts = [...alertsRes.data, ...formattedAiAlerts];

        // Calculate metrics with AI
        const metrics = await calculateMetrics(energyData, machines);
        setMetrics(metrics);

        // Transform energy data for chart
        const transformedEnergyData = energyData.map((entry) => ({
          time: new Date(entry.timestamp).toISOString().split("T")[0],
          consumption: entry.power_usage_kW,
          target:
            parseFloat(
              machines
                .find((m) => m.id == entry.machine_id)
                ?.normalConsumption.split("-")[1]
            ) || entry.power_usage_kW * 1.1,
        }));

        setEnergyData(transformedEnergyData);

        // Transform alerts data
        const transformedAlerts = allAlerts.map((alert) => ({
          id: alert.id,
          severity: alert.severity,
          title: alert.title,
          message: alert.description,
          machine:
            machines.find((m) => m.id === alert.machine_id)?.name ||
            alert.machine_id,
          timestamp: new Date(alert.timestamp),
          action: alert.action,
          generated_by: alert.generated_by,
        }));
        setAlertsData(transformedAlerts);

        // Generate machine updates using Claude 4 Sonnet SDK
        console.log(machines);

        const machinePrompt = `
        Vous êtes un agent intelligent surveillant une usine.
        Données énergétiques :
        \`\`\`json
        ${JSON.stringify(energyData.slice(-5 * machines.length), null, 2)}
        \`\`\`
        Machines :
        \`\`\`json
        ${JSON.stringify(machines, null, 2)}
        \`\`\`
        Pour chaque machine, prédisez :
        - id: Machine ID
        - status: "operational", "alert", "maintenance", ou "inactive"
        - alertMessage: Message décrivant le problème juste titre de 3 a 5 mots pas un texte long comme "Temperature elevé detecté" (si applicable, sinon vide)
        - generated_by: "Claude AI" (si modifié)
        Formattez en JSON uniquement, ne modifiez que les machines nécessitant un changement.
      `;

        const claudeMachinesResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: machinePrompt,
            },
          ],
        });

        const updatedMachines = JSON.parse(
          claudeMachinesResponse.content[0].text.replace(/```json|```/g, "")
        );
        console.log(updatedMachines);

        await Promise.all(
          updatedMachines.map((machine) =>
            axios.patch(
              `${import.meta.env.VITE_JSON_SERVER_URL}/machines/${machine.id}`,
              {
                status: machine.status,
                alertMessage: machine.alertMessage,
                generated_by: "Claude AI",
              }
            )
          )
        );

        setMachinesData(
          machines.map((machine) => ({
            ...machine,
            ...(updatedMachines.find((m) => m.id === machine.id) || {}),
            id: machine.id,
            name: machine.name,
            power: machine.currentPower,
            efficiency: machine.efficiency,
            temperature: machine.temperature,
            lastMaintenance: machine.lastMaintenance,
          }))
        );

        // Calculate cost distribution
        setCostData(calculateCostDistribution(energyData, machines));

        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données ou de l'IA");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      fetchData();
    }, 500_000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateReport = () => {
    navigate("/reports-export");
  };

  const handleViewRecommendations = () => {
    navigate("/recommendations-engine");
  };

  // ===================== PDF EXPORT (Rapport Professionnel) =====================
  const handleExportPDF = async () => {
    try {
      // Fetch all data
      const [machinesRes, energyRes, alertsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
        axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`),
        axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/alerts`),
      ]);

      const machines = machinesRes.data;
      const energyData = energyRes.data;
      const alerts = alertsRes.data;

      await generateProfessionalPDF(machines, energyData, alerts);
      console.log("Export PDF réussi !");
    } catch (err) {
      console.error("Erreur lors de l'exportation PDF:", err);
    }
  };

  const generateProfessionalPDF = async (machines, energyData, alerts) => {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    if (!pdf) throw new Error("PDF initialization failed");

    // 2. Set default font (important!)
    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    pdf.autoTable = autoTable;

    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Colors matching your app theme
    const colors = {
      primary: [59, 130, 246], // Blue
      secondary: [34, 197, 94], // Green
      accent: [249, 115, 22], // Orange
      text: [30, 41, 59], // Dark gray
      light: [248, 250, 252], // Light gray
      white: [255, 255, 255],
    };

    let yPosition = 20;

    // ===== HEADER =====
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 40, "F");

    pdf.setTextColor(...colors.white);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("RAPPORT ÉNERGÉTIQUE", 20, 25);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Usine Intelligente - Analyse de Performance", 20, 35);

    // Date and time
    const now = new Date();
    pdf.text(
      `Généré le ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString(
        "fr-FR"
      )}`,
      pageWidth - 80,
      35
    );

    yPosition = 60;

    // Reset text color
    pdf.setTextColor(...colors.text);

    // ===== RÉSUMÉ EXÉCUTIF =====
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("📊 RÉSUMÉ EXÉCUTIF", 20, yPosition);
    yPosition += 15;

    // Metrics cards
    const metricsData = [
      [
        "Consommation Actuelle",
        `${metrics.currentConsumption?.toFixed(1) || 0} kWh`,
        colors.primary,
      ],
      [
        "Coût Journalier",
        `${metrics.dailyCost?.toFixed(2) || 0} MAD`,
        colors.secondary,
      ],
      [
        "Efficacité Globale",
        `${metrics.efficiency?.toFixed(1) || 0}%`,
        colors.accent,
      ],
      [
        "Empreinte CO₂",
        `${metrics.co2Footprint?.toFixed(1) || 0} kg`,
        colors.secondary,
      ],
    ];

    metricsData.forEach((metric, index) => {
      const x = 20 + (index % 2) * 90;
      const y = yPosition + Math.floor(index / 2) * 25;

      pdf.setFillColor(...metric[2]);
      pdf.roundedRect(x, y, 80, 20, 3, 3, "F");

      pdf.setTextColor(...colors.white);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(metric[0], x + 5, y + 8);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(metric[1], x + 5, y + 16);
    });

    yPosition += 60;
    pdf.setTextColor(...colors.text);

    // ===== ÉTAT DES MACHINES =====
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("🏭 ÉTAT DES MACHINES", 20, yPosition);
    yPosition += 10;

    // Machines table
    const machineTableData = machines.map((machine) => [
      machine.name,
      getStatusInFrench(machine.status),
      `${machine.currentPower || 0} kW`,
      `${machine.efficiency || 0}%`,
      `${machine.temperature || 0}°C`,
      machine.alertMessage || "Aucune",
    ]);

    pdf.autoTable({
      startY: yPosition,
      head: [
        [
          "Machine",
          "Statut",
          "Puissance",
          "Efficacité",
          "Température",
          "Alerte",
        ],
      ],
      body: machineTableData,
      theme: "striped",
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.white,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: colors.text,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 20, right: 20 },
      didDrawCell: function (data) {
        if (data.column.index === 1 && data.cell.section === "body") {
          const status = data.cell.text[0];
          let fillColor = colors.secondary;
          if (status === "En Alerte") fillColor = colors.accent;
          if (status === "Maintenance") fillColor = [239, 68, 68];
          if (status === "Inactif") fillColor = [107, 114, 128];

          pdf.setFillColor(...fillColor);
          pdf.rect(
            data.cell.x + 1,
            data.cell.y + 1,
            data.cell.width - 2,
            data.cell.height - 2,
            "F"
          );
          pdf.setTextColor(...colors.white);
          pdf.text(
            status,
            data.cell.x + 2,
            data.cell.y + data.cell.height / 2 + 1
          );
        }
      },
    });

    yPosition = pdf.lastAutoTable.finalY + 20;

    // ===== ALERTES RÉCENTES =====
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("🚨 ALERTES RÉCENTES", 20, yPosition);
    yPosition += 10;

    const recentAlerts = alerts.slice(-10);
    const alertTableData = recentAlerts.map((alert) => [
      getSeverityInFrench(alert.severity),
      alert.title || "Sans titre",
      machines.find((m) => m.id === alert.machine_id)?.name || alert.machine_id,
      new Date(alert.timestamp).toLocaleDateString("fr-FR"),
      alert.action || "Aucune action",
    ]);

    pdf.autoTable({
      startY: yPosition,
      head: [["Priorité", "Titre", "Machine", "Date", "Action"]],
      body: alertTableData,
      theme: "striped",
      headStyles: {
        fillColor: colors.accent,
        textColor: colors.white,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: colors.text,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 20, right: 20 },
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.cell.section === "body") {
          const priority = data.cell.text[0];
          let fillColor = colors.secondary;
          if (priority === "Critique") fillColor = [239, 68, 68];
          if (priority === "Avertissement") fillColor = colors.accent;

          pdf.setFillColor(...fillColor);
          pdf.rect(
            data.cell.x + 1,
            data.cell.y + 1,
            data.cell.width - 2,
            data.cell.height - 2,
            "F"
          );
          pdf.setTextColor(...colors.white);
          pdf.text(
            priority,
            data.cell.x + 2,
            data.cell.y + data.cell.height / 2 + 1
          );
        }
      },
    });

    yPosition = pdf.lastAutoTable.finalY + 20;

    // ===== ANALYSE ÉNERGÉTIQUE =====
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("⚡ ANALYSE ÉNERGÉTIQUE", 20, yPosition);
    yPosition += 15;

    // Energy consumption chart (simple bars)
    const chartHeight = 60;
    const chartWidth = pageWidth - 40;
    const recentEnergyData = energyData.slice(-7);

    if (recentEnergyData.length > 0) {
      const maxConsumption = Math.max(
        ...recentEnergyData.map((e) => e.power_usage_kW)
      );
      const barWidth = chartWidth / recentEnergyData.length - 5;

      recentEnergyData.forEach((entry, index) => {
        const barHeight = (entry.power_usage_kW / maxConsumption) * chartHeight;
        const x = 20 + index * (barWidth + 5);
        const y = yPosition + chartHeight - barHeight;

        pdf.setFillColor(...colors.primary);
        pdf.rect(x, y, barWidth, barHeight, "F");

        // Labels
        pdf.setTextColor(...colors.text);
        pdf.setFontSize(8);
        pdf.text(`${entry.power_usage_kW}kW`, x, y - 2);
        pdf.text(
          new Date(entry.timestamp).toLocaleDateString("fr-FR"),
          x,
          yPosition + chartHeight + 8
        );
      });
    }

    yPosition += chartHeight + 20;

    // ===== RECOMMANDATIONS =====
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("💡 RECOMMANDATIONS", 20, yPosition);
    yPosition += 15;

    const recommendations = [
      "Programmer la maintenance préventive des machines en alerte",
      "Optimiser les cycles de fonctionnement pendant les heures creuses",
      "Surveiller de près les machines avec des variations de température",
      "Mettre en place un système d'alerte automatique pour les surconsommations",
    ];

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    recommendations.forEach((rec, index) => {
      pdf.text(`${index + 1}. ${rec}`, 25, yPosition);
      yPosition += 8;
    });

    // ===== FOOTER =====
    const footerY = pageHeight - 20;
    pdf.setFillColor(...colors.light);
    pdf.rect(0, footerY - 5, pageWidth, 25, "F");

    pdf.setTextColor(...colors.text);
    pdf.setFontSize(8);
    pdf.text(
      "Rapport généré automatiquement par le système de surveillance énergétique",
      20,
      footerY
    );
    pdf.text(
      `Page ${pdf.internal.getNumberOfPages()}`,
      pageWidth - 30,
      footerY
    );

    // Save PDF
    const fileName = `rapport-energetique-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);
  };

  const ExportPdfButton = () => (
    <PDFDownloadLink
      document={
        <DashboardReportDocument
          machines={machinesData}
          energyData={energyData}
          alerts={alertsData}
          metrics={metrics}
        />
      }
      fileName={`rapport-energetique-${
        new Date().toISOString().split("T")[0]
      }.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <Button
          variant="ghost"
          iconName="Download"
          iconSize={16}
          disabled={loading}
        >
          {loading ? "Génération..." : "Exporter PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );

  // ===== HELPER FUNCTIONS =====
  const getStatusCode = (status) => {
    const statusMap = {
      operational: "OPERATIONNEL",
      alert: "ALERTE",
      maintenance: "MAINTENANCE",
      inactive: "INACTIF",
    };
    return statusMap[status] || "INCONNU";
  };

  const getStatusInFrench = (status) => {
    const statusMap = {
      operational: "Opérationnel",
      alert: "En Alerte",
      maintenance: "Maintenance",
      inactive: "Inactif",
    };
    return statusMap[status] || "Inconnu";
  };

  const getSeverityCode = (severity) => {
    const severityMap = {
      critical: "CRITIQUE",
      warning: "AVERTISSEMENT",
      info: "INFORMATION",
    };
    return severityMap[severity] || "NORMAL";
  };

  const getSeverityInFrench = (severity) => {
    const severityMap = {
      critical: "Critique",
      warning: "Avertissement",
      info: "Information",
    };
    return severityMap[severity] || "Normal";
  };

  const getTimePeriod = (date) => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return "MATIN";
    if (hour >= 12 && hour < 18) return "APRES_MIDI";
    if (hour >= 18 && hour < 22) return "SOIR";
    return "NUIT";
  };

  // ===================== CSV EXPORT (Format Tableau) =====================
  const handleExportData = async () => {
    try {
      // Fetch all necessary data
      const [machinesRes, energyRes, alertsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
        axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`),
        axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/alerts`),
      ]);

      const machines = machinesRes.data;
      const energyData = energyRes.data;
      const alerts = alertsRes.data;

      // Generate CSV with proper columns
      const csvContent = generateTableFormatCSV(machines, energyData, alerts);

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donnees-energetiques-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("Export CSV réussi !");
    } catch (err) {
      console.error("Erreur lors de l'exportation CSV:", err);
    }
  };

  const generateTableFormatCSV = (machines, energyData, alerts) => {
    let csvContent = "";

    // Section 1: Métriques générales (format tableau)
    csvContent += `METRIQUES_GENERALES\n`;
    csvContent += `Type,Valeur,Unite,Statut,Date_Mesure\n`;
    csvContent += `Consommation_Totale,${
      metrics.currentConsumption?.toFixed(2) || 0
    },kWh,${
      metrics.currentConsumption > 100 ? "Elevee" : "Normale"
    },${new Date().toISOString()}\n`;
    csvContent += `Cout_Journalier,${metrics.dailyCost?.toFixed(2) || 0},MAD,${
      metrics.dailyCost > 1000 ? "Eleve" : "Acceptable"
    },${new Date().toISOString()}\n`;
    csvContent += `Efficacite_Globale,${
      metrics.efficiency?.toFixed(1) || 0
    },%,${
      metrics.efficiency > 80 ? "Excellent" : "Moyen"
    },${new Date().toISOString()}\n`;
    csvContent += `Empreinte_CO2,${metrics.co2Footprint?.toFixed(2) || 0},kg,${
      metrics.co2Footprint > 50 ? "Elevee" : "Acceptable"
    },${new Date().toISOString()}\n`;
    csvContent += `\n`;

    // Section 2: Détail machines (format tableau propre)
    csvContent += `DETAIL_MACHINES\n`;
    csvContent += `ID_Machine,Nom_Machine,Statut,Puissance_kW,Efficacite_Pct,Temperature_C,Consommation_Normale_kW,Date_Derniere_Maintenance,Message_Alerte,Source_Donnee,Date_Creation\n`;

    machines.forEach((machine) => {
      const normalConsumption = machine.normalConsumption?.split("-")[1] || "0";
      const lastMaintenance = machine.lastMaintenance
        ? new Date(machine.lastMaintenance).toISOString().split("T")[0]
        : "";
      const alertMessage = (machine.alertMessage || "").replace(/,/g, ";"); // Replace commas to avoid CSV issues
      const generatedBy = machine.generated_by || "Manuel";
      const status = getStatusInFrench(machine.status);

      csvContent += `${machine.id},${machine.name},${status},${
        machine.currentPower || 0
      },${machine.efficiency || 0},${
        machine.temperature || 0
      },${normalConsumption},${lastMaintenance},${alertMessage},${generatedBy},${
        new Date().toISOString().split("T")[0]
      }\n`;
    });

    csvContent += `\n`;

    // Section 3: Historique énergétique (10 dernières mesures)
    csvContent += `HISTORIQUE_ENERGETIQUE\n`;
    csvContent += `Date_Heure,ID_Machine,Nom_Machine,Consommation_kWh,Voltage_V,Intensite_A,Facteur_Puissance,Cout_Estime_MAD,Periode\n`;

    const recentEnergyData = energyData.slice(-20);
    recentEnergyData.forEach((entry) => {
      const machine = machines.find((m) => m.id === entry.machine_id);
      const machineName = machine
        ? machine.name.replace(/,/g, ";")
        : "Inconnue";
      const timestamp = new Date(entry.timestamp).toISOString();
      const estimatedCost = (entry.power_usage_kW * 1.2).toFixed(2);
      const periode = getTimePeriod(new Date(entry.timestamp));

      csvContent += `${timestamp},${entry.machine_id},${machineName},${
        entry.power_usage_kW || 0
      },${entry.voltage || 0},${entry.current || 0},${
        entry.power_factor || 1
      },${estimatedCost},${periode}\n`;
    });

    csvContent += `\n`;

    // Section 4: Alertes (format tableau)
    csvContent += `ALERTES_SYSTEME\n`;
    csvContent += `ID_Alerte,Type_Alerte,Titre,Description,ID_Machine,Nom_Machine,Niveau_Priorite,Action_Recommandee,Date_Generation,Heure_Generation,Source_Alerte,Statut_Traitement\n`;

    const sortedAlerts = alerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 25);

    sortedAlerts.forEach((alert) => {
      const machine = machines.find((m) => m.id === alert.machine_id);
      const machineName = machine
        ? machine.name.replace(/,/g, ";")
        : alert.machine_id;
      const alertDate = new Date(alert.timestamp).toISOString().split("T")[0];
      const alertTime = new Date(alert.timestamp)
        .toISOString()
        .split("T")[1]
        .split(".")[0];
      const severity = getSeverityCode(alert.severity);
      const source = alert.generated_by || "Manuel";
      const title = (alert.title || "").replace(/,/g, ";");
      const description = (alert.description || "").replace(/,/g, ";");
      const action = (alert.action || "Aucune").replace(/,/g, ";");

      csvContent += `${alert.id},${severity},${title},${description},${alert.machine_id},${machineName},${severity},${action},${alertDate},${alertTime},${source},En_Attente\n`;
    });

    return csvContent;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-slate-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-primary"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <div className="pt-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-6"
          >
            <div className="mb-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center">
                    <Icon
                      name="Settings"
                      size={28}
                      className="mr-3 text-primary"
                    />
                    Tableau de Bord Énergétique
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Surveillance en temps réel de votre consommation énergétique
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-4 sm:mt-0 text-sm text-muted-foreground"
                >
                  Dernière mise à jour:{" "}
                  {currentTime.toLocaleTimeString("fr-FR")}
                </motion.div>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={cardVariants}>
                <MetricsCard
                  title="Consommation Actuelle"
                  value={metrics.currentConsumption.toFixed(1)}
                  unit="kWh"
                  change="+2.3%"
                  changeType="positive"
                  icon="Zap"
                  color="info"
                />
              </motion.div>
              <motion.div variants={cardVariants}>
                <MetricsCard
                  title="Coût Journalier"
                  value={formatCurrency(metrics.dailyCost)}
                  change="-5.1%"
                  changeType="positive"
                  icon="DollarSign"
                  color="success"
                />
              </motion.div>
              <motion.div variants={cardVariants}>
                <MetricsCard
                  title="Score d'Efficacité"
                  value={metrics.efficiency.toFixed(1)}
                  unit="%"
                  change="+1.2%"
                  changeType="positive"
                  icon="Target"
                  color="success"
                />
              </motion.div>
              <motion.div variants={cardVariants}>
                <MetricsCard
                  title="Empreinte CO₂"
                  value={metrics.co2Footprint.toFixed(1)}
                  unit="kg"
                  change="-3.8%"
                  changeType="positive"
                  icon="Leaf"
                  color="success"
                />
              </motion.div>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom="left"
                className="lg:col-span-2"
              >
                <EnergyChart
                  data={energyData}
                  title="Consommation Énergétique (24h)"
                />
              </motion.div>
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom="right"
                className="lg:col-span-1"
              >
                <AlertsPanel alerts={alertsData} />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              <motion.div
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2"
              >
                <MachineStatusGrid machines={machinesData} />
              </motion.div>
              <motion.div
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1"
              >
                <CostAnalysis data={costData} />
              </motion.div>
              <motion.div
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1"
              >
                <QuickActions
                  onGenerateReport={handleGenerateReport}
                  onViewRecommendations={handleViewRecommendations}
                  onExportData={handleExportData}
                  ExportPdfButton={<ExportPdfButton />}
                />
              </motion.div>
            </div>
            <motion.div
              className="bg-white p-6 rounded-lg border border-slate-200 shadow-card mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <motion.div variants={statVariants}>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    15%
                  </div>
                  <div className="text-sm text-slate-600">
                    Économies Réalisées
                  </div>
                </motion.div>
                <motion.div variants={statVariants}>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {machinesData.length}
                  </div>
                  <div className="text-sm text-slate-600">
                    Machines Surveillées
                  </div>
                </motion.div>
                <motion.div variants={statVariants}>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-slate-600">
                    Surveillance Continue
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
