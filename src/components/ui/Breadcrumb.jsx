import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default breadcrumb generation based on current route
  const generateDefaultBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Accueil', path: '/dashboard-overview', icon: 'Home' }
    ];

    const routeMap = {
      'dashboard-overview': { label: 'Tableau de Bord', icon: 'BarChart3' },
      'machine-monitoring': { label: 'Surveillance des Machines', icon: 'Settings' },
      'energy-analytics': { label: 'Analyses Énergétiques', icon: 'Zap' },
      'recommendations-engine': { label: 'Moteur de Recommandations', icon: 'FileText' },
      'alerts-notifications': { label: 'Alertes et Notifications', icon: 'AlertTriangle' },
      'reports-export': { label: 'Rapports et Export', icon: 'Download' }
    };

    pathSegments.forEach((segment, index) => {
      const route = routeMap[segment];
      if (route) {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        breadcrumbs.push({
          label: route.label,
          path: path,
          icon: route.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateDefaultBreadcrumbs();
  const currentItem = breadcrumbItems[breadcrumbItems.length - 1];

  const handleNavigation = (path) => {
    if (path && path !== location.pathname) {
      navigate(path);
    }
  };

  const handleBack = () => {
    if (breadcrumbItems.length > 1) {
      const previousItem = breadcrumbItems[breadcrumbItems.length - 2];
      navigate(previousItem.path);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-border bg-background">
      <div className="flex items-center space-x-4">
        {/* Back Button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="md:hidden"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>

        {/* Breadcrumb Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const isClickable = item.path && !isLast;

              return (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <Icon 
                      name="ChevronRight" 
                      size={16} 
                      className="text-muted-foreground mx-2" 
                    />
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {item.icon && (
                      <Icon 
                        name={item.icon} 
                        size={16} 
                        className={isLast ? 'text-primary' : 'text-muted-foreground'} 
                      />
                    )}
                    
                    {isClickable ? (
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span 
                        className={`text-sm font-medium ${
                          isLast ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Current Page Title - Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          {currentItem?.icon && (
            <Icon name={currentItem.icon} size={20} className="text-primary" />
          )}
          <h1 className="text-lg font-semibold text-foreground">
            {currentItem?.label || 'Page'}
          </h1>
        </div>
      </div>

      {/* Page Actions */}
      <div className="flex items-center space-x-2">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.reload()}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="RotateCcw" size={18} />
        </Button>

        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            // Open help modal or navigate to help page
            console.log('Help clicked');
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="HelpCircle" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Breadcrumb;