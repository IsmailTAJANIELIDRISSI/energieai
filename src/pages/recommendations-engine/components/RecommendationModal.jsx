import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RecommendationModal = ({
  recommendation,
  isOpen,
  onClose,
  energyData,
  onAccept,
  onDismiss,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !recommendation) return null;

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
    onClose();
  };

  const handleDismiss = async () => {
    setIsProcessing(true);
    await onDismiss(recommendation.id);
    setIsProcessing(false);
    onClose();
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "Eye" },
    // { id: "analysis", label: "Analyse", icon: "BarChart3" },
    { id: "implementation", label: "Implémentation", icon: "Settings" },
    { id: "impact", label: "Impact", icon: "TrendingUp" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon
                name={recommendation.icon}
                size={20}
                className="text-primary"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {recommendation.title}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                    recommendation.priority
                  )}`}
                >
                  {recommendation.priority}
                </span>
                <span className="text-sm text-muted-foreground">
                  Machine: {recommendation.machine_id}
                </span>
                {recommendation.generated_by === "Gemini AI" && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border-purple-200">
                    IA Générative
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Metrics */}

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon
                      name="TrendingUp"
                      size={16}
                      className="text-green-600"
                    />
                    <span className="text-sm font-medium text-green-800">
                      Économies Potentielles
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {recommendation.potential_savings.toLocaleString("fr-MA")}{" "}
                    MAD/mois
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Clock" size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Retour sur Investissement
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {recommendation.payback_period} mois
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
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
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {recommendation.description}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Bénéfices Attendus
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="Zap" size={20} className="text-green-600" />
                    <div>
                      <div className="font-medium text-foreground">
                        Réduction Énergétique
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recommendation.energy_reduction}% de consommation en
                        moins
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon
                      name="DollarSign"
                      size={20}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-foreground">
                        Économies Annuelles
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(recommendation.potential_savings * 12).toLocaleString(
                          "fr-MA"
                        )}{" "}
                        MAD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "implementation" && (
            <div className="space-y-6">
              {/* Implementation Steps */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Étapes d'Implémentation
                </h3>
                <div className="space-y-3">
                  {recommendation.implementation_steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-muted rounded-lg"
                    >
                      <span className="bg-primary text-primary-foreground text-sm rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Required */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Ressources Requises
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Users" size={16} className="text-blue-600" />
                      <span className="font-medium text-foreground">
                        Personnel
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.resources_required.personnel}
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon
                        name="Wrench"
                        size={16}
                        className="text-orange-600"
                      />
                      <span className="font-medium text-foreground">
                        Outils
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.resources_required.tools}
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Clock" size={16} className="text-green-600" />
                      <span className="font-medium text-foreground">Durée</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.resources_required.duration} ouvrables
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon
                        name="DollarSign"
                        size={16}
                        className="text-red-600"
                      />
                      <span className="font-medium text-foreground">Coût</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.implementation_cost.toLocaleString(
                        "fr-MA"
                      )}{" "}
                      MAD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "impact" && (
            <div className="space-y-6">
              {/* Environmental Impact */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Impact Environnemental
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Leaf" size={20} className="text-green-600" />
                      <span className="font-medium text-green-800">
                        Réduction CO₂
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {recommendation.environmental_impact.co2_reduction}{" "}
                      tonnes/an
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Zap" size={20} className="text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Énergie Économisée
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {recommendation.environmental_impact.energy_saved} kWh/an
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Impact */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Impact Business
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon
                      name="TrendingUp"
                      size={20}
                      className="text-green-600"
                    />
                    <div>
                      <div className="font-medium text-foreground">
                        Amélioration de l'Efficacité
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Augmentation de{" "}
                        {recommendation.business_impact.efficiency_improvement}%
                        de l'efficacité énergétique
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="Shield" size={20} className="text-blue-600" />
                    <div>
                      <div className="font-medium text-foreground">
                        Réduction des Risques
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recommendation.business_impact.risk_reduction}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Icon name="Award" size={20} className="text-purple-600" />
                    <div>
                      <div className="font-medium text-foreground">
                        Conformité Réglementaire
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recommendation.business_impact.regulatory_compliance}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <div className="text-sm text-muted-foreground">
            Généré le{" "}
            {new Date(recommendation.generated_at).toLocaleDateString("fr-FR")}{" "}
            par EnergieAI
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleDismiss}
              disabled={isProcessing}
              iconName="X"
              iconSize={16}
            >
              Ignorer
            </Button>
            <Button
              variant="default"
              onClick={handleAccept}
              loading={isProcessing}
              iconName="Check"
              iconSize={16}
            >
              Accepter la Recommandation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;
