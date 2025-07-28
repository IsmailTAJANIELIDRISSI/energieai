import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EnergyChart = ({
  data,
  chartType,
  selectedMetric,
  showComparison = false,
}) => {


  const formatTooltip = (value, name) => {
    if (name === "consumption" || name === "staticAudit") {
      return [
        `${value.toLocaleString("fr-FR")} kWh`,
        name === "consumption" ? "Consommation Réelle" : "Audit Statique",
      ];
    }
    if (name === "cost") {
      return [
        `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD`,
        "Coût",
      ];
    }
    if (name === "efficiency") {
      return [`${value}%`, "Efficacité"];
    }
    if (name === "co2") {
      return [`${value.toLocaleString("fr-FR")} kg`, "CO₂"];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case "consumption":
        return "Consommation (kWh)";
      case "cost":
        return "Coût (MAD)";
      case "efficiency":
        return "Efficacité (%)";
      case "co2":
        return "Émissions CO₂ (kg)";
      default:
        return "Valeur";
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const xAxisProps = {
      dataKey: "date",
      tickFormatter: formatXAxisLabel,
      stroke: "#64748b",
      fontSize: 12,
    };

    const yAxisProps = {
      stroke: "#64748b",
      fontSize: 12,
      label: { value: getYAxisLabel(), angle: -90, position: "insideLeft" },
    };

    const tooltipProps = {
      formatter: formatTooltip,
      labelFormatter: (label) =>
        new Date(label).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      contentStyle: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
            />
            {showComparison && (
              <Line
                type="monotone"
                dataKey="staticAudit"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 3 }}
              />
            )}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Legend />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#2563eb"
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
            {showComparison && (
              <Area
                type="monotone"
                dataKey="staticAudit"
                stroke="#dc2626"
                fill="url(#colorGradientRed)"
                strokeWidth={2}
                fillOpacity={0.3}
              />
            )}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorGradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        );

      case "bar":
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Legend />
            <Bar
              dataKey={selectedMetric}
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
            />
            {showComparison && (
              <Bar
                dataKey="staticAudit"
                fill="#dc2626"
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              />
            )}
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Analyse Énergétique - {getYAxisLabel()}
        </h3>
        {showComparison && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-muted-foreground">
                Surveillance Dynamique
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-muted-foreground">Audit Statique</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
