import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  SelectionMode,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useWorkflowStore } from '../../store/workflowStore'
import { StartNode } from '../nodes/StartNode'
import { TaskNode } from '../nodes/TaskNode'
import { ApprovalNode } from '../nodes/ApprovalNode'
import { AutomatedNode } from '../nodes/AutomatedNode'
import { EndNode } from '../nodes/EndNode'
import type { NodeKind } from '../../types/workflow'

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
}

interface Props {
  draggedKind: NodeKind | null
  onDragEnd: () => void
}

export function WorkflowCanvas({ draggedKind, onDragEnd }: Props) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    deleteEdge,
  } = useWorkflowStore()

  const { screenToFlowPosition } = useReactFlow()
  const dropRef = useRef<HTMLDivElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!draggedKind) return

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      addNode(draggedKind, position)
      onDragEnd()
    },
    [draggedKind, screenToFlowPosition, addNode, onDragEnd]
  )

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handlePaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      if (confirm('Delete this connection?')) deleteEdge(edge.id)
    },
    [deleteEdge]
  )

  return (
    <div ref={dropRef} className="w-full h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onEdgeClick={handleEdgeClick}
        selectionMode={SelectionMode.Partial}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode="Delete"
        minZoom={0.2}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#2e3347" />
        <Controls className="!bg-surface !border-border" />
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#22c55e',
              task: '#3b82f6',
              approval: '#f59e0b',
              automated: '#a855f7',
              end: '#ef4444',
            }
            return colors[node.type ?? ''] ?? '#6366f1'
          }}
          maskColor="rgba(15, 17, 23, 0.7)"
        />
      </ReactFlow>
    </div>
  )
}
