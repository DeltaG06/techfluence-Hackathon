import React, { useState } from 'react';
import { Activity, FileText, Settings, ShieldAlert, LayoutDashboard, TrendingUp, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Sub-menus logic can be added here if needed, for now we show hovering tooltips/menus
  const navItems = [
    { id: 'risk-feed', label: 'Risk Feed', icon: LayoutDashboard, subItems: ['Live Feed', 'Archived'] },
    { id: 'audit-reports', label: 'Audit Reports', icon: FileText, subItems: ['Recent', 'Drafts', 'Templates'] },
    { id: 'spend-trend', label: 'Spend Trend', icon: TrendingUp, subItems: ['Overview', 'By Category'] },
    { id: 'settings', label: 'Settings', icon: Settings, subItems: ['Profile', 'Preferences', 'Security'] },
  ];

  return (
    <div className={`relative bg-app-dark border-r border-app-border h-screen text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 z-50 ${isExpanded ? 'w-64' : 'w-20'}`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-app-panel border border-app-border rounded-full p-1 text-slate-400 hover:text-neon-green hover:border-neon-green transition-colors z-50 shadow-md"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className={`p-6 flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} text-white`}>
        <ShieldAlert className="text-neon-green w-8 h-8 flex-shrink-0 drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]" />
        {isExpanded && <span className="text-xl font-semibold tracking-tight animate-fade-in">AuditAI</span>}
      </div>
      
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center ${isExpanded ? 'px-3' : 'justify-center'} py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/5' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`flex-shrink-0 h-5 w-5 transition-colors duration-300 ${isExpanded ? 'mr-3' : ''} ${isActive ? 'text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {isExpanded && <span className="animate-fade-in truncate">{item.label}</span>}
                </button>

                {/* Floating Sub-menu (Hover) */}
                <div className={`absolute left-full top-0 ml-2 w-48 bg-app-panel border border-app-border rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 z-50`}>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 pt-1">{item.label}</div>
                  {item.subItems.map(subItem => (
                    <button 
                      key={subItem}
                      onClick={() => setCurrentView(item.id)}
                      className="w-full text-left px-2 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
      
      <div className={`p-4 border-t border-app-border ${isExpanded ? '' : 'flex justify-center'}`}>
        <div className="flex items-center group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-medium text-white group-hover:border-neon-green transition-colors flex-shrink-0">
            <User className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          {isExpanded && (
            <div className="ml-3 animate-fade-in overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Janardan</p>
              <p className="text-xs font-medium text-neon-green truncate">Risk Analyst</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
