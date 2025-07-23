import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertSummary = ({ alerts }) => {
  const getSummaryStats = () => {
    const stats = {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      info: alerts.filter(a => a.severity === 'info').length,
      new: alerts.filter(a => a.status === 'new').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      inProgress: alerts.filter(a => a.status === 'in_progress').length,
      resolved: alerts.filter(a => a.status === 'resolved').length
    };
    return stats;
  };

  const getRecentTrends = () => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recent24h = alerts.filter(a => new Date(a.timestamp) > last24h).length;
    const recent7d = alerts.filter(a => new Date(a.timestamp) > last7d).length;
    
    return { recent24h, recent7d };
  };

  const stats = getSummaryStats();
  const trends = getRecentTrends();

  const summaryCards = [
    {
      title: 'Total des alertes',
      value: stats.total,
      icon: 'Bell',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Critiques',
      value: stats.critical,
      icon: 'AlertTriangle',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Nouvelles',
      value: stats.new,
      icon: 'Plus',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'En cours',
      value: stats.inProgress,
      icon: 'Clock',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${card.bgColor} ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-2 rounded-full ${card.bgColor} border ${card.borderColor}`}>
                <Icon name={card.icon} size={20} className={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Severity Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={16} className="mr-2" />
          Répartition par sévérité
        </h3>
        
        <div className="space-y-3">
          {[
            { key: 'critical', label: 'Critique', count: stats.critical, color: 'bg-red-500' },
            { key: 'high', label: 'Élevée', count: stats.high, color: 'bg-orange-500' },
            { key: 'medium', label: 'Moyenne', count: stats.medium, color: 'bg-amber-500' },
            { key: 'low', label: 'Faible', count: stats.low, color: 'bg-blue-500' },
            { key: 'info', label: 'Info', count: stats.info, color: 'bg-green-500' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={16} className="mr-2" />
          Activité récente
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dernières 24h</span>
            <span className="text-sm font-medium text-foreground">{trends.recent24h}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Derniers 7 jours</span>
            <span className="text-sm font-medium text-foreground">{trends.recent7d}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Taux de résolution</span>
            <span className="text-sm font-medium text-green-600">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={16} className="mr-2" />
          Actions rapides
        </h3>
        
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200">
            Reconnaître toutes les nouvelles alertes
          </button>
          <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200">
            Exporter les alertes critiques
          </button>
          <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200">
            Configurer les notifications
          </button>
          <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200">
            Voir les rapports d'alertes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertSummary;