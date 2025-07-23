import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ReportBuilder from './components/ReportBuilder';
import ReportPreview from './components/ReportPreview';
import ReportHistory from './components/ReportHistory';
import ScheduledReports from './components/ScheduledReports';

const ReportsExport = () => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [activeTab, setActiveTab] = useState('builder');
  const [reportConfig, setReportConfig] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const breadcrumbItems = [
    { label: 'Accueil', path: '/dashboard-overview', icon: 'Home' },
    { label: 'Rapports et Export', path: '/reports-export', icon: 'Download' }
  ];

  const tabs = [
    {
      id: 'builder',
      label: 'Générateur',
      icon: 'FileText',
      description: 'Créer un nouveau rapport'
    },
    {
      id: 'history',
      label: 'Historique',
      icon: 'History',
      description: 'Rapports générés'
    },
    {
      id: 'scheduled',
      label: 'Programmés',
      icon: 'Clock',
      description: 'Rapports automatiques'
    }
  ];

  const handleReportConfigChange = (config) => {
    setReportConfig(config);
  };

  const handleGenerateReport = async (config, previewData) => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation with jsPDF
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock PDF download
      const reportTitle = `Rapport_EnergieAI_${new Date().toISOString().split('T')[0]}.${config.format}`;
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.download = reportTitle;
      link.click();
      
      // Show success notification
      alert(`Rapport généré avec succès: ${reportTitle}`);
      
      // Switch to history tab to show the new report
      setActiveTab('history');
      
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Erreur lors de la génération du rapport. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewReport = (report) => {
    // Simulate opening report in new tab
    window.open('#', '_blank');
  };

  const handleDeleteReport = (reportId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      console.log('Suppression du rapport:', reportId);
      // In real app, this would call an API
    }
  };

  const handleCreateSchedule = (scheduleData) => {
    console.log('Création du planning:', scheduleData);
    alert('Planning créé avec succès !');
  };

  const handleUpdateSchedule = (scheduleId, scheduleData) => {
    console.log('Mise à jour du planning:', scheduleId, scheduleData);
    alert('Planning mis à jour avec succès !');
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce planning ?')) {
      console.log('Suppression du planning:', scheduleId);
      alert('Planning supprimé avec succès !');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
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
            {/* Page Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-energy-primary rounded-xl flex items-center justify-center">
                    <Icon name="Download" size={24} color="white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Rapports & Export</h1>
                    <p className="text-muted-foreground mt-1">
                      Génération et gestion des rapports énergétiques pour la conformité et l'analyse stratégique
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">Dernière mise à jour</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date().toLocaleString('fr-FR')}
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

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">47</div>
                    <div className="text-sm text-muted-foreground">Rapports Générés</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Download" size={20} className="text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">156</div>
                    <div className="text-sm text-muted-foreground">Téléchargements</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">8</div>
                    <div className="text-sm text-muted-foreground">Plannings Actifs</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">98%</div>
                    <div className="text-sm text-muted-foreground">Taux de Succès</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-card border border-border rounded-lg p-2">
                <div className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} />
                      <div className="text-left">
                        <div>{tab.label}</div>
                        <div className="text-xs opacity-80">{tab.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div variants={itemVariants} className="min-h-[600px]">
              {activeTab === 'builder' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ReportBuilder
                    onReportConfigChange={handleReportConfigChange}
                    selectedConfig={reportConfig}
                  />
                  <ReportPreview
                    reportConfig={reportConfig}
                    onGenerateReport={handleGenerateReport}
                  />
                </div>
              )}

              {activeTab === 'history' && (
                <ReportHistory
                  onViewReport={handleViewReport}
                  onDeleteReport={handleDeleteReport}
                />
              )}

              {activeTab === 'scheduled' && (
                <ScheduledReports
                  onCreateSchedule={handleCreateSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                />
              )}
            </motion.div>

            {/* Loading Overlay */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md mx-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileText" size={32} className="text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Génération en cours...</h3>
                  <p className="text-muted-foreground mb-4">
                    Création de votre rapport personnalisé avec les données énergétiques
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
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