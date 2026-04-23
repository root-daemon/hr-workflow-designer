import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import type { WorkflowNodeData, AutomatedConfig } from '../../types/workflow'
import { MOCK_AUTOMATIONS } from '../../api/mockApi'

export const AutomatedNode = memo(function AutomatedNode({ id, data, selected }: NodeProps) {
  const cfg = data.config as AutomatedConfig
  const action = MOCK_AUTOMATIONS.find((a) => a.id === cfg.actionId)
  return (
    <BaseNode id={id} data={data as WorkflowNodeData} selected={selected}>
      <p className="text-xs text-muted mt-0.5">{cfg.title}</p>
      {action && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[11px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
            {action.label}
          </span>
        </div>
      )}
    </BaseNode>
  )
})
