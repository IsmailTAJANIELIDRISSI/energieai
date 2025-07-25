import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MachineFilters from './components/MachineFilters';
import MachineGrid from './components/MachineGrid';
import MachineDetailPanel from './components/MachineDetailPanel';
import MaintenanceModal from './components/MaintenanceModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const MachineMonitoring = () => {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    type: 'all',
    status: 'all',
    efficiency: 'all'
  });
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  // Mock machine data
  const mockMachines = [
    {
      id: 1,
      name: 'Convoyeur Principal A1',
      type: 'conveyor',
      department: 'production',
      status: 'optimal',
      currentPower: 45.2,
      efficiency: 87,
      lastMaintenance: '15/01/2025',
      dailyCost: 324,
      uptime: 98.5
    },
    {
      id: 2,
      name: 'Mélangeur Industriel B2',
      type: 'mixer',
      department: 'production',
      status: 'attention',
      currentPower: 72.8,
      efficiency: 73,
      lastMaintenance: '08/01/2025',
      dailyCost: 523,
      uptime: 94.2
    },
    {
      id: 3,
      name: 'Compresseur Air C1',
      type: 'compressor',
      department: 'maintenance',
      status: 'critical',
      currentPower: 95.4,
      efficiency: 58,
      lastMaintenance: '28/12/2024',
      dailyCost: 685,
      uptime: 89.1
    },
    {
      id: 4,
      name: 'Pompe Hydraulique D3',
      type: 'pump',
      department: 'production',
      status: 'optimal',
      currentPower: 38.6,
      efficiency: 91,
      lastMaintenance: '20/01/2025',
      dailyCost: 277,
      uptime: 99.2
    },
    {
      id: 5,
      name: 'Système Chauffage E1',
      type: 'heater',
      department: 'quality',
      status: 'maintenance',
      currentPower: 0,
      efficiency: 0,
      lastMaintenance: '22/01/2025',
      dailyCost: 0,
      uptime: 0
    },
    {
      id: 6,
      name: 'Convoyeur Emballage F2',
      type: 'conveyor',
      department: 'packaging',
      status: 'optimal',
      currentPower: 28.3,
      efficiency: 84,
      lastMaintenance: '18/01/2025',
      dailyCost: 203,
      uptime: 97.8
    },
    {
      id: 7,
      name: 'Mélangeur Secondaire G1',
      type: 'mixer',
      department: 'production',
      status: 'attention',
      currentPower: 65.7,
      efficiency: 69,
      lastMaintenance: '12/01/2025',
      dailyCost: 472,
      uptime: 92.5
    },
    {
      id: 8,
      name: 'Compresseur Auxiliaire H2',
      type: 'compressor',
      department: 'maintenance',
      status: 'optimal',
      currentPower: 52.1,
      efficiency: 82,
      lastMaintenance: '16/01/2025',
      dailyCost: 374,
      uptime: 96.7
    }
  ];

  useEffect(() => {
    // Load language preference
    const savedLanguage = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(savedLanguage);

    // Initialize machines data
    setMachines(mockMachines);
    setFilteredMachines(mockMachines);

    // Auto-refresh data every 2 seconds
    const interval = setInterval(() => {
      // Simulate real-time updates
      setMachines(prevMachines => 
        prevMachines.map(machine => ({
          ...machine,
          currentPower: machine.status === 'maintenance' ? 0 : 
            machine.currentPower + (Math.random() - 0.5) * 2,
          efficiency: machine.status === 'maintenance' ? 0 :
            Math.max(0, Math.min(100, machine.efficiency + (Math.random() - 0.5) * 2))
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = machines;

    if (filters.search) {
      filtered = filtered.filter(machine =>
        machine.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.department !== 'all') {
      filtered = filtered.filter(machine => machine.department === filters.department);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(machine => machine.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(machine => machine.status === filters.status);
    }

    if (filters.efficiency !== 'all') {
      filtered = filtered.filter(machine => {
        switch (filters.efficiency) {
          case 'high':
            return machine.efficiency >= 80;
          case 'medium':
            return machine.efficiency >= 60 && machine.efficiency < 80;
          case 'low':
            return machine.efficiency < 60;
          default:
            return true;
        }
      });
    }

    setFilteredMachines(filtered);
  }, [machines, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'all',
      type: 'all',
      status: 'all',
      efficiency: 'all'
    });
  };

  const handleSelectMachine = (machine) => {
    setSelectedMachine(machine);
  };

  const handleScheduleMaintenance = (machine) => {
    setSelectedMachine(machine);
    setMaintenanceModalOpen(true);
  };

  const handleUpdateStatus = (machine) => {
    setSelectedMachine(machine);
    setStatusModalOpen(true);
  };

  const handleExportData = (machine) => {
    // Mock export functionality
    const data = {
      machine: machine.name,
      exportDate: new Date().toLocaleDateString('fr-FR'),
      data: {
        currentPower: machine.currentPower,
        efficiency: machine.efficiency,
        dailyCost: machine.dailyCost,
        uptime: machine.uptime
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${machine.name.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMaintenanceSchedule = (machine, formData) => {
    // Mock maintenance scheduling
    console.log('Maintenance scheduled:', { machine: machine.name, ...formData });
    // In real app, this would make an API call
  };

  const handleStatusUpdate = (machine, formData) => {
    // Mock status update
    setMachines(prevMachines =>
      prevMachines.map(m =>
        m.id === machine.id ? { ...m, status: formData.status } : m
      )
    );
    
    if (selectedMachine?.id === machine.id) {
      setSelectedMachine({ ...selectedMachine, status: formData.status });
    }
  };

  const breadcrumbItems = [
    { label: 'Accueil', path: '/dashboard-overview', icon: 'Home' },
    { label: 'Surveillance des Machines', path: '/machine-monitoring', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Surveillance des Machines
              </h1>
              <p className="text-muted-foreground">
                Suivi en temps réel de la consommation énergétique et des performances
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="RefreshCw" size={16} className="animate-spin" />
                <span>Mise à jour automatique</span>
              </div>
              <Button
                variant="primary"
                iconName="Download"
                iconSize={16}
                onClick={() => handleExportData({ name: 'Toutes_les_machines' })}
              >
                Exporter tout
              </Button>
            </div>
          </div>

          {/* Filters */}
          <MachineFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Machine Grid */}
            <div className="lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Machines ({filteredMachines.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Optimal</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Attention</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Critique</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Maintenance</span>
                  </div>
                </div>
              </div>
              
              <MachineGrid
                machines={filteredMachines}
                selectedMachine={selectedMachine}
                onSelectMachine={handleSelectMachine}
                onScheduleMaintenance={handleScheduleMaintenance}
              />
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-4">
              <MachineDetailPanel
                machine={selectedMachine}
                onScheduleMaintenance={handleScheduleMaintenance}
                onUpdateStatus={handleUpdateStatus}
                onExportData={handleExportData}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <MaintenanceModal
        machine={selectedMachine}
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        onSchedule={handleMaintenanceSchedule}
      />

      <StatusUpdateModal
        machine={selectedMachine}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default MachineMonitoring;