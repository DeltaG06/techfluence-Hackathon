import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RiskFeed from './components/RiskFeed';
import AuditReport from './components/AuditReport';
import SpendTrend from './components/SpendTrend';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('risk-feed');
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleViewReport = (anomaly) => {
    setSelectedAnomaly(anomaly);
    setCurrentView('audit-report-detail');
  };

  const handleBackToFeed = () => {
    setSelectedAnomaly(null);
    setCurrentView('risk-feed');
  };

  // Render the appropriate main content
  const renderMainContent = () => {
    switch (currentView) {
      case 'risk-feed':
        return <RiskFeed onViewReport={handleViewReport} />;
      case 'audit-reports':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-4 dark:text-white">Audit Reports</h1>
            <p className="dark:text-slate-400 text-slate-500">Select an anomaly from the Risk Feed to view its detailed report.</p>
          </div>
        );
      case 'audit-report-detail':
        return <AuditReport anomaly={selectedAnomaly} onBack={handleBackToFeed} />;
      case 'spend-trend':
        return <SpendTrend />;
      case 'settings':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-4 dark:text-white">Settings</h1>
            <p className="dark:text-slate-400 text-slate-500">System configuration and user preferences will appear here.</p>
          </div>
        );
      default:
        return <RiskFeed onViewReport={handleViewReport} />;
    }
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-slate-50 dark:bg-app-dark text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Sidebar 
        currentView={currentView === 'audit-report-detail' ? 'audit-reports' : currentView} 
        setCurrentView={(view) => {
          if (view !== 'audit-reports') {
            setSelectedAnomaly(null);
          }
          setCurrentView(view);
        }} 
      />
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Right Controls */}
        <div className="absolute top-6 right-8 z-50 flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white dark:bg-app-panel border border-slate-200 dark:border-app-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-none"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
        
        <div className="p-8 pt-20">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
