import { useState, useRef } from 'react'
import { clsx } from 'clsx'
import { useWorkflowStore } from '../../store/workflowStore'

interface Props {
  onOpenSandbox: () => void
  sandboxOpen: boolean
}

export function Toolbar({ onOpenSandbox, sandboxOpen }: Props) {
  const { undo, redo, history, historyIndex, exportWorkflow, importWorkflow } = useWorkflowStore()
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleExport = () => {
    const json = exportWorkflow()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(exportWorkflow())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const json = ev.target?.result as string
      importWorkflow(json)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border shrink-0">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold">
          T
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">HR Workflow Designer</p>
          <p className="text-[10px] text-muted mt-0.5">Tredence Studio</p>
        </div>
      </div>

      {/* Center: node/edge count */}
      <NodeStats />

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={clsx(
            'p-1.5 rounded text-xs transition-colors',
            canUndo ? 'text-muted hover:text-white hover:bg-card' : 'text-muted/30 cursor-not-allowed'
          )}
        >
          ↩
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={clsx(
            'p-1.5 rounded text-xs transition-colors',
            canRedo ? 'text-muted hover:text-white hover:bg-card' : 'text-muted/30 cursor-not-allowed'
          )}
        >
          ↪
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Import */}
        <button
          onClick={() => fileRef.current?.click()}
          title="Import workflow JSON"
          className="p-1.5 rounded text-xs text-muted hover:text-white hover:bg-card transition-colors"
        >
          ↑ Import
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        {/* Export */}
        <button
          onClick={handleExport}
          title="Export workflow as JSON"
          className="p-1.5 rounded text-xs text-muted hover:text-white hover:bg-card transition-colors"
        >
          ↓ Export
        </button>

        {/* Copy JSON */}
        <button
          onClick={handleCopyJson}
          className="p-1.5 rounded text-xs text-muted hover:text-white hover:bg-card transition-colors"
        >
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Sandbox */}
        <button
          onClick={onOpenSandbox}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            sandboxOpen
              ? 'bg-accent text-white'
              : 'bg-accent/20 text-accent hover:bg-accent hover:text-white border border-accent/30'
          )}
        >
          ⚗ Test Workflow
        </button>
      </div>
    </div>
  )
}

function NodeStats() {
  const { nodes, edges } = useWorkflowStore()
  const kinds = nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.data.kind as string] = (acc[n.data.kind as string] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex items-center gap-3 text-[11px]">
      {Object.entries(kinds).map(([kind, count]) => (
        <span key={kind} className="text-muted capitalize">
          <span className="text-white font-medium">{count}</span> {kind}
        </span>
      ))}
      <span className="text-muted">
        <span className="text-white font-medium">{edges.length}</span> edge{edges.length !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
