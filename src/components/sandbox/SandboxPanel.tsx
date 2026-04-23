import { useState } from 'react'
import { clsx } from 'clsx'
import { useWorkflowStore } from '../../store/workflowStore'
import { simulateWorkflow } from '../../api/mockApi'
import type { SimulateResult, SimulateStep } from '../../types/workflow'

interface Props {
  onClose: () => void
}

const STATUS_COLORS = {
  success: 'text-success bg-success/10 border-success/30',
  error: 'text-error bg-error/10 border-error/30',
  skipped: 'text-muted bg-muted/10 border-muted/20',
}

const STATUS_ICONS = { success: '✓', error: '✕', skipped: '○' }

const KIND_ICONS: Record<string, string> = {
  start: '▶',
  task: '✓',
  approval: '◆',
  automated: '⚡',
  end: '■',
}

export function SandboxPanel({ onClose }: Props) {
  const { nodes, edges } = useWorkflowStore()
  const [result, setResult] = useState<SimulateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'simulate' | 'json'>('simulate')
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const handleSimulate = async () => {
    setLoading(true)
    setResult(null)
    setActiveStep(null)
    try {
      const res = await simulateWorkflow({ nodes, edges })
      setResult(res)
      // Animate steps sequentially
      for (let i = 0; i < res.steps.length; i++) {
        await new Promise((r) => setTimeout(r, 300 + res.steps[i].durationMs * 0.15))
        setActiveStep(i)
      }
    } finally {
      setLoading(false)
    }
  }

  const workflowJson = useWorkflowStore.getState().exportWorkflow()

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg">⚗️</span>
          <div>
            <h3 className="text-sm font-semibold text-white">Workflow Sandbox</h3>
            <p className="text-[11px] text-muted">{nodes.length} nodes · {edges.length} connections</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(['simulate', 'json'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  activeTab === tab ? 'bg-accent text-white' : 'text-muted hover:text-white'
                )}
              >
                {tab === 'simulate' ? '▶ Simulate' : '{ } JSON'}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors p-1.5 rounded hover:bg-surface"
          >
            ✕
          </button>
        </div>
      </div>

      {activeTab === 'simulate' ? (
        <div className="flex flex-1 min-h-0 gap-0">
          {/* Left: run + results */}
          <div className="flex-1 flex flex-col min-h-0 p-4">
            <button
              onClick={handleSimulate}
              disabled={loading}
              className={clsx(
                'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all mb-4 shrink-0',
                loading
                  ? 'bg-accent/50 text-white/50 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating…
                </span>
              ) : (
                '▶  Run Workflow Simulation'
              )}
            </button>

            {/* Errors */}
            {result && result.errors.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 shrink-0">
                <p className="text-xs font-semibold text-error mb-1">Validation Errors</p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-error/80">• {e}</p>
                ))}
              </div>
            )}

            {/* Steps */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-4xl mb-3">⚗️</p>
                  <p className="text-sm text-white/60">Run the simulation to see step-by-step execution</p>
                  <p className="text-xs text-muted mt-1">Validates graph structure and simulates each node</p>
                </div>
              )}
              {result?.steps.map((step, i) => (
                <StepCard
                  key={step.nodeId}
                  step={step}
                  index={i}
                  visible={activeStep !== null && i <= activeStep}
                />
              ))}
            </div>

            {/* Summary */}
            {result && !loading && (
              <div className={clsx(
                'mt-3 p-3 rounded-lg border text-xs shrink-0',
                result.success
                  ? 'bg-success/10 border-success/30 text-success'
                  : 'bg-error/10 border-error/30 text-error'
              )}>
                <span className="font-semibold">
                  {result.success ? '✓ Simulation succeeded' : '✕ Simulation failed'}
                </span>
                <span className="text-muted ml-2">
                  {result.steps.length} steps · {result.totalDurationMs}ms total
                </span>
              </div>
            )}
          </div>

          {/* Right: step detail */}
          {activeStep !== null && result?.steps[activeStep] && (
            <div className="w-64 border-l border-border p-4 flex flex-col gap-3 overflow-y-auto shrink-0">
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Step Detail</p>
              <StepDetail step={result.steps[activeStep]} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-[11px] text-emerald-400/80 font-mono leading-relaxed bg-canvas rounded-lg p-3 border border-border overflow-x-auto">
            {workflowJson}
          </pre>
        </div>
      )}
    </div>
  )
}

function StepCard({ step, index, visible }: { step: SimulateStep; index: number; visible: boolean }) {
  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-3 rounded-lg border transition-all duration-300',
        STATUS_COLORS[step.status],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
        <span className="text-sm font-bold">{STATUS_ICONS[step.status]}</span>
        <span className="text-[10px] opacity-60">{index + 1}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm">{KIND_ICONS[step.kind] ?? '•'}</span>
          <span className="text-xs font-semibold truncate">{step.label}</span>
        </div>
        <p className="text-[11px] opacity-80 leading-relaxed">{step.message}</p>
        <p className="text-[10px] opacity-50 mt-0.5">{step.durationMs}ms</p>
      </div>
    </div>
  )
}

function StepDetail({ step }: { step: SimulateStep }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="form-label">Node</p>
        <p className="text-sm text-white font-medium">{step.label}</p>
      </div>
      <div>
        <p className="form-label">Type</p>
        <p className="text-sm text-white capitalize">{step.kind}</p>
      </div>
      <div>
        <p className="form-label">Status</p>
        <span className={clsx('text-xs px-2 py-0.5 rounded border font-medium', STATUS_COLORS[step.status])}>
          {step.status}
        </span>
      </div>
      <div>
        <p className="form-label">Message</p>
        <p className="text-xs text-muted leading-relaxed">{step.message}</p>
      </div>
      <div>
        <p className="form-label">Duration</p>
        <p className="text-sm text-white">{step.durationMs}ms</p>
      </div>
      <div>
        <p className="form-label">Node ID</p>
        <p className="text-[11px] text-muted font-mono break-all">{step.nodeId}</p>
      </div>
    </div>
  )
}
