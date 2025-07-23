import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AlertFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityOptions = [
    { value: 'all', label: 'Toutes les sévérités' },
    { value: 'critical', label: 'Critique' },
    { value: 'high', label: 'Élevée' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'low', label: 'Faible' },
    { value: 'info', label: 'Information' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'new', label: 'Nouveau' },
    { value: 'acknowledged', label: 'Reconnu' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'resolved', label: 'Résolu' },
    { value: 'closed', label: 'Fermé' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'energy', label: 'Énergie' },
    { value: 'equipment', label: 'Équipement' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'system', label: 'Système' },
    { value: 'safety', label: 'Sécurité' }
  ];

  const locationOptions = [
    { value: 'all', label: 'Tous les emplacements' },
    { value: 'production_line_1', label: 'Ligne de production 1' },
    { value: 'production_line_2', label: 'Ligne de production 2' },
    { value: 'warehouse', label: 'Entrepôt' },
    { value: 'office', label: 'Bureau' },
    { value: 'utilities', label: 'Services généraux' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.severity !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.dateRange?.start) count++;
    if (filters.search) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filtres</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={14}
            >
              Effacer
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
          >
            {isExpanded ? 'Réduire' : 'Étendre'}
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Rechercher des alertes..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
        />
        
        <Select
          options={severityOptions}
          value={filters.severity || 'all'}
          onChange={(value) => handleFilterChange('severity', value)}
          placeholder="Sévérité"
        />
        
        <Select
          options={statusOptions}
          value={filters.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Statut"
        />
        
        <Select
          options={categoryOptions}
          value={filters.category || 'all'}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Catégorie"
        />
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              options={locationOptions}
              value={filters.location || 'all'}
              onChange={(value) => handleFilterChange('location', value)}
              placeholder="Emplacement"
            />
            
            <Input
              type="date"
              label="Date de début"
              value={filters.dateRange?.start || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...filters.dateRange,
                start: e.target.value
              })}
            />
            
            <Input
              type="date"
              label="Date de fin"
              value={filters.dateRange?.end || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...filters.dateRange,
                end: e.target.value
              })}
            />
          </div>
          
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.severity === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('severity', 
                filters.severity === 'critical' ? 'all' : 'critical'
              )}
              iconName="AlertTriangle"
              iconSize={14}
            >
              Critiques
            </Button>
            
            <Button
              variant={filters.status === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('status', 
                filters.status === 'new' ? 'all' : 'new'
              )}
              iconName="Bell"
              iconSize={14}
            >
              Nouveaux
            </Button>
            
            <Button
              variant={filters.category === 'energy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('category', 
                filters.category === 'energy' ? 'all' : 'energy'
              )}
              iconName="Zap"
              iconSize={14}
            >
              Énergie
            </Button>
            
            <Button
              variant={filters.category === 'equipment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('category', 
                filters.category === 'equipment' ? 'all' : 'equipment'
              )}
              iconName="Settings"
              iconSize={14}
            >
              Équipement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertFilters;