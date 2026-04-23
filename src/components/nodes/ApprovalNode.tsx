import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import type { WorkflowNodeData, ApprovalConfig } from '../../types/workflow'

export const ApprovalNode = memo(function ApprovalNode({ id, data, selected }: NodeProps) {
  const cfg = data.config as ApprovalConfig
  return (
    <BaseNode id={id} data={data as WorkflowNodeData} selected={selected}>
      <p className="text-xs text-muted mt-0.5">{cfg.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
          {cfg.approverRole}
        </span>
        {cfg.autoApproveThreshold > 0 && (
          <span className="text-[10px] text-muted">Auto ≥{cfg.autoApproveThreshold}</span>
        )}
      </div>
    </BaseNode>
  )
})
