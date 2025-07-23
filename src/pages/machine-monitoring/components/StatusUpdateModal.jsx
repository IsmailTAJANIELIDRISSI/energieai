import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const StatusUpdateModal = ({ machine, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: machine?.status || 'optimal',
    reason: '',
    notes: ''
  });

  const statusOptions = [
    { value: 'optimal', label: 'Optimal', description: 'Fonctionnement normal' },
    { value: 'attention', label: 'Attention requise', description: 'Surveillance nécessaire' },
    { value: 'critical', label: 'Critique', description: 'Intervention urgente' },
    { value: 'maintenance', label: 'En maintenance', description: 'Hors service temporaire' }
  ];

  const reasonOptions = [
    { value: 'routine_check', label: 'Vérification de routine' },
    { value: 'performance_issue', label: 'Problème de performance' },
    { value: 'energy_consumption', label: 'Consommation énergétique élevée' },
    { value: 'mechanical_issue', label: 'Problème mécanique' },
    { value: 'scheduled_maintenance', label: 'Maintenance programmée' },
    { value: 'emergency_stop', label: 'Arrêt d\'urgence' },
    { value: 'other', label: 'Autre' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(machine, formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600';
      case 'attention':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      case 'maintenance':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  if (!isOpen || !machine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-card p-6 rounded-lg border border-border shadow-modal w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Mettre à jour le statut</h2>
            <p className="text-sm text-muted-foreground">{machine.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Statut actuel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('status', option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    formData.status === option.value
                      ? 'border-primary bg-primary bg-opacity-10' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className={`font-medium ${getStatusColor(option.value)}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Raison du changement"
            options={reasonOptions}
            value={formData.reason}
            onChange={(value) => handleChange('reason', value)}
            required
          />

          <Input
            label="Notes additionnelles"
            type="text"
            placeholder="Détails sur le changement de statut..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-foreground mb-1">Information</div>
                <div className="text-muted-foreground">
                  Le changement de statut sera enregistré avec l'horodatage et votre identifiant utilisateur.
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              Mettre à jour
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;