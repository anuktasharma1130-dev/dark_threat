import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AutonomousDrawer from './components/AutonomousDrawer';
import CommandCenter from './pages/CommandCenter';
import ThreatActors from './pages/ThreatActors';
import ActorProfile from './pages/ActorProfile';
import InfrastructureAnalyzer from './pages/InfrastructureAnalyzer';
import RelationshipGraphView from './pages/RelationshipGraphView';
import AIPersonaAnalysis from './pages/AIPersonaAnalysis';
import TimelineView from './pages/TimelineView';
import SourcesRegistry from './pages/SourcesRegistry';
import ReportsView from './pages/ReportsView';

export default function App() {
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [isMonitoringDrawerOpen, setIsMonitoringDrawerOpen] = useState(false);
  const [monitoringStats, setMonitoringStats] = useState({
    sources_monitored: 24,
    collection_interval_mins: 15,
    last_run: "18:42",
    next_run: "18:57",
    new_footprints: 37,
    new_actors: 2,
    new_relationships: 12,
    new_persona_candidates: 4,
    infrastructure_changes: 7
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Poll or fetch initial stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json.monitoring) {
          setMonitoringStats(json.monitoring);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMonitoring = () => {
    setMonitoringActive(prev => !prev);
    showToast(monitoringActive ? "Autonomous harvesting paused" : "Autonomous harvesting activated");
  };

  const handleRunCollectionCycle = async () => {
    try {
      const res = await fetch('/api/collection/run', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setMonitoringStats(json.stats);
        showToast(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#080C14] text-slate-200 overflow-hidden font-sans">
        {/* Left Navigation Sidebar */}
        <Sidebar 
          monitoringActive={monitoringActive}
          onToggleMonitoring={handleToggleMonitoring}
          onOpenMonitoringDrawer={() => setIsMonitoringDrawerOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Bar */}
          <Header 
            monitoringActive={monitoringActive}
            onOpenMonitoringDrawer={() => setIsMonitoringDrawerOpen(true)}
          />

          {/* View Container */}
          <main className="flex-1 overflow-y-auto bg-[#080C14]">
            <Routes>
              <Route 
                path="/" 
                element={
                  <CommandCenter 
                    onOpenMonitoringDrawer={() => setIsMonitoringDrawerOpen(true)} 
                    onRunCycle={handleRunCollectionCycle} 
                  />
                } 
              />
              <Route path="/actors" element={<ThreatActors />} />
              <Route 
                path="/actors/:id" 
                element={
                  <ActorProfile 
                    onOpenReportModal={(actorId) => {
                      window.location.href = `/reports?actor=${actorId}`;
                    }} 
                  />
                } 
              />
              <Route path="/infrastructure" element={<InfrastructureAnalyzer />} />
              <Route path="/graph" element={<RelationshipGraphView />} />
              <Route path="/personas" element={<AIPersonaAnalysis />} />
              <Route path="/timeline" element={<TimelineView />} />
              <Route path="/sources" element={<SourcesRegistry />} />
              <Route path="/reports" element={<ReportsView />} />
            </Routes>
          </main>
        </div>

        {/* Autonomous Monitoring Slideout Drawer */}
        <AutonomousDrawer 
          isOpen={isMonitoringDrawerOpen}
          onClose={() => setIsMonitoringDrawerOpen(false)}
          monitoringActive={monitoringActive}
          onToggleMonitoring={handleToggleMonitoring}
          stats={monitoringStats}
          onRunCycle={handleRunCollectionCycle}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#111A2E] border border-cyan-500/60 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
