import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import type { WorkflowNodeData, TaskConfig } from '../../types/workflow'

export const TaskNode = memo(function TaskNode({ id, data, selected }: NodeProps) {
  const cfg = data.config as TaskConfig
  return (
    <BaseNode id={id} data={data as WorkflowNodeData} selected={selected}>
      <p className="text-xs text-muted mt-0.5">{cfg.title}</p>
      {cfg.assignee && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-blue-500/30 flex items-center justify-center text-[9px] text-blue-400 font-bold">
            {cfg.assignee[0]?.toUpperCase()}
          </div>
          <span className="text-[11px] text-muted truncate">{cfg.assignee}</span>
        </div>
      )}
      {cfg.dueDate && (
        <p className="text-[10px] text-muted/60 mt-1">Due: {cfg.dueDate}</p>
      )}
    </BaseNode>
  )
})
