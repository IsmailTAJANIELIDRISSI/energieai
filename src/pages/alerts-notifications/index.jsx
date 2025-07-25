import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AlertCard from "./components/AlertCard";
import AlertFilters from "./components/AlertFilters";
import AlertSummary from "./components/AlertSummary";
import AlertTabs from "./components/AlertTabs";
import BulkActions from "./components/BulkActions";
import AlertModal from "./components/AlertModal";

const AlertsNotifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    severity: "all",
    status: "all",
    category: "all",
    location: "all",
    dateRange: { start: "", end: "" },
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [alertsRes, machinesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/alerts`),
          axios.get(`${import.meta.env.VITE_JSON_SERVER_URL}/machines`),
        ]);

        // Transform alerts to include location names
        const transformedAlerts = alertsRes.data.map((alert) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
          location: alert.machine_id
            ? machinesRes.data.find((m) => m.id === alert.machine_id)?.name ||
              alert.location
            : alert.location,
        }));

        setAlerts(transformedAlerts);
        setMachines(machinesRes.data);
        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des alertes");
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 50000); // Auto-refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [alerts, filters, activeTab, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...alerts];

    // Tab filtering
    if (activeTab !== "all") {
      if (activeTab === "critical") {
        filtered = filtered.filter((alert) => alert.severity === "critical");
      } else if (activeTab === "warnings") {
        filtered = filtered.filter((alert) =>
          ["high", "medium"].includes(alert.severity)
        );
      } else if (activeTab === "info") {
        filtered = filtered.filter((alert) =>
          ["low", "info"].includes(alert.severity)
        );
      } else if (activeTab === "new") {
        filtered = filtered.filter((alert) => alert.status === "new");
      }
    }

    // Search filtering
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm) ||
          alert.description.toLowerCase().includes(searchTerm) ||
          alert.location.toLowerCase().includes(searchTerm)
      );
    }

    // Other filters
    if (filters.severity !== "all") {
      filtered = filtered.filter(
        (alert) => alert.severity === filters.severity
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((alert) => alert.status === filters.status);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (alert) => alert.category === filters.category
      );
    }

    if (filters.location !== "all") {
      filtered = filtered.filter((alert) =>
        alert.location.includes(filters.location)
      );
    }

    // Date range filtering
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(
        (alert) => new Date(alert.timestamp) >= startDate
      );
    }

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (alert) => new Date(alert.timestamp) <= endDate
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "timestamp") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAlerts(filtered);
  };

  const getAlertCounts = () => {
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === "critical").length,
      warnings: alerts.filter((a) => ["high", "medium"].includes(a.severity))
        .length,
      info: alerts.filter((a) => ["low", "info"].includes(a.severity)).length,
      new: alerts.filter((a) => a.status === "new").length,
    };
  };

  const handleAlertSelect = (alertId, isSelected) => {
    if (isSelected) {
      setSelectedAlerts((prev) => [...prev, alertId]);
    } else {
      setSelectedAlerts((prev) => prev.filter((id) => id !== alertId));
    }
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map((alert) => alert.id));
    }
  };

  const handleBulkAction = async (action, alertIds, data = {}) => {
    try {
      const updates = alertIds.map(async (alertId) => {
        const alert = alerts.find((a) => a.id === alertId);
        if (!alert) return;

        let updatedAlert;
        switch (action) {
          case "acknowledge":
            updatedAlert = { ...alert, status: "acknowledged" };
            break;
          case "resolve":
            updatedAlert = { ...alert, status: "resolved" };
            break;
          case "close":
            updatedAlert = { ...alert, status: "closed" };
            break;
          case "assign":
            updatedAlert = { ...alert, assignedTo: data.user };
            break;
          case "delete":
            await axios.delete(
              `${import.meta.env.VITE_JSON_SERVER_URL}/alerts/${alertId}`
            );
            return null;
          default:
            return alert;
        }
        await axios.patch(
          `${import.meta.env.VITE_JSON_SERVER_URL}/alerts/${alertId}`,
          updatedAlert
        );
        return updatedAlert;
      });

      const updatedAlerts = (await Promise.all(updates)).filter(Boolean);
      setAlerts((prev) =>
        prev
          .map(
            (alert) => updatedAlerts.find((u) => u?.id === alert.id) || alert
          )
          .filter(Boolean)
      );
      setSelectedAlerts([]);
    } catch (err) {
      console.error("Erreur lors de l'action groupée:", err);
      setError("Erreur lors de l'application des actions groupées");
    }
  };

  const handleAlertAction = async (action, alertId, data = {}) => {
    try {
      switch (action) {
        case "acknowledge":
          await axios.patch(
            `${import.meta.env.VITE_JSON_SERVER_URL}/alerts/${alertId}`,
            { status: "acknowledged" }
          );
          setAlerts((prev) =>
            prev.map((alert) =>
              alert.id === alertId
                ? { ...alert, status: "acknowledged" }
                : alert
            )
          );
          break;
        case "assign":
          await axios.patch(
            `${import.meta.env.VITE_JSON_SERVER_URL}/alerts/${alertId}`,
            { assignedTo: data.user }
          );
          setAlerts((prev) =>
            prev.map((alert) =>
              alert.id === alertId ? { ...alert, assignedTo: data.user } : alert
            )
          );
          break;
        case "addNote":
          await axios.patch(
            `${import.meta.env.VITE_JSON_SERVER_URL}/alerts/${alertId}`,
            { notes: data.notes }
          );
          setAlerts((prev) =>
            prev.map((alert) =>
              alert.id === alertId ? { ...alert, notes: data.notes } : alert
            )
          );
          break;
        case "viewDetails":
          const alert = alerts.find((a) => a.id === alertId);
          setSelectedAlert(alert);
          setIsModalOpen(true);
          break;
      }
    } catch (err) {
      console.error(`Erreur lors de l'action ${action}:`, err);
      setError(`Erreur lors de l'exécution de l'action ${action}`);
    }
  };

  const handleSaveAlert = async (alertId, formData) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_JSON_SERVER_URL}/alerts/${alertId}`,
        formData
      );
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, ...formData } : alert
        )
      );
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de l'alerte:", err);
      setError("Erreur lors de la sauvegarde de l'alerte");
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      severity: "all",
      status: "all",
      category: "all",
      location: "all",
      dateRange: { start: "", end: "" },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">
              Chargement des alertes...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon
              name="AlertTriangle"
              size={48}
              className="text-error mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Erreur de Chargement
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Icon name="Bell" size={28} className="mr-3 text-primary" />
                Alertes et Notifications
              </h1>
              <p className="text-muted-foreground mt-1">
                Surveillance en temps réel des événements critiques
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RotateCcw"
                iconSize={16}
                onClick={() => window.location.reload()}
              >
                Actualiser
              </Button>
              <Button variant="default" iconName="Settings" iconSize={16}>
                Configurer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AlertTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCounts={getAlertCounts()}
      />

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Filters */}
            <AlertFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedAlerts.length === filteredAlerts.length &&
                      filteredAlerts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    {filteredAlerts.length} alerte
                    {filteredAlerts.length > 1 ? "s" : ""}
                  </span>
                </div>
                {selectedAlerts.length > 0 && (
                  <span className="text-sm text-primary font-medium">
                    {selectedAlerts.length} sélectionnée
                    {selectedAlerts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="text-sm border border-border rounded-md px-3 py-1 bg-background"
                >
                  <option value="timestamp-desc">Plus récent</option>
                  <option value="timestamp-asc">Plus ancien</option>
                  <option value="severity-desc">Sévérité élevée</option>
                  <option value="severity-asc">Sévérité faible</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Icon
                    name="Bell"
                    size={48}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Aucune alerte trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    Aucune alerte ne correspond aux critères de filtrage
                    actuels.
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute left-4 top-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={(e) =>
                          handleAlertSelect(alert.id, e.target.checked)
                        }
                        className="rounded border-border"
                      />
                    </div>
                    <div className="pl-10">
                      <AlertCard
                        alert={alert}
                        onAcknowledge={(id) =>
                          handleAlertAction("acknowledge", id)
                        }
                        onAssign={(id, user) =>
                          handleAlertAction("assign", id, { user })
                        }
                        onAddNote={(id, notes) =>
                          handleAlertAction("addNote", id, { notes })
                        }
                        onViewDetails={(id) =>
                          handleAlertAction("viewDetails", id)
                        }
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-card p-6">
          <AlertSummary alerts={alerts} />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedAlerts={selectedAlerts}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedAlerts([])}
      />

      <AlertModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        onSave={handleSaveAlert}
      />
    </div>
  );
};

export default AlertsNotifications;
