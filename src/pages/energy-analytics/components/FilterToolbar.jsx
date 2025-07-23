import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ 
  dateRange, 
  onDateRangeChange, 
  selectedMachines, 
  onMachineChange,
  selectedMetric,
  onMetricChange,
  onExportPDF,
  onRefresh 
}) => {
  const dateRangeOptions = [
    { value: '7d', label: 'Derniers 7 jours' },
    { value: '30d', label: 'Derniers 30 jours' },
    { value: '90d', label: 'Derniers 3 mois' },
    { value: '1y', label: 'Dernière année' },
    { value: 'custom', label: 'Période personnalisée' }
  ];

  const machineOptions = [
    { value: 'all', label: 'Toutes les machines' },
    { value: 'production', label: 'Ligne de production' },
    { value: 'packaging', label: 'Emballage' },
    { value: 'cooling', label: 'Refroidissement' },
    { value: 'heating', label: 'Chauffage' }
  ];

  const metricOptions = [
    { value: 'consumption', label: 'Consommation (kWh)' },
    { value: 'cost', label: 'Coût (MAD)' },
    { value: 'efficiency', label: 'Efficacité (%)' },
    { value: 'co2', label: 'Émissions CO₂ (kg)' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Select
            label=""
            placeholder="Période"
            options={dateRangeOptions}
            value={dateRange}
            onChange={onDateRangeChange}
            className="w-full sm:w-48"
          />
          
          <Select
            label=""
            placeholder="Machines"
            options={machineOptions}
            value={selectedMachines}
            onChange={onMachineChange}
            className="w-full sm:w-48"
          />
          
          <Select
            label=""
            placeholder="Métrique"
            options={metricOptions}
            value={selectedMetric}
            onChange={onMetricChange}
            className="w-full sm:w-48"
          />
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onRefresh}
          >
            Actualiser
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExportPDF}
          >
            Exporter PDF
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="Share"
            iconPosition="left"
          >
            Partager
          </Button>
        </div>
      </div>

      {/* Quick Date Filters */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground mr-2">Accès rapide:</span>
        {['Aujourd\'hui', 'Hier', 'Cette semaine', 'Ce mois'].map((period) => (
          <button
            key={period}
            onClick={() => onDateRangeChange(period.toLowerCase())}
            className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterToolbar;