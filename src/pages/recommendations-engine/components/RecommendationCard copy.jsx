import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RecommendationCard = ({
  recommendation,
  onAccept,
  onDismiss,
  onViewDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critique":
        return "bg-red-100 text-red-800 border-red-200";
      case "Élevée":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Moyenne":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Faible":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Facile":
        return "text-green-600";
      case "Modérée":
        return "text-amber-600";
      case "Difficile":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept(recommendation.id);
    setIsProcessing(false);
  };

  const handleDismiss = async () => {
    setIsProcessing(true);
    await onDismiss(recommendation.id);
    setIsProcessing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon
                name={recommendation.icon}
                size={20}
                className="text-primary"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {recommendation.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                    recommendation.priority
                  )}`}
                >
                  {recommendation.priority}
                </span>
                <span className="text-sm text-muted-foreground">
                  Machine: {recommendation.machine_id}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Économies Potentielles
            </span>
          </div>
          <div className="text-xl font-bold text-green-900 mt-1">
            {recommendation.potential_savings.toLocaleString("fr-MA")} MAD/mois
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Retour sur Investissement
            </span>
          </div>
          <div className="text-xl font-bold text-blue-900 mt-1">
            {recommendation.payback_period} mois
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="Wrench" size={16} className="text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Difficulté
            </span>
          </div>
          <div
            className={`text-xl font-bold mt-1 ${getDifficultyColor(
              recommendation.difficulty
            )}`}
          >
            {recommendation.difficulty}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-4 mb-4 space-y-4">
          {/* Implementation Steps */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
              <Icon name="CheckSquare" size={16} className="mr-2" />
              Étapes d'Implémentation
            </h4>
            <ul className="space-y-2">
              {recommendation.implementationSteps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2 text-sm text-muted-foreground"
                >
                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Results */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
              <Icon name="Target" size={16} className="mr-2" />
              Résultats Attendus
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Zap" size={14} className="text-green-600" />
                <span className="text-muted-foreground">
                  Réduction énergétique:{" "}
                  <span className="font-medium text-foreground">
                    {recommendation.energyReduction}%
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="DollarSign" size={14} className="text-blue-600" />
                <span className="text-muted-foreground">
                  Coût d'implémentation:{" "}
                  <span className="font-medium text-foreground">
                    {recommendation.implementationCost.toLocaleString("fr-MA")}{" "}
                    MAD
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Supporting Data */}
          {recommendation.supportingData && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                <Icon name="BarChart3" size={16} className="mr-2" />
                Données de Support
              </h4>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  {recommendation.supportingData}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Généré le{" "}
            {new Date(recommendation.generatedAt).toLocaleDateString("fr-FR")}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            disabled={isProcessing}
            iconName="X"
            iconSize={14}
          >
            Ignorer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(recommendation)}
            iconName="Eye"
            iconSize={14}
          >
            Détails
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAccept}
            loading={isProcessing}
            iconName="Check"
            iconSize={14}
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
