import type { AutomationAction, SimulateRequest, SimulateResult, SimulateStep } from '../types/workflow'

// ─── GET /automations ─────────────────────────────────────────────────────────

export const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'priority'] },
  { id: 'slack_notify', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_account', label: 'Create System Account', params: ['username', 'role', 'department'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'title', 'duration'] },
]

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300)
  return MOCK_AUTOMATIONS
}

// ─── POST /simulate ───────────────────────────────────────────────────────────

export async function simulateWorkflow(req: SimulateRequest): Promise<SimulateResult> {
  await delay(800)

  const { nodes, edges } = req
  const errors: string[] = []

  // Validation
  const startNodes = nodes.filter((n) => n.data.kind === 'start')
  const endNodes = nodes.filter((n) => n.data.kind === 'end')

  if (startNodes.length === 0) errors.push('Workflow must have a Start node')
  if (startNodes.length > 1) errors.push('Workflow can only have one Start node')
  if (endNodes.length === 0) errors.push('Workflow must have an End node')

  // Check for disconnected nodes
  const connectedIds = new Set<string>()
  edges.forEach((e) => {
    connectedIds.add(e.source)
    connectedIds.add(e.target)
  })
  const disconnected = nodes.filter(
    (n) => !connectedIds.has(n.id) && nodes.length > 1
  )
  if (disconnected.length > 0) {
    errors.push(
      `Disconnected nodes: ${disconnected.map((n) => n.data.label).join(', ')}`
    )
  }

  if (errors.length > 0) {
    return { success: false, steps: [], errors, totalDurationMs: 0 }
  }

  // Topological sort
  const ordered = topologicalSort(nodes, edges)
  const steps: SimulateStep[] = ordered.map((node) => {
    const dur = Math.floor(Math.random() * 800) + 200
    const status = Math.random() > 0.1 ? 'success' : 'error'

    const messages: Record<string, string> = {
      start: `Workflow initiated: "${(node.data.config as { title?: string }).title ?? 'Start'}"`,
      task: `Task "${(node.data.config as { title?: string }).title}" assigned to "${(node.data.config as { assignee?: string }).assignee || 'Unassigned'}"`,
      approval: `Approval request sent to "${(node.data.config as { approverRole?: string }).approverRole || 'Manager'}"`,
      automated: `Executed action "${(node.data.config as { actionId?: string }).actionId || 'none'}"`,
      end: `Workflow completed: "${(node.data.config as { endMessage?: string }).endMessage || 'Done'}"`,
    }

    return {
      nodeId: node.id,
      label: node.data.label as string,
      kind: node.data.kind,
      status: status as 'success' | 'error',
      message: messages[node.data.kind] ?? 'Step executed',
      durationMs: dur,
    } satisfies SimulateStep
  })

  const total = steps.reduce((s, step) => s + step.durationMs, 0)
  const hasError = steps.some((s) => s.status === 'error')

  return {
    success: !hasError,
    steps,
    errors: hasError ? ['One or more steps failed during simulation'] : [],
    totalDurationMs: total,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

function topologicalSort(
  nodes: SimulateRequest['nodes'],
  edges: SimulateRequest['edges']
): SimulateRequest['nodes'] {
  const adj: Record<string, string[]> = {}
  const inDegree: Record<string, number> = {}

  nodes.forEach((n) => {
    adj[n.id] = []
    inDegree[n.id] = 0
  })

  edges.forEach((e) => {
    adj[e.source]?.push(e.target)
    if (inDegree[e.target] !== undefined) inDegree[e.target]++
  })

  const queue = nodes.filter((n) => inDegree[n.id] === 0)
  const sorted: SimulateRequest['nodes'] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    sorted.push(node)
    for (const neighborId of adj[node.id] ?? []) {
      inDegree[neighborId]--
      if (inDegree[neighborId] === 0) {
        const neighbor = nodes.find((n) => n.id === neighborId)
        if (neighbor) queue.push(neighbor)
      }
    }
  }

  // If cycle detected, return original order
  return sorted.length === nodes.length ? sorted : nodes
}
