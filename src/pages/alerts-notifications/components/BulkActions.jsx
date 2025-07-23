import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedAlerts, onBulkAction, onClearSelection }) => {
  const [showActions, setShowActions] = useState(false);
  const [assignUser, setAssignUser] = useState('');

  const userOptions = [
    { value: '', label: 'Sélectionner un utilisateur' },
    { value: 'ahmed.mansouri', label: 'Ahmed Mansouri' },
    { value: 'fatima.benali', label: 'Fatima Benali' },
    { value: 'youssef.alami', label: 'Youssef Alami' },
    { value: 'sara.idrissi', label: 'Sara Idrissi' },
    { value: 'omar.tazi', label: 'Omar Tazi' }
  ];

  const handleBulkAction = (action, data = {}) => {
    onBulkAction(action, selectedAlerts, data);
    if (action === 'assign' && assignUser) {
      setAssignUser('');
    }
    setShowActions(false);
  };

  if (selectedAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-modal p-4 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {selectedAlerts.length}
            </div>
            <span className="font-medium text-foreground">
              {selectedAlerts.length} alerte{selectedAlerts.length > 1 ? 's' : ''} sélectionnée{selectedAlerts.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('acknowledge')}
            iconName="Check"
            iconSize={14}
          >
            Reconnaître
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            iconName="MoreHorizontal"
            iconSize={14}
          >
            Plus d'actions
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('resolve')}
            iconName="CheckCircle"
            iconSize={14}
          >
            Résoudre
          </Button>
        </div>

        {showActions && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('close')}
                iconName="Archive"
                iconSize={14}
                className="justify-start"
              >
                Fermer
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
                iconSize={14}
                className="justify-start text-destructive hover:text-destructive"
              >
                Supprimer
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('export')}
                iconName="Download"
                iconSize={14}
                className="justify-start"
              >
                Exporter
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('priority', { priority: 'high' })}
                iconName="ArrowUp"
                iconSize={14}
                className="justify-start"
              >
                Priorité haute
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                options={userOptions}
                value={assignUser}
                onChange={setAssignUser}
                placeholder="Assigner à..."
                className="flex-1"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('assign', { user: assignUser })}
                disabled={!assignUser}
                iconName="UserPlus"
                iconSize={14}
              >
                Assigner
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;