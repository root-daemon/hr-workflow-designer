import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { clsx } from 'clsx'
import type { WorkflowNodeData, NodeKind } from '../../types/workflow'
import { NODE_STYLES } from './nodeStyles'
import { useWorkflowStore } from '../../store/workflowStore'

interface BaseNodeProps {
  id: string
  data: WorkflowNodeData
  selected?: boolean
  showSource?: boolean
  showTarget?: boolean
  children?: React.ReactNode
}

export const BaseNode = memo(function BaseNode({
  id,
  data,
  selected,
  showSource = true,
  showTarget = true,
  children,
}: BaseNodeProps) {
  const style = NODE_STYLES[data.kind as NodeKind]
  const selectNode = useWorkflowStore((s) => s.selectNode)
  const deleteNode = useWorkflowStore((s) => s.deleteNode)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectNode(id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNode(id)
  }

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'relative min-w-[200px] max-w-[260px] rounded-xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-200 cursor-pointer group',
        style.gradient,
        style.border,
        selected && 'ring-2 ring-accent ring-offset-1 ring-offset-canvas'
      )}
    >
      {showTarget && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !border-2 !border-accent !bg-surface"
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <span className="text-base leading-none">{style.icon}</span>
        <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest', style.badge)}>
          {style.badgeText}
        </span>
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-error text-xs leading-none p-0.5 rounded"
          title="Delete node"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <p className="text-sm font-semibold text-white truncate">{data.label}</p>
        {children}
      </div>

      {showSource && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !border-2 !border-accent !bg-surface"
        />
      )}
    </div>
  )
})
