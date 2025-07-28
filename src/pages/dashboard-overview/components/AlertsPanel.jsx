import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const AlertsPanel = ({ alerts = [] }) => {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case "critical":
        return "AlertTriangle";
      case "warning":
        return "AlertCircle";
      case "info":
        return "Info";
      default:
        return "Bell";
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Alertes Urgentes
        </h3>
        <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
          Configurer
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              name="CheckCircle"
              size={48}
              className="text-green-500 mx-auto mb-3"
            />
            <p className="text-slate-500">Aucune alerte active</p>
            <p className="text-sm text-slate-400">
              Tous les systèmes fonctionnent normalement
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getAlertColor(
                alert.severity
              )}`}
            >
              <div className="flex items-start space-x-3">
                <Icon
                  name={getAlertIcon(alert.severity)}
                  size={20}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {alert.title}
                    </h4>
                    <span className="text-xs opacity-75 flex-shrink-0 ml-2">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{alert.message}</p>
                  {alert.machine && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Settings" size={14} />
                      <span className="text-xs font-medium">
                        {alert.machine}
                      </span>
                    </div>
                  )}
                  {alert.generated_by === "Gemini AI" && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border-purple-200 mb-2">
                      IA Générative
                    </span>
                  )}
                  {alert.action && (
                    <Button variant="outline" size="xs" className="mt-2">
                      {alert.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            fullWidth
            iconName="ExternalLink"
            iconSize={16}
          >
            Voir Toutes les Alertes
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
