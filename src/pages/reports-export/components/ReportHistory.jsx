import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReportHistory = ({ onViewReport, onDeleteReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const mockReports = [
    {
      id: 'RPT-2025-001',
      title: 'Rapport Énergétique Mensuel - Janvier 2025',
      type: 'monthly',
      format: 'pdf',
      size: '2.4 MB',
      createdAt: '2025-01-23T10:30:00',
      createdBy: 'Ahmed Mansouri',
      status: 'completed',
      downloadCount: 5,
      machines: ['all'],
      dateRange: '01/01/2025 - 31/01/2025'
    },
    {
      id: 'RPT-2025-002',
      title: 'Analyse des Coûts Énergétiques - Q4 2024',
      type: 'cost-analysis',
      format: 'excel',
      size: '1.8 MB',
      createdAt: '2025-01-22T14:15:00',
      createdBy: 'Fatima Benali',
      status: 'completed',
      downloadCount: 12,
      machines: ['production-line-1', 'production-line-2'],
      dateRange: '01/10/2024 - 31/12/2024'
    },
    {
      id: 'RPT-2025-003',
      title: 'Rapport de Conformité Réglementaire',
      type: 'compliance',
      format: 'pdf',
      size: '3.1 MB',
      createdAt: '2025-01-21T09:45:00',
      createdBy: 'Mohamed Alami',
      status: 'completed',
      downloadCount: 8,
      machines: ['all'],
      dateRange: '01/01/2024 - 31/12/2024'
    },
    {
      id: 'RPT-2025-004',
      title: 'Rapport Hebdomadaire - Semaine 3',
      type: 'weekly',
      format: 'pdf',
      size: '1.2 MB',
      createdAt: '2025-01-20T16:20:00',
      createdBy: 'Ahmed Mansouri',
      status: 'generating',
      downloadCount: 0,
      machines: ['compressor-1', 'hvac-system'],
      dateRange: '13/01/2025 - 19/01/2025'
    },
    {
      id: 'RPT-2025-005',
      title: 'Données Brutes - Export CSV',
      type: 'daily',
      format: 'csv',
      size: '0.8 MB',
      createdAt: '2025-01-19T11:10:00',
      createdBy: 'Youssef Idrissi',
      status: 'completed',
      downloadCount: 3,
      machines: ['lighting', 'packaging'],
      dateRange: '19/01/2025 - 19/01/2025'
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous les Types' },
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'annual', label: 'Annuel' },
    { value: 'compliance', label: 'Conformité' },
    { value: 'cost-analysis', label: 'Analyse Coûts' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Plus Récent' },
    { value: 'date-asc', label: 'Plus Ancien' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
    { value: 'size-desc', label: 'Taille Décroissante' },
    { value: 'downloads-desc', label: 'Plus Téléchargé' }
  ];

  const getTypeLabel = (type) => {
    const labels = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      annual: 'Annuel',
      compliance: 'Conformité',
      'cost-analysis': 'Analyse Coûts'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: 'Terminé', className: 'bg-success/10 text-success border-success/20' },
      generating: { label: 'En cours', className: 'bg-warning/10 text-warning border-warning/20' },
      failed: { label: 'Échec', className: 'bg-error/10 text-error border-error/20' }
    };
    return badges[status] || badges.completed;
  };

  const getFormatIcon = (format) => {
    const icons = {
      pdf: 'FileText',
      excel: 'FileSpreadsheet',
      csv: 'Database'
    };
    return icons[format] || 'File';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'size-desc':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'downloads-desc':
        return b.downloadCount - a.downloadCount;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="History" size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Historique des Rapports</h2>
          <p className="text-sm text-muted-foreground">{sortedReports.length} rapports générés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="search"
          placeholder="Rechercher un rapport..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={typeOptions}
          value={filterType}
          onChange={setFilterType}
          placeholder="Filtrer par type"
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Trier par"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin">
        {sortedReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="FileX" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun rapport trouvé</p>
          </div>
        ) : (
          sortedReports.map((report) => {
            const statusBadge = getStatusBadge(report.status);
            
            return (
              <div key={report.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-card transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={getFormatIcon(report.format)} size={20} className="text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-foreground truncate">{report.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Icon name="Calendar" size={14} />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="User" size={14} />
                          <span>{report.createdBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Tag" size={14} />
                          <span>{getTypeLabel(report.type)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="HardDrive" size={14} />
                          <span>{report.size}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Période: {report.dateRange}</span>
                        {report.downloadCount > 0 && (
                          <span className="ml-4">• {report.downloadCount} téléchargements</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {report.status === 'completed' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewReport(report)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="Eye" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Simulate download
                            const link = document.createElement('a');
                            link.href = '#';
                            link.download = `${report.title}.${report.format}`;
                            link.click();
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="Download" size={16} />
                        </Button>
                      </>
                    )}
                    
                    {report.status === 'generating' && (
                      <div className="flex items-center space-x-2 text-warning">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        <span className="text-xs">Génération...</span>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteReport(report.id)}
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
            <div className="text-lg font-semibold text-foreground">{mockReports.length}</div>
            <div className="text-xs text-muted-foreground">Total Rapports</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {mockReports.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">Terminés</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {mockReports.filter(r => r.status === 'generating').length}
            </div>
            <div className="text-xs text-muted-foreground">En Cours</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {mockReports.reduce((sum, r) => sum + r.downloadCount, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Téléchargements</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;