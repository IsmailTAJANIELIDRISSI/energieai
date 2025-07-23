import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const ForecastingPanel = ({ forecastData, confidenceLevel = 85 }) => {
  const formatTooltip = (value, name) => {
    if (name === 'predicted') {
      return [`${value.toLocaleString('fr-FR')} kWh`, 'Prévision'];
    }
    if (name === 'upperBound') {
      return [`${value.toLocaleString('fr-FR')} kWh`, 'Limite Haute'];
    }
    if (name === 'lowerBound') {
      return [`${value.toLocaleString('fr-FR')} kWh`, 'Limite Basse'];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const insights = [
    {
      icon: 'TrendingUp',
      title: 'Tendance Prévue',
      value: '+8.5%',
      description: 'Augmentation attendue sur 30 jours',
      color: 'text-orange-600'
    },
    {
      icon: 'DollarSign',
      title: 'Coût Prévu',
      value: '12 450 MAD',
      description: 'Estimation mensuelle',
      color: 'text-blue-600'
    },
    {
      icon: 'AlertTriangle',
      title: 'Pic Attendu',
      value: '15 Jan',
      description: 'Consommation maximale prévue',
      color: 'text-red-600'
    },
    {
      icon: 'Target',
      title: 'Précision',
      value: `${confidenceLevel}%`,
      description: 'Niveau de confiance',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
          Prévisions Énergétiques
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Basé sur l'historique des 90 derniers jours</span>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              label={{ value: 'Consommation (kWh)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stackId="1"
              stroke="none"
              fill="#2563eb"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stackId="1"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
            />
            
            {/* Prediction Line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name={insight.icon} size={18} className={insight.color} />
              <span className="text-sm font-medium text-foreground">{insight.title}</span>
            </div>
            <div className="text-xl font-bold text-foreground mb-1">{insight.value}</div>
            <div className="text-xs text-muted-foreground">{insight.description}</div>
          </div>
        ))}
      </div>

      {/* Algorithm Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Brain" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Algorithme de Prévision</h4>
            <p className="text-sm text-blue-800">
              Utilise une moyenne mobile pondérée avec analyse saisonnière pour prédire les tendances de consommation. 
              Les intervalles de confiance sont calculés sur la base de la variance historique des données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingPanel;