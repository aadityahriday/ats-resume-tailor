import { useMemo, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
} from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Activity, AlertCircle, Loader2 } from 'lucide-react'
import { WorkflowNode } from './WorkflowNode'
import { WorkflowEdge } from './WorkflowEdge'
import { WORKFLOW_STEPS, WORKFLOW_EDGES, STATUS } from '../../lib/workflowSteps'

const NODE_TYPES = { workflow: WorkflowNode }
const EDGE_TYPES = { animated: WorkflowEdge }

/**
 * Determines edge "flow" state from source and target node statuses.
 */
function computeEdgeFlow(sourceStatus, targetStatus) {
  if (sourceStatus === STATUS.ERROR || targetStatus === STATUS.ERROR) return 'error'
  if (sourceStatus === STATUS.DONE && targetStatus === STATUS.RUNNING) return 'running'
  if (sourceStatus === STATUS.DONE && targetStatus === STATUS.DONE) return 'active'
  if (sourceStatus === STATUS.DONE) return 'active'
  return 'idle'
}

export default function WorkflowCanvas({ stepState, isGenerating, error, onNodeClick }) {
  // Build nodes + edges from step state
  const initialNodes = useMemo(
    () =>
      WORKFLOW_STEPS.map((step) => ({
        id: step.id,
        type: 'workflow',
        position: step.position,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: step.name,
          desc: step.desc,
          icon: step.icon,
          status: stepState[step.id]?.status || STATUS.IDLE,
          elapsed: stepState[step.id]?.elapsed || 0,
        },
        draggable: false,
        selectable: true,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const initialEdges = useMemo(
    () =>
      WORKFLOW_EDGES.map((edge) => ({
        ...edge,
        type: 'animated',
        data: { flow: 'idle' },
      })),
    []
  )

  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  // Sync external state into React Flow
  useEffect(() => {
    setNodes((current) =>
      current.map((node) => {
        const s = stepState[node.id]
        if (!s) return node
        if (
          node.data.status === s.status &&
          node.data.elapsed === s.elapsed
        ) {
          return node
        }
        return {
          ...node,
          data: {
            ...node.data,
            status: s.status,
            elapsed: s.elapsed,
          },
        }
      })
    )

    setEdges((current) =>
      current.map((edge) => {
        const flow = computeEdgeFlow(
          stepState[edge.source]?.status || STATUS.IDLE,
          stepState[edge.target]?.status || STATUS.IDLE
        )
        if (edge.data?.flow === flow) return edge
        return { ...edge, data: { ...edge.data, flow } }
      })
    )
  }, [stepState, setNodes, setEdges])

  // Stats
  const completedCount = Object.values(stepState).filter((s) => s.status === STATUS.DONE).length
  const totalCount = WORKFLOW_STEPS.length
  const hasError = Object.values(stepState).some((s) => s.status === STATUS.ERROR)
  const allDone = completedCount === totalCount
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <section className="max-w-6xl mx-auto px-6 py-8" id="workflow-panel">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`workflow-canvas bg-surface rounded-2xl overflow-hidden border transition-all duration-500 ${
          hasError
            ? 'border-error/30 shadow-[0_0_64px_rgba(244,63,94,0.08)]'
            : allDone
            ? 'border-success/25 shadow-[0_0_64px_rgba(16,185,129,0.08)]'
            : isGenerating
            ? 'border-amber/20 shadow-[0_0_64px_rgba(255,159,67,0.08)]'
            : 'border-border'
        }`}
      >
        {/* ─── Header ──────────────────────────────────────── */}
        <div
          className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between bg-surface-raised/80"
        >
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <span className={`w-[10px] h-[10px] rounded-full transition-colors ${
                hasError ? 'bg-error' : allDone ? 'bg-success' : isGenerating ? 'bg-amber animate-pulse-amber' : 'bg-muted/30'
              }`} />
              <span className={`w-[10px] h-[10px] rounded-full ${isGenerating ? 'bg-amber/40' : 'bg-muted/15'}`} />
              <span className={`w-[10px] h-[10px] rounded-full ${isGenerating ? 'bg-amber/20' : 'bg-muted/10'}`} />
            </div>
            <h3 className="font-mono text-text/90 font-semibold text-xs tracking-[0.15em] uppercase">
              Resume Generator Engine
            </h3>
            <span className="font-mono text-[10px] text-muted/60 ml-2 hidden sm:inline">
              n8n-style pipeline · 10 nodes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted tabular-nums">
              {completedCount}/{totalCount}
            </span>
            <AnimatePresence mode="wait">
              {isGenerating && !hasError && (
                <motion.span
                  key="running"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-amber bg-amber/8 border border-amber/15"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Running
                </motion.span>
              )}
              {allDone && (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-success bg-success/8 border border-success/15"
                >
                  <Sparkles className="w-3 h-3" />
                  Complete
                </motion.span>
              )}
              {hasError && (
                <motion.span
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-error bg-error/8 border border-error/15"
                >
                  <AlertCircle className="w-3 h-3" />
                  Failed
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-border/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full ${
              hasError ? 'bg-error' : allDone ? 'bg-success' : 'bg-gradient-to-r from-amber via-amber/80 to-amber/50'
            }`}
          />
        </div>

        {/* Swimlane labels */}
        <div className="relative px-6 pt-4 pb-1 grid grid-cols-2 gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-muted/60 select-none">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-amber" />
            <span>AI Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-violet" />
            <span>PDF Pipeline</span>
          </div>
        </div>

        {/* ─── React Flow Canvas ──────────────────────────── */}
        <div className="relative" style={{ height: 560 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            fitView
            fitViewOptions={{ padding: 0.18, includeHiddenNodes: false }}
            minZoom={0.55}
            maxZoom={1.35}
            nodesDraggable={false}
            nodesConnectable={false}
            edgesFocusable={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, node) => onNodeClick?.(node.id)}
            defaultEdgeOptions={{ type: 'animated' }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1.2}
              color="rgba(255,159,67,0.08)"
            />
            <Controls
              position="bottom-left"
              showInteractive={false}
            />
            <MiniMap
              position="bottom-right"
              zoomable
              pannable
              nodeColor={(n) => {
                const s = n.data?.status
                if (s === STATUS.RUNNING) return '#FF9F43'
                if (s === STATUS.DONE)   return '#10B981'
                if (s === STATUS.ERROR)  return '#F43F5E'
                return '#3A4258'
              }}
              maskColor="rgba(11,13,17,0.6)"
            />
          </ReactFlow>
        </div>
      </motion.div>
    </section>
  )
}
