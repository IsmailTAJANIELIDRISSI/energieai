import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScheduledReports = ({ onCreateSchedule, onUpdateSchedule, onDeleteSchedule }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    template: 'weekly',
    frequency: 'weekly',
    dayOfWeek: '1',
    dayOfMonth: '1',
    time: '09:00',
    recipients: '',
    format: 'pdf',
    active: true
  });

  const mockSchedules = [
    {
      id: 'SCH-001',
      name: 'Rapport Hebdomadaire Automatique',
      template: 'weekly',
      frequency: 'weekly',
      dayOfWeek: 1,
      time: '09:00',
      recipients: ['ahmed.mansouri@energieai.ma', 'direction@usine.ma'],
      format: 'pdf',
      active: true,
      lastRun: '2025-01-20T09:00:00',
      nextRun: '2025-01-27T09:00:00',
      runCount: 12,
      successRate: 100
    },
    {
      id: 'SCH-002',
      name: 'Bilan Mensuel Direction',
      template: 'monthly',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '08:00',
      recipients: ['direction@usine.ma', 'comptabilite@usine.ma'],
      format: 'excel',
      active: true,
      lastRun: '2025-01-01T08:00:00',
      nextRun: '2025-02-01T08:00:00',
      runCount: 6,
      successRate: 100
    },
    {
      id: 'SCH-003',
      name: 'Conformité Trimestrielle',
      template: 'compliance',
      frequency: 'quarterly',
      dayOfMonth: 15,
      time: '10:30',
      recipients: ['conformite@usine.ma', 'qualite@usine.ma'],
      format: 'pdf',
      active: false,
      lastRun: '2024-10-15T10:30:00',
      nextRun: '2025-01-15T10:30:00',
      runCount: 4,
      successRate: 75
    }
  ];

  const templateOptions = [
    { value: 'daily', label: 'Rapport Quotidien' },
    { value: 'weekly', label: 'Rapport Hebdomadaire' },
    { value: 'monthly', label: 'Rapport Mensuel' },
    { value: 'compliance', label: 'Conformité Réglementaire' },
    { value: 'cost-analysis', label: 'Analyse des Coûts' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'quarterly', label: 'Trimestriel' }
  ];

  const dayOfWeekOptions = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '0', label: 'Dimanche' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (editingSchedule) {
      onUpdateSchedule(editingSchedule.id, formData);
      setEditingSchedule(null);
    } else {
      onCreateSchedule(formData);
    }
    
    setShowCreateForm(false);
    setFormData({
      name: '',
      template: 'weekly',
      frequency: 'weekly',
      dayOfWeek: '1',
      dayOfMonth: '1',
      time: '09:00',
      recipients: '',
      format: 'pdf',
      active: true
    });
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name,
      template: schedule.template,
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek?.toString() || '1',
      dayOfMonth: schedule.dayOfMonth?.toString() || '1',
      time: schedule.time,
      recipients: schedule.recipients.join(', '),
      format: schedule.format,
      active: schedule.active
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingSchedule(null);
    setFormData({
      name: '',
      template: 'weekly',
      frequency: 'weekly',
      dayOfWeek: '1',
      dayOfMonth: '1',
      time: '09:00',
      recipients: '',
      format: 'pdf',
      active: true
    });
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel'
    };
    return labels[frequency] || frequency;
  };

  const getNextRunText = (schedule) => {
    const nextRun = new Date(schedule.nextRun);
    const now = new Date();
    const diffTime = nextRun - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays < 7) return `Dans ${diffDays} jours`;
    
    return nextRun.toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (schedule) => {
    if (!schedule.active) {
      return { label: 'Inactif', className: 'bg-muted text-muted-foreground border-muted' };
    }
    
    if (schedule.successRate >= 95) {
      return { label: 'Excellent', className: 'bg-success/10 text-success border-success/20' };
    } else if (schedule.successRate >= 80) {
      return { label: 'Bon', className: 'bg-warning/10 text-warning border-warning/20' };
    } else {
      return { label: 'Problème', className: 'bg-error/10 text-error border-error/20' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Rapports Programmés</h2>
            <p className="text-sm text-muted-foreground">Automatisation des rapports récurrents</p>
          </div>
        </div>
        
        <Button
          variant="default"
          onClick={() => setShowCreateForm(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Nouveau Planning
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-muted/50 border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {editingSchedule ? 'Modifier le Planning' : 'Nouveau Planning'}
          </h3>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom du Planning"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Ex: Rapport hebdomadaire direction"
              />
              
              <Select
                label="Modèle de Rapport"
                options={templateOptions}
                value={formData.template}
                onChange={(value) => setFormData({...formData, template: value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Fréquence"
                options={frequencyOptions}
                value={formData.frequency}
                onChange={(value) => setFormData({...formData, frequency: value})}
              />
              
              {formData.frequency === 'weekly' && (
                <Select
                  label="Jour de la Semaine"
                  options={dayOfWeekOptions}
                  value={formData.dayOfWeek}
                  onChange={(value) => setFormData({...formData, dayOfWeek: value})}
                />
              )}
              
              {(formData.frequency === 'monthly' || formData.frequency === 'quarterly') && (
                <Input
                  label="Jour du Mois"
                  type="number"
                  min="1"
                  max="28"
                  value={formData.dayOfMonth}
                  onChange={(e) => setFormData({...formData, dayOfMonth: e.target.value})}
                />
              )}
              
              <Input
                label="Heure d'Envoi"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Destinataires"
                type="email"
                value={formData.recipients}
                onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                placeholder="email1@domain.com, email2@domain.com"
                description="Séparez les emails par des virgules"
                required
              />
              
              <Select
                label="Format"
                options={formatOptions}
                value={formData.format}
                onChange={(value) => setFormData({...formData, format: value})}
              />
            </div>

            <div>
              <Checkbox
                label="Activer ce planning"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editingSchedule ? 'Mettre à Jour' : 'Créer Planning'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto scrollbar-thin">
        {mockSchedules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Calendar" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun planning configuré</p>
          </div>
        ) : (
          mockSchedules.map((schedule) => {
            const statusBadge = getStatusBadge(schedule);
            
            return (
              <div key={schedule.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-card transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Calendar" size={20} className="text-accent" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-foreground">{schedule.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="RefreshCw" size={14} />
                          <span>{getFrequencyLabel(schedule.frequency)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Clock" size={14} />
                          <span>{schedule.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="FileText" size={14} />
                          <span>{schedule.format.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Calendar" size={14} />
                          <span>Prochain: {getNextRunText(schedule)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div className="mb-1">
                          <strong>Destinataires:</strong> {schedule.recipients.join(', ')}
                        </div>
                        <div>
                          <strong>Statistiques:</strong> {schedule.runCount} exécutions • {schedule.successRate}% de succès
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(schedule)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Toggle active status
                        onUpdateSchedule(schedule.id, { ...schedule, active: !schedule.active });
                      }}
                      className={schedule.active ? 'text-success hover:text-success/80' : 'text-muted-foreground hover:text-foreground'}
                    >
                      <Icon name={schedule.active ? 'Pause' : 'Play'} size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="text-muted-foreground hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="border-t border-border pt-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{mockSchedules.length}</div>
            <div className="text-xs text-muted-foreground">Total Plannings</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {mockSchedules.filter(s => s.active).length}
            </div>
            <div className="text-xs text-muted-foreground">Actifs</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {mockSchedules.reduce((sum, s) => sum + s.runCount, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Exécutions</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-accent">
              {Math.round(mockSchedules.reduce((sum, s) => sum + s.successRate, 0) / mockSchedules.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Taux de Succès</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledReports;