import React, { useState, useEffect } from 'react';
import { 
  Network, 
  RefreshCw, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Globe, 
  Terminal, 
  Server, 
  Cpu, 
  Fingerprint, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function InfrastructureAnalyzer() {
  const [selectedOnion, setSelectedOnion] = useState("hs-demo-7f3a.onion");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const presets = [
    {
      onion: "hs-demo-7f3a.onion",
      actor: "ShadowX",
      candidate: "demo-infrastructure.example",
      ip: "198.51.100.42 (SIMULATED RFC 5737 TEST-NET)",
      banner: "Apache/2.4.52 (Ubuntu) mod_ssl/2.4.52 OpenSSL/3.0.2",
      status_exposed: 1,
      descriptor_anomaly: 1,
      ssl_hash: "SHA256:8f9a2b4c7d6e5a1b3c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5a4b3c2d1e0f9a8b7c"
    },
    {
      onion: "tor-vault-shx-09.onion",
      actor: "ShadowX",
      candidate: "shx-storage-gateway.example",
      ip: "198.51.100.89 (SIMULATED RFC 5737 TEST-NET)",
      banner: "nginx/1.18.0 (Ubuntu)",
      status_exposed: 1,
      descriptor_anomaly: 0,
      ssl_hash: "SHA256:77bc991a44e2310199ddaa8877112233445566778899aabbccddeeff00112233"
    },
    {
      onion: "ghost-crypter-bot-91.onion",
      actor: "CipherGhost",
      candidate: "ghost-compiler-build.example",
      ip: "198.51.100.199 (SIMULATED RFC 5737 TEST-NET)",
      banner: "Caddy/v2.6.4 Go-http-client/2.0",
      status_exposed: 1,
      descriptor_anomaly: 1,
      ssl_hash: "SHA256:44556677889900112233aabbccddeeff44556677889900112233aabbccddeeff"
    },
    {
      onion: "silent-exploit-vault.onion",
      actor: "SilentRoot",
      candidate: "root-poc-mirror.example",
      ip: "203.0.113.204 (SIMULATED RFC 5737 TEST-NET)",
      banner: "Apache/2.4.41 (Ubuntu)",
      status_exposed: 1,
      descriptor_anomaly: 1,
      ssl_hash: "SHA256:55667788990011223344aabbccddeeff55667788990011223344aabbccddeeff"
    }
  ];

  useEffect(() => {
    runAnalysis(presets[0]);
  }, []);

  const runAnalysis = async (preset) => {
    setLoading(true);
    setStepIndex(1);

    const targetPreset = preset || presets.find(p => p.onion === selectedOnion) || presets[0];

    // Simulate multi-step probe telemetry
    setTimeout(() => setStepIndex(2), 400);
    setTimeout(() => setStepIndex(3), 800);
    setTimeout(() => setStepIndex(4), 1200);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/infrastructure/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            onion_address: targetPreset.onion,
            server_status_exposed: targetPreset.status_exposed,
            ssl_cert_hash: targetPreset.ssl_hash,
            banner_text: targetPreset.banner,
            descriptor_anomaly: targetPreset.descriptor_anomaly,
            candidate_clearnet_domain: targetPreset.candidate,
            candidate_ip: targetPreset.ip
          })
        });

        if (res.ok) {
          const data = await res.json();
          setAnalysisResult(data);
        }
      } catch (err) {
        console.error("Infrastructure analysis error", err);
      } finally {
        setLoading(false);
        setStepIndex(0);
      }
    }, 1500);
  };

  const handleSelectPreset = (p) => {
    setSelectedOnion(p.onion);
    runAnalysis(p);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Mandatory Prototype Disclaimer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">
              Hidden Service Infrastructure Analysis
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 uppercase font-bold">
              DE-ANONYMIZATION ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlates Tor hidden-service misconfigurations, SSL certificate fingerprints, and descriptor publication timing to candidate clearnet servers.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => runAnalysis()}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-rose-600/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Indicators...' : 'Analyze Indicators'}</span>
        </button>
      </div>

      {/* Prominent Synthetic Indicator Notice */}
      <div className="bg-amber-950/30 border border-amber-800/60 p-3.5 rounded-xl text-xs text-amber-200 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 block uppercase font-mono text-[11px]">
            SIMULATED DEMONSTRATION INDICATOR // SIH 2026 SCREENING PROTOTYPE
          </span>
          <p className="text-amber-200/80 text-[11px] mt-0.5 leading-relaxed">
            All onion addresses (e.g. <code className="bg-amber-950/80 px-1 py-0.2 rounded font-mono text-white">hs-demo-7f3a.onion</code>) and candidate clearnet endpoints (<code className="bg-amber-950/80 px-1 py-0.2 rounded font-mono text-white">demo-infrastructure.example</code>) are strictly synthetic. No real network scanning or Tor probing is conducted.
          </p>
        </div>
      </div>

      {/* Target Selector & Presets */}
      <div className="bg-[#111A2E] p-4 rounded-xl border border-[#1E2B45] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2.5 bg-slate-900 rounded-lg border border-[#1E2B45] text-rose-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Target Hidden Service</span>
            <div className="font-mono text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>{selectedOnion}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-normal">v3 Onion</span>
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Synthetic Targets:</span>
          {presets.map((p) => (
            <button
              key={p.onion}
              onClick={() => handleSelectPreset(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all border ${
                selectedOnion === p.onion
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600 shadow-sm'
                  : 'bg-[#0B101D] text-slate-400 border-[#1E2B45] hover:text-slate-200'
              }`}
            >
              {p.onion.split('.')[0]} ({p.actor})
            </button>
          ))}
        </div>
      </div>

      {/* Loading Steps Overlay Simulation */}
      {loading && (
        <div className="bg-[#111A2E] border border-cyan-500/40 p-4 rounded-xl text-xs space-y-2 font-mono">
          <div className="flex items-center justify-between text-cyan-300 font-bold">
            <span className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Simulated Diagnostic Pipeline in Progress...</span>
            </span>
            <span>Step {stepIndex} / 4</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400">
            <div className={`p-2 rounded border ${stepIndex >= 1 ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200' : 'bg-slate-900 border-slate-800'}`}>
              1. Probing /server-status
            </div>
            <div className={`p-2 rounded border ${stepIndex >= 2 ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200' : 'bg-slate-900 border-slate-800'}`}>
              2. SSL SAN Cross-Log
            </div>
            <div className={`p-2 rounded border ${stepIndex >= 3 ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200' : 'bg-slate-900 border-slate-800'}`}>
              3. JA3/JA4 Fingerprint
            </div>
            <div className={`p-2 rounded border ${stepIndex >= 4 ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200' : 'bg-slate-900 border-slate-800'}`}>
              4. Clearnet Synthesis
            </div>
          </div>
        </div>
      )}

      {/* 5 Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {analysisResult?.analysis_checks?.map((chk) => (
          <div 
            key={chk.id} 
            className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-4 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{chk.id.replace('chk-', '')}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${
                  chk.status === 'DETECTED' || chk.status === 'MATCH' || chk.status === 'ANOMALOUS'
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}>
                  {chk.status}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100 mb-1">{chk.name}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {chk.detail}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-400 truncate">
              → {chk.correlation_target}
            </div>
          </div>
        ))}
      </div>

      {/* Indicator Correlation Pipeline to Candidate Clearnet Infrastructure */}
      <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Indicator Correlation Pipeline</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesis of exposed telemetry mapping Tor hidden service to candidate clearnet infrastructure.
            </p>
          </div>

          {/* Infrastructure Correlation Confidence Meter */}
          <div className="flex items-center space-x-3 bg-[#0B101D] px-4 py-2 rounded-xl border border-[#1E2B45]">
            <span className="text-xs font-semibold text-slate-300">Infrastructure Correlation Confidence:</span>
            <span className="text-xl font-black font-mono text-rose-400">
              {analysisResult?.correlation_confidence || 84}%
            </span>
          </div>
        </div>

        {/* 4 Step Correlation Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {analysisResult?.correlations?.map((c, i) => (
            <div key={i} className="p-3.5 bg-[#0B101D] rounded-xl border border-[#1E2B45] space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase">
                <span>Mapping #{i + 1}</span>
                <span className="text-cyan-400 font-bold">{c.confidence}% Link</span>
              </div>
              <div className="text-slate-300 font-bold text-xs">{c.from_indicator}</div>
              <div className="text-rose-400 flex items-center space-x-1 font-semibold">
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{c.to_target}</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                {c.description}
              </p>
            </div>
          ))}
        </div>

        {/* Resulting Candidate Clearnet Infrastructure Box */}
        <div className="p-5 bg-gradient-to-r from-rose-950/30 via-slate-900 to-cyan-950/30 rounded-xl border border-rose-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-rose-400 block tracking-wider">
              Identified Candidate Clearnet Infrastructure
            </span>
            <div className="text-base lg:text-lg font-black font-mono text-white mt-0.5 flex items-center space-x-3">
              <span>{analysisResult?.candidate_clearnet_domain || "demo-infrastructure.example"}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-normal">
                {analysisResult?.candidate_ip || "198.51.100.42 (SIMULATED)"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {analysisResult?.summary || "Automated analysis identified 4 high-risk deanonymization indicators linking hidden service to candidate clearnet staging domain."}
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Forensic Attribution Verdict</span>
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-extrabold uppercase bg-rose-600 text-white shadow-md shadow-rose-600/30 mt-1">
              CLEANNET CROSS-LINK VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
