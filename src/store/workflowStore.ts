import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import type {
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react'
import type {
  WorkflowNode,
  WorkflowEdge,
  NodeKind,
  NodeConfig,
  StartConfig,
  TaskConfig,
  ApprovalConfig,
  AutomatedConfig,
  EndConfig,
} from '../types/workflow'

// ─── Default configs ──────────────────────────────────────────────────────────

export const defaultConfig = (kind: NodeKind): NodeConfig => {
  switch (kind) {
    case 'start':
      return { title: 'Start', metadata: [] } satisfies StartConfig
    case 'task':
      return {
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      } satisfies TaskConfig
    case 'approval':
      return {
        title: 'Approval',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      } satisfies ApprovalConfig
    case 'automated':
      return {
        title: 'Automated Step',
        actionId: '',
        actionParams: {},
      } satisfies AutomatedConfig
    case 'end':
      return { endMessage: 'Workflow complete', summaryFlag: false } satisfies EndConfig
  }
}

const labelForKind: Record<NodeKind, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automated: 'Automated',
  end: 'End',
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null

  // Node operations
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (kind: NodeKind, position: { x: number; y: number }) => void
  deleteNode: (id: string) => void
  deleteEdge: (id: string) => void
  updateNodeConfig: (id: string, config: Partial<NodeConfig>) => void
  selectNode: (id: string | null) => void

  // History (undo/redo)
  history: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[]
  historyIndex: number
  pushHistory: () => void
  undo: () => void
  redo: () => void

  // Import/export
  exportWorkflow: () => string
  importWorkflow: (json: string) => void
}

let idCounter = 1
const genId = () => `node_${idCounter++}`

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [
    {
      id: 'node_start',
      type: 'start',
      position: { x: 100, y: 200 },
      data: {
        kind: 'start',
        label: 'Start',
        config: defaultConfig('start'),
      },
    } as WorkflowNode,
  ],
  edges: [],
  selectedNodeId: null,
  history: [],
  historyIndex: -1,

  pushHistory() {
    const { nodes, edges, history, historyIndex } = get()
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(snapshot)
    set({ history: newHistory.slice(-50), historyIndex: newHistory.length - 1 })
  },

  undo() {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1, selectedNodeId: null })
  },

  redo() {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1, selectedNodeId: null })
  },

  onNodesChange(changes) {
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as WorkflowNode[] }))
  },

  onEdgesChange(changes) {
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as WorkflowEdge[] }))
  },

  onConnect(connection) {
    get().pushHistory()
    set((s) => ({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
        s.edges
      ) as WorkflowEdge[],
    }))
  },

  addNode(kind, position) {
    get().pushHistory()
    const id = genId()
    const node: WorkflowNode = {
      id,
      type: kind,
      position,
      data: {
        kind,
        label: labelForKind[kind],
        config: defaultConfig(kind),
      },
    }
    set((s) => ({ nodes: [...s.nodes, node] }))
  },

  deleteNode(id) {
    get().pushHistory()
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }))
  },

  deleteEdge(id) {
    get().pushHistory()
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) }))
  },

  updateNodeConfig(id, patch) {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, config: { ...n.data.config, ...patch } as NodeConfig } }
          : n
      ),
    }))
  },

  selectNode(id) {
    set({ selectedNodeId: id })
  },

  exportWorkflow() {
    const { nodes, edges } = get()
    return JSON.stringify({ nodes, edges }, null, 2)
  },

  importWorkflow(json) {
    try {
      const { nodes, edges } = JSON.parse(json)
      get().pushHistory()
      set({ nodes, edges, selectedNodeId: null })
    } catch {
      // silently ignore invalid JSON
    }
  },
}))
