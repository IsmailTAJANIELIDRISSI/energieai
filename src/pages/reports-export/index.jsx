import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import ReportBuilder from "./components/ReportBuilder";
import ReportPreview from "./components/ReportPreview";
import ReportHistory from "./components/ReportHistory";
import ScheduledReports from "./components/ScheduledReports";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EnergyReportPDF from "./components/EnergyReportPDF";
import { pdf } from "@react-pdf/renderer";
import { createObjectURL } from "blob-util";
import ReactDOM from "react-dom";

const ReportsExport = () => {
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [activeTab, setActiveTab] = useState("builder");
  const [reportConfig, setReportConfig] = useState({
    title: "Rapport personnalisé",
    sections: ["summary", "machines", "alerts", "energy"], // Default sections
    dateRange: "lastMonth",
    // Add other default config properties as needed
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState({
    machines: [],
    energy: [],
    alerts: [],
    forecasts: [],
    recommendations: [],
    implementations: [],
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) setCurrentLanguage(savedLanguage);

    // Fetch data from multiple endpoints
    Promise.all([
      fetch("http://localhost:3005/machines").then((res) => res.json()),
      fetch("http://localhost:3005/energy").then((res) => res.json()),
      fetch("http://localhost:3005/alerts").then((res) => res.json()),
      fetch("http://localhost:3005/forecasts").then((res) => res.json()),
      fetch("http://localhost:3005/recommendations").then((res) => res.json()),
      fetch("http://localhost:3005/implementations").then((res) => res.json()),
    ])
      .then(
        ([
          machines,
          energy,
          alerts,
          forecasts,
          recommendations,
          implementations,
        ]) => {
          setData({
            machines,
            energy,
            alerts,
            forecasts,
            recommendations,
            implementations,
          });
        }
      )
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const breadcrumbItems = [
    { label: "Accueil", path: "/dashboard-overview", icon: "Home" },
    { label: "Rapports et Export", path: "/reports-export", icon: "Download" },
  ];

  const tabs = [
    {
      id: "builder",
      label: "Générateur",
      icon: "FileText",
      description: "Créer un nouveau rapport",
    },
    {
      id: "history",
      label: "Historique",
      icon: "History",
      description: "Rapports générés",
    },
    {
      id: "scheduled",
      label: "Programmés",
      icon: "Clock",
      description: "Rapports automatiques",
    },
  ];

  const handleReportConfigChange = (config) => setReportConfig(config);
  const handleGenerateReport = async (config, aiData) => {
    setIsGenerating(true);
    console.log(data);
    console.log(aiData);

    try {
      // Créer un blob du PDF
      const blob = await pdf(
        <EnergyReportPDF
          reportConfig={config}
          data={{
            ...aiData,
            machines: data.machines,
            energy: data.energy,
            alerts: data.alerts,
            forecasts: data.forecasts,
            recommendations: aiData.recommendations,
            implementations: data.implementations,
          }}
        />
      ).toBlob();

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Rapport_EnergieAI_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      // Mettre à jour l'interface
      setTimeout(() => {
        setActiveTab("history");
      }, 500);
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      alert("Erreur lors de la génération du rapport. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-8"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-energy-primary rounded-xl flex items-center justify-center">
                    <Icon
                      name="Download"
                      size={24}
                      color="white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Rapports & Export
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Génération et gestion des rapports énergétiques
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      Dernière mise à jour
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date().toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.reload()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="RefreshCw" size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {data.machines.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Machines Suivies
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Download" size={20} className="text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {data.energy.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Données Énergétiques
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {data.alerts.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Alertes Actives
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon
                      name="TrendingUp"
                      size={20}
                      className="text-warning"
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {data.machines.reduce(
                        (sum, m) => sum + (m.efficiency || 0),
                        0
                      ) / data.machines.length || 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Efficacité Moyenne
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-card border border-border rounded-lg p-2">
                <div className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <div className="text-left">
                        <div>{tab.label}</div>
                        <div className="text-xs opacity-80">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="min-h-[600px]">
              {activeTab === "builder" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ReportBuilder
                    onReportConfigChange={handleReportConfigChange}
                    selectedConfig={reportConfig}
                    machines={data.machines}
                  />
                  <ReportPreview
                    reportConfig={reportConfig}
                    onGenerateReport={handleGenerateReport}
                    energyData={data.energy}
                    machines={data.machines}
                    alerts={data.alerts}
                  />
                </div>
              )}
              {activeTab === "history" && (
                <ReportHistory
                  onViewReport={() => {}}
                  onDeleteReport={() => {}}
                  reports={data.energy}
                />
              )}
              {activeTab === "scheduled" && (
                <ScheduledReports
                  onCreateSchedule={() => {}}
                  onUpdateSchedule={() => {}}
                  onDeleteSchedule={() => {}}
                />
              )}
            </motion.div>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md mx-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon
                      name="FileText"
                      size={32}
                      className="text-primary animate-pulse"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Génération en cours...
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Création de votre rapport personnalisé
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cela peut prendre quelques instants...
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ReportsExport;
