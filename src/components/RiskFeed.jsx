import React from 'react';
import { anomalies } from '../mockData';
import { AlertCircle, ShieldAlert, Activity, CheckCircle2, MoreHorizontal } from 'lucide-react';

const RiskBadge = ({ level }) => {
  const styles = {
    HIGH: 'bg-red-500/10 text-red-500 border-red-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    LOW: 'bg-slate-500/10 text-slate-500 border-slate-500/30 dark:text-slate-400 dark:border-slate-600'
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[level]}`}>
      {level}
    </span>
  );
};

export default function RiskFeed({ onViewReport }) {
  const metrics = [
    { label: 'Flagged Today', value: '24', icon: AlertCircle, color: 'text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]', bg: 'bg-neon-green/10' },
    { label: 'High Risk', value: '5', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Avg Anomaly Score', value: '68%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Auto-Dismissed', value: '142', icon: CheckCircle2, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight dark:text-white text-slate-900">Risk Feed</h1>
        <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">Real-time detection of anomalous financial activities.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className={`glass-panel rounded-2xl p-5 pop-out animate-slide-up delay-${(i + 1) * 100}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium dark:text-slate-400 text-slate-500">{metric.label}</p>
                  <p className="text-3xl font-bold dark:text-white text-slate-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${metric.bg}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Anomaly List */}
      <div className="space-y-4">
        {anomalies.map((anomaly, index) => (
          <div 
            key={anomaly.id} 
            className={`glass-panel rounded-2xl p-6 pop-out cursor-pointer neon-border animate-slide-up delay-${Math.min((index + 1) * 100, 500)}`}
            onClick={() => onViewReport(anomaly)}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Left Column */}
              <div className="md:w-1/4 md:border-r dark:border-slate-800 border-slate-200 md:pr-6 flex flex-col">
                <div className="mb-3">
                  <RiskBadge level={anomaly.riskLevel} />
                </div>
                <div className="text-3xl font-bold dark:text-white text-slate-900 tracking-tight mt-auto">{anomaly.amount}</div>
                <div className="text-sm dark:text-slate-400 text-slate-500 mt-1 truncate">{anomaly.vendor}</div>
              </div>
              
              {/* Middle Column */}
              <div className="md:w-1/2 flex flex-col justify-center">
                <p className="dark:text-slate-300 text-slate-700 font-medium leading-relaxed">
                  {anomaly.explanation}
                </p>
              </div>
              
              {/* Right Column (Actions) */}
              <div className="md:w-1/4 flex flex-col items-end justify-center">
                <div className="flex flex-wrap gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                  <button className="px-4 py-2 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                    Escalate
                  </button>
                  <button className="px-4 py-2 text-xs font-bold text-neon-green bg-neon-green/10 hover:bg-neon-green/20 rounded-lg transition-colors border border-neon-green/20">
                    Review
                  </button>
                  <button className="px-4 py-2 text-xs font-bold dark:text-slate-400 text-slate-600 bg-slate-500/10 hover:bg-slate-500/20 rounded-lg transition-colors border border-slate-500/20">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bottom Row */}
            <div className="mt-6 pt-4 border-t dark:border-slate-800 border-slate-200 flex flex-col md:flex-row md:items-center justify-between text-xs dark:text-slate-400 text-slate-500 gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{anomaly.department}</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>{anomaly.employee}</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{anomaly.timestamp}</span>
              </div>
              <div className="flex items-center space-x-3 w-full md:w-64">
                <span className="font-medium whitespace-nowrap">Score: <span className="dark:text-white text-slate-900">{anomaly.anomalyScore}</span></span>
                <div className="flex-1 h-2 dark:bg-slate-800 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full ${
                      anomaly.riskLevel === 'HIGH' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
                      anomaly.riskLevel === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-slate-400'
                    }`} 
                    style={{ width: `${anomaly.anomalyScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
