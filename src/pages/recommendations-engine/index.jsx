import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";
import RecommendationCard from "./components/RecommendationCard";
import FilterPanel from "./components/FilterPanel";
import ImplementationTracker from "./components/ImplementationTracker";
import RecommendationModal from "./components/RecommendationModal";
import { applyRecommendationFilters } from "../../utils/energyCalculations";
import VoiceAgentButton from "./components/VoiceAgentButton";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportDocument from "./components/ExportPdfButton";
import Anthropic from "@anthropic-ai/sdk";

const RecommendationsEngine = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [implementations, setImplementations] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: "potentialSavings",
    priority: "",
    difficulty: "",
    machineId: "",
    category: "",
    minSavings: "",
    maxPayback: "",
    quickFilter: "",
  });
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add energyData and machines to state
  const [energyData, setEnergyData] = useState([]);
  const [machines, setMachines] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("fr");

  // Initialize Anthropic client (put this outside your component)
  const anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) setCurrentLanguage(savedLanguage);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [recRes, implRes, energyRes, machinesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/recommendations`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/implementations`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/energy`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
        ]);

        const energyData = energyRes.data;
        setEnergyData(energyData);
        setMachines(machinesRes.data);

        // Call Claude 4 Sonnet to generate new recommendations
        const prompt = `
        Vous êtes un agent intelligent optimisant une usine intelligente.
        Données énergétiques :
        \`\`\`json
        ${JSON.stringify(energyData.slice(-5), null, 2)}
        \`\`\`
        Machines :
        \`\`\`json
        ${JSON.stringify(machinesRes.data, null, 2)}
        \`\`\`
        Générez 3 recommandations pour optimiser l'énergie ou la maintenance. Pour chaque recommandation, fournissez :
        - title (titre court)
        - description (2-3 phrases)
        - machine_id (e.g., COMP-001)
        - priority (Critique, Élevée, Moyenne, Faible)
        - potential_savings (MAD/mois, estimé)
        - payback_period (mois)
        - difficulty (Facile, Modérée, Difficile)
        - implementation_steps (liste de 2-3 étapes)
        - energy_reduction (%)
        - implementation_cost (MAD)
        Formattez en JSON uniquement, sans texte supplémentaire.
      `;

        const claudeResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const aiRecommendations = JSON.parse(
          claudeResponse.content[0].text.replace(/```json|```/g, "")
        );

        const newRecommendations = aiRecommendations.map((rec, index) => ({
          ...rec,
          id: `REC-AI-${Date.now()}-${index}`,
          icon: "Lightbulb",
          generated_at: new Date().toISOString(),
          generated_by: "Claude AI",
        }));

        // Merge AI recommendations with existing ones
        const updatedRecommendations = [...recRes.data, ...newRecommendations];
        await Promise.all(
          newRecommendations.map((rec) =>
            axios.post(
              `${import.meta.env.VITE_JSON_SERVER_URL}/recommendations`,
              rec
            )
          )
        );

        setRecommendations(updatedRecommendations);
        setImplementations(implRes.data);
        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des recommandations ou de l'IA");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAcceptRecommendation = async (recommendationId) => {
    try {
      const recommendation = recommendations.find(
        (rec) => rec.id === recommendationId
      );
      if (recommendation) {
        const newImplementation = {
          id: `IMPL-${Date.now()}`,
          title: recommendation.title,
          machine_id: recommendation.machine_id,
          status: "En Attente",
          progress: 0,
          expected_savings: recommendation.potential_savings,
          actual_savings: 0,
          implementation_cost: recommendation.implementation_cost,
          accepted_at: new Date().toISOString(),
          completed_at: null,
        };
        await axios.post(
          `${import.meta.env.VITE_JSON_SERVER_URL}/implementations`,
          newImplementation
        );
        await axios.delete(
          `${
            import.meta.env.VITE_JSON_SERVER_URL
          }/recommendations/${recommendationId}`
        );
        setImplementations((prev) => [...prev, newImplementation]);
        setRecommendations((prev) =>
          prev.filter((rec) => rec.id !== recommendationId)
        );
      }
    } catch (err) {
      console.error("Erreur lors de l'acceptation:", err);
    }
  };

  const handleDismissRecommendation = async (recommendationId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_JSON_SERVER_URL
        }/recommendations/${recommendationId}`
      );
      setRecommendations((prev) =>
        prev.filter((rec) => rec.id !== recommendationId)
      );
    } catch (err) {
      console.error("Erreur lors du rejet:", err);
    }
  };

  const handleUpdateImplementationStatus = async (
    implementationId,
    newStatus
  ) => {
    try {
      const implementation = implementations.find(
        (impl) => impl.id === implementationId
      );
      const updated = {
        ...implementation,
        status: newStatus,
        progress:
          newStatus === "Implémenté"
            ? 100
            : newStatus === "En Cours"
            ? 50
            : implementation.progress,
        completed_at:
          newStatus === "Implémenté"
            ? new Date().toISOString()
            : implementation.completed_at,
        actual_savings:
          newStatus === "Implémenté"
            ? implementation.expected_savings * (0.9 + Math.random() * 0.2)
            : implementation.actual_savings,
      };
      await axios.put(
        `${
          import.meta.env.VITE_JSON_SERVER_URL
        }/implementations/${implementationId}`,
        updated
      );
      setImplementations((prev) =>
        prev.map((impl) => (impl.id === implementationId ? updated : impl))
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: "potentialSavings",
      priority: "",
      difficulty: "",
      machineId: "",
      category: "",
      minSavings: "",
      maxPayback: "",
      quickFilter: "",
    });
  };

  const filteredRecommendations = applyRecommendationFilters(
    recommendations,
    filters
  );

  const breadcrumbItems = [
    { label: "Accueil", path: "/dashboard-overview", icon: "Home" },
    {
      label: "Moteur de Recommandations",
      path: "/recommendations-engine",
      icon: "FileText",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Chargement des recommandations...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div
            className="py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-energy-primary rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Moteur de Recommandations
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Optimisations intelligentes basées sur l'analyse énergétique
                    en temps réel
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <VoiceAgentButton
                  energyData={energyData}
                  machines={machines}
                  onNewRecommendations={(rec) =>
                    setRecommendations((prev) => [...prev, rec])
                  }
                />
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconSize={16}
                  onClick={() => window.location.reload()}
                >
                  Actualiser
                </Button>
                {/* <Button variant="default" iconName="Download" iconSize={16}>
                  Exporter Rapport
                </Button> */}
                <PDFDownloadLink
                  document={
                    <ReportDocument
                      recommendations={filteredRecommendations}
                      implementations={implementations}
                      currentLanguage={currentLanguage}
                    />
                  }
                  fileName={`Rapport_Optimisation_Energétique_${
                    new Date().toISOString().split("T")[0]
                  }.pdf`}
                >
                  {({ blob, url, loading, error }) => (
                    <Button
                      variant="default"
                      iconName="Download"
                      iconSize={16}
                      disabled={loading}
                    >
                      {loading ? "Génération..." : "Exporter Rapport"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredRecommendations.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recommandations Actives
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon
                    name="TrendingUp"
                    size={20}
                    className="text-green-600"
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredRecommendations
                      .reduce((sum, rec) => sum + rec.potential_savings, 0)
                      .toLocaleString("fr-MA")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    MAD/mois Potentiels
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {implementations.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    En Implémentation
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon
                    name="CheckCircle"
                    size={20}
                    className="text-purple-600"
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {
                      implementations.filter(
                        (impl) => impl.status === "Implémenté"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Implémentées
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-6">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
              <div className="space-y-6">
                {filteredRecommendations.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-12 text-center shadow-card">
                    <Icon
                      name="Search"
                      size={48}
                      className="text-muted-foreground mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucune recommandation trouvée
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Aucune recommandation ne correspond aux filtres
                      sélectionnés.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      iconName="X"
                      iconSize={16}
                    >
                      Effacer les Filtres
                    </Button>
                  </div>
                ) : (
                  filteredRecommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <RecommendationCard
                        recommendation={recommendation}
                        onAccept={handleAcceptRecommendation}
                        onDismiss={handleDismissRecommendation}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="sticky top-24">
                <ImplementationTracker
                  implementations={implementations}
                  onUpdateStatus={handleUpdateImplementationStatus}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <RecommendationModal
        recommendation={selectedRecommendation}
        isOpen={isOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptRecommendation}
        onDismiss={handleDismissRecommendation}
        energyData={energyData} // Pass energyData fetched in useEffect
      />
    </div>
  );
};

export default RecommendationsEngine;
