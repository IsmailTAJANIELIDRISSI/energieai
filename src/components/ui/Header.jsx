import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [alertCount, setAlertCount] = useState(3);
  const dropdownRef = useRef(null);

  const navigationItems = [
    {
      path: '/dashboard-overview',
      label: 'Tableau de Bord',
      icon: 'BarChart3',
      tooltip: 'Vue d\'ensemble de l\'énergie'
    },
    {
      path: '/machine-monitoring',
      label: 'Machines',
      icon: 'Settings',
      tooltip: 'Surveillance des équipements'
    },
    {
      path: '/energy-analytics',
      label: 'Analyses',
      icon: 'Zap',
      tooltip: 'Analyses énergétiques'
    },
    {
      path: '/recommendations-engine',
      label: 'Recommandations',
      icon: 'FileText',
      tooltip: 'Optimisations suggérées'
    },
    {
      path: '/alerts-notifications',
      label: 'Alertes',
      icon: 'AlertTriangle',
      tooltip: 'Notifications critiques',
      badge: alertCount
    }
  ];

  const moreItems = [
    {
      path: '/reports-export',
      label: 'Rapports',
      icon: 'Download',
      tooltip: 'Exportation et rapports'
    }
  ];

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-energy-primary rounded-lg flex items-center justify-center">
        <Icon name="Zap" size={20} color="white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold text-foreground">EnergieAI</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-card">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 bg-error text-error-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-popover text-popover-foreground text-xs rounded-lg shadow-modal opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {item.tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
              </div>
            </div>
          ))}

          {/* More Menu */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground"
            >
              Plus
            </Button>
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {moreItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm text-left hover:bg-muted transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-popover-foreground'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Alert Notification Icon */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation('/alerts-notifications')}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {alertCount}
                </span>
              )}
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                AM
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground">Ahmed Mansouri</div>
                <div className="text-xs text-muted-foreground">Gestionnaire d'énergie</div>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-muted-foreground transition-transform duration-200 ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-modal animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      AM
                    </div>
                    <div>
                      <div className="text-sm font-medium text-popover-foreground">Ahmed Mansouri</div>
                      <div className="text-xs text-muted-foreground">ahmed.mansouri@energieai.ma</div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  {/* Language Selector */}
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Langue
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        language === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {language === lang.code && (
                        <Icon name="Check" size={16} className="ml-auto" />
                      )}
                    </button>
                  ))}

                  <div className="border-t border-border my-2"></div>

                  {/* User Actions */}
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavigation('/profile');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="User" size={16} />
                    <span>Profil</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavigation('/settings');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Paramètres</span>
                  </button>

                  <div className="border-t border-border my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors duration-200"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-up">
          <nav className="p-4 space-y-2">
            {[...navigationItems, ...moreItems].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-error text-error-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;