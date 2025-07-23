import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'Critique', label: 'Critique' },
    { value: 'Élevée', label: 'Élevée' },
    { value: 'Moyenne', label: 'Moyenne' },
    { value: 'Faible', label: 'Faible' }
  ];

  const difficultyOptions = [
    { value: '', label: 'Toutes les difficultés' },
    { value: 'Facile', label: 'Facile' },
    { value: 'Modérée', label: 'Modérée' },
    { value: 'Difficile', label: 'Difficile' }
  ];

  const sortOptions = [
    { value: 'potentialSavings', label: 'Économies potentielles (↓)' },
    { value: 'paybackPeriod', label: 'Retour sur investissement (↑)' },
    { value: 'priority', label: 'Priorité (↓)' },
    { value: 'generatedAt', label: 'Date de génération (↓)' }
  ];

  const machineOptions = [
    { value: '', label: 'Toutes les machines' },
    { value: 'COMP-001', label: 'Compresseur Principal (COMP-001)' },
    { value: 'PUMP-002', label: 'Pompe Hydraulique (PUMP-002)' },
    { value: 'CONV-003', label: 'Convoyeur A (CONV-003)' },
    { value: 'HEAT-004', label: 'Système de Chauffage (HEAT-004)' },
    { value: 'COOL-005', label: 'Système de Refroidissement (COOL-005)' }
  ];

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'maintenance', label: 'Maintenance Préventive' },
    { value: 'optimization', label: 'Optimisation Énergétique' },
    { value: 'replacement', label: 'Remplacement d\'Équipement' },
    { value: 'scheduling', label: 'Planification Opérationnelle' },
    { value: 'automation', label: 'Automatisation' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="X"
          iconSize={14}
          className="text-muted-foreground hover:text-foreground"
        >
          Effacer
        </Button>
      </div>

      <div className="space-y-4">
        {/* Sort By */}
        <div>
          <Select
            label="Trier par"
            options={sortOptions}
            value={filters.sortBy || 'potentialSavings'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            className="w-full"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <Select
            label="Priorité"
            options={priorityOptions}
            value={filters.priority || ''}
            onChange={(value) => handleFilterChange('priority', value)}
            className="w-full"
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <Select
            label="Difficulté d'implémentation"
            options={difficultyOptions}
            value={filters.difficulty || ''}
            onChange={(value) => handleFilterChange('difficulty', value)}
            className="w-full"
          />
        </div>

        {/* Machine Filter */}
        <div>
          <Select
            label="Machine concernée"
            options={machineOptions}
            value={filters.machineId || ''}
            onChange={(value) => handleFilterChange('machineId', value)}
            searchable
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            label="Catégorie"
            options={categoryOptions}
            value={filters.category || ''}
            onChange={(value) => handleFilterChange('category', value)}
            className="w-full"
          />
        </div>

        {/* Savings Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Économies minimales (MAD/mois)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              step="100"
              placeholder="0"
              value={filters.minSavings || ''}
              onChange={(e) => handleFilterChange('minSavings', e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="text-sm text-muted-foreground">MAD</span>
          </div>
        </div>

        {/* Payback Period Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Retour sur investissement max (mois)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            placeholder="12"
            value={filters.maxPayback || ''}
            onChange={(e) => handleFilterChange('maxPayback', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Filtres Rapides</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.quickFilter === 'high-impact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('quickFilter', 
              filters.quickFilter === 'high-impact' ? '' : 'high-impact'
            )}
            iconName="TrendingUp"
            iconSize={14}
          >
            Fort Impact
          </Button>
          <Button
            variant={filters.quickFilter === 'quick-wins' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('quickFilter', 
              filters.quickFilter === 'quick-wins' ? '' : 'quick-wins'
            )}
            iconName="Zap"
            iconSize={14}
          >
            Gains Rapides
          </Button>
          <Button
            variant={filters.quickFilter === 'low-cost' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('quickFilter', 
              filters.quickFilter === 'low-cost' ? '' : 'low-cost'
            )}
            iconName="DollarSign"
            iconSize={14}
          >
            Faible Coût
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;