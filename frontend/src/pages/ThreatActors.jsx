import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  KeyRound, 
  Wallet, 
  Cpu, 
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function ThreatActors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minConfidence, setMinConfidence] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActors();
  }, [categoryFilter, statusFilter, minConfidence]);

  const fetchActors = async () => {
    setLoading(true);
    try {
      let url = `/api/actors?min_confidence=${minConfidence}`;
      if (categoryFilter !== "All") url += `&category=${encodeURIComponent(categoryFilter)}`;
      if (statusFilter !== "All") url += `&status=${encodeURIComponent(statusFilter)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setActors(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchActors();
  };

  const handleExportCSV = () => {
    window.location.href = "/api/export/actors/csv";
  };

  const handleExportJSON = () => {
    window.location.href = "/api/export/actors/json";
  };

  const categories = [
    "All", "Data Theft", "Credential Trading", "Malware", "Hacking Services", "Fraud", "Financial Crime"
  ];

  const statuses = ["All", "Active", "Under Review", "Dormant"];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">Threat Actor Registry</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              {actors.length} Profiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Searchable index of synthetic threat actor dossiers, cross-platform aliases, and attribution confidence metrics.
          </p>
        </div>

        {/* Working Export Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#111A2E] hover:bg-[#16233B] text-slate-200 border border-[#1E2B45] hover:border-slate-500 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
            title="Download CSV Dossier"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-[#111A2E] hover:bg-[#16233B] text-slate-200 border border-[#1E2B45] hover:border-slate-500 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
            title="Download Structured JSON Intelligence"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111A2E] p-4 rounded-xl border border-[#1E2B45] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by actor name, handle, or campaign summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg pl-10 pr-4 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg px-3 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0B101D] text-slate-200 text-xs rounded-lg px-3 py-2 border border-[#1E2B45] focus:outline-none focus:border-cyan-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>Status: {s}</option>
              ))}
            </select>
          </div>

          {/* Min Confidence Slider */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#0B101D] rounded-lg border border-[#1E2B45]">
            <span className="text-[11px] text-slate-400 whitespace-nowrap">Min Conf:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-20 accent-cyan-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-cyan-400 w-8">{minConfidence}%</span>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>
        </form>
      </div>

      {/* Actors Table */}
      <div className="bg-[#111A2E] border border-[#1E2B45] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B101D] text-slate-400 uppercase text-[10px] font-mono border-b border-[#1E2B45]">
              <tr>
                <th className="py-3.5 px-4">Threat Actor</th>
                <th className="py-3.5 px-4">Primary Handle</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Personas</th>
                <th className="py-3.5 px-4 text-center">PGP Keys</th>
                <th className="py-3.5 px-4 text-center">Wallets</th>
                <th className="py-3.5 px-4">Sources Observed</th>
                <th className="py-3.5 px-4">Attribution Confidence</th>
                <th className="py-3.5 px-4">Last Seen</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2B45]/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="11" className="py-12 text-center text-slate-400 font-mono">
                    Filtering threat actor intelligence records...
                  </td>
                </tr>
              ) : actors.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-12 text-center text-slate-400">
                    No threat actors matching current filter criteria.
                  </td>
                </tr>
              ) : (
                actors.map((actor) => (
                  <tr 
                    key={actor.id} 
                    onClick={() => navigate(`/actors/${actor.id}`)}
                    className="hover:bg-[#152038] cursor-pointer transition-colors group"
                  >
                    {/* Actor Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-100 group-hover:text-cyan-300 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{actor.name}</span>
                    </td>

                    {/* Primary Handle */}
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                      @{actor.primary_handle}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                        {actor.category}
                      </span>
                    </td>

                    {/* Linked Personas */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300 font-mono font-semibold text-[11px]">
                        <Cpu className="w-3 h-3 mr-1 text-purple-400" />
                        {actor.persona_count}
                      </span>
                    </td>

                    {/* PGP Keys */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono font-semibold text-[11px]">
                        <KeyRound className="w-3 h-3 mr-1 text-cyan-400" />
                        {actor.pgp_count}
                      </span>
                    </td>

                    {/* Wallets */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-mono font-semibold text-[11px]">
                        <Wallet className="w-3 h-3 mr-1 text-amber-400" />
                        {actor.wallet_count}
                      </span>
                    </td>

                    {/* Sources Observed */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {actor.sources?.slice(0, 2).map((s, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {s}
                          </span>
                        ))}
                        {actor.sources?.length > 2 && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                            +{actor.sources.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              actor.confidence >= 80 ? 'bg-emerald-400' :
                              actor.confidence >= 70 ? 'bg-cyan-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${actor.confidence}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {actor.confidence}%
                        </span>
                      </div>
                    </td>

                    {/* Last Seen */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {actor.last_seen}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                        actor.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        actor.status === 'Under Review' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {actor.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/actors/${actor.id}`);
                        }}
                        className="px-2.5 py-1 rounded bg-[#16233B] hover:bg-cyan-950 text-cyan-300 hover:border-cyan-700 border border-slate-700 text-[11px] font-semibold transition-all inline-flex items-center space-x-1"
                      >
                        <span>Investigate</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>
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
