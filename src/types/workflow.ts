import type { Node, Edge } from '@xyflow/react'

export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end'

// ─── Per-node config shapes ───────────────────────────────────────────────────

export interface KeyValue {
  id: string
  key: string
  value: string
}

export interface StartConfig {
  title: string
  metadata: KeyValue[]
}

export interface TaskConfig {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValue[]
}

export interface ApprovalConfig {
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutomatedConfig {
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndConfig {
  endMessage: string
  summaryFlag: boolean
}

export type NodeConfig =
  | StartConfig
  | TaskConfig
  | ApprovalConfig
  | AutomatedConfig
  | EndConfig

// ─── React Flow node data ─────────────────────────────────────────────────────

export interface WorkflowNodeData extends Record<string, unknown> {
  kind: NodeKind
  label: string
  config: NodeConfig
}

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

// ─── Mock API types ───────────────────────────────────────────────────────────

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulateRequest {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export type StepStatus = 'success' | 'error' | 'skipped'

export interface SimulateStep {
  nodeId: string
  label: string
  kind: NodeKind
  status: StepStatus
  message: string
  durationMs: number
}

export interface SimulateResult {
  success: boolean
  steps: SimulateStep[]
  errors: string[]
  totalDurationMs: number
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
  nodeId?: string
  message: string
}
