import api from "./api";

class RecommendationService {
  async getRecommendations(params = {}) {
    const response = await api.get("/recommendations", { params });
    return response.data;
  }

  async updateRecommendationStatus(id, status) {
    const response = await api.patch(`/recommendations/${id}`, { status });
    return response.data;
  }

  calculatePriority(potentialSavings, implementationCost) {
    const roi = potentialSavings / (implementationCost || 1);
    if (roi > 5) return "high";
    if (roi > 2) return "medium";
    return "low";
  }

  generateRecommendation(machineData, energyData) {
    const { specifications, status } = machineData;
    const { powerConsumption } = energyData;

    if (powerConsumption > specifications.optimalPower) {
      return {
        type: "efficiency",
        priority: "high",
        title: "Optimisation de la consommation",
        description: `Consommation actuelle ${powerConsumption}W au-dessus de l'optimal ${specifications.optimalPower}W. Ajuster les paramètres de fonctionnement.`,
        potentialSavings:
          (powerConsumption - specifications.optimalPower) * 0.15, // 15% du surplus
        implementationCost: 0,
      };
    }

    return null;
  }
}

export default new RecommendationService();
