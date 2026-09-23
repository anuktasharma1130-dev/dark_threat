import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  User, 
  ExternalLink, 
  Fingerprint, 
  Wallet, 
  KeyRound, 
  Globe, 
  Layers,
  X,
  AlertCircle
} from 'lucide-react';

export default function Header({ monitoringActive, onOpenMonitoringDrawer }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Notifications demo state
  const notifications = [
    { id: 1, title: "Candidate persona link detected", time: "10m ago", detail: "XShadow_New linked to ShadowX (89% confidence)", unread: true },
    { id: 2, title: "Tor server-status exposure flagged", time: "35m ago", detail: "hs-demo-7f3a.onion correlated to demo-infrastructure.example", unread: true },
    { id: 3, title: "Autonomous collection cycle complete", time: "1h ago", detail: "14 new footprints ingested across 24 monitored feeds", unread: false }
  ];

  // Debounced global search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 1) {
      setSearchResults(null);
      setDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setDropdownOpen(true);
        }
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectActor = (actorId) => {
    setDropdownOpen(false);
    setSearchQuery("");
    navigate(`/actors/${actorId}`);
  };

  return (
    <header className="h-16 bg-[#0B101D] border-b border-[#1E2B45] px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Global Search Bar */}
      <div className="relative w-96 md:w-[480px]" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search actor, handle, PGP, wallet, hidden service, persona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults && searchResults.total_results > 0) setDropdownOpen(true); }}
            className="w-full bg-[#111A2E] text-slate-200 text-xs rounded-lg pl-10 pr-9 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setDropdownOpen(false); }}
              className="absolute right-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categorized Live Search Results Dropdown */}
        {dropdownOpen && searchResults && (
          <div className="absolute top-12 left-0 right-0 bg-[#0E1628] border border-[#1E2B45] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[480px] overflow-y-auto">
            <div className="p-2.5 border-b border-[#1E2B45] bg-[#111A2E] flex justify-between items-center text-[11px] text-slate-400">
              <span>Found <strong className="text-cyan-400">{searchResults.total_results}</strong> matches for "{searchQuery}"</span>
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded">Categorized</span>
            </div>

            {searchResults.total_results === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                No matching threat entities found. Try searching for "ShadowX", "0x8AF3", "hs-demo", or "BTC".
              </div>
            ) : (
              <div className="p-2 space-y-3">
                {/* Actors */}
                {searchResults.results.actors?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center space-x-1.5">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>Threat Actors</span>
                    </div>
                    {searchResults.results.actors.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectActor(a.id)}
                        className="px-3 py-2 rounded-lg hover:bg-[#16233B] cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-100">{a.name}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{a.category}</span>
                        </div>
                        <span className="text-cyan-400 font-mono text-[11px]">{a.confidence}% conf</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Handles */}
                {searchResults.results.handles?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center space-x-1.5">
                      <Fingerprint className="w-3 h-3 text-emerald-400" />
                      <span>Handles & Aliases</span>
                    </div>
                    {searchResults.results.handles.map((h, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectActor(h.actor_id)}
                        className="px-3 py-1.5 rounded-lg hover:bg-[#16233B] cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="text-emerald-300 font-mono font-medium">{h.handle}</span>
                        <span className="text-slate-400 text-[11px]">Actor: {h.actor_name} ({h.platform})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Wallets */}
                {searchResults.results.wallets?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center space-x-1.5">
                      <Wallet className="w-3 h-3 text-amber-400" />
                      <span>Wallets</span>
                    </div>
                    {searchResults.results.wallets.map((w, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectActor(w.actor_id)}
                        className="px-3 py-1.5 rounded-lg hover:bg-[#16233B] cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="truncate max-w-[280px]">
                          <span className="text-amber-300 font-mono text-[11px]">{w.address}</span>
                          <span className="block text-[10px] text-slate-400">{w.cluster_label} ({w.currency})</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{w.actor_name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Infrastructure */}
                {searchResults.results.infrastructure?.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center space-x-1.5">
                      <Globe className="w-3 h-3 text-rose-400" />
                      <span>Hidden Service Infrastructure</span>
                    </div>
                    {searchResults.results.infrastructure.map((inf, i) => (
                      <div
                        key={i}
                        onClick={() => { setDropdownOpen(false); navigate('/infrastructure'); }}
                        className="px-3 py-1.5 rounded-lg hover:bg-[#16233B] cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="text-rose-300 font-mono text-[11px]">{inf.onion_address}</span>
                          <span className="block text-[10px] text-slate-400">→ {inf.candidate_clearnet_domain}</span>
                        </div>
                        <span className="text-cyan-400 font-mono text-[10px]">{inf.correlation_score}% match</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Autonomous status badge, Notifications, User profile */}
      <div className="flex items-center space-x-4">
        {/* Monitoring status button */}
        <button
          onClick={onOpenMonitoringDrawer}
          className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#1E2B45] hover:border-cyan-500/50 transition-colors text-xs"
        >
          <span className={`w-2 h-2 rounded-full ${monitoringActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
          <span className="text-slate-300 font-mono text-[11px]">
            {monitoringActive ? 'MONITORING: ACTIVE' : 'MONITORING: IDLE'}
          </span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-[#111A2E] border border-[#1E2B45] text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0B101D]"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-80 bg-[#0E1628] border border-[#1E2B45] rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2B45] mb-2">
                <span className="text-xs font-bold text-slate-200">Alerts & Correlated Feeds</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">3 NEW</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-[#111A2E] border border-[#1E2B45]/60 text-xs">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-semibold text-slate-200 text-[11px]">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{n.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-[#1E2B45]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            SA
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-tight">Special Agent SOC</span>
            <span className="text-[10px] text-slate-400 font-mono">ID: AGT-992-SIH</span>
          </div>
        </div>
      </div>
    </header>
  );
}
