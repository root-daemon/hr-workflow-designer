import { useWorkflowStore } from '../../store/workflowStore'
import { StartNodeForm } from './StartNodeForm'
import { TaskNodeForm } from './TaskNodeForm'
import { ApprovalNodeForm } from './ApprovalNodeForm'
import { AutomatedNodeForm } from './AutomatedNodeForm'
import { EndNodeForm } from './EndNodeForm'
import { NODE_STYLES } from '../nodes/nodeStyles'
import type {
  NodeKind,
  NodeConfig,
  StartConfig,
  TaskConfig,
  ApprovalConfig,
  AutomatedConfig,
  EndConfig,
} from '../../types/workflow'

export function NodeFormPanel() {
  const { nodes, selectedNodeId, updateNodeConfig, selectNode, deleteNode } = useWorkflowStore()
  const node = nodes.find((n) => n.id === selectedNodeId)

  if (!node) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-3 text-2xl">
          ✦
        </div>
        <p className="text-sm font-medium text-white/80 mb-1">No node selected</p>
        <p className="text-xs text-muted">Click any node on the canvas to configure it</p>
      </div>
    )
  }

  const { kind, label } = node.data
  const style = NODE_STYLES[kind as NodeKind]

  const handleChange = (patch: Partial<NodeConfig>) => {
    updateNodeConfig(node.id, patch)
    // Keep label in sync with title field if present
    const newTitle = (patch as { title?: string }).title
    if (newTitle !== undefined) {
      useWorkflowStore.setState((s) => ({
        nodes: s.nodes.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: newTitle || n.data.label } } : n
        ),
      }))
    }
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-border bg-gradient-to-r ${style.gradient}`}>
        <div className="flex items-center gap-2 mb-1">
          <span>{style.icon}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest ${style.badge}`}>
            {style.badgeText}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{label as string}</h3>
          <button
            onClick={() => { deleteNode(node.id); selectNode(null) }}
            className="text-xs text-muted hover:text-error transition-colors px-2 py-1 rounded hover:bg-error/10"
          >
            Delete
          </button>
        </div>
        <p className="text-[11px] text-muted mt-0.5 font-mono">{node.id}</p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        {kind === 'start' && (
          <StartNodeForm
            config={node.data.config as StartConfig}
            onChange={handleChange}
          />
        )}
        {kind === 'task' && (
          <TaskNodeForm
            config={node.data.config as TaskConfig}
            onChange={handleChange}
          />
        )}
        {kind === 'approval' && (
          <ApprovalNodeForm
            config={node.data.config as ApprovalConfig}
            onChange={handleChange}
          />
        )}
        {kind === 'automated' && (
          <AutomatedNodeForm
            config={node.data.config as AutomatedConfig}
            onChange={handleChange}
          />
        )}
        {kind === 'end' && (
          <EndNodeForm
            config={node.data.config as EndConfig}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={() => selectNode(null)}
          className="w-full text-xs text-muted hover:text-white transition-colors py-1.5 rounded border border-border hover:border-accent/50"
        >
          Close Panel
        </button>
      </div>
    </div>
  )
}
