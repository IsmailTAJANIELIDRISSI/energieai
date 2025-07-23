import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onAcknowledge, onAssign, onAddNote, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        icon: 'AlertTriangle'
      },
      high: {
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600',
        icon: 'AlertCircle'
      },
      medium: {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600',
        icon: 'AlertTriangle'
      },
      low: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600',
        icon: 'Info'
      },
      info: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
        icon: 'CheckCircle'
      }
    };
    return configs[severity] || configs.info;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nouveau' },
      acknowledged: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Reconnu' },
      in_progress: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En cours' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Résolu' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Fermé' }
    };
    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const severityConfig = getSeverityConfig(alert.severity);

  return (
    <div 
      className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${severityConfig.bgColor} ${severityConfig.borderColor} ${
        alert.status === 'new' ? 'ring-2 ring-primary ring-opacity-20' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-full ${severityConfig.bgColor} border ${severityConfig.borderColor}`}>
            <Icon 
              name={severityConfig.icon} 
              size={16} 
              className={severityConfig.iconColor} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-medium text-sm ${severityConfig.textColor}`}>
                {alert.title}
              </h3>
              {getStatusBadge(alert.status)}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {alert.description}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>{alert.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{formatTimestamp(alert.timestamp)}</span>
              </div>
              {alert.assignedTo && (
                <div className="flex items-center space-x-1">
                  <Icon name="User" size={12} />
                  <span>{alert.assignedTo}</span>
                </div>
              )}
            </div>
            
            {isExpanded && alert.recommendations && (
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-md">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Actions recommandées:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {alert.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Icon name="ArrowRight" size={10} className="mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {alert.severity === 'critical' && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={14} 
            />
          </Button>
        </div>
      </div>
      
      {(showActions || isExpanded) && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {alert.status === 'new' && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onAcknowledge(alert.id)}
                iconName="Check"
                iconSize={12}
              >
                Reconnaître
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onAssign(alert.id)}
              iconName="UserPlus"
              iconSize={12}
            >
              Assigner
            </Button>
            
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onAddNote(alert.id)}
              iconName="MessageSquare"
              iconSize={12}
            >
              Note
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onViewDetails(alert.id)}
            iconName="ExternalLink"
            iconSize={12}
          >
            Détails
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;