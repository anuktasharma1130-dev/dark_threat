import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Filter, 
  ExternalLink, 
  ShieldAlert, 
  KeyRound, 
  Wallet, 
  Cpu, 
  Globe, 
  Server,
  Layers
} from 'lucide-react';

export default function TimelineView() {
  const [events, setEvents] = useState([]);
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActors();
  }, []);

  useEffect(() => {
    fetchTimeline();
  }, [selectedActor, selectedType, selectedSource]);

  const fetchActors = async () => {
    try {
      const res = await fetch('/api/actors');
      if (res.ok) {
        const data = await res.json();
        setActors(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      let url = '/api/timeline?';
      if (selectedActor !== "ALL") url += `&actor_id=${selectedActor}`;
      if (selectedType !== "ALL") url += `&event_type=${selectedType}`;
      if (selectedSource !== "ALL") url += `&source=${encodeURIComponent(selectedSource)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Timeline fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'Identity':
        return { text: 'text-cyan-300', bg: 'bg-cyan-950 border-cyan-800', icon: KeyRound };
      case 'Marketplace':
      case 'Forum':
        return { text: 'text-emerald-300', bg: 'bg-emerald-950 border-emerald-800', icon: Globe };
      case 'Infrastructure':
        return { text: 'text-rose-300', bg: 'bg-rose-950 border-rose-800', icon: Server };
      case 'AI Attribution':
      case 'Investigation':
        return { text: 'text-purple-300', bg: 'bg-purple-950 border-purple-800', icon: Cpu };
      case 'Cryptocurrency':
        return { text: 'text-amber-300', bg: 'bg-amber-950 border-amber-800', icon: Wallet };
      default:
        return { text: 'text-slate-300', bg: 'bg-slate-800 border-slate-700', icon: Clock };
    }
  };

  const eventTypes = ["ALL", "Identity", "Marketplace", "Forum", "Infrastructure", "AI Attribution", "Cryptocurrency", "Investigation"];
  const sourcesList = ["ALL", "Market Alpha", "Market Beta", "Forum Nexus", "DeepSec Forum", "Tor Hidden Service Feed", "Blockchain Monitor Demo"];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">
              Attribution Timeline Investigation
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
              {events.length} Events
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological forensic progression of dark web actor footprints, identity key rotations, and persona migrations.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#111A2E] p-4 rounded-xl border border-[#1E2B45] flex flex-wrap gap-3 items-center">
        {/* Actor filter */}
        <div className="w-full md:w-56">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Filter Actor:</label>
          <select
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg px-3 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Threat Actors</option>
            {actors.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
            ))}
          </select>
        </div>

        {/* Event Type filter */}
        <div className="w-full md:w-44">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Event Category:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg px-3 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500"
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t === "ALL" ? "All Event Types" : t}</option>
            ))}
          </select>
        </div>

        {/* Source filter */}
        <div className="w-full md:w-52">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Origin Source:</label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg px-3 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500"
          >
            {sourcesList.map((s) => (
              <option key={s} value={s}>{s === "ALL" ? "All Sources" : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vertical Timeline View */}
      <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-slate-800">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            Querying chronological forensics database...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No events match the selected filters.
          </div>
        ) : (
          events.map((ev) => {
            const badge = getEventBadge(ev.event_type);
            const Icon = badge.icon;
            return (
              <div key={ev.id} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] md:-left-[39px] top-4 w-5 h-5 rounded-full bg-[#0B101D] border-2 border-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300"></div>
                </div>

                {/* Event Card */}
                <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] hover:border-cyan-500/40 p-4 shadow-lg transition-all group-hover:bg-[#131E35]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-[#1E2B45]">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                        {ev.event_date}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">{ev.title}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border flex items-center space-x-1 ${badge.bg} ${badge.text}`}>
                        <Icon className="w-3 h-3" />
                        <span>{ev.event_type}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        {ev.confidence}% Conf
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pt-3 text-xs space-y-2">
                    <p className="text-slate-300 leading-relaxed">
                      {ev.evidence}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                      <span>Source: <strong className="text-slate-200">{ev.source_name}</strong></span>
                      {ev.actor_name && (
                        <button
                          onClick={() => navigate(`/actors/${ev.actor_id}`)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
                        >
                          <span>Actor: {ev.actor_name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
