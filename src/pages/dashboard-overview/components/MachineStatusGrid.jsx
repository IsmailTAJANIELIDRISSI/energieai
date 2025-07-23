import React from 'react';
import Icon from '../../../components/AppIcon';

const MachineStatusGrid = ({ machines = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'alert':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return 'CheckCircle';
      case 'alert':
        return 'AlertTriangle';
      case 'maintenance':
        return 'Wrench';
      case 'inactive':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Opérationnel';
      case 'alert':
        return 'Alerte';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactif';
      default:
        return 'Inconnu';
    }
  };

  const formatPower = (power) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(power);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">État des Machines</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">Opérationnel</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-slate-600">Alerte</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-slate-600">Maintenance</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="Settings" size={18} className="text-slate-600" />
                <h4 className="font-medium text-slate-900 truncate">{machine.name}</h4>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(machine.status)}`}>
                <div className="flex items-center space-x-1">
                  <Icon name={getStatusIcon(machine.status)} size={12} />
                  <span>{getStatusText(machine.status)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Puissance:</span>
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  {formatPower(machine.power)} kW
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Efficacité:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {machine.efficiency}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Température:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {machine.temperature}°C
                </span>
              </div>

              {machine.lastMaintenance && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Dernière maintenance:</span>
                  <span className="text-xs text-slate-500">
                    {new Date(machine.lastMaintenance).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>

            {machine.status === 'alert' && machine.alertMessage && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <Icon name="AlertTriangle" size={12} className="inline mr-1" />
                {machine.alertMessage}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineStatusGrid;