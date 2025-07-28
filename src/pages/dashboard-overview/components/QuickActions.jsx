import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const QuickActions = ({
  onGenerateReport,
  onViewRecommendations,
  onExportData,
  ExportPdfButton,
}) => {
  const actions = [
    {
      id: "generate-report",
      title: "Générer un Rapport",
      description: "Créer un rapport PDF détaillé",
      icon: "FileText",
      variant: "default",
      onClick: onGenerateReport,
    },
    {
      id: "view-recommendations",
      title: "Voir les Recommandations",
      description: "Consulter les optimisations suggérées",
      icon: "Lightbulb",
      variant: "outline",
      onClick: onViewRecommendations,
    },
    {
      id: "export-data",
      title: "Exporter les Données",
      description: "Télécharger les données en CSV/Excel",
      icon: "Download",
      variant: "ghost",
      onClick: onExportData,
    },
    {
      id: "export-data-pdf",
      title: "Exporter les Données en PDF",
      description: "Télécharger les données en PDF",
      icon: "Download",
      variant: "ghost",
      customComponent: ExportPdfButton,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Actions Rapides
      </h3>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name={action.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">{action.title}</h4>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
            </div>

            {action.customComponent ? (
              action.customComponent
            ) : (
              <Button
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
                iconName="ChevronRight"
                iconPosition="right"
                iconSize={16}
              >
                Ouvrir
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Dernière mise à jour:</span>
          <span className="text-slate-900 font-medium">
            {new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
