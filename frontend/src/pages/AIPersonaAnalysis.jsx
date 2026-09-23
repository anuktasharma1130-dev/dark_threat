import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  TrendingUp, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function AIPersonaAnalysis() {
  const [personas, setPersonas] = useState([]);
  const [personaAId, setPersonaAId] = useState("persona-001"); // ShadowX
  const [personaBId, setPersonaBId] = useState("persona-002"); // XShadow_New
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/personas');
      if (res.ok) {
        const data = await res.json();
        setPersonas(data);
        // Run initial analysis with first two
        runComparison("persona-001", "persona-002");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runComparison = async (idA = personaAId, idB = personaBId) => {
    setLoading(true);
    try {
      const res = await fetch('/api/persona/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona_a_id: idA,
          persona_b_id: idB
        })
      });

      if (res.ok) {
        const json = await res.json();
        setAnalysisResult(json);
      }
    } catch (err) {
      console.error("Persona analysis error", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform 24h active hours into chart format (grouped in 4-hour chunks for cleaner display)
  const getDiurnalChartData = () => {
    if (!analysisResult) return [];
    const hoursA = analysisResult.persona_a.active_hours || [];
    const hoursB = analysisResult.persona_b.active_hours || [];

    const slots = [
      { time: "00-04 UTC", a: 0, b: 0 },
      { time: "04-08 UTC", a: 0, b: 0 },
      { time: "08-12 UTC", a: 0, b: 0 },
      { time: "12-16 UTC", a: 0, b: 0 },
      { time: "16-20 UTC", a: 0, b: 0 },
      { time: "20-24 UTC", a: 0, b: 0 }
    ];

    for (let i = 0; i < 24; i++) {
      const slotIdx = Math.floor(i / 4);
      slots[slotIdx].a += (hoursA[i] || 0);
      slots[slotIdx].b += (hoursB[i] || 0);
    }

    return slots;
  };

  // Radar metrics comparison
  const getRadarData = () => {
    if (!analysisResult) return [];
    const m = analysisResult.metrics;
    return [
      { subject: "Stylometrics", scoreA: 95, scoreB: m.stylometric_similarity, fullMark: 100 },
      { subject: "Vocabulary", scoreA: 90, scoreB: m.vocabulary_similarity, fullMark: 100 },
      { subject: "Sentence Length", scoreA: 85, scoreB: m.sentence_similarity, fullMark: 100 },
      { subject: "Behaviour", scoreA: 88, scoreB: m.behavioural_similarity, fullMark: 100 },
      { subject: "Posting Schedule", scoreA: 92, scoreB: m.posting_time_similarity, fullMark: 100 }
    ];
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">
              AI-Assisted Persona Linkage & Stylometry
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
              TF-IDF + COSINE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detects threat actor rebranding, forum account migration, and cross-platform persona convergence using NLP stylometry.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => runComparison()}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-purple-600/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Running AI Engine...' : 'Run Persona Analysis'}</span>
        </button>
      </div>

      {/* Selectors for Persona A and Persona B */}
      <div className="bg-[#111A2E] p-5 rounded-xl border border-[#1E2B45] shadow-lg">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-3">
          Select Pair for Cross-Persona Attribution
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Persona A */}
          <div className="p-4 bg-[#0B101D] rounded-xl border border-cyan-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Persona A (Known Anchor Profile)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Source Anchor</span>
            </div>

            <select
              value={personaAId}
              onChange={(e) => {
                setPersonaAId(e.target.value);
                runComparison(e.target.value, personaBId);
              }}
              className="w-full bg-[#111A2E] text-slate-100 text-xs rounded-lg p-2.5 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 font-mono font-semibold"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.persona_code} - @{p.handle} ({p.platform}) [{p.actor_name}]
                </option>
              ))}
            </select>
          </div>

          {/* Persona B */}
          <div className="p-4 bg-[#0B101D] rounded-xl border border-purple-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Persona B (Candidate Migration Profile)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Target Candidate</span>
            </div>

            <select
              value={personaBId}
              onChange={(e) => {
                setPersonaBId(e.target.value);
                runComparison(personaAId, e.target.value);
              }}
              className="w-full bg-[#111A2E] text-slate-100 text-xs rounded-lg p-2.5 border border-[#1E2B45] focus:outline-none focus:border-purple-500 font-mono font-semibold"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.persona_code} - @{p.handle} ({p.platform}) [{p.actor_name}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Dashboard */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Overall Verdict & 5 Metric Cards */}
          <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1E2B45]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                    AI Attribution Assessment
                  </span>
                </div>
                <div className="text-2xl font-black text-white mt-1 flex items-center space-x-3">
                  <span>{analysisResult.verdict}</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                    analysisResult.verdict_type === 'high' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    analysisResult.verdict_type === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {analysisResult.verdict_type.toUpperCase()} CONFIDENCE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  High-dimensional TF-IDF vector similarity and temporal posting distributions corroborate that @{analysisResult.persona_a.handle} and @{analysisResult.persona_b.handle} represent the same operational actor across platforms.
                </p>
              </div>

              {/* Big Overall Link Confidence */}
              <div className="bg-[#0B101D] p-5 rounded-xl border border-[#1E2B45] text-center min-w-[200px] shadow-inner">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Overall Link Confidence
                </span>
                <div className="text-4xl font-black font-mono text-purple-300 my-1">
                  {analysisResult.metrics.overall_confidence}%
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: `${analysisResult.metrics.overall_confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 5 Core Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-6 font-mono">
              <div className="p-3 bg-[#0B101D] rounded-xl border border-[#1E2B45]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Stylometric Similarity</span>
                <span className="text-xl font-bold text-cyan-400">{analysisResult.metrics.stylometric_similarity}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">TF-IDF n-grams</span>
              </div>

              <div className="p-3 bg-[#0B101D] rounded-xl border border-[#1E2B45]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Vocabulary Overlap</span>
                <span className="text-xl font-bold text-purple-400">{analysisResult.metrics.vocabulary_similarity}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">Jaccard token set</span>
              </div>

              <div className="p-3 bg-[#0B101D] rounded-xl border border-[#1E2B45]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Sentence Patterns</span>
                <span className="text-xl font-bold text-emerald-400">{analysisResult.metrics.sentence_similarity}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">Length & syntax cadence</span>
              </div>

              <div className="p-3 bg-[#0B101D] rounded-xl border border-[#1E2B45]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Behavioural Match</span>
                <span className="text-xl font-bold text-amber-400">{analysisResult.metrics.behavioural_similarity}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">Brevity & escrow rules</span>
              </div>

              <div className="p-3 bg-[#0B101D] rounded-xl border border-[#1E2B45]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Posting Schedule</span>
                <span className="text-xl font-bold text-rose-400">{analysisResult.metrics.posting_time_similarity}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">24h diurnal alignment</span>
              </div>
            </div>
          </div>

          {/* Charts: Diurnal Active Hours + Behavioural Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diurnal Schedule Comparison */}
            <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2B45] mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Diurnal Active Hours Comparison</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">24-hour posting volume distributions (Persona A vs B)</p>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getDiurnalChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2B45" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B101D', borderColor: '#1E2B45', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="a" name={`@${analysisResult.persona_a.handle} (A)`} fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="b" name={`@${analysisResult.persona_b.handle} (B)`} fill="#A855F7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Behavioural Profiling & Evidence Points */}
            <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2B45] mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Corroborating Evidence Points</span>
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {analysisResult.evidence_points.length} Matches Found
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {analysisResult.evidence_points.map((ev, i) => (
                    <div key={i} className="p-2.5 bg-[#0B101D] rounded-lg border border-[#1E2B45] flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Terminology Badges */}
              <div className="pt-3 border-t border-[#1E2B45] mt-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                  Overlapping Lexicon & Jargon Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.common_keywords?.length > 0 ? (
                    analysisResult.common_keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No significant domain jargon overlap.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
