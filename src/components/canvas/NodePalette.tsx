import { NODE_PALETTE, NODE_STYLES } from '../nodes/nodeStyles'
import type { NodeKind } from '../../types/workflow'
import { clsx } from 'clsx'

interface Props {
  onDragStart: (kind: NodeKind) => void
}

export function NodePalette({ onDragStart }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Node Types</h2>
        <p className="text-[11px] text-muted/60 mt-0.5">Drag onto canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {NODE_PALETTE.map(({ kind, description }) => {
          const style = NODE_STYLES[kind]
          return (
            <div
              key={kind}
              draggable
              onDragStart={() => onDragStart(kind)}
              className={clsx(
                'node-palette-item flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-gradient-to-r',
                'hover:scale-[1.02] active:scale-[0.98] transition-all duration-150',
                style.gradient,
                style.border
              )}
            >
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0', style.badge)}>
                {style.icon}
              </div>
              <div className="min-w-0">
                <p className={clsx('text-[11px] font-bold tracking-widest', style.badge.split(' ')[1])}>
                  {style.badgeText}
                </p>
                <p className="text-[11px] text-muted/80 truncate">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-4 py-3 border-t border-border space-y-1">
        <p className="text-[10px] text-muted/50 uppercase tracking-wide">Tips</p>
        <p className="text-[11px] text-muted/70">• Drag nodes to reposition</p>
        <p className="text-[11px] text-muted/70">• Connect via node handles</p>
        <p className="text-[11px] text-muted/70">• Click to configure</p>
        <p className="text-[11px] text-muted/70">• Del key removes selected</p>
      </div>
    </div>
  )
}
