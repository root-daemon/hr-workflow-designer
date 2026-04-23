import type { NodeKind } from '../../types/workflow'

export interface NodeStyle {
  gradient: string
  border: string
  icon: string
  badge: string
  badgeText: string
}

export const NODE_STYLES: Record<NodeKind, NodeStyle> = {
  start: {
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/50',
    icon: '▶',
    badge: 'bg-emerald-500/20 text-emerald-400',
    badgeText: 'START',
  },
  task: {
    gradient: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/50',
    icon: '✓',
    badge: 'bg-blue-500/20 text-blue-400',
    badgeText: 'TASK',
  },
  approval: {
    gradient: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/50',
    icon: '◆',
    badge: 'bg-amber-500/20 text-amber-400',
    badgeText: 'APPROVAL',
  },
  automated: {
    gradient: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/50',
    icon: '⚡',
    badge: 'bg-purple-500/20 text-purple-400',
    badgeText: 'AUTO',
  },
  end: {
    gradient: 'from-rose-500/20 to-rose-600/10',
    border: 'border-rose-500/50',
    icon: '■',
    badge: 'bg-rose-500/20 text-rose-400',
    badgeText: 'END',
  },
}

export const NODE_PALETTE: { kind: NodeKind; description: string }[] = [
  { kind: 'start', description: 'Workflow entry point' },
  { kind: 'task', description: 'Human task / action' },
  { kind: 'approval', description: 'Manager approval step' },
  { kind: 'automated', description: 'System-triggered action' },
  { kind: 'end', description: 'Workflow completion' },
]
