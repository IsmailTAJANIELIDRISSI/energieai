import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsSidebar from './components/MetricsSidebar';
import FilterToolbar from './components/FilterToolbar';
import EnergyChart from './components/EnergyChart';
import ForecastingPanel from './components/ForecastingPanel';
import DrillDownModal from './components/DrillDownModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EnergyAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  
  // Chart and filter states
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMachines, setSelectedMachines] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('consumption');
  const [showComparison, setShowComparison] = useState(true);
  
  // Modal state
  const [drillDownModal, setDrillDownModal] = useState({
    isOpen: false,
    selectedMachine: null,
    machineData: null
  });

  // Mock data for energy analytics
  const energyData = [
    {
      date: "2025-01-01",
      consumption: 2400,
      cost: 3600.00,
      efficiency: 85,
      co2: 1200,
      staticAudit: 2800
    },
    {
      date: "2025-01-02",
      consumption: 2200,
      cost: 3300.00,
      efficiency: 88,
      co2: 1100,
      staticAudit: 2750
    },
    {
      date: "2025-01-03",
      consumption: 2600,
      cost: 3900.00,
      efficiency: 82,
      co2: 1300,
      staticAudit: 2900
    },
    {
      date: "2025-01-04",
      consumption: 2300,
      cost: 3450.00,
      efficiency: 87,
      co2: 1150,
      staticAudit: 2700
    },
    {
      date: "2025-01-05",
      consumption: 2500,
      cost: 3750.00,
      efficiency: 84,
      co2: 1250,
      staticAudit: 2850
    },
    {
      date: "2025-01-06",
      consumption: 2100,
      cost: 3150.00,
      efficiency: 90,
      co2: 1050,
      staticAudit: 2650
    },
    {
      date: "2025-01-07",
      consumption: 2350,
      cost: 3525.00,
      efficiency: 86,
      co2: 1175,
      staticAudit: 2725
    }
  ];

  const forecastData = [
    {
      date: "2025-01-08",
      predicted: 2400,
      upperBound: 2600,
      lowerBound: 2200
    },
    {
      date: "2025-01-09",
      predicted: 2450,
      upperBound: 2650,
      lowerBound: 2250
    },
    {
      date: "2025-01-10",
      predicted: 2380,
      upperBound: 2580,
      lowerBound: 2180
    },
    {
      date: "2025-01-11",
      predicted: 2520,
      upperBound: 2720,
      lowerBound: 2320
    },
    {
      date: "2025-01-12",
      predicted: 2600,
      upperBound: 2800,
      lowerBound: 2400
    },
    {
      date: "2025-01-13",
      predicted: 2480,
      upperBound: 2680,
      lowerBound: 2280
    },
    {
      date: "2025-01-14",
      predicted: 2420,
      upperBound: 2620,
      lowerBound: 2220
    }
  ];

  const mockMachineData = {
    totalConsumption: 15680,
    totalCost: 23520.00,
    averageEfficiency: 86,
    operatingHours: 168,
    hourlyData: [
      { hour: "00h", consumption: 180 },
      { hour: "04h", consumption: 220 },
      { hour: "08h", consumption: 380 },
      { hour: "12h", consumption: 420 },
      { hour: "16h", consumption: 390 },
      { hour: "20h", consumption: 280 }
    ],
    efficiencyDistribution: [
      { name: "Excellent (90-100%)", value: 25 },
      { name: "Bon (80-89%)", value: 45 },
      { name: "Moyen (70-79%)", value: 20 },
      { name: "Faible (60-69%)", value: 8 },
      { name: "Critique (<60%)", value: 2 }
    ],
    recommendations: [
      {
        title: "Optimisation des heures de pointe",
        description: "Décaler certaines opérations pour éviter les heures de pointe tarifaires",
        savings: "850 MAD/mois",
        priority: "high"
      },
      {
        title: "Maintenance préventive",
        description: "Planifier une maintenance pour améliorer l'efficacité énergétique",
        savings: "1200 MAD/mois",
        priority: "medium"
      }
    ]
  };

  // Calculate metrics
  const totalConsumption = energyData.reduce((sum, item) => sum + item.consumption, 0);
  const averageCost = energyData.reduce((sum, item) => sum + item.cost, 0) / energyData.length;
  const efficiency = Math.round(energyData.reduce((sum, item) => sum + item.efficiency, 0) / energyData.length);
  const co2Footprint = energyData.reduce((sum, item) => sum + item.co2, 0);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Simulate data loading
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données analytiques');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleExportPDF = () => {
    // Mock PDF export functionality
    console.log('Exporting analytics report to PDF...');
    // In real implementation, would use jsPDF to generate report
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDrillDown = (machineName) => {
    setDrillDownModal({
      isOpen: true,
      selectedMachine: machineName,
      machineData: mockMachineData
    });
  };

  const closeDrillDownModal = () => {
    setDrillDownModal({
      isOpen: false,
      selectedMachine: null,
      machineData: null
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
              <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Erreur de Chargement</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} iconName="RotateCcw" iconPosition="left">
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Icon name="BarChart3" size={28} className="mr-3 text-primary" />
                  Analyses Énergétiques
                </h1>
                <p className="text-muted-foreground mt-1">
                  Visualisation historique et prévisions pour l'optimisation énergétique
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
                  onClick={() => handleDrillDown('Ligne de Production A')}
                >
                  Analyse Détaillée
                </Button>
              </div>
            </div>

            {/* Filter Toolbar */}
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar */}
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

              {/* Main Chart Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-10 space-y-6"
              >
                <EnergyChart
                  data={energyData}
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

            {/* Savings Summary */}
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
                    <div className="text-2xl font-bold text-green-600">15.3%</div>
                    <div className="text-sm text-muted-foreground">Réduction des coûts</div>
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

      {/* Drill Down Modal */}
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