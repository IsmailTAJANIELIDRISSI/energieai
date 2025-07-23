import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MachineDetailPanel = ({ machine, onScheduleMaintenance, onUpdateStatus, onExportData }) => {
  if (!machine) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="Monitor" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Sélectionnez une machine
          </h3>
          <p className="text-muted-foreground">
            Cliquez sur une machine pour voir ses détails
          </p>
        </div>
      </div>
    );
  }

  const consumptionData = [
    { time: '00:00', power: 45.2 },
    { time: '04:00', power: 52.1 },
    { time: '08:00', power: 68.5 },
    { time: '12:00', power: 72.3 },
    { time: '16:00', power: 65.8 },
    { time: '20:00', power: 58.4 },
    { time: '24:00', power: 48.7 }
  ];

  const recommendations = [
    {
      id: 1,
      type: 'energy',
      title: 'Optimisation énergétique',
      description: 'Réduire la vitesse de 10% pendant les heures creuses',
      savings: '2,450 MAD/mois',
      priority: 'high'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance préventive',
      description: 'Nettoyer les filtres pour améliorer l\'efficacité',
      savings: '1,200 MAD/mois',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 bg-green-100';
      case 'attention':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Machine Header */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">{machine.name}</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(machine.status)}`}>
                {machine.status === 'optimal' ? 'Optimal' :
                 machine.status === 'attention' ? 'Attention' :
                 machine.status === 'critical' ? 'Critique' : 'Maintenance'}
              </span>
              <span className="text-sm text-muted-foreground">
                {machine.department} • {machine.type}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconSize={16}
              onClick={() => onUpdateStatus(machine)}
            >
              Statut
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={16}
              onClick={() => onExportData(machine)}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-mono">
              {machine.currentPower} kW
            </div>
            <div className="text-sm text-muted-foreground">Consommation actuelle</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {machine.efficiency}%
            </div>
            <div className="text-sm text-muted-foreground">Efficacité</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {machine.dailyCost} MAD
            </div>
            <div className="text-sm text-muted-foreground">Coût journalier</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {machine.uptime}%
            </div>
            <div className="text-sm text-muted-foreground">Temps de fonctionnement</div>
          </div>
        </div>
      </div>

      {/* Consumption Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Consommation énergétique (24h)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                label={{ value: 'kW', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="power" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Planning de maintenance</h3>
          <Button
            variant="primary"
            size="sm"
            iconName="Calendar"
            iconSize={16}
            onClick={() => onScheduleMaintenance(machine)}
          >
            Programmer
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Wrench" size={16} className="text-blue-600" />
              <div>
                <div className="font-medium text-foreground">Maintenance préventive</div>
                <div className="text-sm text-muted-foreground">Nettoyage et inspection</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Dans 5 jours</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-orange-600" />
              <div>
                <div className="font-medium text-foreground">Remplacement filtres</div>
                <div className="text-sm text-muted-foreground">Maintenance corrective</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Dans 12 jours</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recommandations automatisées
        </h3>
        
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={rec.type === 'energy' ? 'Zap' : 'Wrench'} 
                    size={16} 
                    className="text-primary" 
                  />
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                  {rec.priority === 'high' ? 'Haute' : 
                   rec.priority === 'medium' ? 'Moyenne' : 'Faible'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  Économies: {rec.savings}
                </span>
                <Button variant="ghost" size="xs">
                  Appliquer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachineDetailPanel;