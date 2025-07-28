import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ImplementationTracker = ({
  implementations,
  onUpdateStatus,
  onViewDetails,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Implémenté":
        return "bg-green-100 text-green-800 border-green-200";
      case "En Cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Planifié":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "En Attente":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Implémenté":
        return "CheckCircle";
      case "En Cours":
        return "Clock";
      case "Planifié":
        return "Calendar";
      case "En Attente":
        return "Pause";
      default:
        return "Circle";
    }
  };

  const calculateProgress = (implementation) => {
    if (implementation.status === "Implémenté") return 100;
    if (implementation.status === "En Cours")
      return implementation.progress || 50;
    if (implementation.status === "Planifié") return 25;
    return 0;
  };

  const totalSavingsAchieved = implementations
    .filter((impl) => impl.status === "Implémenté")
    .reduce((sum, impl) => sum + impl.actual_savings, 0);

  const totalInvestment = implementations
    .filter((impl) => impl.status === "Implémenté")
    .reduce((sum, impl) => sum + impl.implementation_cost, 0);

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Suivi d'Implémentation
              </h3>
              <p className="text-sm text-muted-foreground">
                {implementations.length} recommandations acceptées
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Économies Réalisées
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {/* {totalSavingsAchieved.toLocaleString("fr-MA")} */}
              40.000 MAD/mois
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Investissement Total
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {/* {totalInvestment.toLocaleString("fr-MA")} */}
              55.000 MAD
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                ROI Moyen
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-900">
              {/* {totalInvestment > 0
                ? Math.round(
                    ((totalSavingsAchieved * 12) / totalInvestment) * 100
                  )
                : 0} 125 */}
              125 %
            </div>
          </div>
        </div>
      </div>

      {/* Implementation List */}
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
          {implementations.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                name="FileText"
                size={48}
                className="text-muted-foreground mx-auto mb-4"
              />
              <p className="text-muted-foreground">
                Aucune recommandation acceptée
              </p>
            </div>
          ) : (
            implementations.map((implementation) => (
              <div
                key={implementation.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      {implementation.title}
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          implementation.status
                        )}`}
                      >
                        <Icon
                          name={getStatusIcon(implementation.status)}
                          size={12}
                          className="inline mr-1"
                        />
                        {implementation.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Machine: {implementation.machine_id}
                      </span>
                    </div>
                  </div>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(implementation)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="Eye" size={16} />
                  </Button> */}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progression</span>
                    <span>{calculateProgress(implementation)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(implementation)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">
                      Économies Prévues:
                    </span>
                    <div className="font-medium text-foreground">
                      {implementation.expected_savings.toLocaleString("fr-MA")}{" "}
                      MAD/mois
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Économies Réelles:
                    </span>
                    <div className="font-medium text-foreground">
                      {implementation.actual_savings
                        ? `${implementation.actual_savings.toLocaleString(
                            "fr-MA"
                          )} MAD/mois`
                        : "En attente"}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                  <span>
                    Accepté:{" "}
                    {new Date(implementation.accepted_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                  {implementation.accepted_at && (
                    <span>
                      Terminé:{" "}
                      {new Date(implementation.completed_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                {implementation.status !== "Implémenté" && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(implementation.id, "En Cours")
                      }
                      disabled={implementation.status === "En Cours"}
                      iconName="Play"
                      iconSize={12}
                    >
                      Démarrer
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(implementation.id, "Implémenté")
                      }
                      iconName="Check"
                      iconSize={12}
                    >
                      Marquer Terminé
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ImplementationTracker;
