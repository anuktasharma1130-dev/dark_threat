import React from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function ConfidenceMeter({ confidenceData, compact = false }) {
  if (!confidenceData) return null;

  const { overall_score, confidence_level, components, title, methodology } = confidenceData;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-rose-500 to-orange-400';
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
          <div 
            className={`h-full ${getProgressBarColor(overall_score)} transition-all duration-500`}
            style={{ width: `${overall_score}%` }}
          />
        </div>
        <span className={`text-xs font-mono font-bold ${overall_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {overall_score}%
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#111A2E] rounded-xl border border-[#1E2B45] p-5 shadow-lg">
      <div className="flex items-start justify-between pb-4 border-b border-[#1E2B45]">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">{title || "Prototype Attribution Confidence"}</h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xl">
            {methodology || "Explainable multi-dimensional weighted attribution model based on cryptographic proof, infrastructure fingerprints, and stylometry."}
          </p>
        </div>

        {/* Big Overall Gauge */}
        <div className="text-right">
          <div className="flex items-baseline space-x-1 justify-end">
            <span className="text-3xl font-extrabold font-mono text-cyan-300">{overall_score}%</span>
          </div>
          <span className={`inline-block mt-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getScoreColor(overall_score)}`}>
            {confidence_level} CONFIDENCE
          </span>
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="my-4">
        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
          <div 
            className={`h-full rounded-full ${getProgressBarColor(overall_score)} transition-all duration-700`}
            style={{ width: `${overall_score}%` }}
          />
        </div>
      </div>

      {/* Sub-Components Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {components?.map((c) => (
          <div key={c.key} className="p-3 bg-[#0D1527] rounded-lg border border-[#1E2B45]/80 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200">{c.factor}</span>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-[10px] text-slate-400">({c.weight}%)</span>
                <span className="font-bold text-cyan-300">{c.score}%</span>
              </div>
            </div>
            
            {/* Component bar */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800 mb-2">
              <div 
                className={`h-full ${getProgressBarColor(c.score)}`}
                style={{ width: `${c.score}%` }}
              />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {c.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
