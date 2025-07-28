import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser usage
});
const ReportPreview = ({
  reportConfig,
  onGenerateReport,
  energyData,
  machines,
  alerts,
}) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Generate AI insights when data changes
  useEffect(() => {
    if (!energyData || !machines || !alerts) return;

    const generateAiInsights = async () => {
      setIsLoadingAi(true);
      try {
        // Prepare data for Claude
        const summaryData = {
          machines: machines.length,
          totalConsumption: energyData
            .reduce((sum, e) => sum + (e.power_usage_kW || 0), 0)
            .toFixed(1),
          averageEfficiency: (
            machines.reduce((sum, m) => sum + m.efficiency, 0) /
              machines.length || 0
          ).toFixed(1),
          criticalAlerts: alerts.filter((a) => a.severity === "critical")
            .length,
          dateRange: reportConfig?.dateRange || "last month",
        };

        const prompt = `You are an energy efficiency analyst for industrial equipment. Analyze this data and provide:
          1. A one-sentence executive summary in French
          2. Top 3 actionable recommendations with estimated savings
          3. Any detected anomalies with severity level
          4. all requirements for the report in french

          Data:
          - ${summaryData.machines} machines monitored
          - Total consumption: ${summaryData.totalConsumption} kWh
          - Average efficiency: ${summaryData.averageEfficiency}%
          - ${summaryData.criticalAlerts} critical alerts
          - Period: ${summaryData.dateRange}

          Format response as JSON with: {summary, recommendations: [{text, savings, impact}], anomalies: [{description, severity}]}`;

        const claudeResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          messages: [{ role: "user", content: prompt }],
        });

        let insights;

        let responseText = claudeResponse.content[0].text;

        // Remove markdown code blocks if present
        responseText = responseText
          .replace(/```json\n?/, "")
          .replace(/\n?```$/, "")
          .trim();

        // Try to find JSON within the response if it's wrapped in other text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseText = jsonMatch[0];
        }

        insights = JSON.parse(responseText);

        setAiInsights(insights);
      } catch (error) {
        console.error("JSON parse error:", parseError);
        console.log("Raw response:", claudeResponse.content[0].text);

        // Fall back to default insights
        const insights = {
          summary:
            "L'analyse avancée n'est pas disponible actuellement. Erreur de parsing des données.",
          recommendations: generateDefaultRecommendations(machines, energyData),
          anomalies: [],
        };
        console.error("Error generating AI insights:", error);
        setAiInsights(insights);
      } finally {
        setIsLoadingAi(false);
      }
    };

    generateAiInsights();
  }, [energyData, machines, alerts, reportConfig]);

  useEffect(() => {
    if (!energyData || !machines || !alerts) return;

    const filteredEnergy = energyData.filter(
      (e) =>
        new Date(e.timestamp) >= new Date(reportConfig?.dateRange?.startDate) &&
        new Date(e.timestamp) <= new Date(reportConfig?.dateRange?.endDate)
    );

    const machineData = machines
      .map((m) => {
        const energy = filteredEnergy.find((e) => e.machine_id === m.id) || {};
        return {
          name: m.name,
          value: energy.power_usage_kW || m.currentPower || 0,
          color: getMachineColor(m, energy.power_usage_kW),
        };
      })
      .filter((m) => m.value > 0);

    const summaryStats = {
      totalConsumption: `${filteredEnergy
        .reduce((sum, e) => sum + (e.power_usage_kW || 0), 0)
        .toFixed(1)} kWh`,
      totalCost: `${filteredEnergy
        .reduce((sum, e) => sum + (e.cost_mad || 0), 0)
        .toFixed(1)} MAD`,
      averageEfficiency: `${(
        machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length ||
        0
      ).toFixed(1)}%`,
      co2Footprint: `${(
        filteredEnergy.reduce((sum, e) => sum + (e.co2 || 0), 0) / 1000
      ).toFixed(1)} tonnes`,
      potentialSavings: calculatePotentialSavings(machines, filteredEnergy),
      peakDemand: `${Math.max(
        ...filteredEnergy.map((e) => e.power_usage_kW || 0)
      ).toFixed(1)} kW`,
    };

    setPreviewData({
      energyData: filteredEnergy.map((e) => ({
        date: new Date(e.timestamp).toLocaleDateString("fr-FR"),
        consumption: e.power_usage_kW || 0,
        cost: e.cost_mad || 0,
      })),
      machineData,
      summaryStats,
      recommendations:
        aiInsights?.recommendations ||
        generateDefaultRecommendations(machines, filteredEnergy),
      generatedAt: new Date().toLocaleString("fr-FR"),
      reportTitle: getReportTitle(reportConfig?.template),
      dateRange: `${reportConfig?.dateRange?.startDate} - ${reportConfig?.dateRange?.endDate}`,
      aiSummary: aiInsights?.summary,
      anomalies: aiInsights?.anomalies || [],
    });
  }, [reportConfig, energyData, machines, alerts, aiInsights]);

  console.log(aiInsights);

  // Helper functions
  const getMachineColor = (machine, powerUsage) => {
    if (machine.efficiency < 70) return "#ef4444"; // Red for low efficiency
    if (powerUsage > machine.ratedPower * 0.9) return "#f59e0b"; // Yellow for high usage
    return "#2563eb"; // Blue for normal
  };

  const calculatePotentialSavings = (machines, energyData) => {
    let savings = 0;
    machines.forEach((m) => {
      const machineEnergy = energyData.filter((e) => e.machine_id === m.id);
      const avgConsumption =
        machineEnergy.length > 0
          ? machineEnergy.reduce((sum, e) => sum + e.power_usage_kW, 0) /
            machineEnergy.length
          : 0;

      if (m.efficiency < 80) savings += 200;
      if (avgConsumption > m.ratedPower * 0.9) savings += 300;
      if (m.status === "alert") savings += 150;
    });
    return `${savings} MAD`;
  };

  const generateDefaultRecommendations = (machines, energyData) => {
    return machines
      .filter((m) => m.efficiency < 80 || m.status === "alert")
      .sort((a, b) => a.efficiency - b.efficiency)
      .slice(0, 3)
      .map((m) => ({
        text: `Optimiser ${m.name} (${m.efficiency}% efficacité)`,
        savings: "200-500 MAD",
        impact: "Haute",
      }));
  };

  const getReportTitle = (template) =>
    ({
      daily: "Rapport Énergétique Quotidien",
      weekly: "Rapport Énergétique Hebdomadaire",
      monthly: "Rapport Énergétique Mensuel",
      compliance: "Rapport de Conformité Réglementaire",
      "cost-analysis": "Analyse des Coûts Énergétiques",
    }[template] || "Rapport Énergétique");

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      console.log(previewData);

      const finalReport = {
        ...previewData,
        executiveSummary: aiInsights?.summary || "Résumé analytique standard",
        detailedRecommendations: aiInsights?.recommendations || [],
        anomalies: aiInsights?.anomalies || [],
      };

      await onGenerateReport(reportConfig, finalReport);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!previewData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon
              name="FileText"
              size={24}
              className="text-primary animate-pulse"
            />
          </div>
          <p className="text-muted-foreground">Préparation des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} className="text-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Aperçu du Rapport
              </h2>
              <p className="text-sm text-muted-foreground">
                Prévisualisation avant génération
              </p>
            </div>
          </div>
          <Button
            variant="default"
            onClick={handleGenerateReport}
            loading={isGenerating}
            iconName="Download"
            iconPosition="left"
            disabled={isLoadingAi}
          >
            {isGenerating ? "Génération..." : "Générer Rapport"}
          </Button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        <div className="space-y-6">
          <div className="text-center border-b border-border pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-energy-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  EnergieAI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Audit Énergétique Intelligent
                </p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {previewData.reportTitle}
            </h2>
            <p className="text-muted-foreground">
              Période: {previewData.dateRange}
            </p>
            <p className="text-sm text-muted-foreground">
              Généré le: {previewData.generatedAt}
            </p>
          </div>

          {reportConfig?.includeSummary && (
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon
                  name="TrendingUp"
                  size={20}
                  className="mr-2 text-primary"
                />
                Résumé Exécutif
              </h3>

              {isLoadingAi ? (
                <div className="animate-pulse space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  {previewData.aiSummary}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {previewData.summaryStats.totalConsumption}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Consommation Totale
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {previewData.summaryStats.totalCost}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Coût Total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-energy-primary">
                    {previewData.summaryStats.averageEfficiency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Efficacité Moyenne
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {previewData.summaryStats.co2Footprint}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Empreinte CO2
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {previewData.summaryStats.potentialSavings}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Économies Potentielles
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-error">
                    {previewData.summaryStats.peakDemand}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Demande de Pointe
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewData.anomalies.length > 0 && (
            <div className="bg-error/5 border border-error/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon
                  name="AlertTriangle"
                  size={20}
                  className="mr-2 text-error"
                />
                Anomalies Détectées
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {previewData.anomalies.map((anomaly, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {anomaly.severity === "high" ? "⚠️ " : "ℹ️ "}
                      {anomaly.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reportConfig?.includeCharts && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Icon
                  name="BarChart3"
                  size={20}
                  className="mr-2 text-primary"
                />
                Visualisations des Données
              </h3>
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="text-md font-medium text-foreground mb-4">
                  Consommation Énergétique Quotidienne
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={previewData.energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value, name) => [
                          value ? `${value} kWh` : "0 kWh",
                          "Consommation",
                        ]}
                      />
                      <Bar
                        dataKey="consumption"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="text-md font-medium text-foreground mb-4">
                  Répartition par Machine
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={previewData.machineData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {previewData.machineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} kW (${(props.payload.percent * 100).toFixed(
                            1
                          )}%)`,
                          props.payload.name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Lightbulb" size={20} className="mr-2 text-accent" />
              Recommandations Intelligentes
            </h3>
            {isLoadingAi ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 animate-pulse"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {previewData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Check" size={14} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {rec.text}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {rec.savings && (
                          <span className="bg-success/10 px-2 py-1 rounded">
                            💰 {rec.savings}
                          </span>
                        )}
                        {rec.impact && (
                          <span className="bg-warning/10 px-2 py-1 rounded">
                            ⚡ Impact: {rec.impact}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p>Ce rapport a été généré automatiquement par EnergieAI</p>
            <p>Pour plus d'informations, contactez support@energieai.ma</p>
            {aiInsights && (
              <p className="mt-2 text-[10px] opacity-70">
                Analyse avancée fournie par Claude AI
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
