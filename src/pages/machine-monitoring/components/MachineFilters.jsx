import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const MachineFilters = ({ filters, onFilterChange, onReset }) => {
  const departmentOptions = [
    { value: 'all', label: 'Tous les départements' },
    { value: 'production', label: 'Production' },
    { value: 'packaging', label: 'Emballage' },
    { value: 'quality', label: 'Contrôle qualité' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'conveyor', label: 'Convoyeur' },
    { value: 'mixer', label: 'Mélangeur' },
    { value: 'compressor', label: 'Compresseur' },
    { value: 'pump', label: 'Pompe' },
    { value: 'heater', label: 'Chauffage' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'optimal', label: 'Optimal' },
    { value: 'attention', label: 'Attention requise' },
    { value: 'critical', label: 'Critique' },
    { value: 'maintenance', label: 'En maintenance' }
  ];

  const efficiencyOptions = [
    { value: 'all', label: 'Toutes efficacités' },
    { value: 'high', label: 'Élevée (≥80%)' },
    { value: 'medium', label: 'Moyenne (60-79%)' },
    { value: 'low', label: 'Faible (<60%)' }
  ];

  return (
    <div className="bg-card p-4 rounded-lg border border-border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconSize={16}
          onClick={onReset}
        >
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          type="search"
          placeholder="Rechercher une machine..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="lg:col-span-1"
        />

        <Select
          options={departmentOptions}
          value={filters.department}
          onChange={(value) => onFilterChange('department', value)}
          placeholder="Département"
        />

        <Select
          options={typeOptions}
          value={filters.type}
          onChange={(value) => onFilterChange('type', value)}
          placeholder="Type de machine"
        />

        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Statut"
        />

        <Select
          options={efficiencyOptions}
          value={filters.efficiency}
          onChange={(value) => onFilterChange('efficiency', value)}
          placeholder="Efficacité"
        />
      </div>
    </div>
  );
};

export default MachineFilters;