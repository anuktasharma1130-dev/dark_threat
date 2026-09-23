import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  GitFork, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info, 
  ExternalLink, 
  ShieldAlert, 
  User, 
  KeyRound, 
  Wallet, 
  Globe, 
  Cpu, 
  Server, 
  X,
  Sparkles
} from 'lucide-react';

// Custom node component for polished SOC aesthetics
const CustomEntityNode = ({ data, selected }) => {
  const getNodeBadge = () => {
    switch (data.type) {
      case 'actor':
        return { bg: 'bg-cyan-950/90', border: 'border-cyan-500 shadow-cyan-500/20', text: 'text-cyan-300', icon: ShieldAlert, label: 'ACTOR' };
      case 'handle':
        return { bg: 'bg-emerald-950/90', border: 'border-emerald-500 shadow-emerald-500/20', text: 'text-emerald-300', icon: User, label: 'HANDLE' };
      case 'pgp_key':
        return { bg: 'bg-purple-950/90', border: 'border-purple-500 shadow-purple-500/20', text: 'text-purple-300', icon: KeyRound, label: 'PGP' };
      case 'wallet':
        return { bg: 'bg-amber-950/90', border: 'border-amber-500 shadow-amber-500/20', text: 'text-amber-300', icon: Wallet, label: 'WALLET' };
      case 'marketplace':
      case 'forum':
        return { bg: 'bg-blue-950/90', border: 'border-blue-500 shadow-blue-500/20', text: 'text-blue-300', icon: Globe, label: data.type.toUpperCase() };
      case 'persona':
        return { bg: 'bg-violet-950/90', border: 'border-violet-500 shadow-violet-500/20', text: 'text-violet-300', icon: Cpu, label: 'PERSONA' };
      case 'infrastructure':
      case 'clearnet':
        return { bg: 'bg-rose-950/90', border: 'border-rose-500 shadow-rose-500/20', text: 'text-rose-300', icon: Server, label: data.type.toUpperCase() };
      default:
        return { bg: 'bg-slate-900', border: 'border-slate-600', text: 'text-slate-300', icon: Info, label: 'NODE' };
    }
  };

  const badge = getNodeBadge();
  const Icon = badge.icon;

  return (
    <div className={`p-2.5 rounded-xl border ${badge.border} ${badge.bg} shadow-lg min-w-[140px] max-w-[200px] transition-all ${
      selected ? 'ring-2 ring-cyan-400 scale-105' : ''
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2 !h-2" />
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded bg-black/40 ${badge.text}`}>
          {badge.label}
        </span>
        <Icon className={`w-3.5 h-3.5 ${badge.text}`} />
      </div>
      <div className="font-mono text-xs font-bold text-slate-100 truncate">
        {data.label}
      </div>
      {data.details && (
        <p className="text-[9px] text-slate-400 truncate mt-0.5">{data.details}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-2 !h-2" />
    </div>
  );
};

export default function RelationshipGraphView() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeActorFilter, setActiveActorFilter] = useState("actor-001"); // ShadowX by default
  const [nodeTypeFilter, setNodeTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const nodeTypes = useMemo(() => ({ customEntity: CustomEntityNode }), []);

  useEffect(() => {
    fetchGraphData();
  }, [activeActorFilter, nodeTypeFilter]);

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      let url = `/api/relationships?actor_id=${activeActorFilter}`;
      if (nodeTypeFilter !== "ALL") url += `&filter_type=${nodeTypeFilter}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        
        // Auto-layout in radial or clustered hierarchy
        const rawNodes = data.nodes || [];
        const rawEdges = data.edges || [];

        // Center primary actor node at (450, 260)
        const centerNode = rawNodes.find(n => n.type === 'actor') || rawNodes[0];
        const otherNodes = rawNodes.filter(n => n.id !== centerNode?.id);

        const flowNodes = [];
        if (centerNode) {
          flowNodes.push({
            id: centerNode.id,
            type: 'customEntity',
            position: { x: 420, y: 240 },
            data: { ...centerNode }
          });
        }

        const radius = 260;
        const angleStep = (2 * Math.PI) / (otherNodes.length || 1);

        otherNodes.forEach((node, i) => {
          const angle = i * angleStep;
          const x = 420 + radius * Math.cos(angle);
          const y = 240 + radius * Math.sin(angle);

          flowNodes.push({
            id: node.id,
            type: 'customEntity',
            position: { x, y },
            data: { ...node }
          });
        });

        const flowEdges = rawEdges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          type: 'smoothstep',
          animated: e.label === 'controls' || e.label === 'correlated_with',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#06B6D4'
          },
          style: {
            stroke: e.label === 'controls' ? '#F59E0B' : (e.label === 'correlated_with' ? '#F43F5E' : '#3B82F6'),
            strokeWidth: 2
          },
          data: { ...e }
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);

        // Preselect center node
        if (centerNode) setSelectedNode(centerNode);
      }
    } catch (err) {
      console.error("Failed to fetch relationship graph", err);
    } finally {
      setLoading(false);
    }
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  const nodeTypeFilters = [
    { id: "ALL", label: "All Entity Types" },
    { id: "handle", label: "Handles" },
    { id: "pgp_key", label: "PGP Keys" },
    { id: "wallet", label: "Wallets" },
    { id: "marketplace", label: "Marketplaces" },
    { id: "persona", label: "Personas" },
    { id: "infrastructure", label: "Infrastructure" }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative select-none">
      {/* Top Filter and Controls Bar */}
      <div className="bg-[#0B101D] border-b border-[#1E2B45] p-4 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Threat Entity Relationship Graph</h1>
            <p className="text-[11px] text-slate-400">Interactive node-link mapping across darknet identities and infrastructure</p>
          </div>
        </div>

        {/* Cluster / Actor Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Cluster Focus:</span>
          <select
            value={activeActorFilter}
            onChange={(e) => setActiveActorFilter(e.target.value)}
            className="bg-[#111A2E] text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-[#1E2B45] focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="actor-001">Cluster: ShadowX (Data Theft)</option>
            <option value="actor-002">Cluster: NightWolf (Credentials)</option>
            <option value="actor-003">Cluster: CipherGhost (Malware)</option>
            <option value="actor-004">Cluster: DarkFalcon (Hacking)</option>
            <option value="actor-008">Cluster: SilentRoot (Zero-Days)</option>
          </select>
        </div>

        {/* Node Type Filter */}
        <div className="flex items-center space-x-1.5">
          {nodeTypeFilters.slice(0, 5).map((f) => (
            <button
              key={f.id}
              onClick={() => setNodeTypeFilter(f.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                nodeTypeFilter === f.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
                  : 'bg-[#111A2E] text-slate-400 hover:text-slate-200 border border-[#1E2B45]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="flex-1 w-full h-full relative bg-[#080C14]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#080C14]/80 z-20">
            <div className="text-cyan-400 font-mono text-xs flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Calculating Multi-Hop Topological Graph Layout...</span>
            </div>
          </div>
        ) : null}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.8}
        >
          <Background color="#16233B" gap={20} size={1} />
          <Controls position="bottom-left" showInteractive={false} />
        </ReactFlow>

        {/* Graph Legend Panel */}
        <div className="absolute bottom-5 left-16 bg-[#0E1628]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#1E2B45] text-[11px] shadow-2xl z-10 max-w-xs pointer-events-auto">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-2 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Graph Legend & Relationship Types</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px]">
            <div className="flex items-center space-x-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
              <span>Actor Node</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              <span>Handle</span>
            </div>
            <div className="flex items-center space-x-1.5 text-purple-300">
              <span className="w-2.5 h-2.5 rounded bg-purple-500"></span>
              <span>PGP Key</span>
            </div>
            <div className="flex items-center space-x-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
              <span>Crypto Wallet</span>
            </div>
            <div className="flex items-center space-x-1.5 text-rose-300">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
              <span>Hidden Service</span>
            </div>
            <div className="flex items-center space-x-1.5 text-violet-300">
              <span className="w-2.5 h-2.5 rounded bg-violet-500"></span>
              <span>Persona</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            Edges: <span className="text-amber-400">controls</span>, <span className="text-cyan-400">uses</span>, <span className="text-blue-400">observed_on</span>, <span className="text-rose-400">correlated_with</span>
          </div>
        </div>

        {/* Selected Node Details Slideout Panel */}
        {selectedNode && (
          <div className="absolute top-5 right-5 w-80 bg-[#0E1628]/95 backdrop-blur-md border border-[#1E2B45] rounded-xl shadow-2xl p-4 z-20 animate-in slide-in-from-right-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#1E2B45] mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">
                  {selectedNode.type} Entity
                </span>
                <h3 className="text-sm font-bold text-white font-mono">{selectedNode.label}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {selectedNode.category && (
                <div className="flex justify-between text-slate-400">
                  <span>Category:</span>
                  <span className="text-slate-200 font-semibold">{selectedNode.category}</span>
                </div>
              )}
              {selectedNode.confidence && (
                <div className="flex justify-between text-slate-400">
                  <span>Attribution Confidence:</span>
                  <span className="text-cyan-400 font-mono font-bold">{selectedNode.confidence}%</span>
                </div>
              )}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                {selectedNode.details || "Corroborated node in multi-hop attribution graph. Connected via dark web footprint intelligence feeds."}
              </div>

              {selectedNode.type === 'actor' && (
                <button
                  onClick={() => navigate(`/actors/${selectedNode.id}`)}
                  className="w-full mt-2 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow"
                >
                  <span>Open Full Actor Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
