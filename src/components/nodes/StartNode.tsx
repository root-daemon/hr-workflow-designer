import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import type { WorkflowNodeData, StartConfig } from '../../types/workflow'

export const StartNode = memo(function StartNode({ id, data, selected }: NodeProps) {
  const cfg = data.config as StartConfig
  return (
    <BaseNode id={id} data={data as WorkflowNodeData} selected={selected} showTarget={false}>
      <p className="text-xs text-muted mt-0.5">{cfg.title}</p>
      {cfg.metadata.length > 0 && (
        <p className="text-[10px] text-muted/60 mt-1">{cfg.metadata.length} metadata field{cfg.metadata.length !== 1 ? 's' : ''}</p>
      )}
    </BaseNode>
  )
})
