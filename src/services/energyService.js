import api from "./api";

class EnergyService {
  async getEnergyReadings(params = {}) {
    const response = await api.get("/energyReadings", { params });
    return response.data;
  }

  async getMachineStatus(machineId) {
    const response = await api.get(`/machines/${machineId}`);
    return response.data;
  }

  async getEnergyMetrics(date) {
    const response = await api.get("/energyMetrics", {
      params: { date },
    });
    return response.data;
  }

  calculateEfficiency(powerConsumption, optimalPower) {
    return (optimalPower / powerConsumption) * 100;
  }

  calculateCost(consumption, rate = 0.15) {
    return consumption * rate;
  }

  calculateCO2Emissions(consumption, emissionFactor = 0.0005) {
    return consumption * emissionFactor;
  }

  async getAlerts(params = {}) {
    const response = await api.get("/alerts", { params });
    return response.data;
  }
}

export default new EnergyService();
