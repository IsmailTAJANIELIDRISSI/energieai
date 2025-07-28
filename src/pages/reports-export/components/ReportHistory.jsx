import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const ReportHistory = ({ onViewReport, onDeleteReport, reports }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const typeOptions = [
    { value: "all", label: "Tous les Types" },
    { value: "daily", label: "Quotidien" },
    { value: "weekly", label: "Hebdomadaire" },
    { value: "monthly", label: "Mensuel" },
  ];

  const sortOptions = [
    { value: "date-desc", label: "Plus Récent" },
    { value: "date-asc", label: "Plus Ancien" },
  ];

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredReports = reports.filter(
    (report) =>
      report.machine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(report.timestamp)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sortedReports = [...filteredReports].sort((a, b) =>
    sortBy === "date-desc"
      ? new Date(b.timestamp) - new Date(a.timestamp)
      : new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="History" size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Historique des Rapports
          </h2>
          <p className="text-sm text-muted-foreground">
            {sortedReports.length} entrées
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="search"
          placeholder="Rechercher un rapport..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={typeOptions}
          value={filterType}
          onChange={setFilterType}
          placeholder="Filtrer par type"
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Trier par"
        />
      </div>
      <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin">
        {sortedReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="FileX" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun rapport trouvé</p>
          </div>
        ) : (
          sortedReports.map((report) => (
            <div
              key={report.id}
              className="bg-background border border-border rounded-lg p-4 hover:shadow-card transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        Rapport - {report.machine_id}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success border-success/20">
                        Terminé
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Icon name="Calendar" size={14} />
                        <span>{formatDate(report.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Tag" size={14} />
                        <span>Quotidien</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>Consommation: {report.power_usage_kW} kW</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewReport(report)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = "#";
                      link.download = `Rapport_${
                        report.machine_id
                      }_${formatDate(report.timestamp)}.pdf`;
                      link.click();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteReport(report.id)}
                    className="text-muted-foreground hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-border pt-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {reports.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Entrées</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {reports.length}
            </div>
            <div className="text-xs text-muted-foreground">Terminés</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">0</div>
            <div className="text-xs text-muted-foreground">En Cours</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">0</div>
            <div className="text-xs text-muted-foreground">Téléchargements</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
