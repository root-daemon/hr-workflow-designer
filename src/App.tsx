import { useState, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { clsx } from 'clsx'

import { Toolbar } from './components/ui/Toolbar'
import { NodePalette } from './components/canvas/NodePalette'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { NodeFormPanel } from './components/forms/NodeFormPanel'
import { SandboxPanel } from './components/sandbox/SandboxPanel'
import { useWorkflowStore } from './store/workflowStore'
import type { NodeKind } from './types/workflow'

export default function App() {
  const [draggedKind, setDraggedKind] = useState<NodeKind | null>(null)
  const [sandboxOpen, setSandboxOpen] = useState(false)
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)

  const handleDragStart = useCallback((kind: NodeKind) => {
    setDraggedKind(kind)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedKind(null)
  }, [])

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-canvas">
        <Toolbar onOpenSandbox={() => setSandboxOpen((v) => !v)} sandboxOpen={sandboxOpen} />

        <div className="flex flex-1 min-h-0">
          {/* Left: Node Palette */}
          <aside className="w-52 shrink-0 border-r border-border bg-surface flex flex-col">
            <NodePalette onDragStart={handleDragStart} />
          </aside>

          {/* Center: Canvas */}
          <main className="flex-1 relative min-w-0">
            <WorkflowCanvas draggedKind={draggedKind} onDragEnd={handleDragEnd} />

            {/* Sandbox slide-up panel */}
            {sandboxOpen && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border"
                style={{ height: '55%' }}
              >
                <SandboxPanel onClose={() => setSandboxOpen(false)} />
              </div>
            )}
          </main>

          {/* Right: Config Panel */}
          <aside
            className={clsx(
              'shrink-0 border-l border-border bg-surface flex flex-col transition-all duration-200',
              selectedNodeId ? 'w-72' : 'w-64'
            )}
          >
            <NodeFormPanel />
          </aside>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
