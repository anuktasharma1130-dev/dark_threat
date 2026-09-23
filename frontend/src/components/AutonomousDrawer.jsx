import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  GitBranch, 
  Users, 
  Globe, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';

export default function AutonomousDrawer({ 
  isOpen, 
  onClose, 
  monitoringActive, 
  onToggleMonitoring, 
  stats, 
  onRunCycle 
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleSuccessMessage, setCycleSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleTriggerCycle = async () => {
    setIsRunning(true);
    setCycleSuccessMessage(null);
    try {
      await onRunCycle();
      setCycleSuccessMessage("Collection cycle executed successfully. 14 new synthetic footprints parsed and indexed.");
      setTimeout(() => setCycleSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-[#0B101D] border-l border-[#1E2B45] h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div>
          <div className="p-5 border-b border-[#1E2B45] flex items-center justify-between bg-[#0E1628]">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Radio className={`w-5 h-5 ${monitoringActive ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Autonomous Monitoring</h2>
                <p className="text-[11px] text-slate-400">Continuous Footprint Harvesting Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Synthetic Disclaimer Banner */}
          <div className="mx-5 mt-4 p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-xs text-cyan-300 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-semibold block text-cyan-200">Demonstration Engine Active</span>
              <p className="text-[11px] text-cyan-300/80 leading-relaxed">
                Simulates asynchronous crawling of 24 dark web marketplaces, forums, and simulated Tor hidden services. No real network probes are generated.
              </p>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="p-5 space-y-4">
            <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Autonomous Harvester Status</span>
                <span className="text-[11px] text-slate-400">Periodic cycle execution scheduler</span>
              </div>
              <button
                onClick={onToggleMonitoring}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all shadow-md ${
                  monitoringActive
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {monitoringActive ? 'MODE: ACTIVE' : 'MODE: PAUSED'}
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 bg-[#111A2E] rounded-xl border border-[#1E2B45]">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sources Monitored</span>
                </div>
                <div className="text-lg font-bold text-slate-100">{stats?.sources_monitored || 24}</div>
                <span className="text-[10px] text-emerald-400">100% simulated uptime</span>
              </div>

              <div className="p-3 bg-[#111A2E] rounded-xl border border-[#1E2B45]">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Collection Interval</span>
                </div>
                <div className="text-lg font-bold text-slate-100">{stats?.collection_interval_mins || 15} min</div>
                <span className="text-[10px] text-slate-400">Next run in ~8 min</span>
              </div>

              <div className="p-3 bg-[#111A2E] rounded-xl border border-[#1E2B45]">
                <span className="text-[11px] text-slate-400 block mb-1">Last Run</span>
                <span className="text-base font-bold text-cyan-300">{stats?.last_run || "18:42"}</span>
              </div>

              <div className="p-3 bg-[#111A2E] rounded-xl border border-[#1E2B45]">
                <span className="text-[11px] text-slate-400 block mb-1">Next Run</span>
                <span className="text-base font-bold text-slate-200">{stats?.next_run || "18:57"}</span>
              </div>
            </div>

            {/* Incremental Ingestion Telemetry */}
            <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45]">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Session Footprint Yield</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>New Raw Footprints</span>
                  </span>
                  <span className="font-mono font-bold text-cyan-300">+{stats?.new_footprints || 37}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>New Threat Actors Flagged</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">+{stats?.new_actors || 2}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>New Graph Relationships</span>
                  </span>
                  <span className="font-mono font-bold text-purple-300">+{stats?.new_relationships || 12}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Persona Rebranding Candidates</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-300">+{stats?.new_persona_candidates || 4}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Infrastructure Changes Detected</span>
                  </span>
                  <span className="font-mono font-bold text-rose-300">+{stats?.infrastructure_changes || 7}</span>
                </div>
              </div>
            </div>

            {/* Cycle success notification */}
            {cycleSuccessMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-200 flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{cycleSuccessMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="p-5 border-t border-[#1E2B45] bg-[#0E1628]">
          <button
            onClick={handleTriggerCycle}
            disabled={isRunning}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isRunning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Collection Cycle...' : 'Run Collection Cycle'}</span>
          </button>
          <span className="block text-center text-[10px] text-slate-500 mt-2">
            Simulates instantaneous harvest cycle across all 24 feeds
          </span>
        </div>
      </div>
    </div>
  );
}
