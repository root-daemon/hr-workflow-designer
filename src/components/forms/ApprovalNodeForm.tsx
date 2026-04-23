import type { ApprovalConfig } from '../../types/workflow'

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite', 'Legal']

interface Props {
  config: ApprovalConfig
  onChange: (patch: Partial<ApprovalConfig>) => void
}

export function ApprovalNodeForm({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Approval step title"
        />
      </div>
      <div>
        <label className="form-label">Approver Role</label>
        <select
          className="form-input"
          value={config.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value })}
        >
          {APPROVER_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label">Auto-Approve Threshold</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="form-input"
            value={config.autoApproveThreshold}
            min={0}
            onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })}
            placeholder="0 = disabled"
          />
          <span className="text-xs text-muted whitespace-nowrap">days</span>
        </div>
        <p className="text-[11px] text-muted/60 mt-1">
          Auto-approve if no response within this many days. 0 = disabled.
        </p>
      </div>
    </div>
  )
}
