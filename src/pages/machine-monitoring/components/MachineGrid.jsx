import React from 'react';
import MachineCard from './MachineCard';

const MachineGrid = ({ machines, selectedMachine, onSelectMachine, onScheduleMaintenance }) => {
  if (machines.length === 0) {
    return (
      <div className="bg-card p-8 rounded-lg border border-border text-center">
        <div className="text-muted-foreground">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Aucune machine trouvée</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          isSelected={selectedMachine?.id === machine.id}
          onSelect={onSelectMachine}
          onScheduleMaintenance={onScheduleMaintenance}
        />
      ))}
    </div>
  );
};

export default MachineGrid;