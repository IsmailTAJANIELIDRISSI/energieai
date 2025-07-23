import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MaintenanceModal = ({ machine, isOpen, onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    type: 'preventive',
    date: '',
    time: '',
    technician: '',
    description: '',
    priority: 'medium'
  });

  const typeOptions = [
    { value: 'preventive', label: 'Maintenance préventive' },
    { value: 'corrective', label: 'Maintenance corrective' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'cleaning', label: 'Nettoyage' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Haute' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const technicianOptions = [
    { value: 'hassan.alami', label: 'Hassan Alami' },
    { value: 'fatima.benali', label: 'Fatima Benali' },
    { value: 'mohamed.tazi', label: 'Mohamed Tazi' },
    { value: 'aicha.idrissi', label: 'Aicha Idrissi' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(machine, formData);
    onClose();
    setFormData({
      type: 'preventive',
      date: '',
      time: '',
      technician: '',
      description: '',
      priority: 'medium'
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !machine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-card p-6 rounded-lg border border-border shadow-modal w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Programmer une maintenance</h2>
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
          <Select
            label="Type de maintenance"
            options={typeOptions}
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
            <Input
              label="Heure"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              required
            />
          </div>

          <Select
            label="Technicien assigné"
            options={technicianOptions}
            value={formData.technician}
            onChange={(value) => handleChange('technician', value)}
            required
          />

          <Select
            label="Priorité"
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => handleChange('priority', value)}
            required
          />

          <Input
            label="Description"
            type="text"
            placeholder="Détails de la maintenance..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

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
              Programmer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;