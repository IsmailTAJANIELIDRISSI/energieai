import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const CostAnalysis = ({ data = [] }) => {
  const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#d97706', '#0ea5e9'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-600">
            Coût: <span className="font-semibold">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-slate-600">
            Pourcentage: <span className="font-semibold">{data.payload.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const totalCost = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Analyse des Coûts</h3>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Icon name="TrendingUp" size={16} />
          <span>Aujourd'hui</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend and Details */}
        <div className="space-y-4">
          <div className="text-center lg:text-left">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-sm text-slate-600">Coût total aujourd'hui</div>
          </div>

          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.value)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Économies potentielles:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(totalCost * 0.15)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis;