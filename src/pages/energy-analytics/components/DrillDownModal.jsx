import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DrillDownModal = ({ isOpen, onClose, selectedMachine, machineData }) => {
  if (!isOpen || !selectedMachine) return null;

  const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#dc2626', '#8b5cf6'];

  const formatTooltip = (value, name) => {
    if (name === 'consumption') {
      return [`${value.toLocaleString('fr-FR')} kWh`, 'Consommation'];
    }
    if (name === 'efficiency') {
      return [`${value}%`, 'Efficacité'];
    }
    return [value, name];
  };

  const machineStats = [
    {
      label: 'Consommation Totale',
      value: `${machineData?.totalConsumption?.toLocaleString('fr-FR') || '0'} kWh`,
      icon: 'Zap',
      color: 'text-blue-600'
    },
    {
      label: 'Coût Total',
      value: `${machineData?.totalCost?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || '0,00'} MAD`,
      icon: 'DollarSign',
      color: 'text-green-600'
    },
    {
      label: 'Efficacité Moyenne',
      value: `${machineData?.averageEfficiency || 0}%`,
      icon: 'TrendingUp',
      color: 'text-orange-600'
    },
    {
      label: 'Temps de Fonctionnement',
      value: `${machineData?.operatingHours || 0}h`,
      icon: 'Clock',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{selectedMachine}</h2>
              <p className="text-sm text-muted-foreground">Analyse détaillée de la machine</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {machineStats.map((stat, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Icon name={stat.icon} size={18} className={stat.color} />
                  <span className="text-sm font-medium text-foreground">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Consumption Chart */}
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Consommation Horaire</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={machineData?.hourlyData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <Tooltip formatter={formatTooltip} />
                    <Bar dataKey="consumption" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Efficiency Distribution */}
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Répartition de l'Efficacité</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={machineData?.efficiencyDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(machineData?.efficiencyDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-background border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Lightbulb" size={20} className="mr-2 text-yellow-600" />
              Recommandations Spécifiques
            </h3>
            <div className="space-y-3">
              {(machineData?.recommendations || []).map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <Icon 
                    name={recommendation.priority === 'high' ? 'AlertTriangle' : 'Info'} 
                    size={16} 
                    className={recommendation.priority === 'high' ? 'text-red-600' : 'text-blue-600'} 
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{recommendation.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{recommendation.description}</div>
                    <div className="text-xs text-green-600 mt-2">
                      Économies potentielles: {recommendation.savings}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Exporter Rapport
            </Button>
            <Button
              variant="outline"
              iconName="Settings"
              iconPosition="left"
            >
              Configurer Machine
            </Button>
            <Button
              variant="default"
              iconName="Calendar"
              iconPosition="left"
            >
              Planifier Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillDownModal;