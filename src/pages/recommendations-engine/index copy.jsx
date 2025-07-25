import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import RecommendationCard from './components/RecommendationCard';
import FilterPanel from './components/FilterPanel';
import ImplementationTracker from './components/ImplementationTracker';
import RecommendationModal from './components/RecommendationModal';

const RecommendationsEngine = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [implementations, setImplementations] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: 'potentialSavings',
    priority: '',
    difficulty: '',
    machineId: '',
    category: '',
    minSavings: '',
    maxPayback: '',
    quickFilter: ''
  });
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  // Mock recommendations data
  const mockRecommendations = [
    {
      id: 'REC-001',
      title: 'Optimisation du Compresseur Principal',
      description: `Le compresseur principal COMP-001 fonctionne à 85% de sa capacité en permanence, même pendant les périodes de faible demande. L'installation d'un variateur de fréquence permettrait d'ajuster automatiquement la vitesse selon les besoins réels de production.\n\nCette optimisation réduirait significativement la consommation énergétique pendant les heures creuses et améliorerait la durée de vie de l'équipement.`,
      icon: 'Settings',
      priority: 'Élevée',
      difficulty: 'Modérée',
      machineId: 'COMP-001',
      category: 'optimization',
      potentialSavings: 2850,
      paybackPeriod: 8,
      energyReduction: 22,
      implementationCost: 18500,
      generatedAt: new Date('2025-01-20'),
      implementationSteps: [
        'Arrêt programmé du compresseur pendant une fenêtre de maintenance',
        'Installation du variateur de fréquence par un technicien certifié',
        'Configuration des paramètres de régulation automatique',
        'Tests de fonctionnement et calibrage des seuils',
        'Formation de l\'équipe de maintenance sur le nouveau système',
        'Mise en service progressive avec surveillance continue'
      ],
      supportingData: `Analyse des données de consommation sur 3 mois : consommation moyenne de 145 kWh/jour avec des pics inutiles de 180 kWh pendant les périodes de faible production. Le variateur permettrait une économie estimée de 32 kWh/jour en moyenne.`
    },
    {
      id: 'REC-002',
      title: 'Maintenance Préventive Pompe Hydraulique',
      description: `La pompe hydraulique PUMP-002 présente des signes de dégradation avec une augmentation de 15% de sa consommation énergétique au cours des 2 derniers mois. Une maintenance préventive incluant le remplacement des joints et la révision du système de lubrification est recommandée.\n\nCette intervention préventive évitera une panne coûteuse et restaurera l'efficacité énergétique optimale.`,icon: 'Wrench',priority: 'Critique',
      difficulty: 'Facile',machineId: 'PUMP-002',category: 'maintenance',potentialSavings: 1650,paybackPeriod: 3,energyReduction: 18,implementationCost: 4200,generatedAt: new Date('2025-01-22'),
      implementationSteps: [
        'Planification de l\'arrêt de production pendant 4 heures',
        'Démontage partiel de la pompe hydraulique',
        'Remplacement des joints d\'étanchéité usagés',
        'Révision complète du système de lubrification',
        'Nettoyage et inspection des composants internes',
        'Remontage et tests de performance'
      ],
      supportingData: `Surveillance continue depuis 60 jours : augmentation progressive de la consommation de 95 kWh/jour à 109 kWh/jour. Analyse vibratoire détectant des anomalies dans les roulements.`
    },
    {
      id: 'REC-003',
      title: 'Remplacement Éclairage LED',
      description: `L'éclairage actuel de l'atelier utilise des tubes fluorescents T8 de 36W avec une efficacité lumineuse de 80 lm/W. Le remplacement par des tubes LED T8 de 18W (120 lm/W) réduirait la consommation d'éclairage de 50% tout en améliorant la qualité lumineuse.\n\nL'investissement sera amorti rapidement grâce aux économies d'énergie et à la réduction des coûts de maintenance.`,icon: 'Lightbulb',priority: 'Moyenne',
      difficulty: 'Facile',machineId: 'LIGHT-001',category: 'replacement',potentialSavings: 980,paybackPeriod: 12,energyReduction: 50,implementationCost: 11200,generatedAt: new Date('2025-01-18'),
      implementationSteps: [
        'Audit complet de l\'éclairage existant (42 tubes fluorescents)',
        'Commande des tubes LED T8 18W compatibles avec les ballasts existants',
        'Remplacement progressif par zones pour maintenir l\'éclairage',
        'Tests de niveau d\'éclairement selon normes NF EN 12464-1',
        'Formation du personnel sur les nouveaux équipements',
        'Mise à jour du plan de maintenance préventive'
      ],
      supportingData: `Consommation actuelle d'éclairage : 1,512 kWh/jour (42 tubes × 36W × 10h). Avec les LED : 756 kWh/jour, soit 756 kWh d'économie quotidienne.`
    },
    {
      id: 'REC-004',
      title: 'Planification Intelligente du Convoyeur',
      description: `Le convoyeur CONV-003 fonctionne en continu même pendant les pauses de production, consommant inutilement 12 kWh/jour. L'implémentation d'un système de démarrage/arrêt automatique basé sur la détection de produits permettrait d'optimiser son fonctionnement.\n\nCette automatisation simple réduirait la consommation sans impact sur la productivité.`,icon: 'Zap',priority: 'Faible',
      difficulty: 'Modérée',machineId: 'CONV-003',category: 'automation',potentialSavings: 720,paybackPeriod: 15,energyReduction: 25,implementationCost: 8900,generatedAt: new Date('2025-01-19'),
      implementationSteps: [
        'Installation de capteurs de présence produit en entrée/sortie','Programmation de l\'automate pour gestion start/stop automatique',
        'Configuration des temporisations de sécurité',
        'Tests de fonctionnement avec différents types de produits',
        'Ajustement des paramètres selon les cadences de production',
        'Formation des opérateurs sur le nouveau mode de fonctionnement'
      ],
      supportingData: `Analyse des temps de fonctionnement : 16h/jour dont 3h à vide. Consommation à vide : 2.8 kW × 3h = 8.4 kWh/jour économisables.`
    },
    {
      id: 'REC-005',
      title: 'Isolation Thermique Système de Chauffage',
      description: `Le système de chauffage HEAT-004 présente des pertes thermiques importantes au niveau des canalisations non isolées. L'ajout d'une isolation thermique haute performance réduirait les pertes de chaleur de 30% et améliorerait l'efficacité énergétique globale.\n\nCette amélioration est particulièrement rentable pendant les mois d'hiver où le système fonctionne intensivement.`,
      icon: 'Thermometer',
      priority: 'Moyenne',
      difficulty: 'Facile',
      machineId: 'HEAT-004',
      category: 'optimization',
      potentialSavings: 1420,
      paybackPeriod: 9,
      energyReduction: 28,
      implementationCost: 6800,
      generatedAt: new Date('2025-01-21'),
      implementationSteps: [
        'Mesure thermographique des pertes actuelles',
        'Calcul des épaisseurs d\'isolation optimales',
        'Fourniture de coquilles isolantes haute température',
        'Installation de l\'isolation sur 45 mètres de canalisations',
        'Protection mécanique et étanchéité des raccords',
        'Contrôle thermographique post-installation'
      ],
      supportingData: `Thermographie infrarouge révélant des pertes de 15°C sur les canalisations. Température ambiante 20°C, température fluide 85°C. Isolation actuelle insuffisante (λ=0.08 W/m.K).`
    }
  ];

  // Mock implementations data
  const mockImplementations = [
    {
      id: 'IMPL-001',
      title: 'Remplacement Moteur Pompe Secondaire',
      machineId: 'PUMP-003',
      status: 'Implémenté',
      progress: 100,
      expectedSavings: 1200,
      actualSavings: 1350,
      implementationCost: 5500,
      acceptedAt: new Date('2024-12-15'),
      completedAt: new Date('2025-01-10')
    },
    {
      id: 'IMPL-002',
      title: 'Optimisation Ventilation Atelier',
      machineId: 'VENT-001',
      status: 'En Cours',
      progress: 65,
      expectedSavings: 890,
      actualSavings: 0,
      implementationCost: 3200,
      acceptedAt: new Date('2025-01-05'),
      completedAt: null
    },
    {
      id: 'IMPL-003',
      title: 'Installation Capteurs IoT',
      machineId: 'MULT-001',
      status: 'Planifié',
      progress: 25,
      expectedSavings: 2100,
      actualSavings: 0,
      implementationCost: 12000,
      acceptedAt: new Date('2025-01-18'),
      completedAt: null
    }
  ];

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRecommendations(mockRecommendations);
      setImplementations(mockImplementations);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const applyFilters = (recommendations) => {
    let filtered = [...recommendations];

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(rec => rec.priority === filters.priority);
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(rec => rec.difficulty === filters.difficulty);
    }

    // Machine filter
    if (filters.machineId) {
      filtered = filtered.filter(rec => rec.machineId === filters.machineId);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(rec => rec.category === filters.category);
    }

    // Minimum savings filter
    if (filters.minSavings) {
      filtered = filtered.filter(rec => rec.potentialSavings >= parseInt(filters.minSavings));
    }

    // Maximum payback filter
    if (filters.maxPayback) {
      filtered = filtered.filter(rec => rec.paybackPeriod <= parseInt(filters.maxPayback));
    }

    // Quick filters
    if (filters.quickFilter === 'high-impact') {
      filtered = filtered.filter(rec => rec.potentialSavings >= 2000);
    } else if (filters.quickFilter === 'quick-wins') {
      filtered = filtered.filter(rec => rec.paybackPeriod <= 6 && rec.difficulty === 'Facile');
    } else if (filters.quickFilter === 'low-cost') {
      filtered = filtered.filter(rec => rec.implementationCost <= 10000);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'potentialSavings':
          return b.potentialSavings - a.potentialSavings;
        case 'paybackPeriod':
          return a.paybackPeriod - b.paybackPeriod;
        case 'priority':
          const priorityOrder = { 'Critique': 4, 'Élevée': 3, 'Moyenne': 2, 'Faible': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'generatedAt':
          return new Date(b.generatedAt) - new Date(a.generatedAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleAcceptRecommendation = async (recommendationId) => {
    const recommendation = recommendations.find(rec => rec.id === recommendationId);
    if (recommendation) {
      const newImplementation = {
        id: `IMPL-${Date.now()}`,
        title: recommendation.title,
        machineId: recommendation.machineId,
        status: 'En Attente',
        progress: 0,
        expectedSavings: recommendation.potentialSavings,
        actualSavings: 0,
        implementationCost: recommendation.implementationCost,
        acceptedAt: new Date(),
        completedAt: null
      };

      setImplementations(prev => [...prev, newImplementation]);
      setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
    }
  };

  const handleDismissRecommendation = async (recommendationId) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  };

  const handleUpdateImplementationStatus = async (implementationId, newStatus) => {
    setImplementations(prev => prev.map(impl => {
      if (impl.id === implementationId) {
        const updated = { ...impl, status: newStatus };
        if (newStatus === 'Implémenté') {
          updated.progress = 100;
          updated.completedAt = new Date();
          updated.actualSavings = impl.expectedSavings * (0.9 + Math.random() * 0.2); // Simulate actual savings
        } else if (newStatus === 'En Cours') {
          updated.progress = 50;
        }
        return updated;
      }
      return impl;
    }));
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'potentialSavings',
      priority: '',
      difficulty: '',
      machineId: '',
      category: '',
      minSavings: '',
      maxPayback: '',
      quickFilter: ''
    });
  };

  const filteredRecommendations = applyFilters(recommendations);

  const breadcrumbItems = [
    { label: 'Accueil', path: '/dashboard-overview', icon: 'Home' },
    { label: 'Moteur de Recommandations', path: '/recommendations-engine', icon: 'FileText' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des recommandations...</p>
              </div>
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
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Page Header */}
          <motion.div 
            className="py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-energy-primary rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Moteur de Recommandations</h1>
                  <p className="text-muted-foreground mt-1">
                    Optimisations intelligentes basées sur l'analyse énergétique en temps réel
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconSize={16}
                  onClick={() => window.location.reload()}
                >
                  Actualiser
                </Button>
                <Button
                  variant="default"
                  iconName="Download"
                  iconSize={16}
                >
                  Exporter Rapport
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{filteredRecommendations.length}</div>
                  <div className="text-sm text-muted-foreground">Recommandations Actives</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredRecommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toLocaleString('fr-MA')}
                  </div>
                  <div className="text-sm text-muted-foreground">MAD/mois Potentiels</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{implementations.length}</div>
                  <div className="text-sm text-muted-foreground">En Implémentation</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {implementations.filter(impl => impl.status === 'Implémenté').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Implémentées</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
            {/* Left Column - Recommendations */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Filter Panel */}
              <div className="mb-6">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Recommendations List */}
              <div className="space-y-6">
                {filteredRecommendations.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-12 text-center shadow-card">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Aucune recommandation trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      Aucune recommandation ne correspond aux filtres sélectionnés.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      iconName="X"
                      iconSize={16}
                    >
                      Effacer les Filtres
                    </Button>
                  </div>
                ) : (
                  filteredRecommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <RecommendationCard
                        recommendation={recommendation}
                        onAccept={handleAcceptRecommendation}
                        onDismiss={handleDismissRecommendation}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Right Column - Implementation Tracker */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="sticky top-24">
                <ImplementationTracker
                  implementations={implementations}
                  onUpdateStatus={handleUpdateImplementationStatus}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recommendation Detail Modal */}
      <RecommendationModal
        recommendation={selectedRecommendation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptRecommendation}
        onDismiss={handleDismissRecommendation}
      />
    </div>
  );
};

export default RecommendationsEngine;