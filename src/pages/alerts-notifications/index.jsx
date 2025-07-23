import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertCard from './components/AlertCard';
import AlertFilters from './components/AlertFilters';
import AlertSummary from './components/AlertSummary';
import AlertTabs from './components/AlertTabs';
import BulkActions from './components/BulkActions';
import AlertModal from './components/AlertModal';

const AlertsNotifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    status: 'all',
    category: 'all',
    location: 'all',
    dateRange: { start: '', end: '' }
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Mock alerts data
  const mockAlerts = [
    {
      id: 'alert_001',
      title: 'Surconsommation énergétique détectée',
      description: `La ligne de production 1 présente une consommation énergétique 35% supérieure à la normale depuis 2h30. Cette anomalie pourrait indiquer un dysfonctionnement des moteurs ou un problème d'isolation thermique.`,severity: 'critical',status: 'new',category: 'energy',location: 'Ligne de production 1',timestamp: new Date(Date.now() - 150000),assignedTo: '',
      recommendations: [
        'Vérifier l\'état des moteurs électriques',
        'Contrôler l\'isolation thermique des équipements',
        'Analyser les données de température ambiante',
        'Programmer une maintenance préventive'
      ],
      notes: '',
      resolution: ''
    },
    {
      id: 'alert_002',
      title: 'Micro-coupure électrique',
      description: `Interruption électrique de 3 secondes détectée sur le secteur B. Impact sur 4 machines avec redémarrage automatique effectué.`,
      severity: 'high',
      status: 'acknowledged',
      category: 'system',
      location: 'Secteur B - Entrepôt',
      timestamp: new Date(Date.now() - 300000),
      assignedTo: 'fatima.benali',
      recommendations: [
        'Vérifier la stabilité du réseau électrique',
        'Contrôler les disjoncteurs et fusibles',
        'Tester les systèmes de sauvegarde'
      ],
      notes: 'Équipe technique notifiée',
      resolution: ''
    },
    {
      id: 'alert_003',
      title: 'Maintenance préventive requise',
      description: `Le compresseur C-104 approche de son seuil de maintenance programmée. 2847 heures de fonctionnement sur 3000 heures recommandées.`,
      severity: 'medium',
      status: 'in_progress',
      category: 'maintenance',
      location: 'Atelier mécanique',
      timestamp: new Date(Date.now() - 450000),
      assignedTo: 'youssef.alami',
      recommendations: [
        'Programmer l\'arrêt du compresseur',
        'Préparer les pièces de rechange',
        'Coordonner avec l\'équipe de maintenance'
      ],
      notes: 'Pièces commandées, livraison prévue demain',
      resolution: ''
    },
    {
      id: 'alert_004',
      title: 'Économie d\'énergie réalisée',
      description: `Optimisation automatique réussie sur la ligne 2. Réduction de 12% de la consommation énergétique grâce aux ajustements des paramètres de fonctionnement.`,
      severity: 'info',
      status: 'resolved',
      category: 'energy',
      location: 'Ligne de production 2',
      timestamp: new Date(Date.now() - 600000),
      assignedTo: 'sara.idrissi',
      recommendations: [
        'Appliquer les mêmes paramètres aux autres lignes',
        'Documenter les réglages optimaux',
        'Programmer une vérification hebdomadaire'
      ],
      notes: 'Économie estimée: 450 MAD/jour',
      resolution: 'Paramètres optimisés et documentés'
    },
    {
      id: 'alert_005',
      title: 'Température élevée détectée',
      description: `Le moteur M-205 présente une température de fonctionnement de 85°C, dépassant le seuil recommandé de 75°C.`,
      severity: 'high',
      status: 'new',
      category: 'equipment',
      location: 'Zone de conditionnement',
      timestamp: new Date(Date.now() - 750000),
      assignedTo: '',
      recommendations: [
        'Arrêter immédiatement le moteur',
        'Vérifier le système de refroidissement',
        'Contrôler les roulements et lubrification'
      ],
      notes: '',
      resolution: ''
    },
    {
      id: 'alert_006',
      title: 'Mise à jour système disponible',
      description: `Une nouvelle version du firmware est disponible pour les contrôleurs énergétiques. Version 2.4.1 avec améliorations de performance.`,
      severity: 'low',
      status: 'new',
      category: 'system',
      location: 'Système central',
      timestamp: new Date(Date.now() - 900000),
      assignedTo: 'omar.tazi',
      recommendations: [
        'Planifier la mise à jour pendant l\'arrêt',
        'Sauvegarder la configuration actuelle',
        'Tester sur un contrôleur pilote'
      ],
      notes: '',
      resolution: ''
    },
    {
      id: 'alert_007',
      title: 'Dépassement seuil CO2',
      description: `Les émissions de CO2 ont dépassé le seuil environnemental de 15% par rapport aux objectifs mensuels.`,
      severity: 'medium',
      status: 'acknowledged',
      category: 'safety',
      location: 'Installation générale',
      timestamp: new Date(Date.now() - 1050000),
      assignedTo: 'ahmed.mansouri',
      recommendations: [
        'Analyser les sources d\'émission principales',
        'Optimiser les processus énergivores',
        'Réviser les objectifs environnementaux'
      ],
      notes: 'Rapport environnemental en cours',
      resolution: ''
    },
    {
      id: 'alert_008',
      title: 'Efficacité machine optimale',
      description: `La machine M-301 atteint un rendement de 98.5%, dépassant les objectifs de performance de 3.5%.`,
      severity: 'info',
      status: 'closed',
      category: 'equipment',
      location: 'Ligne de production 3',
      timestamp: new Date(Date.now() - 1200000),
      assignedTo: 'fatima.benali',
      recommendations: [
        'Documenter les paramètres optimaux',
        'Répliquer sur machines similaires',
        'Programmer maintenance préventive'
      ],
      notes: 'Performance exceptionnelle maintenue',
      resolution: 'Paramètres documentés et répliqués'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [alerts, filters, activeTab, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...alerts];

    // Tab filtering
    if (activeTab !== 'all') {
      if (activeTab === 'critical') {
        filtered = filtered.filter(alert => alert.severity === 'critical');
      } else if (activeTab === 'warnings') {
        filtered = filtered.filter(alert => ['high', 'medium'].includes(alert.severity));
      } else if (activeTab === 'info') {
        filtered = filtered.filter(alert => ['low', 'info'].includes(alert.severity));
      } else if (activeTab === 'new') {
        filtered = filtered.filter(alert => alert.status === 'new');
      }
    }

    // Search filtering
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm) ||
        alert.description.toLowerCase().includes(searchTerm) ||
        alert.location.toLowerCase().includes(searchTerm)
      );
    }

    // Other filters
    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(alert => alert.category === filters.category);
    }

    if (filters.location !== 'all') {
      filtered = filtered.filter(alert => alert.location.includes(filters.location));
    }

    // Date range filtering
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(alert => new Date(alert.timestamp) >= startDate);
    }

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(alert => new Date(alert.timestamp) <= endDate);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAlerts(filtered);
  };

  const getAlertCounts = () => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warnings: alerts.filter(a => ['high', 'medium'].includes(a.severity)).length,
      info: alerts.filter(a => ['low', 'info'].includes(a.severity)).length,
      new: alerts.filter(a => a.status === 'new').length
    };
  };

  const handleAlertSelect = (alertId, isSelected) => {
    if (isSelected) {
      setSelectedAlerts(prev => [...prev, alertId]);
    } else {
      setSelectedAlerts(prev => prev.filter(id => id !== alertId));
    }
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(alert => alert.id));
    }
  };

  const handleBulkAction = (action, alertIds, data = {}) => {
    setAlerts(prev => prev.map(alert => {
      if (alertIds.includes(alert.id)) {
        switch (action) {
          case 'acknowledge':
            return { ...alert, status: 'acknowledged' };
          case 'resolve':
            return { ...alert, status: 'resolved' };
          case 'close':
            return { ...alert, status: 'closed' };
          case 'assign':
            return { ...alert, assignedTo: data.user };
          case 'delete':
            return null;
          default:
            return alert;
        }
      }
      return alert;
    }).filter(Boolean));

    setSelectedAlerts([]);
  };

  const handleAlertAction = (action, alertId, data = {}) => {
    switch (action) {
      case 'acknowledge':
        setAlerts(prev => prev.map(alert =>
          alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
        ));
        break;
      case 'assign':
        // Open assignment modal or dropdown
        console.log('Assign alert:', alertId);
        break;
      case 'addNote':
        // Open note modal
        console.log('Add note to alert:', alertId);
        break;
      case 'viewDetails':
        const alert = alerts.find(a => a.id === alertId);
        setSelectedAlert(alert);
        setIsModalOpen(true);
        break;
    }
  };

  const handleSaveAlert = (alertId, formData) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, ...formData } : alert
    ));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      severity: 'all',
      status: 'all',
      category: 'all',
      location: 'all',
      dateRange: { start: '', end: '' }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement des alertes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Icon name="Bell" size={28} className="mr-3 text-primary" />
                Alertes et Notifications
              </h1>
              <p className="text-muted-foreground mt-1">
                Surveillance en temps réel des événements critiques
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RotateCcw"
                iconSize={16}
                onClick={() => window.location.reload()}
              >
                Actualiser
              </Button>
              
              <Button
                variant="default"
                iconName="Settings"
                iconSize={16}
              >
                Configurer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AlertTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCounts={getAlertCounts()}
      />

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Filters */}
            <AlertFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    {filteredAlerts.length} alerte{filteredAlerts.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                {selectedAlerts.length > 0 && (
                  <span className="text-sm text-primary font-medium">
                    {selectedAlerts.length} sélectionnée{selectedAlerts.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="text-sm border border-border rounded-md px-3 py-1 bg-background"
                >
                  <option value="timestamp-desc">Plus récent</option>
                  <option value="timestamp-asc">Plus ancien</option>
                  <option value="severity-desc">Sévérité élevée</option>
                  <option value="severity-asc">Sévérité faible</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Aucune alerte trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    Aucune alerte ne correspond aux critères de filtrage actuels.
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute left-4 top-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={(e) => handleAlertSelect(alert.id, e.target.checked)}
                        className="rounded border-border"
                      />
                    </div>
                    <div className="pl-10">
                      <AlertCard
                        alert={alert}
                        onAcknowledge={(id) => handleAlertAction('acknowledge', id)}
                        onAssign={(id) => handleAlertAction('assign', id)}
                        onAddNote={(id) => handleAlertAction('addNote', id)}
                        onViewDetails={(id) => handleAlertAction('viewDetails', id)}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-card p-6">
          <AlertSummary alerts={alerts} />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedAlerts={selectedAlerts}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedAlerts([])}
      />

      {/* Alert Modal */}
      <AlertModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        onSave={handleSaveAlert}
      />
    </div>
  );
};

export default AlertsNotifications;