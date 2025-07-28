import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";

const ReportBuilder = ({ onReportConfigChange, selectedConfig, machines }) => {
  const [reportConfig, setReportConfig] = useState({
    template: "daily",
    dateRange: {
      startDate: "2025-07-01",
      endDate: new Date().toISOString().split("T")[0],
    },
    machines: [],
    metrics: [],
    format: "pdf",
    includeCharts: true,
    includeSummary: true,
    language: "fr",
  });

  const templateOptions = [
    {
      value: "daily",
      label: "Rapport Quotidien",
      description: "Analyse détaillée sur 24h",
    },
    {
      value: "weekly",
      label: "Rapport Hebdomadaire",
      description: "Synthèse sur 7 jours",
    },
    {
      value: "monthly",
      label: "Rapport Mensuel",
      description: "Analyse mensuelle complète",
    },
    {
      value: "compliance",
      label: "Conformité Réglementaire",
      description: "Standards industriels marocains",
    },
    {
      value: "cost-analysis",
      label: "Analyse des Coûts",
      description: "Comparaison et économies",
    },
  ];

  const machineOptions = machines.map((m) => ({ value: m.id, label: m.name }));
  const metricOptions = [
    { value: "energy-consumption", label: "Consommation Énergétique" },
    { value: "cost-analysis", label: "Analyse des Coûts (MAD)" },
    { value: "efficiency-scores", label: "Scores d'Efficacité" },
    { value: "co2-footprint", label: "Empreinte CO2" },
    { value: "uptime", label: "Temps de Fonctionnement" },
  ];

  const formatOptions = [
    {
      value: "pdf",
      label: "PDF",
      description: "Document formaté professionnel",
    },
    {
      value: "excel",
      label: "Excel",
      description: "Feuille de calcul avec données",
    },
    { value: "csv", label: "CSV", description: "Données brutes exportables" },
  ];

  const languageOptions = [
    { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },
  ];

  useEffect(() => {
    onReportConfigChange(reportConfig);
  }, [reportConfig, onReportConfigChange]);

  const handleConfigChange = (field, value) =>
    setReportConfig((prev) => ({ ...prev, [field]: value }));
  const handleDateRangeChange = (field, value) =>
    setReportConfig((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value },
    }));
  const handleArrayChange = (field, value, checked) =>
    setReportConfig((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Générateur de Rapports
          </h2>
          <p className="text-sm text-muted-foreground">
            Configurez votre rapport énergétique personnalisé
          </p>
        </div>
      </div>

      <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
        <Select
          label="Modèle de Rapport"
          description="Choisissez le type de rapport à générer"
          options={templateOptions}
          value={reportConfig.template}
          onChange={(value) => handleConfigChange("template", value)}
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date de Début"
            type="date"
            value={reportConfig.dateRange.startDate}
            onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
          />
          <Input
            label="Date de Fin"
            type="date"
            value={reportConfig.dateRange.endDate}
            onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Machines à Inclure
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
            {machineOptions.map((machine) => (
              <Checkbox
                key={machine.value}
                label={machine.label}
                checked={reportConfig.machines.includes(machine.value)}
                onChange={(e) =>
                  handleArrayChange("machines", machine.value, e.target.checked)
                }
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Métriques à Inclure
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
            {metricOptions.map((metric) => (
              <Checkbox
                key={metric.value}
                label={metric.label}
                checked={reportConfig.metrics.includes(metric.value)}
                onChange={(e) =>
                  handleArrayChange("metrics", metric.value, e.target.checked)
                }
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Format de Sortie"
            options={formatOptions}
            value={reportConfig.format}
            onChange={(value) => handleConfigChange("format", value)}
          />
          <Select
            label="Langue"
            options={languageOptions}
            value={reportConfig.language}
            onChange={(value) => handleConfigChange("language", value)}
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Options Supplémentaires
          </label>
          <div className="space-y-2">
            <Checkbox
              label="Inclure les Graphiques"
              description="Ajouter les visualisations de données"
              checked={reportConfig.includeCharts}
              onChange={(e) =>
                handleConfigChange("includeCharts", e.target.checked)
              }
            />
            <Checkbox
              label="Inclure le Résumé Exécutif"
              description="Ajouter une synthèse pour la direction"
              checked={reportConfig.includeSummary}
              onChange={(e) =>
                handleConfigChange("includeSummary", e.target.checked)
              }
            />
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Modèles Rapides
          </label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setReportConfig({
                  ...reportConfig,
                  template: "compliance",
                  machines: machineOptions.map((m) => m.value),
                  metrics: [
                    "energy-consumption",
                    "efficiency-scores",
                    "co2-footprint",
                  ],
                  format: "pdf",
                  includeCharts: true,
                  includeSummary: true,
                })
              }
              className="justify-start"
            >
              <Icon name="Shield" size={16} className="mr-2" /> Rapport de
              Conformité Standard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setReportConfig({
                  ...reportConfig,
                  template: "cost-analysis",
                  machines: machineOptions.map((m) => m.value),
                  metrics: ["cost-analysis", "efficiency-scores"],
                  format: "excel",
                  includeCharts: true,
                  includeSummary: true,
                })
              }
              className="justify-start"
            >
              <Icon name="DollarSign" size={16} className="mr-2" /> Analyse
              Financière Complète
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
