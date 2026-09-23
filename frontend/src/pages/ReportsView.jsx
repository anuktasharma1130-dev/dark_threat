import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  KeyRound, 
  Network, 
  Cpu, 
  CheckCircle2,
  X
} from 'lucide-react';

export default function ReportsView() {
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState("actor-001");
  const [reportType, setReportType] = useState("actor_intelligence");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchActors();
  }, []);

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

  const handleGenerate = async (type = reportType, actorId = selectedActor) => {
    setLoading(true);
    setReportType(type);
    setSelectedActor(actorId);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_type: type,
          actor_id: actorId,
          include_timeline: true,
          include_infrastructure: true,
          include_graph: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedReport(data);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Report generation error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = () => {
    if (!generatedReport) return;
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${generatedReport.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B101D; color: #E2E8F0; padding: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #1E2B45; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #38BDF8; margin: 0; }
          .badge { display: inline-block; background: #082F49; color: #38BDF8; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-family: monospace; }
          .card { background: #111A2E; border: 1px solid #1E2B45; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          h2 { font-size: 16px; border-bottom: 1px solid #1E2B45; padding-bottom: 8px; color: #94A3B8; text-transform: uppercase; font-size: 13px; }
          .mono { font-family: monospace; color: #34D399; }
          .disclaimer { background: #451A03; border: 1px solid #78350F; color: #FDE68A; padding: 15px; border-radius: 8px; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">DARKTRACE INTELLIGENCE DOSSIER // SIH 2026 PS 26151</span>
          <h1 class="title">${generatedReport.title}</h1>
          <p>Generated At: ${generatedReport.generated_at} | Classification: ${generatedReport.classification}</p>
        </div>

        <div class="card">
          <h2>Executive Summary</h2>
          <p>${generatedReport.executive_summary}</p>
        </div>

        <div class="card">
          <h2>Attribution Confidence: ${generatedReport.attribution_confidence.overall_score}% (${generatedReport.attribution_confidence.confidence_level})</h2>
          <p>${generatedReport.attribution_confidence.methodology}</p>
        </div>

        <div class="card">
          <h2>Observed Identity Indicators</h2>
          <p><strong>Handles:</strong> ${generatedReport.identity_indicators.handles.map(h => '@' + h.handle + ' (' + h.platform + ')').join(', ')}</p>
          <p><strong>PGP Keys:</strong> ${generatedReport.identity_indicators.pgp_keys.map(p => p.key_id + ' - ' + p.fingerprint).join(', ')}</p>
          <p><strong>Wallets:</strong> ${generatedReport.identity_indicators.wallets.map(w => w.address + ' (' + w.currency + ')').join(', ')}</p>
        </div>

        <div class="card">
          <h2>Infrastructure Findings</h2>
          ${generatedReport.infrastructure_findings.map(inf => `
            <p class="mono">${inf.onion_address} → Candidate Clearnet: ${inf.candidate_clearnet_domain} (${inf.candidate_ip})</p>
            <p>${inf.notes}</p>
          `).join('')}
        </div>

        <div class="card">
          <h2>Persona Linkage & Behaviour Profile</h2>
          <p><strong>Diurnal Schedule:</strong> ${generatedReport.behaviour_profile.typical_active_hours}</p>
          <p><strong>Posting Cadence:</strong> ${generatedReport.behaviour_profile.posting_frequency}</p>
          <p><strong>Jargon Tokens:</strong> ${generatedReport.behaviour_profile.common_keywords.join(', ')}</p>
        </div>

        <div class="disclaimer">
          <strong>Mandatory Notice:</strong> ${generatedReport.limitations_and_disclaimer}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedReport.report_id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const templates = [
    {
      id: "actor_intelligence",
      title: "Actor Intelligence Dossier",
      desc: "Full comprehensive profile covering multi-platform handles, PGP signatures, wallet clusters, and attribution confidence.",
      icon: ShieldCheck,
      color: "from-cyan-600 to-blue-600"
    },
    {
      id: "infrastructure",
      title: "Infrastructure Analysis Report",
      desc: "Tor hidden service deanonymization findings including server-status leaks, TLS cert serials, and clearnet reverse proxy mappings.",
      icon: Network,
      color: "from-rose-600 to-orange-600"
    },
    {
      id: "persona_linkage",
      title: "Persona Linkage & Stylometry Report",
      desc: "NLP stylometric cosine similarity analysis, diurnal active hours overlap, and rebranded persona migration proof.",
      icon: Cpu,
      color: "from-purple-600 to-indigo-600"
    },
    {
      id: "investigation_summary",
      title: "SOC Executive Briefing",
      desc: "High-level summary formatted for law enforcement or leadership briefing with key evidence provenance and recommended mitigations.",
      icon: FileText,
      color: "from-emerald-600 to-teal-600"
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">
              Intelligence Reporting & Exports
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
              EXPORT READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate forensic actor dossiers, infrastructure de-anonymization proofs, and CSV/JSON intelligence bundles.
          </p>
        </div>

        {/* Global direct export triggers */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => window.location.href = "/api/export/actors/csv"}
            className="px-3 py-1.5 bg-[#111A2E] hover:bg-[#16233B] text-slate-200 border border-[#1E2B45] rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.location.href = "/api/export/actors/json"}
            className="px-3 py-1.5 bg-[#111A2E] hover:bg-[#16233B] text-slate-200 border border-[#1E2B45] rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Target Actor Selector */}
      <div className="bg-[#111A2E] p-4 rounded-xl border border-[#1E2B45] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-300 uppercase font-mono">Report Subject:</span>
          <select
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="bg-[#0B101D] text-slate-100 text-xs rounded-lg px-3 py-1.5 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 font-mono font-semibold"
          >
            {actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.category}) - {a.confidence}% Confidence
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Select target profile to populate report templates
        </span>
      </div>

      {/* 4 Report Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div 
              key={tpl.id}
              className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 flex flex-col justify-between shadow-lg hover:border-cyan-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${tpl.color} shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tpl.title}
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400">Standardized Format</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {tpl.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">PDF / HTML Ready</span>
                <button
                  onClick={() => handleGenerate(tpl.id, selectedActor)}
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#16233B] hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal Viewer */}
      {showModal && generatedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#0B101D] border border-[#1E2B45] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1E2B45] flex items-center justify-between bg-[#0E1628]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-mono">{generatedReport.title}</h2>
                  <span className="text-[10px] font-mono text-slate-400">{generatedReport.report_id} • {generatedReport.generated_at}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadHTML}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report (HTML)</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Report Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Executive Summary */}
              <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45]">
                <h3 className="text-xs font-bold uppercase text-slate-200 mb-2 font-mono">1. Executive Summary</h3>
                <p className="text-xs leading-relaxed text-slate-300">
                  {generatedReport.executive_summary}
                </p>
              </div>

              {/* Attribution Confidence Rating */}
              <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-200 mb-1 font-mono">2. Attribution Confidence Rating</h3>
                  <p className="text-[11px] text-slate-400">{generatedReport.attribution_confidence.methodology}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-cyan-300">{generatedReport.attribution_confidence.overall_score}%</span>
                  <span className="block text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    {generatedReport.attribution_confidence.confidence_level} CONFIDENCE
                  </span>
                </div>
              </div>

              {/* Identity Indicators */}
              <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45] space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-200 font-mono">3. Corroborated Identity Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="p-2.5 bg-[#0B101D] rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Handles:</span>
                    {generatedReport.identity_indicators.handles.map(h => (
                      <div key={h.id} className="text-emerald-400">@{h.handle} ({h.platform})</div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-[#0B101D] rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">PGP Keys:</span>
                    {generatedReport.identity_indicators.pgp_keys.map(p => (
                      <div key={p.id} className="text-cyan-400 truncate">{p.key_id} ({p.algorithm})</div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-[#0B101D] rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Wallets:</span>
                    {generatedReport.identity_indicators.wallets.map(w => (
                      <div key={w.id} className="text-amber-400 truncate">{w.currency}: {w.address.slice(0, 16)}...</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Infrastructure Findings */}
              <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45] space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-200 font-mono">4. Infrastructure De-anonymization Findings</h3>
                {generatedReport.infrastructure_findings.map(inf => (
                  <div key={inf.id} className="p-3 bg-[#0B101D] rounded border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="text-rose-400 font-bold">{inf.onion_address} → {inf.candidate_clearnet_domain} ({inf.candidate_ip})</div>
                    <div className="text-slate-400 font-sans text-xs">{inf.notes}</div>
                  </div>
                ))}
              </div>

              {/* Behaviour & Persona Migration */}
              <div className="p-4 bg-[#111A2E] rounded-xl border border-[#1E2B45] space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-200 font-mono">5. Behavioural Profile & Lexical Alignment</h3>
                <div className="text-xs text-slate-300 space-y-1">
                  <div><strong>Active Schedule:</strong> {generatedReport.behaviour_profile.typical_active_hours}</div>
                  <div><strong>Posting Frequency:</strong> {generatedReport.behaviour_profile.posting_frequency}</div>
                  <div><strong>Characteristic Terminology:</strong> {generatedReport.behaviour_profile.common_keywords.join(', ')}</div>
                </div>
              </div>

              {/* Mandatory Disclaimer */}
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-xl text-[11px] text-amber-200">
                <strong>Disclaimers & Limitations:</strong> {generatedReport.limitations_and_disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
