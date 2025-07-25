import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";
import MetricsCard from "./components/MetricsCard";
import EnergyChart from "./components/EnergyChart";
import AlertsPanel from "./components/AlertsPanel";
import MachineStatusGrid from "./components/MachineStatusGrid";
import QuickActions from "./components/QuickActions";
import CostAnalysis from "./components/CostAnalysis";
import {
  calculateMetrics,
  calculateCostDistribution,
} from "../../utils/energyCalculations";

// Debug environment variables
console.log("All Vite env vars:", import.meta.env);

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
    console.log("fetching data");

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [energyRes, machinesRes, alertsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/alerts`),
        ]);

        // Calculate metrics
        const metrics = calculateMetrics(energyRes.data, machinesRes.data);
        setMetrics(metrics);

        // Transform energy data for chart
        const transformedEnergyData = energyRes.data.map((entry) => ({
          time: new Date(entry.timestamp).toISOString().slice(11, 13),
          consumption: entry.power_usage_kW,
          target:
            parseFloat(
              machinesRes.data
                .find((m) => m.id == entry.machine_id)
                ?.normalConsumption.split("-")[1]
            ) || entry.power_usage_kW * 1.1,
        }));

        setEnergyData(transformedEnergyData);
        console.log(alertsRes.data);

        // Transform alerts data
        const transformedAlerts = alertsRes.data.map((alert) => ({
          id: alert.id,
          severity: alert.severity,
          title: alert.title,
          message: alert.description,
          machine:
            machinesRes.data.find((m) => m.id === alert.machine_id)?.name ||
            alert.machine_id,
          timestamp: new Date(alert.timestamp),
          action: alert.action,
        }));
        setAlertsData(transformedAlerts);

        // Set machines data
        setMachinesData(
          machinesRes.data.map((machine) => ({
            id: machine.id,
            name: machine.name,
            status: machine.status,
            power: machine.currentPower,
            efficiency: machine.efficiency,
            temperature: machine.temperature,
            lastMaintenance: machine.lastMaintenance,
            alertMessage: machine.alertMessage,
          }))
        );
        console.log("hello");

        // Calculate cost distribution
        setCostData(
          calculateCostDistribution(energyRes.data, machinesRes.data)
        );

        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      fetchData();
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateReport = () => {
    navigate("/reports-export");
  };

  const handleViewRecommendations = () => {
    navigate("/recommendations-engine");
  };

  const handleExportData = async () => {
    try {
      const machinesRes = await axios.get(
        `${import.meta.env.VITE_JSON_SERVER_URL}/machines`
      );
      const csvData = [
        "Machine,Consommation (kWh),Efficacité (%),Statut",
        ...machinesRes.data.map(
          (machine) =>
            `${machine.name},${machine.currentPower},${machine.efficiency},${machine.status}`
        ),
      ].join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `energie-data-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors de l'exportation:", err);
    }
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
  console.log(metrics);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <div className="pt-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Tableau de Bord Énergétique
                </h1>
                <p className="text-slate-600">
                  Surveillance en temps réel de votre consommation énergétique
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-sm text-slate-500">
                Dernière mise à jour: {currentTime.toLocaleTimeString("fr-FR")}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Consommation Actuelle"
              value={metrics.currentConsumption.toFixed(1)}
              unit="kWh"
              change="+2.3%"
              changeType="positive"
              icon="Zap"
              color="info"
            />
            <MetricsCard
              title="Coût Journalier"
              value={formatCurrency(metrics.dailyCost)}
              change="-5.1%"
              changeType="positive"
              icon="DollarSign"
              color="success"
            />
            <MetricsCard
              title="Score d'Efficacité"
              value={metrics.efficiency.toFixed(1)}
              unit="%"
              change="+1.2%"
              changeType="positive"
              icon="Target"
              color="success"
            />
            <MetricsCard
              title="Empreinte CO₂"
              value={metrics.co2Footprint.toFixed(1)}
              unit="kg"
              change="-3.8%"
              changeType="positive"
              icon="Leaf"
              color="success"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <EnergyChart
                data={energyData}
                title="Consommation Énergétique (24h)"
              />
            </div>
            <div className="lg:col-span-1">
              <AlertsPanel alerts={alertsData} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <MachineStatusGrid machines={machinesData} />
            </div>
            <div className="lg:col-span-1">
              <CostAnalysis data={costData} />
            </div>
            <div className="lg:col-span-1">
              <QuickActions
                onGenerateReport={handleGenerateReport}
                onViewRecommendations={handleViewRecommendations}
                onExportData={handleExportData}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  15%
                </div>
                <div className="text-sm text-slate-600">
                  Économies Réalisées
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {machinesData.length}
                </div>
                <div className="text-sm text-slate-600">
                  Machines Surveillées
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-slate-600">
                  Surveillance Continue
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
