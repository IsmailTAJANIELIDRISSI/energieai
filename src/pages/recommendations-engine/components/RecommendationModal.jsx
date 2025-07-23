import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const RecommendationModal = ({ recommendation, isOpen, onClose, onAccept, onDismiss }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !recommendation) return null;

  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept(recommendation.id);
    setIsProcessing(false);
    onClose();
  };

  const handleDismiss = async () => {
    setIsProcessing(true);
    await onDismiss(recommendation.id);
    setIsProcessing(false);
    onClose();
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Eye' },
    { id: 'analysis', label: 'Analyse', icon: 'BarChart3' },
    { id: 'implementation', label: 'Implémentation', icon: 'Settings' },
    { id: 'impact', label: 'Impact', icon: 'TrendingUp' }
  ];

  // Mock data for charts
  const energyData = [
    { month: 'Jan', current: 2400, optimized: 2040 },
    { month: 'Fév', current: 2210, optimized: 1879 },
    { month: 'Mar', current: 2290, optimized: 1946 },
    { month: 'Avr', current: 2000, optimized: 1700 },
    { month: 'Mai', current: 2181, optimized: 1854 },
    { month: 'Jun', current: 2500, optimized: 2125 }
  ];

  const savingsProjection = [
    { month: 'Mois 1', savings: 1200 },
    { month: 'Mois 2', savings: 1350 },
    { month: 'Mois 3', savings: 1500 },
    { month: 'Mois 4', savings: 1650 },
    { month: 'Mois 5', savings: 1800 },
    { month: 'Mois 6', savings: 1950 }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critique':
        return 'text-red-600 bg-red-100';
      case 'Élevée':
        return 'text-orange-600 bg-orange-100';
      case 'Moyenne':
        return 'text-amber-600 bg-amber-100';
      case 'Faible':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={recommendation.icon} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{recommendation.title}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(recommendation.priority)}`}>
                  {recommendation.priority}
                </span>
                <span className="text-sm text-muted-foreground">
                  Machine: {recommendation.machineId}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Économies Potentielles</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {recommendation.potentialSavings.toLocaleString('fr-MA')} MAD/mois
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Clock" size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Retour sur Investissement</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {recommendation.paybackPeriod} mois
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Wrench" size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Difficulté</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900">
                    {recommendation.difficulty}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {recommendation.description}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Bénéfices Attendus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="Zap" size={20} className="text-green-600" />
                    <div>
                      <div className="font-medium text-foreground">Réduction Énergétique</div>
                      <div className="text-sm text-muted-foreground">{recommendation.energyReduction}% de consommation en moins</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="DollarSign" size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium text-foreground">Économies Annuelles</div>
                      <div className="text-sm text-muted-foreground">{(recommendation.potentialSavings * 12).toLocaleString('fr-MA')} MAD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Energy Consumption Comparison */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Comparaison de Consommation Énergétique</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value} kWh`, 
                          name === 'current' ? 'Consommation Actuelle' : 'Consommation Optimisée'
                        ]}
                      />
                      <Bar dataKey="current" fill="#dc2626" name="current" />
                      <Bar dataKey="optimized" fill="#16a34a" name="optimized" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Savings Projection */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Projection des Économies</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={savingsProjection}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} MAD`, 'Économies']} />
                      <Line type="monotone" dataKey="savings" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Supporting Data */}
              {recommendation.supportingData && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Données de Support</h3>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground">{recommendation.supportingData}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'implementation' && (
            <div className="space-y-6">
              {/* Implementation Steps */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Étapes d'Implémentation</h3>
                <div className="space-y-3">
                  {recommendation.implementationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                      <span className="bg-primary text-primary-foreground text-sm rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Required */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Ressources Requises</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Users" size={16} className="text-blue-600" />
                      <span className="font-medium text-foreground">Personnel</span>
                    </div>
                    <p className="text-sm text-muted-foreground">2 techniciens, 4 heures</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Wrench" size={16} className="text-orange-600" />
                      <span className="font-medium text-foreground">Outils</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Outils standard de maintenance</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Clock" size={16} className="text-green-600" />
                      <span className="font-medium text-foreground">Durée</span>
                    </div>
                    <p className="text-sm text-muted-foreground">1-2 jours ouvrables</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="DollarSign" size={16} className="text-red-600" />
                      <span className="font-medium text-foreground">Coût</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{recommendation.implementationCost.toLocaleString('fr-MA')} MAD</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-6">
              {/* Environmental Impact */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Impact Environnemental</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Leaf" size={20} className="text-green-600" />
                      <span className="font-medium text-green-800">Réduction CO₂</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">1.2 tonnes/an</div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Zap" size={20} className="text-blue-600" />
                      <span className="font-medium text-blue-800">Énergie Économisée</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">2,400 kWh/an</div>
                  </div>
                </div>
              </div>

              {/* Business Impact */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Impact Business</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="TrendingUp" size={20} className="text-green-600" />
                    <div>
                      <div className="font-medium text-foreground">Amélioration de l'Efficacité</div>
                      <div className="text-sm text-muted-foreground">Augmentation de 15% de l'efficacité énergétique</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="Shield" size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium text-foreground">Réduction des Risques</div>
                      <div className="text-sm text-muted-foreground">Diminution des pannes et maintenance préventive</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="Award" size={20} className="text-purple-600" />
                    <div>
                      <div className="font-medium text-foreground">Conformité Réglementaire</div>
                      <div className="text-sm text-muted-foreground">Respect des normes environnementales marocaines</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <div className="text-sm text-muted-foreground">
            Généré le {new Date(recommendation.generatedAt).toLocaleDateString('fr-FR')} par EnergieAI
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleDismiss}
              disabled={isProcessing}
              iconName="X"
              iconSize={16}
            >
              Ignorer
            </Button>
            <Button
              variant="default"
              onClick={handleAccept}
              loading={isProcessing}
              iconName="Check"
              iconSize={16}
            >
              Accepter la Recommandation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;