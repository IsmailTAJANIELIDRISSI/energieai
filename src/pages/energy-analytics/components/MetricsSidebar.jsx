import React from "react";
import Icon from "../../../components/AppIcon";

const MetricsSidebar = ({
  totalConsumption,
  averageCost,
  efficiency,
  co2Footprint,
  selectedChartType,
  onChartTypeChange,
}) => {
  const metrics = [
    {
      id: "consumption",
      label: "Consommation Totale",
      value: `${totalConsumption.toLocaleString("fr-FR")} kWh`,
      change: "+12.5%",
      changeType: "increase",
      icon: "Zap",
      color: "text-blue-600",
    },
    {
      id: "cost",
      label: "Coût Moyen",
      value: `${averageCost.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
      })} MAD`,
      change: "-8.3%",
      changeType: "decrease",
      icon: "DollarSign",
      color: "text-green-600",
    },
    {
      id: "efficiency",
      label: "Efficacité Globale",
      value: `${efficiency}%`,
      change: "+5.2%",
      changeType: "increase",
      icon: "TrendingUp",
      color: "text-orange-600",
    },
    {
      id: "co2",
      label: "Empreinte CO₂",
      value: `${co2Footprint.toLocaleString("fr-FR")} kg`,
      change: "-15.7%",
      changeType: "decrease",
      icon: "Leaf",
      color: "text-emerald-600",
    },
  ];

  const chartTypes = [
    { id: "line", label: "Courbe", icon: "TrendingUp" },
    { id: "bar", label: "Barres", icon: "BarChart3" },
    { id: "area", label: "Aires", icon: "Activity" },
  ];


  return (
    <div className="w-full space-y-6">
      {/* Quick Metrics */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={16} className="mr-2 text-primary" />
          Métriques Rapides
        </h3>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={metric.icon} size={14} className={metric.color} />
                  <span className="text-xs text-muted-foreground">
                    {metric.label}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    metric.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={16} className="mr-2 text-primary" />
          Type de Graphique
        </h3>
        <div className="space-y-2">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onChartTypeChange(type.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedChartType === type.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon name={type.icon} size={16} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Mode */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
          <Icon name="GitCompare" size={16} className="mr-2 text-primary" />
          Mode Comparaison
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Audit Statique</span>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              Surveillance Dynamique
            </span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Économies Réalisées
            </div>
            <div className="text-lg font-bold text-green-600">15.3%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSidebar;
