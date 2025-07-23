import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertTabs = ({ activeTab, onTabChange, alertCounts }) => {
  const tabs = [
    {
      id: 'all',
      label: 'Toutes',
      icon: 'List',
      count: alertCounts.total,
      color: 'text-blue-600'
    },
    {
      id: 'critical',
      label: 'Critiques',
      icon: 'AlertTriangle',
      count: alertCounts.critical,
      color: 'text-red-600'
    },
    {
      id: 'warnings',
      label: 'Avertissements',
      icon: 'AlertCircle',
      count: alertCounts.warnings,
      color: 'text-orange-600'
    },
    {
      id: 'info',
      label: 'Informations',
      icon: 'Info',
      count: alertCounts.info,
      color: 'text-green-600'
    },
    {
      id: 'new',
      label: 'Nouvelles',
      icon: 'Plus',
      count: alertCounts.new,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="border-b border-border bg-card">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
              activeTab === tab.id
                ? `border-primary text-primary`
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Icon 
              name={tab.icon} 
              size={16} 
              className={activeTab === tab.id ? 'text-primary' : tab.color} 
            />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span 
                className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AlertTabs;