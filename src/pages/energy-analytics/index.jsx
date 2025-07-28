import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";
import MetricsSidebar from "./components/MetricsSidebar";
import FilterToolbar from "./components/FilterToolbar";
import EnergyChart from "./components/EnergyChart";
import ForecastingPanel from "./components/ForecastingPanel";
import DrillDownModal from "./components/DrillDownModal";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import {
  calculateMetrics,
  calculateMachineMetrics,
} from "../../utils/energyCalculations";

const EnergyAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMachines, setSelectedMachines] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("consumption");
  const [showComparison, setShowComparison] = useState(true);
  const [energyData, setEnergyData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [machines, setMachines] = useState([]);
  const [drillDownModal, setDrillDownModal] = useState({
    isOpen: false,
    selectedMachine: null,
    machineData: null,
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [energyRes, forecastRes, machinesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/forecasts`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
        ]);

        console.log("Fetched energyData:", energyRes.data);
        console.log("Fetched machines:", machinesRes.data);

        setEnergyData(
          energyRes.data.filter((entry) =>
            entry.timestamp.includes("T00:00:00Z")
          )
        );
        setForecastData(forecastRes.data);
        setMachines(machinesRes.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données analytiques");
        setLoading(false);
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const {
    currentConsumption,
    totalConsumption,
    averageCost,
    efficiency,
    co2Footprint,
  } = calculateMetrics(energyData, machines);

  const handleExportPDF = () => {
    console.log("Exporting analytics report to PDF...");
  };

  const handleRefresh = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`)
      .then((res) => {
        setEnergyData(
          res.data.filter((entry) => entry.timestamp.includes("T00:00:00Z"))
        );
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du rafraîchissement des données");
        setLoading(false);
      });
  };

  const handleDrillDown = async (machineName) => {
    try {
      const machine = machines.find((m) => m.name === machineName);
      if (!machine) {
        console.error(`Machine ${machineName} not found`);
        return;
      }
      const energyRes = await axios.get(
        `${import.meta.env.VITE_JSON_SERVER_URL}/energy?machine_id=${
          machine.id
        }`
      );
      const machineData = calculateMachineMetrics(energyRes.data, machine.id);
      machineData.recommendations = await axios
        .get(
          `${import.meta.env.VITE_JSON_SERVER_URL}/recommendations?machine_id=${
            machine.id
          }`
        )
        .then((res) =>
          res.data.map((rec) => ({
            title: rec.title,
            description: rec.description,
            savings: `${rec.potential_savings} MAD/mois`,
            priority: rec.priority,
          }))
        );
      setDrillDownModal({
        isOpen: true,
        selectedMachine: machineName,
        machineData,
      });
    } catch (err) {
      console.error("Erreur lors du drill-down:", err);
    }
  };

  const closeDrillDownModal = () => {
    setDrillDownModal({
      isOpen: false,
      selectedMachine: null,
      machineData: null,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-64 bg-muted rounded"></div>
                  <div className="h-48 bg-muted rounded"></div>
                </div>
                <div className="lg:col-span-10">
                  <div className="h-96 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <Icon
                name="AlertTriangle"
                size={48}
                className="text-error mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Erreur de Chargement
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={handleRefresh}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = energyData.map((item) => ({
    date: item.timestamp,
    consumption: item.power_usage_kW,
    cost: item.cost_mad,
    efficiency: item.efficiency_score,
    co2: item.co2 || 0, // Add default if co2 is missing
    staticAudit: item.static_audit_value || 0, // Add if you have comparison data
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4">
          <Breadcrumb />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Icon
                    name="BarChart3"
                    size={28}
                    className="mr-3 text-primary"
                  />
                  Analyses Énergétiques
                </h1>
                <p className="text-muted-foreground mt-1">
                  Visualisation historique et prévisions pour l'optimisation
                  énergétique
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant={showComparison ? "default" : "outline"}
                  size="sm"
                  iconName="GitCompare"
                  iconPosition="left"
                  onClick={() => setShowComparison(!showComparison)}
                >
                  Comparaison Audit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => handleDrillDown("Ligne de Production A")}
                >
                  Analyse Détaillée
                </Button>
              </div>
            </div>
            <FilterToolbar
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedMachines={selectedMachines}
              onMachineChange={setSelectedMachines}
              selectedMetric={selectedMetric}
              onMetricChange={setSelectedMetric}
              onExportPDF={handleExportPDF}
              onRefresh={handleRefresh}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <MetricsSidebar
                  totalConsumption={totalConsumption}
                  averageCost={averageCost}
                  efficiency={efficiency}
                  co2Footprint={co2Footprint}
                  selectedChartType={selectedChartType}
                  onChartTypeChange={setSelectedChartType}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-10 space-y-6"
              >
                <EnergyChart
                  data={chartData}
                  chartType={selectedChartType}
                  selectedMetric={selectedMetric}
                  showComparison={showComparison}
                />
                <ForecastingPanel
                  forecastData={forecastData}
                  confidenceLevel={85}
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <Icon name="TrendingDown" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Économies Réalisées vs Audit Statique
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Comparaison avec les prévisions d'audit traditionnel
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      15.3%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Réduction des coûts
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      4,250 MAD économisés
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <DrillDownModal
        isOpen={drillDownModal.isOpen}
        onClose={closeDrillDownModal}
        selectedMachine={drillDownModal.selectedMachine}
        machineData={drillDownModal.machineData}
      />
    </div>
  );
};

export default EnergyAnalytics;
