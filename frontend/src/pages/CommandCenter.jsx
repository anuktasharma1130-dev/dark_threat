import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  GitFork, 
  Network, 
  Award, 
  Database, 
  Radio, 
  RefreshCw, 
  TrendingUp, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Cpu,
  KeyRound,
  Wallet,
  Server,
  Globe
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

export default function CommandCenter({ onOpenMonitoringDrawer, onRunCycle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cycleRunning, setCycleRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCycle = async () => {
    setCycleRunning(true);
    try {
      await onRunCycle();
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setCycleRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-cyan-400 font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Synchronizing SOC Threat Telemetry...</span>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Threat Actors", value: data?.kpis?.threat_actors || 127, sub: "Indexed Entities", icon: Users, color: "from-cyan-500 to-blue-500", to: "/actors" },
    { label: "Active Investigations", value: data?.kpis?.active_investigations || 18, sub: "High Priority", icon: ShieldAlert, color: "from-amber-500 to-orange-500", to: "/actors" },
    { label: "Linked Personas", value: data?.kpis?.linked_personas || 43, sub: "Stylometric Matches", icon: Cpu, color: "from-purple-500 to-pink-500", to: "/personas" },
    { label: "Infrastructure Indicators", value: data?.kpis?.infrastructure_indicators || 286, sub: "Hidden Service Nodes", icon: Network, color: "from-rose-500 to-red-600", to: "/infrastructure" },
    { label: "High Confidence Attributions", value: data?.kpis?.high_confidence_attributions || 21, sub: ">80% Multi-Factor Score", icon: Award, color: "from-emerald-500 to-teal-500", to: "/actors" },
    { label: "Sources Monitored", value: data?.kpis?.sources_monitored || 24, sub: "Tor & Dark Web Feeds", icon: Database, color: "from-blue-500 to-indigo-500", to: "/sources" }
  ];

  const categoryColors = {
    "Data Theft": "#06B6D4",
    "Credential Trading": "#3B82F6",
    "Malware": "#8B5CF6",
    "Hacking Services": "#EC4899",
    "Fraud": "#F59E0B",
    "Financial Crime": "#10B981"
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">Threat Operations Command Center</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              SIH-PS-26151
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time darknet footprint synthesis, Tor infrastructure de-anonymization, and AI stylometric actor mapping.
          </p>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/graph')}
            className="px-3.5 py-2 rounded-lg bg-[#111A2E] hover:bg-[#16233B] text-slate-200 border border-[#1E2B45] text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <GitFork className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Network Graph</span>
          </button>
          <button
            onClick={handleRunCycle}
            disabled={cycleRunning}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-cyan-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cycleRunning ? 'animate-spin' : ''}`} />
            <span>{cycleRunning ? 'Ingesting Cycle...' : 'Run Collection Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              onClick={() => navigate(kpi.to)}
              className="bg-[#111A2E] border border-[#1E2B45] hover:border-cyan-500/40 p-4 rounded-xl shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-slate-100 group-hover:text-cyan-300 transition-colors">
                {kpi.value}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                <span>{kpi.sub}</span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Charts: Activity Trend + Threat Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Activity Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-[#111A2E] border border-[#1E2B45] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2B45] mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Threat Activity Timeline (Past 30 Days)</span>
              </h2>
              <p className="text-[11px] text-slate-400">Simulated footprint collection & correlation volume</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center space-x-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block"></span>
                <span>Footprints</span>
              </span>
              <span className="flex items-center space-x-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block"></span>
                <span>Correlations</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.activity_timeline || []}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2B45" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B101D', borderColor: '#1E2B45', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="footprints" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#cyanArea)" />
                <Area type="monotone" dataKey="correlations" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#purpleArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Categories Breakdown (1 col) */}
        <div className="bg-[#111A2E] border border-[#1E2B45] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2B45] mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Threat Categories</h2>
                <p className="text-[11px] text-slate-400">Distribution across active campaigns</p>
              </div>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">6 Domains</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.categories || []} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={10} hide />
                  <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={110} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B101D', borderColor: '#1E2B45', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {(data?.categories || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#3B82F6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E2B45] text-[11px] text-slate-400 flex justify-between">
            <span>Primary Focus:</span>
            <span className="font-semibold text-cyan-300">Data Theft & Exploitation</span>
          </div>
        </div>
      </div>

      {/* C. Actor Network Overview (Interactive Graph Preview) */}
      <div className="bg-[#111A2E] border border-[#1E2B45] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2B45]">
          <div>
            <div className="flex items-center space-x-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Actor Network Overview (Correlation Preview)</h2>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                ACTIVE CLUSTER: SHADOWX
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Multi-entity topological linkage showing cross-platform aliases, cryptographic wallets, and infrastructure correlation
            </p>
          </div>

          <button
            onClick={() => navigate('/graph')}
            className="px-3 py-1.5 rounded-lg bg-[#16233B] hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto shadow-sm"
          >
            <span>Expand Full Relationship Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Mini-Graph SVG & Entities */}
        <div className="bg-[#080C14] rounded-xl border border-[#1E2B45] p-5 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center relative z-10 text-xs">
            {/* Persona A / Alternate */}
            <div 
              onClick={() => navigate('/personas')}
              className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/80 hover:border-purple-500 cursor-pointer transition-all hover:scale-105 shadow-md text-center"
            >
              <Cpu className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">Persona</span>
              <span className="font-mono text-xs font-bold text-purple-200">XShadow_New</span>
              <span className="text-[10px] text-slate-400 block mt-1">89% Stylometry</span>
            </div>

            {/* Edge 1 */}
            <div className="hidden md:flex flex-col items-center justify-center text-slate-500 text-[10px] font-mono">
              <span className="text-purple-400">similar_to</span>
              <span className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 my-1"></span>
              <span>89% conf</span>
            </div>

            {/* Central Actor */}
            <div 
              onClick={() => navigate('/actors/actor-001')}
              className="p-4 rounded-xl bg-cyan-950/60 border-2 border-cyan-400 hover:border-cyan-300 cursor-pointer transition-all hover:scale-105 shadow-xl shadow-cyan-500/20 text-center col-span-1 md:col-span-1"
            >
              <ShieldAlert className="w-6 h-6 text-cyan-400 mx-auto mb-1 animate-pulse" />
              <span className="text-[10px] font-mono text-cyan-400 font-extrabold block uppercase tracking-wider">Anchor Actor</span>
              <span className="text-sm font-black text-white font-mono">ShadowX</span>
              <span className="text-[10px] text-emerald-400 block font-semibold mt-1">87% Attribution</span>
            </div>

            {/* Edge 2 */}
            <div className="hidden md:flex flex-col items-center justify-center text-slate-500 text-[10px] font-mono">
              <span className="text-amber-400">controls</span>
              <span className="w-full h-0.5 bg-gradient-to-r from-cyan-500 to-amber-500 my-1"></span>
              <span>96% conf</span>
            </div>

            {/* Wallet Node */}
            <div 
              onClick={() => navigate('/actors/actor-001')}
              className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 hover:border-amber-500 cursor-pointer transition-all hover:scale-105 shadow-md text-center"
            >
              <Wallet className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">Crypto Wallet</span>
              <span className="font-mono text-xs font-bold text-amber-200">BTC-DEMO-001</span>
              <span className="text-[10px] text-slate-400 block mt-1">14.28 BTC Cluster</span>
            </div>

            {/* Edge 3 */}
            <div className="hidden md:flex flex-col items-center justify-center text-slate-500 text-[10px] font-mono">
              <span className="text-rose-400">correlated_with</span>
              <span className="w-full h-0.5 bg-gradient-to-r from-amber-500 to-rose-500 my-1"></span>
              <span>84% conf</span>
            </div>

            {/* Infrastructure / Clearnet Node */}
            <div 
              onClick={() => navigate('/infrastructure')}
              className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 hover:border-rose-500 cursor-pointer transition-all hover:scale-105 shadow-md text-center"
            >
              <Server className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase">Clearnet Target</span>
              <span className="font-mono text-xs font-bold text-rose-200 truncate block">demo-infra.example</span>
              <span className="text-[10px] text-rose-400 block mt-1">84% Match</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Cluster Scope: <strong className="text-slate-200">4 Platforms</strong></span>
              <span>Wallets: <strong className="text-amber-400">2 Addresses</strong></span>
              <span>Onion Directives: <strong className="text-rose-400">hs-demo-7f3a.onion</strong></span>
            </div>
            <span className="text-cyan-400 flex items-center space-x-1 cursor-pointer hover:underline" onClick={() => navigate('/graph')}>
              <span>Interactive React Flow Graph Available</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Autonomous Collection Status Banner */}
      <div className="bg-gradient-to-r from-[#0E172A] via-[#111E38] to-[#0E172A] border border-cyan-900/60 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-cyan-950/80 rounded-xl border border-cyan-800 text-cyan-400 shadow-inner">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">Autonomous Collection Status</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Continuous polling across <strong className="text-white">24 sources</strong> (marketplaces, forums, hidden service endpoints). Last collection: <span className="font-mono text-cyan-300 font-semibold">{data?.monitoring?.last_run || "18:42"}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 uppercase">New Footprints</span>
              <span className="text-base font-bold text-cyan-300">+{data?.monitoring?.new_footprints || 37}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Relationships</span>
              <span className="text-base font-bold text-purple-300">+{data?.monitoring?.new_relationships || 12}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Personas</span>
              <span className="text-base font-bold text-emerald-400">+{data?.monitoring?.new_persona_candidates || 4}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Infra Changes</span>
              <span className="text-base font-bold text-rose-400">+{data?.monitoring?.infrastructure_changes || 7}</span>
            </div>

            <button
              onClick={handleRunCycle}
              disabled={cycleRunning}
              className="px-3 py-1.5 bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 border border-cyan-500/50 rounded-lg text-xs font-bold transition-all shadow"
            >
              {cycleRunning ? 'Running...' : 'Run Cycle'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Intelligence Feed Table */}
      <div className="bg-[#111A2E] border border-[#1E2B45] rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1E2B45] flex items-center justify-between bg-[#0E1628]">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recent Intelligence Observations</span>
            </h2>
            <p className="text-[11px] text-slate-400">Synthesized footprint ingest stream with confidence ratings</p>
          </div>
          <button
            onClick={() => navigate('/timeline')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium"
          >
            <span>View Full Timeline</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B101D] text-slate-400 uppercase text-[10px] font-mono border-b border-[#1E2B45]">
              <tr>
                <th className="py-3 px-4">Threat Actor</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Collected Indicator / Footprint</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Ingest Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2B45]/60 text-slate-300">
              {data?.recent_intelligence?.map((item) => (
                <tr key={item.id} className="hover:bg-[#152038] transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{item.actor_name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                      {item.source_name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200 max-w-md truncate">
                    {item.indicator}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs font-bold ${
                      item.confidence >= 85 ? 'text-emerald-400' :
                      item.confidence >= 70 ? 'text-cyan-400' : 'text-amber-400'
                    }`}>
                      {item.confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/actors/${item.actor_id}`)}
                      className="px-2 py-1 rounded bg-[#16233B] hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-[11px] font-medium transition-colors border border-transparent hover:border-cyan-800"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
