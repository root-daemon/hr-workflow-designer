import type { TaskConfig } from '../../types/workflow'
import { KeyValueEditor } from './KeyValueEditor'

interface Props {
  config: TaskConfig
  onChange: (patch: Partial<TaskConfig>) => void
}

export function TaskNodeForm({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title <span className="text-error">*</span></label>
        <input
          className="form-input"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Task title"
          required
        />
        {!config.title && (
          <p className="text-[11px] text-error mt-1">Title is required</p>
        )}
      </div>
      <div>
        <label className="form-label">Description</label>
        <textarea
          className="form-input resize-none h-20"
          value={config.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe what needs to be done..."
        />
      </div>
      <div>
        <label className="form-label">Assignee</label>
        <input
          className="form-input"
          value={config.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="Name or email"
        />
      </div>
      <div>
        <label className="form-label">Due Date</label>
        <input
          type="date"
          className="form-input"
          value={config.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>
      <KeyValueEditor
        label="Custom Fields"
        values={config.customFields}
        onChange={(customFields) => onChange({ customFields })}
      />
    </div>
  )
}
