import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";
import MachineFilters from "./components/MachineFilters";
import MachineGrid from "./components/MachineGrid";
import MachineDetailPanel from "./components/MachineDetailPanel";
import MaintenanceModal from "./components/MaintenanceModal";
import StatusUpdateModal from "./components/StatusUpdateModal";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

const MachineMonitoring = () => {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    department: "all",
    type: "all",
    status: "all",
    efficiency: "all",
  });
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "fr";
    setCurrentLanguage(savedLanguage);

    const fetchData = async () => {
      try {
        const machinesRes = await axios.get(
          `${import.meta.env.VITE_JSON_SERVER_URL}/machines`
        );
        setMachines(machinesRes.data);
        setFilteredMachines(machinesRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des machines");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = machines;

    if (filters.search) {
      filtered = filtered.filter((machine) =>
        machine.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.department !== "all") {
      filtered = filtered.filter(
        (machine) => machine.department === filters.department
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((machine) => machine.type === filters.type);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (machine) => machine.status === filters.status
      );
    }

    if (filters.efficiency !== "all") {
      filtered = filtered.filter((machine) => {
        switch (filters.efficiency) {
          case "high":
            return machine.efficiency >= 80;
          case "medium":
            return machine.efficiency >= 60 && machine.efficiency < 80;
          case "low":
            return machine.efficiency < 60;
          default:
            return true;
        }
      });
    }

    setFilteredMachines(filtered);
  }, [machines, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      department: "all",
      type: "all",
      status: "all",
      efficiency: "all",
    });
  };

  const handleSelectMachine = (machine) => {
    setSelectedMachine(machine);
  };

  const handleScheduleMaintenance = (machine) => {
    setSelectedMachine(machine);
    setMaintenanceModalOpen(true);
  };

  const handleUpdateStatus = (machine) => {
    setSelectedMachine(machine);
    setStatusModalOpen(true);
  };

  const handleExportData = async (machine) => {
    try {
      const data = {
        machine: machine.name,
        exportDate: new Date().toLocaleDateString("fr-FR"),
        data: {
          currentPower: machine.currentPower,
          efficiency: machine.efficiency,
          dailyCost: machine.dailyCost,
          uptime: machine.uptime,
        },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${machine.name.replace(/\s+/g, "_")}_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors de l'exportation:", err);
    }
  };

  const handleMaintenanceSchedule = async (machine, formData) => {
    console.log("Maintenance scheduled:", {
      machine: machine.name,
      ...formData,
    });
  };

  const handleStatusUpdate = async (machine, formData) => {
    try {
      await axios.patch(
        `${process.env.JSON_SERVER_URL}/machines/${machine.id}`,
        { status: formData.status }
      );
      setMachines((prev) =>
        prev.map((m) =>
          m.id === machine.id ? { ...m, status: formData.status } : m
        )
      );
      if (selectedMachine?.id === machine.id) {
        setSelectedMachine({ ...selectedMachine, status: formData.status });
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    }
  };

  const breadcrumbItems = [
    { label: "Accueil", path: "/dashboard-overview", icon: "Home" },
    {
      label: "Surveillance des Machines",
      path: "/machine-monitoring",
      icon: "Settings",
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Surveillance des Machines
              </h1>
              <p className="text-muted-foreground">
                Suivi en temps réel de la consommation énergétique et des
                performances
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="RefreshCw" size={16} className="animate-spin" />
                <span>Mise à jour automatique</span>
              </div>
              <Button
                variant="primary"
                iconName="Download"
                iconSize={16}
                onClick={() =>
                  handleExportData({ name: "Toutes_les_machines" })
                }
              >
                Exporter tout
              </Button>
            </div>
          </div>
          <MachineFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Machines ({filteredMachines.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Optimal</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Attention</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Critique</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Maintenance</span>
                  </div>
                </div>
              </div>
              <MachineGrid
                machines={filteredMachines}
                selectedMachine={selectedMachine}
                onSelectMachine={handleSelectMachine}
                onScheduleMaintenance={handleScheduleMaintenance}
              />
            </div>
            <div className="lg:col-span-4">
              <MachineDetailPanel
                machine={selectedMachine}
                onScheduleMaintenance={handleScheduleMaintenance}
                onUpdateStatus={handleUpdateStatus}
                onExportData={handleExportData}
              />
            </div>
          </div>
        </div>
      </main>
      <MaintenanceModal
        machine={selectedMachine}
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        onSchedule={handleMaintenanceSchedule}
      />
      <StatusUpdateModal
        machine={selectedMachine}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default MachineMonitoring;
