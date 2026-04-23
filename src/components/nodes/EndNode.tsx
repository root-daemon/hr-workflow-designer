import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import type { WorkflowNodeData, EndConfig } from '../../types/workflow'

export const EndNode = memo(function EndNode({ id, data, selected }: NodeProps) {
  const cfg = data.config as EndConfig
  return (
    <BaseNode id={id} data={data as WorkflowNodeData} selected={selected} showSource={false}>
      <p className="text-xs text-muted mt-0.5 truncate">{cfg.endMessage}</p>
      {cfg.summaryFlag && (
        <span className="mt-2 inline-block text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">
          Summary enabled
        </span>
      )}
    </BaseNode>
  )
})
