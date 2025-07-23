import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AlertModal = ({ alert, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: alert?.status || 'new',
    assignedTo: alert?.assignedTo || '',
    priority: alert?.priority || 'medium',
    notes: alert?.notes || '',
    resolution: alert?.resolution || ''
  });

  const statusOptions = [
    { value: 'new', label: 'Nouveau' },
    { value: 'acknowledged', label: 'Reconnu' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'resolved', label: 'Résolu' },
    { value: 'closed', label: 'Fermé' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Élevée' },
    { value: 'critical', label: 'Critique' }
  ];

  const userOptions = [
    { value: '', label: 'Non assigné' },
    { value: 'ahmed.mansouri', label: 'Ahmed Mansouri' },
    { value: 'fatima.benali', label: 'Fatima Benali' },
    { value: 'youssef.alami', label: 'Youssef Alami' },
    { value: 'sara.idrissi', label: 'Sara Idrissi' },
    { value: 'omar.tazi', label: 'Omar Tazi' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(alert.id, formData);
    onClose();
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
      high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
      medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
      low: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
      info: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    };
    return configs[severity] || configs.info;
  };

  if (!isOpen || !alert) return null;

  const severityConfig = getSeverityConfig(alert.severity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-modal rounded-lg">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${severityConfig.bg} border ${severityConfig.border}`}>
                <Icon name="AlertTriangle" size={24} className={severityConfig.color} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {alert.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{alert.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{new Date(alert.timestamp).toLocaleString('fr-FR')}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Alert Details */}
          <div className="mb-6">
            <h3 className="font-medium text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {alert.description}
            </p>
          </div>

          {/* Recommendations */}
          {alert.recommendations && alert.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-foreground mb-2">Actions recommandées</h3>
              <ul className="space-y-2">
                {alert.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <Icon name="ArrowRight" size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Select
              label="Statut"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
            />
            
            <Select
              label="Priorité"
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
            />
            
            <Select
              label="Assigné à"
              options={userOptions}
              value={formData.assignedTo}
              onChange={(value) => handleInputChange('assignedTo', value)}
              className="md:col-span-2"
            />
          </div>

          <div className="space-y-4 mb-6">
            <Input
              label="Notes"
              type="text"
              placeholder="Ajouter des notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
            
            {formData.status === 'resolved' && (
              <Input
                label="Résolution"
                type="text"
                placeholder="Décrire la résolution..."
                value={formData.resolution}
                onChange={(e) => handleInputChange('resolution', e.target.value)}
                required
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            
            <Button
              variant="default"
              onClick={handleSave}
              iconName="Save"
              iconSize={16}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;