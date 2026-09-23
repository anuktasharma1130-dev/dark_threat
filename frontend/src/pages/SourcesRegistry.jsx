import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  Globe, 
  AlertCircle, 
  Search, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';

export default function SourcesRegistry() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSources();
  }, [typeFilter]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      let url = '/api/sources';
      if (typeFilter !== "ALL") url += `?source_type=${typeFilter}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSources = sources.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.source_type.toLowerCase().includes(search.toLowerCase())
  );

  const getReliabilityBadge = (rel) => {
    switch (rel) {
      case 'HIGH':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'DEGRADED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const types = ["ALL", "Marketplace", "Forum", "Deep Web", "Hidden Service", "Escrow", "Research"];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">
              Source Intelligence Registry
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
              {sources.length} Feeds Monitored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Provenance catalog of simulated dark web marketplaces, forums, Tor hidden-service scrapers, and research feeds.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111A2E] p-4 rounded-xl border border-[#1E2B45] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search source by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg pl-10 pr-4 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
                  : 'bg-[#0B101D] text-slate-400 hover:text-slate-200 border border-[#1E2B45]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-[#111A2E] border border-[#1E2B45] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B101D] text-slate-400 uppercase text-[10px] font-mono border-b border-[#1E2B45]">
              <tr>
                <th className="py-3.5 px-4">Source Name</th>
                <th className="py-3.5 px-4">Source Type</th>
                <th className="py-3.5 px-4">Reliability Rating</th>
                <th className="py-3.5 px-4">Last Automated Scan</th>
                <th className="py-3.5 px-4">Next Scheduled Scan</th>
                <th className="py-3.5 px-4 text-right">Harvested Records</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2B45]/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400 font-mono">
                    Loading source registry telemetries...
                  </td>
                </tr>
              ) : filteredSources.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No sources found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredSources.map((s) => (
                  <tr key={s.id} className="hover:bg-[#152038] transition-colors">
                    {/* Source Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>{s.name}</span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                        {s.source_type}
                      </span>
                    </td>

                    {/* Reliability */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${getReliabilityBadge(s.reliability)}`}>
                        {s.reliability} RELIABILITY
                      </span>
                    </td>

                    {/* Last Scan */}
                    <td className="py-3.5 px-4 font-mono text-cyan-300 text-[11px]">
                      {s.last_scan}
                    </td>

                    {/* Next Scan */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {s.next_scan}
                    </td>

                    {/* Records Count */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                      {s.records_count?.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
