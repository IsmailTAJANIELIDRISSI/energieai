import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MachineCard = ({ machine, isSelected, onSelect, onScheduleMaintenance }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'border-green-500 bg-green-50';
      case 'attention':
        return 'border-orange-500 bg-orange-50';
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'maintenance':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-slate-300 bg-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal':
        return { name: 'CheckCircle', color: 'text-green-600' };
      case 'attention':
        return { name: 'AlertTriangle', color: 'text-orange-600' };
      case 'critical':
        return { name: 'AlertCircle', color: 'text-red-600' };
      case 'maintenance':
        return { name: 'Wrench', color: 'text-blue-600' };
      default:
        return { name: 'Circle', color: 'text-slate-400' };
    }
  };

  const statusIcon = getStatusIcon(machine.status);

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        getStatusColor(machine.status)
      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onSelect(machine)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={statusIcon.name} size={20} className={statusIcon.color} />
          <h3 className="font-semibold text-foreground">{machine.name}</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
          {machine.type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Consommation actuelle</span>
          <span className="font-mono font-semibold text-foreground">
            {machine.currentPower} kW
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Efficacité</span>
          <div className="flex items-center space-x-1">
            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  machine.efficiency >= 80
                    ? 'bg-green-500'
                    : machine.efficiency >= 60
                    ? 'bg-orange-500' :'bg-red-500'
                }`}
                style={{ width: `${machine.efficiency}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {machine.efficiency}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dernière maintenance</span>
          <span className="text-sm text-foreground">{machine.lastMaintenance}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Département: {machine.department}
        </div>
        <Button
          variant="ghost"
          size="xs"
          iconName="Calendar"
          iconSize={14}
          onClick={(e) => {
            e.stopPropagation();
            onScheduleMaintenance(machine);
          }}
        >
          Maintenance
        </Button>
      </div>
    </div>
  );
};

export default MachineCard;