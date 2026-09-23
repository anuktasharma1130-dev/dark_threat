import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Network, 
  GitFork, 
  Cpu, 
  Clock, 
  Database, 
  FileText,
  Activity,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ monitoringActive, onToggleMonitoring, onOpenMonitoringDrawer }) {
  const navItems = [
    { to: "/", label: "Command Center", icon: ShieldAlert, badge: "LIVE" },
    { to: "/actors", label: "Threat Actors", icon: Users, badge: "12" },
    { to: "/infrastructure", label: "Infrastructure", icon: Network, badge: "DETECTION" },
    { to: "/graph", label: "Relationship Graph", icon: GitFork },
    { to: "/personas", label: "AI Persona Analysis", icon: Cpu, badge: "AI" },
    { to: "/timeline", label: "Timeline", icon: Clock },
    { to: "/sources", label: "Sources", icon: Database, badge: "24" },
    { to: "/reports", label: "Reports", icon: FileText }
  ];

  return (
    <aside className="w-64 bg-[#0B101D] border-r border-[#1E2B45] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-[#1E2B45] bg-[#0E1526]/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-white text-lg font-mono">DARKTRACE</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">DEMO</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Threat Intelligence & Attribution</p>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
            <span>SIH 2026 PS 26151</span>
            <span className="text-emerald-400 font-mono font-medium">SYNTHETIC FEED</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
                    : 'text-slate-300 hover:bg-[#131D33] hover:text-white border border-transparent'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    item.badge === 'LIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    item.badge === 'AI' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                    item.badge === 'DETECTION' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Autonomous Monitoring Toggle & Status */}
      <div className="p-4 border-t border-[#1E2B45] bg-[#0E1526]/70">
        <div className="bg-[#111A2E] rounded-xl p-3 border border-[#1E2B45] shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${monitoringActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-xs font-semibold text-slate-200">Autonomous Mode</span>
            </div>
            <button
              onClick={onToggleMonitoring}
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase transition-colors ${
                monitoringActive 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {monitoringActive ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 mb-2.5 font-mono">
            <div className="flex justify-between">
              <span>Sources:</span>
              <span className="text-slate-200 font-semibold">24 active</span>
            </div>
            <div className="flex justify-between">
              <span>Cycle Interval:</span>
              <span className="text-cyan-400">15 min</span>
            </div>
          </div>

          <button
            onClick={onOpenMonitoringDrawer}
            className="w-full py-1.5 px-2 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800/80 hover:to-blue-800/80 text-cyan-200 text-xs font-medium rounded-lg border border-cyan-500/40 flex items-center justify-center space-x-1.5 transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse-cyan" />
            <span>Open Monitor Feed</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-500 flex items-center justify-center space-x-1">
            <span>DARKTRACE SOC v1.0.4</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
