export const calculateMetrics = (energyData, machines) => {
  console.log(energyData);

  const totalConsumption = energyData.reduce(
    (sum, entry) => sum + (entry.power_usage_kW || 0),
    0
  );
  const currentConsumption = energyData.reduce(
    (sum, entry) => sum + (entry.power_usage_kW || 0),
    0
  );
  const averageCost = energyData.reduce(
    (sum, entry) => sum + (entry.cost_mad || 0),
    0
  );
  const dailyCost = energyData.reduce(
    (sum, entry) => sum + (entry.cost_mad || 0),
    0
  );
  const efficiency =
    energyData.length > 0
      ? Math.round(
          energyData.reduce(
            (sum, entry) => sum + (entry.efficiency_score || 0),
            0
          ) / energyData.length
        )
      : 0;
  const co2Footprint = energyData.reduce(
    (sum, entry) => sum + (entry.co2 || 0),
    0
  );

  return {
    currentConsumption,
    dailyCost,
    totalConsumption: totalConsumption || 0,
    averageCost: averageCost || 0,
    efficiency: efficiency || 0,
    co2Footprint: co2Footprint || 0,
  };
};

export const calculateCostDistribution = (energyData, machines) => {
  const totalCost = energyData.reduce(
    (sum, entry) => sum + (entry.cost_mad || 0),
    0
  );
  const categories = [
    {
      name: "Machines de Production",
      types: ["compressor", "cutter", "mixer", "pump"],
    },
    { name: "Éclairage", types: ["lighting"] },
    { name: "Climatisation", types: ["cooling"] },
    { name: "Équipements Auxiliaires", types: ["conveyor", "packaging"] },
  ];
  console.log(energyData);

  return categories.map((category) => {
    const categoryCost = energyData
      .filter((entry) => {
        const machine = machines.find((m) => m.id === entry.machine_id);
        return machine && category.types.includes(machine.type);
      })
      .reduce((sum, entry) => sum + (entry.cost_mad || 0), 0);
    return {
      name: category.name,
      value: categoryCost,
      percentage:
        totalCost > 0 ? Math.round((categoryCost / totalCost) * 100) : 0,
    };
  });
};

export const applyRecommendationFilters = (recommendations, filters) => {
  let filtered = [...recommendations];

  if (filters.priority) {
    filtered = filtered.filter((rec) => rec.priority === filters.priority);
  }
  if (filters.difficulty) {
    filtered = filtered.filter((rec) => rec.difficulty === filters.difficulty);
  }
  if (filters.machine_id) {
    filtered = filtered.filter((rec) => rec.machine_id === filters.machine_id);
  }
  if (filters.category) {
    filtered = filtered.filter((rec) => rec.category === filters.category);
  }
  if (filters.minSavings) {
    filtered = filtered.filter(
      (rec) => rec.potential_savings >= parseInt(filters.minSavings)
    );
  }
  if (filters.maxPayback) {
    filtered = filtered.filter(
      (rec) => rec.payback_period <= parseInt(filters.maxPayback)
    );
  }
  if (filters.quickFilter === "high-impact") {
    filtered = filtered.filter((rec) => rec.potential_savings >= 2000);
  } else if (filters.quickFilter === "quick-wins") {
    filtered = filtered.filter(
      (rec) => rec.payback_period <= 6 && rec.difficulty === "Facile"
    );
  } else if (filters.quickFilter === "low-cost") {
    filtered = filtered.filter((rec) => rec.implementation_cost <= 10000);
  }

  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "potentialSavings":
        return b.potential_savings - a.potential_savings;
      case "paybackPeriod":
        return a.payback_period - b.payback_period;
      case "priority":
        const priorityOrder = { Critique: 4, Élevée: 3, Moyenne: 2, Faible: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "generatedAt":
        return new Date(b.generated_at) - new Date(a.generated_at);
      default:
        return 0;
    }
  });

  return filtered;
};

export const calculateMachineMetrics = (energyData, machineId) => {
  const machineData = energyData.filter(
    (entry) => entry.machine_id === machineId
  );
  const totalConsumption = machineData.reduce(
    (sum, entry) => sum + (entry.power_usage_kW || 0),
    0
  );
  const totalCost = machineData.reduce(
    (sum, entry) => sum + (entry.cost_mad || 0),
    0
  );
  const averageEfficiency =
    machineData.length > 0
      ? Math.round(
          machineData.reduce(
            (sum, entry) => sum + (entry.efficiency_score || 0),
            0
          ) / machineData.length
        )
      : 0;

  return {
    totalConsumption,
    totalCost,
    averageEfficiency,
    operatingHours: machineData.length,
    hourlyData: machineData.map((entry) => ({
      hour: new Date(entry.timestamp).toISOString().slice(11, 13) + "h",
      consumption: entry.power_usage_kW || 0,
    })),
    efficiencyDistribution: [
      {
        name: "Excellent (90-100%)",
        value: machineData.filter((e) => (e.efficiency_score || 0) >= 90)
          .length,
      },
      {
        name: "Bon (80-89%)",
        value: machineData.filter(
          (e) =>
            (e.efficiency_score || 0) >= 80 && (e.efficiency_score || 0) < 90
        ).length,
      },
      {
        name: "Moyen (70-79%)",
        value: machineData.filter(
          (e) =>
            (e.efficiency_score || 0) >= 70 && (e.efficiency_score || 0) < 80
        ).length,
      },
      {
        name: "Faible (60-69%)",
        value: machineData.filter(
          (e) =>
            (e.efficiency_score || 0) >= 60 && (e.efficiency_score || 0) < 70
        ).length,
      },
      {
        name: "Critique (<60%)",
        value: machineData.filter((e) => (e.efficiency_score || 0) < 60).length,
      },
    ],
  };
};
