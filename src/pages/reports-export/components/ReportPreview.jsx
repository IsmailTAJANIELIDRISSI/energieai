import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportPreview = ({ reportConfig, onGenerateReport }) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for preview
  const mockEnergyData = [
    { date: '01/01', consumption: 1250, cost: 2875 },
    { date: '02/01', consumption: 1180, cost: 2714 },
    { date: '03/01', consumption: 1320, cost: 3036 },
    { date: '04/01', consumption: 1290, cost: 2967 },
    { date: '05/01', consumption: 1150, cost: 2645 },
    { date: '06/01', consumption: 1380, cost: 3174 },
    { date: '07/01', consumption: 1220, cost: 2806 }
  ];

  const mockMachineData = [
    { name: 'Ligne Production 1', value: 35, color: '#2563eb' },
    { name: 'Ligne Production 2', value: 28, color: '#16a34a' },
    { name: 'Compresseur', value: 20, color: '#ea580c' },
    { name: 'HVAC', value: 12, color: '#d97706' },
    { name: 'Éclairage', value: 5, color: '#0ea5e9' }
  ];

  const mockSummaryStats = {
    totalConsumption: '8,790 kWh',
    totalCost: '20,217 MAD',
    averageEfficiency: '87.3%',
    co2Footprint: '4.2 tonnes',
    potentialSavings: '3,032 MAD',
    peakDemand: '145 kW'
  };

  useEffect(() => {
    // Simulate data loading based on config
    const timer = setTimeout(() => {
      setPreviewData({
        energyData: mockEnergyData,
        machineData: mockMachineData,
        summaryStats: mockSummaryStats,
        generatedAt: new Date().toLocaleString('fr-FR'),
        reportTitle: getReportTitle(reportConfig.template),
        dateRange: `${reportConfig.dateRange.startDate} - ${reportConfig.dateRange.endDate}`
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [reportConfig]);

  const getReportTitle = (template) => {
    const titles = {
      daily: 'Rapport Énergétique Quotidien',
      weekly: 'Rapport Énergétique Hebdomadaire',
      monthly: 'Rapport Énergétique Mensuel',
      annual: 'Bilan Énergétique Annuel',
      compliance: 'Rapport de Conformité Réglementaire',
      'cost-analysis': 'Analyse des Coûts Énergétiques'
    };
    return titles[template] || 'Rapport Énergétique';
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call parent function to handle actual generation
    onGenerateReport(reportConfig, previewData);
    
    setIsGenerating(false);
  };

  if (!previewData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Génération de l'aperçu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} className="text-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Aperçu du Rapport</h2>
              <p className="text-sm text-muted-foreground">Prévisualisation avant génération</p>
            </div>
          </div>
          <Button
            variant="default"
            onClick={handleGenerateReport}
            loading={isGenerating}
            iconName="Download"
            iconPosition="left"
          >
            {isGenerating ? 'Génération...' : 'Générer Rapport'}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        <div className="space-y-6">
          {/* Report Header */}
          <div className="text-center border-b border-border pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-energy-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EnergieAI</h1>
                <p className="text-sm text-muted-foreground">Audit Énergétique Intelligent</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{previewData.reportTitle}</h2>
            <p className="text-muted-foreground">Période: {previewData.dateRange}</p>
            <p className="text-sm text-muted-foreground">Généré le: {previewData.generatedAt}</p>
          </div>

          {/* Executive Summary */}
          {reportConfig.includeSummary && (
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
                Résumé Exécutif
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{previewData.summaryStats.totalConsumption}</div>
                  <div className="text-sm text-muted-foreground">Consommation Totale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{previewData.summaryStats.totalCost}</div>
                  <div className="text-sm text-muted-foreground">Coût Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-energy-primary">{previewData.summaryStats.averageEfficiency}</div>
                  <div className="text-sm text-muted-foreground">Efficacité Moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{previewData.summaryStats.co2Footprint}</div>
                  <div className="text-sm text-muted-foreground">Empreinte CO2</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{previewData.summaryStats.potentialSavings}</div>
                  <div className="text-sm text-muted-foreground">Économies Potentielles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-error">{previewData.summaryStats.peakDemand}</div>
                  <div className="text-sm text-muted-foreground">Demande de Pointe</div>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          {reportConfig.includeCharts && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
                Visualisations des Données
              </h3>

              {/* Energy Consumption Chart */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="text-md font-medium text-foreground mb-4">Consommation Énergétique Quotidienne</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={previewData.energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [
                          name === 'consumption' ? `${value} kWh` : `${value} MAD`,
                          name === 'consumption' ? 'Consommation' : 'Coût'
                        ]}
                      />
                      <Bar dataKey="consumption" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Machine Distribution Chart */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="text-md font-medium text-foreground mb-4">Répartition par Machine (%)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={previewData.machineData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {previewData.machineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Trend Chart */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="text-md font-medium text-foreground mb-4">Évolution des Coûts (MAD)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={previewData.energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value} MAD`, 'Coût']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cost" 
                        stroke="#16a34a" 
                        strokeWidth={3}
                        dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Lightbulb" size={20} className="mr-2 text-accent" />
              Recommandations Principales
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Optimisation des heures de pointe</p>
                  <p className="text-xs text-muted-foreground">Économies potentielles: 1,250 MAD/mois</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="AlertTriangle" size={14} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Maintenance préventive requise</p>
                  <p className="text-xs text-muted-foreground">Compresseur principal - Efficacité en baisse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Zap" size={14} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Amélioration du facteur de puissance</p>
                  <p className="text-xs text-muted-foreground">Installation de condensateurs recommandée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p>Ce rapport a été généré automatiquement par EnergieAI</p>
            <p>Pour plus d'informations, contactez support@energieai.ma</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;