# HR Workflow Designer

A visual drag-and-drop workflow builder for HR processes — built for the Tredence Studio Full Stack Engineering Internship case study.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

## Architecture

```
src/
├── api/
│   └── mockApi.ts          # GET /automations, POST /simulate — pure in-memory mocks
├── components/
│   ├── canvas/
│   │   ├── NodePalette.tsx  # Left sidebar — draggable node types
│   │   └── WorkflowCanvas.tsx  # React Flow canvas with drop handling
│   ├── forms/
│   │   ├── NodeFormPanel.tsx   # Renders the correct form for the selected node
│   │   ├── StartNodeForm.tsx
│   │   ├── TaskNodeForm.tsx
│   │   ├── ApprovalNodeForm.tsx
│   │   ├── AutomatedNodeForm.tsx
│   │   ├── EndNodeForm.tsx
│   │   └── KeyValueEditor.tsx  # Reusable key-value pair editor
│   ├── nodes/
│   │   ├── BaseNode.tsx     # Shared node shell (handles, delete button, styling)
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   ├── EndNode.tsx
│   │   └── nodeStyles.ts   # Centralised color/icon/badge config per node type
│   ├── sandbox/
│   │   └── SandboxPanel.tsx  # Simulation runner + step timeline
│   └── ui/
│       └── Toolbar.tsx     # Top bar — undo/redo, import/export, sandbox toggle
├── store/
│   └── workflowStore.ts    # Zustand store — all workflow state + history
└── types/
    └── workflow.ts          # All TypeScript interfaces
```

### Key design decisions

**State — Zustand over Context/Redux**
All workflow state (nodes, edges, selectedNodeId, history) lives in a single Zustand store. Components subscribe with fine-grained selectors so only what changed re-renders. No prop drilling.

**Node forms — open/closed extension pattern**
`NodeFormPanel` dispatches on `node.data.kind` to mount the correct form component. Adding a new node type is three steps: add the type to `NodeKind`, write a `XxxNodeForm`, and add one case in `NodeFormPanel`. Nothing else changes.

**Mock API — pure functions, no network**
`mockApi.ts` exports async functions (`getAutomations`, `simulateWorkflow`) that resolve after a small artificial delay. They're trivially replaceable with real `fetch` calls — the call sites don't change.

**Simulation — topological sort**
The sandbox panel runs Kahn's algorithm BFS to execute nodes in dependency order. Cycles fall back to insertion order. Validation catches: missing Start/End nodes, multiple Start nodes, disconnected nodes.

**Undo/Redo — snapshot history**
Every mutating action calls `pushHistory()` before changing state. The history ring holds up to 50 snapshots.

## Features

| Feature | Status |
|---|---|
| Drag-and-drop canvas | ✓ |
| 5 custom node types | ✓ |
| Node config forms | ✓ |
| Dynamic action params (Automated node) | ✓ |
| Mock API (`/automations`) | ✓ |
| Workflow simulation (`/simulate`) | ✓ |
| Step-by-step execution log | ✓ |
| Graph validation (cycles, disconnected, missing nodes) | ✓ |
| Undo / Redo (50 steps) | ✓ |
| Export workflow as JSON | ✓ |
| Import workflow from JSON | ✓ |
| Copy JSON to clipboard | ✓ |
| MiniMap + zoom controls | ✓ |
| Delete nodes/edges | ✓ |

## What I'd add with more time

- **Persistent storage** — `localStorage` autosave or real PostgreSQL backend
- **Workflow templates** — pre-built onboarding / leave approval flows
- **Visual validation errors** — red outline on invalid nodes before simulation
- **Global keyboard shortcuts** — Ctrl+Z undo, Ctrl+S save, Ctrl+D duplicate
- **Auto-layout** — Dagre/ELK-based layout on import
- **E2E tests** — Playwright covering drag-drop, form editing, simulation
- **Unit tests** — Jest + RTL for store actions and form components

## Tech Stack

- **React 19 + TypeScript** — strict mode, full type safety
- **Vite** — sub-second HMR
- **React Flow (@xyflow/react)** — canvas, handles, minimap
- **Zustand** — global state with snapshot-based undo history
- **Tailwind CSS v3** — dark design system
- **clsx** — conditional className composition
