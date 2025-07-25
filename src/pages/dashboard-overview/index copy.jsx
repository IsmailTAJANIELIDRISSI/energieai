import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import EnergyChart from './components/EnergyChart';
import AlertsPanel from './components/AlertsPanel';
import MachineStatusGrid from './components/MachineStatusGrid';
import QuickActions from './components/QuickActions';
import CostAnalysis from './components/CostAnalysis';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for metrics
  const [metrics, setMetrics] = useState({
    currentConsumption: 245.8,
    dailyCost: 1847.50,
    efficiencyScore: 87.3,
    co2Footprint: 156.2
  });

  // Mock data for energy chart
  const energyData = [
    { time: '00', consumption: 180, target: 200 },
    { time: '02', consumption: 165, target: 180 },
    { time: '04', consumption: 155, target: 170 },
    { time: '06', consumption: 220, target: 240 },
    { time: '08', consumption: 280, target: 260 },
    { time: '10', consumption: 310, target: 290 },
    { time: '12', consumption: 295, target: 280 },
    { time: '14', consumption: 320, target: 300 },
    { time: '16', consumption: 285, target: 270 },
    { time: '18', consumption: 250, target: 240 },
    { time: '20', consumption: 210, target: 220 },
    { time: '22', consumption: 190, target: 200 }
  ];

  // Mock alerts data
  const alertsData = [
    {
      id: 1,
      severity: 'critical',
      title: 'Surconsommation Détectée',
      message: 'La machine de découpe dépasse de 25% sa consommation normale',
      machine: 'Machine de Découpe #3',
      timestamp: new Date(Date.now() - 300000),
      action: 'Vérifier'
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Maintenance Programmée',
      message: 'Maintenance préventive requise dans 2 jours',
      machine: 'Compresseur Principal',
      timestamp: new Date(Date.now() - 900000),
      action: 'Planifier'
    },
    {
      id: 3,
      severity: 'info',
      title: 'Optimisation Disponible',
      message: 'Économies de 12% possibles avec ajustement des paramètres',
      timestamp: new Date(Date.now() - 1800000),
      action: 'Voir Détails'
    }
  ];

  // Mock machines data
  const machinesData = [
    {
      id: 1,
      name: 'Machine de Découpe #1',
      status: 'operational',
      power: 45.2,
      efficiency: 92,
      temperature: 68,
      lastMaintenance: '2025-01-15'
    },
    {
      id: 2,
      name: 'Compresseur Principal',
      status: 'operational',
      power: 78.5,
      efficiency: 89,
      temperature: 72,
      lastMaintenance: '2025-01-10'
    },
    {
      id: 3,
      name: 'Machine de Découpe #3',
      status: 'alert',
      power: 52.8,
      efficiency: 76,
      temperature: 85,
      lastMaintenance: '2024-12-20',
      alertMessage: 'Température élevée détectée'
    },
    {
      id: 4,
      name: 'Système de Refroidissement',
      status: 'maintenance',
      power: 0,
      efficiency: 0,
      temperature: 25,
      lastMaintenance: '2025-01-22'
    },
    {
      id: 5,
      name: 'Convoyeur #2',
      status: 'operational',
      power: 12.3,
      efficiency: 94,
      temperature: 45,
      lastMaintenance: '2025-01-18'
    },
    {
      id: 6,
      name: 'Machine d\'Emballage',
      status: 'inactive',
      power: 0,
      efficiency: 0,
      temperature: 22,
      lastMaintenance: '2025-01-05'
    }
  ];

  // Mock cost analysis data
  const costData = [
    { name: 'Machines de Production', value: 1200.50, percentage: 65 },
    { name: 'Éclairage', value: 285.30, percentage: 15 },
    { name: 'Climatisation', value: 231.20, percentage: 13 },
    { name: 'Équipements Auxiliaires', value: 130.50, percentage: 7 }
  ];

  // Auto-refresh data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time data updates
      setMetrics(prev => ({
        ...prev,
        currentConsumption: prev.currentConsumption + (Math.random() - 0.5) * 10,
        dailyCost: prev.dailyCost + (Math.random() - 0.5) * 50,
        efficiencyScore: Math.max(70, Math.min(95, prev.efficiencyScore + (Math.random() - 0.5) * 2)),
        co2Footprint: prev.co2Footprint + (Math.random() - 0.5) * 5
      }));
    }, 2000);

    // Initial loading
    setTimeout(() => setIsLoading(false), 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateReport = () => {
    navigate('/reports-export');
  };

  const handleViewRecommendations = () => {
    navigate('/recommendations-engine');
  };

  const handleExportData = () => {
    // Mock export functionality
    const csvData = `Machine,Consommation (kWh),Efficacité (%),Statut
Machine de Découpe #1,45.2,92,Opérationnel
Compresseur Principal,78.5,89,Opérationnel
Machine de Découpe #3,52.8,76,Alerte`;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energie-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          
          {/* Welcome Section */}
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
                Dernière mise à jour: {currentTime.toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
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
              value={metrics.efficiencyScore.toFixed(1)}
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Energy Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <EnergyChart 
                data={energyData} 
                title="Consommation Énergétique (24h)"
              />
            </div>

            {/* Alerts Panel */}
            <div className="lg:col-span-1">
              <AlertsPanel alerts={alertsData} />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Machine Status - Takes 2 columns */}
            <div className="lg:col-span-2">
              <MachineStatusGrid machines={machinesData} />
            </div>

            {/* Cost Analysis */}
            <div className="lg:col-span-1">
              <CostAnalysis data={costData} />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions
                onGenerateReport={handleGenerateReport}
                onViewRecommendations={handleViewRecommendations}
                onExportData={handleExportData}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">15%</div>
                <div className="text-sm text-slate-600">Économies Réalisées</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">6</div>
                <div className="text-sm text-slate-600">Machines Surveillées</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-slate-600">Surveillance Continue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;