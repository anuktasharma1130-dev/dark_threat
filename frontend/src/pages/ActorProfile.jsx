import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  GitFork, 
  Clock, 
  Cpu, 
  FileText, 
  Download, 
  ShieldCheck, 
  KeyRound, 
  Wallet, 
  Globe, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Server,
  Share2
} from 'lucide-react';
import ConfidenceMeter from '../components/ConfidenceMeter';

export default function ActorProfile({ onOpenReportModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchActorProfile();
  }, [id]);

  const fetchActorProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/actors/${id || 'actor-001'}`);
      if (res.ok) {
        const json = await res.json();
        setProfile(json);
      }
    } catch (err) {
      console.error("Failed to fetch actor profile", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-cyan-400 font-mono text-xs flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Compiling Threat Actor Attribution Dossier...</span>
        </div>
      </div>
    );
  }

  const { actor, identity_indicators, marketplaces, forums, linked_personas, infrastructure, source_evidence, confidence_breakdown } = profile;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E2B45]">
        <button
          onClick={() => navigate('/actors')}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Threat Actors Registry</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          Dossier ID: <strong className="text-cyan-400 font-semibold">{actor.id}</strong>
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-wide">{actor.name}</h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                {actor.status}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
                {actor.threat_level} THREAT
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mb-4">
              {actor.summary}
            </p>

            {/* Quick Meta Badges */}
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Primary Handle:</span>
                <span className="text-emerald-400 font-semibold">@{actor.primary_handle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Category:</span>
                <span className="text-slate-200 font-semibold">{actor.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">First Observed:</span>
                <span className="text-slate-300">{actor.first_observed}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Last Observed:</span>
                <span className="text-cyan-300">{actor.last_seen}</span>
              </div>
            </div>
          </div>

          {/* Attribution Score Badge */}
          <div className="bg-[#0B101D] p-5 rounded-xl border border-[#1E2B45] text-center lg:min-w-[200px] shadow-inner">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Attribution Confidence</span>
            <div className="text-4xl font-black font-mono text-cyan-300 my-1">{actor.confidence}%</div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 inline-block">
              HIGH CONFIDENCE
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 pt-5 border-t border-[#1E2B45] flex flex-wrap gap-2.5 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/graph')}
              className="px-3 py-1.5 rounded-lg bg-[#16233B] hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>View Relationship Graph</span>
            </button>
            <button
              onClick={() => navigate('/timeline')}
              className="px-3 py-1.5 rounded-lg bg-[#16233B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>View Timeline</span>
            </button>
            <button
              onClick={() => navigate('/personas')}
              className="px-3 py-1.5 rounded-lg bg-[#16233B] hover:bg-purple-950 text-purple-300 border border-slate-700 hover:border-purple-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Analyze Persona</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onOpenReportModal(actor.id)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Report</span>
            </button>
            <button
              onClick={() => window.location.href = "/api/export/actors/json"}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B101D] hover:bg-[#16233B] text-slate-300 border border-[#1E2B45] text-xs font-medium flex items-center space-x-1 transition-colors"
              title="Export structured JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => window.location.href = "/api/export/actors/csv"}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B101D] hover:bg-[#16233B] text-slate-300 border border-[#1E2B45] text-xs font-medium flex items-center space-x-1 transition-colors"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attribution Confidence Meter (Explainable weighted breakdown) */}
      <ConfidenceMeter confidenceData={confidence_breakdown} />

      {/* Main Investigation Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Identity Indicators (Handles, PGP, Wallets) */}
        <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1E2B45]">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Identity Indicators</h2>
          </div>

          {/* Handles */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">Correlated Handles & Platforms</span>
            <div className="space-y-1.5">
              {identity_indicators.handles?.map((h) => (
                <div key={h.id} className="p-2.5 bg-[#0B101D] rounded-lg border border-[#1E2B45] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-emerald-400">@{h.handle}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({h.platform})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Seen: {h.last_seen}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PGP Keys */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">Cryptographic PGP Fingerprints</span>
            <div className="space-y-1.5">
              {identity_indicators.pgp_keys?.map((pgp) => (
                <div key={pgp.id} className="p-2.5 bg-[#0B101D] rounded-lg border border-[#1E2B45] text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-cyan-300 font-semibold">{pgp.key_id} ({pgp.algorithm})</span>
                    <span className="text-[10px] text-slate-400">{pgp.email_alias}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 break-all bg-slate-900/60 p-1 rounded border border-slate-800">
                    {pgp.fingerprint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">Cryptocurrency Wallet Clusters</span>
            <div className="space-y-1.5">
              {identity_indicators.wallets?.map((w) => (
                <div key={w.id} className="p-2.5 bg-[#0B101D] rounded-lg border border-[#1E2B45] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-amber-300 block text-[11px]">{w.address}</span>
                    <span className="text-[10px] text-slate-400">{w.cluster_label} ({w.currency}) • {w.tx_count} txs</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-200">{w.total_received}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* B, C, D: Platform Presence & Linked Personas */}
        <div className="space-y-6">
          {/* Marketplace & Forum Presence */}
          <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#1E2B45] mb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Marketplace & Forum Presence</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">Marketplaces</span>
                <div className="space-y-1.5">
                  {marketplaces.map((m) => (
                    <div key={m.id} className="p-2 bg-[#0B101D] rounded border border-[#1E2B45]">
                      <span className="font-semibold text-slate-200 block">{m.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">Handle: @{m.observed_handle}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">Forums</span>
                <div className="space-y-1.5">
                  {forums.map((f) => (
                    <div key={f.id} className="p-2 bg-[#0B101D] rounded border border-[#1E2B45]">
                      <span className="font-semibold text-slate-200 block">{f.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400">Handle: @{f.observed_handle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* D. Linked Personas */}
          <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2B45] mb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Linked Personas</h2>
              </div>
              <button
                onClick={() => navigate('/personas')}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
              >
                Deep Stylometric Compare →
              </button>
            </div>

            <div className="space-y-2.5">
              {linked_personas.map((lp, idx) => (
                <div key={idx} className="p-3 bg-[#0B101D] rounded-xl border border-[#1E2B45] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-100">{lp.code}</span>
                      <span className="text-emerald-400 font-mono">@{lp.handle}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{lp.platform} • Status: {lp.status}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-purple-300">{lp.similarity}% similarity</span>
                    <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${lp.similarity}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* E. Infrastructure Indicators */}
      <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2B45] mb-4">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Infrastructure Correlation Indicators</h2>
          </div>
          <button
            onClick={() => navigate('/infrastructure')}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            Launch Hidden Service Analyzer →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infrastructure.map((inf) => (
            <div key={inf.id} className="p-4 bg-[#0B101D] rounded-xl border border-[#1E2B45] space-y-2.5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Simulated Hidden Service</span>
                  <span className="font-mono font-bold text-rose-300 text-xs">{inf.onion_address}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {inf.correlation_score}% CORRELATED
                </span>
              </div>

              <div className="space-y-1.5 pt-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Server-status:</span>
                  <span className={inf.server_status_exposed ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {inf.server_status_exposed ? "EXPOSED / DETECTED" : "CLEAN"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service Banner:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">{inf.banner_text}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Descriptor Anomaly:</span>
                  <span className={inf.descriptor_anomaly ? "text-amber-400 font-bold" : "text-slate-400"}>
                    {inf.descriptor_anomaly ? "YES (UTC+3 Cron Leak)" : "NORMAL"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Candidate Clearnet:</span>
                  <span className="text-cyan-400 font-semibold">{inf.candidate_clearnet_domain}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                {inf.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* F. Source Evidence Provenance Cards */}
      <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#1E2B45] mb-4">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Source Evidence & Provenance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {source_evidence.map((src, i) => (
            <div key={i} className="p-3.5 bg-[#0B101D] rounded-xl border border-[#1E2B45] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100">{src.source}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  src.reliability === 'HIGH' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                  src.reliability === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {src.reliability} RELIABILITY
                </span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div>Type: <span className="text-slate-300">{src.type}</span></div>
                <div>First Observed: <span className="text-slate-300">{src.observation_date}</span></div>
                <div>Last Harvest: <span className="text-cyan-400">{src.last_scan}</span></div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                Evidence: <span className="text-slate-300">{src.evidence_type}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
